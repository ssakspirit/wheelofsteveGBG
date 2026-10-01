// 로비 입구 위에 떠 있는 게임 표지 로고(파티클 rwm:logo_*, 16×16, 1.5블록 크기).
//   node tools/skins/logos.js
// 옥새 쟁탈전 로고(orb_ambush.png, tools/skins/orb.js)와 같은 '인장 액자' 틀에 게임마다 오방색 한 가지씩:
//   자격루 복원전 contraption_craft_off.png — 청: 청동 물항아리(파수호)와 물줄기
//   교태전 꽃담 맞추기 grid_wars.png        — 황: 줄눈 사이 다섯 색 꽃전돌
//   태조의 활쏘기 대회 nock_it_off.png      — 녹: 국궁 과녁과 꽂힌 화살
//   6진 망루 공성전 elytra_rumble.png       — 흑(남): 나무 망루, 떨어지는 비격진천뢰, 백두산 불빛
const fs = require("fs"), path = require("path");
const PNG = require("./png");
const { icon } = require("./modelkit");

const OUT = path.join(__dirname, "../../resource_packs/rp0/textures/particle");
const INK = "#2a1d14";
// 액자: 바깥 테 · 밝은 줄 · 안쪽 판 (orb.js의 옥새 로고와 같은 짜임)
function frame([dark, light]) {
  return icon(16, 16).rect(0, 0, 16, 16, dark).rect(1, 1, 14, 14, light).rect(2, 2, 12, 12, dark);
}
// 그림을 따로 그려 윤곽선을 넣은 뒤 액자 위에 얹는다
function compose(fr, draw, { outline = INK, keep = [] } = {}) {
  const art = draw(icon(16, 16));
  art.shade({ outline, keep: new Set(keep) });
  art.px.forEach((r, y) => r.forEach((c, x) => { if (c) fr.set(x, y, c); }));
  return fr;
}
const save = (name, i) => { fs.writeFileSync(path.join(OUT, name), PNG.encode(i.image())); console.log("썼음 textures/particle/" + name); };

// 자격루 복원전: 둥근 청동 항아리, 주둥이, 옆 대롱에서 떨어지는 물줄기
const WATER = "#9fd0f0";
save("contraption_craft_off.png", compose(frame(["#1f3f78", "#4f7fc0"]), i => i
  .ellipse(7.5, 9.5, 4.3, 3.6, "#b9803a").rect(5, 5, 5, 2, "#a36d2c").rect(4, 4, 7, 1, "#c99248")
  .rect(5, 9, 5, 1, "#8f5a22")                                    // 항아리 허리띠
  .rect(11, 8, 2, 1, "#a36d2c")                                    // 물 대롱
  .rect(12, 9, 1, 4, WATER).set(12, 13, "#cfe9fa"), { keep: [WATER, "#cfe9fa"] }));

// 교태전 꽃담 맞추기: 3×3 꽃전돌, 가운데 밝은 꽃점
const TILE = { L: "#5ea818", B: "#2c2e8f", Y: "#f0af15", R: "#8e2020", M: "#a9309f" };
const LAYOUT = ["LBY", "RML", "BYR"];
const g = frame(["#8a6410", "#e6be4a"]).rect(2, 2, 12, 12, "#efe6cf");     // 줄눈(회반죽)
LAYOUT.forEach((row, ty) => [...row].forEach((k, tx) => {
  const x = 2 + tx * 4, y = 2 + ty * 4;
  g.rect(x, y, 3, 3, TILE[k]).set(x + 1, y + 1, "#fff3c8");
}));
save("grid_wars.png", g);

// 태조의 활쏘기 대회: 국궁 과녁(붉은 테 · 흰 바탕 · 검은 관 · 붉은 홍심)과 오른쪽 위에서 날아와 꽂힌 화살
save("nock_it_off.png", compose(frame(["#2f5a28", "#6fa04a"]), i => i
  .rect(3, 3, 10, 10, "#c8372d").rect(4, 4, 8, 8, "#f4ecd8").rect(5, 5, 6, 6, INK).rect(7, 7, 2, 2, "#c8372d")
  .line(13, 2, 8, 7, "#8a5a33")                                     // 화살대
  .set(13, 1, "#f4ecd8").set(14, 2, "#f4ecd8").set(14, 1, "#c8372d"),  // 깃
{ keep: [INK, "#c8372d", "#f4ecd8"] }));

// 6진 망루 공성전: 기둥 둘 · 난간 · 망루 방 · 지붕, 오른쪽 위에서 심지 타는 비격진천뢰, 바닥의 용암 불빛
const WOOD = "#8a4a2a", ROOF = "#3a2c22", IRON = "#5a5d64", FIRE = "#e8622c";
save("elytra_rumble.png", compose(frame(["#1d2433", "#46557a"]), i => i
  .rect(2, 13, 12, 1, FIRE).rect(4, 12, 8, 1, "#f0a040")           // 불빛
  .rect(4, 8, 1, 4, WOOD).rect(9, 8, 1, 4, WOOD).rect(3, 7, 8, 1, "#a35a32")
  .rect(4, 5, 6, 2, "#b3683a").set(6, 5, ROOF).set(7, 5, ROOF)      // 망루 방과 창
  .rect(3, 4, 8, 1, ROOF).rect(4, 3, 6, 1, ROOF)                   // 지붕
  .ellipse(12, 7, 2.3, 2.3, IRON).set(11, 6, "#8a8d94")             // 비격진천뢰(남색 바탕에 보이게 밝은 쇠빛)
  .set(12, 4, "#c9a45a").set(13, 3, "#f6c84a").set(13, 2, FIRE),    // 심지와 불꽃
{ keep: [FIRE, "#f0a040", "#f6c84a"] }));
