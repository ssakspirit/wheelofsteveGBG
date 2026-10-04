"""게임장 둘레 배경을 경복궁으로 — 경기장(플레이하는 곳)은 한 칸도 건드리지 않고 그 바깥 숲·공허만 바꾼다. 두 월드 모두 읽기만 한다.

  python tools/gbg-arena.py orb [--check]
  → behavior_packs/bp0/structures/gbg_<id>/<run>_<z>_<x>.mcstructure   바뀐 뒤 모습 (64칸 조각, 다른 곳만) — git에 올리지 않는다
    behavior_packs/bp0/functions/gbg_<id>/next · next_reset · go_N · build_N   게임에서 /function gbg_<id>/next 를 되풀이
    devpage-areas/plans/<id>_plan_now|gbg.npz                            개발자 페이지 그 장소 탭의 구역 3D 미리보기
  --check: 쓰지 않고 지금 월드와 다른 칸만 센다 (게임이 켜져 있어도 된다)

경기장별 설정은 ARENAS. 가까이는 경복궁 월드의 전각(180° 돌림 — 경기장 자리에 걸리는 전각은 통째로 뺀다),
멀리는 산줄기(북악산·인왕산·낙산·남산 방향)로 공허 낭떠러지를 가린다. 산 비탈에는 소나무.
"""
import os, sys, json, glob, time, collections
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import mcstruct
from mcstruct import B, S, block, name_of, states_of
from gbgcommon import copy_db, rot180, convert, modern, components, dilate, PLANTS, SOIL, GIWA, V_OLD

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
BP = os.path.join(ROOT, "behavior_packs", "bp0")
GBG = os.path.join(os.path.dirname(ROOT), "n1lV7gB3Eyo=")
CHECK = "--check" in sys.argv

