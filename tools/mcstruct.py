"""월드 블록을 형식(NBT 태그 종류) 그대로 읽고 .mcstructure로 쓴다. tools/gbg-lobby.py 가 쓴다.

read_region(db, box)  → Region: grid[x, y, z] = 팔레트 번호, palette = 블록 NBT(이름·상태·버전, 태그 종류 포함), bents = {(x, y, z): 블록 엔티티 NBT}
write_structure(path, grid, palette, origin, bents)  → 게임이 /structure load 로 불러오는 파일
값은 (태그 종류, 값) 쌍으로 들고 다닌다 — 상태값이 byte인지 int인지가 바뀌면 게임이 블록을 못 알아본다.
"""
import os, struct
import numpy as np
import mcworld

# ---------- NBT (리틀 엔디언, 태그 종류 보존) ----------
def rd(b, i, t):
    if t == 1: return b[i], i + 1
    if t == 2: return struct.unpack_from("<h", b, i)[0], i + 2
    if t == 3: return struct.unpack_from("<i", b, i)[0], i + 4
    if t == 4: return struct.unpack_from("<q", b, i)[0], i + 8
    if t == 5: return struct.unpack_from("<f", b, i)[0], i + 4
    if t == 6: return struct.unpack_from("<d", b, i)[0], i + 8
    if t == 7: n = struct.unpack_from("<i", b, i)[0]; return bytes(b[i + 4:i + 4 + n]), i + 4 + n
    if t == 8: n = struct.unpack_from("<H", b, i)[0]; return bytes(b[i + 2:i + 2 + n]).decode("utf8"), i + 2 + n
    if t == 9:
        et, n = b[i], struct.unpack_from("<i", b, i + 1)[0]; i += 5; out = []
        for _ in range(n): v, i = rd(b, i, et); out.append(v)
        return (et, out), i
    if t == 10:
        out = {}
        while True:
            ct = b[i]; i += 1
            if ct == 0: return out, i
            n = struct.unpack_from("<H", b, i)[0]; name = bytes(b[i + 2:i + 2 + n]).decode("utf8"); i += 2 + n
            v, i = rd(b, i, ct); out[name] = (ct, v)
    if t == 11: n = struct.unpack_from("<i", b, i)[0]; return list(struct.unpack_from("<%di" % n, b, i + 4)), i + 4 + 4 * n
    if t == 12: n = struct.unpack_from("<i", b, i)[0]; return list(struct.unpack_from("<%dq" % n, b, i + 4)), i + 4 + 8 * n
    raise ValueError(t)

def rd_root(b, i):
    t = b[i]; n = struct.unpack_from("<H", b, i + 1)[0]
    return rd(b, i + 3 + n, t)

def wr(t, v):
    if t == 1: return struct.pack("<b" if v < 0 else "<B", v)
    if t == 2: return struct.pack("<h", v)
    if t == 3: return struct.pack("<i", v)
    if t == 4: return struct.pack("<q", v)
    if t == 5: return struct.pack("<f", v)
    if t == 6: return struct.pack("<d", v)
    if t == 7: return struct.pack("<i", len(v)) + v
    if t == 8: e = v.encode("utf8"); return struct.pack("<H", len(e)) + e
    if t == 9:
        et, items = v
        if et == 3 and isinstance(items, np.ndarray): return struct.pack("<bi", 3, len(items)) + items.astype("<i4").tobytes()
        return struct.pack("<bi", et, len(items)) + b"".join(wr(et, x) for x in items)
    if t == 10:
        out = b""
        for name, (ct, cv) in v.items():
            e = name.encode("utf8"); out += struct.pack("<bH", ct, len(e)) + e + wr(ct, cv)
        return out + b"\x00"
    if t == 11: return struct.pack("<i%di" % len(v), len(v), *v)
    if t == 12: return struct.pack("<i%dq" % len(v), len(v), *v)
    raise ValueError(t)

def root(v): return b"\x0a\x00\x00" + wr(10, v)
I = lambda v: (3, v)
B = lambda v: (1, v)
S = lambda v: (8, v)
C = lambda d: (10, d)
L = lambda t, xs: (9, (t, xs))

# ---------- 블록 NBT 다루기 ----------
def block(name, states=None, version=None):
    """블록 NBT 하나. states는 {이름: (태그, 값)}."""
    d = {"name": S(name if ":" in name else "minecraft:" + name), "states": C(dict(states or {}))}
    if version is not None: d["version"] = I(version)
    return d
def name_of(b): return b["name"][1].replace("minecraft:", "")
def states_of(b): return {k: v[1] for k, v in b.get("states", (10, {}))[1].items()}
def key_of(b): return wr(10, b)
AIR = block("air", {}, 18168865)

