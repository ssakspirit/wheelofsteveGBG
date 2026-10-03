"""블록 이름(+상태) → 면별 텍스처 파일. export-areas.py가 쓴다.

blocks.json(어느 면에 어떤 텍스처 키) → terrain_texture.json(키 → 파일) 순서로 찾는다.
바닐라는 기본 팩 위에 버전별 팩(vanilla_1.xx)이 차례로 덮이고, 그 위에 이 월드의 리소스팩이 덮인다.
  Tex(with_rp=True)  : 지금 게임에서 보이는 모습 (리소스팩 포함)
  Tex(with_rp=False) : 바닐라 원본
"""
import os, re, json

ROOT = os.path.join(os.path.dirname(__file__), "..")
RP = os.path.join(ROOT, "resource_packs", "rp0")

def vanilla_packs():
    base = "C:/Program Files/WindowsApps"
    roots = []
    try:
        roots = [os.path.join(base, d, "data", "resource_packs") for d in os.listdir(base)
                 if d.startswith("Microsoft.MinecraftEducationEdition_") and "x64" in d]
    except OSError:
        pass
    roots.append(base + "/Microsoft.MinecraftEducationEdition_1.26.3200.0_x64__8wekyb3d8bbwe/data/resource_packs")
    for r in roots:
        if os.path.isdir(os.path.join(r, "vanilla")):
            ver = lambda n: [int(x) for x in re.findall(r"\d+", n)]
            names = sorted((n for n in os.listdir(r) if n == "vanilla" or re.match(r"vanilla_\d", n)), key=lambda n: (n != "vanilla", ver(n)))
            return [os.path.join(r, n) for n in names]   # 오래된 것 → 새것
    return []

def loose_json(path):
    if not os.path.exists(path): return None
    src = open(path, encoding="utf8", errors="replace").read().lstrip("\ufeff")
    out, i, n, ins = [], 0, len(src), False   # \ubb38\uc790\uc5f4 \ubc16\uc758 // \u00b7 /* */ \uc8fc\uc11d\uc744 \uc9c0\uc6b4\ub2e4 (\ubc14\ub2d0\ub77c \ud30c\uc77c\uc740 \uc904 \ub05d \uc8fc\uc11d\uc774 \uc788\ub2e4)
    while i < n:
        c = src[i]
        if ins:
            out.append(c)
            if c == "\\" and i + 1 < n: out.append(src[i + 1]); i += 1
            elif c == '"': ins = False
        elif c == '"': ins = True; out.append(c)
        elif src.startswith("//", i): i = src.find("\n", i); i = n if i < 0 else i; continue
        elif src.startswith("/*", i): i = src.find("*/", i); i = n if i < 0 else i + 2; continue
        else: out.append(c)
        i += 1
    t = re.sub(r",(\s*[}\]])", r"\1", "".join(out))
    try: return json.loads(t)
    except ValueError: return None

VAN = vanilla_packs()
ALIAS = {"grass_block": "grass", "stone_block_slab3": "stone_slab3", "double_stone_block_slab3": "stone_slab3",
         "stone_block_slab": "stone_slab", "stone_block_slab2": "stone_slab2", "stone_block_slab4": "stone_slab4"}
WOODS = {"oak": "planks_oak", "spruce": "planks_spruce", "birch": "planks_birch", "jungle": "planks_jungle", "acacia": "planks_acacia",
         "dark_oak": "planks_big_oak", "mangrove": "mangrove_planks", "cherry": "cherry_planks", "bamboo": "bamboo_planks",
         "crimson": "huge_fungus/crimson_planks", "warped": "huge_fungus/warped_planks", "pale_oak": "pale_oak_planks"}
