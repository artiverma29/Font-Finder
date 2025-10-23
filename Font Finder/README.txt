Font Finder - Chrome Extension
==============================

What it does
------------
When activated (via the popup's Activate button), move the mouse over page elements to see a floating tooltip that reports:
- font-family
- font-size
- font-weight
- font-style
- line-height
Click on an element to lock the tooltip (click again or press Esc to unlock). Deactivate to remove listeners.

Installation (developer mode)
-----------------------------
1. Download and unzip this folder.
2. Open Chrome -> Extensions -> Toggle 'Developer mode' on.
3. Click 'Load unpacked' and select the 'Font Finder' folder.
4. Click the extension icon and press Activate.

Notes
-----
- The extension uses computed styles, which shows the font-family declaration (may be a font stack).
- On some pages with strict CSP or special frames, behavior may be limited.

Made by Arti Verma
