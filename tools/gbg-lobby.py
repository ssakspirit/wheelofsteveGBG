"""경복궁 월드의 궁궐을 어전대회 로비 섬으로 옮기는 구조물을 만든다. 두 월드 모두 읽기만 한다 (db를 복사해서 읽으니 게임이 켜져 있어도 된다).

  python tools/gbg-lobby.py [--restore]
  → behavior_packs/bp0/structures/gbg/new_<z>_<x>.mcstructure   옮긴 뒤 모습 (64칸 조각, 바뀌는 칸을 감싼 상자만) — git에 올리지 않는다
    behavior_packs/bp0/functions/gbg/lobby_build.mcfunction      게임에서 /function gbg/lobby_build
    behavior_packs/bp0/functions/gbg/go_1~4.mcfunction           섬 네 귀퉁이 하늘로 (조각은 불러와진 곳에만 놓이므로 네 곳에서 한 번씩)
    devpage-areas/plans/plan_*.npz                               개발자 페이지 '월드 건축' 탭 미리보기 (python tools/export-areas.py 가 3D로)
    --restore 를 주면 old_*.mcstructure + lobby_restore.mcfunction (지금 모습)도 쓴다. 없으면 되돌리기는 git의 db/ 로.

배치 (로비는 플레이어가 +Z를 보고 들어오므로 경복궁 월드의 북쪽(−Z)을 로비의 +Z로 180° 돌린다):
  광화문 — 로비 도착 건물 자리. 가운데 홍예문 안이 도착점 (1, 60, 1000). 궁장은 섬 폭 전체로, 땅 높이를 따라 놓는다.
  궁궐 — 궁장 안쪽(Z 1004~)은 근정전을 포털 뒤에 둔 채 실제 배치 그대로: 근정전 좌우 회랑이 남쪽으로 궁장까지 이어지고,
         동쪽에 궐내각사·수정전·경회루, 서쪽에 동궁, 뒤에 사정전·강녕전. 근정문·앞 회랑 자리(광장)는 비워 둔다.
         조각 가장자리에서 잘리는 작은 전각은 통째로 뺀다.
  광장 — 광화문과 포털 사이: 밭·집을 걷고 잔디·흙을 박석, 드러난 단 옆면을 장대석으로. 팀 선택 홀·포털·혼천의는 그대로.
  마을 — 섬의 옛 마을 집은 모두 걷어 내고 바닥 자리는 풀로 메운다 (나무는 둔다).
바꾸는 블록: 지붕(네더 벽돌) → 참나무 계단·반 블록(리소스팩의 기와), 지붕 둘레 참나무 판자 → 짙은 참나무 판자,
             세운 참나무 원목 → 벗긴 참나무 원목(붉은 기둥), 문 → 판유리(띠살 창호), 울타리 문 → 울타리 (누를 수 있는 블록은 쓰지 않는다).
"""
import os, sys, json, shutil, tempfile, glob, warnings
warnings.filterwarnings("ignore", "All-NaN slice")
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import mcstruct
from mcstruct import B, S, block, name_of, states_of

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
BP = os.path.join(ROOT, "behavior_packs", "bp0")
WORLDS = os.path.dirname(ROOT)
GBG = os.path.join(WORLDS, "n1lV7gB3Eyo=")
RESTORE = "--restore" in sys.argv

# ---------- 설정 (로비 좌표, 상자는 x1 y1 z1 x2 y2 z2 양 끝 포함) ----------
REGION = (-260, 40, 850, 255, 130, 1630)                 # 로비 섬(X −194~191, Z 856~1247) + 둘레 공허 — 경복궁 궁장 전체가 들어간다
# 180° 돌림: 로비 x = cx − x, z = cz − z, y = y + dy
PAL_T = (198, 226, 1)                                     # 궁궐(근정전 기준) — 경복궁 지면 Y 63 → 로비 Y 64
GATE_T = (198, 432, -4)                                   # 광화문 — 지면 Y 63 → 로비 광장 Y 59
PALACE_SRC = (-57, 58, -1404, 458, 95, -778)              # → 로비 X −260~255, Z 1004~1630 (북쪽 궁장·동서 궁장 바깥 몇 칸까지)
CLEAR_UP = 130                                            # 궁궐 자리 위(아치·언덕·나무)는 여기까지 비운다
STRIP = (-50, 1004, 50, 1047)                             # 광장 x1 z1 x2 z2 — 궁궐을 붙이지 않고 박석으로 포장
STRIP_TOP = 64                                            # 광장 땅이 이보다 높으면 깎는다 (회랑 바닥 높이)
GATE_SRC = (-57, 63, -577, 458, 92, -563)
GATE_FULL = (177, 63, -576, 213, 92, -564)                # 홍예문 상자: 공기까지 그대로 (옛 도착 건물 자리를 비운다)
GATE_BUILT = [(-15, 64, -575, 415, 92, -563), (177, 64, -577, 213, 92, -576)]   # 궁장 몸체 + 문루 처마
GROUND_GBG = 63
# 지키는 곳: 이 상자에 닿은 놓은 블록 덩어리는 지우지 않고, 상자 안 놓은 블록은 바꾸지 않는다 (광장 상자 안 잔디·흙만 박석으로)
KEEP = [("팀 선택 홀·시작 버튼·안내판·팀 발판", (-46, 55, 1008, -23, 90, 1028)),
        ("포털·받침대·방벽·호스트 NPC 자리", (-28, 55, 1032, 29, 90, 1046)),
        ("혼천의 자리", (-3, 55, 1019, 5, 70, 1025)),
        ("팀 초기화 발판 (원작, 섬 서쪽 공중)", (-203, 64, 1055, -195, 75, 1063))]
HARD = [(-46, 55, 1008, -23, 90, 1028)]                   # 팀 선택 홀: 궁궐·광장 단계는 손대지 않고, 아래 '홀 단장' 단계만 고친다
# 게임이 실제로 쓰는 칸 — 홀 단장도 바꾸지 않는다 (bp0 functions에서 찾은 좌표)
CRIT = [(-31, 64, 1012, -26, 69, 1017), (-31, 64, 1020, -26, 69, 1025),   # 홍포대·청포대 발판 + 감지 공간 (보내는 자리 -29 65 1014/1022 포함)
        (-43, 65, 1018, -43, 67, 1018),                                     # 홀 도착 자리 (-43 65 1018) — 발밑 바닥은 단단하기만 하면 된다
        (-45, 65, 1018, -44, 67, 1018),                                     # 금 블록 · 시작 버튼 · 표지판 (표지판은 -45 65 1018 돌에 붙어 있다)
        (-34, 65, 1017, -33, 69, 1019),                                     # 안내판 (게임이 구조물로 덮어씀)
        (-33, 68, 1011, -33, 68, 1011), (-33, 68, 1017, -33, 68, 1017), (-33, 68, 1019, -33, 68, 1019), (-33, 68, 1025, -33, 68, 1025),
        (-203, 67, 1055, -195, 75, 1063)]                                  # 팀 초기화 상자 (utility/score_reset: 여기 선 플레이어는 팀 0) — 초록 발판과 그 위  # 한국어 걸이 표지판
