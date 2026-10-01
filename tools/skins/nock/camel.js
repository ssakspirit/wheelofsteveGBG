// 낙타 자리 → 상서로운 짐승 기린(麒麟): 청록 비늘 몸, 불꽃 갈기, 이마의 외뿔, 검은 발굽.
// 애니메이션: head_camel만 움직인다(목째 좌우로 갸웃, 맞히면 목을 한 바퀴 돌린다). 혹(hump) 뼈대는 등의 불꽃 갈기로 쓴다.
const { INK, flat, art, mats } = require("./minhwa");

const SCALE = "#3f8a7a", SCALE_D = "#2b6458", GOLD = "#e0b04a", BELLY = "#f0e0b0", FLAME = ["#d9542b", "#f0c447", "#c8372d"];
const scales = (x, y, w, h) => {
  // 비늘 한 장 = 4×3칸, 줄마다 반 장씩 어긋나고 아래 가장자리에 금빛 테
  const cx = (x + (Math.floor(y / 3) % 2 ? 2 : 0)) % 4, cy = y % 3;
  if (cy === 2) return cx === 1 || cx === 2 ? GOLD : SCALE_D;
  return cx === 0 ? SCALE_D : SCALE;
};
const flame = (x, y) => FLAME[(x + 2 * y) % 3];
module.exports = {
  key: "camel", geo: "geometry.target_camel", tex: "camel", size: [128, 128],
  build(K) {
    mats(K, {
      scales,
      belly: flat(BELLY),
      flame,
      face: art([
        "SSSSSS",
        "SSSSSS",
        "WKSSKW",
        "SSSSSS",
        "SGGGGS",
        "SSSSSS",
      ], { K: INK, S: SCALE, W: "#fbf3df", G: GOLD }),
      horn: flat(GOLD, { min: 99 }),
      hoof: flat(INK, { line: false }),
      leg: (x, y, w, h, n) => (y < 3 ? flame(x, y) : scales(x, y, w, h, n)),
    });
    const m = K.model("geometry.target_camel", { visible_bounds_width: 3, visible_bounds_height: 4.5, visible_bounds_offset: [0, 1.75, 0] });
    m.bone("root").bone("camel", { parent: "root" })
      .bone("head_camel", { parent: "camel", pivot: [0, 26, -9] })
      .bone("left_ear", { parent: "head_camel", pivot: [3, 40, -22], rotation: [0, 0, -30] })
      .bone("right_ear", { parent: "head_camel", pivot: [-3, 40, -22], rotation: [0, 0, 30] })
      .bone("body", { parent: "camel", pivot: [0, 20, 10.5] })
      .bone("hump", { parent: "body", pivot: [0, 32, 0.5] })
      .bone("front_left_leg", { parent: "body", pivot: [4.5, 20, -8] }).bone("front_right_leg", { parent: "body", pivot: [-4.5, 20, -8] })
      .bone("back_left_leg", { parent: "body", pivot: [4.5, 20, 8] }).bone("back_right_leg", { parent: "body", pivot: [-4.5, 20, 8] })
      .bone("tail", { parent: "body", pivot: [0, 28, 12], rotation: [20, 0, 0] });
    // 목: 어깨에서 비스듬히 올라가는 두 마디 + 머리, 뿔, 수염
    m.cube("head_camel", [-3.5, 24, -17], [7, 8, 8], { all: "scales", down: "belly" })
      .cube("head_camel", [-3, 30, -22], [6, 9, 6], { all: "scales", down: "belly" })
      .cube("head_camel", [-3.5, 37, -28], [7, 6, 9], { all: "scales", north: "face", down: "belly" })
      .cube("head_camel", [-0.5, 43, -25], [1, 5, 1], "horn")
      .cube("head_camel", [-1, 33, -18], [2, 8, 2], "flame")                                    // 목 갈기
      .cube("head_camel", [-2.5, 35, -29], [5, 2, 1], "flame");                                 // 수염
    m.cube("left_ear", [3, 40, -23], [3, 1, 2], "scales").cube("right_ear", [-6, 40, -23], [3, 1, 2], "scales");
    m.cube("body", [-6.5, 20, -12], [13, 11, 24], { all: "scales", down: "belly" });
    m.cube("hump", [-1, 31, -10], [2, 3, 20], "flame").cube("hump", [-1.5, 31, -6], [3, 2, 4], "flame").cube("hump", [-1.5, 31, 4], [3, 2, 4], "flame");
    m.cube("tail", [-1.5, 16, 12], [3, 12, 2], "flame");
    for (const [b, x, z] of [["front_left_leg", 2.5, -10], ["front_right_leg", -6.5, -10], ["back_left_leg", 2.5, 6], ["back_right_leg", -6.5, 6]])
      m.cube(b, [x, 2, z], [4, 19, 4], "leg").cube(b, [x - 0.25, 0, z - 0.25], [4.5, 2, 4.5], "hoof");
    return m;
  },
};
