// 일반 광차(minecraft:minecart) → 나무 수레. 활쏘기 철길 위를 도는 과녁이 이 수레에 탄다.
// 리소스팩의 entity/minecart.entity.json이 바닐라 일반 광차의 클라이언트 정의를 덮어 이 모델·텍스처를 쓰게 한다
// (상자·TNT·호퍼·명령블록 광차는 바닐라 그대로). 움직임은 바닐라 animation.minecart.move.v1.0 그대로 —
// 철길 위치·기울기·충격 흔들림이 'root' 뼈대를 움직이고 y를 18.5 내리므로, 바닐라 v1.0 모델처럼 root(피벗 y24) 아래
// 바닥을 y19~21에 둔다 (게임 안에서는 철길 위 0.5~2.5칸/16).
// 옆판을 바닐라(높이 8)보다 낮게 해 수레에 탄 과녁이 잘 보이게 한다.
const { mats } = require("./minhwa");

const WOOD = "#a8763f", WOOD_D = "#7e5428", WOOD_L = "#c08a4c", IRON = "#3b3d42", IRON_L = "#5a5d64", SPOKE = "#4a2f15";
const plank = (x, y, w, h, n) => (y % 4 === 3 ? WOOD_D : (x * 3 + Math.floor(y / 4) * 5) % 11 === 0 ? WOOD_D : n() < 0.12 ? WOOD_L : WOOD);
const plankV = (x, y, w, h, n) => (x % 4 === 3 ? WOOD_D : n() < 0.12 ? WOOD_L : WOOD);
// 바퀴: 9×9 둥근 판, 쇠 테·바큇살 8개·가운데 굴대 — 모서리는 투명
const wheel = (x, y, w, h) => {
  const cx = (w - 1) / 2, cy = (h - 1) / 2, dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy), R = Math.min(w, h) / 2;
  if (r > R) return null;
  if (r > R - 1.2) return IRON;                                             // 쇠 테
  if (r < 1.2) return IRON_L;                                               // 굴대
  return dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy) ? SPOKE : null; // 바큇살
};
module.exports = {
  key: "minecart", geo: "geometry.rwm.wooden_cart", tex: "wooden_cart", dir: "models/entity", texDir: "textures/rwm/entity", size: [64, 64],
  build(K) {
    mats(K, {
      floor: plank, side: plank, end: plankV,
      post: (x, y, w, h) => (y === 0 || y === h - 1 || y === 3 ? IRON : WOOD_D),
      wheel, rim: () => null, shaft: () => WOOD_D, hub: (x, y, w, h) => (x === 0 || y === 0 || x === w - 1 || y === h - 1 ? IRON : IRON_L),
    });
    const m = K.model("geometry.rwm.wooden_cart", { visible_bounds_width: 2, visible_bounds_height: 1.5, visible_bounds_offset: [0, 1.5, 0] });
    m.bone("root", { pivot: [0, 24, 0] });
    const C = (o, s, mt) => m.cube("root", [o[0], o[1] + 18, o[2]], s, mt);   // 아래 좌표는 철길 위 높이(+18 해서 root 좌표로)
    C([-10, 1, -7], [20, 2, 14], { all: "side", up: "floor", down: "floor" });           // 판자 바닥
    C([-10, 3, -7], [20, 4, 1], "side"); C([-10, 3, 6], [20, 4, 1], "side");             // 옆판(긴 쪽)
    C([-10, 3, -6], [1, 4, 12], "end"); C([9, 3, -6], [1, 4, 12], "end");                 // 앞뒤 판
    for (const [x, z] of [[-10.5, -7.5], [9.5, -7.5], [-10.5, 6.5], [9.5, 6.5]]) C([x, 1, z], [1, 7, 1], "post"); // 철띠 두른 모서리 기둥
    C([-4.5, 0.5, -8.6], [9, 9, 1], { all: "rim", north: "wheel", south: "wheel" });      // 바퀴 (양옆, 아래가 철길에 닿게)
    C([-4.5, 0.5, 7.6], [9, 9, 1], { all: "rim", north: "wheel", south: "wheel" });
    C([-1, 4, -9.6], [2, 2, 2.6], "hub"); C([-1, 4, 7], [2, 2, 2.6], "hub");           // 굴대 끝(바퀴통) — 수레 안으로는 들어오지 않게
    C([10, 3.5, -5], [5, 1, 1], "shaft"); C([10, 3.5, 4], [5, 1, 1], "shaft");             // 끌채
    return m;
  },
};
