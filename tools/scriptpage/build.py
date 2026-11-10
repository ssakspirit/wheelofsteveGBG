"""진행 대본 페이지(claude.ai 웹 페이지)를 만든다.

  python tools/scriptpage/build.py      → tools/scriptpage/dist/index.html (그림은 data URI로 한 파일에)
내용: script.json (extract.py가 진행 대본 hwpx에서 뽑은 것). hwpx를 쓴 뒤 바뀐 사실은 아래 PATCH·ADD로 고친다(원본 hwpx는 그대로).
그림: 플레이어 안내 페이지와 같은 출처(tools/skins/renders, tools/playerpage/render, 리소스 팩 텍스처).
자격루 3×3 조합은 게임의 조합법(crafting_grid.mcfunction)에서 읽는다.
"""
import os, io, re, json, base64, html
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))
RP = os.path.join(ROOT, "resource_packs", "rp0", "textures")
REN = os.path.join(ROOT, "tools", "skins", "renders")
PREN = os.path.join(ROOT, "tools", "playerpage", "render")
DIST = os.path.join(HERE, "dist")
os.makedirs(DIST, exist_ok=True)
E = html.escape

# ---------------- 그림 ----------------
def png_uri(im):
    b = io.BytesIO(); im.save(b, "PNG", optimize=True); return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()
def jpg_uri(im, q=78):
    b = io.BytesIO(); im.convert("RGB").save(b, "JPEG", quality=q, optimize=True, progressive=True); return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
def trim(im, pad=6):
    im = im.crop(im.getbbox()); out = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2)); out.paste(im, (pad, pad)); return out
def fit(im, h):
    return im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS) if im.height > h else im
def icon(rel, scale=6):
    im = Image.open(os.path.join(RP, rel)).convert("RGBA")
    if im.height > im.width: im = im.crop((0, 0, im.width, im.width))
    return png_uri(im.resize((im.width * scale, im.height * scale), Image.NEAREST))

IMG = {}
IMG["poster"] = jpg_uri(Image.open(os.path.join(RP, "particle", "marketing", "movieMinigames_MarketingKeyArt.png")).resize((1280, 720), Image.LANCZOS), 76)
for k, f in {"hwanghui": "poster_npc_1", "jangyeongsil": "poster_npc_2", "kimjongseo": "poster_npc_3", "taejo": "poster_npc_4",
             "jeongdojeon": "poster_npc_5", "wheel": "poster_wheel"}.items():
    IMG[k] = png_uri(fit(trim(Image.open(os.path.join(REN, f + ".png")).convert("RGBA")), 300))
for i in range(1, 6):
    IMG["device%d" % i] = png_uri(fit(trim(Image.open(os.path.join(REN, "device_%d.png" % i)).convert("RGBA")), 200))
SHEET = ["bat", "flower_tile", "honcheonui", "target_bear", "target_deer", "target", "thief", "orb", "turtle", "butterfly", "girin", "crane",
         "cow", "cheonma", "magpie", "white_deer", "deer", "-", "sapsal", "white_tiger", "hare", "jade_rabbit", "cat", "haechi",
         "longevity_god", "crab", "tiger", "-", "cart"]
