// 라마 자리 → 십장생도의 꽃사슴: 흰 점무늬 붉은 갈색, 가지 친 뿔, 입에 문 불로초.
// 애니메이션: head_llama(고개 갸웃), body(살짝 비틂), leg1·leg4(맞히면 앞뒤 다리를 쭉 뻗는다)
const { INK, flat, spots, art, mats } = require("./minhwa");

const COAT = "#c4703a", DOT = "#f6ead2", LIGHT = "#efd9b4", ANTLER = "#7a5232", LINGZHI = "#a8432a", RIM = "#e0a94a";
module.exports = {
  key: "llama", geo: "geometry.target_llama", tex: "llama", size: [64, 64],
  build(K) {
    mats(K, {
      coat: spots(COAT, DOT, { density: 0.16 }),
      plain: flat(COAT),
      belly: flat(LIGHT),
      face: art([
        "CCCCCC",
        "CCCCCC",
        "CWKKWC",
        "CCCCCC",
        "CCCCCC",
      ], { K: INK, C: COAT, W: "#fbf3df" }),
      snout: art(["LLLL", "LKKL", "LLLL"], { K: INK, L: LIGHT }),
      antler: flat(ANTLER, { min: 99 }),
      ear: art(["CC", "CP"], { C: COAT, P: "#e7a6a0" }),
      leg: (x, y, w, h) => (y >= h - 1 ? INK : y < 6 ? COAT : LIGHT),
      lingzhi: (x, y, w, h) => (y === 0 || x === 0 || x === w - 1 ? RIM : LINGZHI),
      tail: flat(DOT, { min: 99 }),
    });
    const m = K.model("geometry.target_llama", { visible_bounds_width: 3, visible_bounds_height: 3.5, visible_bounds_offset: [0, 1.25, 0] });
    m.bone("root").bone("llama", { parent: "root" })
      .bone("head_llama", { parent: "llama", pivot: [0, 18, -7] })
      .bone("body", { parent: "llama", pivot: [0, 17, 2] })
      .bone("leg1", { parent: "llama", pivot: [-3, 13, 6] }).bone("leg2", { parent: "llama", pivot: [3, 13, 6] })
      .bone("leg3", { parent: "llama", pivot: [-3, 13, -5] }).bone("leg4", { parent: "llama", pivot: [3, 13, -5] });
    // 목과 머리
    m.cube("head_llama", [-2.5, 16, -11], [5, 11, 5], { all: "coat", north: "plain" })
      .cube("head_llama", [-3, 26, -14], [6, 5, 7], { all: "plain", north: "face" })
      .cube("head_llama", [-2, 26, -18], [4, 3, 4], { all: "belly", north: "snout" })
      .cube("head_llama", [3, 29, -9], [2, 2, 1], { all: "plain", north: "ear" }).cube("head_llama", [-5, 29, -9], [2, 2, 1], { all: "plain", north: "ear" })
      // 뿔: 줄기 + 가지
      .cube("head_llama", [1, 31, -11], [1, 5, 1], "antler").cube("head_llama", [-2, 31, -11], [1, 5, 1], "antler")
      .cube("head_llama", [2, 34, -11], [2, 1, 1], "antler").cube("head_llama", [-4, 34, -11], [2, 1, 1], "antler")
      .cube("head_llama", [1, 36, -12], [1, 2, 1], "antler").cube("head_llama", [-2, 36, -12], [1, 2, 1], "antler")
      // 입에 문 불로초(영지버섯)
      .cube("head_llama", [-3.5, 25, -18.5], [3, 2, 2], "lingzhi").cube("head_llama", [-1, 25.5, -18], [1, 1, 1], "antler");
    m.cube("body", [-5, 13, -8], [10, 9, 17], { all: "coat", down: "belly" })
      .cube("body", [-1, 19, 9], [2, 3, 1], "tail");
    for (const [b, x, z] of [["leg1", -4.5, 5], ["leg2", 1.5, 5], ["leg3", -4.5, -6], ["leg4", 1.5, -6]]) m.cube(b, [x, 0, z], [3, 14, 3], "leg");
    return m;
  },
};