CLEAR = [(-30, 60, 997, 34, 80, 1009)]                    # 옛 도착 건물·울타리·초롱 줄 (길과 이어져 있어 따로 지운다)
SPAWN = (1, 60, 1000)
CAMERAS = [((0, 109, 1092), (0, 66.8, 1014)), ((1, 62.3, 1004), (1, 62.8, 1015))]
GO = [(x, 130, z) for z in (945, 1140, 1335, 1530) for x in (-172, 0, 172)]   # 12곳, 서로 약 190칸 간격
BASE_COMMIT = "c759d1d"                                  # 경복궁을 놓기 전 로비 (옛 마을·아치가 있던 모습) — 이것을 원본으로 계산한다
PAD = (-203, 1055, -195, 1063, 67)                       # 초록 발판 x1 z1 x2 z2 y: 아래를 장대석 기단으로 받치고 둘레 PAD_MARGIN칸은 궁궐 블록을 비운다
PAD_MARGIN = 4
LAWN = (-260, 856, 255)                                  # 궁장 바깥 잔디밭: 공허였던 곳도 이 x 범위 · z 856부터 땅을 깐다
BARRIER_H = 3                                            # 땅 가장자리 둘레에 보이지 않는 방벽 높이 (공허로 떨어지지 않게)
#   # 조각을 불러올 때 설 곳 (섬 네 귀퉁이 하늘)
OUT_Z, FLAT_Y = 1003, 59                                  # 궁장 바깥(이 Z까지)을 광화문 바닥 높이로 고른다
GATE_FRONT = (-40, 960, 42, 998)                          # 광화문 앞 마당 x1 z1 x2 z2: 나무를 모두 걷어 정문이 트이게
PULL_IN = 16                                              # 궁장 선에 걸친 전각: 이만큼 안에서 끝나면 궁장 안으로 밀어 넣는다
SPAN = 64                                                 # 가장자리에서 잘리는 전각: 이보다 작은 덩어리는 통째로 뺀다

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

import re
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

# ---------- 읽기 ----------
def base_db():                                          # git에 저장된 경복궁 놓기 전 db
    import subprocess, tarfile, io
    out = subprocess.run(["git", "-C", ROOT, "archive", BASE_COMMIT, "db"], capture_output=True, check=True).stdout
    dst = tempfile.mkdtemp(prefix="gbg-base-")
    tarfile.open(fileobj=io.BytesIO(out)).extractall(dst)
    return os.path.join(dst, "db")
print("로비 읽는 중… (원본 %s)" % BASE_COMMIT)
LR = mcstruct.read_region(base_db(), REGION)
x1, y1, z1, x2, y2, z2 = REGION
pal = LR.palette                                          # 로비 팔레트에 경복궁 블록도 더해 하나로 쓴다
OLD = LR.grid
NEW = OLD.copy()
SH = OLD.shape
def L(x, y, z): return x - x1, y - y1, z - z1
def inbox(p, bx): return bx[0] <= p[0] <= bx[3] and bx[1] <= p[1] <= bx[4] and bx[2] <= p[2] <= bx[5]
def boxmask(bx):
    m = np.zeros(SH, bool)
    a = L(max(bx[0], x1), max(bx[1], y1), max(bx[2], z1)); b_ = L(min(bx[3], x2), min(bx[4], y2), min(bx[5], z2))
    if all(a[i] <= b_[i] for i in range(3)): m[a[0]:b_[0] + 1, a[1]:b_[1] + 1, a[2]:b_[2] + 1] = True
    return m
tab = {}
def table(name, test):                                    # 팔레트 번호 → 참/거짓 (팔레트가 늘면 다시 만든다)
    t = tab.get(name)
    if t is None or len(t) != len(pal):
        t = np.array([test(b) for b in pal] + [False]); t = t[:len(pal)]; tab[name] = t
    return t
nat_t = lambda: table("nat", lambda b: name_of(b) in NATURAL or (name_of(b).endswith("leaves") and not states_of(b).get("persistent_bit")))
leaf_t = lambda: table("leaf", lambda b: name_of(b).endswith("leaves") and not states_of(b).get("persistent_bit"))
soil_t = lambda: table("soil", lambda b: name_of(b) in SOIL)
plant_t = lambda: table("plant", lambda b: name_of(b) in PLANTS or name_of(b) in ("wheat", "carrots", "potatoes", "beetroot", "reeds", "sugar_cane"))
water_t = lambda: table("water", lambda b: name_of(b) in ("water", "flowing_water"))
log_t = lambda: table("log", lambda b: name_of(b).endswith("_log") or name_of(b) in ("log", "log2"))
GRASS = LR.pid(block("grass_block", {}, 18168865)); DIRT = LR.pid(block("dirt", {"dirt_type": S("normal")}, V_OLD))
PAVE = LR.pid(block("smooth_stone", {}, 18168865)); RISER = LR.pid(block("stone_bricks", {}, 18168865))
DARK = LR.pid(block("planks", {"wood_type": S("dark_oak")}, V_OLD))

keep_box = np.zeros(SH, bool)
for _, bx in KEEP: keep_box |= boxmask(bx)
hard = np.zeros(SH, bool)
for bx in HARD: hard |= boxmask(bx)
X = np.arange(x1, x2 + 1)[:, None]; Z = np.arange(z1, z2 + 1)[None, :]
strip2 = (X >= STRIP[0]) & (X <= STRIP[2]) & (Z >= STRIP[1]) & (Z <= STRIP[3])
ys = np.arange(y1, y2 + 1)[None, :, None]
soil0 = soil_t()[OLD]
ground = np.where(soil0.any(1), SH[1] - 1 - soil0[:, ::-1, :].argmax(1) + y1, y1)   # 열마다 맨 위 흙·돌 높이

# ---------- 1. 옛 마을 걷어 내기 ----------
built0 = ~nat_t()[OLD] & (OLD > 0)
removed = np.zeros(SH, bool); kept_big = []
pure_log = table("purelog", lambda b: name_of(b).endswith("_log") or name_of(b) in ("log", "log2"))
keep_name = table("keepname", lambda b: name_of(b) in KEEP_NAMES or name_of(b).startswith("light_block"))
n_houses = 0
for c in components(built0):
    ids = OLD[c[:, 0], c[:, 1], c[:, 2]]
    if keep_box[c[:, 0], c[:, 1], c[:, 2]].any() or keep_name[ids].any(): continue
    if pure_log[ids].all(): continue                                         # 나무 줄기
    span = c.max(0) - c.min(0)
    if span[0] > SPAN or span[2] > SPAN:
        kept_big.append((len(c), tuple(c.min(0) + (x1, y1, z1)), tuple(c.max(0) + (x1, y1, z1)))); continue
    removed[c[:, 0], c[:, 1], c[:, 2]] = True; n_houses += 1
for bx in CLEAR: removed |= boxmask(bx) & built0 & ~hard
# 걷은 집 자리 안의 물(우물·밭 물길)도 함께 걷는다 — 바다·연못(Y 62 아래)은 그대로
foot = dilate(removed.any(1), 1)
removed |= water_t()[OLD] & foot[:, None, :] & (ys >= 60) & ~keep_box
NEW[removed] = 0
# 바닥 자리 메우기: 둘레 땅 높이(15×15 가운데값, 집 자리 밖만)까지는 흙, 맨 위는 풀
from numpy.lib.stride_tricks import sliding_window_view
gfl = np.where(foot, np.nan, ground.astype(float))
H2 = np.nanmedian(sliding_window_view(np.pad(gfl, 7, mode="edge"), (15, 15)), axis=(2, 3))
H2 = np.where(np.isnan(H2), ground, H2).astype(int)
fill = removed & (ys <= H2[:, None, :])
NEW[fill] = DIRT
for a, c_ in np.argwhere(foot):                           # 집 자리 열의 맨 위 흙은 풀로
    col = NEW[a, :, c_]; sm = soil_t()[col]
    if sm.any():
        j = SH[1] - 1 - int(np.argmax(sm[::-1]))
        if name_of(pal[col[j]]) == "dirt" and (j + 1 >= SH[1] or col[j + 1] == 0 or plant_t()[col[j + 1]]): NEW[a, j, c_] = GRASS
