// 당나귀 자리 → 신마도의 천마: 흰 말에 오색 구름 갈기와 꼬리, 발굽 밑의 구름, 붉은 언치(안장 깔개).
// 애니메이션: neck(늘 45° 앞으로 숙인 채 갸웃 — 목은 세워 만든다), 귀, tail, body·다리(맞히면 앞발 들고 일어선다)
const { INK, flat, art, mats } = require("./minhwa");

const WHITE = "#f4f0e6", GREY = "#cfc8ba", MANE = ["#2f5f9e", "#c8372d", "#f0c447", "#4f8a3c", "#f4ecd8"], CLOUD = "#dfe8f2", CLOUD2 = "#7fa7c9", SADDLE = "#c8372d", TRIM = "#f0c447";
const dapple = (x, y, w, h, n) => (n() < 0.1 ? GREY : WHITE);
const mane = (x, y) => MANE[(x + y) % MANE.length];
module.exports = {
  key: "donkey", geo: "geometry.target_donkey", tex: "donkey", size: [64, 64],
  build(K) {
    mats(K, {
      coat: dapple,
      mane,
      face: art(["WWWWWW", "WWWWWW", "WKWWKW", "WWWWWW", "WWWWWW"], { K: INK, W: WHITE }),
      muzzle: art(["GGGG", "GKKG", "GGGG", "GGGG", "GGGG"], { K: INK, G: GREY }),
      ear: art(["WW", "WP", "WP"], { W: WHITE, P: "#e9a3a0" }),
      saddle: (x, y, w, h) => (y === 0 || y === h - 1 || x === 0 || x === w - 1 ? TRIM : SADDLE),
      cloud: (x, y, w, h) => (y === 0 || (x + y) % 3 === 0 ? CLOUD2 : CLOUD),
      hoof: flat(INK, { line: false }),
    });
    const m = K.model("geometry.target_donkey", { visible_bounds_width: 3, visible_bounds_height: 3.5, visible_bounds_offset: [0, 1.25, 0] });
    m.bone("root").bone("donkey", { parent: "root" })
      .bone("neck", { parent: "donkey", pivot: [0, 22, -9] })
      .bone("head_donkey", { parent: "neck", pivot: [0, 22, -9] })
      .bone("left_ear", { parent: "head_donkey", pivot: [1.5, 32, -6] }).bone("right_ear", { parent: "head_donkey", pivot: [-1.5, 32, -6] })
      .bone("mouth", { parent: "head_donkey", pivot: [0, 22, -9] })
      .bone("body", { parent: "donkey", pivot: [0, 13, 6] })
      .bone("tail", { parent: "body", pivot: [0, 20, 11] })
      .bone("front_left_leg", { parent: "body", pivot: [3, 10, -8] }).bone("front_right_leg", { parent: "body", pivot: [-3, 10, -8] })
      .bone("back_left_leg", { parent: "body", pivot: [3, 10, 8] }).bone("back_right_leg", { parent: "body", pivot: [-3, 10, 8] });
    m.cube("neck", [-2, 16, -11], [4, 12, 6], "coat")
      .cube("neck", [-1.5, 17, -5.5], [3, 14, 3], "mane");                                    // 목덜미 오색 갈기
    m.cube("head_donkey", [-3, 28, -11], [6, 5, 7], { all: "coat", north: "face" })
      .cube("head_donkey", [-1.5, 31, -6], [3, 4, 3], "mane");                                // 정수리 갈기
    m.cube("left_ear", [1, 33, -8], [2, 3, 1], { all: "coat", north: "ear" }).cube("right_ear", [-3, 33, -8], [2, 3, 1], { all: "coat", north: "ear" });  // 말 귀는 짧게
    m.cube("mouth", [-2, 28, -16], [4, 5, 5], { all: "coat", north: "muzzle" });
    m.cube("body", [-5, 11, -11], [10, 10, 22], "coat")
      .cube("body", [-5.5, 20, -4], [11, 1.5, 9], "saddle")                                   // 언치
      .cube("body", [-5.6, 14, -3], [11.2, 6, 7], "saddle");
    m.cube("tail", [-1.5, 7, 11], [3, 14, 3], "mane");
    for (const [b, x, z] of [["front_left_leg", 1, -10.5], ["front_right_leg", -5, -10.5], ["back_left_leg", 1, 6.5], ["back_right_leg", -5, 6.5]]) {
      m.cube(b, [x + 0.5, 1, z + 0.5], [3, 10, 3], "coat").cube(b, [x + 0.5, 0, z + 0.5], [3, 1, 3], "hoof")
        .cube(b, [x - 0.5, 0, z - 0.5], [5, 2, 5], "cloud");                                  // 발밑 구름
    }
    return m;
  },
};
