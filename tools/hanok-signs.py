"""월드에 놓인 영어 표지판을 한국어로 바꾸는 구조물 + 함수를 만든다 (월드 데이터는 읽기만 한다).

  python tools/hanok-signs.py [--db <db 사본>]
  → behavior_packs/bp0/structures/hanok/sign_N.mcstructure (표지판 한 칸: 원래 블록·방향 그대로, 글씨만 한국어)
    behavior_packs/bp0/functions/hanok/signs_ko.mcfunction (구조물을 제자리에 불러오는 명령)
게임 안에서 /function hanok/signs_ko 를 한 번 실행하면 표지판이 바뀐다 (월드에 저장됨). 새 파일만 추가한다.
표지판 글씨는 리소스팩이 아니라 월드 데이터(블록 엔티티)에 들어 있어서 이렇게 바꾼다.
"""
import os, sys, struct, argparse
sys.path.insert(0, os.path.dirname(__file__))
import mcworld

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
BP = os.path.join(ROOT, "behavior_packs", "bp0")
ap = argparse.ArgumentParser(); ap.add_argument("--db", default=os.path.join(ROOT, "db")); args = ap.parse_args()

# (x, y, z): 새 글씨. 줄은 \n. 색 코드는 원래 표지판을 따른다.
SIGNS = {
    (-39, 60, -80): "\n보드 지우기", (-28, 60, -80): "\n보드 지우기",                       # 교태전 꽃담 판 앞
    (-33, 68, 1011): "\n§4홍포대", (-33, 68, 1017): "\n§4홍포대",                           # 로비 팀 선택 홀 걸이 표지판
    (-33, 68, 1019): "\n§9청포대", (-33, 68, 1025): "\n§9청포대",
    (-44, 65, 1018): "§6눌러서 시작\n§f모두 팀을\n§f골랐는지\n§f확인하세요",                 # 로비 시작 버튼
    # 지하 관리실(선생님용 버튼 방)
    (10, -4, 1): "\n옥새 쟁탈전", (10, -4, 2): "\n자격루 복원전", (10, -4, 3): "\n교태전\n꽃담 맞추기",
    (10, -4, 4): "\n활쏘기 대회", (10, -4, 5): "\n6진 망루\n공성전", (10, -4, 6): "\n백악산",
    (3, -4, 7): "\n백악산\n엽전 달리기", (3, -4, 8): "\n6진 망루\n공성전", (3, -4, 9): "\n활쏘기 대회",
    (3, -4, 10): "\n교태전\n꽃담 맞추기", (3, -4, 11): "\n자격루 복원전", (3, -4, 12): "\n옥새 쟁탈전",
    (3, -4, 13): "\n팀 나누기", (3, -4, 14): "\n로비",
    (10, -4, 8): "\n혼자 하기\n모드", (10, -4, 9): "\n여럿이 하기\n모드",
    (10, -4, 14): "전체 초기화\n새 참가자를\n등록하려면\n누르세요",
    (4, -4, 16): "\n청포대(2팀)", (10, -4, 16): "\n홍포대(1팀)",
}

# ---------- 형식을 지키는 NBT (리틀 엔디언) ----------
def rd(b, i, t):
    if t == 1: return b[i], i + 1
    if t == 2: return struct.unpack_from("<h", b, i)[0], i + 2
    if t == 3: return struct.unpack_from("<i", b, i)[0], i + 4
    if t == 4: return struct.unpack_from("<q", b, i)[0], i + 8
    if t == 5: return struct.unpack_from("<f", b, i)[0], i + 4
    if t == 6: return struct.unpack_from("<d", b, i)[0], i + 8
    if t == 7: n = struct.unpack_from("<i", b, i)[0]; return bytes(b[i + 4:i + 4 + n]), i + 4 + n
    if t == 8: n = struct.unpack_from("<H", b, i)[0]; return b[i + 2:i + 2 + n].decode("utf8"), i + 2 + n
    if t == 9:
        et, n = b[i], struct.unpack_from("<i", b, i + 1)[0]; i += 5; out = []
        for _ in range(n): v, i = rd(b, i, et); out.append(v)
        return (et, out), i
    if t == 10:
        out = {}
        while True:
            ct = b[i]; i += 1
            if ct == 0: return out, i
            n = struct.unpack_from("<H", b, i)[0]; name = b[i + 2:i + 2 + n].decode("utf8"); i += 2 + n
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
    if t == 9: et, items = v; return struct.pack("<bi", et, len(items)) + b"".join(wr(et, x) for x in items)
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
C = lambda d: (10, d)
L = lambda t, xs: (9, (t, xs))