# 돌로 쌓은 망루처럼 둘레보다 크게 솟은 좁은 기둥은 깎는다 (자연 돌이라 덩어리 찾기에 안 걸린다)
g1 = np.where(soil_t()[NEW].any(1), SH[1] - 1 - soil_t()[NEW][:, ::-1, :].argmax(1), 0)
pad = np.pad(g1, 4, mode="edge")
med = np.median(sliding_window_view(pad, (9, 9)), axis=(2, 3)).astype(int)
spike = (g1 - med > 6) & ~keep_box.any(1)
for a, c_ in np.argwhere(spike):
    NEW[a, med[a, c_] + 1:, c_][nat_t()[NEW[a, med[a, c_] + 1:, c_]]] = 0
    NEW[a, med[a, c_], c_] = GRASS; removed[a, med[a, c_]:, c_] = True

# ---------- 1b. 궁장 바깥: 광화문 바닥 높이(Y 59) 잔디밭으로 평탄화 ----------
# 바다·연못도 흙으로 메워 모두 잔디로 덮는다 (궁장 안 경회루 연못·물길은 그대로). 언덕 위 나무(밑동 > Y 63)와 광화문 앞 나무는 걷고,
# 낮은 곳 나무는 줄기를 땅까지 내린다.
south = (np.arange(z1, z2 + 1) <= OUT_Z)[None, :] & ~keep_box.any(1)
wetb = table("wet", lambda b: name_of(b) in ("water", "flowing_water", "seagrass", "kelp", "tall_seagrass", "kelp_plant", "waterlily", "bubble_column"))
wetm = wetb[NEW] & south[:, None, :]
NEW[wetm] = DIRT; removed |= wetm
sm = soil_t()[NEW]
gtop = np.where(sm.any(1), SH[1] - 1 - sm[:, ::-1, :].argmax(1) + y1, -999)
land = (gtop > -999) & south
lg = log_t()[NEW] & land[:, None, :]
lbase = np.where(lg.any(1), lg.argmax(1) + y1, 10 ** 6)
flat_n = 0
for a, c_ in np.argwhere(land):
    col = NEW[a, :, c_]; j59 = FLAT_Y - y1
    b0 = lbase[a, c_]
    front = GATE_FRONT[0] <= a + x1 <= GATE_FRONT[2] and GATE_FRONT[1] <= c_ + z1 <= GATE_FRONT[3]
    if b0 < 10 ** 6 and (b0 > FLAT_Y + 4 or front): col[log_t()[col]] = 0; b0 = 10 ** 6   # 언덕 위·광화문 앞 나무 줄기
    cut = (soil_t()[col] | plant_t()[col]) & (np.arange(SH[1]) > j59)
    col[cut] = 0
    for j in range(j59, -1, -1):                                                         # 메우기 (빈칸·풀만)
        if col[j] and not plant_t()[col[j]]: break
        col[j] = DIRT
    if not log_t()[col[j59]]: col[j59] = GRASS
    if FLAT_Y + 1 < b0 <= FLAT_Y + 4:                                                    # 낮은 나무: 줄기를 땅까지
        col[j59 + 1:b0 - y1] = col[b0 - y1]
    NEW[a, :, c_] = col; removed[a, j59:, c_] |= OLD[a, j59:, c_] != col[j59:]; flat_n += 1
print(f"궁장 바깥 {flat_n:,}칸 → Y {FLAT_Y} 잔디밭")
# 공허였던 궁장 바깥(섬 동·서 너머)에도 잔디밭을 깐다
lawn_n = 0
for a, c_ in np.argwhere(~soil_t()[NEW].any(1)):
    X_, Z_ = a + x1, c_ + z1
    if LAWN[0] <= X_ <= LAWN[2] and LAWN[1] <= Z_ <= OUT_Z and not keep_box[a, :, c_].any():
        NEW[a, 55 - y1:FLAT_Y - y1, c_] = DIRT; NEW[a, FLAT_Y - y1, c_] = GRASS; lawn_n += 1
print(f"  공허 위에 새로 깐 잔디밭 {lawn_n:,}칸")
print(f"옛 마을 집·밭·소품 {n_houses}덩어리 걷어 냄" + (f" (너무 커서 둔 덩어리 {len(kept_big)}개: {kept_big[:3]})" if kept_big else ""))

# ---------- 경복궁 블록 가져오기 ----------
gbg_db = copy_db(GBG)
conv_cache = {}
def gbg_ids(GR):
    out = np.zeros(len(GR.palette), np.int64)
    for j, b in enumerate(GR.palette):
        if j == 0: continue
        k = mcstruct.key_of(b)
        if k not in conv_cache: conv_cache[k] = LR.pid(rot180(convert(b)))
        out[j] = conv_cache[k]
    return out
placed = np.zeros(SH, bool)
bents_new = {}
def take_bents(GR, T, ok):
    for (bx_, by_, bz_), be in GR.bents.items():
        g = (bx_ - GR.x1, by_ - GR.y1, bz_ - GR.z1)
        if ok[g]: bents_new[(T[0] - bx_, by_ + T[2], T[1] - bz_)] = be

# ---------- 2. 궁궐 (궁장 안쪽) ----------
print("경복궁 월드 읽는 중… (궁궐)")
s = PALACE_SRC[:5] + (PALACE_SRC[5] + PULL_IN,)          # 궁장 선 남쪽 몇 줄까지 더 읽어 걸친 전각을 통째로 본다
GR = mcstruct.read_region(gbg_db, s)
kc = PALACE_SRC[5] - s[2]                                 # 붙이는 마지막 줄 (로비 Z 1004)
gnames = [name_of(b) for b in GR.palette]
gplant = np.array([n in PLANTS for n in gnames])
gy = np.arange(s[1], s[4] + 1)[None, :, None]
gbuilt = (gy > GROUND_GBG) & (GR.grid > 0) & ~gplant[GR.grid]
def lobby_box(c):
    lo, hi = c.min(0), c.max(0)
    return "로비 X %d~%d Z %d~%d (%d칸)" % (PAL_T[0] - (s[0] + hi[0]), PAL_T[0] - (s[0] + lo[0]), PAL_T[1] - (s[2] + hi[2]), PAL_T[1] - (s[2] + lo[2]), len(c))
# (1) 궁장 선에 걸친 전각: PULL_IN줄 안에서 끝나면 걸친 만큼 북쪽(로비 +Z)으로 통째로 밀어 넣는다 (겹치는 것끼리는 한 묶음으로)
south = np.zeros(gbuilt.shape, bool); south[:, :, kc + 1:] = True
groups = []
for c in components(gbuilt, south):
    if c[:, 2].min() > kc: continue                       # 궁장 밖에만 있는 것
    if c[:, 2].max() == gbuilt.shape[2] - 1 or c[:, 0].min() == 0 or c[:, 0].max() == gbuilt.shape[0] - 1: continue   # 긴 담·행각은 잘린 채로
    groups.append([c])
