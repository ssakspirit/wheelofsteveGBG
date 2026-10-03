"""월드 저장 데이터(db/, LevelDB)를 읽어 블록 종류가 어디에 얼마나 쓰였는지 센다. 읽기만 한다.

리소스팩에서 블록 텍스처를 바꾸면 그 블록이 월드 전체에서 바뀌므로, 바꾸기 전에 사용처를 확인하는 데 쓴다.
  python tools/scan-blocks.py [--db <db 폴더>] [--box x1 z1 x2 z2 ymin ymax] [--json out.json]
게임장마다 상자(아래 ARENAS: 게임 구역 + 둘레 건물)를 잡고, 블록 종류별로 각 게임장 · 그 밖의 지형에 몇 개 있는지 센다.
--box를 주면 그 상자를 맨 앞 칸('상자')으로 따로 센다. 게임이 켜져 있으면 db를 복사해서 그 사본을 넘긴다 (마지막 저장 상태 기준).
"""
import os, sys, struct, zlib, json, argparse, collections
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("--db", default=os.path.join(os.path.dirname(__file__), "..", "db"))
ap.add_argument("--box", nargs=6, type=int, metavar=("X1", "Z1", "X2", "Z2", "YMIN", "YMAX"))
ap.add_argument("--json")
ap.add_argument("--locate", nargs="+", help="이 블록들이 게임장 상자 밖 어디(64칸 단위 구역)에 있는지도 보여 준다")
args = ap.parse_args()

# ---------- LevelDB ----------
def varint(b, i):
    r = s = 0
    while True:
        c = b[i]; i += 1; r |= (c & 0x7F) << s; s += 7
        if c < 0x80: return r, i

def unblock(raw):  # 블록 내용 + 압축 종류 1바이트 (Mojang: 2 = zlib, 4 = raw deflate)
    t, d = raw[-1], raw[:-1]
    if t == 0: return d
    if t == 2: return zlib.decompress(d)
    if t == 4: return zlib.decompress(d, -15)
    raise ValueError("compression %d" % t)

def block_entries(blk):
    nres = struct.unpack_from("<I", blk, len(blk) - 4)[0]
    end, i, key = len(blk) - 4 - 4 * nres, 0, b""
    while i < end:
        sh, i = varint(blk, i); ns, i = varint(blk, i); vl, i = varint(blk, i)
        key = key[:sh] + blk[i:i + ns]; i += ns
        yield key, blk[i:i + vl]; i += vl

def table(path):
    b = open(path, "rb").read()
    foot = b[-48:]
    _, i = varint(foot, 0); _, i = varint(foot, i)
    io, i = varint(foot, i); isz, i = varint(foot, i)
    for _, h in block_entries(unblock(b[io:io + isz + 1])):
        off, k = varint(h, 0); sz, k = varint(h, k)
        for key, val in block_entries(unblock(b[off:off + sz + 1])):
            tr = struct.unpack_from("<Q", key, len(key) - 8)[0]
            yield key[:-8], tr >> 8, tr & 0xFF, val

def logfile(path):
    b, recs, buf, pos = open(path, "rb").read(), [], b"", 0
    while pos + 7 <= len(b):
        left = 32768 - pos % 32768
        if left < 7: pos += left; continue
        ln, typ = struct.unpack_from("<H", b, pos + 4)[0], b[pos + 6]
        data = b[pos + 7:pos + 7 + ln]; pos += 7 + ln
        if typ == 0 and ln == 0: continue
        if typ == 1: recs.append(data)
        elif typ == 2: buf = data
        elif typ == 3: buf += data
        elif typ == 4: recs.append(buf + data); buf = b""
    for r in recs:
        seq, cnt = struct.unpack_from("<QI", r, 0); i = 12
        for n in range(cnt):
            t = r[i]; i += 1
            kl, i = varint(r, i); k = r[i:i + kl]; i += kl
            v = b""
            if t == 1: vl, i = varint(r, i); v = r[i:i + vl]; i += vl
            yield k, seq + n, t, v

def is_subchunk(k):  # 오버월드 하위 청크: x(4) z(4) 태그 47 y(1)
    return len(k) == 10 and k[8] == 47

latest = {}
for f in sorted(os.listdir(args.db)):
    p = os.path.join(args.db, f)
    it = table(p) if f.endswith(".ldb") else logfile(p) if f.endswith(".log") else ()
    for k, seq, t, v in it:
        if not is_subchunk(k): continue
        old = latest.get(k)
        if old is None or seq > old[0]: latest[k] = (seq, t, v)

# ---------- NBT (리틀 엔디언) ----------
def nbt(b, i, t):
    if t == 1: return b[i], i + 1
    if t == 2: return struct.unpack_from("<h", b, i)[0], i + 2
    if t == 3: return struct.unpack_from("<i", b, i)[0], i + 4
    if t == 4: return struct.unpack_from("<q", b, i)[0], i + 8
    if t == 5: return struct.unpack_from("<f", b, i)[0], i + 4
    if t == 6: return struct.unpack_from("<d", b, i)[0], i + 8
    if t == 7: n = struct.unpack_from("<i", b, i)[0]; return b[i + 4:i + 4 + n], i + 4 + n
    if t == 8: n = struct.unpack_from("<H", b, i)[0]; return b[i + 2:i + 2 + n].decode("utf8", "replace"), i + 2 + n
    if t == 9:
        et, n = b[i], struct.unpack_from("<i", b, i + 1)[0]; i += 5; out = []
        for _ in range(n): v, i = nbt(b, i, et); out.append(v)
        return out, i
    if t == 10:
        out = {}
        while True:
            ct = b[i]; i += 1
            if ct == 0: return out, i
            n = struct.unpack_from("<H", b, i)[0]; name = b[i + 2:i + 2 + n].decode("utf8", "replace"); i += 2 + n
            out[name], i = nbt(b, i, ct)
    if t == 11: n = struct.unpack_from("<i", b, i)[0]; return list(struct.unpack_from("<%di" % n, b, i + 4)), i + 4 + 4 * n
    if t == 12: n = struct.unpack_from("<i", b, i)[0]; return list(struct.unpack_from("<%dq" % n, b, i + 4)), i + 4 + 8 * n
    raise ValueError("nbt tag %d" % t)

