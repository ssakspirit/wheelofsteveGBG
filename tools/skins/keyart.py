# 시작 방 정면의 대형 포스터(파티클 rwm:lobby_keyart, 3.5×2블록) — 원작의 "WHEEL OF STEVE" 홍보 그림을
# '경복궁 어전대회' 포스터로 바꾼다.
#   python tools/skins/keyart.py                      배치표(poster_layout.json)대로 포스터를 그린다
#   python tools/skins/keyart.py --from Main.dc.html  Claude 디자인 캔버스('경복궁 어전대회 포스터')의 artboard에서
#                                                     층마다 위치·크기를 읽어 배치표를 새로 쓰고 그린다
# 층(뒤에서 앞으로): 배경 → 아래쪽 그늘 → 인물·혼천의 → 제목 → 구석 표기. 디자인 캔버스와 같은 순서·같은 좌표(1920×1080).
#   배경  renders/poster_bg_gyeongbokgung.jpg — Gemini로 만든 블록 스타일 경복궁(표식이 없는 쪽으로 잘라 둔 것)
#   인물  renders/poster_<id>.png — 실제 게임 모델을 개발자 페이지의 3D로 그린 그림(투명 여백은 잘라 쓴다)
#   제목  renders/poster_title.png — Gemini로 만든 금박 제목·부제(초록 배경을 뺀 것)
import json, os, re, sys
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(__file__)
ROOT = os.path.join(HERE, "..", "..")
OUT = os.path.join(ROOT, "resource_packs/rp0/textures/particle/marketing/movieMinigames_MarketingKeyArt.png")
REN = os.path.join(HERE, "renders")
LAYOUT = os.path.join(HERE, "poster_layout.json")
SRC = {"bg": "poster_bg_gyeongbokgung.jpg", "title": "poster_title.png", "wheel": "poster_wheel.png",
       **{f"npc_{i}": f"poster_npc_{i}.png" for i in range(1, 6)}}

def load(name):
    im = Image.open(os.path.join(REN, SRC[name])).convert("RGBA")
    return im if name == "bg" else im.crop(im.getbbox())          # 인물·제목은 투명 여백을 뺀 크기가 기준

def from_design(path):
    """디자인 artboard에서 id 붙은 층의 left·top·width·height를 읽는다. 다른 층 안에 들어간 층은 부모 위치를 더한다."""
    html = open(path, encoding="utf-8").read()
    tag = re.compile(r'<(img|div)\b[^>]*\bid="([^"]+)"[^>]*\bstyle="([^"]*)"[^>]*>|</div>')
    def px(st, k):
        m = re.search(rf'(?<![-\w]){k}:\s*(-?[\d.]+)px', st)
        return float(m.group(1)) if m else None
    layers, stack = [], []                                         # stack: 열린 div들의 (id, 왼쪽, 위)
    for m in tag.finditer(html):
        if m.group(0) == "</div>":
            if stack: stack.pop()
            continue
        kind, lid, st = m.groups()
        x = (px(st, "left") or 0) + sum(s[1] for s in stack)
        y = (px(st, "top") or 0) + sum(s[2] for s in stack)
        if kind == "div":
            if lid == "shade": layers.append({"id": lid, "x": x, "y": y, "w": px(st, "width"), "h": px(st, "height")})
            stack.append((lid, px(st, "left") or 0, px(st, "top") or 0))
            continue
        if lid in SRC:
            w, h = px(st, "width"), px(st, "height")
            if h is None:                                          # height: auto → 그림 비율대로
                im = load(lid); h = w * im.height / im.width
            layers.append({"id": lid, "x": x, "y": y, "w": w, "h": h})
    return layers

if "--from" in sys.argv:
    layers = from_design(sys.argv[sys.argv.index("--from") + 1])
    json.dump(layers, open(LAYOUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("배치표를 썼음:", ", ".join(l["id"] for l in layers))
layers = json.load(open(LAYOUT, encoding="utf-8"))

img = Image.new("RGBA", (1920, 1080), (42, 32, 24, 255))
for L in layers:
    x, y, w, h = round(L["x"]), round(L["y"]), round(L["w"]), round(L["h"])
    if L["id"] == "shade":                                         # 아래로 갈수록 짙어지는 그늘 (인물이 배경에서 떠 보이게)
        sh = Image.new("RGBA", img.size); sd = ImageDraw.Draw(sh)
        for yy in range(max(y, 0), min(y + h, 1080)):
            sd.line([(0, yy), (img.width, yy)], fill=(20, 14, 10, int(110 * (yy - y) / h)))
        img.alpha_composite(sh)
        continue
    p = load(L["id"]).resize((w, h), Image.LANCZOS if L["id"] in ("bg", "title") else Image.NEAREST)
    if L["id"].startswith("npc_") or L["id"] == "wheel":           # 발밑 그림자
        sh = Image.new("RGBA", img.size)
        ImageDraw.Draw(sh).ellipse([x + w * 0.05, y + h - 22, x + w * 0.95, y + h + 10], fill=(0, 0, 0, 90))
        img.alpha_composite(sh)
    layer = Image.new("RGBA", img.size); layer.paste(p, (x, y), p)  # 화면 밖으로 나간 부분은 잘린다
    img.alpha_composite(layer)

draw = ImageDraw.Draw(img)
small = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 24, index=0)
draw.text((22, 1044), "원작: Wheel of Steve · Minecraft Education   개발: 스티브코딩", font=small, fill="#fbf3dfcc", stroke_width=3, stroke_fill="#1d2433")

img.convert("RGB").save(OUT, optimize=True)
print("썼음", os.path.relpath(OUT, ROOT), img.size)