merged = True
while merged:                                             # 위에서 본 범위가 겹치는 덩어리끼리 묶는다
    merged = False
    for i in range(len(groups)):
        for j in range(i + 1, len(groups)):
            A_ = np.concatenate(groups[i]); B_ = np.concatenate(groups[j])
            if A_[:, 0].min() <= B_[:, 0].max() + 1 and B_[:, 0].min() <= A_[:, 0].max() + 1 and A_[:, 2].min() <= B_[:, 2].max() + 1 and B_[:, 2].min() <= A_[:, 2].max() + 1:
                groups[i] += groups.pop(j); merged = True; break
        if merged: break
moved = np.zeros(gbuilt.shape, bool)
for g in groups:
    c = np.concatenate(g); k = int(c[:, 2].max() - kc)
    own = np.zeros(gbuilt.shape, bool); own[c[:, 0], c[:, 1], c[:, 2]] = True
    d = c.copy(); d[:, 2] -= k
    if (d[:, 2] < 0).any() or (gbuilt[d[:, 0], d[:, 1], d[:, 2]] & ~own[d[:, 0], d[:, 1], d[:, 2]]).any():
        GR.grid[own] = 0; print("    뺀 전각 (밀어 넣을 자리가 없음):", lobby_box(c)); continue
    vals = GR.grid[c[:, 0], c[:, 1], c[:, 2]].copy()
    GR.grid[own & gbuilt] = 0
    GR.grid[d[:, 0], d[:, 1], d[:, 2]] = vals; moved[d[:, 0], d[:, 1], d[:, 2]] = True
    print("    궁장 안으로 %d칸 밀어 넣은 전각:" % k, lobby_box(d))
gbuilt = (gy > GROUND_GBG) & (GR.grid > 0) & ~gplant[GR.grid]
# (2) 섬 동·서·북 끝에서 잘리는 작은 전각은 통째로 뺀다
edge = np.zeros(gbuilt.shape, bool); edge[0] = edge[-1] = True; edge[:, :, 0] = True
dropped = 0
for c in components(gbuilt & ~moved, edge):
    span = c.max(0) - c.min(0)
    if span[0] < SPAN and span[2] < SPAN:
        GR.grid[c[:, 0], c[:, 1], c[:, 2]] = 0; dropped += 1
gid = gbg_ids(GR)
gx_, gz_ = np.arange(s[0], s[3] + 1), np.arange(s[2], s[5] + 1)
lx = PAL_T[0] - gx_; lz = PAL_T[1] - gz_
for i, X_ in enumerate(lx):
    if not x1 <= X_ <= x2: continue
    for k, Z_ in enumerate(lz):
        if k > kc or not z1 <= Z_ <= z2: continue
        a, c_ = X_ - x1, Z_ - z1
        if strip2[a, c_] or hard[a, :, c_].any() or keep_box[a, :, c_].any(): continue   # 광장·팀 선택 홀·초록 발판 열은 건너뛴다
        ya, yb = s[1] + PAL_T[2] - y1, s[4] + PAL_T[2] - y1
        NEW[a, ya:yb + 1, c_] = gid[GR.grid[i, :, k]]
        NEW[a, yb + 1:CLEAR_UP - y1 + 1, c_] = 0
        placed[a, ya:yb + 1, c_] = True
okmask = np.zeros(GR.grid.shape, bool)
for (bx_, by_, bz_) in GR.bents:
    p = (PAL_T[0] - bx_, by_ + PAL_T[2], PAL_T[1] - bz_)
    if inbox(p, REGION) and placed[L(*p)]: okmask[bx_ - s[0], by_ - s[1], bz_ - s[2]] = True
take_bents(GR, PAL_T, okmask)
print(f"  궁궐: {int(placed.sum()):,}칸 붙임, 가장자리에서 잘려 뺀 전각 {dropped}개")
del GR

# 궁궐 밑에 남은 옛 바다는 흙으로 (섬 가장자리가 이제 공허와 맞닿아 새어 나간다)
wet_old = table("wetold", lambda b: name_of(b) in ("water", "flowing_water", "seagrass", "kelp", "tall_seagrass", "kelp_plant", "bubble_column"))
under = placed.any(1)[:, None, :] & (ys < s[1] + PAL_T[2]) & wet_old[NEW]
NEW[under] = DIRT
print(f"  궁궐 밑 옛 바닷물 {int(under.sum()):,}칸 → 흙")

# ---------- 3. 광화문 + 궁장 ----------
print("경복궁 월드 읽는 중… (광화문)")
s = GATE_SRC
GR = mcstruct.read_region(gbg_db, s)
gid = gbg_ids(GR)
gx, gyy, gz = np.meshgrid(np.arange(s[0], s[3] + 1), np.arange(s[1], s[4] + 1), np.arange(s[2], s[5] + 1), indexing="ij")
f = GATE_FULL
infull = (gx >= f[0]) & (gx <= f[3]) & (gz >= f[2]) & (gz <= f[5])
gplant = np.array([name_of(b) in PLANTS for b in GR.palette])
gbuilt = (gyy > GROUND_GBG) & (GR.grid > 0) & ~gplant[GR.grid]
inb = np.zeros(gbuilt.shape, bool)
for q in GATE_BUILT: inb |= (gx >= q[0]) & (gx <= q[3]) & (gyy >= q[1]) & (gyy <= q[4]) & (gz >= q[2]) & (gz <= q[5])
gbuilt &= inb & ~infull
# 궁장은 안쪽 땅 높이를 따라 놓는다: x마다 올림 s(x) (홍예문 쪽은 0, 이웃끼리 1칸 넘게 차이 나지 않게)
lobx = np.arange(x1, x2 + 1)
inside = np.zeros(len(lobx), int)
for a, X_ in enumerate(lobx):
    if strip2[a, L(0, 0, 1004)[2]]:
        inside[a] = max(59, int(ground[a, L(0, 0, 1004)[2]:L(0, 0, 1006)[2] + 1].max()))
    else:
        inside[a] = GROUND_GBG + PAL_T[2]
gate_lx = (GATE_T[0] - f[3], GATE_T[0] - f[0])
lift = inside - 59
lift[(lobx >= gate_lx[0] - 8) & (lobx <= gate_lx[1] + 8)] = 0
for _ in range(64):
    lift = np.maximum(lift, np.maximum(np.r_[lift[1:], 0], np.r_[0, lift[:-1]]) - 1)
n_wall = 0
take = infull | gbuilt
for (i, j, k) in np.argwhere(take):
    X_, Y_, Z_ = GATE_T[0] - (s[0] + i), s[1] + j + GATE_T[2], GATE_T[1] - (s[2] + k)
    if not (x1 <= X_ <= x2 and z1 <= Z_ <= z2): continue
    if not infull[i, j, k]: Y_ += int(lift[X_ - x1])
    p = L(X_, Y_, Z_)
    if not 0 <= p[1] < SH[1] or hard[p]: continue
    NEW[p] = gid[GR.grid[i, j, k]]; placed[p] = True; n_wall += 1
