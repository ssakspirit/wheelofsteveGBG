// 북극곰 자리 → 신선도의 백호. 호랑이(tiger.js)와 같은 새 뼈대를 1.3배로, 흰 바탕에 먹 줄무늬.
// 동작도 호랑이와 같다(animations/minhwa_tiger.animation.json).
const { tiger } = require("./tiger");

module.exports = {
  key: "polarbear", geo: "geometry.target_polarbear", tex: "polar_bear", size: [128, 64],
  build: K => tiger(K, {
    geo: "geometry.target_polarbear", s: 1.3,
    pal: { BASE: "#f2eee4", BACK: "#e6e1d6", STRIPE: "#34343d", WHITE: "#fbf9f3", EYE: "#8cc4e8", MOUTH: "#c8443a" },
    bounds: { visible_bounds_width: 4, visible_bounds_height: 3.5, visible_bounds_offset: [0, 1.25, 0] },
  }),
};
