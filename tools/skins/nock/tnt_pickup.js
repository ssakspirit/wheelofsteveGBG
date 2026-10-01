// 6진 망루 공성전의 폭탄(rwm:elytra_bomb) TNT → 비격진천뢰(飛擊震天雷): 무쇠 공, 철띠와 돌기, 위의 뚜껑과 심지.
// 텍스처 두 벌이 같은 모델을 쓴다 (렌더 컨트롤러가 mark_variant로 고른다):
//   tnt_pickup        : 평소 — 심지 끝은 그을린 색, 낙하 표시는 투명
//   tnt_pickup_toggle : 활성 — 심지에 불이 붙고, 아래로 떨어질 길에 불씨 표시가 차례로 깜빡인다
// 뼈대 이름은 animation.tnt_pickup.blinking이 쓰는 그대로: tnt(빙글 돎), trajectory > cube1~cube10(차례로 커졌다 사라짐)
const { flat, mats } = require("./minhwa");

const IRON = "#3b3d42", IRON_L = "#55585f", IRON_D = "#2a2b2f", RUST = "#6b4a35", ROPE = "#c9a45a";
const iron = band => (x, y, w, h, n) => {
  if (band && Math.abs(y - (h - 1) / 2) < 1) return IRON_D;                 // 가운데 철띠
  if ((x + 2 * y) % 5 === 0 && n(3, 1) < 0.5) return IRON_L;                 // 주물 돌기
  return n() < 0.04 ? RUST : n(1) < 0.12 ? IRON_D : IRON;
};
module.exports = {
  key: "tnt_pickup", geo: "geometry.tnt_pickup", dir: "models/entity", texDir: "textures/rwm/entity", size: [64, 64],
  variants: { tnt_pickup: { lit: false }, tnt_pickup_toggle: { lit: true } },
  build(K, V) {
    mats(K, {
      side: iron(true),
      cap: iron(false),
      lid: (x, y, w, h) => (x === 0 || y === 0 || x === w - 1 || y === h - 1 ? IRON_L : IRON_D),
      rope: flat(ROPE, { noise: 0.15 }),
      tip: V.lit ? (x, y, w, h) => ((x + y) % 2 ? "#f6c84a" : "#e8622c") : flat("#2b211c"),
      marker: V.lit ? (x, y, w, h) => (x > 0 && y > 0 && x < w - 1 && y < h - 1 ? "#f6d24a" : "#e0542c") : () => null,
    });
    const m = K.model("geometry.tnt_pickup", { visible_bounds_width: 2, visible_bounds_height: 34, visible_bounds_offset: [0, -15, 0] });
    m.bone("root").bone("tnt", { parent: "root" }).bone("trajectory", { parent: "root" });
    // 무쇠 공: 상자 네 개를 엇갈려 겹쳐 둥근 윤곽을 만든다
    const ball = { all: "side", up: "cap", down: "cap" };
    m.cube("tnt", [-7, 4, -5], [14, 8, 10], ball).cube("tnt", [-5, 4, -7], [10, 8, 14], ball)
      .cube("tnt", [-6, 2, -6], [12, 12, 12], ball).cube("tnt", [-5, 1, -5], [10, 14, 10], { all: "cap" });
    m.cube("tnt", [-2.5, 15, -2.5], [5, 1, 5], "lid")                                      // 뚜껑(화약 넣는 구멍)
      .cube("tnt", [-0.5, 16, -0.5], [1, 3, 1], "rope")                                   // 심지
      .cube("tnt", [-1, 19, -1], [2, 2, 2], "tip");                                       // 심지 끝(불)
    for (let i = 1; i <= 10; i++) {
      const y = -8 - 16 * (i - 1);
      m.bone("cube" + i, { parent: "trajectory", pivot: [0, y, 0] });
      m.cube("cube" + i, [-2, y - 2, -2], [4, 4, 4], "marker");                          // 떨어질 길의 불씨
    }
    return m;
  },
};
