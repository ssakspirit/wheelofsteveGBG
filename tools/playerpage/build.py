"""플레이어용 소개 페이지(claude.ai 웹 페이지)를 만든다.

  python tools/playerpage/build.py            → tools/playerpage/dist/index.html + dist/audio/*.mp3
page.html(본문)의 {{img:이름}} 자리에 그림을 data URI로 넣는다. 음악은 dist/audio/에 따로 두고 페이지와 함께 올린다.
그림 출처:
  - 진행자·혼천의: tools/skins/renders/poster_*.png (포스터용 렌더)
  - 자격루 장치: tools/skins/renders/device_N.png
  - 동물·과녁·옥새·도적·비격진천뢰 등: 개발자 페이지 3D 모델을 렌더한 render/entities.png(8열 256칸) + render/bomb.png
  - 아이템 그림: 리소스팩 16×16 텍스처를 8배로 키움 (픽셀 그대로)
음악: 월드 밖 ../_경복궁어전대회_원본/음원_FlowMusic의 원본 WAV에서 게임에 쓴 구간 60초 (게임 안에서는 배속 재생용으로 늘인 파일이라 원본에서 뽑는다)
"""
import os, io, re, base64, subprocess, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))
RP = os.path.join(ROOT, "resource_packs", "rp0", "textures")
REN = os.path.join(ROOT, "tools", "skins", "renders")
DIST = os.path.join(HERE, "dist")
os.makedirs(os.path.join(DIST, "audio"), exist_ok=True)
IMG = {}

def png_uri(im):
    b = io.BytesIO(); im.save(b, "PNG", optimize=True); return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()
def jpg_uri(im, q=82):
    b = io.BytesIO(); im.convert("RGB").save(b, "JPEG", quality=q, optimize=True, progressive=True); return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
def trim(im, pad=6):
    bb = im.getbbox(); im = im.crop(bb)
    out = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2)); out.paste(im, (pad, pad)); return out
def fit(im, h):
    return im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS) if im.height > h else im

# 포스터 · 제목
poster = Image.open(os.path.join(RP, "particle", "marketing", "movieMinigames_MarketingKeyArt.png")).convert("RGB")
IMG["poster"] = jpg_uri(poster.resize((1600, 900), Image.LANCZOS), 80)
IMG["title"] = png_uri(fit(trim(Image.open(os.path.join(REN, "poster_title.png")).convert("RGBA"), 0), 260))
IMG["bg"] = jpg_uri(Image.open(os.path.join(REN, "poster_bg_gyeongbokgung.jpg")).resize((1280, 720), Image.LANCZOS), 72)
# 진행자
for k, f in {"hwanghui": "poster_npc_1", "jangyeongsil": "poster_npc_2", "kimjongseo": "poster_npc_3", "taejo": "poster_npc_4", "jeongdojeon": "poster_npc_5", "wheel": "poster_wheel"}.items():
    IMG[k] = png_uri(fit(trim(Image.open(os.path.join(REN, f + ".png")).convert("RGBA")), 340))
for i in range(1, 6):
    IMG["device%d" % i] = png_uri(fit(trim(Image.open(os.path.join(REN, "device_%d.png" % i)).convert("RGBA")), 240))
# 3D 모델 렌더 (개발자 페이지에서 뽑은 8열 256칸 판)
SHEET = ["bat", "flower_tile", "honcheonui", "target_bear", "target_deer", "target", "thief", "orb", "turtle", "butterfly", "girin", "crane",
         "cow", "cheonma", "magpie", "white_deer", "deer", "-", "sapsal", "white_tiger", "hare", "jade_rabbit", "cat", "haechi",
         "longevity_god", "crab", "tiger", "-", "cart"]
