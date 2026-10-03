"""게임장 구역을 블록 그대로 3D로 보려고 월드 저장 데이터(db/)에서 뽑는다 — 개발자 페이지의 '구역 3D'가 읽는다. 읽기만 한다.

  python tools/export-areas.py [--db <db 폴더>]   (블록 종류 번호를 모든 구역이 같이 쓰므로 늘 전부 다시 뽑는다)
  → devpage-areas/blocks.js  블록 종류 표(모양·면별 텍스처 칸) + 텍스처 묶음(atlas, 원본/현재 두 벌)
    devpage-areas/<id>.js     구역 상자 크기 + 블록 종류 번호 격자(deflate → base64)
구역 상자는 mcworld.ARENAS. 게임이 켜져 있으면 db를 복사해서 그 사본을 넘긴다 (마지막 저장 상태 기준).
3D 모양은 브라우저가 격자에서 직접 만든다: 가려진 면은 빼고, 반 블록·계단·울타리·판유리·풀 등은 모양을 근사한다.
"""
import os, sys, io, json, zlib, base64, argparse
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
import mcworld, blocktex

ROOT = os.path.join(os.path.dirname(__file__), "..")
ap = argparse.ArgumentParser()
ap.add_argument("--db", default=os.path.join(ROOT, "db"))
args = ap.parse_args()
OUT = os.path.join(ROOT, "devpage-areas")
os.makedirs(OUT, exist_ok=True)

# ---------- 블록 → 모양 ----------
INVISIBLE = {"air", "cave_air", "void_air", "barrier", "structure_void", "light_block", "moving_block", "piston_arm_collision"}
PLANTS = {"short_grass", "tall_grass", "tallgrass", "fern", "large_fern", "deadbush", "dead_bush", "sweet_berry_bush", "wheat", "carrots",
          "potatoes", "beetroot", "reeds", "sugar_cane", "double_plant", "sunflower", "lilac", "rose_bush", "peony", "red_mushroom",
          "brown_mushroom", "red_flower", "yellow_flower", "dandelion", "poppy", "blue_orchid", "allium", "azure_bluet", "oxeye_daisy",
          "cornflower", "lily_of_the_valley", "wither_rose", "torchflower", "pitcher_plant", "sapling", "bamboo_sapling", "nether_sprouts",
          "crimson_roots", "warped_roots", "seagrass", "kelp", "cocoa", "web", "pointed_dripstone", "cave_vines", "glow_lichen"}
FLAT = {"rail", "golden_rail", "detector_rail", "activator_rail", "carpet", "waterlily", "pink_petals", "redstone_wire", "snow_layer",
        "wooden_pressure_plate", "stone_pressure_plate", "light_weighted_pressure_plate", "heavy_weighted_pressure_plate", "leaf_litter"}
SMALL = {"torch", "redstone_torch", "unlit_redstone_torch", "soul_torch", "lantern", "soul_lantern", "flower_pot", "end_rod", "bamboo", "lightning_rod"}
SKIP = ("button", "sign", "chalkboard", "frame", "banner", "skull", "lever", "tripwire", "ladder", "item_frame")
TRANSPARENT = ("leaves", "glass", "ice", "slime", "honey_block", "mob_spawner", "beacon", "cactus")
REL = ["weirdo_direction", "upside_down_bit", "minecraft:vertical_half", "top_slot_bit", "pillar_axis", "direction", "open_bit",
       "upper_block_bit", "vine_direction_bits", "height", "stone_brick_type", "stone_slab_type", "stone_slab_type_2", "stone_slab_type_3",
       "stone_slab_type_4", "wood_type", "sand_type", "color", "minecraft:cardinal_direction"]