# ---------- 경기장별 설정 (상자는 x1 y1 z1 x2 y2 z2, 양 끝 포함) ----------
ARENAS = {
    "craft": dict(
        title="자격루 복원전",
        base="1d14bff",
        center=(0, 3022),
        # 바위 산 속 동굴 공방. 걸어 다닐 수 있는 곳 X −25~25 Z 2998~3048 (방벽 245개), 설계도·타이머가 Y 90~91에 떠 있고
        # 가장 높은 카메라가 Y 79 — 지키는 상자는 Y 96까지만, 그 위 동굴 천장은 걷어 낸다
        protect=(-27, 2995, 27, 3052), protect_top=96,
        # 공방 지붕(Y 66) 위 참나무 기둥 8개와 레일 다리(Y 87~90)는 걷는다 — 블록을 쓰는 게임 명령이 없고,
        # 그 위에 소환되는 타이머(0 90 3017)·설계도(Y 91)는 physics가 없어 받침 없이 그 자리에 떠 있다
        strip=(-27, 67, 2995, 27, 96, 3052),
        keep_now=("tnt",),                  # 놓은 뒤 사용자가 공방 둘레(Y 60)에 직접 놓은 화약궤 — 다시 놓을 때 지우지 않는다
        ground=59,                          # 공방 바닥 높이 (바위 산 꼭대기가 아니라)
        carve=(-37, 2986, 37, 3061),
        land=(-100, 2925, 96, 3170),        # 바위 산 자리 → 경회루 남쪽 (보루각 자리, 수정전 일대) — 공방 너머 연못 위 경회루
        gbg_center=(90, -885),              # 경회루 연못 남쪽 끝이 공방에서 20칸 떨어지게
        band=70,
        region=(-172, 30, 2855, 168, 150, 3240),
        peaks={"+z": 62, "+x": 52, "-x": 34, "-z": 42},
        cameras=[(-10, 62.0, 3047), (-10, 63.7, 3031.0), (-10.5, 62.9, 3008), (-12.5, 62.9, 3005), (-12.5, 63.3, 3030), (-12.5, 63.7, 3010), (-12.5, 63.9, 3030), (-12.9, 64.9, 3036), (-13.0, 61.6, 3004), (-13.3, 66, 3045), (-13.6, 64.1, 3036), (-15.5, 62.45, 3018), (-16, 63.6, 3030), (-17.0, 63.0, 3010.0), (-18.3, 64, 3043), (-22.5, 79.3, 3048), (-9.5, 62.3, 3021.5), (-9.5, 62.5, 3017), (-9.5, 63.3, 3021), (-9.5, 63.7, 3012.0), (10.5, 62.5, 3017), (10.5, 63.3, 3021), (11, 62.0, 3025), (11, 63.7, 3043.0), (11.5, 62.9, 3008), (12.5, 63.7, 3010.0), (13.0, 61.6, 3004), (13.5, 62.9, 3005), (13.5, 63.3, 3030), (13.5, 63.7, 3010), (13.5, 63.9, 3030), (13.6, 64.1, 3036), (13.9, 64.9, 3036), (14.3, 66, 3045), (16.5, 62.45, 3018), (17, 63.6, 3030), (17.0, 63.0, 3010.0), (18.3, 64, 3043), (23.5, 79.3, 3048), (9.5, 62.3, 3021.5), (9.5, 63.7, 3012.0)],
    ),
    "orb": dict(
        title="옥새 쟁탈전",
        base="56414c8",                     # 배경을 바꾸기 전 월드 (git) — 늘 이것을 원본으로 계산하고, 지금 월드와는 비교만 한다
        center=(0, 1998),
        # 지키는 상자: 이 x·z 안은 높이와 상관없이 지금 그대로 (걸어 다닐 수 있는 곳 X −30~30 Z 1972~2024, 방벽 776개,
        # 경기장 건물, 옥새 0 66 1998, 타이머 0 90 1998, 연출 카메라 10곳이 모두 안에 있다)
        protect=(-38, 1964, 38, 2032),
        carve=(-41, 1961, 41, 2035),       # 이 상자에 걸리는 경복궁 전각은 통째로 뺀다 (경기장 바로 둘레가 트이게)
        land=(-100, 1880, 96, 2110),        # 지금 숲 땅 → 경복궁 (강녕전·사정전 일대, 경기장이 강녕전 자리)
        gbg_center=(198, -952),             # 경복궁 월드에서 경기장 가운데에 오는 곳
        band=70,                            # 땅 둘레 산줄기 폭
        region=(-172, 30, 1808, 168, 150, 2182),
        # 산 높이(땅 위): +z 북악산 · +x 인왕산(바위) · −x 낙산 · −z 남산
        peaks={"+z": 62, "+x": 52, "-x": 34, "-z": 42},
        cameras=[(-5, 66, 1973), (-5, 68, 1998.5), (0.5, 64.3, 1980), (0.5, 64.3, 2016), (0.5, 68, 1993.5), (0.5, 68, 2004.5),
                 (0.5, 68.4, 1986), (0.5, 68.4, 2017), (5, 66, 2022), (5.5, 68, 1998.5)],
    ),
}
aid = next((a for a in sys.argv[1:] if not a.startswith("--")), "orb")
A = ARENAS[aid]
x1, y1, z1, x2, y2, z2 = A["region"]
NS = "gbg_" + aid

# ---------- 읽기 ----------
def base_db(commit):                                       # git에 저장된 바꾸기 전 db
    import subprocess, tarfile, io, tempfile
    out = subprocess.run(["git", "-C", ROOT, "archive", commit, "db"], capture_output=True, check=True).stdout
    dst = tempfile.mkdtemp(prefix="gbg-base-")
    tarfile.open(fileobj=io.BytesIO(out)).extractall(dst, filter="data")
    return os.path.join(dst, "db")
print(f"{A['title']} 둘레 읽는 중… (원본 {A['base']})")
LR = mcstruct.read_region(base_db(A["base"]), A["region"])
pal = LR.palette
OLD = LR.grid
NEW = OLD.copy()
SH = OLD.shape
X = np.arange(x1, x2 + 1)[:, None]; Z = np.arange(z1, z2 + 1)[None, :]
ys = np.arange(y1, y2 + 1)[None, :, None]
def rect2(r): return (X >= r[0]) & (X <= r[2]) & (Z >= r[1]) & (Z <= r[3])
prot2 = rect2(A["protect"]); land2 = rect2(A["land"])
tab = {}
def table(name, test):
    t = tab.get(name)
    if t is None or len(t) != len(pal): t = np.array([test(b) for b in pal]); tab[name] = t
    return t
