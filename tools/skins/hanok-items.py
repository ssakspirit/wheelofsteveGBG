"""한옥 4차: 손에 드는 물건과 소품 — 바닐라 그림을 바탕으로 리소스팩에서 바꾼다 (월드 전체 적용).

  python tools/skins/hanok-items.py [--preview 출력.png]
  활(bow_standby, bow_pulling_0~2)  → 각궁: 나무 부분을 검은 물소뿔 색으로, 손잡이(줌통)는 붉은 감개, 양 끝(고자)은 누런 화피
  폭죽 로켓 아이콘(fireworks)        → 신기전: 약통(종이 화약통)을 단 화살 — 새로 그림
  겉날개(models/armor/elytra · items/elytra · broken_elytra) → 학 날개: 흰 깃에 검은 끝깃
  랜턴(blocks/lantern, 3프레임)      → 청사초롱: 위는 붉은 비단, 아래는 푸른 비단, 쇠붙이는 검붉은 나무
바닐라 그림은 설치된 Education의 vanilla 팩에서 읽는다 (tools/blocktex.py).
"""
import os, sys
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import blocktex

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
TX = os.path.join(ROOT, "resource_packs", "rp0", "textures")
VAN = blocktex.Tex(False)
OUT = {}

def van(rel): return Image.open(VAN.file("textures/" + rel)).convert("RGBA")
def hx(c): return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5)) + (int(c[7:9], 16) if len(c) > 7 else 255,)

# ---------- 각궁 ----------
HORN = {(0x49, 0x36, 0x15): "#141312", (0x28, 0x1e, 0x0b): "#1d1b1a", (0x68, 0x4e, 0x1e): "#302d2b", (0x89, 0x67, 0x27): "#4a4542"}
def gakgung(rel):
    im = van(rel); px = im.load()
    wood = [(x, y) for y in range(16) for x in range(16) if px[x, y][3] > 128 and px[x, y][:3] in HORN and (x <= 4 or y <= 4)]  # 활대(시위·화살 빼고)
    for x, y in wood: px[x, y] = hx(HORN[px[x, y][:3]])
    # 고자(양 끝): 활대의 가장 위·오른쪽과 가장 아래·왼쪽 두 칸씩 → 누런 화피
    ends = sorted(wood, key=lambda p: p[0] - p[1])
    for x, y in ends[:2] + ends[-2:]: px[x, y] = hx("#b8893f")
    # 줌통(손잡이): 활대가 꺾이는 왼쪽 위 모서리 근처 → 붉은 감개
    for x, y in wood:
        if abs(x - 3.5) + abs(y - 4.5) <= 1.6: px[x, y] = hx("#8e2f22" if (x + y) % 2 else "#a8402c")
    return im
for f in ["bow_standby", "bow_pulling_0", "bow_pulling_1", "bow_pulling_2"]:
    OUT["items/" + f] = gakgung("items/" + f)

# ---------- 신기전 ----------
def singijeon():
    im = Image.new("RGBA", (16, 16)); px = im.load()
    for i in range(11):                          # 대나무 화살대 (왼쪽 아래 → 오른쪽 위)
        x, y = 2 + i, 13 - i
        px[x, y] = hx("#8a6a3a" if i % 3 else "#6b5029")
    for x, y, c in [(13, 2, "#7d8389"), (14, 1, "#b9bec4"), (14, 2, "#5d6268"), (13, 1, "#5d6268")]:   # 쇠 화살촉
        px[x, y] = hx(c)
    for x, y, c in [(9, 6, "#efe7d6"), (10, 5, "#efe7d6"), (11, 4, "#b8392c"), (10, 6, "#d9cfba"), (11, 5, "#efe7d6"),
                    (12, 4, "#b8392c"), (9, 5, "#d9cfba"), (10, 4, "#efe7d6"), (8, 7, "#b8392c"), (9, 7, "#8e2a20")]:  # 약통(종이 화약통) · 붉은 띠
        px[x, y] = hx(c)
    for x, y, c in [(7, 9, "#f2a03a"), (6, 9, "#f6c84a"), (7, 10, "#e8622c")]:                        # 약통 뒤 불꽃
        px[x, y] = hx(c)
    for x, y, c in [(1, 13, "#e8e6e1"), (2, 14, "#e8e6e1"), (1, 14, "#b9b6b0"), (2, 12, "#b9b6b0"), (3, 13, "#d4d1cb")]:  # 깃
        px[x, y] = hx(c)
    return im
OUT["items/fireworks"] = singijeon()

