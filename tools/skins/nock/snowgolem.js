// 눈골렘 자리 → 신선도의 수성노인(남극노인): 길쭉한 이마, 흰 눈썹과 긴 수염, 푸른 학창의, 붉은 띠, 한 손에 지팡이.
// 애니메이션: 평소엔 두 팔을 번쩍 들고(left_hand·right_hand) 머리 위 'pumpkin'이 위로 떠오른다 → 천도복숭아를 들어 올리는 모습.
//            맞히면 머리·몸·치마가 위로 늘어나며 껑충(head_snowgolem·body·body_bottom).
const { INK, flat, art, mats } = require("./minhwa");

const ROBE = "#2f5f9e", TRIM = "#f4ecd8", SASH = "#c8372d", SKIN = "#e8b98f", BEARD = "#fbf7ec", PEACH = "#f0a0a0", LEAF = "#4f8a3c", STAFF = "#7a5232";
const robe = (x, y, w, h) => (x === 0 || x === w - 1 ? TRIM : ROBE);
module.exports = {
  key: "snowgolem", geo: "geometry.target_snowgolem", tex: "snow_golem", size: [64, 64],
  build(K) {
    mats(K, {
      robe, skirt: (x, y, w, h) => (y >= h - 2 ? TRIM : ROBE),
      top: flat(ROBE, { line: false }),
      chest: art([
        "TRRRRRRRRT",
        "RTRRRRRRTR",
        "RRTRRRRTRR",
        "RRRTRRTRRR",
        "RRRRTTRRRR",
        "SSSSSSSSSS",
        "SSSSSSSSSS",
        "RRRRRRRRRR",
        "RRRRRRRRRR",
      ], { T: TRIM, R: ROBE, S: SASH }),
      face: art([
        "SSSSSSS",
        "WWSSSWW",
        "SKSSSKS",
        "SSSPSSS",
        "WWWWWWW",
        "WWWWWWW",
        "WWWWWWW",
      ], { S: SKIN, W: BEARD, K: INK, P: "#d9967a" }),
      skin: flat(SKIN, { line: false }),
      dome: (x, y, w, h) => (y === h - 1 ? "#d9a57a" : SKIN),
      beard: flat(BEARD, { line: false }),
      peach: (x, y, w, h) => (y === 0 ? "#f6c6b0" : x === Math.floor(w / 2) ? "#d77474" : PEACH),
      leaf: flat(LEAF, { line: false }),
      staff: flat(STAFF, { line: false }),
      gourd: flat("#e0b04a", { line: false }),
    });
    const m = K.model("geometry.target_snowgolem", { visible_bounds_width: 3, visible_bounds_height: 3.5, visible_bounds_offset: [0, 1.25, 0] });
    m.bone("root").bone("snowgolem", { parent: "root" })
      .bone("head_snowgolem", { parent: "snowgolem", pivot: [0, 19, 0] })
      .bone("pumpkin", { parent: "head_snowgolem", pivot: [0, 33, 0] })
      .bone("body", { parent: "snowgolem", pivot: [0, 10, 0] })
      .bone("right_hand", { parent: "body", pivot: [-5, 18, 0] })
      .bone("right_hand_flip", { parent: "right_hand", pivot: [-5, 18, 0] })
      .bone("right_hand_rotation", { parent: "right_hand_flip", pivot: [-5, 18, 0] })
      .bone("left_hand", { parent: "body", pivot: [5, 18, 0] })
      .bone("left_hand_rotation", { parent: "left_hand", pivot: [5, 18, 0] })
      .bone("body_bottom", { parent: "snowgolem", pivot: [0, 0, 0] });
    // 치마(아랫도리)와 윗옷, 붉은 띠
    m.cube("body_bottom", [-6, 0, -5], [12, 10, 10], { all: "skirt", up: "top", down: "top" });
    m.cube("body", [-5, 10, -4], [10, 9, 8], { all: "robe", north: "chest", up: "top" });
    // 머리: 얼굴(수염), 위로 길게 솟은 이마, 수염 끝
    m.cube("head_snowgolem", [-3.5, 19, -3.5], [7, 7, 7], { all: "skin", north: "face", south: "beard" })
      .cube("head_snowgolem", [-3, 26, -3], [6, 7, 6], "dome")
      .cube("head_snowgolem", [-2.5, 15, -4.5], [5, 4, 1], "beard");
    // 천도복숭아 (pumpkin 뼈대: 팔을 들면 머리 위로 떠오른다)
    m.cube("pumpkin", [-2, 33, -2], [4, 4, 4], "peach").cube("pumpkin", [0, 37, -1], [3, 1, 2], "leaf");
    // 소매와 손, 왼손에 지팡이와 호리병
    m.cube("right_hand_rotation", [-8, 11, -1.5], [3, 8, 3], { all: "robe", down: "skin" }).cube("right_hand_rotation", [-7.5, 10, -1], [2, 1, 2], "skin");
    m.cube("left_hand_rotation", [5, 11, -1.5], [3, 8, 3], { all: "robe", down: "skin" }).cube("left_hand_rotation", [5.5, 10, -1], [2, 1, 2], "skin")
      .cube("left_hand_rotation", [6, 0, -3], [1, 24, 1], "staff")
      .cube("left_hand_rotation", [5.5, 21, -3.5], [2, 3, 2], "gourd");
    return m;
  },
};
