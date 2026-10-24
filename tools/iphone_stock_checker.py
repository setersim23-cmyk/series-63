"""Poll Verizon store pickup availability for a 1TB Night Sky iPhone near Fanwood, NJ.

Standalone tool, unrelated to the Series 63 app. Run it on a machine with a display
(the browser is launched visibly so a hit can be acted on):

    pip install playwright
    playwright install chromium
    python tools/iphone_stock_checker.py

Verizon's markup changes without notice; if every ZIP reports "step failed", the
selectors in check_once() need updating.
"""

import asyncio
import re
from playwright.async_api import async_playwright

# All 62 standard NJ ZIPs whose centroid is within 10 miles of 07023 (Fanwood), nearest first
ZIP_CODES = [
    "07023", "07062", "07076", "07090", "07060", "07092", "07027", "07069", "07922", "07063",
    "07974", "07066", "07080", "07016", "08820", "07067", "07901", "07081", "07933", "07033",
    "08812", "07065", "08830", "07928", "07980", "07059", "07204", "07203", "07036", "07001",
    "08840", "07041", "07083", "07946", "07078", "08854", "08846", "07088", "07935", "07095",
    "08837", "08863", "07976", "07940", "08817", "08899", "07040", "07202", "07064", "07208",
    "07939", "07077", "07008", "07205", "07932", "08836", "07920", "08805", "08832", "07201",
    "08880", "07079",
]
PRODUCT_URL = "https://www.verizon.com/smartphones/apple-iphone-duo/"  # confirm slug in a normal browser
COLOR = re.compile(r"night\s*sky", re.I)
STORAGE = re.compile(r"^\s*1\s?TB\s*$", re.I)  # exact match so "1 TB" can't hit other text
POLL_MINUTES = 15

NEGATIVE = re.compile(r"not in stock|out of stock|not available|unavailable|sold out", re.I)
POSITIVE = re.compile(r"\bin stock\b|available for pickup|ready for pickup|available today", re.I)


async def click_first(page, *locators, timeout=8000):
    """Click the first locator that resolves; raise if none do."""
    last_err = None
    for loc in locators:
        try:
            await loc.first.click(timeout=timeout)
            return
        except Exception as e:
            last_err = e
    raise last_err


async def check_once(page):
    await page.goto(PRODUCT_URL, wait_until="domcontentloaded")

    await click_first(page, page.get_by_label(COLOR), page.get_by_text(COLOR))
    await click_first(page, page.get_by_role("radio", name=STORAGE), page.get_by_text(STORAGE))
    await click_first(page, page.get_by_text("New customer", exact=False))
    await click_first(page, page.get_by_text("Check store availability", exact=False))

    hits = []
    for z in ZIP_CODES:
        try:
            zip_input = page.locator("input[name*='zip' i], input[placeholder*='ZIP' i]").first
            await zip_input.fill(z)
            await zip_input.press("Enter")
            try:
                await page.wait_for_load_state("networkidle", timeout=10000)
            except Exception:
                pass

            # Read only the availability drawer, not the whole page HTML
            drawer = page.get_by_role("dialog").last
            text = await drawer.inner_text(timeout=5000)
            cleaned = NEGATIVE.sub("", text)
            if POSITIVE.search(cleaned):
                hits.append(z)
                print(f"\a STOCK FOUND NEAR {z}")
            else:
                print(f"No 1TB Night Sky stock near {z}.")
        except Exception as e:
            print(f"{z}: step failed, selector likely needs updating ({e.__class__.__name__}: {e})")
    return hits


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        while True:
            try:
                hits = await check_once(page)
            except Exception as e:
                hits = []
                print(f"Setup step failed before ZIP loop: {e}")
            if hits:
                # Leave the window open so the result is actually visible
                await asyncio.to_thread(input, "Stock found. Press Enter to resume polling...")
            await asyncio.sleep(POLL_MINUTES * 60)


if __name__ == "__main__":
    asyncio.run(main())
