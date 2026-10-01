// 민화 호랑이 — 늑대 자리(호랑이)와 북극곰 자리(백호)가 함께 쓰는 새 뼈대·모양.
// 옛 늑대·북극곰 뼈대를 따르지 않고 새로 짠다. 움직임은 새 애니메이션(animations/minhwa_tiger.animation.json)이 맡고,
// nock_prop.rp.e.json의 idle_wolf·reward_wolf·idle_polarbear·reward_polarbear가 그 애니메이션을 가리킨다.
// 뼈대: root → tiger(통째로 들썩) → body(엉덩이) → chest(가슴) → head(머리) → jaw(턱)·ear_left·ear_right
//       다리 4개(front_*: 가슴, back_*: 엉덩이), 꼬리 4마디(tail1 → tail4, S자로 말려 올라감)
// 회전 부호(Bedrock): x+ = 앞을 향한 것은 아래로, 뒤를 향한 것은 위로 / y = 좌우로 돌기
const { INK, flat, stripes, art, mats } = require("./minhwa");

function tiger(K, { geo, s = 1, pal, bounds }) {
  const { BASE, BACK, STRIPE, WHITE, EYE, MOUTH } = pal;
  const v = a => a.map(n => Math.round(n * s * 1000) / 1000);     // 좌표·크기를 s배
  mats(K, {
    side: stripes(BASE, STRIPE, { every: 4, width: 1, axis: "x", wave: true }),
    top: stripes(BACK, STRIPE, { every: 4, width: 1, axis: "y", wave: true }),
    belly: flat(WHITE),
    end: stripes(BASE, STRIPE, { every: 3, width: 1, axis: "y" }),
    leg: stripes(BASE, STRIPE, { every: 3, width: 1, axis: "y" }),
    paw: art(["BBBBB", "BBBBB", "BKBKB"], { B: WHITE, K: STRIPE }, flat(WHITE)),
    pawTop: flat(WHITE),
    // 민화 호랑이 얼굴: 이마 무늬, 흰 테 두른 노란 눈과 먹 눈동자, 흰 볼
    face: art([
      "OOKOKKOKOO",
      "OOOKOOKOOO",
      "OWWWOOWWWO",
      "OYPYOOYPYO",
      "OWWWOOWWWO",
      "OOOOKKOOOO",
      "WOOOOOOOOW",
      "WWOOOOOOWW",
      "WWWOOOOWWW",
    ], { O: BASE, K: STRIPE, W: WHITE, Y: EYE, P: INK }),
    skullSide: stripes(BASE, STRIPE, { every: 3, width: 1, axis: "y" }),
    skullTop: stripes(BACK, STRIPE, { every: 3, width: 1, axis: "x" }),
    ruff: (x, y, w, h) => (y < 1 ? BASE : x % 3 === 1 && y > 1 ? "#e8dfcc" : WHITE),   // 흰 볼털과 수염결
    muzzle: art(["WKKKW", "WWKWW", "WKWKW"], { W: WHITE, K: STRIPE }),
    muzzleSide: flat(WHITE),
    jaw: art(["TRRRT", "RRRRR"], { T: WHITE, R: MOUTH }),
    jawSide: flat(WHITE),
    ear: art(["OOO", "OWO", "OWO"], { O: BASE, W: WHITE }),
    earBack: art(["KKK", "KWK", "KKK"], { K: STRIPE, W: WHITE }),
    tailSide: stripes(BASE, STRIPE, { every: 2, width: 1, axis: "x" }),
    tailTop: stripes(BASE, STRIPE, { every: 2, width: 1, axis: "y" }),
    tip: flat(STRIPE),
  });
  const m = K.model(geo, bounds);
  const B = (name, parent, pivot, rotation) => m.bone(name, { parent, pivot: v(pivot), rotation });
  const C = (bone, o, sz, mt) => m.cube(bone, v(o), v(sz), mt);
  B("root", null, [0, 0, 0]); B("tiger", "root", [0, 0, 0]);
  B("body", "tiger", [0, 11, 6]); B("chest", "body", [0, 11, 1]);
  B("head", "chest", [0, 15, -8]); B("jaw", "head", [0, 11.5, -15]);
  B("ear_left", "head", [3.5, 19, -12]); B("ear_right", "head", [-3.5, 19, -12]);
  B("front_left_leg", "chest", [3, 9, -5]); B("front_right_leg", "chest", [-3, 9, -5]);
  B("back_left_leg", "body", [3, 10, 7]); B("back_right_leg", "body", [-3, 10, 7]);
  B("tail1", "body", [0, 13, 11], [25, 0, 0]); B("tail2", "tail1", [0, 13, 16], [30, 0, 0]);
  B("tail3", "tail2", [0, 13, 20], [30, 0, 0]); B("tail4", "tail3", [0, 13, 24], [-45, 0, 0]);

  const bodyMat = { all: "side", up: "top", down: "belly", north: "end", south: "end" };
  C("body", [-4.5, 7, 1], [9, 8, 10], bodyMat);                                     // 엉덩이
  C("chest", [-5, 6.5, -9], [10, 9.5, 10], bodyMat);                                // 가슴(어깨가 조금 높다)
  C("head", [-5, 11, -16], [10, 9, 8], { all: "skullSide", north: "face", up: "skullTop", down: "belly" });
  C("head", [-6, 10, -14], [12, 5, 4], { all: "ruff", up: "skullSide" });          // 볼털
  C("head", [-2.5, 11.5, -18.5], [5, 3, 2.5], { all: "muzzleSide", north: "muzzle" }); // 주둥이
  C("jaw", [-2.5, 10, -18.5], [5, 1.5, 3.5], { all: "jawSide", north: "jaw", up: "jaw" });
  C("ear_left", [2, 19, -12.5], [3, 3, 1], { all: "earBack", north: "ear" });
  C("ear_right", [-5, 19, -12.5], [3, 3, 1], { all: "earBack", north: "ear" });
  for (const [b, x, z] of [["front_left_leg", 1.5, -7.5], ["front_right_leg", -5, -7.5], ["back_left_leg", 1.5, 4.5], ["back_right_leg", -5, 4.5]]) {
    C(b, [x, 2, z], [3.5, 8, 3.5], { all: "leg", down: "pawTop" });
    C(b, [x - 0.25, 0, z - 1], [4, 2.5, 4.5], { all: "pawTop", north: "paw" });     // 큼직한 앞발
  }
  const tail = { all: "tailSide", up: "tailTop", down: "tailTop", north: "tip", south: "tip" };
  C("tail1", [-1, 12, 11], [2, 2, 5], tail); C("tail2", [-1, 12, 16], [2, 2, 4], tail);
  C("tail3", [-1, 12, 20], [2, 2, 4], tail); C("tail4", [-1.25, 11.75, 24], [2.5, 2.5, 3], "tip");
  return m;
}
module.exports = { tiger };