WANT = {"bat", "honcheonui", "target_bear", "target_deer", "target", "thief", "orb", "turtle", "crane", "magpie", "girin", "haechi", "tiger", "cart", "flower_tile"}
sheet = Image.open(os.path.join(PREN, "entities.png")).convert("RGBA")
for i, k in enumerate(SHEET):
    if k in WANT:
        IMG[k] = png_uri(fit(trim(sheet.crop(((i % 8) * 256, (i // 8) * 256, (i % 8) * 256 + 256, (i // 8) * 256 + 256))), 170))
IMG["bomb"] = png_uri(fit(trim(Image.open(os.path.join(PREN, "bomb.png")).convert("RGBA")), 170))
for k in ("scene_gwanghwamun", "scene_geunjeongjeon", "scene_orb", "scene_craft", "scene_grid", "scene_nock", "scene_elytra", "scene_finale"):
    im = Image.open(os.path.join(PREN, k + ".png")).convert("RGB")
    IMG[k] = jpg_uri(im.resize((820, round(im.height * 820 / im.width)), Image.LANCZOS), 74)
for k, rel in {"i_orb": "rwm/items/orb.png", "i_coin": "items/emerald.png", "i_red_hat": "items/iron_helmet.png", "i_red_robe": "items/iron_chestplate.png",
               "i_blue_hat": "items/diamond_helmet.png", "i_blue_robe": "items/diamond_chestplate.png", "i_king_hat": "items/gold_helmet.png",
               "i_king_robe": "items/gold_chestplate.png", "i_bow": "items/bow_standby.png", "i_rocket": "items/fireworks.png", "i_wing": "items/elytra.png"}.items():
    IMG[k] = icon(rel)
for n in range(1, 13): IMG["part%d" % n] = icon("rwm/items/craft_part_%d.png" % n, 4)
for n in range(1, 6): IMG["diagram%d" % n] = icon("rwm/items/craft_diagram_%d.png" % n, 4)
for c in ["lime", "blue", "yellow", "red", "magenta"]: IMG["tile_" + c] = icon("blocks/concrete_%s.png" % c, 5)

def img(key, alt="", cls=""):
    return f'<img src="{IMG[key]}" alt="{E(alt)}"{f" class={chr(34)}{cls}{chr(34)}" if cls else ""} loading="lazy">'

# 자격루 조합법: 판 N(= 장치 N)의 칸 r1..r9에 놓을 부품 번호 (0 = 빈칸)
def recipes():
    s = open(os.path.join(ROOT, "behavior_packs/bp0/functions/utility/games/craft/crafting_grid.mcfunction"), encoding="utf-8").read()
    R = {}
    for m in re.finditer(r"tag=board_(\d),x=-13[^\n]*?tag=r(\d),tag=part_(\w+)", s):
        R.setdefault(int(m.group(1)), [0] * 9)[int(m.group(2)) - 1] = 0 if m.group(3) == "null" else int(m.group(3))
    return R
RECIPE = recipes()
PART = ["물항아리(파수호)", "물받이 통(수수호)", "숟가락 장치", "시보 인형", "십이지신 인형", "청동 이음쇠", "구슬 통로", "나무 받침틀", "지렛대", "굴대(회전축)", "작은 쇠구슬", "큰 쇠구슬"]
DEVICE = ["물 공급 장치", "잣대 장치", "구슬 신호 장치", "종·북·징 시보 장치", "십이지신 시각 알림 장치"]
DEVICE_HOW = ["항아리(파수호)들을 거쳐 물이 아래로 일정하게 흘러내림", "물받이 통(수수호)에 물이 차오르면 잣대(살대)가 떠오름",
              "잣대가 정한 높이에 닿으면 작은 구슬 → 큰 구슬이 굴러감", "구슬이 숟가락 장치를 움직이면 인형이 종(시)·북(경)·징(점)을 침",
              "열두 동물 인형이 시각 패를 들고 나와 시각을 알림"]

# ---------------- 마당 ----------------
GAMES = {
    "lobby": dict(name="로비 · 경복궁", host="세종대왕", pic="wheel", power="대회를 여는 곳", time="", tone="#6d4b2f", scenes=[("scene_gwanghwamun", "광화문"), ("scene_geunjeongjeon", "근정전")]),
    "orb": dict(name="옥새 쟁탈전", host="영의정 황희", pic="hwanghui", power="의사소통", time="5분", tone="#a3322a", scenes=[("scene_orb", "강녕전 자리")]),
    "craft": dict(name="자격루 복원전", host="장영실", pic="jangyeongsil", power="협동", time="5분", tone="#2b4f86", scenes=[("scene_craft", "경회루 남쪽 수정전 자리")]),
    "grid": dict(name="교태전 꽃담 맞추기", host="정도전", pic="jeongdojeon", power="비판적 사고", time="약 5분", tone="#a9801f", scenes=[("scene_grid", "교태전 자리와 아미산")]),
    "nock": dict(name="태조의 활쏘기 대회", host="태조 이성계", pic="taejo", power="창의성", time="약 3분", tone="#2e6f58", scenes=[("scene_nock", "인왕산 기슭 산속 활터")]),
    "elytra": dict(name="6진 망루 공성전", host="장수 김종서", pic="kimjongseo", power="공동체", time="약 5분 · 50점 선승", tone="#33405f", scenes=[("scene_elytra", "두만강 골짜기")]),
    "finale": dict(name="백악산 엽전 달리기", host="세종대왕 (비밀 대결)", pic="wheel", power="우승팀 축하 무대", time="약 1분", tone="#5c6b74", scenes=[("scene_finale", "백악산 눈 덮인 비탈")]),
}

def figs(items):
    return '<div class="figs">' + "".join(f'<figure>{img(k, n)}<figcaption><b>{E(n)}</b>{f"<span>{E(d)}</span>" if d else ""}</figcaption></figure>' for k, n, d in items) + "</div>"

def visuals(key):
    """마당마다 대본 위에 붙는 그림 자료."""
    if key == "lobby":
        return figs([("honcheonui", "혼천의", "대결을 고르는 천문 기구"), ("i_red_hat", "사모", "관리의 검은 모자"), ("i_red_robe", "홍포대 관복", "붉은 단령 · 1팀"),
                     ("i_blue_robe", "청포대 관복", "푸른 단령 · 2팀"), ("i_king_hat", "익선관", "관전자(/function admin)"), ("i_king_robe", "곤룡포", "관전자는 세종대왕 차림")])
    if key == "orb":
        return figs([("orb", "옥새", "들고 있는 동안 1초에 1점"), ("thief", "복면 도적", "혼자 연습할 때만 나옴")])
    if key == "craft":
        cards = []
        for n in range(1, 6):
            grid = "".join(f'<span class="slot">{img("part%d" % p, PART[p - 1]) if p else ""}</span>' for p in RECIPE.get(n, [0] * 9))
            cards.append(f'<article class="device"><div class="dev-top">{img("device%d" % n, DEVICE[n - 1])}<div><p class="dev-no">장치 {n}</p>'
                         f'<h4>{E(DEVICE[n - 1])}</h4><p class="dev-how">{E(DEVICE_HOW[n - 1])}</p></div></div>'
                         f'<div class="dev-bottom"><div class="recipe" aria-label="{E(DEVICE[n - 1])} 조합 3×3">{grid}</div>'
                         f'<div class="dev-need"><span class="mini">{img("diagram%d" % n, "설계도")} 설계도 ⓝ</span>'.replace("ⓝ", "①②③④⑤"[n - 1]) +
                         f'<span class="mini">{img("part%d" % n, PART[n - 1])} 고유 부품: {E(PART[n - 1])}</span></div></div></article>')
        parts = "".join(f'<li>{img("part%d" % p, PART[p - 1])}<span><b>{p}</b> {E(PART[p - 1])}</span><em>{"고유" if p <= 5 else "공용"}</em></li>' for p in range(1, 13))
        return (f'<h3 class="vis-h">고장 난 다섯 장치와 조합 (게임 속 설계도 그대로)</h3><div class="devices">{"".join(cards)}</div>'
                f'<h3 class="vis-h">수리에 쓰는 부품 12가지</h3><p class="vis-note">1~5번은 장치마다 하나씩인 고유 부품, 6~12번은 여러 장치에 같이 쓰는 공용 부품입니다. 두 팀 모두 2명 이상이면 고장 난 장치 3개를 먼저 고친 팀이, 한 팀이라도 1명이면 수리 부품 8개를 먼저 만든 팀이 이깁니다.</p><ul class="parts">{parts}</ul>')
    if key == "grid":
        T = [("lime", "연두", "대나무", "변하지 않는 마음"), ("blue", "파랑", "거북등", "오래 살기를 빎"), ("yellow", "노랑", "국화", "꿋꿋함 · 수가 적어 귀함"),
             ("red", "빨강", "모란", "넉넉하고 귀하게 · 수가 적어 귀함"), ("magenta", "자홍", "매화", "굳은 마음")]
        return ('<h3 class="vis-h">꽃전돌 다섯 가지 (색이 헷갈리면 무늬로)</h3>' +
                figs([("tile_" + c, f"{col} · {motif}", mean) for c, col, motif, mean in T]) +
                figs([("flower_tile", "정원의 꽃전돌", "빙글빙글 도는 블록에 상호작용해 하나씩")]))
    if key == "nock":
        return ('<h3 class="vis-h">과녁 (대사례)</h3>' + figs([("target", "국궁 과녁", "1점"), ("target_bear", "웅후 · 곰", "3점 · 임금의 과녁"), ("target_deer", "미후 · 사슴", "5점 · 왕족과 신하"), ("i_bow", "각궁", "게임에서 쓰는 활")]) +
                '<h3 class="vis-h">민화 동물 (점수 없음)</h3>' + figs([("tiger", "호랑이", "호작도 · 나쁜 기운을 쫓음"), ("magpie", "까치", "반가운 소식"), ("bat", "붉은 박쥐", "蝠=福 · 큰 복"),
                ("crane", "학", "십장생"), ("turtle", "거북", "십장생"), ("haechi", "해치", "옳고 그름을 가림"), ("girin", "기린", "상상의 동물"), ("cart", "나무 수레", "움직이는 과녁")]))
    if key == "elytra":
        return figs([("bomb", "비격진천뢰", "상대 망루에 떨어뜨리면 1점"), ("i_rocket", "신기전", "빨라지는 중엔 투하 불가"), ("i_wing", "학 날개", "떨어지며 점프로 펼침")])
    if key == "finale":
        return figs([("i_coin", "엽전 (상평통보)", "가장 많이 주운 선수가 시상대 맨 위")])
    return ""

def game_head(key, compact=False):
    g = GAMES[key]
    chips = "".join(f"<span>{E(x)}</span>" for x in (g["power"], g["time"]) if x)
    scenes = "".join(f'<figure class="scene">{img(k, cap)}<figcaption>{E(cap)}</figcaption></figure>' for k, cap in g["scenes"])
    return (f'<header class="ghead" style="--tone:{g["tone"]}"><div class="who">{img(g["pic"], g["host"], "host")}<div><p class="gname">{E(g["name"])}</p>'
            f'<p class="ghost">진행자 {E(g["host"])}</p><div class="gchips">{chips}</div></div></div>{"" if compact else f"<div class={chr(34)}scenes{chr(34)}>{scenes}</div>"}</header>')

# ---------------- 대본 표기 → HTML ----------------
SPK = {"사회": "mc", "캐스터": "caster", "해설": "comm", "선수": "comm", "관객": "comm"}
def inline(t):
    out, pos = [], 0
    for m in re.finditer(r"\[([^\]]*)\]|\{([^}]*)\}|(/function [A-Za-z0-9_/]+)", t):
        out.append(E(t[pos:m.start()]))
        if m.group(1) is not None:
            v = m.group(1).strip()
            out.append(f'<span class="fill{"" if v else " empty"}">{E(v) if v else "채울 곳"}</span>')
        elif m.group(2) is not None:
            out.append(f"<strong>{E(m.group(2))}</strong>")
        else:
            out.append(f'<code class="cmd">{E(m.group(3))}</code>')
        pos = m.end()
    out.append(E(t[pos:]))
    return "".join(out)

def lines_html(lines):
    out, ul, sub = [], False, False
    def close():
        nonlocal ul, sub
        if sub: out.append("</ul></li>"); sub = False
        if ul: out.append("</ul>"); ul = False
    for l in lines:
        if l.startswith("  - "):
            if not ul: out.append('<ul class="bul">'); ul = True
            if not sub:
                if out[-1].endswith("</li>"): out[-1] = out[-1][:-5]
                out.append("<ul>"); sub = True
            out.append(f"<li>{inline(l[4:])}</li>"); continue
        if l.startswith("- "):
            if sub: out.append("</ul></li>"); sub = False
            if not ul: out.append('<ul class="bul">'); ul = True
            out.append(f"<li>{inline(l[2:])}</li>"); continue
        close()
        if not l.strip(): continue
        if l.startswith("# "): out.append(f'<h3 class="sh">{inline(l[2:])}</h3>')
        elif l.startswith("## "): out.append(f'<h4 class="ssh">{inline(l[3:])}</h4>')
        elif l.startswith("> "): out.append(f'<p class="cue"><span>지시</span>{inline(l[2:])}</p>')
        elif l.startswith("※"): out.append(f'<p class="note">{inline(l[1:].strip())}</p>')
        else:
            m = re.match(r"^(%s): (.*)$" % "|".join(SPK), l)
            if m: out.append(f'<p class="say {SPK[m.group(1)]}"><b class="spk">{m.group(1)}</b><span>{inline(m.group(2))}</span></p>')
            else: out.append(f'<p class="plain">{inline(l)}</p>')
    close()
    return "".join(out)

# ---------------- 내용 읽기 ----------------
DOC = json.load(open(os.path.join(HERE, "script.json"), encoding="utf-8"))
titles = [b["text"] for b in DOC if b["type"] == "title"]
rights = [b["text"] for b in DOC if b["type"] == "right"]
main = next(b for b in DOC if b["type"] == "table")
intro_note = next((b["text"] for b in DOC if b["type"] == "text"), "")

# hwpx를 쓴 뒤 바뀐 사실 (원본 hwpx는 그대로 둔다)
PATCH = [
    ("「경복궁 어전대회」 월드 v1.0(.mcworld 파일)을 가져와", "「경복궁 어전대회」 최신 배포판(.mcworld, GitHub 릴리스)을 가져와"),
    # v1.4: 주제 역량 이름을 게임 대사와 맞춤 (커뮤니티 → 공동체, 황희 대사의 소통 → 의사소통)
    ("커뮤니티", "공동체"),
    ("이기려면 소통이 무엇보다", "이기려면 의사소통이 무엇보다"),
    ("황희 정승이 말한 ‘소통’", "황희 정승이 말한 ‘의사소통’"),
]
ADD = {  # 줄 뒤에 덧붙이는 줄: (찾는 줄의 앞부분, [덧붙일 줄])
    "※ 진행자 설명 장면(약 1분) 동안에는": ["※ 설명을 건너뛰어야 할 때는 운영자가 /function skip → 3·2·1 카운트다운부터 시작합니다. 해설할 시간이 줄어드니 시간이 모자랄 때만 쓰세요."],
    "- {관전}: 중계용 계정은": ["- {관전자 차림}: 관전자는 세종대왕 차림(익선관·곤룡포)이 되고, 모든 경기의 배경음악을 선수들과 똑같이 듣습니다.",
                              "- {진행 편의 명령} (운영자면 누구나, 어전대회·연습 모두): /function skip — 경기 설명은 3·2·1부터, 팀을 정한 뒤의 혼천의 소개는 바로 로비로. /function end — 팀 경기를 무승부로 끝냄(승리 기록 없음, 어전대회에서는 그 대결을 한 것으로 침, 백악산 제외)."],
}
def patch(lines):
    out = []
    for l in lines:
        for a, b in PATCH: l = l.replace(a, b)
        out.append(l)
        for k, extra in ADD.items():
            if l.startswith(k): out.extend(extra)
    return out

# 본 대본 표 → 시간 묶음 → 장면
blocks, cur = [], None
for row in main["rows"][1:]:
    cells = {c["c"]: c for c in row}
    if 0 in cells:
        cur = {"time": " ".join(x for x in cells[0]["lines"] if x).replace(" – ", "–"), "rows": []}; blocks.append(cur)
    act = " ".join(x[2:] if x.startswith("# ") else x for x in cells.get(1, {"lines": []})["lines"] if x).replace(" · ", "·")
    cur["rows"].append({"act": act, "who": " ".join(x for x in cells[2]["lines"] if x), "lines": patch(cells[3]["lines"])})

ELEM_KEYS = [("경기 전", "lobby", "로비 소개"), ("혼천의", "wheel", "혼천의 돌리기"), ("옥새", "orb", "① 옥새"), ("자격루", "craft", "② 자격루"), ("교태전", "grid", "③ 꽃담"),
             ("활쏘기", "nock", "④ 활쏘기"), ("6진", "elytra", "⑤ 6진 망루"), ("공통", "common", "공통 멘트"), ("경기 종료", "break", "종료·막간"), ("백악산", "finale", "백악산·시상대")]

# 부록
app = DOC[DOC.index(main) + 1:]
H1 = [i for i, b in enumerate(app) if b["type"] == "h1"]
def sect(n):
    a = H1[n]; b = H1[n + 1] if n + 1 < len(H1) else len(app)
    return app[a + 1:b]
A1, A2, A3, A4, A5 = (sect(i) for i in range(5))
OPS = patch([b["text"] for b in A5 if b["type"] == "text"])

# ---------------- 페이지 조각 ----------------
VIEWS = []  # (id, 메뉴 묶음, 제목, html)
def nav_label(tid): return next(t for i, g, t, h in VIEWS if i == tid)

# 개요
tt = []
for b in blocks:
    for r in b["rows"]:
        tt.append((b["time"] if r is b["rows"][0] else "", r["act"] or "", r["who"]))
SECTION_OF = {"사전 세팅": "setup", "개회": "opening", "진행순서": "opening", "중등부 소개": "middle", "중등부 결승전": "middle", "시상": "award", "격려말씀·폐회": "award"}
def tt_link(act):
    for k, key, _ in ELEM_KEYS:
        if act.startswith(k) or k in act: return "elem-" + key
    for k, v in SECTION_OF.items():
        if act.startswith(k): return v
    return "setup"
timeline = "".join(f'<li><time>{E(t)}</time><a href="#{tt_link(a)}">{E(a or "")}</a><span class="whochip">{E(w)}</span></li>' for t, a, w in tt if a)
game_cards = "".join(f'<a class="gcard" href="#elem-{k}" style="--tone:{GAMES[k]["tone"]}">{img(GAMES[k]["pic"], GAMES[k]["host"])}<b>{E(GAMES[k]["name"])}</b><span>{E(GAMES[k]["host"])} · {E(GAMES[k]["power"])}</span></a>'
                     for k in ("orb", "craft", "grid", "nock", "elytra", "finale"))
legend = ('<ul class="legend"><li><b class="spk mc">사회</b> 사회자</li><li><b class="spk caster">캐스터</b></li><li><b class="spk comm">해설</b></li>'
          '<li><span class="cue mini-cue"><span>지시</span>무대·화면 지시</span></li><li><span class="fill">채울 곳</span> 행사 전에 채울 곳</li><li><strong>굵게</strong> 강조</li></ul>')
FACTS = "".join(f"<div><dt>{E(k.strip())}</dt><dd>{inline(v)}</dd></div>" for r in rights for k, v in re.findall(r"([^:\[\]]+?):\s*(\[[^\]]*\])", r))
overview = (f'<section class="cover"><img class="poster" src="{IMG["poster"]}" alt="경복궁 어전대회 포스터"><div class="cover-txt"><p class="eyebrow">진행 대본</p>'
            f'<h1>{E(re.sub(r"[「」]|진행 대본", "", titles[1]).strip() if len(titles) > 1 else "경복궁 어전대회")}<small>{E(titles[0])}</small></h1>'
            f'<dl class="facts">{FACTS}</dl></div></section>'
            f'<div class="two"><section class="panel"><h2>순서와 시간</h2><ol class="timeline">{timeline}</ol></section>'
            f'<section class="panel"><h2>다섯 마당과 비밀 대결</h2><p class="lead">혼천의가 아직 하지 않은 대결을 뽑고, 3승을 먼저 거둔 팀이 우승합니다. 우승팀은 백악산 엽전 달리기에 나섭니다.</p><div class="gcards">{game_cards}</div>'
            f'<h2 class="mt">대본 읽는 법</h2>{legend}</section></div>')
VIEWS.append(("overview", "overview", "개요", overview))

def row_html(r, with_act=True):
    head = f'<div class="rowhead">{f"<h2>{E(r[chr(97)+chr(99)+chr(116)])}</h2>" if with_act and r["act"] else ""}<span class="whochip">{E(r["who"])}</span></div>'
    return f'<article class="row">{head}<div class="script">{lines_html(r["lines"])}</div></article>'

b_setup, b_open, b_elem, b_mid_intro, b_mid, b_award = blocks
VIEWS.append(("setup", "setup", "사전 세팅", f'<p class="when">{E(b_setup["time"])}</p><h2 class="pt">사전 세팅·리허설</h2>' + "".join(row_html(r, False) for r in b_setup["rows"])))
VIEWS.append(("opening", "opening", "개회", f'<p class="when">{E(b_open["time"])}</p>' + "".join(row_html(r) for r in b_open["rows"])))
for k, key, label in ELEM_KEYS:
    r = next(x for x in b_elem["rows"] if k in x["act"])
    gkey = key if key in GAMES else None
    body = (game_head(gkey) if gkey else "") + (f'<div class="vis">{visuals(gkey)}</div>' if gkey and visuals(gkey) else "")
    VIEWS.append(("elem-" + key, "elem", label, f'<p class="when">초등부 결승 · {E(b_elem["time"])}</p>' + body + row_html(r)))
VIEWS.append(("middle", "middle", "중등부", f'<p class="when">{E(b_mid_intro["time"])}</p>' + "".join(row_html(r) for r in b_mid_intro["rows"]) +
              f'<p class="when">{E(b_mid["time"])}</p>' + "".join(row_html(r) for r in b_mid["rows"])))
VIEWS.append(("award", "award", "시상·폐회", f'<p class="when">{E(b_award["time"])}</p>' + "".join(row_html(r) for r in b_award["rows"])))

# 역사 해설
def table_html(t, first_bold=True):
    rows = []
    for i, row in enumerate(t["rows"]):
        tag = "th" if i == 0 else "td"
        rows.append("<tr>" + "".join(f"<{tag}>{'<br>'.join(inline(x) for x in patch(c['lines']) if x)}</{tag}>" for c in row) + "</tr>")
    return f'<div class="tbl"><table>{"".join(rows)}</table></div>'
def card_html(t):
    items = []
    for row in t["rows"]:
        lab = re.sub(r"^#+ ", "", " ".join(x for x in row[0]["lines"] if x))
        body = [re.sub(r"^(#+|>|-) ", "", x) for x in row[1]["lines"]]
        cls = " hl" if lab in ("해설 한마디", "중등부 심화") else ""
        content = ("<ul>" + "".join(f"<li>{inline(x)}</li>" for x in body if x) + "</ul>") if len([x for x in body if x]) > 1 else inline(" ".join(body))
        items.append(f'<div class="kv{cls}"><dt>{E(lab)}</dt><dd>{content}</dd></div>')
    return f'<dl class="card">{"".join(items)}</dl>'

HIST_KEYS = ["lobby", "orb", "craft", "grid", "nock", "elytra", "finale"]
h2s = [i for i, b in enumerate(A2) if b["type"] == "h2"]
hist_intro = next((b["text"] for b in A2 if b["type"] == "text"), "")
for n, i in enumerate(h2s):
    key = HIST_KEYS[n]; title = A2[i]["text"]; card = A2[i + 1]
    VIEWS.append(("hist-" + key, "hist", GAMES[key]["name"].split(" · ")[0] if key != "lobby" else "로비·경복궁",
                  f'<p class="when">부록 2 · 역사 배경 지식</p><h2 class="pt">{E(title)}</h2><p class="lead">{E(hist_intro)}</p>' + game_head(key, compact=True) + card_html(card)))
a1_html = "".join((f'<p class="lead">{inline(b["text"])}</p>' if b["type"] == "text" else f'<h3 class="sh">{E(b["text"])}</h3>' if b["type"] == "h2" else table_html(b)) for b in A1)
VIEWS.append(("hist-table", "hist", "원작 대조표", f'<p class="when">부록 1</p><h2 class="pt">한눈에 보는 경복궁 어전대회</h2>{a1_html}'))
VIEWS.append(("hist-caution", "hist", "고증 주의", f'<p class="when">부록 3</p><h2 class="pt">해설할 때 조심할 점</h2><div class="script">{lines_html([b["text"] for b in A3 if b["type"] == "text"])}</div>'))

# 퀴즈
quiz = next(b for b in A4 if b["type"] == "table")
qs = "".join(f'<li class="q"><p class="qn">{E(row[0]["lines"][0])}</p><p class="qq">{inline(" ".join(row[1]["lines"]))}</p>'
             f'<details><summary>정답 보기</summary><p>{inline(" ".join(row[2]["lines"]))}</p></details></li>' for row in quiz["rows"][1:])
VIEWS.append(("quiz", "quiz", "막간 퀴즈", f'<p class="when">부록 4 · 라운드 사이에</p><h2 class="pt">막간 역사 퀴즈</h2><p class="lead">문제를 읽고 관객 답을 들은 뒤 정답을 펼치세요.</p><ol class="quiz">{qs}</ol>'))
VIEWS.append(("ops", "ops", "운영 메모", f'<p class="when">부록 5 · 중계팀·진행팀</p><h2 class="pt">현장 운영 메모</h2><div class="script ops">{lines_html(OPS)}</div>'))

MENU = [("overview", "개요"), ("setup", "사전 세팅"), ("opening", "개회"), ("elem", "초등부 결승"), ("middle", "중등부"), ("award", "시상·폐회"),
        ("hist", "역사 해설"), ("quiz", "막간 퀴즈"), ("ops", "운영 메모")]
first_of = {g: next(i for i, gg, t, h in VIEWS if gg == g) for g, _ in MENU}
menu_html = "".join(f'<a href="#{first_of[g]}" data-group="{g}">{E(t)}</a>' for g, t in MENU)
def subnav(group):
    items = [(i, t) for i, g, t, h in VIEWS if g == group]
    return '<nav class="subnav" aria-label="세부 순서">' + "".join(f'<a href="#{i}">{E(t)}</a>' for i, t in items) + "</nav>"

views_html = []
for n, (vid, group, title, body) in enumerate(VIEWS):
    prev_ = VIEWS[n - 1] if n else None; next_ = VIEWS[n + 1] if n + 1 < len(VIEWS) else None
    pn = '<nav class="pn">' + (f'<a class="prev" href="#{prev_[0]}"><small>이전</small>{E(prev_[2])}</a>' if prev_ else "<span></span>") + \
         (f'<a class="next" href="#{next_[0]}"><small>다음</small>{E(next_[2])}</a>' if next_ else "<span></span>") + "</nav>"
    sub = subnav(group) if group in ("elem", "hist") else ""
    views_html.append(f'<section class="view" id="v-{vid}" data-view="{vid}" data-group="{group}" hidden>{sub}{body}{pn}</section>')

CSS = r"""
/* 배치: 위 메뉴(대회 순서) + 한 번에 한 장면. 대본은 말하는 사람 꼬리표와 지시·참고 상자로 읽기 쉽게.
   색은 플레이어 안내 페이지와 같은 단청(석간주·뇌록·군청)과 기와 먹색, 박석 회색. */
:root {
  --bg: #eef1ee; --paper: #fbfbf8; --ink: #1f2427; --muted: #5a6468; --line: #d3dad6; --chip: #e2e8e4;
  --red: #a3322a; --green: #2e6f58; --blue: #2b4f86; --gold: #9a6f12; --goldbg: #f6ecd2; --cue: #fbe9e6; --notebg: #e8eef8;
  --f-display: "Hahmlet", "Nanum Myeongjo", "Batang", serif;
  --f-body: "Gowun Dodum", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  --fs: 18px; --radius: 12px;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #15191b; --paper: #1e2427; --ink: #e9ece9; --muted: #a4adb0; --line: #313a3e; --chip: #273034;
  --red: #e0675b; --green: #5fb393; --blue: #7ea3e0; --gold: #e2b955; --goldbg: #3a3220; --cue: #3a2522; --notebg: #1f2a3b; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #15191b; --paper: #1e2427; --ink: #e9ece9; --muted: #a4adb0; --line: #313a3e; --chip: #273034;
  --red: #e0675b; --green: #5fb393; --blue: #7ea3e0; --gold: #e2b955; --goldbg: #3a3220; --cue: #3a2522; --notebg: #1f2a3b; color-scheme: dark }
* { box-sizing: border-box }
body { background: var(--bg); color: var(--ink); font-family: var(--f-body); font-size: var(--fs); line-height: 1.75; margin: 0 }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--paper) }
h1, h2, h3, h4 { font-family: var(--f-display); line-height: 1.3; text-wrap: balance; margin: 0 }
p { margin: 0 }
img { max-width: 100% }
a { color: var(--blue) }
:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px }
.wrap { max-width: 1100px; margin: 0 auto; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)) }

/* 위 메뉴 */
.top { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--paper); border-bottom: 1px solid var(--line) }
.top .wrap { display: flex; align-items: center; gap: 10px; padding-block: 6px }
.brand { font-family: var(--f-display); font-weight: 800; font-size: 16px; white-space: nowrap; color: var(--red); text-decoration: none }
.menu { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; flex: 1; min-width: 0 }
.menu a { flex: none; text-decoration: none; color: var(--ink); padding: 6px 11px; border-radius: 999px; font-size: 15px }
.menu a:hover { background: var(--chip) }
.menu a[aria-current="true"] { background: var(--red); color: #fff }
.size { display: flex; gap: 4px; flex: none }
.size button { font: inherit; font-size: 14px; border: 1px solid var(--line); background: var(--paper); color: var(--ink); border-radius: 8px; padding: 3px 9px; cursor: pointer; min-width: 36px }

main { padding-block: 20px 60px }
.view { display: grid; gap: 18px } .view[hidden] { display: none }
.when { color: var(--muted); font-size: 14px; letter-spacing: .04em }
.pt { font-size: 28px }
.lead { color: var(--muted); max-width: 44em }
.subnav { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none }
.subnav a { flex: none; text-decoration: none; color: var(--ink); background: var(--paper); border: 1px solid var(--line); border-radius: 999px; padding: 4px 12px; font-size: 15px }
.subnav a[aria-current="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink) }

/* 개요 */
.cover { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 20px; align-items: center; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden }
.cover .poster { display: block; width: 100%; height: 100%; object-fit: cover; aspect-ratio: 16 / 9 }
.cover-txt { padding: 18px 20px 18px 0; display: grid; gap: 12px }
.eyebrow { color: var(--red); font-weight: 700; letter-spacing: .12em; font-size: 14px }
.cover h1 { font-size: clamp(30px, 4.4vw, 44px); font-weight: 800 }
.cover h1 small { display: block; font-family: var(--f-body); font-weight: 400; font-size: 16px; color: var(--muted); margin-top: 6px }
.facts { margin: 0; display: grid; gap: 4px }
.facts div { display: grid; grid-template-columns: 6.5em 1fr; gap: 8px }
.facts dt { color: var(--muted) } .facts dd { margin: 0 }
.two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 18px; align-items: start }
.panel { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 16px 18px; display: grid; gap: 12px; min-width: 0 }
.panel h2 { font-size: 22px } .mt { margin-top: 8px }
.timeline { list-style: none; margin: 0; padding: 0; display: grid }
.timeline li { display: grid; grid-template-columns: 6.2em 1fr auto; gap: 10px; align-items: baseline; padding: 6px 0; border-bottom: 1px dashed var(--line) }
.timeline time { font-variant-numeric: tabular-nums; color: var(--red); font-weight: 700; font-size: 15px }
.timeline a { color: var(--ink); text-decoration: none } .timeline a:hover { text-decoration: underline }
.whochip { font-size: 13px; background: var(--chip); border-radius: 999px; padding: 1px 10px; white-space: nowrap; color: var(--muted) }
.gcards { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px }
.gcard { display: grid; justify-items: center; text-align: center; gap: 2px; text-decoration: none; color: var(--ink); border: 1px solid var(--line); border-top: 4px solid var(--tone); border-radius: 10px; padding: 10px 8px; background: var(--paper) }
.gcard img { height: 92px; width: auto; object-fit: contain }
.gcard b { font-family: var(--f-display); font-size: 16px } .gcard span { font-size: 13px; color: var(--muted) }
.legend { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: 15px }

/* 마당 머리 */
.ghead { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 14px; background: color-mix(in srgb, var(--tone) 12%, var(--paper)); border: 1px solid var(--line); border-top: 5px solid var(--tone); border-radius: var(--radius); padding: 14px; align-items: center }
.who { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: center }
.who .host { height: 150px; width: auto; filter: drop-shadow(0 6px 8px rgba(0,0,0,.25)) }
.gname { font-family: var(--f-display); font-size: 26px; font-weight: 800 }
.ghost { color: var(--muted) }
.gchips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px }
.gchips span { background: var(--tone); color: #fff; border-radius: 999px; padding: 1px 10px; font-size: 14px }
.scenes { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 8px }
.scene { margin: 0; position: relative } .scene img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 8px }
.scene figcaption { position: absolute; left: 8px; bottom: 8px; background: rgba(20,24,26,.72); color: #fff; font-size: 13px; padding: 0 9px; border-radius: 999px }
.ghead:has(.scenes:empty), .ghead:not(:has(.scenes)) { grid-template-columns: 1fr }

/* 그림 자료 */
.vis { display: grid; gap: 12px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px 16px }
.vis-h { font-size: 18px } .vis-note { color: var(--muted); font-size: 15px }
.figs { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px }
.figs figure { margin: 0; display: grid; justify-items: center; text-align: center; gap: 4px; background: var(--bg); border-radius: 10px; padding: 10px 6px }
.figs img { height: 84px; width: auto; object-fit: contain; image-rendering: pixelated }
.figs figcaption b { display: block; font-family: var(--f-display); font-size: 15px } .figs figcaption span { font-size: 13px; color: var(--muted) }
.devices { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 12px }
.device { border: 1px solid var(--line); border-radius: 10px; padding: 12px; display: grid; gap: 10px; background: var(--bg); min-width: 0 }
.dev-top { display: grid; grid-template-columns: 96px 1fr; gap: 10px; align-items: center }
.dev-top > img { width: 96px; height: 96px; object-fit: contain }
.dev-no { font-size: 13px; color: var(--blue); font-weight: 700 } .device h4 { font-size: 17px } .dev-how { font-size: 14px; color: var(--muted); line-height: 1.5 }
.dev-bottom { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center }
.recipe { display: grid; grid-template-columns: repeat(3, 40px); grid-template-rows: repeat(3, 40px); gap: 3px; background: #6b4a2e; padding: 4px; border-radius: 6px }
.slot { background: #efe6cf; border-radius: 3px; display: grid; place-items: center }
.slot img { width: 32px; height: 32px; image-rendering: pixelated }
.dev-need { display: grid; gap: 6px; font-size: 14px }
.mini { display: flex; align-items: center; gap: 6px } .mini img { width: 28px; height: 28px; image-rendering: pixelated }
.parts { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px }
.parts li { display: grid; grid-template-columns: 40px 1fr auto; gap: 8px; align-items: center; background: var(--bg); border-radius: 8px; padding: 6px 8px; font-size: 15px }
.parts img { width: 40px; height: 40px; image-rendering: pixelated } .parts b { color: var(--blue) }
.parts em { font-style: normal; font-size: 12px; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 0 7px }

/* 대본 */
.row { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 16px 20px; display: grid; gap: 12px; min-width: 0 }
.rowhead { display: flex; align-items: center; gap: 10px; flex-wrap: wrap } .rowhead h2 { font-size: 22px }
.script { display: grid; gap: 10px; max-width: 52em }
.sh { font-size: 21px; color: var(--red); padding-top: 6px }
.ssh { font-size: 18px; padding-top: 4px }
.say { display: grid; grid-template-columns: 4.4em 1fr; gap: 10px; align-items: start }
.spk { display: inline-block; text-align: center; font-family: var(--f-body); font-weight: 700; font-size: .8em; border-radius: 6px; padding: 1px 0; min-width: 4.2em; margin-top: .25em }
.spk.mc { background: var(--goldbg); color: var(--gold) } .spk.caster { background: var(--notebg); color: var(--blue) } .spk.comm { background: color-mix(in srgb, var(--green) 16%, var(--paper)); color: var(--green) }
.legend .spk { min-width: 3.6em; padding-inline: 6px }
.cue { background: var(--cue); border-radius: 8px; padding: 8px 12px; color: var(--ink); font-size: .92em }
.cue > span { font-weight: 700; color: var(--red); margin-right: 8px; font-size: .85em }
.mini-cue { padding: 2px 10px; display: inline-block }
.note { background: var(--notebg); border-radius: 8px; padding: 8px 12px; font-size: .92em }
.note::before { content: "참고 "; font-weight: 700; color: var(--blue) }
.bul { margin: 0; padding-left: 1.2em; display: grid; gap: 4px } .bul ul { padding-left: 1.2em; margin: 4px 0 }
.fill { background: color-mix(in srgb, var(--gold) 14%, transparent); border: 1px dashed var(--gold); border-radius: 5px; padding: 0 6px; color: var(--gold) }
.fill.empty { color: var(--muted); font-size: .85em }
strong { font-weight: 700 }
code.cmd { font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; font-size: .85em; background: var(--chip); border-radius: 6px; padding: 1px 6px; white-space: nowrap }
code.cmd + .copy { margin-left: 4px }
.copy { font: inherit; font-size: 12px; border: 1px solid var(--line); background: var(--paper); color: var(--muted); border-radius: 6px; padding: 0 6px; cursor: pointer; vertical-align: middle }

/* 역사 카드 */
.card { margin: 0; display: grid; gap: 8px }
.kv { display: grid; grid-template-columns: 9em 1fr; gap: 12px; background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px }
.kv dt { font-family: var(--f-display); font-weight: 700 } .kv dd { margin: 0 } .kv ul { margin: 0; padding-left: 1.1em }
.kv.hl { background: var(--goldbg); border-color: transparent }
.tbl { overflow-x: auto; background: var(--paper); border: 1px solid var(--line); border-radius: 10px }
table { border-collapse: collapse; width: 100%; font-size: 15px; min-width: 640px }
th, td { padding: 8px 10px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top }
th { background: var(--chip); font-family: var(--f-display) }
td:first-child { font-weight: 700; white-space: nowrap }

/* 퀴즈 */
.quiz { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px }
.q { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px 16px; display: grid; gap: 8px; align-content: start }
.qn { font-family: var(--f-display); font-weight: 800; color: var(--red) } .qq { font-size: 1.05em }
details summary { cursor: pointer; color: var(--blue); font-weight: 700 } details p { margin-top: 6px; background: var(--goldbg); border-radius: 8px; padding: 8px 12px }

/* 이전·다음 */
.pn { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px }
.pn a { text-decoration: none; color: var(--ink); background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 12px 16px; display: grid; font-family: var(--f-display); font-weight: 700 }
.pn a small { font-family: var(--f-body); font-weight: 400; color: var(--muted); font-size: 13px }
.pn .next { text-align: right }
.pn a:hover { border-color: var(--red) }

@media (max-width: 760px) {
  .cover, .two, .ghead { grid-template-columns: 1fr } .cover-txt { padding: 0 16px 16px }
  .say { grid-template-columns: 1fr; gap: 2px } .kv { grid-template-columns: 1fr; gap: 4px }
  .who .host { height: 110px } .scenes { grid-auto-flow: row }
  .timeline li { grid-template-columns: 5em 1fr } .timeline .whochip { display: none }
  .brand { display: none }
}
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth } }
"""

JS = r"""
(function () {
  var views = Array.prototype.slice.call(document.querySelectorAll('.view'));
  var ids = views.map(function (v) { return v.dataset.view; });
  function show() {
    var h = (location.hash || '').slice(1);
    if (ids.indexOf(h) < 0) h = 'overview';
    var group = '';
    views.forEach(function (v) { var on = v.dataset.view === h; v.hidden = !on; if (on) group = v.dataset.group; });
    document.querySelectorAll('.menu a').forEach(function (a) { a.setAttribute('aria-current', a.dataset.group === group ? 'true' : 'false'); });
    document.querySelectorAll('.subnav a').forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + h ? 'true' : 'false'); });
    var cur = document.querySelector('.menu a[aria-current="true"]'); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', show); show();
  // 글자 크기 (이 기기에만 기억)
  var size = 18; try { size = parseInt(localStorage.getItem('gbg-script-fs'), 10) || 18; } catch (e) {}
  function setSize(s) { size = Math.max(15, Math.min(26, s)); document.documentElement.style.setProperty('--fs', size + 'px'); try { localStorage.setItem('gbg-script-fs', size); } catch (e) {} }
  setSize(size);
  document.getElementById('fs-down').addEventListener('click', function () { setSize(size - 1); });
  document.getElementById('fs-up').addEventListener('click', function () { setSize(size + 1); });
  // 명령어 복사
  document.querySelectorAll('code.cmd').forEach(function (c) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'copy'; b.textContent = '복사';
    b.addEventListener('click', function () {
      var t = c.textContent;
      function done() { b.textContent = '복사됨'; setTimeout(function () { b.textContent = '복사'; }, 1400); }
      function pick() { var r = document.createRange(); r.selectNodeContents(c); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Ctrl+C'; }
      try { navigator.clipboard.writeText(t).then(done, pick); } catch (e) { pick(); }
    });
    c.insertAdjacentElement('afterend', b);
  });
})();
"""

page = f"""<meta charset="utf-8">
<title>경복궁 어전대회 진행 대본</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@500;700;800&family=Gowun+Dodum&display=swap">
<style>{CSS}</style>
<header class="top"><div class="wrap"><a class="brand" href="#overview">경복궁 어전대회</a><nav class="menu" aria-label="대회 순서">{menu_html}</nav>
<div class="size" role="group" aria-label="글자 크기"><button id="fs-down" type="button" aria-label="글자 작게">가-</button><button id="fs-up" type="button" aria-label="글자 크게">가+</button></div></div></header>
<main class="wrap">{"".join(views_html)}</main>
<script>{JS}</script>
"""
open(os.path.join(DIST, "index.html"), "w", encoding="utf-8").write(page)
print("dist/index.html %.1f MB, 장면 %d개" % (os.path.getsize(os.path.join(DIST, "index.html")) / 1e6, len(VIEWS)))
