"""월드 저장 데이터(db/)를 읽어 블록 종류가 어디에 얼마나 쓰였는지 센다. 읽기만 한다.

리소스팩에서 블록 텍스처를 바꾸면 그 블록이 월드 전체에서 바뀌므로, 바꾸기 전에 사용처를 확인하는 데 쓴다.
  python tools/scan-blocks.py [--db <db 폴더>] [--box x1 z1 x2 z2 ymin ymax] [--json out.json] [--locate <블록…>]
게임장마다 상자(mcworld.ARENAS: 게임 구역 + 둘레 건물)를 잡고, 블록 종류별로 각 게임장 · 그 밖의 지형에 몇 개 있는지 센다.
--box를 주면 그 상자를 맨 앞 칸('상자')으로 따로 센다. --locate는 그 블록이 상자 밖 어디(64칸 구역)에 있는지 보여 준다.
게임이 켜져 있으면 db를 복사해서 그 사본을 넘긴다 (마지막 저장 상태 기준).
"""
import os, sys, json, argparse, collections
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import mcworld

ap = argparse.ArgumentParser()
ap.add_argument("--db", default=os.path.join(os.path.dirname(__file__), "..", "db"))
ap.add_argument("--box", nargs=6, type=int, metavar=("X1", "Z1", "X2", "Z2", "YMIN", "YMAX"))
ap.add_argument("--json")
ap.add_argument("--locate", nargs="+", help="이 블록들이 게임장 상자 밖 어디(64칸 단위 구역)에 있는지도 보여 준다")
args = ap.parse_args()

REGIONS = ([("상자", tuple(args.box))] if args.box else []) + [(name, box) for _, name, box in mcworld.ARENAS]
REST = "그 밖의 지형"
count = collections.defaultdict(collections.Counter)  # 블록 종류 → 칸(게임장)별 개수
spots = collections.defaultdict(collections.Counter)  # --locate: 블록 → (x, z) 64칸 구역별 개수
chunks = mcworld.subchunks(args.db)
skipped = 0
for (cx, cz, sy), v in chunks.items():
    d = mcworld.decode(v)
    if d is None: skipped += 1; continue
    idx, pal = d
    names = [n for n, _ in pal]
    bx, bz, by = cx * 16, cz * 16, sy * 16
    left = np.ones(4096, dtype=bool)  # 아직 어느 칸에도 세지 않은 블록 (앞 칸이 우선)
    for name, (x1, z1, x2, z2, y1, y2) in REGIONS:
        if bx + 15 < x1 or bx > x2 or bz + 15 < z1 or bz > z2 or by + 15 < y1 or by > y2: continue
        X, Y, Z = bx + mcworld.LX, by + mcworld.LY, bz + mcworld.LZ
        m = left & (X >= x1) & (X <= x2) & (Z >= z1) & (Z <= z2) & (Y >= y1) & (Y <= y2)
        for p, n in enumerate(np.bincount(idx[m], minlength=len(pal))):
            if n and names[p] != "air": count[names[p]][name] += int(n)
        left &= ~m
    for p, n in enumerate(np.bincount(idx[left], minlength=len(pal))):
        if n and names[p] != "air":
            count[names[p]][REST] += int(n)
            if args.locate and names[p] in args.locate: spots[names[p]][(bx // 64 * 64, bz // 64 * 64)] += int(n)

cols = [r[0] for r in REGIONS] + [REST]
first = cols[0]
rows = sorted(({"block": b, **{c: cnt[c] for c in cols if cnt[c]}} for b, cnt in count.items()),
              key=lambda r: (-r.get(first, 0), -sum(r.get(c, 0) for c in cols[:-1])))
rows = [r for r in rows if any(r.get(c, 0) for c in cols[:-1])]  # 지형에만 있는 블록은 뺀다
print(f"하위 청크 {len(chunks)}개 읽음 (옛 형식 {skipped}개 건너뜀). 게임장 상자에 나오는 블록 종류 {len(rows)}개\n")
print(f"{'블록':32s} " + " ".join(f"{c[:6]:>8s}" for c in cols))
for r in rows:
    print(f"{r['block']:34s} " + " ".join(f"{r.get(c, 0) or '':>8}" for c in cols))
if args.json:
    json.dump({"regions": dict(REGIONS), "columns": cols, "rows": rows}, open(args.json, "w", encoding="utf8"), ensure_ascii=False, indent=1)
for b in args.locate or []:
    print(f"\n[{b}] 게임장 상자 밖: " + ", ".join(f"X{x}~{x + 63} Z{z}~{z + 63}: {n}" for (x, z), n in spots[b].most_common(12)))
