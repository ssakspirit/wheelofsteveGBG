"""근정전·광화문 양털 현판 자리에 거는 한글 현판 — 장식 엔티티 gbg:hyeonpan_<id> 의 그림·모델·엔티티 파일과 거는 함수를 만든다.

  python tools/skins/hyeonpan.py
  → resource_packs/rp0/textures/rwm/entity/gbg_hyeonpan_<id>.png   검은 바탕 · 금빛 궁서체 글씨 · 단청 테두리
    resource_packs/rp0/models/entity/gbg_hyeonpan.geo.json          폭 5칸 × 높이 1.5칸 판 (양털 현판 5×2칸 중 처마 아래 보이는 만큼)
    resource_packs/rp0/entity/gbg_hyeonpan_<id>.rp.e.json, behavior_packs/bp0/entities/gbg_hyeonpan_<id>.bp.e.json (새 파일)
    behavior_packs/bp0/functions/gbg/hyeonpan.mcfunction            게임에서 /function gbg/hyeonpan (다시 실행하면 옮겨 건다)
양털 현판 위치는 tools/gbg-lobby.py 로 옮긴 경복궁 건물 기준: 위 줄이 한 칸 앞으로 나온 5×2칸이고 위 반 칸은 처마 반 블록이 덮는다.
그래서 판은 위 줄 앞면 바로 앞에 세로로 세운다 (엔티티는 모델의 북쪽 면이 앞 — 둘 다 −Z를 본다, 회전 180).
"""
import os, json
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
RP = os.path.join(ROOT, "resource_packs", "rp0")
BP = os.path.join(ROOT, "behavior_packs", "bp0")
FONT = ("C:/Windows/Fonts/batang.ttc", 2)                 # 궁서 (붓글씨)
# id, 글씨, 놓을 자리(판 아래 가운데, 앞으로 0.04칸 띄움)
SIGNS = [("geunjeongjeon", "근정전", (1.5, 78.0, 1084.96)),
         ("gwanghwamun", "광화문", (1.5, 77.0, 996.96))]

W_U, H_U, BACK_U, PX = 80, 24, 4, 16                      # 모델 단위(16 = 1칸) · 단위당 픽셀
W, FH = W_U * PX, H_U * PX
GREEN, RED, GOLD, DARK, BOARD, WOOD = (47, 122, 95), (163, 38, 42), (214, 168, 52), (22, 16, 12), (24, 22, 26), (58, 33, 22)

def paint(text):
    img = Image.new("RGB", (W, (H_U + BACK_U) * PX), WOOD)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W - 1, FH - 1], fill=BOARD)
    o = 0
    for t, c in [(5, DARK), (22, GREEN), (5, GOLD), (3, DARK)]:   # 단청 테두리
        d.rectangle([o, o, W - 1 - o, FH - 1 - o], outline=c, width=t); o += t
    cy = 5 + 11
    for x in range(cy + 20, W - cy - 10, 40):                # 녹청 띠의 점무늬 (금·주칠)
        for y in (cy, FH - 1 - cy):
            d.ellipse([x - 6, y - 6, x + 6, y + 6], fill=GOLD); d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=RED)
    for y in range(cy + 20, FH - cy - 10, 40):
        for x in (cy, W - 1 - cy):
            d.ellipse([x - 6, y - 6, x + 6, y + 6], fill=GOLD); d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=RED)
    inner_h = FH - 2 * o
    f = ImageFont.truetype(FONT[0], int(inner_h * 0.78), index=FONT[1])
    # 글자 사이를 넓게 (현판처럼 칸을 고르게 나눠 한 글자씩)
    n = len(text); cell = (W - 2 * o) / n
    for i, ch in enumerate(text):
        bb = d.textbbox((0, 0), ch, font=f)
        cx = o + cell * (i + 0.5) - (bb[0] + bb[2]) / 2
        cyy = FH / 2 - (bb[1] + bb[3]) / 2
        d.text((cx + 4, cyy + 4), ch, font=f, fill=(0, 0, 0))                 # 그림자
        d.text((cx, cyy), ch, font=f, fill=GOLD, stroke_width=2, stroke_fill=(120, 84, 20))
    return img