# 배열 텍스처(옛 블록)의 변형 순서: 상태 이름 → 값 목록
VARIANTS = {
    "stone_brick_type": ["default", "mossy", "cracked", "chiseled", "smooth"],
    "stone_slab_type_3": ["end_stone_brick", "smooth_red_sandstone", "polished_andesite", "andesite", "diorite", "polished_diorite", "granite", "polished_granite"],
    "stone_slab_type": ["smooth_stone", "sandstone", "wood", "cobblestone", "brick", "stone_brick", "quartz", "nether_brick"],
    "wood_type": ["oak", "spruce", "birch", "jungle", "acacia", "dark_oak"],
    "sand_type": ["normal", "red"],
    "color": ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "silver", "cyan", "purple", "blue", "brown", "green", "red", "black"],
}

class Tex:
    def __init__(self, with_rp=True):
        packs = VAN + ([RP] if with_rp else [])
        self.packs = packs
        self.blocks, self.terrain = {}, {}
        for p in packs:
            b = loose_json(os.path.join(p, "blocks.json")) or {}
            for k, v in b.items():
                if isinstance(v, dict): self.blocks[k.replace("minecraft:", "")] = v
            t = loose_json(os.path.join(p, "textures", "terrain_texture.json")) or {}
            self.terrain.update(t.get("texture_data", {}))

    def file(self, rel):
        """'textures/blocks/x' → 실제 파일 (새 팩부터)."""
        for p in reversed(self.packs):
            for ext in (".png", ".tga"):
                f = os.path.join(p, rel + ext)
                if os.path.exists(f): return f
        return None

    def key_file(self, key, states):
        """atlas 키 → (파일, 덧칠 색 또는 None). 덧칠 색: overlay_color(회색 부분만) / tint_color(전체)."""
        e = self.terrain.get(key)
        if e is None: return None
        t = e.get("textures") if isinstance(e, dict) else e
        if isinstance(t, list):
            i = 0
            for s, order in VARIANTS.items():
                if s in states and states[s] in order: i = order.index(states[s]); break
            t = t[min(i, len(t) - 1)] if t else None
        color = None
        if isinstance(t, dict):
            color = ("overlay", t["overlay_color"]) if "overlay_color" in t else ("tint", t["tint_color"]) if "tint_color" in t else None
            t = t.get("path")
        f = self.file(t) if isinstance(t, str) else None
        return (f, color) if f else None

    def faces(self, name, states):
        """{'up','down','north','south','east','west'} → (파일, 덧칠) (못 찾은 면은 None).
        풀·잎·덩굴처럼 바이옴 색을 입히는 블록은 미리 색을 칠한 carried 텍스처를 쓴다."""
        out = dict.fromkeys(["up", "down", "north", "south", "east", "west"])
        e = self.blocks.get(ALIAS.get(name, name), {})
        b = e.get("carried_textures") or e.get("textures")
        if isinstance(b, str): b = {"*": b}
        if isinstance(b, dict):
            for f in out:
                k = b.get(f) or (b.get("side") if f not in ("up", "down") else None) or b.get("*")
                if k: out[f] = self.key_file(k, states)
        if all(out.values()): return out
        # blocks.json에 그림이 없는 블록(새로 나뉜 블록 등): 이름으로 짐작
        guess = [name, name + "_side", name.replace("_block", "")]
        m = re.match(r"(.+?)_(double_slab|slab|stairs|fence_gate|fence|wall|trapdoor|pressure_plate|button)$", name)
        if m:
            base = m.group(1)
            if base in WOODS: guess.insert(0, "@" + WOODS[base])
            guess += [base, base + "s", base.replace("_brick", "brick"), base + "_planks", base + "_bricks"]
        def fileonly(f): return (f, None) if f else None
        top = None
        for g in guess:
            f = fileonly(self.file("textures/blocks/" + g[1:])) if g.startswith("@") else (self.key_file(g, states) or fileonly(self.file("textures/blocks/" + g)))
            if f: top = f; break
        top_f = self.key_file(name + "_top", states) or fileonly(self.file("textures/blocks/" + name + "_top"))
        for f in out:
            if out[f] is None: out[f] = (top_f if f in ("up", "down") and top_f else top)
        return out
