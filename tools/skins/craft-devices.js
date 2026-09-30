// 자격루 복원전 장치 5종(고장/수리) 모델 10개 + 공용 텍스처(256×256) + 수리 부품 아이콘 5개.
//   node tools/skins/craft-devices.js
// 장치는 한 팀에 4블록(64칸) 간격으로 서 있으므로 폭 60칸 안(x −30..30)에 만들고, 앞면(−z, north)이 플레이어 쪽을 본다.
// 게임이 끝나면 이긴 팀 장치에서 animation.craft_contraption.fixed(10초)가 재생된다. 그 애니메이션이 움직이는
// 뼈대 이름(wheel, gear, body, pistonArm, boxingGlove, glove, bucket, tripwireLeft/Right, string, bootPendulum, boot,
// lampOff/On, daylight_sensorOff/On, gear3, gear4, trap)을 그대로 써서 자격루의 연쇄 동작(물→잣대→구슬→시보→십이지신)이 되게 했다.
const fs = require("fs"), path = require("path");
const PNG = require("./png");
const { kit, icon, pick, lighten, darken } = require("./modelkit");
const parts = require("./craft-parts");

const RP = path.join(__dirname, "../../resource_packs/rp0");

function materials(k) {
  parts.materials(k); // 부품과 같은 재질(옹기, 물, 청동, 나무, 쇠구슬, 인형 옷…)
  const tone = pal => (x, y, w, h, n) => pick(pal, n());
  k.material("plank", (x, y, w, h, n) => (y % 4 === 3 ? "#4a3220" : pick(["#6b4a2e", "#7a5636", "#7a5636", "#86603c"], n())));
  k.material("red_lacquer", tone(["#8e1f1a", "#a52b24", "#a52b24", "#b8372c"]));
  k.material("red_panel", (x, y, w, h, n) => (x === 0 || y === 0 || x === w - 1 || y === h - 1 ? "#d9a93a" : x === 1 || y === 1 || x === w - 2 || y === h - 2 ? "#2a7d5a" : pick(["#9a2520", "#a52b24"], n())), { max: 32 });
  k.material("gold", tone(["#b8871f", "#e0ad33", "#f5cf5c"]));
  k.material("roof", (x, y, w, h, n) => (y % 3 === 0 ? "#2a2d33" : x % 4 === 0 ? "#454a52" : pick(["#373b42", "#3e434a"], n())));
  k.material("onggi_crack", (x, y, w, h, n) => (Math.abs(x - y * 0.6 - w * 0.3) < 0.8 ? "#2a160a" : y % 5 === 2 ? "#8a5230" : pick(["#5a321b", "#6e3f22"], n())));
  k.material("drum_face", (x, y, w, h) => { const d = Math.hypot(x + 0.5 - w / 2, y + 0.5 - h / 2) / (Math.min(w, h) / 2); return d > 0.95 ? "#a52b24" : d > 0.8 ? "#d9a93a" : d < 0.3 ? "#b8372c" : "#e8d6a8"; }, { max: 32 });
  k.material("drum_side", (x, y, w, h, n) => (y === 0 || y === h - 1 ? "#e0ad33" : x % 3 === 1 && (y === 1 || y === h - 2) ? "#f5cf5c" : pick(["#8e1f1a", "#a52b24"], n())));
  k.material("gong", (x, y, w, h) => { const d = Math.hypot(x + 0.5 - w / 2, y + 0.5 - h / 2) / (Math.min(w, h) / 2); return d > 0.92 ? "#8f6a2a" : d < 0.28 ? "#e0bd62" : d < 0.4 ? "#8f6a2a" : "#c9a24e"; }, { max: 32 });
  k.material("bell", (x, y, w, h, n) => (y === h - 1 || y === Math.floor(h / 3) ? "#8f6a2a" : pick(["#6f8f5a", "#7d9a66", "#8aa674"], n())));
  k.material("niche", (x, y, w, h) => (x === 0 || y === 0 || x === w - 1 ? "#d9a93a" : "#2a1410"), { max: 32 });
  // 12지 바퀴: 둥근 판 둘레에 12 동물 자리(색 점)와 가운데 금빛 축
  const Z = ["#9a9aa0", "#6b4a2e", "#e0ad33", "#e8e0d0", "#2a7d5a", "#3a6ab0", "#8a5230", "#efe6cf", "#c07a3a", "#b3262c", "#d9d2c2", "#5a3d26"];
  k.material("zodiac", (x, y, w, h) => {
    const cx = w / 2, cy = h / 2, dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.hypot(dx, dy) / (Math.min(w, h) / 2);
    if (r > 1) return null;
    if (r > 0.93) return "#e0ad33";
    if (r < 0.16) return "#f5cf5c";
    if (r > 0.55 && r < 0.85) { const a = (Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI) * 12, i = Math.floor(a); if (a - i > 0.25 && a - i < 0.75) return Z[i]; }
    return r < 0.5 && Math.abs(dx) < 0.8 ? "#8f6a2a" : "#1f3b6b";
  }, { max: 32 });
  k.material("sipae_off", (x, y, w, h) => (x === 0 || y === 0 || x === w - 1 || y === h - 1 ? "#d9a93a" : "#1a1a1f"), { max: 32 });
  k.material("sipae_on", (x, y, w, h) => (x === 0 || y === 0 || x === w - 1 || y === h - 1 ? "#d9a93a"
    : (x === Math.floor(w / 2) && y > 1 && y < h - 3) || (y === 3 && x > 2 && x < w - 3) || (y === Math.floor(h / 2) && x > 3 && x < w - 4) ? "#1a1a1f"
    : x === w - 3 && y === h - 3 ? "#c0392b" : "#f3ecd8"), { max: 32 });
  k.material("lantern_off", (x, y, w, h) => (y === 0 || y === h - 1 ? "#1a1a1f" : "#5a3a2a"));
  k.material("lantern_on", (x, y, w, h) => (y === 0 || y === h - 1 ? "#1a1a1f" : x === 0 || x === w - 1 ? "#e0ad33" : "#ffd98a"));
  k.material("water_fall", (x, y, w, h, n) => (n(0, y >> 1) > 0.7 ? "#9cc4ea" : "#4f86c0"));
  k.material("shard", tone(["#5a321b", "#7a4526"]));
}