def shape_of(name, st):
    if name in INVISIBLE or name.startswith("light_block") or any(s in name for s in SKIP): return {"s": "none"}
    if name in ("water", "flowing_water"): return {"s": "water"}
    if name in ("lava", "flowing_lava"): return {"s": "lava"}
    if name.endswith("_slab") or name.startswith("stone_block_slab") or name in ("wooden_slab", "stone_slab"):
        top = st.get("minecraft:vertical_half") == "top" or st.get("top_slot_bit") in (1, True)
        return {"s": "slab", "top": int(bool(top))}
    if name.endswith("_stairs"): return {"s": "stairs", "dir": int(st.get("weirdo_direction", 0)), "up": int(bool(st.get("upside_down_bit", 0)))}
    if name.endswith("_fence") or name == "fence": return {"s": "fence"}
    if name.endswith("_wall"): return {"s": "wall"}
    if name.endswith("glass_pane") or name == "iron_bars": return {"s": "pane"}
    if name.endswith("_door"): return {"s": "door", "dir": int(st.get("direction", 0)), "open": int(bool(st.get("open_bit", 0)))}
    if name.endswith("trapdoor"): return {"s": "trapdoor", "open": int(bool(st.get("open_bit", 0))), "up": int(bool(st.get("upside_down_bit", 0))), "dir": int(st.get("direction", 0))}
    if name == "vine": return {"s": "vine", "bits": int(st.get("vine_direction_bits", 0))}
    if name in FLAT or name.endswith("_carpet") or name.endswith("pressure_plate"):
        return {"s": "flat", "h": (int(st.get("height", 0)) + 1) * 2 if name == "snow_layer" else 1}
    if name in SMALL: return {"s": "small"}
    if name in PLANTS or name.endswith("_sapling") or name.endswith("_flower") or name.endswith("_tulip") or name.endswith("_roots"): return {"s": "cross"}
    return {"s": "cube", "t": int(any(t in name for t in TRANSPARENT))}

FACES = ["east", "west", "up", "down", "south", "north"]   # +x −x +y −y +z −z (three.js BoxGeometry 순서)
def axis_faces(f, st):  # 원목처럼 축이 누운 블록: 위·아래 그림을 축 방향 면으로
    ax = st.get("pillar_axis", "y")
    if ax == "x": return {**f, "east": f["up"], "west": f["down"], "up": f["north"], "down": f["north"]}
    if ax == "z": return {**f, "south": f["up"], "north": f["down"], "up": f["east"], "down": f["east"]}
    return f

