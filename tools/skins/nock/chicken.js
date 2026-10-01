// 닭 자리 → 십장생의 학(단정학): 흰 몸, 검은 꽁지깃과 날개 끝, 검은 목, 붉은 정수리, 긴 다리와 부리.
// 애니메이션: head_chicken(두리번), left_wing·right_wing(맞히면 날개를 펼쳐 퍼덕), left_leg·right_leg, body(맞히면 폴짝)
const { INK, flat, art, mats } = require("./minhwa");

const WHITE = "#f7f4ec", BLACK = "#24242a", RED = "#d23a2c", LEG = "#4a4a4f", BILL = "#9a8c5a";
module.exports = {
  key: "chicken", geo: "geometry.target_chicken", tex: "chicken", size: [64, 64],
  build(K) {
    mats(K, {
      white: flat(WHITE),
      black: flat(BLACK, { line: false }),
      wing: (x, y, w, h) => (x >= w - 4 ? BLACK : y === 0 ? "#e6e1d4" : WHITE),          // 날개 끝(뒤쪽)은 검다
      wingSide: (x, y, w, h) => (x >= w - 4 ? BLACK : WHITE),
      neck: (x, y, w, h) => (y < h - 3 ? BLACK : WHITE),
      head: art(["RRR", "KWK", "WWW"], { R: RED, K: INK, W: WHITE }),
      headTop: flat(RED, { line: false }),
      headSide: art(["RRRR", "WKBB", "WBBB"], { R: RED, K: INK, W: WHITE, B: BLACK }),
      bill: flat(BILL, { line: false }),
      leg: flat(LEG, { line: false }),
    });
    const m = K.model("geometry.target_chicken", { visible_bounds_width: 2, visible_bounds_height: 2.5, visible_bounds_offset: [0, 1, 0] });
    m.bone("root").bone("chicken", { parent: "root" })
      .bone("body", { parent: "chicken", pivot: [0, 12, 0] })
      .bone("left_wing", { parent: "body", pivot: [3, 16, 0] }).bone("right_wing", { parent: "body", pivot: [-3, 16, 0] })
      .bone("left_leg", { parent: "body", pivot: [1, 11, 1] }).bone("right_leg", { parent: "body", pivot: [-1, 11, 1] })
      .bone("head_chicken", { parent: "body", pivot: [0, 16, -4] })
      .bone("bill", { parent: "head_chicken", pivot: [0, 25, -7] })
      .bone("chin", { parent: "head_chicken", pivot: [0, 25, -7] });
    m.cube("body", [-3, 11, -4], [6, 6, 10], { all: "white", south: "black" })
      .cube("body", [-2.5, 11.5, 6], [5, 4, 3], "black");                                     // 검은 꽁지깃
    m.cube("left_wing", [3, 11, -4], [1, 6, 11], { all: "white", east: "wingSide", west: "wingSide" })
      .cube("right_wing", [-4, 11, -4], [1, 6, 11], { all: "white", east: "wingSide", west: "wingSide" });
    m.cube("left_leg", [0.5, 0, 0.5], [1, 11, 1], "leg").cube("left_leg", [0, 0, -1.5], [2, 0.5, 3], "leg")
      .cube("right_leg", [-1.5, 0, 0.5], [1, 11, 1], "leg").cube("right_leg", [-2, 0, -1.5], [2, 0.5, 3], "leg");
    // 길고 가는 목, 붉은 정수리 머리, 긴 부리
    m.cube("head_chicken", [-1, 16, -5], [2, 9, 2], "neck")
      .cube("head_chicken", [-1.5, 24, -7.5], [3, 3, 4], { all: "headSide", north: "head", up: "headTop", south: "black" });
    m.cube("bill", [-0.5, 24.5, -11.5], [1, 1, 4], "bill");
    return m;
  },
};