// 작은 도우미: 인형(시보·십이지신)
function figure(m, bone, x, y, z, robe, { head = "face", headMat = "skin", hat = true } = {}) {
  m.cube(bone, [x - 3, y, z - 2], [6, 4, 5], robe);
  m.cube(bone, [x - 2.5, y + 4, z - 2], [5, 5, 4], { all: robe + "_belt", up: robe, down: robe });
  m.cube(bone, [x - 2, y + 9, z - 1.5], [4, 4, 4], { all: headMat, north: head });
  if (hat) { m.cube(bone, [x - 3, y + 13, z - 2.5], [6, 1, 6], "black"); m.cube(bone, [x - 1.5, y + 14, z - 1], [3, 2, 3], "black"); }
}
// 둥근 항아리(옹기): 가운데 (cx, cz), 바닥 y, 몸통 지름 d, 높이 h
function jar(m, bone, cx, y, cz, d, h, { mat = "onggi", water = true, bob = null } = {}) {
  const r = d / 2;
  m.cube(bone, [cx - r, y, cz - r + 1], [d, h, d - 2], mat);
  m.cube(bone, [cx - r + 1, y, cz - r], [d - 2, h, d], mat);
  m.cube(bone, [cx - r - 1, y + 2, cz - r + 2], [d + 2, h - 4, d - 4], mat);
  const n = Math.max(4, Math.round(d * 0.5)), ny = y + h;
  m.cube(bone, [cx - n / 2 - 1, ny, cz - n / 2 - 1], [n + 2, 1, n + 2], mat);
  // 입구는 속이 빈 테두리 네 조각 + 안쪽 물(애니메이션에서 출렁임)
  const t = ny + 1;
  m.cube(bone, [cx - n / 2 - 1, t, cz - n / 2 - 1], [n + 2, 2, 1], "onggi_rim");
  m.cube(bone, [cx - n / 2 - 1, t, cz + n / 2], [n + 2, 2, 1], "onggi_rim");
  m.cube(bone, [cx - n / 2 - 1, t, cz - n / 2], [1, 2, n], "onggi_rim");
  m.cube(bone, [cx + n / 2, t, cz - n / 2], [1, 2, n], "onggi_rim");
  if (water) m.cube(bob || bone, [cx - n / 2, t + 0.5, cz - n / 2], [n, 0.5, n], "water");
}
// 손잡이 바퀴(밸브): 앞에서 보이는 십자 + 테 + 금빛 축
function valve(m, bone, cx, cy, z) {
  m.cube(bone, [cx - 3.5, cy - 0.5, z], [7, 1, 1], "bronze");
  m.cube(bone, [cx - 0.5, cy - 3.5, z], [1, 7, 1], "bronze");
  m.cube(bone, [cx - 3.5, cy - 3.5, z], [7, 1, 1], "bronze_dark");
  m.cube(bone, [cx - 3.5, cy + 2.5, z], [7, 1, 1], "bronze_dark");
  m.cube(bone, [cx - 3.5, cy - 2.5, z], [1, 5, 1], "bronze_dark");
  m.cube(bone, [cx + 2.5, cy - 2.5, z], [1, 5, 1], "bronze_dark");
  m.cube(bone, [cx - 1, cy - 1, z - 0.5], [2, 2, 1], "gold");
}

