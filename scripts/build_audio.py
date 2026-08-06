#!/usr/bin/env python3
"""
Renders every narration item to MP3 with Piper, so the app can play real audio
files instead of speech synthesis.

This is what makes listening work with the screen locked: iOS suspends the Web
Speech API the moment the phone locks, but it will happily keep an <audio>
element playing in the background.

    python3 scripts/build_audio.py

Writes public/audio/<CELL>-<index>.mp3 and src/content/audio.ts (the manifest of
clip durations). Piper and the voice model are downloaded on first run into
.audio-build/, which is gitignored — they are ~150 MB and not worth committing.

The spoken text must match what src/lib/tts.ts would have said, so the fallback
path and the recordings never disagree.
"""
import hashlib
import json
import os
import pathlib
import re
import subprocess
import sys
import tarfile
import urllib.request
import wave

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUILD = ROOT / '.audio-build'
OUT = ROOT / 'public' / 'audio'

VOICE = 'en-us-ryan-high'
PIPER_URL = 'https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_amd64.tar.gz'
VOICE_URL = f'https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-{VOICE}.tar.gz'

# Mirrors SPOKEN_PREFIX in src/lib/content.ts.
PREFIX = {
    'concept': 'Concept.',
    'memorize': 'Memorize this.',
    'trap': 'Exam trap.',
    'link': 'Connection.',
    'warn': 'Source note.',
    'frame': 'The answer framework.',
    'locus': 'Your locus.',
    'refs': 'Second angles — the same material in your other books.',
}


def literal(path: pathlib.Path, decl: str):
    """Pull the JSON literal out of one of the generated TS modules."""
    src = path.read_text()
    start = src.index(decl) + len(decl)
    return json.loads(src[start:].strip())


def fetch(url: str, dest: pathlib.Path):
    if dest.exists():
        return
    print(f'  downloading {dest.name} …', flush=True)
    dest.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(url, dest)


def ensure_piper() -> tuple[pathlib.Path, pathlib.Path]:
    piper_bin = BUILD / 'piper' / 'piper'
    model = BUILD / 'voices' / f'{VOICE}.onnx'
    if not piper_bin.exists():
        tgz = BUILD / 'piper.tar.gz'
        fetch(PIPER_URL, tgz)
        with tarfile.open(tgz) as t:
            t.extractall(BUILD)
    if not model.exists():
        tgz = BUILD / f'voice-{VOICE}.tar.gz'
        fetch(VOICE_URL, tgz)
        (BUILD / 'voices').mkdir(parents=True, exist_ok=True)
        with tarfile.open(tgz) as t:
            t.extractall(BUILD / 'voices')
    return piper_bin, model


def spoken(kind: str, text: str) -> str:
    """The exact string src/lib/tts.ts would have spoken."""
    # Substitute before splitting, exactly as content.ts does — 'A·B·C' becomes
    # three spoken letters, not one unpronounceable word.
    prose = text.replace('·', '; ').replace('§', 'section ')
    words = [w for w in re.split(r'\s+', prose) if w]
    label = PREFIX.get(kind, '')
    return (label + ' ' if label else '') + ' '.join(words)


def narration_items():
    """Mirrors cellItems() in src/lib/content.ts: locus, cards, framework, refs.

    The order matters as much as the text — a clip is addressed by its index, so
    a sequence that disagrees with the app's plays the wrong words under the
    wrong card.
    """
    textbook = literal(ROOT / 'src/content/textbook.ts', 'export const TEXTBOOK: Textbook =')
    frames = literal(ROOT / 'src/data/frames.ts', 'export const FRAMES: Record<CellId, Frame> =')
    loci = literal(ROOT / 'src/data/loci.ts', 'export const LOCI: Record<ChapterCode, Room> =')

    for chapter in textbook['chapters']:
        room = loci.get(chapter['code'])
        for cell in chapter['cells']:
            items = []
            if room:
                spot, img = room['spots'][int(cell['id'].split('-')[1]) - 1]
                items.append(('locus', f"{room['room']}. {spot}. {img}"))
            items += [(it['t'], it['x']) for it in cell['items']]
            frame = frames.get(cell['id'])
            if frame:
                bullets = ' '.join(f'{b} {r}' for b, r in frame['bullets'])
                items.append(('frame', f"{frame['head']}. {frame['intro']} {bullets} {frame['tail']}"))
            if cell['refs']:
                items.append(('refs', '. '.join(cell['refs'])))
            yield cell['id'], items