sheet = Image.open(os.path.join(HERE, "render", "entities.png")).convert("RGBA")
for i, k in enumerate(SHEET):
    if k == "-": continue
    cell = sheet.crop(((i % 8) * 256, (i // 8) * 256, (i % 8) * 256 + 256, (i // 8) * 256 + 256))
    IMG[k] = png_uri(fit(trim(cell), 200))
IMG["bomb"] = png_uri(fit(trim(Image.open(os.path.join(HERE, "render", "bomb.png")).convert("RGBA")), 200))
# 아이템 아이콘 (16×16 → 8배)
def icon(path):
    im = Image.open(path).convert("RGBA")
    if im.height > im.width: im = im.crop((0, 0, im.width, im.width))
    return png_uri(im.resize((im.width * 8, im.height * 8), Image.NEAREST))
IMG["i_orb"] = icon(os.path.join(RP, "rwm", "items", "orb.png"))
IMG["i_coin"] = icon(os.path.join(RP, "items", "emerald.png"))
IMG["i_red_robe"] = icon(os.path.join(RP, "items", "iron_chestplate.png"))
IMG["i_blue_robe"] = icon(os.path.join(RP, "items", "diamond_chestplate.png"))
IMG["i_red_hat"] = icon(os.path.join(RP, "items", "iron_helmet.png"))
IMG["i_blue_hat"] = icon(os.path.join(RP, "items", "diamond_helmet.png"))
for n in range(1, 13): IMG["i_part%d" % n] = icon(os.path.join(RP, "rwm", "items", "craft_part_%d.png" % n))
for n in range(1, 6): IMG["i_diagram%d" % n] = icon(os.path.join(RP, "rwm", "items", "craft_diagram_%d.png" % n))
for c in ["lime", "blue", "yellow", "red", "magenta"]: IMG["t_" + c] = icon(os.path.join(RP, "blocks", "concrete_%s.png" % c))
for k, f in {"b_giwa": "blocks/rwm/giwa", "b_dancheong": "blocks/obsidian", "b_wall": "blocks/cobblestone", "b_baksuk": "blocks/stone_slab_top",
             "b_changho": "blocks/rwm/changho", "b_hoebyeok": "blocks/rwm/hoebyeok", "b_jangdae": "blocks/stonebrick", "b_jeondol": "blocks/concrete_silver", "b_bamboo": "blocks/rwm/daenamu", "b_mokjae": "blocks/rwm/mokjae", "b_gunpowder": "blocks/tnt_side", "b_pillar": "blocks/stripped_oak_log", "b_portal": "blocks/portal"}.items():
    IMG[k] = icon(os.path.join(RP, f + ".png"))

IMG["i_bow"] = icon(os.path.join(RP, "items", "bow_standby.png"))
IMG["i_rocket"] = icon(os.path.join(RP, "items", "fireworks.png"))
IMG["i_wing"] = icon(os.path.join(RP, "items", "elytra.png"))
IMG["b_door"] = icon(os.path.join(RP, "items", "door_wood.png"))
IMG["b_bookshelf"] = icon(os.path.join(RP, "blocks", "bookshelf.png"))
_lan = Image.open(os.path.join(RP, "blocks", "lantern.png")).convert("RGBA").crop((0, 2, 6, 9))   # 청사초롱 옆면(6×7)
IMG["b_lantern"] = png_uri(_lan.resize((_lan.width * 12, _lan.height * 12), Image.NEAREST))

def crop_icon(rel, box, k=6):
    im = Image.open(os.path.join(RP, rel + ".png")).convert("RGBA").crop(box)
    return png_uri(im.resize((im.width * k, im.height * k), Image.NEAREST))
IMG["p_sign"] = crop_icon("entity/sign", (2, 2, 26, 14), 4)
IMG["p_chest"] = crop_icon("entity/chest/normal", (14, 0, 28, 14), 6)
IMG["p_dwiju"] = icon(os.path.join(RP, "blocks", "barrel_top.png"))
IMG["p_hwadeok"] = icon(os.path.join(RP, "blocks", "furnace_front_on.png"))
IMG["p_bed"] = crop_icon("entity/bed/white", (6, 6, 22, 28), 4)
IMG["p_sun"] = crop_icon("environment/sun", (4, 4, 28, 28), 4)

# 음악 미리듣기
SRC = os.path.normpath(os.path.join(ROOT, "..", "_경복궁어전대회_원본", "음원_FlowMusic"))
TRACKS = {"orb": ("Imperial-Vanguard.wav", 28.68), "craft": ("Jagyeokru-Workshop.wav", 21.85), "grid": ("Gyotaejeon-Garden-Flow.wav", 0),
          "nock": ("The-King-s-Archery-Contest.wav", 0), "elytra": ("Vanguard-Charge.wav", 0), "finale": ("Royal-Mountain-Descent.wav", 5.08)}
try:
    import imageio_ffmpeg; FF = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:
    FF = None
for k, (f, start) in TRACKS.items():
    out = os.path.join(DIST, "audio", k + ".mp3")
    src = os.path.join(SRC, f)
    if os.path.exists(out) or not FF or not os.path.exists(src): continue
    subprocess.run([FF, "-y", "-loglevel", "error", "-ss", str(start), "-t", "60", "-i", src,
                    "-af", "afade=t=in:d=1,afade=t=out:st=56:d=4", "-ac", "2", "-b:a", "128k", out], check=True)

# 본문에 그림 넣기
html = open(os.path.join(HERE, "page.html"), encoding="utf8").read()
missing = sorted(set(re.findall(r"\{\{img:([a-z0-9_]+)\}\}", html)) - set(IMG))
if missing: sys.exit("page.html에 없는 그림: " + ", ".join(missing))
html = re.sub(r"\{\{img:([a-z0-9_]+)\}\}", lambda m: IMG[m.group(1)], html)
open(os.path.join(DIST, "index.html"), "w", encoding="utf8").write(html)
print("dist/index.html %.1f MB, 음악 %d곡" % (len(html.encode()) / 1e6, len(os.listdir(os.path.join(DIST, "audio")))))