const DEVICES = [
  { n: 1, name: "물 공급 장치", build(m, P, broken) {
    // 계단 받침 3단 위에 큰·중간·작은 파수호. 물은 관을 따라 다음 장치(잣대 장치) 쪽으로 흐른다.
    m.cube(P, [-28, 0, 12], [56, 8, 28], { all: "plank", north: "red_panel" });
    m.cube(P, [-28, 8, 12], [38, 14, 28], { all: "plank", north: "red_panel" });
    m.cube(P, [-28, 22, 12], [20, 16, 28], { all: "plank", north: "red_panel" });
    if (!broken) {
      m.bone("body", { parent: P, pivot: [0, 0, 0] }); // 항아리 속 물이 출렁임 (애니메이션: body)
      jar(m, P, -18, 38, 26, 16, 14, { bob: "body" });
      jar(m, P, 0, 22, 26, 12, 11, { bob: "body" });
      jar(m, P, 19, 8, 26, 10, 9, { bob: "body" });
      m.cube(P, [-9, 44, 25], [8, 2, 2], "bronze");       // 큰 항아리 → 중간 항아리
      m.cube(P, [-3, 36, 25], [2, 8, 2], "bronze");
      m.cube(P, [6, 27, 25], [9, 2, 2], "bronze");        // 중간 → 작은 항아리
      m.cube(P, [14, 19, 25], [2, 8, 2], "bronze");
      m.cube(P, [24, 11, 25], [6, 2, 2], "bronze");       // 작은 항아리 → 잣대 장치
      m.cube(P, [28.5, 4, 25.5], [1, 7, 1], "water_fall");
      m.bone("wheel", { parent: P, pivot: [-5, 45, 23] }); valve(m, "wheel", -5, 45, 23);  // 애니메이션: wheel(도는 손잡이)
      m.cube(P, [-5.5, 44.5, 24], [1, 1, 1], "bronze");
      m.bone("gear", { parent: P, pivot: [10, 28, 23] }); valve(m, "gear", 10, 28, 23);   // 애니메이션: gear
      m.cube(P, [9.5, 27.5, 24], [1, 1, 1], "bronze");
    } else {
      m.bone("jar_tilt", { parent: P, pivot: [-10, 38, 26], rotation: [0, 0, -22] });
      jar(m, "jar_tilt", -18, 38, 26, 16, 14, { mat: "onggi_crack", water: false });
      jar(m, P, 0, 22, 26, 12, 11, { water: false });
      m.cube(P, [14, 8, 20], [4, 2, 3], "shard"); m.cube(P, [20, 8, 23], [3, 1, 4], "shard"); m.cube(P, [17, 8, 30], [5, 2, 3], "shard");
      m.bone("valve_down", { parent: P, pivot: [-20, 22.5, 16], rotation: [90, 0, 0] }); valve(m, "valve_down", -20, 19, 16);
      m.cube(P, [2, 8, 16], [8, 2, 2], "bronze"); m.cube(P, [-2, 22, 14], [2, 2, 7], "bronze");
    }
  } },
  { n: 2, name: "잣대 장치", build(m, P, broken) {
    // 수수호 두 개. 물이 차면 잣대가 떠오르고, 위쪽 구슬 통로의 작은 쇠구슬을 굴려 보낸다.
    m.cube(P, [-28, 0, 12], [56, 6, 28], "stone");
    const cyl = (bone, cx, y, cz, w, h) => {
      m.cube(bone, [cx - w / 2, y, cz - w / 2 + 2], [w, h, w - 4], "bronze_green");
      m.cube(bone, [cx - w / 2 + 2, y, cz - w / 2], [w - 4, h, w], "bronze_green");
      m.cube(bone, [cx - w / 2 - 0.5, y + h, cz - w / 2 + 1.5], [w + 1, 2, w - 3], "bronze");
      m.cube(bone, [cx - w / 2 + 1.5, y + h, cz - w / 2 - 0.5], [w - 3, 2, w + 1], "bronze");
    };
    cyl(P, -10, 6, 26, 16, 40);
    m.cube(P, [-20, 22, 24], [2, 2, 4], "bronze"); m.cube(P, [-30, 22, 25], [10, 2, 2], "bronze"); // 물 공급 장치에서 오는 관
    m.cube(P, [-25, 6, 25], [2, 52, 2], "walnut"); m.cube(P, [2, 6, 25], [2, 52, 2], "walnut");    // 통로 기둥
    if (!broken) {
      cyl(P, 12, 6, 26, 12, 30);
      m.bone("pistonArm", { parent: P, pivot: [-10, 48, 26] });   // 애니메이션: pistonArm(잣대가 오르내림)
      m.cube("pistonArm", [-11, 48, 25], [2, 22, 2], "scale_rod");
      m.cube("pistonArm", [-12.5, 46, 23.5], [5, 2, 5], "pine");   // 부전(뜨개)
      m.bone("trough2", { parent: P, pivot: [0, 58, 26], rotation: [0, 0, -3] });
      m.cube("trough2", [-26, 58, 24], [32, 2, 4], { all: "wood_mid", up: "trough_top" });
      m.cube("trough2", [-26, 60, 23.5], [32, 1.5, 1], "wood_mid");
      m.cube("trough2", [-26, 60, 27.5], [32, 1.5, 1], "wood_mid");
      m.bone("boxingGlove", { parent: P, pivot: [4, 62, 26] });   // 애니메이션: boxingGlove(작은 쇠구슬이 굴러감)
      m.bone("glove", { parent: "boxingGlove", pivot: [4, 62, 26] }); // 애니메이션: glove(부딪힐 때 튐)
      m.cube("glove", [2.5, 60.5, 24.5], [3, 3, 3], "ball");
      m.cube(P, [6, 56, 22], [4, 8, 8], { all: "red_lacquer", north: "red_panel" }); // 구슬이 도착하는 받침(다음 장치로)
    } else {
      m.bone("fallen_cyl", { parent: P, pivot: [12, 6, 20], rotation: [0, 0, -90] }); cyl("fallen_cyl", 18, 6, 26, 12, 30);
      m.bone("rod_fallen", { parent: P, pivot: [-10, 6.5, 18], rotation: [0, 0, 78] });
      m.cube("rod_fallen", [-11, 6.5, 17], [2, 22, 2], "scale_rod");
      m.bone("trough_broken", { parent: P, pivot: [-25, 58, 26], rotation: [0, 0, -24] });
      m.cube("trough_broken", [-26, 58, 24], [16, 2, 4], { all: "wood_mid", up: "trough_top" });
      m.cube(P, [6, 6, 16], [3, 3, 3], "ball");
    }
  } },
  { n: 3, name: "구슬 신호 장치", build(m, P, broken) {
    // 세운 판에 비스듬한 구슬 통로가 지그재그로 있고, 큰 쇠구슬이 떨어지며 숟가락 장치를 기울이고 아래 판을 누른다.
    m.cube(P, [-24, 0, 14], [48, 4, 22], "walnut");
    m.cube(P, [-20, 4, 26], [40, 92, 4], "plank");
    m.cube(P, [-22, 4, 24], [3, 92, 7], "red_lacquer");
    m.cube(P, [-22, 96, 22], [44, 4, 10], { all: "red_lacquer", north: "red_panel" });
    const shelf = (name, y, rot, parent = P) => { m.bone(name, { parent, pivot: [0, y, 24], rotation: [0, 0, rot] }); m.cube(name, [-16, y, 22], [32, 1.5, 4], { all: "bronze", up: "trough_top" }); };
    if (!broken) {
      m.cube(P, [19, 4, 24], [3, 92, 7], "red_lacquer");
      shelf("shelf1", 84, -7); shelf("shelf2", 70, 7); shelf("shelf3", 46, -7); shelf("shelf4", 32, 7);
      m.bone("bucket", { parent: P, pivot: [-10, 92, 21] });  // 애니메이션: bucket(큰 쇠구슬이 떨어짐)
      m.cube("bucket", [-13, 88, 18.5], [5, 5, 5], "ball");
      m.bone("tripwireLeft", { parent: P, pivot: [-8, 58, 21] });  // 애니메이션: 숟가락 장치가 기울어짐
      m.cube("tripwireLeft", [-15, 58, 20.5], [8, 1, 1], "bronze"); m.cube("tripwireLeft", [-18, 57.5, 19.5], [3, 1.5, 3], { all: "bronze_light", up: "spoon_bowl" });
      m.bone("tripwireRight", { parent: P, pivot: [8, 58, 21] });
      m.cube("tripwireRight", [8, 58, 20.5], [8, 1, 1], "bronze"); m.cube("tripwireRight", [15, 57.5, 19.5], [3, 1.5, 3], { all: "bronze_light", up: "spoon_bowl" });
      m.cube(P, [-8.5, 55, 21.5], [1, 3, 1], "bronze"); m.cube(P, [7.5, 55, 21.5], [1, 3, 1], "bronze");
      m.bone("string", { parent: P, pivot: [0, 20, 22] });  // 애니메이션: string(아래 판이 눌림)
      m.cube("string", [-7, 20, 19], [14, 1.5, 6], "bronze_dark");
      m.cube(P, [-6, 8, 20], [2, 12, 2], "bronze"); m.cube(P, [4, 8, 20], [2, 12, 2], "bronze");
    } else {
      m.bone("post_tilt", { parent: P, pivot: [22, 4, 27], rotation: [0, 0, 16] }); m.cube("post_tilt", [19, 4, 24], [3, 92, 7], "red_lacquer");
      shelf("shelf1", 84, -7); shelf("shelf3", 46, -35);
      m.bone("shelf_down", { parent: P, pivot: [-10, 4.5, 16], rotation: [0, 25, 0] }); m.cube("shelf_down", [-16, 4, 14], [32, 1.5, 4], "bronze");
      m.cube(P, [8, 4, 16], [5, 5, 5], "ball");
      m.cube(P, [-18, 4, 18], [8, 1, 1], "bronze");
    }
  } },
  { n: 4, name: "종·북·징 시보 장치", build(m, P, broken) {
    // 붉은 3층 누각. 층마다 인형이 있고, 맨 위 인형이 채를 휘둘러 종을 친다(애니메이션: bootPendulum, boot).
    m.cube(P, [-26, 0, 12], [52, 6, 30], "stone");
    m.cube(P, [-22, 6, 20], [44, 70, 20], { all: "red_lacquer", north: "red_panel" });
    for (const [y0, y1] of [[8, 25], [30, 49], [54, 73]]) m.cube(P, [-20, y0, 19.5], [40, y1 - y0, 0.5], { all: "none", north: "niche" });
    m.cube(P, [-22, 26, 15], [44, 2, 5], "walnut"); m.cube(P, [-22, 50, 15], [44, 2, 5], "walnut");
    m.cube(P, [-27, 76, 15], [54, 4, 30], "roof"); m.cube(P, [-23, 80, 18], [46, 4, 24], "roof"); m.cube(P, [-18, 84, 23], [36, 3, 14], "roof");
    m.cube(P, [-19, 84.5, 22.5], [2, 3, 15], "gold"); m.cube(P, [17, 84.5, 22.5], [2, 3, 15], "gold");
    // 맨 위 층: 종은 왼쪽, 인형은 오른쪽. 채가 왼쪽(−x)을 향해야 애니메이션의 +90°가 '치켜들기'가 된다
    m.cube(P, [-18, 70, 14], [12, 1, 1], "walnut"); m.cube(P, [-12.5, 66, 14], [1, 4, 1], "walnut");
    if (!broken) {
      m.bone("boot", { parent: P, pivot: [-12, 62, 15] });  // 애니메이션: boot(종이 울리며 흔들림)
      m.cube("boot", [-15, 58, 12], [6, 8, 6], "bell"); m.cube("boot", [-13.5, 65, 13.5], [3, 1, 3], "bronze_dark");
      figure(m, P, 4, 52, 17, "red_robe");
      m.bone("bootPendulum", { parent: P, pivot: [1, 60, 16.5] });  // 애니메이션: bootPendulum(채를 치켜들었다 종을 친다)
      m.cube("bootPendulum", [-8, 59.5, 16], [9, 1.5, 1.5], "wood_mid"); m.cube("bootPendulum", [-9.5, 58, 15], [2.5, 4, 3.5], "walnut");
      figure(m, P, -8, 28, 17, "teal_robe");
      m.cube(P, [-5, 34, 16], [7, 1, 1], "wood_mid");
      m.cube(P, [4, 30, 13], [10, 10, 6], { all: "drum_side", north: "drum_face", south: "drum_face" });
      m.cube(P, [8, 28, 15], [2, 2, 2], "walnut");
      figure(m, P, -8, 6, 17, "red_robe");
      m.cube(P, [3, 7, 16], [1, 16, 2], "walnut"); m.cube(P, [16, 7, 16], [1, 16, 2], "walnut"); m.cube(P, [3, 22, 16], [14, 1, 2], "walnut");
      m.cube(P, [5, 9, 16.5], [10, 10, 1], { all: "bronze", north: "gong", south: "gong" });
    } else {
      m.bone("bell_down", { parent: P, pivot: [-18, 6, 8], rotation: [0, 0, -70] }); m.cube("bell_down", [-21, 6, 5], [6, 8, 6], "bell");
      m.bone("fig_down", { parent: P, pivot: [4, 52, 17], rotation: [0, 0, -85] }); figure(m, "fig_down", 4, 52, 17, "red_robe");
      m.bone("drum_tilt", { parent: P, pivot: [9, 30, 16], rotation: [20, 0, 25] }); m.cube("drum_tilt", [4, 30, 13], [10, 10, 6], { all: "drum_side", north: "drum_face" });
      figure(m, P, -8, 6, 17, "red_robe");
      m.bone("gong_down", { parent: P, pivot: [-14, 6, 8], rotation: [-80, 0, 0] }); m.cube("gong_down", [-19, 6, 8], [10, 10, 1], { all: "bronze", north: "gong" });
    }
  } },
  // 게임이 끝나면 진 팀이 이긴 팀 ⑤번 장치 바로 앞(모델 기준 z 약 0~28, x ±21)으로 순간이동된다(규칙, 못 바꿈).
  // 그 자리를 앞마당으로 비워 두려고 누각 전체를 뒤로 18칸 옮긴다 → 진 팀이 완성된 장치를 앞에서 바라보는 구도.
  { n: 5, name: "십이지신 시각 알림 장치", shift: [0, 0, 18], build(m, P, broken) {
    // 높은 누각. 앞쪽 둥근 판에 12지 동물이 돌아 나오고(gear3), 아래 시패가 바뀌며(lampOff/On),
    // 처마 등불이 켜지고(daylight_sensorOff/On), 옆 관으로 큰 쇠구슬이 내려간다(trap).
    m.cube(P, [-26, 0, 10], [52, 8, 36], "stone");
    m.cube(P, [-22, 8, 18], [44, 110, 24], { all: "red_lacquer", north: "red_panel" });
    m.cube(P, [-18, 60, 16], [36, 2, 2], "gold"); m.cube(P, [-18, 98, 16], [36, 2, 2], "gold");
    m.cube(P, [-18, 62, 16], [2, 36, 2], "gold"); m.cube(P, [16, 62, 16], [2, 36, 2], "gold");
    m.cube(P, [-9, 32, 16], [18, 16, 2], { all: "gold", north: "niche" });
    m.cube(P, [23, 40, 29], [4, 74, 1], "bronze"); m.cube(P, [22, 40, 26], [1, 74, 4], "bronze_dark");
    const roof = bone => {
      m.cube(bone, [-29, 118, 8], [58, 5, 40], "roof"); m.cube(bone, [-25, 123, 13], [50, 6, 30], "roof");
      m.cube(bone, [-20, 129, 18], [40, 5, 20], "roof"); m.cube(bone, [-16, 134, 23], [32, 4, 10], "roof");
      m.cube(bone, [-2, 138, 26], [4, 6, 4], "gold");
    };
    m.cube(P, [-0.5, 110, 11], [1, 8, 1], "black");
    if (!broken) {
      roof(P);
      m.bone("gear3", { parent: P, pivot: [0, 80, 15] });  // 애니메이션: gear3(12지 바퀴가 돈다)
      m.cube("gear3", [-15, 65, 15], [30, 30, 0.5], { all: "none", north: "zodiac" });
      m.bone("gear4", { parent: P, pivot: [20, 104, 16] });  // 애니메이션: gear4(작은 톱니)
      m.cube("gear4", [16, 103, 15.5], [8, 2, 1], "bronze"); m.cube("gear4", [19, 100, 15.5], [2, 8, 1], "bronze");
      m.bone("lampOff", { parent: P, pivot: [0, 40, 15] });  // 애니메이션: 시패가 바뀜
      m.cube("lampOff", [-7, 34, 15], [14, 12, 0.5], { all: "none", north: "sipae_off" });
      m.bone("lampOn", { parent: P, pivot: [0, 40, 14.5] });
      m.cube("lampOn", [-7, 34, 14.5], [14, 12, 0.5], { all: "none", north: "sipae_on" });
      m.bone("daylight_sensorOff", { parent: P, pivot: [0, 106, 12] });  // 애니메이션: 처마 등불이 켜짐
      m.cube("daylight_sensorOff", [-3, 102, 9], [6, 8, 6], "lantern_off");
      m.bone("daylight_sensorOn", { parent: P, pivot: [0, 106, 11.9] });
      m.cube("daylight_sensorOn", [-3.1, 101.9, 8.9], [6.2, 8.2, 6.2], "lantern_on");
      m.bone("trap", { parent: P, pivot: [25, 110, 27] });  // 애니메이션: trap(큰 쇠구슬이 관을 따라 내려감)
      m.cube("trap", [23.5, 108, 25.5], [3, 3, 3], "ball");
    } else {
      m.bone("roof_tilt", { parent: P, pivot: [26, 118, 28], rotation: [0, 0, -9] }); roof("roof_tilt");
      m.bone("wheel_down", { parent: P, pivot: [0, 8, 4], rotation: [-82, 0, 0] });
      m.cube("wheel_down", [-15, 8, 4], [30, 30, 0.5], { all: "none", north: "zodiac" });
      m.cube(P, [-3, 8, 2], [6, 8, 6], "lantern_off");
      m.cube(P, [18, 8, 4], [3, 3, 3], "ball");
    }
  } },
];

