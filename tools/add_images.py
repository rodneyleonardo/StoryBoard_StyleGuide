"""Convert real frames into the site's image folders.

Usage:
  pip install pillow
  python tools/add_images.py <source_dir>

<source_dir> holds one folder per style, named exactly like the style (the Drive folder names),
each with four PNGs renamed to car-1.png, car-2.png, kid-1.png, kid-2.png.
Writes images/<slug>/<scene>-<n>.webp at the original 1088 x 608 size.
"""
import re, sys, pathlib
from PIL import Image

root = pathlib.Path(__file__).resolve().parent.parent
data = (root / "data.js").read_text()
styles = re.findall(r'slug: "([^"]+)",\s*name: "([^"]+)"', data)
src = pathlib.Path(sys.argv[1])

for slug, name in styles:
    folder = src / name
    if not folder.is_dir():
        print("missing folder:", name); continue
    out = root / "images" / slug
    out.mkdir(parents=True, exist_ok=True)
    for stem in ("car-1", "car-2", "kid-1", "kid-2"):
        f = next(iter(folder.glob(stem + ".*")), None)
        if not f:
            print("missing", name, stem); continue
        Image.open(f).convert("RGB").save(out / (stem + ".webp"), "WEBP", quality=88, method=6)
        print("ok", slug, stem)
