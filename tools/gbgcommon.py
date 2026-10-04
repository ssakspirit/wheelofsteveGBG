"""경복궁 월드에서 건물을 옮겨 오는 도구들이 같이 쓰는 것 — 블록 돌리기·바꾸기, 새 이름, 덩어리 찾기, 조각·놓기 함수 쓰기.
tools/gbg-arena.py 가 쓴다 (tools/gbg-lobby.py 는 같은 내용을 자기 안에 갖고 있다 — 다 놓은 도구라 그대로 둔다).
"""
import os, sys, re, shutil, tempfile, glob, time
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import mcstruct
from mcstruct import B, S, block, name_of, states_of

V_OLD = 18035200                                          # 1.19.51 — 옛 이름(wooden_slab, fence …)으로 만들면 게임이 새 이름으로 바꿔 불러온다
KEEP_NAMES = {"barrier", "light_block", "command_block", "repeating_command_block", "chain_command_block", "structure_block",
              "structure_void", "allow", "deny", "border_block"}

NATURAL = {"air", "grass_block", "grass", "dirt", "coarse_dirt", "podzol", "stone", "granite", "diorite", "andesite", "gravel", "sand",
           "sandstone", "clay", "water", "flowing_water", "bedrock", "short_grass", "tall_grass", "tallgrass", "fern", "large_fern",
           "poppy", "dandelion", "red_flower", "yellow_flower", "double_plant", "grass_path", "dirt_path", "coal_ore", "iron_ore",
           "copper_ore", "gold_ore", "redstone_ore", "lapis_ore", "diamond_ore", "emerald_ore", "seagrass", "kelp", "azure_bluet",
           "oxeye_daisy", "cornflower", "blue_orchid", "allium", "lily_of_the_valley", "red_tulip", "orange_tulip", "white_tulip",
           "pink_tulip", "sunflower", "lilac", "rose_bush", "peony", "sweet_berry_bush", "deadbush", "snow_layer"}
PLANTS = {"short_grass", "tall_grass", "tallgrass", "fern", "large_fern", "double_plant", "red_flower", "yellow_flower", "poppy", "dandelion",
          "azure_bluet", "oxeye_daisy", "cornflower", "blue_orchid", "allium", "lily_of_the_valley", "red_tulip", "orange_tulip",
          "white_tulip", "pink_tulip", "sunflower", "lilac", "rose_bush", "peony", "sweet_berry_bush", "deadbush"}
SOIL = {"grass_block", "grass", "dirt", "coarse_dirt", "stone", "granite", "polished_granite", "diorite", "andesite", "gravel", "podzol",
        "sand", "grass_path", "dirt_path", "clay"}
GIWA = {"oak_stairs", "oak_slab", "oak_double_slab"}     # 리소스팩에서 기와로 보이는 블록 (옛 이름 wooden_slab·double_wooden_slab oak 포함)

def copy_db(world):
    dst = os.path.join(tempfile.mkdtemp(prefix="gbg-db-"), "db")
    shutil.copytree(os.path.join(world, "db"), dst, ignore=shutil.ignore_patterns("LOCK"))
    return dst

# ---------- 돌리기 · 바꾸기 ----------
SWAP_NS = {"north": "south", "south": "north", "east": "west", "west": "east"}
def rot180(b):
    n = name_of(b); st = dict(b.get("states", (10, {}))[1])
    for k, (t, v) in list(st.items()):
        if k == "weirdo_direction": st[k] = (t, {0: 1, 1: 0, 2: 3, 3: 2}[v])
        elif k == "facing_direction" and v >= 2: st[k] = (t, {2: 3, 3: 2, 4: 5, 5: 4}[v])
        elif k == "direction" and "trapdoor" in n: st[k] = (t, {0: 1, 1: 0, 2: 3, 3: 2}[v])   # 덫문은 동·서·남·북 순서
        elif k == "direction": st[k] = (t, (v + 2) % 4)                                          # 문·울타리 문·침대·옛 모루
        elif k == "ground_sign_direction": st[k] = (t, (v + 8) % 16)
        elif k in ("minecraft:cardinal_direction", "torch_facing_direction"): st[k] = (t, SWAP_NS.get(v, v))
        elif k == "rail_direction" and v >= 2: st[k] = (t, {2: 3, 3: 2, 4: 5, 5: 4, 6: 8, 7: 9, 8: 6, 9: 7}[v])
        elif k == "vine_direction_bits": st[k] = (t, ((v & 1) << 2) | ((v & 4) >> 2) | ((v & 2) << 2) | ((v & 8) >> 2))
    for a, c in (("east", "west"), ("north", "south")):
        ka, kc = "wall_connection_type_" + a, "wall_connection_type_" + c
        if ka in st and kc in st: st[ka], st[kc] = st[kc], st[ka]
    out = dict(b); out["states"] = (10, st)
    return out

