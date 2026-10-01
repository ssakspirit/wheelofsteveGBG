// 거미 자리 → 어해도의 게: 껍데기 갑(甲) = 장원급제. 넓적한 등딱지, 집게발, 눈자루, 다리 8개.
// 애니메이션: head_spider(좌우로 두리번 — 집게와 눈자루가 함께), leg1~8(꼼지락), spider(맞히면 웅크렸다 들썩)
// 다리는 거미와 같은 축(neck 아래, 몸 양옆)에 짧게 붙인다.
const { INK, flat, art, mats } = require("./minhwa");

const SHELL = "#c4532d", DARK = "#8e3a1f", BELLY = "#f0dcb4", CLAW = "#d76a3a";
module.exports = {
  key: "spider", geo: "geometry.target_spider", tex: "spider", size: [64, 64],
  build(K) {
    mats(K, {
      shell: (x, y, w, h, n) => (n() < 0.12 ? DARK : SHELL),
      front: art([
        "SSSSSSSSSSSS",
        "SSSSSSSSSSSS",
        "SDSSSSSSSSDS",
        "SSSKKKKKKSSS",
        "SSSSSSSSSSSS",
      ], { K: INK, S: SHELL, D: DARK }),
      belly: flat(BELLY),
      claw: flat(CLAW, { min: 4 }),
      tip: flat(DARK, { min: 99 }),
      leg: (x, y, w, h) => (x % 3 === 2 ? DARK : CLAW),
      stalk: flat(BELLY, { min: 99 }),
      eye: flat(INK, { line: false }),
    });
    const m = K.model("geometry.target_spider", { visible_bounds_width: 4, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] });
    m.bone("root").bone("spider", { parent: "root" })
      .bone("head_spider", { parent: "spider", pivot: [0, 8, -3] })
      .bone("neck", { parent: "spider", pivot: [0, 8, 0] });
    const legs = [[1, -4, 2, 45, -40], [2, 4, 2, -45, 40], [3, -4, 0.5, 20, -30], [4, 4, 0.5, -20, 30], [5, -4, -1, -10, -30], [6, 4, -1, 10, 30], [7, -4, -2.5, -35, -38], [8, 4, -2.5, 35, 38]];
    for (const [i, x, z, ry, rz] of legs) m.bone("leg" + i, { parent: "neck", pivot: [x, 7, z], rotation: [0, ry, rz] });
    m.bone("body", { parent: "spider", pivot: [0, 8, 4] });
    // 등딱지 (neck 뼈대: 다리와 함께 움직이는 몸통)
    m.cube("neck", [-6, 4.5, -4], [12, 5, 9], { all: "shell", north: "front", down: "belly" })
      .cube("neck", [-4, 9.5, -2.5], [8, 1, 6], "shell");
    m.cube("body", [-3, 4.5, 5], [6, 3, 1.5], "belly");                                         // 배딱지 끝
    // 집게발과 눈자루 (머리 뼈대: 두리번거리는 동작에 같이 움직인다)
    m.cube("head_spider", [-8.5, 5.5, -10], [4, 4, 5], "claw").cube("head_spider", [4.5, 5.5, -10], [4, 4, 5], "claw")
      .cube("head_spider", [-8, 6.5, -12], [1.5, 2, 2], "tip").cube("head_spider", [6.5, 6.5, -12], [1.5, 2, 2], "tip")
      .cube("head_spider", [-6, 6, -6], [2, 2, 3], "claw").cube("head_spider", [4, 6, -6], [2, 2, 3], "claw")
      .cube("head_spider", [-2.5, 9.5, -4.5], [1, 3, 1], "stalk").cube("head_spider", [1.5, 9.5, -4.5], [1, 3, 1], "stalk")
      .cube("head_spider", [-2.75, 12.5, -4.75], [1.5, 1.5, 1.5], "eye").cube("head_spider", [1.25, 12.5, -4.75], [1.5, 1.5, 1.5], "eye");
    for (const [i, x, z] of legs) m.cube("leg" + i, x < 0 ? [x - 10, 6, z - 0.75] : [x, 6, z - 0.75], [10, 1.5, 1.5], "leg");
    return m;
  },
};
