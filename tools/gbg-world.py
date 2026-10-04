"""'경복궁' 월드(minecraftWorlds/n1lV7gB3Eyo=)를 분석해 개발자 페이지 '경복궁 월드' 탭 자료를 만든다. 읽기만 한다.

  python tools/gbg-world.py        (게임이 그 월드를 열고 있어도 된다 — db를 복사해서 읽는다)
  → devpage-areas/gbg-summary.json  월드 정보 · 궁궐 범위 · 놓은 블록 종류 · 높이 분포
    devpage-areas/gbg-map.png        위에서 본 궁궐 지도 (1칸 = 1픽셀, 맨 위 블록의 색 + 높이 음영)
그다음 node tools/gen-devpage.js 로 페이지를 다시 만든다. 3D는 python tools/export-areas.py 가 함께 뽑는다 (mcworld.EXTERNAL).
"""
import os, sys, json, shutil, tempfile, collections, datetime
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
import mcworld, blocktex

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
WORLD = os.path.join(os.path.dirname(ROOT), mcworld.GBG_WORLD)
OUT = os.path.join(ROOT, "devpage-areas"); os.makedirs(OUT, exist_ok=True)
X1, Z1, X2, Z2, Y1, Y2 = mcworld.GBG_BOX
# 원래 지형(놓은 블록이 아닌 것) — 블록 통계에서 뺀다
NATURAL = {"air", "stone", "dirt", "tallgrass", "bedrock", "gravel", "coal_ore", "iron_ore", "redstone_ore", "lit_redstone_ore", "grass", "water",
           "flowing_water", "sandstone", "sand", "gold_ore", "leaves", "leaves2", "double_plant", "lava", "flowing_lava", "lapis_ore", "diamond_ore",
           "emerald_ore", "log", "log2", "red_flower", "yellow_flower", "clay", "andesite", "granite", "diorite"}

db = os.path.join(tempfile.mkdtemp(prefix="gbg-db-"), "db")
shutil.copytree(os.path.join(WORLD, "db"), db, ignore=shutil.ignore_patterns("LOCK"))
level, _ = mcworld._root(open(os.path.join(WORLD, "level.dat"), "rb").read(), 8)

want = lambda cx, cz, sy: cx * 16 + 15 >= X1 and cx * 16 <= X2 and cz * 16 + 15 >= Z1 and cz * 16 <= Z2 and sy * 16 + 15 >= Y1 and sy * 16 <= Y2
chunks = mcworld.subchunks(db, want)
W, D = X2 - X1 + 1, Z2 - Z1 + 1
top_y = np.full((D, W), -999, np.int32); top_k = np.zeros((D, W), np.int32)
keys, key_id = ["air"], {}
def kid(n, st):
    k = n + "|" + json.dumps({s: st[s] for s in sorted(st) if s in blocktex.VARIANTS}, sort_keys=True)
    if k not in key_id: key_id[k] = len(keys); keys.append(k)
    return key_id[k]
placed = collections.Counter(); heights = collections.Counter()
for (cx, cz, sy), v in chunks.items():
    d = mcworld.decode(v)
    if d is None: continue
    idx, pal = d
    names = [n for n, _ in pal]
    ids = np.array([0 if n in ("air", "structure_void") else kid(n, s) for n, s in pal], np.int32)
    X, Y, Z = cx * 16 + mcworld.LX, sy * 16 + mcworld.LY, cz * 16 + mcworld.LZ
    m = (X >= X1) & (X <= X2) & (Z >= Z1) & (Z <= Z2) & (Y >= Y1) & (Y <= Y2) & (ids[idx] > 0)
    if not m.any(): continue
    xs, ys, zs, ks = X[m] - X1, Y[m], Z[m] - Z1, ids[idx[m]]
    higher = ys > top_y[zs, xs]                       # 같은 하위 청크 안에서는 y가 커지는 순서 (x*256+z*16+y)
    for x, y, z, k in zip(xs[higher], ys[higher], zs[higher], ks[higher]):
        if y > top_y[z, x]: top_y[z, x] = y; top_k[z, x] = k
    nat = np.array([n in NATURAL for n in names])
    pm = m & ~nat[idx]
    for p, c in enumerate(np.bincount(idx[pm], minlength=len(pal))):
        if c: placed[names[p]] += int(c)
    for y, c in zip(*np.unique(Y[pm], return_counts=True)): heights[int(y)] += int(c)

# 블록 색: 리소스팩까지 포함한 지금 모습의 윗면 그림 평균색 (잎·잔디는 carried 색)
tex = blocktex.Tex(True)
def color(k):
    if k == 0: return (0, 0, 0)
    n, st = keys[k].split("|", 1); st = json.loads(st)
    if n in ("water", "flowing_water"): return (63, 118, 228)
    if n in ("lava", "flowing_lava"): return (230, 100, 20)
    f = tex.faces(n, st).get("up")
    if not f: return (128, 128, 128)
    im = np.array(Image.open(f[0]).convert("RGBA").resize((16, 16)))[:, :, :4].reshape(-1, 4).astype(float)
    a = im[:, 3] > 0
    c = im[a, :3].mean(0) if a.any() else np.array([128, 128, 128])
    if f[1]: c = c * np.array([int(f[1][1][i:i + 2], 16) for i in (1, 3, 5)]) / 255
    return tuple(int(v) for v in c)
pal = np.array([color(k) for k in range(len(keys))], float)
img = pal[top_k]
shade = np.clip(1 + (top_y - 63) * 0.012, 0.7, 1.35)[:, :, None]          # 높을수록 밝게
img = np.where((top_y > -999)[:, :, None], img * shade, 30)
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(OUT, "gbg-map.png"))

summary = {
    "world": mcworld.GBG_WORLD, "name": level.get("LevelName", ""), "spawn": [level.get("SpawnX"), level.get("SpawnY"), level.get("SpawnZ")],
    "version": ".".join(str(v) for v in level.get("lastOpenedWithVersion", [])[:3]), "flat": level.get("Generator") == 2,
    "box": [X1, Z1, X2, Z2, Y1, Y2], "size": [W, Y2 - Y1 + 1, D], "ground": 63,
    "placed_total": sum(placed.values()), "placed": placed.most_common(60),
    "heights": sorted(heights.items()), "db_mb": round(sum(os.path.getsize(os.path.join(WORLD, "db", f)) for f in os.listdir(os.path.join(WORLD, "db"))) / 1e6, 1),
    "scanned": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
}
json.dump(summary, open(os.path.join(OUT, "gbg-summary.json"), "w", encoding="utf8"), ensure_ascii=False)
print(f"경복궁 월드: 놓은 블록 {summary['placed_total']:,}개 · 지도 {W}×{D} → devpage-areas/gbg-map.png, gbg-summary.json")
