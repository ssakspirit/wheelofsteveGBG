// 아르마딜로 자리 → 십장생도의 거북: 금빛 육각 무늬 초록 등딱지, 꼬리에 흩날리는 녹모(綠毛).
// 애니메이션: 평소엔 머리와 몸을 좌우로 흔들고, 맞히면 머리를 뒤로 넣고(head_armadillo) 몸(body)이 사라지며
// 'cube'(닫힌 등딱지)가 나타난다 → 거북이 등딱지 속으로 쏙 숨는 동작이 된다.
const { INK, flat, art, mats } = require("./minhwa");

const SHELL = "#3f6f45", HEX = "#d9b24a", SKIN = "#9db86a", BELLY = "#e8d79a", HAIR = "#6fa04a", HAIR2 = "#e8f0d0";
// 거북등 무늬: 어긋난 벽돌 줄로 육각 느낌
const hexes = (x, y, w, h) => {
  const row = Math.floor(y / 3), off = row % 2 ? 2 : 0;
  return y % 3 === 0 || (x + off) % 4 === 0 ? HEX : SHELL;
};
module.exports = {
  key: "armadillo", geo: "geometry.target_armadillo", tex: "armadillo", size: [64, 64],
  build(K) {
    mats(K, {
      shell: hexes,
      rim: flat(SHELL),
      belly: flat(BELLY),
      skin: flat(SKIN, { min: 99 }),
      face: art(["SSS", "KSK", "SSS"], { K: INK, S: SKIN }),
      hair: (x, y) => (x % 2 ? HAIR : HAIR2),
    });
    const m = K.model("geometry.target_armadillo", { visible_bounds_width: 3, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] });
    m.bone("root").bone("armadillo", { parent: "root" })
      .bone("head_armadillo", { parent: "armadillo", pivot: [0, 4, -6] })
      .bone("head_armadillo_rotation", { parent: "head_armadillo", pivot: [0, 4, -6], rotation: [-15, 0, 0] })
      .bone("left_ear_cube", { parent: "head_armadillo", pivot: [1.5, 6, -7.6] })
      .bone("right_ear_cube", { parent: "head_armadillo", pivot: [-1.5, 6, -7.6] })
      .bone("front_left_leg", { parent: "armadillo", pivot: [3, 2, -4] }).bone("front_right_leg", { parent: "armadillo", pivot: [-3, 2, -4] })
      .bone("back_left_leg", { parent: "armadillo", pivot: [3, 2, 4] }).bone("back_right_leg", { parent: "armadillo", pivot: [-3, 2, 4] })
      .bone("body", { parent: "armadillo", pivot: [0, 3, 0] })
      .bone("tail", { parent: "body", pivot: [0, 3, 6], rotation: [-15, 0, 0] })
      .bone("cube", { parent: "armadillo", pivot: [0, 0, 0] });
    m.cube("head_armadillo_rotation", [-1.5, 2.5, -10], [3, 3, 4], { all: "skin", north: "face" });
    for (const [b, x, z] of [["front_left_leg", 3, -6], ["front_right_leg", -6, -6], ["back_left_leg", 3, 3], ["back_right_leg", -6, 3]])
      m.cube(b, [x, 0, z], [3, 2, 3], "skin");
    // 등딱지: 아래 테두리 → 가운데 → 꼭대기, 배는 노란 판
    m.cube("body", [-5, 1.5, -6], [10, 3, 12], { all: "rim", up: "shell", down: "belly" })
      .cube("body", [-4.5, 4.5, -5.5], [9, 2, 11], { all: "shell", down: "belly" })
      .cube("body", [-3.5, 6.5, -4.5], [7, 1.5, 9], { all: "shell", down: "belly" });
    m.cube("tail", [-1.5, 2, 6], [3, 1, 7], "hair").cube("tail", [-2.5, 2, 11], [5, 1, 3], "hair");    // 녹모
    // 닫힌 등딱지 (맞혔을 때만 보인다)
    m.cube("cube", [-5, 0, -6], [10, 4.5, 12], { all: "rim", up: "shell", down: "belly" })
      .cube("cube", [-4.5, 4.5, -5.5], [9, 2, 11], { all: "shell", down: "belly" })
      .cube("cube", [-3.5, 6.5, -4.5], [7, 1.5, 9], { all: "shell", down: "belly" });
    return m;
  },
};
