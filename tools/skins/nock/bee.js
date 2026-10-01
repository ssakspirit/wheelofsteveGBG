// 벌 자리 → 초충도의 호랑나비: 노란 날개에 먹 맥, 가장자리의 푸른·붉은 점, 가는 몸과 끝이 동그란 더듬이.
// 애니메이션: left_wing·right_wing(z축 퍼덕임), bee(위아래로 떠다님, 맞히면 한 바퀴 재주)
const { INK, flat, mats } = require("./minhwa");

const WING = "#f2c94c", VEIN = "#2a1d14", BLUE = "#3a6fc2", RED = "#d2452f", BODY = "#3a2c22";
// 날개(위에서 본 면): 가장자리 먹선, 안쪽으로 뻗는 맥, 바깥 테두리의 푸른 점과 뒷날개 끝 붉은 점
const wing = (flip, hind) => (x, y, w, h) => {
  const X = flip ? w - 1 - x : x;                         // X: 몸에서 먼 쪽이 큰 값
  if (X >= w - 2 && (y === 0 || y === h - 1)) return null; // 바깥 모서리를 둥글게
  if (X === w - 1 || y === 0 || y === h - 1) return VEIN;
  if (X === w - 2 && y % 2 === 1) return BLUE;
  if (hind && X >= w - 4 && y >= h - 3) return RED;
  if (y === Math.floor(h / 2) && X > 1 && X < w - 2) return VEIN;
  return WING;
};
module.exports = {
  key: "bee", geo: "geometry.target_bee", tex: "bee", size: [64, 64],
  build(K) {
    mats(K, {
      wingL: wing(false), wingR: wing(true), hindL: wing(false, true), hindR: wing(true, true),
      body: flat(BODY, { line: false }),
      feeler: flat(INK, { line: false }),
    });
    const m = K.model("geometry.target_bee", { visible_bounds_width: 3, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] });
    m.bone("root", { pivot: [0, 5, 0] }).bone("bee", { parent: "root", pivot: [0, 5, 0] })
      .bone("torso", { parent: "bee", pivot: [0, 5, 0] })
      .bone("left_antenna", { parent: "bee", pivot: [0, 6, -4] }).bone("right_antenna", { parent: "bee", pivot: [0, 6, -4] })
      .bone("left_wing", { parent: "bee", pivot: [1, 6, 0] }).bone("right_wing", { parent: "bee", pivot: [-1, 6, 0] })
      .bone("front_legs", { parent: "bee", pivot: [0, 4, -2] }).bone("middle_legs", { parent: "bee", pivot: [0, 4, 0] })
      .bone("back_legs", { parent: "bee", pivot: [0, 4, 2] }).bone("stinger", { parent: "bee", pivot: [0, 5, 0] });
    m.cube("torso", [-1, 4, -4], [2, 2, 9], "body");
    m.cube("left_antenna", [0.5, 6, -7], [0, 1, 3], "feeler").cube("left_antenna", [0, 6.5, -8], [1, 1, 1], "feeler")
      .cube("right_antenna", [-0.5, 6, -7], [0, 1, 3], "feeler").cube("right_antenna", [-1, 6.5, -8], [1, 1, 1], "feeler");
    // 앞날개(크다)와 뒷날개(작다)를 한 뼈대에 — 두께 0 판이라 위·아래 면만 칠한다
    m.cube("left_wing", [1, 6, -6], [10, 0, 7], "wingL").cube("left_wing", [1, 6, 1], [7, 0, 6], "hindL")
      .cube("right_wing", [-11, 6, -6], [10, 0, 7], "wingR").cube("right_wing", [-8, 6, 1], [7, 0, 6], "hindR");
    m.cube("front_legs", [-1, 2, -2], [2, 2, 0], "feeler").cube("middle_legs", [-1.5, 2, 0], [3, 2, 0], "feeler")
      .cube("back_legs", [-1.5, 2, 2], [3, 2, 0], "feeler");
    return m;
  },
};