# 궁장 밑이 비면 그 담 맨 아래 블록으로 받치고, 궁장 자리 위로 솟은 흙·나무는 걷는다
wall_cols = np.zeros(SH[::2], bool)
for (i, k) in np.argwhere(gbuilt.any(1)):
    X_, Z_ = GATE_T[0] - (s[0] + i), GATE_T[1] - (s[2] + k)
    if x1 <= X_ <= x2 and z1 <= Z_ <= z2: wall_cols[X_ - x1, Z_ - z1] = True
for (a, c_) in np.argwhere(wall_cols):
    col = placed[a, :, c_]
    if not col.any(): continue
    j0 = int(np.argmax(col)); top = SH[1] - 1 - int(np.argmax(col[::-1]))
    if j0 != GROUND_GBG + 1 + GATE_T[2] + int(lift[a]) - y1: continue          # 처마처럼 뜬 것은 받치지 않는다
    mat = NEW[a, j0, c_]
    for j in range(j0 - 1, max(j0 - 12, -1), -1):
        v = NEW[a, j, c_]
        if v and not plant_t()[v] and not leaf_t()[v] and not water_t()[v]: break
        NEW[a, j, c_] = mat; placed[a, j, c_] = True
    above = np.arange(SH[1]) > j0
    clear = above & ~placed[a, :, c_] & (nat_t()[NEW[a, :, c_]] | log_t()[NEW[a, :, c_]]) & (np.arange(SH[1]) <= top + 6)
    NEW[a, clear, c_] = 0
okm = np.zeros(GR.grid.shape, bool); okm[take] = True
take_bents(GR, GATE_T, okm)
print(f"  광화문·궁장: {n_wall:,}칸 붙임 (궁장 X {x1}~{x2})")
del GR, gx, gyy, gz, infull, gbuilt, inb

# ---------- 3b. 초록 발판(팀 초기화 상자) — 궁궐 안에 들어오므로 둘레를 비우고 아래를 기단으로 ----------
crit0 = np.zeros(SH, bool)
for bx in CRIT: crit0 |= boxmask(bx)
mx = boxmask((PAD[0] - PAD_MARGIN, PAD[4] - 2, PAD[1] - PAD_MARGIN, PAD[2] + PAD_MARGIN, CLEAR_UP, PAD[3] + PAD_MARGIN)) & ~crit0
NEW[mx] = 0; placed[mx] = False
base = boxmask((PAD[0], PAD[4] - 3, PAD[1], PAD[2], PAD[4] - 1, PAD[3]))
NEW[base] = RISER; placed[base] = True
print("초록 발판: 둘레 %d칸을 비우고 아래 3칸을 장대석 기단으로 (땅에서 발판 위까지 3칸 — 걸어서 못 오른다)" % PAD_MARGIN)

# ---------- 4. 지붕 둘레 판자 → 짙은 참나무 ----------
giwa = table("giwa", lambda b: name_of(b) in GIWA or (name_of(b) in ("wooden_slab", "double_wooden_slab") and states_of(b).get("wood_type") == "oak"))
oakp = table("oakp", lambda b: name_of(b) == "oak_planks" or (name_of(b) == "planks" and states_of(b).get("wood_type") == "oak"))
roof = dilate(giwa[NEW] & placed, 3)
dark = roof & oakp[NEW] & placed
NEW[dark] = DARK
print(f"지붕 둘레 판자 {int(dark.sum()):,}칸 → 짙은 참나무")

# ---------- 5. 광장 포장 ----------
st3 = np.broadcast_to(strip2[:, None, :], SH)
paving = st3 & ~hard & ~placed & (ys >= 55)
# 광장 땅을 회랑 바닥 높이까지 깎고, 풀·꽃·밭 물은 걷는다
cutm = paving & (ys > STRIP_TOP) & nat_t()[NEW]
NEW[cutm] = 0
gone = paving & (plant_t()[NEW] | leaf_t()[NEW] | (water_t()[NEW] & (ys >= 59)))
posts = paving & log_t()[NEW] & (ys >= 60)                  # 광장에 홀로 선 원목 기둥·잎 걷은 나무 줄기
gone |= posts
NEW[gone] = 0
soilm = paving & soil_t()[NEW]
air_or_plant = lambda v: (v == 0) | plant_t()[v]
up = np.zeros(SH, bool); up[:, :-1] = air_or_plant(NEW[:, 1:])
side = np.zeros(SH, bool)
side[1:] |= NEW[:-1] == 0; side[:-1] |= NEW[1:] == 0; side[..., 1:] |= NEW[..., :-1] == 0; side[..., :-1] |= NEW[..., 1:] == 0
NEW[soilm & up] = PAVE
NEW[soilm & ~up & side] = RISER
# 광장 둘레(근정전 마당 앞면 등) 궁궐 쪽 흙 단면도 장대석으로
rim = np.broadcast_to(dilate(strip2, 3)[:, None, :], SH) & ~st3 & ~hard & (ys >= 55) & soil_t()[NEW] & side & ~up
NEW[rim] = RISER

# ---------- 5b. 팀 선택 홀 단장: 지붕 → 기와, 기둥 → 붉은 기둥, 바닥 잔디 → 박석, 테두리·흙 옆면 → 장대석 ----------
crit = np.zeros(SH, bool)
for bx in CRIT: crit |= boxmask(bx)
OAK_SLAB = {h: LR.pid(block("oak_slab", {"minecraft:vertical_half": S(h)}, 18168865)) for h in ("top", "bottom")}
OAK_DSLAB = LR.pid(block("oak_double_slab", {"minecraft:vertical_half": S("bottom")}, 18168865))
RED_POST = LR.pid(block("stripped_oak_log", {"pillar_axis": S("y")}, 18168865))
hall_old = NEW.copy()
hall = hard & ~crit
for i in np.unique(NEW[hall]):
    b = pal[i]; n = name_of(b); st = states_of(b); m = hall & (NEW == i)
    if n == "spruce_slab": NEW[m] = OAK_SLAB[st.get("minecraft:vertical_half", "bottom")]
    elif n == "spruce_double_slab": NEW[m] = OAK_DSLAB
    elif n == "oak_log" and st.get("pillar_axis", "y") == "y": NEW[m] = RED_POST
    elif n == "spruce_planks": NEW[m] = RISER
    elif plant_t()[i]: NEW[m] = 0
air_up = np.zeros(SH, bool); air_up[:, :-1] = (NEW[:, 1:] == 0) | plant_t()[NEW[:, 1:]]
air_side = np.zeros(SH, bool)
air_side[1:] |= NEW[:-1] == 0; air_side[:-1] |= NEW[1:] == 0; air_side[..., 1:] |= NEW[..., :-1] == 0; air_side[..., :-1] |= NEW[..., 1:] == 0
hsoil = hall & soil_t()[NEW]
NEW[hsoil & air_up] = PAVE
NEW[hsoil & ~air_up & air_side] = RISER
hall_changed = hall & (NEW != hall_old)
print(f"팀 선택 홀: {int(hall_changed.sum()):,}칸 단장 (지붕 기와 · 붉은 기둥 · 박석 · 장대석)")
print(f"광장: 박석 {int((soilm & up).sum()):,}칸, 장대석 단 {int((soilm & ~up & side).sum()):,}칸, 걷은 풀·밭 {int(gone.sum()):,}칸")

