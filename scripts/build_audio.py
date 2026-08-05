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
    words = [w.replace('·', ';').replace('§', 'section ') for w in re.split(r'\s+', text) if w]
    label = PREFIX.get(kind, '')
    return (label + ' ' if label else '') + ' '.join(words)


def narration_items():
    """Every cell's items, with the answer-framework card appended as the app does."""
    textbook = literal(ROOT / 'src/content/textbook.ts', 'export const TEXTBOOK: Textbook =')
    frames = literal(ROOT / 'src/data/frames.ts', 'export const FRAMES: Record<CellId, Frame> =')

    for chapter in textbook['chapters']:
        for cell in chapter['cells']:
            items = [(it['t'], it['x']) for it in cell['items']]
            frame = frames.get(cell['id'])
            if frame:
                bullets = ' '.join(f'{b} {r}' for b, r in frame['bullets'])
                items.append(('frame', f"{frame['head']}. {frame['intro']} {bullets} {frame['tail']}"))
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
    piper_bin, model = ensure_piper()
    env = dict(os.environ, LD_LIBRARY_PATH=str(piper_bin.parent))
    OUT.mkdir(parents=True, exist_ok=True)
    tmp_wav = BUILD / 'clip.wav'

    manifest: dict[str, list[float]] = {}
    todo = list(narration_items())
    total = sum(len(items) for _, items in todo)
    done = 0
    seconds = 0.0
    written = 0

    for cell_id, items in todo:
        durations = []
        for index, (kind, text) in enumerate(items):
            mp3 = OUT / f'{cell_id}-{index}.mp3'
            result = subprocess.run(
                [str(piper_bin), '--model', str(model), '--output_file', str(tmp_wav)],
                input=spoken(kind, text).encode(),
                env=env,
                capture_output=True,
            )
            if result.returncode != 0:
                print(f'FAILED {cell_id}-{index}: {result.stderr.decode()[:200]}', file=sys.stderr)
                return 1

            secs = encode(tmp_wav, mp3)
            durations.append(round(secs, 2))
            seconds += secs
            written += 1
            done += 1
            if done % 25 == 0 or done == total:
                print(
                    f'  {done}/{total} clips · {seconds/60:.1f} min rendered',
                    flush=True,
                )
        manifest[cell_id] = durations

    size = sum(f.stat().st_size for f in OUT.glob('*.mp3'))
    ts = ROOT / 'src' / 'content' / 'audio.ts'
    ts.write_text(
        '// Generated by scripts/build_audio.py — do not hand-edit.\n'
        f"// Voice: piper {VOICE}. {written} clips, {seconds/60:.0f} min, {size/1048576:.1f} MB.\n\n"
        '/** Clip durations in seconds, per cell, in narration order. */\n'
        'export const AUDIO: Record<string, number[]> = '
        + json.dumps(manifest, indent=1)
        + '\n'
    )
    print(f'\n{written} clips · {seconds/60:.1f} min · {size/1048576:.1f} MB → public/audio/')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