soil_t = lambda: table("soil", lambda b: name_of(b) in SOIL)
water_t = lambda: table("water", lambda b: name_of(b) in ("water", "flowing_water"))
soil0 = soil_t()[OLD]
gtop = np.where(soil0.any(1), SH[1] - 1 - soil0[:, ::-1, :].argmax(1) + y1, -999)
ring = land2 & ~prot2 & (gtop > -999)
G = A.get("ground") or int(np.median(gtop[ring]))          # 지금 땅 높이 → 경복궁 지면이 여기에 (동굴처럼 위가 막힌 곳은 설정값)
DY = G - 63
print(f"  지금 숲 땅 높이 Y {G} (경복궁 지면 63 → {G})")
GRASS = LR.pid(block("grass_block", {}, 18168865)); DIRT = LR.pid(block("dirt", {"dirt_type": S("normal")}, V_OLD))
STONE = LR.pid(block("stone", {}, 18168865)); ANDESITE = LR.pid(block("andesite", {}, 18168865))
TRUNK = LR.pid(block("spruce_log", {"pillar_axis": S("y")}, 18168865))
NEEDLE = LR.pid(block("dark_oak_leaves", {"persistent_bit": B(1), "update_bit": B(0)}, 18168865))
DARK = LR.pid(block("planks", {"wood_type": S("dark_oak")}, V_OLD))
placed = np.zeros(SH, bool)

# ---------- 1. 숲 땅 → 경복궁 (180° 돌림: 경기장 x = cx − x, z = cz − z) ----------
cx_, cz_ = A["gbg_center"][0] + A["center"][0], A["gbg_center"][1] + A["center"][1]
L_ = A["land"]
src = (cx_ - L_[2], 55, cz_ - L_[3], cx_ - L_[0], 100, cz_ - L_[1])
print("경복궁 월드 읽는 중…", src)
GR = mcstruct.read_region(copy_db(GBG), src)
gplant = np.array([name_of(b) in PLANTS for b in GR.palette])
gy = np.arange(src[1], src[4] + 1)[None, :, None]
gbuilt = (gy > 63) & (GR.grid > 0) & ~gplant[GR.grid]
GX = np.arange(src[0], src[3] + 1); GZ = np.arange(src[2], src[5] + 1)
lx = cx_ - GX; lz = cz_ - GZ                                # 경복궁 칸 → 경기장 좌표
c_ = A["carve"]
incarve = ((lx[:, None] >= c_[0]) & (lx[:, None] <= c_[2]) & (lz[None, :] >= c_[1]) & (lz[None, :] <= c_[3]))
seeds = np.broadcast_to(incarve[:, None, :], gbuilt.shape)
dropped = 0; drop_log = []
for c in components(gbuilt, seeds):                        # 경기장 자리에 걸리는 전각은 통째로 (행각 연결망처럼 큰 것은 자리만)
    span = c.max(0) - c.min(0)
    if span[0] < 110 and span[2] < 110: GR.grid[c[:, 0], c[:, 1], c[:, 2]] = 0; dropped += 1; drop_log.append(("자리", c))
gbuilt = (gy > 63) & (GR.grid > 0) & ~gplant[GR.grid]
edge = np.zeros(gbuilt.shape, bool); edge[0] = edge[-1] = True; edge[:, :, 0] = edge[:, :, -1] = True
for c in components(gbuilt, edge):                          # 땅 가장자리(산 기슭)에서 잘리는 작은 전각도 통째로
    span = c.max(0) - c.min(0)
    if span[0] < 64 and span[2] < 64: GR.grid[c[:, 0], c[:, 1], c[:, 2]] = 0; dropped += 1; drop_log.append(("가장자리", c))
if "--verbose" in sys.argv:
    for why, c in drop_log:
        print("    뺀 전각(%s) X %d~%d Z %d~%d Y %d~%d, %d칸" % (why, cx_ - GX[c[:, 0].max()], cx_ - GX[c[:, 0].min()], cz_ - GZ[c[:, 2].max()], cz_ - GZ[c[:, 2].min()], src[1] + c[:, 1].min() + DY, src[1] + c[:, 1].max() + DY, len(c)))
GR.grid[np.broadcast_to(incarve[:, None, :], GR.grid.shape) & (np.arange(src[1], src[4] + 1)[None, :, None] > 63)] = 0   # 경기장 자리 위는 비운다
conv = {}
gid = np.zeros(len(GR.palette), np.int64)
for j, b in enumerate(GR.palette):
    if j: gid[j] = conv.setdefault(mcstruct.key_of(b), LR.pid(rot180(convert(b))))