# ---------- 월드에서 표지판 블록·블록 엔티티 읽기 ----------
want_chunks = {(x >> 4, z >> 4) for x, y, z in SIGNS}
blocks, ents = {}, {}
latest = {}
for f in sorted(os.listdir(args.db)):
    p = os.path.join(args.db, f)
    it = mcworld._table(p) if f.endswith(".ldb") else mcworld._log(p) if f.endswith(".log") else ()
    for k, seq, t, v in it:
        if len(k) not in (9, 10) or k[8] not in (47, 49): continue
        cx, cz = struct.unpack_from("<ii", k, 0)
        if (cx, cz) not in want_chunks: continue
        old = latest.get(k)
        if old is None or seq > old[0]: latest[k] = (seq, t, v)
for k, (seq, t, v) in latest.items():
    if t != 1: continue
    cx, cz = struct.unpack_from("<ii", k, 0)
    if k[8] == 49:                                       # 블록 엔티티 여러 개가 이어 붙어 있다
        i = 0
        while i < len(v):
            c, i = rd_root(v, i)
            pos = (c["x"][1], c["y"][1], c["z"][1])
            if pos in SIGNS: ents[pos] = c
    else:                                                # 하위 청크: 표지판 자리의 팔레트 항목(이름·상태·버전)을 형식 그대로
        sy = struct.unpack_from("<b", k, 9)[0]
        if v[0] not in (8, 9): continue
        nl, i = v[1], 3 if v[0] == 9 else 2
        bits = v[i] >> 1; i += 1
        idx = None
        if bits:
            bpw = 32 // bits; nw = -(-4096 // bpw)
            words = struct.unpack_from("<%dI" % nw, v, i); i += nw * 4
        npal = struct.unpack_from("<i", v, i)[0]; i += 4
        pal = []
        for _ in range(npal): c, i = rd_root(v, i); pal.append(c)
        for (x, y, z) in SIGNS:
            if x >> 4 != cx or z >> 4 != cz or y >> 4 != sy: continue
            n = ((x & 15) << 8) | ((z & 15) << 4) | (y & 15)
            j = 0 if not bits else (words[n // (32 // bits)] >> ((n % (32 // bits)) * bits)) & ((1 << bits) - 1)
            blocks[(x, y, z)] = pal[j]

# ---------- 구조물 · 함수 쓰기 ----------
sd = os.path.join(BP, "structures", "hanok"); os.makedirs(sd, exist_ok=True)
fd = os.path.join(BP, "functions", "hanok"); os.makedirs(fd, exist_ok=True)
lines = ["## [한옥] 영어 표지판을 한국어로 바꾼다 — python tools/hanok-signs.py 가 만든 파일. 각 표지판은 원래 블록·방향 그대로이고 글씨만 다르다.",
         "## 구조물은 그 자리가 불러와져 있을 때만 놓인다: 로비·교태전은 아무 데서나 되지만, 지하 관리실(0~10, -4, 1~16) 19개는",
         "## /function dev/tp/hq 로 관리실에 간 뒤 다시 실행해야 한다 (이미 바뀐 것은 다시 놓아도 같다)."]
missing = []
for n, (pos, text) in enumerate(sorted(SIGNS.items(), key=lambda kv: (kv[0][2], kv[0][0], kv[0][1])), 1):
    if pos not in blocks or pos not in ents: missing.append(pos); continue
    be = dict(ents[pos])
    for side in ("FrontText",):
        if side in be:
            st = dict(be[side][1]); st["Text"] = (8, text); be[side] = C(st)
    if "Text" in be: be["Text"] = (8, text)
    data = C({
        "format_version": I(1),
        "size": L(3, [1, 1, 1]),
        "structure_world_origin": L(3, list(pos)),
        "structure": C({
            "block_indices": L(9, [(3, [0]), (3, [-1])]),
            "entities": L(10, []),
            "palette": C({"default": C({
                "block_palette": L(10, [blocks[pos]]),
                "block_position_data": C({"0": C({"block_entity_data": C(be)})}),
            })}),
        }),
    })
    open(os.path.join(sd, "sign_%d.mcstructure" % n), "wb").write(root(data[1]))
    lines.append("structure load hanok:sign_%d %d %d %d    # %s" % (n, *pos, text.replace("\n", " / ").strip(" /")))
open(os.path.join(fd, "signs_ko.mcfunction"), "w", encoding="utf8").write("\n".join(l.split("    #")[0] if not l.startswith("##") else l for l in lines) + "\n")
print("표지판 %d개 → structures/hanok/, functions/hanok/signs_ko.mcfunction" % (len(SIGNS) - len(missing)) + (" (못 찾음: %s)" % missing if missing else ""))
for l in lines[2:]: print("  " + l)
