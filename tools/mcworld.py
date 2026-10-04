"""Bedrock 월드 저장 데이터(db/, LevelDB) 읽기 — 읽기만 한다. scan-blocks.py · export-areas.py가 같이 쓴다.

  subchunks(db, want=None)   → {(cx, cz, sy): value}  오버월드 하위 청크(16×16×16)의 가장 최근 값
  decode(value)              → (idx[4096] numpy, [(이름, 상태 dict), ...])  첫 층(물 겹침 층은 뺌), 순서 x*256 + z*16 + y
게임이 켜져 있으면 db를 복사해서 그 사본을 넘긴다 (마지막 저장 상태 기준).
"""
import os, struct, zlib
import numpy as np

# 게임장 상자: (장소 id, 이름, (x1, z1, x2, z2, y1, y2)) — 게임 구역 + 둘레 건물, 땅속은 대부분 뺀다
ARENAS = [
    ("lobby", "로비", (-75, 896, 191, 1151, 55, 120)),
    ("orb", "옥새", (-40, 1950, 40, 2046, 55, 110)),
    ("craft", "자격루", (-50, 2972, 50, 3072, 50, 110)),
    ("grid", "교태전", (-76, -134, 9, -53, 55, 120)),
    ("nock", "활쏘기", (-65, 3938, 62, 4062, 50, 110)),
    ("elytra", "6진 망루", (-200, 4967, 45, 5213, 50, 230)),
    ("finale", "백악산", (-40, 6110, 50, 6275, 140, 320)),
    ("finale_podium", "백악산 시상대", (-20, 5940, 25, 5990, -64, -40)),
    ("start", "시작 방", (-15, -15, 15, 15, 15, 45)),
    ("build", "건축 터 (로비 뒤편)", (-130, 1045, 130, 1300, 50, 180)),   # tools/build-zones.js 의 site.box 와 같게
]

# 다른 월드(경복궁 월드)의 구역: (id, 이름, 상자, 월드 폴더 이름) — export-areas.py가 함께 뽑는다
GBG_WORLD = "n1lV7gB3Eyo="                     # minecraftWorlds/ 아래 '경복궁' 월드 (공기 프리셋 평지 + 옮겨 온 지형, 지면 Y 63)
GBG_BOX = (-60, -1410, 470, -550, 58, 96)      # 궁궐 전체 (놓은 블록의 99%가 X −48~449, Z −1389~−566, Y 63~83)
EXTERNAL = [
    ("gbg_all", "경복궁 · 궁궐 전체", GBG_BOX, GBG_WORLD),
    ("gbg_south", "경복궁 · 남쪽 (Z −850~−550)", (-60, -850, 470, -550, 58, 96), GBG_WORLD),
    ("gbg_mid", "경복궁 · 가운데 (Z −1130~−850)", (-60, -1130, 470, -850, 58, 96), GBG_WORLD),
    ("gbg_north", "경복궁 · 북쪽 (Z −1410~−1130)", (-60, -1410, 470, -1130, 58, 96), GBG_WORLD),
]

# ---------- LevelDB ----------
def _varint(b, i):
    r = s = 0
    while True:
        c = b[i]; i += 1; r |= (c & 0x7F) << s; s += 7
        if c < 0x80: return r, i

def _unblock(raw):  # 블록 내용 + 압축 종류 1바이트 (Mojang: 2 = zlib, 4 = raw deflate)
    t, d = raw[-1], raw[:-1]
    if t == 0: return d
    if t == 2: return zlib.decompress(d)
    if t == 4: return zlib.decompress(d, -15)
    raise ValueError("compression %d" % t)

def _entries(blk):
    nres = struct.unpack_from("<I", blk, len(blk) - 4)[0]
    end, i, key = len(blk) - 4 - 4 * nres, 0, b""
    while i < end:
        sh, i = _varint(blk, i); ns, i = _varint(blk, i); vl, i = _varint(blk, i)
        key = key[:sh] + blk[i:i + ns]; i += ns
        yield key, blk[i:i + vl]; i += vl

