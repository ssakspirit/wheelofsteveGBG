// 염소 자리 → 신선도의 백록(흰 사슴): 눈처럼 흰 털, 금빛 뿔. 애니메이션: head_goat(풀 뜯듯 고개 숙임), goat(맞히면 깡충)
const { INK, flat, art, mats } = require("./minhwa");

const WHITE = "#f7f3ea", SHADE = "#ddd6c8", GOLD = "#d9a43a";
module.exports = {
  key: "goat", geo: "geometry.target_goat", tex: "goat", size: [64, 64],
  build(K) {
    mats(K, {
      coat: flat(WHITE),
      shade: flat(SHADE),
      face: art(["WWWWW", "WWWWW", "WKWKW", "WWWWW"], { K: INK, W: WHITE }),
      snout: art(["WWW", "WKW", "WWW"], { K: INK, W: SHADE }),
      antler: flat(GOLD, { min: 99 }),
      ear: art(["WW", "WP"], { W: WHITE, P: "#f0b5b0" }),
      leg: (x, y, w, h) => (y >= h - 1 ? INK : WHITE),
    });
    const m = K.model("geometry.target_goat", { visible_bounds_width: 3, visible_bounds_height: 3.5, visible_bounds_offset: [0, 1.25, 0] });
    m.bone("root").bone("goat", { parent: "root" })
      .bone("head_goat", { parent: "goat", pivot: [0, 15, -7] })
      .bone("body", { parent: "goat", pivot: [0, 0, 0] })
      .bone("leg1", { parent: "body", pivot: [-2.5, 10, 5] }).bone("leg2", { parent: "body", pivot: [2.5, 10, 5] })
      .bone("leg3", { parent: "body", pivot: [-2.5, 10, -5] }).bone("leg4", { parent: "body", pivot: [2.5, 10, -5] });
    m.cube("head_goat", [-1.5, 13, -10], [3, 7, 3], "coat")                                                  // 목
      .cube("head_goat", [-2.5, 19, -13], [5, 4, 6], { all: "coat", north: "face", down: "shade" })
      .cube("head_goat", [-1.5, 19, -15], [3, 3, 2], { all: "shade", north: "snout" })
      .cube("head_goat", [2.5, 21, -9], [2, 2, 1], { all: "coat", north: "ear" }).cube("head_goat", [-4.5, 21, -9], [2, 2, 1], { all: "coat", north: "ear" })
      .cube("head_goat", [0.5, 23, -10], [1, 4, 1], "antler").cube("head_goat", [-1.5, 23, -10], [1, 4, 1], "antler")
      .cube("head_goat", [1.5, 25, -10], [2, 1, 1], "antler").cube("head_goat", [-3.5, 25, -10], [2, 1, 1], "antler")
      .cube("head_goat", [0.5, 27, -11], [1, 2, 1], "antler").cube("head_goat", [-1.5, 27, -11], [1, 2, 1], "antler");
    m.cube("body", [-4, 9, -8], [8, 7, 15], { all: "coat", down: "shade" })
      .cube("body", [-1, 14, 7], [2, 2, 1], "coat");                                                         // 꼬리
    for (const [b, x, z] of [["leg1", -3.5, 4], ["leg2", 1.5, 4], ["leg3", -3.5, -6.5], ["leg4", 1.5, -6.5]]) m.cube(b, [x, 0, z], [2, 10, 2], "leg");
    return m;
  },
};