def encode(wav_path: pathlib.Path, mp3_path: pathlib.Path) -> float:
    import lameenc

    with wave.open(str(wav_path), 'rb') as w:
        frames = w.getnframes()
        pcm = w.readframes(frames)
        rate, channels = w.getframerate(), w.getnchannels()

    enc = lameenc.Encoder()
    enc.set_bit_rate(48)
    enc.set_in_sample_rate(rate)
    enc.set_channels(channels)
    enc.set_quality(2)
    mp3_path.write_bytes(bytes(enc.encode(pcm) + enc.flush()))
    return frames / rate


def main() -> int:
    env = dict(os.environ)
    OUT.mkdir(parents=True, exist_ok=True)
    tmp_wav = BUILD / 'clip.wav'

    # Rendering is idempotent: every clip is stamped with a hash of the words it
    # says, so a re-run only re-renders what actually changed. That is what lets
    # the deploy run this on every push — a cache hit costs a few seconds and
    # still rewrites audio.ts, instead of leaving a stale manifest behind that
    # points clips at the wrong cards.
    cache_path = OUT / 'manifest.json'
    cache: dict[str, dict] = {}
    if cache_path.exists():
        try:
            cache = json.loads(cache_path.read_text())
        except ValueError:
            pass

    plan = []
    for cell_id, items in narration_items():
        for index, (kind, text) in enumerate(items):
            words = spoken(kind, text)
            plan.append(
                (
                    f'{cell_id}-{index}',
                    cell_id,
                    words,
                    hashlib.sha1(words.encode()).hexdigest()[:16],
                )
            )

    def fresh(key: str, digest: str) -> bool:
        entry = cache.get(key)
        return bool(entry) and entry.get('h') == digest and (OUT / f'{key}.mp3').exists()

    todo = [p for p in plan if not fresh(p[0], p[3])]
    print(f'{len(plan)} clips · {len(todo)} to render, {len(plan) - len(todo)} already current', flush=True)

    if todo:
        piper_bin, model = ensure_piper()
        env['LD_LIBRARY_PATH'] = str(piper_bin.parent)
        for done, (key, _cell, words, digest) in enumerate(todo, 1):
            result = subprocess.run(
                [str(piper_bin), '--model', str(model), '--output_file', str(tmp_wav)],
                input=words.encode(),
                env=env,
                capture_output=True,
            )
            if result.returncode != 0:
                print(f'FAILED {key}: {result.stderr.decode()[:200]}', file=sys.stderr)
                return 1
            secs = encode(tmp_wav, OUT / f'{key}.mp3')
            cache[key] = {'d': round(secs, 2), 'h': digest}
            if done % 25 == 0 or done == len(todo):
                # Checkpoint the stamps as we go: a run that dies at clip 400 —
                # or a CI job that times out — should resume, not start over.
                cache_path.write_text(json.dumps(cache, indent=0, sort_keys=True))
                print(f'  {done}/{len(todo)} rendered', flush=True)

    # Anything the content no longer asks for: drop it, so a renamed or deleted
    # card cannot leave a clip behind for the next index to collide with.
    live = {key for key, *_ in plan}
    for mp3 in OUT.glob('*.mp3'):
        if mp3.stem not in live:
            mp3.unlink()
            cache.pop(mp3.stem, None)

    manifest: dict[str, list[float]] = {}
    for key, cell_id, _words, _digest in plan:
        manifest.setdefault(cell_id, []).append(cache[key]['d'])

    cache_path.write_text(json.dumps(cache, indent=0, sort_keys=True))
    seconds = sum(sum(v) for v in manifest.values())
    size = sum(f.stat().st_size for f in OUT.glob('*.mp3'))
    ts = ROOT / 'src' / 'content' / 'audio.ts'
    ts.write_text(
        '// Generated by scripts/build_audio.py — do not hand-edit.\n'
        f"// Voice: piper {VOICE}. {len(plan)} clips, {seconds/60:.0f} min, {size/1048576:.1f} MB.\n\n"
        '/** Clip durations in seconds, per cell, in narration order. */\n'
        'export const AUDIO: Record<string, number[]> = '
        + json.dumps(manifest, indent=1)
        + '\n'
    )
    print(f'\n{len(plan)} clips · {seconds/60:.1f} min · {size/1048576:.1f} MB → public/audio/')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
