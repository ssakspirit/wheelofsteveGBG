// 박쥐(바닐라 minecraft:bat) → 민화의 붉은 박쥐(홍복 洪福 — '박쥐 복(蝠)'이 '복 복(福)'과 소리가 같아 복을 비는 문양).
// 광차 위 과녁을 맞히면 튀어나오는 박쥐. 바닐라 모델·UV(ref/bat.geo.json, ref/bat.png — 원본 사본)는 그대로 두고
// 색만 바꿔 textures/entity/bat.png를 덮는다 → 월드의 모든 박쥐가 붉은 박쥐가 된다.
// 원본은 갈색 13색: 어두운 순서대로 짙은 적색 → 주홍, 가장 밝은 갈색은 금빛 테, 흰 눈은 그대로.
const RAMP = ["#4a0f0c", "#6a1612", "#86201a", "#a02a20", "#b83426", "#c8402a", "#d4522e", "#e06a34", "#e8843a", "#f0a040", "#f2b64a", "#f6cc5a"];
module.exports = {
  key: "bat", tex: "bat", texDir: "textures/entity", ref: { geo: "ref/bat.geo.json", png: "ref/bat.png" },
  recolor(img, PNG) {
    const lum = ([r, g, b]) => 0.3 * r + 0.59 * g + 0.11 * b;
    const cols = new Map();
    for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
      const p = PNG.get(img, x, y);
      if (p[3] && lum(p) < 200) cols.set(p.slice(0, 3).join(","), lum(p));
    }
    const order = [...cols.entries()].sort((a, b) => a[1] - b[1]).map(e => e[0]);
    const out = PNG.blank(img.width, img.height);
    for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
      const p = PNG.get(img, x, y);
      if (!p[3]) continue;
      const i = order.indexOf(p.slice(0, 3).join(","));
      PNG.put(out, x, y, i < 0 ? "#" + p.slice(0, 3).map(v => v.toString(16).padStart(2, "0")).join("") : RAMP[Math.round(i / Math.max(1, order.length - 1) * (RAMP.length - 1))]);
    }
    return out;
  },
};
