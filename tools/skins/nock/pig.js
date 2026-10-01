// 돼지 자리 → 벽사 그림의 삽살개: 눈을 덮는 긴 앞머리, 늘어진 귀, 누런 털 갈래, 위로 말린 꼬리.
// 애니메이션: head_pig(고개), nose(코 벌름), leg1~4, pig(맞히면 펄쩍). 몸 배치는 돼지 그대로.
const { INK, flat, art, mats, lighten } = require("./minhwa");

const FUR = "#c99a4e", DEEP = "#9c6c2c", LIGHT = "#e6c588";
// 털 갈래: 세로로 흐르는 짙은 결
const shaggy = (base, { line = false, min = 5 } = {}) => (x, y, w, h, n) => {
  if (line && w >= min && h >= min && (x === 0 || y === 0 || x === w - 1 || y === h - 1)) return line;
  return (x * 7 + Math.floor(y / 2) * 3) % 5 === 0 ? DEEP : n() < 0.1 ? lighten(base, 0.1) : base;
};
module.exports = {
  key: "pig", geo: "geometry.target_pig", tex: "pig", size: [64, 64],
  build(K) {
    mats(K, {
      fur: shaggy(FUR),
      belly: flat(LIGHT),
      // 앞머리가 눈을 덮고, 그 틈으로 반짝이는 눈
      face: art([
        "FFFFFFFF",
        "DFDFFDFD",
        "FDFDDFDF",
        "DDWKDWKD",
        "FFFFFFFF",
        "FFLLLLFF",
        "FFLLLLFF",
        "FFFFFFFF",
      ], { K: INK, F: FUR, D: DEEP, W: "#fbf3df", L: LIGHT }),
      nose: art(["LKKL", "LLLL", "LKKL"], { K: INK, L: LIGHT }),
      ear: shaggy(DEEP, { line: false }),
      leg: (x, y, w, h, n) => (y >= h - 1 ? DEEP : shaggy(FUR, { line: false })(x, y, w, h, n)),
      tail: flat(DEEP, { min: 99 }),
    });
    const m = K.model("geometry.target_pig", { visible_bounds_width: 3, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] });
    m.bone("root").bone("pig", { parent: "root" })
      .bone("body", { parent: "pig", pivot: [0, 13, 2], rotation: [90, 0, 0] })
      .bone("head_pig", { parent: "pig", pivot: [0, 12, -6] })
      .bone("nose", { parent: "head_pig", pivot: [0, 10.5, -14] })
      .bone("leg1", { parent: "pig", pivot: [-3, 6, 7] }).bone("leg2", { parent: "pig", pivot: [3, 6, 7] })
      .bone("leg3", { parent: "pig", pivot: [-3, 6, -5] }).bone("leg4", { parent: "pig", pivot: [3, 6, -5] })
      .bone("tail", { parent: "pig", pivot: [0, 13, 8] });
    m.cube("body", [-5, 7, -5], [10, 16, 8], "fur");
    m.cube("head_pig", [-4, 8, -14], [8, 8, 8], { all: "fur", north: "face", down: "belly" })
      .cube("head_pig", [-5, 9, -12], [1, 6, 4], "ear").cube("head_pig", [4, 9, -12], [1, 6, 4], "ear")     // 늘어진 귀
      .cube("head_pig", [-4.5, 14, -14.5], [9, 2, 3], "fur");                                                // 이마 털 뭉치
    m.cube("nose", [-2, 9, -15], [4, 3, 1], "nose");
    for (const [b, x, z] of [["leg1", -5, 5], ["leg2", 1, 5], ["leg3", -5, -7], ["leg4", 1, -7]]) m.cube(b, [x, 0, z], [4, 6, 4], "leg");
    m.cube("tail", [-1, 13, 8], [2, 2, 3], "tail").cube("tail", [-1, 15, 9], [2, 2, 2], "tail");       // 위로 말린 꼬리
    return m;
  },
};