n_pal = 0
for i, X_ in enumerate(lx):
    if not x1 <= X_ <= x2: continue
    for k, Z_ in enumerate(lz):
        if not z1 <= Z_ <= z2: continue
        a, cc = X_ - x1, Z_ - z1
        if prot2[a, cc]: continue
        ya, yb = src[1] + DY - y1, src[4] + DY - y1
        NEW[a, ya:yb + 1, cc] = gid[GR.grid[i, :, k]]
        NEW[a, yb + 1:, cc] = 0                              # 숲 나무는 걷는다
        placed[a, ya:yb + 1, cc] = True; n_pal += 1
# 통째로 뺀 전각(월대 등) 밑에 드러난 흙은 둘레 마당 바닥과 같은 블록으로
dirt_id = {i for i, b in enumerate(pal) if name_of(b) == "dirt"}
yg = G - y1
top_is_dirt = np.isin(NEW[:, yg, :], list(dirt_id)) & (NEW[:, yg + 1, :] == 0) & land2 & ~prot2
fixed = 0
for _ in range(40):
    if not top_is_dirt.any(): break
    for a, cc in np.argwhere(top_is_dirt):
        nb = NEW[max(a - 2, 0):a + 3, yg, max(cc - 2, 0):cc + 3].ravel()
        ok = nb[~np.isin(nb, list(dirt_id)) & (nb != 0)]
        if len(ok):
            NEW[a, yg, cc] = collections.Counter(ok.tolist()).most_common(1)[0][0]; top_is_dirt[a, cc] = False; fixed += 1
PT = A.get("protect_top")
if PT is not None:                                          # 지키는 상자 위(동굴 천장 등)는 걷어 낸다
    NEW[np.broadcast_to(prot2[:, None, :], SH) & (ys > PT)] = 0
strip3 = np.zeros(SH, bool)
if A.get("strip"):                                          # 지키는 상자 안이라도 걷어 낼 장식 (게임이 쓰지 않는 블록만)
    s_ = A["strip"]
    strip3[s_[0] - x1:s_[3] - x1 + 1, s_[1] - y1:s_[4] - y1 + 1, s_[2] - z1:s_[5] - z1 + 1] = True
    sn = collections.Counter(name_of(pal[i]) for i in NEW[strip3] if i)
    print("  지키는 상자 안에서 걷는 장식", dict(sn))
    if any(n in sn for n in ("barrier", "structure_void", "command_block", "repeating_command_block", "chain_command_block")):
        sys.exit("⚠ 걷는 상자에 게임 블록이 있음")
    NEW[strip3] = 0
print(f"  전각 {dropped}개를 빼고 땅 {n_pal:,}칸에 경복궁을 깖, 드러난 흙 {fixed:,}칸은 마당 바닥으로")

# ---------- 1b. 궁장: 궁궐 땅 가장자리를 담으로 둘러 숲과 나눈다 (잘린 행각 끝도 담 속으로) ----------
# 단면 (두께 3칸, 땅 위 7칸): 아래 2줄 장대석(석재 벽돌) · 3줄 담장돌(조약돌) · 기와 지붕(가운데 겹 반 블록, 양쪽 계단, 용마루 반 블록)
BRICK = LR.pid(block("stone_bricks", {}, 18168865)); COBBLE = LR.pid(block("cobblestone", {}, 18168865))
TILE2 = LR.pid(block("oak_double_slab", {"minecraft:vertical_half": S("bottom")}, 18168865))
RIDGE = LR.pid(block("oak_slab", {"minecraft:vertical_half": S("bottom")}, 18168865))
def stair(d): return LR.pid(block("oak_stairs", {"upside_down_bit": B(0), "weirdo_direction": I_(d)}, 18168865))
from mcstruct import I as I_
UP = {"+x": 0, "-x": 1, "+z": 2, "-z": 3}                  # weirdo_direction: 높은 쪽 방향 (동·서·남·북)
wall_n = 0
def wall_cell(a, cc, inward):
    """inward: 담 가운데 쪽 방향(바깥 칸 기준) — 바깥 칸·가운데·안쪽 칸을 그 방향으로 차례로 놓는다."""
    global wall_n
    dx, dz = {"+x": (1, 0), "-x": (-1, 0), "+z": (0, 1), "-z": (0, -1)}[inward]
    opp = {"+x": "-x", "-x": "+x", "+z": "-z", "-z": "+z"}[inward]
    for u in range(3):
        xa, za = a + dx * u, cc + dz * u
        if not (0 <= xa < SH[0] and 0 <= za < SH[2]) or prot2[xa, za]: continue
        yb = G - y1
        NEW[xa, yb + 1:, za] = 0                              # 담 자리 위(잘린 전각)는 비운다
        NEW[xa, yb + 1:yb + 3, za] = BRICK; NEW[xa, yb + 3:yb + 6, za] = COBBLE
        NEW[xa, yb + 6, za] = TILE2 if u == 1 else stair(UP[inward] if u == 0 else UP[opp])
        if u == 1: NEW[xa, yb + 7, za] = RIDGE
        NEW[xa, yb - 2:yb + 1, za] = BRICK                    # 기초
        placed[xa, yb - 2:yb + 8, za] = True; wall_n += 1
