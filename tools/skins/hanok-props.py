"""한옥 5차: 하늘과 소품 — 리소스팩 그림 (월드 전체 적용). 바닐라 그림을 바탕으로 색을 바꾸거나 새로 그린다.

  python tools/skins/hanok-props.py [--preview 출력.png]
  해·달(environment/sun, moon_phases)       → 일월오봉도처럼 붉은 해와 흰 달 (검은 바탕은 빛을 더하는 방식이라 그대로)
  표지판(entity/sign, sign_jungle, oak_hanging_sign) → 현판: 붉은 갈색 판에 금빛 테 (글씨가 잘 보이게 밝기는 비슷하게)
  상자(entity/chest/normal)                 → 반닫이: 검붉은 옻칠 나무에 놋쇠 장식
  통(blocks/barrel_*)                        → 뒤주: 나무 궤짝, 뚜껑에 놋쇠 자물쇠, 열면 쌀
  화로(blocks/furnace_*)                     → 아궁이 화덕: 황토 벽에 아궁이, 위에는 가마솥
  침대(entity/bed/white·yellow·red)          → 이부자리: 비단 이불(옥색·노랑·다홍)과 흰 베개
"""
import os, sys, math
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import blocktex

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
TX = os.path.join(ROOT, "resource_packs", "rp0", "textures")
VAN = blocktex.Tex(False)
OUT = {}
def van(rel): return Image.open(VAN.file("textures/" + rel)).convert("RGBA")
def hx(c, a=255): return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5)) + (a,)
def lum(p): return (p[0] * 3 + p[1] * 6 + p[2]) / 10
def ramp(cols, l, lo=40, hi=200):            # 밝기(lo~hi)를 색 목록에 대응
    k = min(len(cols) - 1, max(0, int((l - lo) / (hi - lo) * len(cols))))
    return hx(cols[k])
def h(x, y, s=0):                            # modelkit.js의 hash와 같은 섞기 (줄무늬가 생기지 않게)
    v = ((x * 374761393 + y * 668265263 + s * 2246822519) ^ 0x5bd1e995) & 0xffffffff
    v = ((v ^ (v >> 13)) * 1274126177) & 0xffffffff
    return ((v ^ (v >> 16)) & 0xffffffff) / 4294967296

# ---------- 해 · 달 ----------
def sun():
    im = Image.new("RGBA", (32, 32), (0, 0, 0, 255)); px = im.load()
    for y in range(32):
        for x in range(32):
            r = math.hypot(x - 15.5, y - 15.5)
            if r < 6: px[x, y] = hx("#f04a2c")
            elif r < 7: px[x, y] = hx("#c4321f")
            elif r < 13: k = (13 - r) / 6; px[x, y] = (int(110 * k * k), int(24 * k * k), int(10 * k * k), 255)  # 붉은 햇무리
    return im
def moon():
    im = van("environment/moon_phases"); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            p = px[x, y]; l = lum(p)
            if l > 60: px[x, y] = (min(255, int(l * 1.08)), min(255, int(l * 1.06)), min(255, int(l * 0.98)), p[3])   # 푸른 기 빼고 흰 달
    return im
OUT["environment/sun"] = sun(); OUT["environment/moon_phases"] = moon()

# ---------- 현판 ----------
BOARD = ["#3d2416", "#5a3420", "#764628", "#8f5a33", "#a46a3c"]
def hyeonpan(rel, frame=True):
    im = van(rel); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            p = px[x, y]
            if p[3] < 128: continue
            if max(p[:3]) - min(p[:3]) < 25 and lum(p) < 120: continue      # 쇠사슬(걸이 표지판)은 그대로
            px[x, y] = ramp(BOARD, lum(p), 60, 190)
    if frame:   # 표지판 판(uv 0,0 · 24×12×2): 앞면(2,2)·뒷면(28,2) 24×12에 금빛 테
        for x0 in (2, 28):
            for x in range(x0, x0 + 24):
                for y in (2, 13): px[x, y] = hx("#c99a2e")
            for y in range(2, 14):
                for x in (x0, x0 + 23): px[x, y] = hx("#c99a2e")
    return im
OUT["entity/sign"] = hyeonpan("entity/sign"); OUT["entity/sign_jungle"] = hyeonpan("entity/sign_jungle")
OUT["entity/oak_hanging_sign"] = hyeonpan("entity/oak_hanging_sign", frame=False)

# ---------- 반닫이 ----------
def bandaji():
    im = van("entity/chest/normal"); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            p = px[x, y]
            if p[3] < 128: continue
            if max(p[:3]) - min(p[:3]) < 25:                                  # 쇠 걸쇠 → 놋쇠
                px[x, y] = ramp(["#6b5420", "#a07c2c", "#c99a2e", "#e2c26a"], lum(p), 40, 200)
            else:
                px[x, y] = ramp(["#2a120c", "#3f1b12", "#55261a", "#6b3222", "#7d3c28"], lum(p), 40, 190)
    return im
OUT["entity/chest/normal"] = bandaji()