# ---------- 텍스처 묶음 ----------
TEX = {"now": blocktex.Tex(True), "van": blocktex.Tex(False)}
TINT = {"water": "#44aff5", "flowing_water": "#44aff5"}
tiles, tile_img = {}, []
def tile(ft, extra_tint=None):
    """(파일, 덧칠) → 묶음 칸 번호. 못 찾으면 −1."""
    if not ft: return -1
    key = (ft, extra_tint)
    if key in tiles: return tiles[key]
    f, color = ft
    im = Image.open(f).convert("RGBA")
    w, h = im.size
    if h > w: im = im.crop((0, 0, w, w))                    # 세로로 쌓인 애니메이션 → 첫 프레임
    if im.size != (16, 16): im = im.resize((16, 16), Image.NEAREST)
    a = np.array(im).astype(np.float32)
    def mul(mask, hexc):
        c = np.array([int(hexc[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255
        a[mask, :3] = a[mask, :3] * c
    if color:
        kind, hexc = color
        if kind == "tint": mul(np.ones(a.shape[:2], bool), hexc)
        else:                                               # overlay: 회색 부분(풀 옆면 윗단 등)만
            rgb = a[:, :, :3]; mul((rgb.max(2) - rgb.min(2) < 12) & (a[:, :, 3] > 0), hexc)
    if extra_tint: mul(np.ones(a.shape[:2], bool), extra_tint)
    tiles[key] = len(tile_img); tile_img.append(Image.fromarray(a.clip(0, 255).astype(np.uint8)))
    return tiles[key]

types, type_ids = [{"n": "air", "s": "none"}], {}
def type_of(name, st):
    key = name + "|" + json.dumps({k: st[k] for k in REL if k in st}, sort_keys=True)
    if key in type_ids: return type_ids[key]
    sh = shape_of(name, st)
    if sh["s"] == "none": type_ids[key] = 0; return 0   # 공기·방벽·조명 블록 등 보이지 않는 것은 모두 빈칸(0)
    t = {"n": name, **sh}
    if sh["s"] != "none":
        for which, tx in TEX.items():
            f = axis_faces(tx.faces(name, st), st)
            t[which] = [tile(f[k], TINT.get(name)) for k in FACES]
    type_ids[key] = len(types); types.append(t)
    return type_ids[key]

# ---------- 구역 ----------
# 처음 보여 줄 높이(월드 Y): 동굴 속 공방·숲 지붕 아래 정원은 그 위를 잘라야 보인다
VIEW = {"craft": {"yMax": 71}, "grid": {"yMax": 72}}
areas = mcworld.ARENAS
def want(cx, cz, sy):
    return any(cx * 16 + 15 >= b[0] and cx * 16 <= b[2] and cz * 16 + 15 >= b[1] and cz * 16 <= b[3] and sy * 16 + 15 >= b[4] and sy * 16 <= b[5] for _, _, b in areas)
chunks = mcworld.subchunks(args.db, want)
print(f"하위 청크 {len(chunks)}개 읽음")
for aid, title, (x1, z1, x2, z2, y1, y2) in areas:
    sx, sy_, sz = x2 - x1 + 1, y2 - y1 + 1, z2 - z1 + 1
    grid = np.zeros((sy_, sz, sx), np.uint16)                 # [y][z][x]
    for (cx, cz, sy), v in chunks.items():
        bx, bz, by = cx * 16, cz * 16, sy * 16
        if bx + 15 < x1 or bx > x2 or bz + 15 < z1 or bz > z2 or by + 15 < y1 or by > y2: continue
        d = mcworld.decode(v)
        if d is None: continue
        idx, pal = d
        ids = np.array([type_of(n, s) for n, s in pal], np.uint16)
        X, Y, Z = bx + mcworld.LX, by + mcworld.LY, bz + mcworld.LZ
        m = (X >= x1) & (X <= x2) & (Z >= z1) & (Z <= z2) & (Y >= y1) & (Y <= y2)
        grid[Y[m] - y1, Z[m] - z1, X[m] - x1] = ids[idx[m]]
    raw = zlib.compress(grid.tobytes(), 9)[2:-4]              # raw deflate (브라우저 DecompressionStream('deflate-raw'))
    body = {"id": aid, "title": title, "box": [x1, z1, x2, z2, y1, y2], "size": [sx, sy_, sz], "view": VIEW.get(aid, {}), "data": base64.b64encode(raw).decode()}
    with open(os.path.join(OUT, aid + ".js"), "w", encoding="utf8") as f:
        f.write("(window.AREAS = window.AREAS || {})[" + json.dumps(aid) + "] = " + json.dumps(body, ensure_ascii=False) + ";\n")
    solid = int((grid > 0).sum())
    print(f"  {aid:14s} {sx}×{sy_}×{sz}  블록 {solid:,}  → {len(raw) / 1024:.0f} KB")

# 블록 종류 표 + 텍스처 묶음 (원본·현재 칸을 한 장에)
COLS = 32
rows = max(1, -(-len(tile_img) // COLS))
atlas = Image.new("RGBA", (COLS * 16, rows * 16))
for i, im in enumerate(tile_img): atlas.paste(im, ((i % COLS) * 16, (i // COLS) * 16))
buf = io.BytesIO(); atlas.save(buf, "PNG")
missing = sorted({t["n"] for t in types if t.get("now") and -1 in t["now"]})
blocks = {"cols": COLS, "rows": rows, "atlas": "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode(), "types": types}
with open(os.path.join(OUT, "blocks.js"), "w", encoding="utf8") as f:
    f.write("window.AREA_BLOCKS = " + json.dumps(blocks, ensure_ascii=False, separators=(",", ":")) + ";\n")
print(f"블록 종류 {len(types)}개, 텍스처 칸 {len(tile_img)}개" + (f", 그림 못 찾음: {', '.join(missing)}" if missing else ""))