la, lb = L_[0] - x1, L_[2] - x1; lc, ld = L_[1] - z1, L_[3] - z1
for a in range(la, lb + 1):
    wall_cell(a, lc, "+z"); wall_cell(a, ld, "-z")          # 남쪽(−z)·북쪽(+z) 담: 바깥 칸이 땅 끝
for cc in range(lc, ld + 1):
    wall_cell(la, cc, "+x"); wall_cell(lb, cc, "-x")
print(f"궁장 {wall_n:,}칸 (땅 둘레 {2 * (lb - la + ld - lc)}칸 길이, 높이 7)")

# ---------- 2. 산줄기 (땅 둘레 띠) ----------
rng = np.random.default_rng(7)
def value_noise(scale, octaves=4, seed=0):
    r = np.random.default_rng(seed); out = np.zeros(SH[::2]); amp, tot = 1.0, 0.0
    for o in range(octaves):
        s = scale / (2 ** o); gw, gh = int(SH[0] / s) + 3, int(SH[2] / s) + 3
        grid = r.uniform(-1, 1, (gw, gh))
        fx = np.arange(SH[0]) / s; fz = np.arange(SH[2]) / s
        ix, iz = fx.astype(int), fz.astype(int); tx, tz = fx - ix, fz - iz
        tx = tx * tx * (3 - 2 * tx); tz = tz * tz * (3 - 2 * tz)
        a = grid[ix][:, iz]; b_ = grid[ix + 1][:, iz]; c2 = grid[ix][:, iz + 1]; d = grid[ix + 1][:, iz + 1]
        out += amp * ((a * (1 - tx[:, None]) + b_ * tx[:, None]) * (1 - tz[None, :]) + (c2 * (1 - tx[:, None]) + d * tx[:, None]) * tz[None, :])
        tot += amp; amp *= 0.5
    return out / tot
dx_ = np.maximum(np.maximum(L_[0] - X, X - L_[2]), 0); dz_ = np.maximum(np.maximum(L_[1] - Z, Z - L_[3]), 0)
dist = np.sqrt(dx_ ** 2 + dz_ ** 2)
mband = (dist > 0) & (dist <= A["band"])
ux = (X - A["center"][0]).astype(float); uz = (Z - A["center"][1]).astype(float); r_ = np.sqrt(ux ** 2 + uz ** 2) + 1e-6
ux, uz = ux / r_, uz / r_
P = A["peaks"]
amp = (P["+z"] * np.maximum(uz, 0) ** 2 + P["-z"] * np.maximum(-uz, 0) ** 2 + P["+x"] * np.maximum(ux, 0) ** 2 + P["-x"] * np.maximum(-ux, 0) ** 2)
sm = lambda a, b, t: np.clip((t - a) / (b - a), 0, 1) ** 2 * (3 - 2 * np.clip((t - a) / (b - a), 0, 1))
n1 = value_noise(56, 4, 1); n2 = value_noise(14, 2, 2); n3 = value_noise(24, 3, 3)
H = G + amp * sm(3, 56, dist) * (1 - 0.45 * sm(52, A["band"], dist)) * (0.78 + 0.32 * n1) + 3 * n2 * sm(2, 12, dist)
H = np.where(mband, np.clip(np.round(H), G, y2 - 4), -999).astype(int)
gzx, gzz = np.gradient(np.where(mband, H, G).astype(float))
slope = np.sqrt(gzx ** 2 + gzz ** 2)
rocky = mband & ((slope > 2.4) | ((ux > 0.55) & (n3 > 0.3) & (H > G + 28)))       # 아주 가파른 곳·인왕산 쪽 일부만 바위
n_mt = 0
for a, cc in np.argwhere(mband):
    h = H[a, cc] - y1; lo = max(G - 4 - y1, 0)
    if h <= lo: continue
    NEW[a, lo:h + 1, cc] = STONE
    if rocky[a, cc]:
        NEW[a, h, cc] = ANDESITE if (a * 7 + cc * 3) % 5 == 0 else STONE
    else:
        NEW[a, max(lo, h - 3):h, cc] = DIRT; NEW[a, h, cc] = GRASS
    NEW[a, h + 1:, cc] = 0
    placed[a, lo:h + 1, cc] = True; n_mt += 1