def convert(b):
    """경복궁 블록 → 이 월드에서 궁궐답게 보이는 블록 (리소스팩이 바꿔 둔 것)."""
    n, st, ver = name_of(b), b.get("states", (10, {}))[1], b.get("version", (3, V_OLD))[1]
    sv = lambda k: st.get(k, (8, None))[1]
    if n == "nether_brick_stairs": return block("oak_stairs", st, ver)                                         # 기와
    if n == "nether_brick": return block("double_wooden_slab", {"wood_type": S("oak"), "top_slot_bit": B(0)}, V_OLD)
    if n in ("stone_block_slab", "double_stone_block_slab") and sv("stone_slab_type") == "nether_brick":
        return block(n.replace("stone_block_slab", "wooden_slab"), {"wood_type": S("oak"), "top_slot_bit": st.get("top_slot_bit", B(0))}, V_OLD)
    if n == "nether_brick_slab": return block("oak_slab", st, ver)
    if n == "nether_brick_double_slab": return block("oak_double_slab", st, ver)
    if (n == "log" and sv("old_log_type") == "oak" or n == "oak_log") and sv("pillar_axis") in ("y", None):
        return block("stripped_oak_log", {"pillar_axis": S("y")}, ver)                                         # 붉은 기둥
    if n.endswith("_door") or n == "wooden_door": return block("glass_pane", {}, ver)                         # 띠살 창호
    if n.endswith("fence_gate"):
        wood = n[:-len("_fence_gate")] if n != "fence_gate" else "oak"
        return block("fence", {"wood_type": S(wood)}, V_OLD)
    return b

SLAB_RE = re.compile(r"^(double_)?stone_(?:block_)?slab(\d?)$")
SLAB_TYPES = {
    "": {"smooth_stone": "smooth_stone", "sandstone": "sandstone", "wood": "oak", "cobblestone": "cobblestone", "brick": "brick",
         "stone_brick": "stone_brick", "quartz": "quartz", "nether_brick": "nether_brick"},
    "2": {"red_sandstone": "red_sandstone", "purpur": "purpur", "prismarine_rough": "prismarine", "prismarine_dark": "dark_prismarine",
          "prismarine_brick": "prismarine_brick", "mossy_cobblestone": "mossy_cobblestone", "smooth_sandstone": "smooth_sandstone", "red_nether_brick": "red_nether_brick"},
    "3": {"end_stone_brick": "end_stone_brick", "smooth_red_sandstone": "smooth_red_sandstone", "polished_andesite": "polished_andesite",
          "andesite": "andesite", "diorite": "diorite", "polished_diorite": "polished_diorite", "granite": "granite", "polished_granite": "polished_granite"},
    "4": {"mossy_stone_brick": "mossy_stone_brick", "smooth_quartz": "smooth_quartz", "stone": "normal_stone", "cut_sandstone": "cut_sandstone",
          "cut_red_sandstone": "cut_red_sandstone"},
}
FLOWERS = {"poppy": "poppy", "orchid": "blue_orchid", "allium": "allium", "houstonia": "azure_bluet", "tulip_red": "red_tulip", "tulip_orange": "orange_tulip",
           "tulip_white": "white_tulip", "tulip_pink": "pink_tulip", "oxeye": "oxeye_daisy", "cornflower": "cornflower", "lily_of_the_valley": "lily_of_the_valley"}
