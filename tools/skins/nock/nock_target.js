// 과녁(rwm:nock_target) → 대사례(임금이 주관하던 활쏘기 의식)의 과녁. 모델 하나에 텍스처 세 벌:
//   nock_target          : 기본 과녁(1점) — 붉은 테, 흰 바탕, 검은 관(貫), 붉은 홍심. 뒤의 동물은 투명.
//   nock_target_creeper  : 특수 과녁(3점) 웅후(熊侯) — 붉은 판에 곰 얼굴, 판 뒤에서 곰이 고개를 내민다(옛 크리퍼 자리).
//   nock_target_enderman : 특수 과녁(3점) 미후(麋侯) — 푸른 판에 사슴 얼굴, 판 뒤에서 뿔 달린 사슴이 내다본다(옛 엔더맨 자리).
// 판(target 뼈대, 14×14×4)의 크기·위치와 위치표(locator)는 그대로 — 맞히는 판정은 BP의 충돌 상자라 바뀌지 않는다.
// 옛 뼈대 이름(enderman, creeper, creeper_flash ...)은 남겨 두고 모양만 곰·사슴으로 바꾼다.
const { INK, flat, art, mats } = require("./minhwa");

const WOOD = "#8a5a33", WOOD_D = "#6b4426", RED = "#c8372d", WHITE = "#f4ecd8", GOLD = "#e0b04a", BLUE = "#2f5f9e";
const BEAR = "#3a2e28", BEAR_L = "#6b5446", MUZZLE = "#c9a27a", DEER = "#c4703a", DEER_L = "#efd9b4", ANTLER = "#7a5232";

// 14×14 과녁면
const FACES = {
  plain: art([
    "RRRRRRRRRRRRRR",
    "RWWWWWWWWWWWWR",
    "RWWWWWWWWWWWWR",
    "RWWKKKKKKKKWWR",
    "RWWKKKKKKKKWWR",
    "RWWKKRRRRKKWWR",
    "RWWKKRRRRKKWWR",
    "RWWKKRRRRKKWWR",
    "RWWKKRRRRKKWWR",
    "RWWKKKKKKKKWWR",
    "RWWKKKKKKKKWWR",
    "RWWWWWWWWWWWWR",
    "RWWWWWWWWWWWWR",
    "RRRRRRRRRRRRRR",
  ], { R: RED, W: WHITE, K: INK }),
  bear: art([
    "GGGGGGGGGGGGGG",
    "GRRRRRRRRRRRRG",
    "GRBBRRRRRRBBRG",
    "GRBBBBBBBBBBRG",
    "GRRBBBBBBBBRRG",
    "GRRBWKBBKWBRRG",
    "GRRBBBBBBBBRRG",
    "GRRBBMMMMBBRRG",
    "GRRBBMKKMBBRRG",
    "GRRRBMMMMBRRRG",
    "GRRRRBBBBRRRRG",
    "GRRRRRRRRRRRRG",
    "GRRRRRRRRRRRRG",
    "GGGGGGGGGGGGGG",
  ], { G: GOLD, R: RED, B: BEAR, W: WHITE, K: INK, M: MUZZLE }),
  deer: art([
    "GGGGGGGGGGGGGG",
    "GBABBBBBBBBABG",
    "GBAABBBBBBAABG",
    "GBBAABBBBAABBG",
    "GBBBADDDDABBBG",
    "GBBBDDDDDDBBBG",
    "GBBBDWDDWDBBBG",
    "GBBBDDDDDDBBBG",
    "GBBBBDLLDBBBBG",
    "GBBBBDLLDBBBBG",
    "GBBBBBLKBBBBBG",
    "GBBBBBBBBBBBBG",
    "GBBBBBBBBBBBBG",
    "GGGGGGGGGGGGGG",
  ], { G: GOLD, B: BLUE, A: ANTLER, D: DEER, W: WHITE, L: DEER_L, K: INK }),
};
const VARIANTS = {
  nock_target: { face: "plain", bear: false, deer: false },
  nock_target_creeper: { face: "bear", bear: true, deer: false },
  nock_target_enderman: { face: "deer", bear: false, deer: true },
};
const hide = (on, p) => (on ? p : () => null);     // 이 텍스처에서 안 보이는 동물은 투명

