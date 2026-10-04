"""팀 선택 홀 시작 버튼(금 블록) 위에 거는 어전대회 포스터 액자 — 장식 엔티티 gbg:poster 의 그림과 모델을 만든다.

  python tools/skins/poster-frame.py
  → resource_packs/rp0/textures/rwm/entity/gbg_poster.png   시작 방 포스터(keyart.py가 만든 1920×1080)에 단청 테두리
    resource_packs/rp0/models/entity/gbg_poster.geo.json     폭 6칸 × 높이 3.5625칸, 두께 1/16칸 판 하나
포스터를 다시 만들면(keyart.py) 이것도 다시 실행한다. 게임에서는 /function gbg/poster 로 건다 (다시 실행하면 옮겨 건다).
모델의 앞(북쪽 면, 엔티티가 바라보는 쪽)에 포스터, 뒤(남쪽 면)와 옆은 짙은 나무색.
"""
import os, json
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
RP = os.path.join(ROOT, "resource_packs", "rp0")
SRC = os.path.join(RP, "textures", "particle", "marketing", "movieMinigames_MarketingKeyArt.png")

W_U, H_U, BACK_U = 96, 57, 7          # 모델 단위(16 = 1칸): 앞면 96×57, 아래 7줄은 뒤·옆 색
PX = 16                               # 단위당 픽셀
FRAME = 3 * PX                        # 테두리 두께 (3/16칸)
W, H = W_U * PX, (H_U + BACK_U) * PX  # 1536 × 1024
FH = H_U * PX                         # 앞면 높이 912

RED, GREEN, GOLD, DARK, WOOD = (163, 38, 42), (47, 122, 95), (212, 160, 23), (34, 20, 14), (58, 33, 22)
img = Image.new("RGB", (W, H), WOOD)
d = ImageDraw.Draw(img)
# 단청 테두리: 바깥 짙은 나무 → 주칠 → 녹청(머리초 무늬) → 금선 → 검은 선
bands = [(6, DARK), (12, RED), (20, GREEN), (6, GOLD), (4, DARK)]
o = 0
for t, c in bands:
    d.rectangle([o, o, W - 1 - o, FH - 1 - o], outline=c, width=t); o += t
# 녹청 띠 위 머리초: 일정 간격 꽃 무늬 (흰 테 · 주황 · 남색 눈)
g0 = 6 + 12; gw = 20; cy = g0 + gw // 2
def flower(x, y):
    d.ellipse([x - 8, y - 8, x + 8, y + 8], fill=(240, 236, 220)); d.ellipse([x - 6, y - 6, x + 6, y + 6], fill=(226, 120, 40))
    d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(36, 60, 140))
for x in range(cy + 24, W - cy - 12, 48): flower(x, cy); flower(x, FH - 1 - cy)
for y in range(cy + 24, FH - cy - 12, 48): flower(cy, y); flower(W - 1 - cy, y)
for (x, y) in ((cy, cy), (W - 1 - cy, cy), (cy, FH - 1 - cy), (W - 1 - cy, FH - 1 - cy)):   # 귀퉁이는 금빛 꽃
    d.ellipse([x - 9, y - 9, x + 9, y + 9], fill=GOLD); d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=RED)
# 안쪽: 포스터를 꽉 채워 넣는다 (비율 차이만큼 가장자리를 조금 자른다)
iw, ih = W - 2 * FRAME, FH - 2 * FRAME
src = Image.open(SRC).convert("RGB")
k = max(iw / src.width, ih / src.height)
s = src.resize((round(src.width * k), round(src.height * k)), Image.LANCZOS)
cx, cy2 = (s.width - iw) // 2, (s.height - ih) // 2
img.paste(s.crop((cx, cy2, cx + iw, cy2 + ih)), (FRAME, FRAME))
out = os.path.join(RP, "textures", "rwm", "entity", "gbg_poster.png")
os.makedirs(os.path.dirname(out), exist_ok=True)
img.save(out)

back = {"uv": [0, H_U], "uv_size": [W_U, BACK_U]}
side = {"uv": [0, H_U], "uv_size": [1, 1]}
geo = {
    "format_version": "1.12.0",
    "minecraft:geometry": [{
        "description": {"identifier": "geometry.gbg_poster", "texture_width": W_U, "texture_height": H_U + BACK_U,
                        "visible_bounds_width": 7, "visible_bounds_height": 5, "visible_bounds_offset": [0, 1.8, 0]},
        "bones": [{"name": "poster", "pivot": [0, 0, 0], "cubes": [{
            "origin": [-W_U / 2, 0, -0.5], "size": [W_U, H_U, 1],
            "uv": {"north": {"uv": [0, 0], "uv_size": [W_U, H_U]}, "south": back,
                   "east": side, "west": side, "up": side, "down": side},
        }]}],
    }],
}
gp = os.path.join(RP, "models", "entity", "gbg_poster.geo.json")
json.dump(geo, open(gp, "w", encoding="utf8"), indent=2)
print("포스터 액자:", os.path.relpath(out, ROOT), f"{W}×{H}", "·", os.path.relpath(gp, ROOT), f"(폭 {W_U / 16:g}칸 × 높이 {H_U / 16:g}칸)")