def root(b, i):  # 이름 있는 루트 compound
    t = b[i]; n = struct.unpack_from("<H", b, i + 1)[0]
    return nbt(b, i + 3 + n, t)

# ---------- 게임장 상자 (게임 구역 + 둘레 건물, 땅속은 대부분 빼고) ----------
ARENAS = [("로비", (-75, 975, 46, 1069, 56, 130)), ("옥새", (-40, 1950, 40, 2046, 58, 110)), ("자격루", (-50, 2972, 50, 3072, 56, 110)),
          ("교태전", (-76, -134, 9, -53, 56, 120)), ("활쏘기", (-65, 3938, 62, 4062, 56, 110)), ("6진 망루", (-200, 4967, 45, 5213, 50, 230)),
          ("백악산", (-40, 6110, 50, 6275, 140, 320)), ("백악산 시상대", (-20, 5940, 25, 5990, -64, -40)), ("시작 방", (-15, -15, 15, 15, 15, 45))]
REGIONS = ([("상자", tuple(args.box))] if args.box else []) + ARENAS
REST = "그 밖의 지형"
ax, az = np.meshgrid(np.arange(16), np.arange(16), indexing="ij")
LX = np.repeat(ax.ravel(), 16); LZ = np.repeat(az.ravel(), 16); LY = np.tile(np.arange(16), 256)  # 순서: x*256 + z*16 + y

count = collections.defaultdict(collections.Counter)  # 블록 종류 → 칸(게임장)별 개수
spots = collections.defaultdict(collections.Counter)  # --locate: 블록 → (x, z) 64칸 구역별 개수
skipped = 0
for k, (seq, t, v) in latest.items():
    if t != 1 or not v: continue
    cx, cz = struct.unpack_from("<ii", k, 0); sy = struct.unpack_from("<b", k, 9)[0]
    ver = v[0]
    if ver not in (8, 9): skipped += 1; continue
    nl, i = v[1], 3 if ver == 9 else 2
    if nl < 1: continue
    flags = v[i]; i += 1; bits = flags >> 1
    if bits == 0:
        idx = np.zeros(4096, dtype=np.int64)
    else:
        bpw = 32 // bits; nw = -(-4096 // bpw)
        words = np.frombuffer(v, dtype="<u4", count=nw, offset=i); i += nw * 4
        sh = np.arange(bpw, dtype=np.uint32) * bits
        idx = ((words[:, None] >> sh[None, :]) & ((1 << bits) - 1)).ravel()[:4096].astype(np.int64)
    npal = struct.unpack_from("<i", v, i)[0]; i += 4
    pal = []
    for _ in range(npal):
        c, i = root(v, i); pal.append(c.get("name", "?").replace("minecraft:", ""))
    bx, bz, by = cx * 16, cz * 16, sy * 16
    left = np.ones(4096, dtype=bool)  # 아직 어느 칸에도 세지 않은 블록 (앞 칸이 우선)
    for name, (x1, z1, x2, z2, y1, y2) in REGIONS:
        if bx + 15 < x1 or bx > x2 or bz + 15 < z1 or bz > z2 or by + 15 < y1 or by > y2: continue
        X, Y, Z = bx + LX, by + LY, bz + LZ
        m = left & (X >= x1) & (X <= x2) & (Z >= z1) & (Z <= z2) & (Y >= y1) & (Y <= y2)
        for p, n in enumerate(np.bincount(idx[m], minlength=npal)):
            if n and pal[p] != "air": count[pal[p]][name] += int(n)
        left &= ~m
    for p, n in enumerate(np.bincount(idx[left], minlength=npal)):
        if n and pal[p] != "air":
            count[pal[p]][REST] += int(n)
            if args.locate and pal[p] in args.locate: spots[pal[p]][(bx // 64 * 64, bz // 64 * 64)] += int(n)

cols = [r[0] for r in REGIONS] + [REST]
first = cols[0]
rows = sorted(({"block": b, **{c: cnt[c] for c in cols if cnt[c]}} for b, cnt in count.items()),
              key=lambda r: (-r.get(first, 0), -sum(r.get(c, 0) for c in cols[:-1])))
rows = [r for r in rows if any(r.get(c, 0) for c in cols[:-1])]  # 지형에만 있는 블록은 뺀다
print(f"하위 청크 {len(latest)}개 읽음 (옛 형식 {skipped}개 건너뜀). 게임장 상자에 나오는 블록 종류 {len(rows)}개\n")
print(f"{'블록':32s} " + " ".join(f"{c[:6]:>8s}" for c in cols))
for r in rows:
    print(f"{r['block']:34s} " + " ".join(f"{r.get(c, 0) or '':>8}" for c in cols))
if args.json:
    json.dump({"regions": dict(REGIONS), "columns": cols, "rows": rows}, open(args.json, "w", encoding="utf8"), ensure_ascii=False, indent=1)
for b in args.locate or []:
    print(f"\n[{b}] 게임장 상자 밖: " + ", ".join(f"X{x}~{x + 63} Z{z}~{z + 63}: {n}" for (x, z), n in spots[b].most_common(12)))