PLANT2 = {"sunflower": "sunflower", "syringa": "lilac", "grass": "tall_grass", "fern": "large_fern", "rose": "rose_bush", "paeonia": "peony"}
def modern(b):
    """미리보기용 지금 이름 (리소스팩이 바꾼 그림을 고르려면 새 이름이어야 한다)."""
    n, st = name_of(b), states_of(b)
    w = st.get("wood_type") or "oak"
    half = lambda: {"minecraft:vertical_half": "top" if st.get("top_slot_bit") else "bottom"}
    if n == "planks": return w + "_planks", {}
    if n == "wooden_slab": return w + "_slab", half()
    if n == "double_wooden_slab": return w + "_double_slab", {}
    if n == "fence": return w + "_fence", {}
    if n == "log": return st.get("old_log_type", "oak") + "_log", {"pillar_axis": st.get("pillar_axis", "y")}
    if n == "log2": return st.get("new_log_type", "acacia") + "_log", {"pillar_axis": st.get("pillar_axis", "y")}
    if n == "stonebrick": return {"mossy": "mossy_stone_bricks", "cracked": "cracked_stone_bricks", "chiseled": "chiseled_stone_bricks"}.get(st.get("stone_brick_type"), "stone_bricks"), {}
    m = SLAB_RE.match(n)
    if m:                                                 # stone_slab·stone_block_slab(2~4) · double_… → 새 반 블록 이름
        dbl, num = bool(m.group(1)), m.group(2) or ""
        key = "stone_slab_type" + ("_" + num if num else "")
        base = SLAB_TYPES[num].get(st.get(key), "smooth_stone")
        return (base + "_double_slab", {}) if dbl else (base + "_slab", half())
    if n == "stone": return {"andesite_smooth": "polished_andesite", "granite": "granite", "granite_smooth": "polished_granite", "diorite": "diorite",
                             "diorite_smooth": "polished_diorite", "andesite": "andesite"}.get(st.get("stone_type"), "stone"), {}
    if n == "sandstone": return {"cut": "cut_sandstone", "smooth": "smooth_sandstone", "heiroglyphs": "chiseled_sandstone"}.get(st.get("sand_stone_type"), "sandstone"), {}
    if n in ("wool", "concrete"): return st.get("color", "white") + "_" + n, {}
    if n == "stained_hardened_clay": return st.get("color", "white") + "_terracotta", {}
    if n == "leaves": return st.get("old_leaf_type", "oak") + "_leaves", {}
    if n == "leaves2": return st.get("new_leaf_type", "acacia") + "_leaves", {}
    if n == "red_flower": return FLOWERS.get(st.get("flower_type"), "poppy"), {}
    if n == "yellow_flower": return "dandelion", {}
    if n == "double_plant": return PLANT2.get(st.get("double_plant_type"), "tall_grass"), {}
    if n == "tallgrass": return "fern" if st.get("tall_grass_type") == "fern" else "short_grass", {}
    if n == "grass": return "grass_block", {}
    if n == "tallgrass": return "short_grass", {}
    if n == "dirt": return "dirt", {}
    if n == "quartz_block": return "quartz_block", {"pillar_axis": st.get("pillar_axis", "y")}
    return n, st

# ---------- 공통 ----------
DIRS = [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)]
def components(mask, seeds=None):
    """6방향으로 이어진 덩어리들 (좌표 배열 목록). seeds가 있으면 거기서 닿는 것만."""
    seen = np.zeros(mask.shape, bool); out = []
    starts = np.argwhere(mask) if seeds is None else np.argwhere(mask & seeds)
    sh = mask.shape
    for s in map(tuple, starts):
        if seen[s]: continue
        st = [s]; seen[s] = True; comp = []
        while st:
            p = st.pop(); comp.append(p)
            for d in DIRS:
                q = (p[0] + d[0], p[1] + d[1], p[2] + d[2])
                if 0 <= q[0] < sh[0] and 0 <= q[1] < sh[1] and 0 <= q[2] < sh[2] and mask[q] and not seen[q]:
                    seen[q] = True; st.append(q)
        out.append(np.array(comp))
    return out

def dilate(m, n, horizontal=False):
    for _ in range(n):
        o = m.copy()
        o[1:] |= m[:-1]; o[:-1] |= m[1:]; o[..., 1:] |= m[..., :-1]; o[..., :-1] |= m[..., 1:]
        if not horizontal and m.ndim == 3: o[:, 1:] |= m[:, :-1]; o[:, :-1] |= m[:, 1:]
        m = o
    return m