module.exports = {
  key: "nock_target", geo: "geometry.rwm.nock_target", dir: "models/entity", texDir: "textures/rwm/entity", size: [64, 64], variants: VARIANTS,
  build(K, V) {
    mats(K, {
      face: FACES[V.face],
      wood: (x, y, w, h) => (y % 3 === 0 ? WOOD_D : WOOD),
      bear: hide(V.bear, flat(BEAR)),
      bearLight: hide(V.bear, flat(BEAR_L)),
      bearFace: hide(V.bear, art(["BBBBBBBB", "BBBBBBBB", "BWKBBKWB", "BBBBBBBB", "BBMMMMBB", "BBMKKMBB", "BBMMMMBB", "BBBBBBBB"], { B: BEAR, W: WHITE, K: INK, M: MUZZLE })),
      bearEar: hide(V.bear, flat(BEAR, { line: false })),
      deer: hide(V.deer, flat(DEER)),
      deerLight: hide(V.deer, flat(DEER_L)),
      deerFace: hide(V.deer, art(["DDDD", "WKKW", "DDDD", "DLLD", "LKKL"], { D: DEER, W: WHITE, K: INK, L: DEER_L })),
      antler: hide(V.deer, flat(ANTLER, { line: false })),
    });
    const m = K.model("geometry.rwm.nock_target", { visible_bounds_width: 3, visible_bounds_height: 4.5, visible_bounds_offset: [0, 1.75, 0] });
    m.bone("root", { pivot: [0, 8, 0] })
      .bone("target", { parent: "root", pivot: [0, 8, 0], locators: { target_locator: [0, 8, 0] } })
      .bone("enderman", { parent: "root", pivot: [0, 0, 0], locators: { enderman_locator: [0, 24, 0] } })
      .bone("body", { parent: "enderman", pivot: [0, 14, 8] }).bone("head", { parent: "enderman", pivot: [0, 18, 3] })
      .bone("headwear", { parent: "enderman", pivot: [0, 18, 3] })
      .bone("right_arm", { parent: "enderman", pivot: [-2, 10, 4] }).bone("left_arm", { parent: "enderman", pivot: [2, 10, 4] })
      .bone("right_leg", { parent: "enderman", pivot: [-2, 10, 12] }).bone("left_leg", { parent: "enderman", pivot: [2, 10, 12] })
      .bone("creeper", { parent: "root", pivot: [0, 12, 8] })
      .bone("creeper_flash", { parent: "creeper", pivot: [0, 0, 8] });
    for (const b of ["head3", "body3", "leg5", "leg6", "leg7", "leg8"]) m.bone(b, { parent: "creeper_flash", pivot: [0, 18, 8] });
    m.bone("head2", { parent: "creeper", pivot: [0, 18, 8] }).bone("body2", { parent: "creeper", pivot: [0, 18, 8] });
    for (const [b, x, z] of [["leg1", -2, 12], ["leg2", 2, 12], ["leg3", -2, 4], ["leg4", 2, 4]]) m.bone(b, { parent: "creeper", pivot: [x, 6, z] });

    // 과녁판
    m.cube("target", [-7, 1, -2], [14, 14, 4], { all: "wood", north: "face", south: "face" });
    // 곰(웅후): 판 뒤에 앉아 판 위로 머리를 내민다
    m.cube("head2", [-4, 15, 3], [8, 7, 7], { all: "bear", north: "bearFace", down: "bearLight" })
      .cube("head2", [-4, 22, 5], [2, 2, 1], "bearEar").cube("head2", [2, 22, 5], [2, 2, 1], "bearEar")
      .cube("head2", [-2, 15, 1.5], [4, 3, 1.5], "bearLight");                                  // 주둥이
    m.cube("body2", [-5, 3, 4], [10, 12, 9], { all: "bear", down: "bearLight" });
    for (const [b, x, z] of [["leg1", -5, 9], ["leg2", 1, 9], ["leg3", -5, 3], ["leg4", 1, 3]]) m.cube(b, [x, 0, z], [4, 4, 4], "bear");
    // 사슴(미후): 판 뒤에 서서 긴 목을 빼고 내다본다
    m.cube("body", [-3, 9, 4], [6, 6, 11], { all: "deer", down: "deerLight" });
    m.cube("head", [-1.5, 13, 3], [3, 8, 3], "deer")                                             // 목
      .cube("head", [-2, 20, 0], [4, 4, 5], { all: "deer", north: "deerFace", down: "deerLight" })
      .cube("head", [-1.5, 20, -1.5], [3, 2, 1.5], "deerLight");
    m.cube("headwear", [-2, 24, 2], [1, 4, 1], "antler").cube("headwear", [1, 24, 2], [1, 4, 1], "antler")
      .cube("headwear", [-4, 26, 2], [2, 1, 1], "antler").cube("headwear", [2, 26, 2], [2, 1, 1], "antler")
      .cube("headwear", [-2, 28, 1], [1, 2, 1], "antler").cube("headwear", [1, 28, 1], [1, 2, 1], "antler");
    for (const [b, x, z] of [["right_arm", -2.5, 4.5], ["left_arm", 0.5, 4.5], ["right_leg", -2.5, 12.5], ["left_leg", 0.5, 12.5]]) m.cube(b, [x, 0, z], [2, 10, 2], "deer");
    return m;
  },
};