# ---------- 6. 떠 있는 잎 ----------
near = dilate(log_t()[NEW], 5)
zone = dilate((removed | placed).any(1), 8)
orphan = leaf_t()[NEW] & ~near & zone[:, None, :] & ~placed & ~keep_box
NEW[orphan] = 0
print(f"줄기를 잃은 잎 {int(orphan.sum()):,}칸 걷음")

# ---------- 6a. 물이 공허로 새지 않게 (물 아래가 비면 돌로 받치고, 옆이 낭떠러지인 물은 흙으로) ----------
STONE = LR.pid(block("stone", {}, 18168865))
leak_n = 0
for _ in range(4):
    w = water_t()[NEW]
    fall_b = table("fall", lambda b: name_of(b) in ("sand", "gravel", "red_sand", "anvil") or name_of(b).endswith("concrete_powder"))[NEW] & placed
    below_air = np.zeros(SH, bool); below_air[:, 1:] = NEW[:, :-1] == 0
    fill = np.zeros(SH, bool); fill[:, :-1] = ((w | fall_b) & below_air)[:, 1:]   # 물·떨어지는 블록 바로 아래 빈칸
    air_fall = (NEW == 0) & np.concatenate([np.ones((SH[0], 1, SH[2]), bool), NEW[:, :-1] == 0], 1)   # 빈칸이고 그 아래도 빈칸
    side_fall = np.zeros(SH, bool)
    side_fall[1:] |= air_fall[:-1]; side_fall[:-1] |= air_fall[1:]; side_fall[..., 1:] |= air_fall[..., :-1]; side_fall[..., :-1] |= air_fall[..., 1:]
    side_fall[0] = side_fall[-1] = True; side_fall[..., 0] = side_fall[..., -1] = True     # 범위 끝 바깥은 공허
    edge_w = w & side_fall
    if not fill.any() and not edge_w.any(): break
    NEW[fill & ~crit0] = STONE; NEW[edge_w & ~crit0] = DIRT
    leak_n += int(fill.sum() + edge_w.sum())
print(f"물이 새거나 블록이 떨어질 곳 {leak_n:,}칸 막음")

# ---------- 6b. 땅 가장자리 방벽 (공허로 떨어지면 시작 방에서 다시 태어나 호스트 판정이 다시 돈다) ----------
BARRIER = LR.pid(block("barrier", {}, 18168865))
solid = NEW > 0
land2 = solid[:, 55 - y1:101 - y1].any(1)
pl2 = np.pad(land2, 1)
edge2 = land2 & ~(pl2[2:, 1:-1] & pl2[:-2, 1:-1] & pl2[1:-1, 2:] & pl2[1:-1, :-2])
top2 = np.where(solid.any(1), SH[1] - 1 - solid[:, ::-1, :].argmax(1), -1)
bar_n = 0
for a, c_ in np.argwhere(edge2):
    for j in range(top2[a, c_] + 1, min(top2[a, c_] + 1 + BARRIER_H, SH[1])):
        if NEW[a, j, c_] == 0 and not crit0[a, j, c_] and not keep_box[a, j, c_]: NEW[a, j, c_] = BARRIER; bar_n += 1
print(f"땅 가장자리 방벽 {bar_n:,}칸 (보이지 않음)")

# ---------- 7. 검사 ----------
diff = NEW != OLD
problems = []
if (diff & crit).any(): problems.append("게임이 쓰는 칸이 %d칸 바뀜: %s" % (int((diff & crit).sum()), [tuple(int(v) for v in (p + (x1, y1, z1))) for p in np.argwhere(diff & crit)[:5]]))
if (diff & hard & ~hall_changed).any(): problems.append("팀 선택 홀이 단장 밖에서 %d칸 바뀜" % int((diff & hard & ~hall_changed).sum()))
kb = keep_box & built0 & ~hall_changed & ~posts
if (diff & kb).any(): problems.append("지키는 곳의 놓은 블록이 %d칸 바뀜: %s" % (int((diff & kb).sum()), [tuple(int(v) for v in (p + (x1, y1, z1))) for p in np.argwhere(diff & kb)[:5]]))
sp = L(*SPAWN)
if NEW[sp] or NEW[sp[0], sp[1] + 1, sp[2]]: problems.append("도착점 (1, 60, 1000)이 막힘")
if NEW[sp[0], sp[1] - 1, sp[2]] == 0: problems.append("도착점 발밑이 빔")
for a, b_ in CAMERAS:
    blocked = set()
    for t in np.linspace(0, 1, 400):
        p = np.array(a) + (np.array(b_) - np.array(a)) * t
        for o in [(ox, oy, oz) for ox in (-1.5, 0, 1.5) for oy in (-1.5, 0, 1.5) for oz in (-1.5, 0, 1.5)]:
            q = tuple(int(np.floor(p[i] + o[i])) for i in range(3))
            if inbox(q, REGION) and diff[L(*q)] and NEW[L(*q)] and not nat_t()[NEW[L(*q)]]: blocked.add(q)
    if blocked: problems.append("카메라 %s→%s 길을 새 블록 %d칸이 막음: %s" % (a, b_, len(blocked), sorted(blocked)[:5]))
print("검사:", "문제 없음" if not problems else "")
for p in problems: print("  ⚠", p)

# ---------- 8. 구조물 · 함수 — 지금 월드와 달라지는 곳만 ----------
print("지금 월드 읽는 중…")
CR = mcstruct.read_region(copy_db(ROOT), REGION)
ALIASN = {"red_flower": "poppy", "yellow_flower": "dandelion", "flowing_water": "water"}
nid = {}
def norm_ids(palette):
    out = []
    for b in palette:
        n = modern(b)[0]; n = ALIASN.get(n, n)
        out.append(nid.setdefault(n, len(nid)))
    return np.array(out, np.int32)