# ---------- 월드 읽기 ----------
class Region:
    def __init__(self, box):
        self.x1, self.y1, self.z1, self.x2, self.y2, self.z2 = box
        self.grid = np.zeros((self.x2 - self.x1 + 1, self.y2 - self.y1 + 1, self.z2 - self.z1 + 1), np.int32)
        self.palette, self._ids = [AIR], {key_of(AIR): 0}
        self.bents = {}
    def pid(self, b):
        k = key_of(b)
        if k not in self._ids: self._ids[k] = len(self.palette); self.palette.append(b)
        return self._ids[k]
    def names(self): return [name_of(b) for b in self.palette]

def _latest(db, want_key):
    latest = {}
    for f in sorted(os.listdir(db)):
        p = os.path.join(db, f)
        it = mcworld._table(p) if f.endswith(".ldb") else mcworld._log(p) if f.endswith(".log") else ()
        for k, seq, t, v in it:
            if not want_key(k): continue
            old = latest.get(k)
            if old is None or seq > old[0]: latest[k] = (seq, t, v)
    return {k: v for k, (seq, t, v) in latest.items() if t == 1 and v}

def read_region(db, box):
    """box = (x1, y1, z1, x2, y2, z2), 양 끝 포함. 오버월드만."""
    R = Region(box)
    cx1, cx2, cz1, cz2 = R.x1 >> 4, R.x2 >> 4, R.z1 >> 4, R.z2 >> 4
    def want(k):
        if len(k) not in (9, 10) or k[8] not in (47, 49): return False
        cx, cz = struct.unpack_from("<ii", k, 0)
        if not (cx1 <= cx <= cx2 and cz1 <= cz <= cz2): return False
        if k[8] == 47:
            sy = struct.unpack_from("<b", k, 9)[0]
            return sy * 16 + 15 >= R.y1 and sy * 16 <= R.y2
        return len(k) == 9
    for k, v in _latest(db, want).items():
        cx, cz = struct.unpack_from("<ii", k, 0)
        if k[8] == 49:                                            # 블록 엔티티 여러 개가 이어 붙어 있다
            i = 0
            while i < len(v):
                c, i = rd_root(v, i)
                p = (c["x"][1], c["y"][1], c["z"][1])
                if R.x1 <= p[0] <= R.x2 and R.y1 <= p[1] <= R.y2 and R.z1 <= p[2] <= R.z2: R.bents[p] = c
            continue
        sy = struct.unpack_from("<b", k, 9)[0]
        if v[0] not in (8, 9): continue
        i = 3 if v[0] == 9 else 2
        bits = v[i] >> 1; i += 1
        if bits:
            bpw = 32 // bits; nw = -(-4096 // bpw)
            words = np.frombuffer(v, dtype="<u4", count=nw, offset=i); i += nw * 4
            sh = np.arange(bpw, dtype=np.uint32) * bits
            idx = ((words[:, None] >> sh[None, :]) & ((1 << bits) - 1)).ravel()[:4096].astype(np.int64)
        else:
            idx = np.zeros(4096, np.int64)
        npal = struct.unpack_from("<i", v, i)[0]; i += 4
        ids = []
        for _ in range(npal):
            c, i = rd_root(v, i)
            ids.append(0 if c["name"][1] == "minecraft:air" else R.pid(c))
        ids = np.array(ids, np.int32)
        X, Y, Z = cx * 16 + mcworld.LX, sy * 16 + mcworld.LY, cz * 16 + mcworld.LZ
        m = (X >= R.x1) & (X <= R.x2) & (Y >= R.y1) & (Y <= R.y2) & (Z >= R.z1) & (Z <= R.z2)
        R.grid[X[m] - R.x1, Y[m] - R.y1, Z[m] - R.z1] = ids[idx[m]]
    return R

# ---------- .mcstructure 쓰기 ----------
def write_structure(path, grid, palette, origin, bents=None):
    """grid[x, y, z] = palette 번호. origin = 놓일 월드 좌표(가장 작은 모서리). bents = {(gx, gy, gz) 격자 안 위치: 블록 엔티티 NBT}."""
    sx, sy, sz = grid.shape
    used = np.unique(grid)
    remap = np.full(int(used.max()) + 1, -1, np.int32); remap[used] = np.arange(len(used))
    flat = remap[grid].reshape(-1)                                 # 순서: x 바깥, 그다음 y, z 안쪽 (x*sy*sz + y*sz + z) — 게임과 같다
    pos_data = {}
    for (gx, gy, gz), be in (bents or {}).items():
        be = dict(be)
        be["x"], be["y"], be["z"] = I(origin[0] + gx), I(origin[1] + gy), I(origin[2] + gz)
        pos_data[str((gx * sy + gy) * sz + gz)] = C({"block_entity_data": C(be)})
    data = {
        "format_version": I(1),
        "size": L(3, [sx, sy, sz]),
        "structure_world_origin": L(3, list(origin)),
        "structure": C({
            "block_indices": L(9, [(3, flat), (3, np.full(flat.size, -1, np.int32))]),
            "entities": L(10, []),
            "palette": C({"default": C({
                "block_palette": L(10, [palette[i] for i in used]),
                "block_position_data": C(pos_data),
            })}),
        }),
    }
    with open(path, "wb") as f: f.write(root(data))
