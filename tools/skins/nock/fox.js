// 여우 자리 → 까치호랑이의 까치: 윤기 도는 검푸른 등과 꼬리, 흰 배와 어깨깃, 짧은 부리.
// 같은 타이가 구역의 호랑이(늑대 자리)와 함께 호작도 한 장면이 된다.
// 애니메이션: head_fox(갸웃), tail(꼬리를 치켜 흔듦), leg1~4(맞히면 종종걸음), fox(맞히면 두 바퀴 돌며 깡충)
// 새는 다리가 둘이라 앞다리(leg3·leg4)만 다리로 쓰고 뒷다리(leg1·leg2) 뼈대는 비운다.
const { INK, flat, art, mats } = require("./minhwa");

const BLACK = "#1d1f26", GLOSS = "#2a4d7a", WHITE = "#f4f1ea", LEG = "#3a3a40";
module.exports = {
  key: "fox", geo: "geometry.target_fox", tex: "fox", size: [64, 32],
  build(K) {
    mats(K, {
      black: flat(BLACK, { line: false }),
      side: (x, y, w, h) => (y >= h - 2 ? WHITE : x < 3 ? BLACK : y < 2 ? GLOSS : x < w - 2 && y >= 2 ? WHITE : GLOSS), // 흰 배·어깨깃
      back: (x, y) => ((x + y) % 4 === 0 ? GLOSS : BLACK),
      belly: flat(WHITE, { line: false }),
      tail: (x, y) => (y % 3 === 0 ? GLOSS : BLACK),
      face: art(["BBB", "WBW", "BBB"], { B: BLACK, W: WHITE }),
      beak: flat(INK, { line: false }),
      leg: flat(LEG, { line: false }),
    });
    const m = K.model("geometry.target_fox", { visible_bounds_width: 3, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] });
    m.bone("root").bone("fox", { parent: "root" })
      .bone("head_fox", { parent: "fox", pivot: [0, 8, -4] })
      .bone("body", { parent: "fox", pivot: [0, 6, 0] })
      .bone("leg1", { parent: "fox", pivot: [-1, 4, 2] }).bone("leg2", { parent: "fox", pivot: [1, 4, 2] })
      .bone("leg3", { parent: "fox", pivot: [-1, 4, 0] }).bone("leg4", { parent: "fox", pivot: [1, 4, 0] })
      .bone("tail", { parent: "fox", pivot: [0, 6.5, 4] });
    m.cube("head_fox", [-1.5, 8, -6.5], [3, 3, 3], { all: "black", north: "face" })
      .cube("head_fox", [-0.5, 8.5, -8.5], [1, 1, 2], "beak");
    m.cube("body", [-2.5, 4, -4], [5, 5, 8], { all: "side", up: "back", down: "belly", north: "black", south: "black" });
    m.cube("leg3", [-1.5, 0, -0.5], [1, 4, 1], "leg").cube("leg3", [-2, 0, -1.5], [2, 0.5, 2], "leg")
      .cube("leg4", [0.5, 0, -0.5], [1, 4, 1], "leg").cube("leg4", [0, 0, -1.5], [2, 0.5, 2], "leg");
    m.cube("tail", [-1.5, 6, 4], [3, 1, 11], "tail");                      // 길게 뻗은 꽁지
    return m;
  },
};