# ---------- 학 날개 ----------
def crane_wing_model():
    im = van("models/armor/elytra"); px = im.load()
    # 날개 상자(uv 22,0 · 10×20×2): 앞(24,2)·뒤(36,2) 10×20, 옆(22,2)·(34,2) 2×20, 위(24,0)·아래(34,0) 10×2
    def face(x0, y0, w, h, mirror=False):
        for y in range(h):
            for xx in range(w):
                x = (w - 1 - xx) if mirror else xx
                cut = y >= h - 3 and (x * 2 + (h - 1 - y) * 3) % 5 < 2          # 끝깃의 들쭉날쭉한 끝
                if y >= h - 1 and x % 2: cut = True
                if cut: px[x0 + xx, y0 + y] = (0, 0, 0, 0); continue
                if y >= h - 7:                                                   # 검은 끝깃
                    c = "#1d1d20" if (x + y) % 3 else "#2c2c31"
                elif (y - x // 2) % 4 == 0:                                       # 흰 깃 결
                    c = "#d8d5ce"
                else:
                    c = "#f3f1ec" if (x * 7 + y * 3) % 11 else "#e6e3dc"
                px[x0 + xx, y0 + y] = hx(c)
    face(24, 2, 10, 20); face(36, 2, 10, 20, True)
    for x0 in (22, 34):                                                         # 옆면
        for y in range(2, 22):
            for x in range(2): px[x0 + x, y] = hx("#1d1d20" if y >= 15 else "#e6e3dc")
    for x0 in (24, 34):                                                         # 위·아래
        for x in range(10):
            for y in range(2): px[x0 + x, y] = hx("#e6e3dc")
    return im
OUT["models/armor/elytra"] = crane_wing_model()

def crane_icon(rel):
    im = van(rel); px = im.load()
    ys = [y for y in range(16) for x in range(16) if px[x, y][3] > 128]
    top, bot = min(ys), max(ys)
    for y in range(16):
        for x in range(16):
            p = px[x, y]
            if p[3] <= 128: continue
            lum = (p[0] * 3 + p[1] * 6 + p[2]) / 10
            if y >= bot - 3: c = "#1d1d20" if lum < 120 else "#34343a"           # 끝깃
            elif lum < 70: c = "#3a3a40"                                         # 테두리
            elif lum < 140: c = "#cfccc5"
            else: c = "#f4f2ed"
            px[x, y] = hx(c)
    return im
OUT["items/elytra"] = crane_icon("items/elytra")
OUT["items/broken_elytra"] = crane_icon("items/broken_elytra")

# ---------- 청사초롱 ----------
def cheongsa():
    # 바닐라 랜턴 한 프레임(16×16)의 배치: 0~1줄 뚜껑, 2~8줄 옆면(6×7), 9~14줄 위·아래면(6×6), 오른쪽은 고리
    im = van("blocks/lantern"); px = im.load()
    W, H = im.size
    for k, f0 in enumerate(range(0, H, 16)):
        glow = 1 + 0.05 * ((k % 3) - 1)                                       # 프레임마다 살짝 깜빡임
        def lit(c, f=1.0):
            r, g, b, a = hx(c); m = glow * f
            return (min(255, int(r * m)), min(255, int(g * m)), min(255, int(b * m)), a)
        for y in range(16):
            for x in range(W):
                p = px[x, f0 + y]
                if p[3] <= 128: continue
                if x <= 5 and 2 <= y <= 8:                                      # 옆면: 위는 붉은 비단, 아래는 푸른 비단(홍은 양, 청은 음), 테두리는 나무살
                    if x in (0, 5) or y in (2, 8): c = hx("#4a2318")
                    elif y <= 5: c = lit("#ff8d6c" if x in (2, 3) and y in (4, 5) else "#d2513a")
                    else: c = lit("#b5cffc" if x in (2, 3) and y == 6 else "#6f9be6")
                elif x <= 5 and y >= 9:                                         # 위·아래면: 나무 판에 가운데 금빛 고리
                    c = hx("#c99a2e" if (x in (2, 3) and y in (11, 12)) else "#4a2318" if (x + y) % 3 else "#3a1b12")
                elif x <= 5:                                                    # 뚜껑
                    c = hx("#c99a2e" if x in (2, 3) and y == 0 else "#3a1d16")
                else:                                                           # 고리
                    c = hx("#c99a2e" if sum(p[:3]) > 200 else "#6b4a1f")
                px[x, f0 + y] = c
    return im
OUT["blocks/lantern"] = cheongsa()

for rel, im in OUT.items():
    f = os.path.join(TX, rel + ".png"); os.makedirs(os.path.dirname(f), exist_ok=True); im.save(f)

if "--preview" in sys.argv:
    out = sys.argv[sys.argv.index("--preview") + 1]
    S = 8; tiles = [(rel, im) for rel, im in OUT.items()]
    W = sum(im.width * (S if im.width <= 16 else 4) + 12 for _, im in tiles)
    sheet = Image.new("RGBA", (W, max(im.height * (S if im.width <= 16 else 4) for _, im in tiles)), (70, 74, 78, 255))
    x = 0
    for rel, im in tiles:
        k = S if im.width <= 16 else 4
        sheet.alpha_composite(im.resize((im.width * k, im.height * k), Image.NEAREST), (x, 0)); x += im.width * k + 12
    sheet.save(out)
print("한옥 소품·아이템 %d장: %s" % (len(OUT), ", ".join(OUT)))
