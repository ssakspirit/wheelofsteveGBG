// 토끼 2종(같은 모델) → 흰 옥토끼(달토끼)와 갈색 산토끼. 모델·뼈대는 토끼 그대로, 색만 두 벌.
//   rabbit_desert 텍스처 → 산토끼, rabbit_plains 텍스처 → 옥토끼
const { INK, flat, art, mats } = require("./minhwa");

const PAL = {
  rabbit_desert: { fur: "#a9744a", light: "#d9b48a", ear: "#e9a3a0", eye: INK },          // 산토끼
  rabbit_plains: { fur: "#f6f1e6", light: "#ffffff", ear: "#f0a6a6", eye: "#c8372d" },    // 옥토끼 (붉은 눈)
};
module.exports = {
  key: "rabbit", geo: "geometry.target_rabbit", size: [64, 32], variants: PAL,
  build(K, P) {
    mats(K, {
      fur: flat(P.fur),
      light: flat(P.light),
      face: art(["FFFFF", "FEFEF", "FFFFF", "FFNFF"], { K: INK, F: P.fur, E: P.eye, N: P.ear }, flat(P.fur)),
      ear: art(["FFF", "FPF", "FPF", "FPF", "FPF"].map(r => r.slice(0, 2)), { F: P.fur, P: P.ear }, P.fur),
      nose: flat(P.ear, { min: 99 }),
      foot: flat(P.light, { min: 99 }),
    });
    const m = K.model("geometry.target_rabbit", { visible_bounds_width: 3, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] });
    m.bone("root").bone("rabbit", { parent: "root" })
      .bone("head_rabbit", { parent: "rabbit", pivot: [0, 7.5, -3] })
      .bone("nose", { parent: "head_rabbit", pivot: [0, 7.5, -3] })
      .bone("left_ear", { parent: "head_rabbit", pivot: [0, 7.5, -3] })
      .bone("right_ear", { parent: "head_rabbit", pivot: [0, 7.5, -3] })
      .bone("body", { parent: "rabbit", pivot: [0, 8, 7] })
      .bone("left_arm", { parent: "body", pivot: [3, 7, -3] }).bone("right_arm", { parent: "body", pivot: [-3, 7, -3] })
      .bone("left_thigh", { parent: "body", pivot: [3, 8, 2.5] }).bone("right_thigh", { parent: "body", pivot: [-3, 8, 2.5] })
      .bone("left_foot", { parent: "body", pivot: [3, 9.5, 4.2] }).bone("right_foot", { parent: "body", pivot: [-3, 9.5, 4.2] })
      .bone("tail", { parent: "body", pivot: [0, 6.75, 6.5] });
    m.cube("head_rabbit", [-2.5, 7.5, -8], [5, 4, 5], { all: "fur", north: "face" })
      .cube("nose", [-0.5, 9, -8.5], [1, 1, 1], "nose")
      .cube("left_ear", [0.5, 11.5, -4], [2, 5, 1], { all: "fur", north: "ear" })
      .cube("right_ear", [-2.5, 11.5, -4], [2, 5, 1], { all: "fur", north: "ear" })
      .cube("body", [-3, 5, -3], [6, 5, 10], { all: "fur", down: "light" })
      .cube("left_arm", [2, 0, -4], [2, 7, 2], "fur").cube("right_arm", [-4, 0, -4], [2, 7, 2], "fur")
      .cube("left_thigh", [2, 4, 2.5], [2, 4, 5], "fur").cube("right_thigh", [-4, 4, 2.5], [2, 4, 5], "fur")
      .cube("left_foot", [2, 3, 0.5], [2, 1, 7], "foot").cube("right_foot", [-4, 3, 0.5], [2, 1, 7], "foot")
      .cube("tail", [-1.5, 5.25, 6.5], [3, 3, 2], "light");
    return m;
  },
};
