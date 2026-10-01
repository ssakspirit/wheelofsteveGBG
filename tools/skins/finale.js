// 백악산 엽전 달리기: 떨어지는 '엽전'은 바닐라 에메랄드 아이템이다(rwm:final_emerald가 죽으며 떨어뜨리고, 주운 개수가 점수).
//   node tools/skins/finale.js
// 에메랄드 아이콘(textures/items/emerald.png, 바닐라 덮어쓰기 — 월드 전체 에메랄드)을 상평통보로:
// 구리빛 둥근 동전, 가운데 네모 구멍, 구멍 둘레의 네 글자(常平通寶) 자리에 짧은 획, 왼쪽 위 빛.
const fs = require("fs"), path = require("path");
const PNG = require("./png");
const { icon } = require("./modelkit");

// o 윤곽 · B 놋쇠 · S 빛 · D 그늘 · R 구멍 테 · k 글자 획 · . 투명(구멍과 바깥)
const i = icon(16, 16).art([
  "................",
  ".....oooooo.....",
  "...ooBBBBBBoo...",
  "..oBSSBBBBBBBo..",
  "..oSBBBkkkBBBo..",
  ".oBSBBBBkBBBBDo.",
  ".oBBkBRRRRBkBDo.",
  ".oBkkBR..RBkkDo.",
  ".oBBkBR..RBBkDo.",
  ".oBBBBRRRRBBBDo.",
  ".oBBBBBBkBBBBDo.",
  "..oBBBBkkkBBDo..",
  "..oDBBBBBBBDDo..",
  "...ooDDDDDDoo...",
  ".....oooooo.....",
  "................",
], { o: "#3a2408", B: "#c8913c", S: "#ecc27a", D: "#a87430", R: "#8a5a22", k: "#6e4418" });
const out = path.join(__dirname, "../../resource_packs/rp0/textures/items/emerald.png");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, PNG.encode(i.image()));
console.log("썼음", path.relative(path.join(__dirname, "../.."), out));