# ---------- 뒤주 · 화덕 (새로 그림) ----------
def tex(f): im = Image.new("RGBA", (16, 16)); [im.putpixel((x, y), f(x, y)) for y in range(16) for x in range(16)]; return im
WOOD = ["#6b4527", "#74492a", "#62401f"]
def dwiju(face):
    def f(x, y):
        if x in (0, 15) or y in (0, 15): return hx("#3d2716")                # 모서리 기둥·틀
        if face == "side":
            if y in (4, 11) and 2 <= x <= 13: return hx("#a07c2c")            # 놋쇠 띠
            return hx(WOOD[(x // 5) % 3] if (x % 5) else "#4f331c")           # 세로 널판
        if face == "top":
            if 6 <= x <= 9 and 6 <= y <= 9: return hx("#c99a2e" if (x, y) not in ((7, 7), (8, 8)) else "#5a4416")  # 자물쇠
            if y == 3 or y == 12: return hx("#4f331c")
            return hx(WOOD[(y // 4) % 3])
        if face == "open":                                                     # 연 뒤주 안: 쌀
            if x in (1, 14) or y in (1, 14): return hx("#4f331c")
            return hx("#f2ecdc" if h(x, y, 3) > 0.25 else "#ddd3bd")
        return hx(WOOD[(y // 4) % 3])
    return tex(f)
OUT["blocks/barrel_side"] = dwiju("side"); OUT["blocks/barrel_top"] = dwiju("top")
OUT["blocks/barrel_top_open"] = dwiju("open"); OUT["blocks/barrel_bottom"] = dwiju("bottom")
CLAY = ["#b48a52", "#a77d48", "#bf9660"]
def clay(x, y):
    if (x * 5 + y * 3) % 13 == 0 and h(x, y, 5) < 0.7: return hx("#8c8478")   # 박힌 돌
    return hx(CLAY[int(h(x, y, 6) * 3)])
def hwadeok(face, lit=False):
    def f(x, y):
        if face == "top":                                                      # 가마솥(위에서 본 모습)
            r = math.hypot(x - 7.5, y - 7.5)
            if r < 4.5: return hx("#2a2826" if r > 1.2 else "#4a4744")
            if r < 5.6: return hx("#1a1918")
            return hx("#8c8478" if (x + y) % 4 else "#7a7368")
        if face == "front":
            ax, ay = abs(x - 7.5), 15 - y                                      # 아궁이: 아래쪽 아치
            if ay < 7 and ax < 4.5 - max(0, ay - 4) * 0.8:
                if not lit: return hx("#1c1512")
                return hx("#f6c84a" if ay < 2 else "#e8622c" if ay < 4 else "#7a2a18") if h(x, y, 7) > 0.15 else hx("#f2a03a")
            if ay < 8 and ax < 5.6 - max(0, ay - 4) * 0.8: return hx("#6b5a48")  # 아궁이 테 돌
        return clay(x, y)
    return tex(f)
OUT["blocks/furnace_side"] = hwadeok("side"); OUT["blocks/furnace_top"] = hwadeok("top")
OUT["blocks/furnace_front_off"] = hwadeok("front"); OUT["blocks/furnace_front_on"] = hwadeok("front", True)

# ---------- 이부자리 ----------
red = van("entity/bed/red"); rp = red.load()
wool = {(x, y) for y in range(red.height) for x in range(red.width) if rp[x, y][3] > 128 and rp[x, y][0] > rp[x, y][1] + 50}   # 이불 자리 = 빨간 침대의 빨간 칸
SILK = {"white": ["#5f9c86", "#7fb8a2", "#9fd4c0", "#c3e8d9"], "yellow": ["#a87c22", "#c99a2e", "#e6b84a", "#f4d27a"], "red": ["#8e2a20", "#b13a2a", "#c8402e", "#e0674e"]}
def ibul(color):
    im = van("entity/bed/" + color); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            p = px[x, y]
            if p[3] < 128: continue
            if (x, y) in wool:
                c = SILK[color]
                k = 2 if (x % 4 == 1 and y % 4 == 1) or (x % 4 == 3 and y % 4 == 3) else 1   # 비단 꽃무늬 점
                if h(x, y, 9) < 0.15: k -= 1
                if x % 4 == 1 and y % 4 == 1: k = 3
                px[x, y] = hx(c[max(0, min(3, k))])
            elif not (lum(p) > 170 and max(p[:3]) - min(p[:3]) < 30):           # 베개(흰색)는 그대로, 나무는 짙은 고동색
                px[x, y] = ramp(["#3a2716", "#4a3220", "#5a3f27", "#634529"], lum(p), 50, 200)
    return im
for c in SILK: OUT["entity/bed/" + c] = ibul(c)

for rel, im in OUT.items():
    f = os.path.join(TX, rel + ".png"); os.makedirs(os.path.dirname(f), exist_ok=True); im.save(f)
if "--preview" in sys.argv:
    out = sys.argv[sys.argv.index("--preview") + 1]
    items = list(OUT.items()); S = lambda im: 8 if im.width <= 16 else 4 if im.width <= 64 else 2
    W = sum(im.width * S(im) + 10 for _, im in items); H = max(im.height * S(im) for _, im in items)
    sheet = Image.new("RGBA", (W, H), (70, 74, 78, 255)); x = 0
    for _, im in items: k = S(im); sheet.alpha_composite(im.resize((im.width * k, im.height * k), Image.NEAREST), (x, 0)); x += im.width * k + 10
    sheet.save(out)
print("한옥 하늘·소품 %d장: %s" % (len(OUT), ", ".join(OUT)))
