// 소 자리 → 목우도의 누렁소(한우): 누런 털, 밝은 주둥이, 짧은 뿔. 몸 배치·뼈대는 소 그대로(애니메이션: 고개·다리).
const { C, INK, flat, art, mats } = require("./minhwa");

const HIDE = "#c0832f", LIGHT = "#e2b56e", DARK = "#8e5a20", HORN = "#efe3c4";
module.exports = {
  key: "cow", geo: "geometry.target_cow", tex: "cow", size: [64, 64],
  build(K) {
    mats(K, {
      hide: flat(HIDE),
      back: flat(DARK),
      belly: flat(LIGHT),
      face: art([
        "HHHHHHHH",
        "HHHHHHHH",
        "HWKHHKWH",
        "HHHHHHHH",
        "HLLLLLLH",
        "HLKLLKLH",
        "HLLLLLLH",
        "HLLLLLLH",
      ], { K: INK, H: HIDE, W: "#fbf3df", L: LIGHT }),
      horn: flat(HORN, { min: 99 }),
      leg: (x, y, w, h) => (y >= h - 1 ? "#3a2a1c" : y >= h - 2 ? DARK : HIDE),
    });
    const m = K.model("geometry.target_cow", { visible_bounds_width: 3, visible_bounds_height: 3.5, visible_bounds_offset: [0, 1.25, 0] });
    m.bone("root").bone("cow", { parent: "root" })
      .bone("head_cow", { parent: "cow", pivot: [0, 20, -8] })
      .bone("body", { parent: "cow", pivot: [0, 19, 2], rotation: [90, 0, 0] })
      .bone("leg1", { parent: "cow", pivot: [-4, 12, 7] }).bone("leg2", { parent: "cow", pivot: [4, 12, 7] })
      .bone("leg3", { parent: "cow", pivot: [-4, 12, -6] }).bone("leg4", { parent: "cow", pivot: [4, 12, -6] });
    m.cube("head_cow", [-4, 16, -14], [8, 8, 6], { all: "hide", north: "face", up: "back" })
      .cube("head_cow", [4, 22, -12], [2, 2, 1], "horn").cube("head_cow", [-6, 22, -12], [2, 2, 1], "horn")
      .cube("head_cow", [5, 23, -12], [1, 2, 1], "horn").cube("head_cow", [-6, 23, -12], [1, 2, 1], "horn");
    m.cube("body", [-6, 11, -5], [12, 18, 10], { all: "hide", down: "back", up: "belly" });
    for (const [b, x, z] of [["leg1", -6, 5], ["leg2", 2, 5], ["leg3", -6, -7], ["leg4", 2, -7]]) m.cube(b, [x, 0, z], [4, 12, 4], "leg");
    return m;
  },
};