diffc = norm_ids(pal)[NEW] != norm_ids(CR.palette)[CR.grid]
print(f"  지금 월드와 다른 칸 {int(diffc.sum()):,}")
if "--check" in sys.argv:                                  # 읽기만: 조각별로 지금 월드와 다른 칸 수 (게임이 켜져 있을 때 진행 확인용, 파일을 쓰지 않는다)
    import collections
    T64 = 64; done_n = 0; rows = []
    for tz in range(z1, z2 + 1, T64):
        for tx in range(x1, x2 + 1, T64):
            n = int(diffc[tx - x1:tx - x1 + T64, :, tz - z1:tz - z1 + T64].sum())
            rows.append(("%d_%d" % ((tz - z1) // T64 + 1, (tx - x1) // T64 + 1), n))
    print("  조각별 다른 칸 (1,000칸 넘는 것):", [r for r in rows if r[1] > 1000])
    nn = np.array([modern(b)[0] for b in pal]); cn = np.array([modern(b)[0] for b in CR.palette])
    w = np.argwhere(diffc)
    print("  남은 차이 (지금 → 계획):", collections.Counter(zip(cn[CR.grid[w[:, 0], w[:, 1], w[:, 2]]].tolist(), nn[NEW[w[:, 0], w[:, 1], w[:, 2]]].tolist())).most_common(10))
    ww = np.argwhere(diffc & (cn[CR.grid] == "water") & (nn[NEW] == "air"))
    if len(ww):
        print("  계획엔 없는 물: 높이", (int(ww[:, 1].min()) + y1, int(ww[:, 1].max()) + y1), " 8칸 묶음(x, z):",
              collections.Counter(((int(q[0]) + x1) // 8 * 8, (int(q[2]) + z1) // 8 * 8) for q in ww).most_common(6))
    sys.exit(0)
if os.environ.get("GBG_DIFF"):                            # 남은 차이 분석: 바깥 확장 구역과 남쪽 끝 줄을 따로
    import collections
    nn = np.array([modern(b)[0] for b in pal]); cn = np.array([modern(b)[0] for b in CR.palette])
    for label, bx in (("북쪽 확장 Z 1250~", (x1, y1, 1250, x2, y2, z2)), ("남쪽 끝 줄 Z 856~917", (x1, y1, 856, x2, y2, 917))):
        w = np.argwhere(diffc & boxmask(bx))
        pr = collections.Counter(zip(cn[CR.grid[w[:, 0], w[:, 1], w[:, 2]]], nn[NEW[w[:, 0], w[:, 1], w[:, 2]]]))
        ys_ = collections.Counter((w[:, 1] + y1).tolist())
        print("  [%s] %d칸:" % (label, len(w)), pr.most_common(14), " 높이:", sorted(ys_.items())[:12], "…")
if os.environ.get("GBG_DIFF"):
    wf = np.argwhere(diffc & (cn[CR.grid] == "water") & (nn[NEW] == "air") & (np.arange(SH[1])[None, :, None] + y1 < 58))
    cols = collections.Counter(((int(q[0]) + x1) // 8 * 8, (int(q[2]) + z1) // 8 * 8) for q in wf)
    print("  [공허로 떨어지는 물] 8칸 묶음 (x, z): 칸 수", cols.most_common(12))
    for nm_ in ("short_grass", "torch", "red_flower"):
        wq = np.argwhere(diffc & (cn[CR.grid] == "air") & (nn[NEW] == nm_))
        cc = collections.Counter(((int(q[0]) + x1) // 32 * 32, (int(q[2]) + z1) // 32 * 32) for q in wq)
        print("  [빠진 %s] %d개, 32칸 묶음:" % (nm_, len(wq)), cc.most_common(10))
    # 같은 묶음에서 남아 있는 비율
    keep_t = np.argwhere((cn[CR.grid] == "torch") & (nn[NEW] == "torch"))
    print("  남아 있는 torch", len(keep_t))
    for (cx, cz) in ((220, 880), (-100, 880), (-230, 880), (90, 880)):
        a, c_ = cx - x1, cz - z1
        def col(G, names):
            v = [(j + y1, names[G[a, j, c_]]) for j in range(SH[1]) if names[G[a, j, c_]] != "air"]
            return v[:3] + ["…"] + v[-3:] if len(v) > 6 else v
        print("  기둥 x %d z %d  계획:" % (cx, cz), col(NEW, nn), " 지금:", col(CR.grid, cn))
isl = boxmask((-192, y1, 856, 191, y2, 1247))
if (diffc & isl).any():                                   # 이미 놓인 섬 안에서 다른 칸: 무엇이 무엇으로 바뀌는지 (많으면 이름 맞추기 점검)
    import collections
    nn = np.array([modern(b)[0] for b in pal]); cn = np.array([modern(b)[0] for b in CR.palette])
    w = np.argwhere(diffc & isl)
    pairs = collections.Counter(zip(cn[CR.grid[w[:, 0], w[:, 1], w[:, 2]]], nn[NEW[w[:, 0], w[:, 1], w[:, 2]]]))
    print(f"  그중 이미 놓인 섬 안 {len(w):,}칸 (지금 → 새로):", pairs.most_common(12))
    tc = collections.Counter(((int(q[0]) + x1 + 192) // 64, (int(q[2]) + z1 - 856) // 64) for q in w)
    print("  섬 안 64칸 조각별 (지난번 조각 기준 x열·z행: 칸 수):", sorted(((k[1] + 1, k[0] + 1), v) for k, v in tc.items()))
sd = os.path.join(BP, "structures", "gbg"); fd = os.path.join(BP, "functions", "gbg")
os.makedirs(sd, exist_ok=True); os.makedirs(fd, exist_ok=True)
for fn in glob.glob(os.path.join(sd, "*.mcstructure")) + glob.glob(os.path.join(fd, "lobby_*.mcfunction")) + glob.glob(os.path.join(fd, "go_*.mcfunction")) + glob.glob(os.path.join(fd, "build_*.mcfunction")): os.remove(fn)   # 이 도구가 만든 것만 (gbg/poster 는 그대로)
build, restore, tiles = [], [], []
# 조각 이름은 만들 때마다 새로: 게임은 켜져 있는 동안 같은 이름의 조각을 기억해 두고 써서, 이름이 같으면 옛 내용이 새 좌표에 놓인다 (11칸 어긋남 사고)
import time
RUN = "".join("0123456789abcdefghijklmnopqrstuvwxyz"[(int(time.time()) // 36 ** i) % 36] for i in range(4))[::-1]
T64 = 64
for tz in range(z1, z2 + 1, T64):
    for tx in range(x1, x2 + 1, T64):
        a = (tx - x1, tz - z1); b_ = (min(tx + T64 - 1, x2) - x1, min(tz + T64 - 1, z2) - z1)
        sub = diffc[a[0]:b_[0] + 1, :, a[1]:b_[1] + 1]
        if not sub.any(): continue
        w = np.argwhere(sub); lo, hi = w.min(0), w.max(0)
        sl = (slice(a[0] + lo[0], a[0] + hi[0] + 1), slice(lo[1], hi[1] + 1), slice(a[1] + lo[2], a[1] + hi[2] + 1))
        o = (x1 + sl[0].start, y1 + sl[1].start, z1 + sl[2].start)
        bx_ = (o[0], o[1], o[2], x1 + sl[0].stop - 1, y1 + sl[1].stop - 1, z1 + sl[2].stop - 1)
        bo, bn = {}, {}
        for p, be in CR.bents.items():                    # 로비의 블록 엔티티: 새 모습엔 안 바뀐 칸만, 되돌리기엔 모두
            if inbox(p, bx_):
                g = (p[0] - o[0], p[1] - o[1], p[2] - o[2]); bo[g] = be
                if not diffc[L(*p)]: bn[g] = be
        for p, be in bents_new.items():
            if inbox(p, bx_) and placed[L(*p)]: bn[(p[0] - o[0], p[1] - o[1], p[2] - o[2])] = be
        nm = "%d_%d" % ((tz - z1) // T64 + 1, (tx - x1) // T64 + 1)
        mcstruct.write_structure(os.path.join(sd, RUN + "_" + nm + ".mcstructure"), NEW[sl], pal, o, bn)
        build.append("structure load gbg:%s_%s %d %d %d" % (RUN, nm, *o))
        if RESTORE:
            mcstruct.write_structure(os.path.join(sd, RUN + "old_" + nm + ".mcstructure"), CR.grid[sl], CR.palette, o, bo)
            restore.append("structure load gbg:%sold_%s %d %d %d" % (RUN, nm, *o))
        tiles.append((nm, bx_, int(sub.sum())))
head = ["## [경복궁] 로비 섬에 광화문·궁궐 놓기 — python tools/gbg-lobby.py 가 만든 파일 (손으로 고치지 않는다).",
        "## 구조물은 그 자리가 불러와져 있을 때만 놓인다: /function gbg/go_1 ~ go_%d 로 하늘에 가서 그때마다 이 함수를 실행한다." % len(GO),
        "## 여러 번 실행해도 같다. 되돌리기는 월드를 닫고 git의 db/ 로 (또는 --restore 로 만든 gbg/lobby_restore)."]
done = 'tellraw @s {"rawtext":[{"text":"§a[경복궁] 조각 %d개를 불러왔습니다 — 이 둘레만 놓입니다. go_1~go_%d 에서 한 번씩 실행하세요."}]}' % (len(build), len(GO))
open(os.path.join(fd, "lobby_build.mcfunction"), "w", encoding="utf8").write("\n".join(head + build + [done]) + "\n")
groups = {}
for line, t in zip(build, tiles):
    nz, nx = (int(v) for v in t[0].split("_"))
    groups.setdefault(((nz - 1) // 2, (nx - 1) // 2), []).append(line)
GO = []
for n, ((gz2, gx2), lines) in enumerate(sorted(groups.items()), 1):
    cx = x1 + gx2 * 128 + 64; cz = z1 + gz2 * 128 + 64
    GO.append((cx, 130, cz))
    open(os.path.join(fd, "go_%d.mcfunction" % n), "w", encoding="utf8").write(
        "## [경복궁] 묶음 %d 하늘로 — 여기서 /function gbg/build_%d\ntp @s %d 130 %d facing %d 60 %d\n"
        'tellraw @s {"rawtext":[{"text":"§e[경복궁] 묶음 %d — 땅이 다 보이면 /function gbg/build_%d"}]}\n' % (n, n, cx, cz, cx, cz + 40, n, n))
    open(os.path.join(fd, "build_%d.mcfunction" % n), "w", encoding="utf8").write(
        "## [경복궁] 묶음 %d 의 조각 %d개 — /function gbg/go_%d 로 가서 실행한다\n" % (n, len(lines), n) + "\n".join(lines) +
        '\ntellraw @s {"rawtext":[{"text":"§a[경복궁] 묶음 %d 조각 %d개를 놓았습니다. 다음: /function gbg/go_%d"}]}\n' % (n, len(lines), n + 1))
print(f"놓을 자리 {len(GO)}곳 (go_1~go_{len(GO)} → build_1~build_{len(GO)})")
# 같은 명령 하나를 되풀이: /function gbg/next — 지금 선 묶음의 조각을 놓고 다음 묶음 하늘로 간다 (진행 번호는 점수판 gbg_step)
# (schedule on_area_loaded 는 교육용 에디션에서 쓸 수 없어 함수가 불러와지지 않았다)
import shutil as _sh
if os.path.isdir(os.path.join(fd, "auto")): _sh.rmtree(os.path.join(fd, "auto"))
if os.path.exists(os.path.join(fd, "auto.mcfunction")): os.remove(os.path.join(fd, "auto.mcfunction"))
N = len(GO)
nx = ["## [경복궁] 되풀이 놓기 — 실행할 때마다 지금 묶음의 조각을 놓고 다음 묶음 하늘로 간다. 이동한 뒤 땅이 다 보이면 다시 실행한다 (%d번 + 처음 1번)." % N,
      "## 처음부터 다시: /function gbg/next_reset. 묶음 하나만 다시: /function gbg/go_N → /function gbg/build_N",
      "scoreboard objectives add gbg_step dummy",
      "scoreboard players add .step gbg_step 0"]
nx += ["execute if score .step gbg_step matches %d run function gbg/build_%d" % (n, n) for n in range(1, N + 1)]
nx += ["scoreboard players add .step gbg_step 1"]
nx += ["execute if score .step gbg_step matches %d run function gbg/go_%d" % (n, n) for n in range(1, N + 1)]
nx += ['execute if score .step gbg_step matches %d.. run tellraw @s {"rawtext":[{"text":"§a[경복궁] 묶음 %d개를 모두 놓았습니다. 월드를 닫고 확인을 맡기세요."}]}' % (N + 1, N),
       "execute if score .step gbg_step matches %d.. run scoreboard players set .step gbg_step 0" % (N + 1)]
open(os.path.join(fd, "next.mcfunction"), "w", encoding="utf8").write("\n".join(nx) + "\n")
open(os.path.join(fd, "next_reset.mcfunction"), "w", encoding="utf8").write(
    "## [경복궁] 되풀이 놓기를 처음부터\nscoreboard objectives add gbg_step dummy\nscoreboard players set .step gbg_step 0\n"
    'tellraw @s {"rawtext":[{"text":"§e[경복궁] 처음부터 — /function gbg/next"}]}\n')
for n in range(1, N + 1):                                  # 묶음 안내를 '다음 명령' 에 맞춘다
    p_ = os.path.join(fd, "go_%d.mcfunction" % n); t_ = open(p_, encoding="utf8").read()
    t_ = t_.replace("땅이 다 보이면 /function gbg/build_%d" % n, "%d/%d — 땅이 다 보이면 다시 /function gbg/next" % (n, N))
    open(p_, "w", encoding="utf8").write(t_)
print(f"되풀이 놓기: /function gbg/next × {N + 1}번 (묶음 {N}개)")
if RESTORE:
    open(os.path.join(fd, "lobby_restore.mcfunction"), "w", encoding="utf8").write("\n".join([
        "## [경복궁] 로비 섬을 놓기 전 모습으로 — python tools/gbg-lobby.py --restore 가 만든 파일. go_1~go_%d 에서 한 번씩." % len(GO)] + restore + [
        'tellraw @s {"rawtext":[{"text":"§e[경복궁] 옛 모습 조각 %d개를 불러왔습니다."}]}' % len(restore)]) + "\n")
mb = sum(os.path.getsize(fn) for fn in glob.glob(os.path.join(sd, "*.mcstructure"))) / 1e6
for t in tiles: print("    조각 %-6s X %d~%d Z %d~%d  다른 칸 %s" % (t[0], t[1][0], t[1][3], t[1][2], t[1][5], f"{t[2]:,}"))
print(f"조각 이름 앞머리 {RUN}_ · 구조물 조각 {len(tiles)}개{' × 2' if RESTORE else ''} = {mb:.1f}MB → structures/gbg/ (git에 올리지 않음), functions/gbg/")

# ---------- 9. 개발자 페이지 미리보기 ----------
pd = os.path.join(ROOT, "devpage-areas", "plans"); os.makedirs(pd, exist_ok=True)
for fn in glob.glob(os.path.join(pd, "*.npz")): os.remove(fn)
PV = (x1, 52, z1, x2, 112, z2)
mod = [modern(b) for b in pal]
def save_plan(pid, title, G):
    g = G[:, PV[1] - y1:PV[4] - y1 + 1, :]
    used = np.unique(g); remap = np.zeros(int(used.max()) + 1, np.uint16); remap[used] = np.arange(len(used))
    np.savez_compressed(os.path.join(pd, pid + ".npz"), grid=remap[g].transpose(1, 2, 0),
                        palette=json.dumps([mod[i] for i in used]), meta=json.dumps({"title": title, "box": [PV[0], PV[2], PV[3], PV[5], PV[1], PV[4]]}, ensure_ascii=False))
save_plan("plan_now", "계획 · 지금 로비 섬", OLD)
save_plan("plan_gbg", "계획 · 경복궁을 놓은 로비 섬", NEW)
print("미리보기 → devpage-areas/plans/ (python tools/export-areas.py 로 3D)")
if problems: sys.exit(1)