// ---------- 수리 부품 아이콘 (16×16, items/craft_contraption_fixed_N) ----------
const REPAIR_ICONS = {
  1: i => i.rect(1, 12, 14, 3, "#7a5636").rect(1, 9, 9, 3, "#7a5636").rect(1, 6, 5, 3, "#7a5636").ellipse(3.5, 3.5, 2.6, 2.6, "#7a4526").ellipse(8, 7, 2.2, 2.2, "#7a4526").ellipse(12.5, 10.5, 2, 2, "#7a4526").set(3, 1, "#4f86c0").set(8, 5, "#4f86c0").set(12, 9, "#4f86c0"),
  2: i => i.rect(2, 13, 12, 2, "#98958d").rect(3, 5, 6, 8, "#5e8a6a").rect(3, 7, 6, 1, "#3f6a52").rect(5, 0, 2, 5, "#dcae78").rect(8, 3, 7, 2, "#8a6040").ellipse(12.5, 2, 1.6, 1.6, "#4a4d55"),
  3: i => i.rect(2, 0, 12, 15, "#7a5636").line(3, 3, 12, 5, "#c9a24e").line(12, 8, 3, 10, "#c9a24e").line(3, 13, 12, 13, "#c9a24e").ellipse(5, 2, 1.6, 1.6, "#4a4d55"),
  4: i => i.rect(1, 3, 14, 12, "#a52b24").rect(0, 1, 16, 2, "#3e434a").ellipse(10.5, 9, 3, 3.6, "#7d9a66").rect(3, 6, 3, 6, "#b3262c").rect(3, 4, 3, 2, "#e0ad86").line(5, 7, 8, 6, "#8a6040"),
  5: i => i.rect(2, 3, 12, 12, "#a52b24").rect(0, 0, 16, 3, "#3e434a").ellipse(8, 9, 4.6, 4.6, "#1f3b6b").ellipse(8, 9, 1.4, 1.4, "#f5cf5c").set(8, 5, "#e0ad33").set(12, 9, "#3a6ab0").set(8, 13, "#b3262c").set(4, 9, "#2a7d5a"),
};
const KEEP = new Set(["#4f86c0", "#f5cf5c", "#e0ad33", "#3a6ab0", "#b3262c", "#2a7d5a", "#c9a24e", "#e0ad86"]);

