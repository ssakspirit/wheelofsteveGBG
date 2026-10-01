// 양 자리 → 묘작도의 고양이: 노랑·흰 얼룩에 먹 줄, 뾰족 귀, 수염, 치켜든 꼬리.
// 애니메이션: body(앞으로 기울임), head_sheep(고개 숙여 두리번), leg4(앞발 들기), sheep(맞히면 움찔 커짐).
// 양털 뼈대(body2, head_sheep2, leg5~8)는 이름만 남기고 비운다(털 깎는 동작은 아무것도 지우지 않게 된다).
const { INK, flat, stripes, art, mats } = require("./minhwa");

const FUR = "#e5a54a", WHITE = "#f7f0e2", STRIPE = "#9a5a1e";
module.exports = {
  key: "sheep", geo: "geometry.target_sheep", tex: "sheep", size: [64, 64],
  build(K) {
    mats(K, {
      fur: stripes(FUR, STRIPE, { every: 3, width: 1, axis: "x" }),
      furTop: stripes(FUR, STRIPE, { every: 3, width: 1, axis: "y" }),
      white: flat(WHITE),
      face: art([
        "FFFFFFF",
        "FSFSFSF",
        "FGKFKGF",
        "WWWWWWW",
        "WKWPWKW",
        "WWWKWWW",
      ], { K: INK, F: FUR, S: STRIPE, G: "#9cc04a", W: WHITE, P: "#e98a8a" }),
      ear: flat(FUR),
      earIn: art(["FF", "FP"], { F: FUR, P: "#f0a6a6" }),
      leg: (x, y, w, h) => (y >= h - 2 ? WHITE : y % 3 === 1 ? STRIPE : FUR),
      tail: stripes(FUR, STRIPE, { every: 2, width: 1, axis: "y" }),
      whisker: flat(INK, { line: false }),
    });
    const m = K.model("geometry.target_sheep", { visible_bounds_width: 3, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] });
    m.bone("root").bone("sheep", { parent: "root" })
      .bone("body", { parent: "sheep", pivot: [0, 9, 2] })
      .bone("rotation", { parent: "body", pivot: [0, 9, 2] })
      .bone("body2", { parent: "body", pivot: [0, 9, 2] })
      .bone("rotation2", { parent: "body2", pivot: [0, 9, 2] })
      .bone("head_sheep", { parent: "sheep", pivot: [0, 12, -6] })
      .bone("head_sheep2", { parent: "head_sheep", pivot: [0, 12, -6] });
    for (const [i, j, x, z] of [[1, 8, -2, 5], [2, 7, 2, 5], [3, 6, -2, -4], [4, 5, 2, -4]])
      m.bone("leg" + i, { parent: "sheep", pivot: [x, 7, z] }).bone("leg" + j, { parent: "leg" + i, pivot: [x, 7, z] });
    m.cube("rotation", [-3, 6, -6], [6, 6, 13], { all: "fur", up: "furTop", down: "white" })
      .cube("rotation", [-0.5, 10, 6], [1, 9, 1], "tail").cube("rotation", [-0.5, 18, 5], [1, 1, 2], "tail");    // 치켜든 꼬리
    m.cube("head_sheep", [-3.5, 10, -12], [7, 6, 6], { all: "fur", north: "face", down: "white" })
      .cube("head_sheep", [-3.5, 16, -10], [2, 2, 1], { all: "ear", north: "earIn" }).cube("head_sheep", [1.5, 16, -10], [2, 2, 1], { all: "ear", north: "earIn" })
      .cube("head_sheep", [-6, 11.5, -12.2], [3, 0, 1], "whisker").cube("head_sheep", [3, 11.5, -12.2], [3, 0, 1], "whisker");
    for (const [i, x, z] of [[1, -3, 4], [2, 1, 4], [3, -3, -5], [4, 1, -5]]) m.cube("leg" + i, [x, 0, z], [2, 7, 2], "leg");
    return m;
  },
};