side = {"uv": [0, H_U], "uv_size": [1, 1]}
geo = {"format_version": "1.12.0", "minecraft:geometry": [{
    "description": {"identifier": "geometry.gbg_hyeonpan", "texture_width": W_U, "texture_height": H_U + BACK_U,
                    "visible_bounds_width": 6, "visible_bounds_height": 3, "visible_bounds_offset": [0, 0.75, 0]},
    "bones": [{"name": "board", "pivot": [0, 0, 0], "cubes": [{
        "origin": [-W_U / 2, 0, -0.5], "size": [W_U, H_U, 1],
        "uv": {"north": {"uv": [0, 0], "uv_size": [W_U, H_U]}, "south": {"uv": [0, H_U], "uv_size": [W_U, BACK_U]},
               "east": side, "west": side, "up": side, "down": side}}]}]}]}
json.dump(geo, open(os.path.join(RP, "models", "entity", "gbg_hyeonpan.geo.json"), "w", encoding="utf8"), indent=2)

lines = ["## [경복궁] 근정전·광화문 양털 현판 앞에 한글 현판을 건다 — python tools/skins/hyeonpan.py 가 만든 파일.",
         "## 다시 실행하면 있던 현판을 치우고 새로 건다. 근처(로비)에 서서 실행한다."]
for sid, text, (x, y, z) in SIGNS:
    ident = "gbg:hyeonpan_" + sid
    paint(text).save(os.path.join(RP, "textures", "rwm", "entity", "gbg_hyeonpan_%s.png" % sid))
    rp = {"format_version": "1.10.0", "minecraft:client_entity": {"description": {
        "identifier": ident, "materials": {"default": "entity"}, "geometry": {"default": "geometry.gbg_hyeonpan"},
        "textures": {"default": "textures/rwm/entity/gbg_hyeonpan_" + sid}, "render_controllers": ["controller.render.default"]}}}
    json.dump(rp, open(os.path.join(RP, "entity", "gbg_hyeonpan_%s.rp.e.json" % sid), "w", encoding="utf8"), indent="\t")
    bp = {"format_version": "1.20.0", "minecraft:entity": {
        "description": {"identifier": ident, "is_spawnable": False, "is_summonable": True, "is_experimental": False},
        "components": {
            "minecraft:type_family": {"family": ["gbg_decor"]},
            "minecraft:health": {"value": 1, "max": 1},
            "minecraft:damage_sensor": {"triggers": [{"on_damage": {}, "deals_damage": False}]},
            "minecraft:physics": {"has_gravity": False, "has_collision": False},
            "minecraft:collision_box": {"width": 0.1, "height": 0.1},
            "minecraft:pushable": {"is_pushable": False, "is_pushable_by_piston": False},
            "minecraft:knockback_resistance": {"value": 1},
            "minecraft:fire_immune": {},
            "minecraft:body_rotation_blocked": {}}}}
    json.dump(bp, open(os.path.join(BP, "entities", "gbg_hyeonpan_%s.bp.e.json" % sid), "w", encoding="utf8"), indent="\t")
    lines += ["kill @e[type=%s]" % ident, "summon %s %g %g %g 180 0" % (ident, x, y, z)]
lines.append('tellraw @s {"rawtext":[{"text":"§a[경복궁] 근정전·광화문 현판을 걸었습니다."}]}')
open(os.path.join(BP, "functions", "gbg", "hyeonpan.mcfunction"), "w", encoding="utf8").write("\n".join(lines) + "\n")
print("현판:", ", ".join(t for _, t, _ in SIGNS), "→ textures/rwm/entity/gbg_hyeonpan_*.png, entity 파일, functions/gbg/hyeonpan.mcfunction")