function build() {
  const k = kit({ width: 256, height: 256, maxRegion: 16 }); // 그림 재질만 32 (materials의 max)
  materials(k);
  const lines = [];
  for (const d of DEVICES) for (const broken of [true, false]) {
    const id = `craft_contraption_${d.n}_${broken ? "broken" : "fixed"}`;
    const file = path.join(RP, `models/entity/${id}.geo.json`);
    const { identifier, texture_width, texture_height, ...keep } = JSON.parse(fs.readFileSync(file, "utf8"))["minecraft:geometry"][0].description;
    const m = k.model(`geometry.${id}`, keep, { shift: d.shift });
    const P = `contraption${d.n}`;
    m.bone("root", { pivot: [0, 0, 0] }).bone(P, { parent: "root" });
    d.build(m, P, broken);
    const json = m.json();
    fs.writeFileSync(file, JSON.stringify(json, null, "\t") + "\n");
    const cubes = json["minecraft:geometry"][0].bones.reduce((a, b) => a + (b.cubes || []).length, 0);
    lines.push(`${id}: 큐브 ${cubes}`);
  }
  // 엔티티 정의상 고장/수리 모두 craft_contraption_fixed 텍스처를 쓴다
  fs.writeFileSync(path.join(RP, "textures/rwm/entity/craft_contraption_fixed.png"), PNG.encode(k.img));
  for (const [n, draw] of Object.entries(REPAIR_ICONS)) {
    const ic = icon(16, 16); draw(ic); ic.shade({ keep: KEEP });
    fs.writeFileSync(path.join(RP, `textures/rwm/items/craft_contraption_fixed_${n}.png`), PNG.encode(ic.image()));
  }
  lines.push(`텍스처 사용: ${k.used().rows}/256줄`);
  console.log(lines.join("\n"));
}
if (require.main === module) build();
module.exports = { DEVICES, REPAIR_ICONS };
