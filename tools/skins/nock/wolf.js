// 늑대 자리 → 까치호랑이(호작도)의 민화 호랑이. 새 뼈대·모양은 tiger.js, 동작은 animations/minhwa_tiger.animation.json.
const { tiger } = require("./tiger");

module.exports = {
  key: "wolf", geo: "geometry.target_wolf", tex: "wolf", size: [128, 64],
  build: K => tiger(K, {
    geo: "geometry.target_wolf", s: 1,
    pal: { BASE: "#e39b34", BACK: "#d98a2a", STRIPE: "#2b1f18", WHITE: "#f4ecd8", EYE: "#f6d24a", MOUTH: "#c8443a" },
    bounds: { visible_bounds_width: 3, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] },
  }),
};