def _table(path):
    b = open(path, "rb").read()
    foot = b[-48:]
    _, i = _varint(foot, 0); _, i = _varint(foot, i)
    io, i = _varint(foot, i); isz, i = _varint(foot, i)
    for _, h in _entries(_unblock(b[io:io + isz + 1])):
        off, k = _varint(h, 0); sz, k = _varint(h, k)
        for key, val in _entries(_unblock(b[off:off + sz + 1])):
            tr = struct.unpack_from("<Q", key, len(key) - 8)[0]
            yield key[:-8], tr >> 8, tr & 0xFF, val

def _log(path):
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
            kl, i = _varint(r, i); k = r[i:i + kl]; i += kl
            v = b""
            if t == 1: vl, i = _varint(r, i); v = r[i:i + vl]; i += vl
            yield k, seq + n, t, v

def subchunks(db, want=None):
    """오버월드 하위 청크 키 (x(4) z(4) 태그 47 y(1)) 의 최신 값. want(cx, cz, sy)가 False면 건너뛴다."""
    latest = {}
    for f in sorted(os.listdir(db)):
        p = os.path.join(db, f)
        it = _table(p) if f.endswith(".ldb") else _log(p) if f.endswith(".log") else ()
        for k, seq, t, v in it:
            if len(k) != 10 or k[8] != 47: continue
            cx, cz = struct.unpack_from("<ii", k, 0); sy = struct.unpack_from("<b", k, 9)[0]
            if want and not want(cx, cz, sy): continue
            old = latest.get((cx, cz, sy))
            if old is None or seq > old[0]: latest[(cx, cz, sy)] = (seq, t, v)
    return {k: v for k, (seq, t, v) in latest.items() if t == 1 and v}

# ---------- NBT (리틀 엔디언) ----------
def _nbt(b, i, t):
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
        for _ in range(n): v, i = _nbt(b, i, et); out.append(v)
        return out, i
    if t == 10:
        out = {}
        while True:
            ct = b[i]; i += 1
            if ct == 0: return out, i
            n = struct.unpack_from("<H", b, i)[0]; name = b[i + 2:i + 2 + n].decode("utf8", "replace"); i += 2 + n
            out[name], i = _nbt(b, i, ct)
    if t == 11: n = struct.unpack_from("<i", b, i)[0]; return list(struct.unpack_from("<%di" % n, b, i + 4)), i + 4 + 4 * n
    if t == 12: n = struct.unpack_from("<i", b, i)[0]; return list(struct.unpack_from("<%dq" % n, b, i + 4)), i + 4 + 8 * n
    raise ValueError("nbt tag %d" % t)

def _root(b, i):
    t = b[i]; n = struct.unpack_from("<H", b, i + 1)[0]
    return _nbt(b, i + 3 + n, t)

def decode(v):
    """하위 청크 값 → (idx, palette). 옛 형식(8·9가 아닌 것)은 None."""
    ver = v[0]
    if ver not in (8, 9): return None
    nl, i = v[1], 3 if ver == 9 else 2
    if nl < 1: return None
    flags = v[i]; i += 1; bits = flags >> 1
    if bits == 0:
        idx = np.zeros(4096, dtype=np.int64)
    else:
        bpw = 32 // bits; nw = -(-4096 // bpw)
        words = np.frombuffer(v, dtype="<u4", count=nw, offset=i); i += nw * 4
        sh = np.arange(bpw, dtype=np.uint32) * bits
        idx = ((words[:, None] >> sh[None, :]) & ((1 << bits) - 1)).ravel()[:4096].astype(np.int64)
    # 한 종류 블록뿐인 덩어리(bits 0)는 새 게임이 팔레트 개수 없이 블록 하나(NBT, 0x0a로 시작)만 적는다
    if bits == 0 and v[i] == 0x0a: npal = 1
    else: npal = struct.unpack_from("<i", v, i)[0]; i += 4
    pal = []
    for _ in range(npal):
        c, i = _root(v, i)
        pal.append((c.get("name", "?").replace("minecraft:", ""), c.get("states", {})))
    return idx, pal

# 하위 청크 안 위치 (순서 x*256 + z*16 + y)
_ax, _az = np.meshgrid(np.arange(16), np.arange(16), indexing="ij")
LX = np.repeat(_ax.ravel(), 16); LZ = np.repeat(_az.ravel(), 16); LY = np.tile(np.arange(16), 256)
