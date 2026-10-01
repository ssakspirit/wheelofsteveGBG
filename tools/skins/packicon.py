# 팩 아이콘(256×256)과 월드 목록 썸네일 — 원작은 키아트에서 잘라 낸 스티브 얼굴.
#   python tools/skins/packicon.py
# 소재는 시작 방 포스터와 같다(tools/skins/keyart.py):
#   resource_packs/rp0/pack_icon.png  근정전 앞 태조 이성계 상반신
#   behavior_packs/bp0/pack_icon.png  근정전 앞 혼천의 (게임 진행을 맡는 팩) — BP에서 그림만 바꾸는 예외로 허용된 파일
#   world_icon.jpeg (800×450)         완성된 포스터를 줄인 것. 게임이 월드를 나갈 때 스크린숏으로 덮어쓸 수 있으니 그때 다시 실행
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(__file__)
ROOT = os.path.join(HERE, "..", "..")
REN = os.path.join(HERE, "renders")
S = 256

def icon(subject, height, top, out):
    bg = Image.open(os.path.join(REN, "poster_bg_gyeongbokgung.jpg")).convert("RGBA")
    bg = bg.crop((700, 280, 1240, 820)).resize((S, S), Image.LANCZOS)   # 근정전과 북악산 부분
    shade = Image.new("RGBA", (S, S)); d = ImageDraw.Draw(shade)        # 아래로 갈수록 살짝 어둡게
    for y in range(S):
        d.line([(0, y), (S, y)], fill=(20, 14, 10, int(120 * max(0, y - 90) / (S - 90))))
    bg.alpha_composite(shade)
    p = Image.open(os.path.join(REN, f"poster_{subject}.png")).convert("RGBA")
    p = p.crop(p.getbbox())
    w = round(p.width * height / p.height)
    p = p.resize((w, height), Image.NEAREST if subject.startswith("npc") else Image.LANCZOS)
    bg.alpha_composite(p, ((S - w) // 2, top))
    bg.convert("RGB").save(os.path.join(ROOT, out))
    print("썼음", out)

icon("npc_4", 370, 24, "resource_packs/rp0/pack_icon.png")   # 머리와 상반신이 보이고 다리는 아래로 잘린다
icon("wheel", 236, 26, "behavior_packs/bp0/pack_icon.png")   # 혼천의 전체

poster = Image.open(os.path.join(ROOT, "resource_packs/rp0/textures/particle/marketing/movieMinigames_MarketingKeyArt.png")).convert("RGB")
poster.resize((800, 450), Image.LANCZOS).save(os.path.join(ROOT, "world_icon.jpeg"), quality=90)
print("썼음 world_icon.jpeg")
