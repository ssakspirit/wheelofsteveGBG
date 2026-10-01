// 스니퍼 자리 → 광화문의 해치(해태): 청록 몸에 금빛 소용돌이, 붉은 곱슬 갈기, 이마의 외뿔, 목의 방울, 부릅뜬 눈과 이빨.
// 애니메이션: head_sniffer(늘 35° 숙여 킁킁 — 머리 뼈대를 미리 35° 들어 두어 게임에서는 앞을 본다), nose(벌름), ears(갈기 흔들기),
//            lower_beak(턱), body(맞히면 주저앉음), 다리 6개(가운데 두 다리 뼈대는 비운다)
const { INK, flat, art, mats } = require("./minhwa");

const BODY = "#3f8f86", DEEP = "#2c6a63", GOLD = "#e3b24c", MANE = ["#d9542b", "#c8372d", "#f0a040"], BELLY = "#efe0b8", WHITE = "#fbf3df";
const swirl = (x, y, w, h) => {
  const cx = x % 6, cy = y % 6;                                       // 6칸마다 금빛 소용돌이 하나
  if ((cx === 2 && cy >= 1 && cy <= 3) || (cy === 1 && cx >= 2 && cx <= 4) || (cx === 4 && cy === 2)) return GOLD;
  return (x + y) % 9 === 0 ? DEEP : BODY;
};
const curls = (x, y) => MANE[(Math.floor(x / 2) + Math.floor(y / 2)) % 3];
module.exports = {
  key: "sniffer", geo: "geometry.target_sniffer", tex: "sniffer", size: [128, 128],
  build(K) {
    mats(K, {
      body: swirl,
      belly: flat(BELLY),
      mane: curls,
      face: art([
        "BBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBB",
        "BKKKBBBBBBKKKB",
        "BWWWWBBBBWWWWB",
        "BWKKWBBBBWKKWB",
        "BWWWWBBBBWWWWB",
        "BBBBBBBBBBBBBB",
        "BBBBBGGGGBBBBB",
        "BBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBB",
      ], { K: INK, B: BODY, W: WHITE, G: GOLD }),
      nose: art(["BBBBBBBB", "BKKBBKKB", "BBBBBBBB", "BBBBBBBB"], { K: INK, B: DEEP }),
      jaw: art(["WKWKWKWKWKWK", "RRRRRRRRRRRR", "RRRRRRRRRRRR"], { K: INK, W: WHITE, R: "#b8302a" }, flat(DEEP)),
      horn: flat(GOLD, { min: 99 }),
      bell: (x, y, w, h) => (y === h - 1 ? INK : GOLD),
      claw: flat(WHITE, { min: 99 }),
    });
    const m = K.model("geometry.target_sniffer", { visible_bounds_width: 5, visible_bounds_height: 3.5, visible_bounds_offset: [0, 1.25, 0] });
    m.bone("root").bone("sniffer", { parent: "root" })
      .bone("head_sniffer", { parent: "sniffer", pivot: [0, 20, -14], rotation: [-35, 0, 0] })
      .bone("nose", { parent: "head_sniffer", pivot: [0, 19, -28] })
      .bone("left_ear", { parent: "head_sniffer", pivot: [7, 26, -20] }).bone("right_ear", { parent: "head_sniffer", pivot: [-7, 26, -20] })
      .bone("lower_beak", { parent: "head_sniffer", pivot: [0, 16, -20] })
      .bone("body", { parent: "sniffer", pivot: [0, 19, 0] })
      .bone("front_left_leg", { parent: "sniffer", pivot: [6, 10, -10] }).bone("front_right_leg", { parent: "sniffer", pivot: [-6, 10, -10] })
      .bone("middle_left_leg", { parent: "sniffer", pivot: [6, 10, 0] }).bone("middle_right_leg", { parent: "sniffer", pivot: [-6, 10, 0] })
      .bone("back_left_leg", { parent: "sniffer", pivot: [6, 10, 10] }).bone("back_right_leg", { parent: "sniffer", pivot: [-6, 10, 10] });
    // 머리: 큰 얼굴, 외뿔, 코, 이빨 드러낸 턱, 양옆 곱슬 갈기(귀 뼈대)
    m.cube("head_sniffer", [-7, 15, -28], [14, 13, 11], { all: "body", north: "face", down: "belly" })
      .cube("head_sniffer", [-1, 28, -25], [2, 5, 2], "horn").cube("head_sniffer", [-0.5, 33, -25], [1, 2, 1], "horn");
    m.cube("nose", [-4, 19, -30], [8, 4, 2], "nose");
    m.cube("lower_beak", [-6, 13, -28], [12, 3, 9], { all: "body", north: "jaw", down: "belly" });
    m.cube("left_ear", [7, 16, -26], [3, 12, 8], "mane").cube("right_ear", [-10, 16, -26], [3, 12, 8], "mane");
    // 몸통, 목 갈기, 방울, 불꽃 꼬리
    m.cube("body", [-9, 9, -15], [18, 14, 30], { all: "body", down: "belly" })
      .cube("body", [-10, 13, -17], [20, 12, 5], "mane")
      .cube("body", [-2, 9, -18.5], [4, 4, 2], "bell")
      .cube("body", [-2, 18, 15], [4, 4, 5], "mane").cube("body", [-2.5, 21, 18], [5, 7, 4], "mane");
    for (const [b, x, z] of [["front_left_leg", 3, -13], ["front_right_leg", -9, -13], ["back_left_leg", 3, 7], ["back_right_leg", -9, 7]])
      m.cube(b, [x, 0, z], [6, 10, 6], { all: "body", down: "belly" }).cube(b, [x, 0, z - 1], [6, 1.5, 1], "claw");
    return m;
  },
};