# 소나무: 완만한 풀밭에 듬성듬성 (붉은 줄기 대신 가문비 원목, 넓적한 짙은 잎 덩이)
trees = 0
cand = np.argwhere(mband & ~rocky & (slope < 1.1) & (H > G + 2))
rng.shuffle(cand)
taken = np.zeros(SH[::2], bool)
for a, cc in cand[: len(cand) // 12]:
    if taken[max(a - 3, 0):a + 4, max(cc - 3, 0):cc + 4].any(): continue
    taken[a, cc] = True
    h0 = H[a, cc] + 1 - y1; th = int(rng.integers(6, 11))
    if h0 + th + 2 >= SH[1]: continue
    NEW[a, h0:h0 + th, cc] = TRUNK
    for dy_, rad in ((th - 2, 2.6), (th, 2.0), (th + 1, 1.2)):
        for ox in range(-3, 4):
            for oz in range(-3, 4):
                if ox * ox + oz * oz <= rad * rad and 0 <= a + ox < SH[0] and 0 <= cc + oz < SH[2] and NEW[a + ox, h0 + dy_, cc + oz] == 0:
                    NEW[a + ox, h0 + dy_, cc + oz] = NEEDLE
    trees += 1
print(f"산줄기 {n_mt:,}칸 (땅 위 최고 {int(amp.max())}칸), 소나무 {trees}그루")

# ---------- 3. 지붕 둘레 판자 → 짙은 참나무, 물·떨어지는 블록 받치기 ----------
giwa = table("giwa", lambda b: name_of(b) in GIWA or (name_of(b) in ("wooden_slab", "double_wooden_slab") and states_of(b).get("wood_type") == "oak"))
oakp = table("oakp", lambda b: name_of(b) == "oak_planks" or (name_of(b) == "planks" and states_of(b).get("wood_type") == "oak"))
dark = dilate(giwa[NEW] & placed, 3) & oakp[NEW] & placed
NEW[dark] = DARK
for _ in range(4):
    fall = table("fall", lambda b: name_of(b) in ("water", "flowing_water", "sand", "gravel", "red_sand", "anvil") or name_of(b).endswith("concrete_powder"))[NEW] & placed
    below_air = np.zeros(SH, bool); below_air[:, 1:] = NEW[:, :-1] == 0
    fill = np.zeros(SH, bool); fill[:, :-1] = (fall & below_air)[:, 1:]
    if not fill.any(): break
    NEW[fill & ~np.broadcast_to(prot2[:, None, :], SH)] = STONE

# ---------- 4. 검사 ----------
problems = []
p3 = np.broadcast_to(prot2[:, None, :], SH) & ((ys <= PT) if PT is not None else True) & ~strip3
if (NEW != OLD)[p3].any(): problems.append("지키는 상자 안이 %d칸 바뀜" % int(((NEW != OLD) & p3).sum()))
for cam in A["cameras"]:
    if not prot2[int(np.floor(cam[0])) - x1, int(np.floor(cam[2])) - z1] or (PT is not None and cam[1] + 2 > PT):
        problems.append("연출 카메라 %s 가 지키는 상자 밖" % (cam,))
print("검사:", "문제 없음" if not problems else "")
for p in problems: print("  ⚠", p)
if problems: sys.exit(1)

# ---------- 5. 지금 월드와 다른 곳만 조각으로 ----------
print("지금 월드 읽는 중…")
CR = mcstruct.read_region(copy_db(ROOT), A["region"])
nid = {}
def norm_ids(palette):
    return np.array([nid.setdefault(modern(b)[0], len(nid)) for b in palette], np.int32)
diffc = (norm_ids(pal)[NEW] != norm_ids(CR.palette)[CR.grid]) & ~p3
if A.get("keep_now"):                                       # 지금 월드에 사용자가 직접 놓은 블록은 그대로
    diffc &= ~np.array([name_of(b) in A["keep_now"] for b in CR.palette])[CR.grid]
print(f"  지금 월드와 다른 칸 {int(diffc.sum()):,}")
if "--fix" in sys.argv:                                     # 보충: 땅속(지면−4 아래)으로 흘러든 물·용암은 빼고 (보이지 않고, 원천이 다시 채운다)
    fl = np.array([name_of(b) in ("water", "flowing_water", "lava", "flowing_lava") for b in CR.palette])[CR.grid]
    diffc &= ~(fl & (ys < G - 4))
    print(f"  보충할 칸 {int(diffc.sum()):,}")
if CHECK:
    nn = np.array([modern(b)[0] for b in pal]); cn = np.array([modern(b)[0] for b in CR.palette]); w = np.argwhere(diffc)
    print("  남은 차이 (지금 → 계획):", collections.Counter(zip(cn[CR.grid[w[:, 0], w[:, 1], w[:, 2]]].tolist(), nn[NEW[w[:, 0], w[:, 1], w[:, 2]]].tolist())).most_common(10))
    if "--verbose" in sys.argv:                              # 다른 칸이 몰린 곳 (16칸 덩어리별, 높이 범위와 블록 쌍)
        pairs = list(zip(cn[CR.grid[w[:, 0], w[:, 1], w[:, 2]]].tolist(), nn[NEW[w[:, 0], w[:, 1], w[:, 2]]].tolist()))
        by = collections.defaultdict(list)
        for (a, yy, cc), pr in zip(w.tolist(), pairs): by[((a + x1) >> 4, (cc + z1) >> 4)].append((yy + y1, pr))
        for (cx, cz), v in sorted(by.items(), key=lambda kv: -len(kv[1]))[:25]:
            yv = [t[0] for t in v]
            print("    X %d~%d Z %d~%d  Y %d~%d  %d칸  %s" % (cx * 16, cx * 16 + 15, cz * 16, cz * 16 + 15, min(yv), max(yv), len(v), collections.Counter(t[1] for t in v).most_common(3)))
    sys.exit(0)
sd = os.path.join(BP, "structures", NS); fd = os.path.join(BP, "functions", NS)
os.makedirs(sd, exist_ok=True); os.makedirs(fd, exist_ok=True)
for fn in glob.glob(os.path.join(sd, "*.mcstructure")) + glob.glob(os.path.join(fd, "*.mcfunction")): os.remove(fn)
RUN = "".join("0123456789abcdefghijklmnopqrstuvwxyz"[(int(time.time()) // 36 ** i) % 36] for i in range(4))[::-1]   # 실행마다 새 이름 (게임이 옛 조각을 기억하는 문제)
tiles = []
for tz in range(z1, z2 + 1, 64):
    for tx in range(x1, x2 + 1, 64):
        a = (tx - x1, tz - z1); b_ = (min(tx + 63, x2) - x1, min(tz + 63, z2) - z1)
        sub = diffc[a[0]:b_[0] + 1, :, a[1]:b_[1] + 1]
        if not sub.any(): continue
        w = np.argwhere(sub); lo, hi = w.min(0), w.max(0)
        sl = (slice(a[0] + lo[0], a[0] + hi[0] + 1), slice(lo[1], hi[1] + 1), slice(a[1] + lo[2], a[1] + hi[2] + 1))
        o = (x1 + sl[0].start, y1 + sl[1].start, z1 + sl[2].start)
        bx_ = (o[0], o[1], o[2], x1 + sl[0].stop - 1, y1 + sl[1].stop - 1, z1 + sl[2].stop - 1)
        bn = {}
        for p, be in CR.bents.items():                         # 지금 월드에서 안 바뀐 칸의 블록 엔티티는 그대로 실어 간다
            if bx_[0] <= p[0] <= bx_[3] and bx_[1] <= p[1] <= bx_[4] and bx_[2] <= p[2] <= bx_[5] and not diffc[p[0] - x1, p[1] - y1, p[2] - z1]:
                bn[(p[0] - o[0], p[1] - o[1], p[2] - o[2])] = be
        nm = "%d_%d" % ((tz - z1) // 64 + 1, (tx - x1) // 64 + 1)
        mcstruct.write_structure(os.path.join(sd, "%s_%s.mcstructure" % (RUN, nm)), NEW[sl], pal, o, bn)
        tiles.append((nm, "structure load %s:%s_%s %d %d %d" % (NS, RUN, nm, *o), bx_))
groups = collections.OrderedDict()
for nm, line, bx_ in tiles:
    nz, nx = (int(v) for v in nm.split("_"))
    groups.setdefault(((nz - 1) // 2, (nx - 1) // 2), []).append((line, bx_))
N = len(groups)
for n, ((gz2, gx2), items) in enumerate(groups.items(), 1):
    lines = [l for l, _ in items]                           # 하늘 지점 = 이 묶음 조각들이 실제로 덮는 곳의 가운데 (멀면 덩어리가 안 불러와진다)
    cx = (min(b[0] for _, b in items) + max(b[3] for _, b in items)) // 2
    cz = (min(b[2] for _, b in items) + max(b[5] for _, b in items)) // 2
    open(os.path.join(fd, "go_%d.mcfunction" % n), "w", encoding="utf8").write(
        "## [%s] 묶음 %d 하늘로\ntp @s %d 160 %d facing %d 60 %d\n" % (A["title"], n, cx, cz, cx, cz + 40) +
        'tellraw @s {"rawtext":[{"text":"§e[%s] 묶음 %d/%d — 땅이 다 보이면 다시 /function %s/next"}]}\n' % (A["title"], n, N, NS))
    open(os.path.join(fd, "build_%d.mcfunction" % n), "w", encoding="utf8").write(
        "## [%s] 묶음 %d 의 조각 %d개\n" % (A["title"], n, len(lines)) + "\n".join(lines) + "\n")
nx_ = ["## [%s 배경] 되풀이 놓기 — python tools/gbg-arena.py %s 가 만든 파일. 실행할 때마다 지금 묶음을 놓고 다음 묶음 하늘로 (%d번 + 처음 1번)." % (A["title"], aid, N),
       "## 처음부터: /function %s/next_reset" % NS,
       "scoreboard objectives add %s_step dummy" % NS, "scoreboard players add .step %s_step 0" % NS]
nx_ += ["execute if score .step %s_step matches %d run function %s/build_%d" % (NS, n, NS, n) for n in range(1, N + 1)]
nx_ += ["scoreboard players add .step %s_step 1" % NS]
nx_ += ["execute if score .step %s_step matches %d run function %s/go_%d" % (NS, n, NS, n) for n in range(1, N + 1)]
nx_ += ['execute if score .step %s_step matches %d.. run tellraw @s {"rawtext":[{"text":"§a[%s] 배경 묶음 %d개를 모두 놓았습니다."}]}' % (NS, N + 1, A["title"], N),
        "execute if score .step %s_step matches %d.. run scoreboard players set .step %s_step 0" % (NS, N + 1, NS)]
open(os.path.join(fd, "next.mcfunction"), "w", encoding="utf8").write("\n".join(nx_) + "\n")
open(os.path.join(fd, "next_reset.mcfunction"), "w", encoding="utf8").write(
    "scoreboard objectives add %s_step dummy\nscoreboard players set .step %s_step 0\n" % (NS, NS) +
    'tellraw @s {"rawtext":[{"text":"§e[%s] 처음부터 — /function %s/next"}]}\n' % (A["title"], NS))
mb = sum(os.path.getsize(f) for f in glob.glob(os.path.join(sd, "*.mcstructure"))) / 1e6
print(f"조각 {len(tiles)}개 ({RUN}_) = {mb:.1f}MB, 묶음 {N}개 → /function {NS}/next × {N + 1}번")

# ---------- 6. 미리보기 (그 장소 탭의 구역 3D) ----------
pd = os.path.join(ROOT, "devpage-areas", "plans"); os.makedirs(pd, exist_ok=True)
mod = [modern(b) for b in pal]
def save_plan(pid, title, Gr):
    lo = max(0, G - 10 - y1)
    g = Gr[:, lo:, :]
    used = np.unique(g); remap = np.zeros(int(used.max()) + 1, np.uint16); remap[used] = np.arange(len(used))
    np.savez_compressed(os.path.join(pd, pid + ".npz"), grid=remap[g].transpose(1, 2, 0), palette=json.dumps([mod[i] for i in used]),
                        meta=json.dumps({"title": title, "box": [x1, z1, x2, z2, y1 + lo, y2]}, ensure_ascii=False))
save_plan(aid + "_plan_now", "계획 · 지금 " + A["title"], OLD)
save_plan(aid + "_plan_gbg", "계획 · 경복궁 배경 " + A["title"], NEW)
print("미리보기 →", aid + "_plan_now / _plan_gbg (python tools/export-areas.py)")
