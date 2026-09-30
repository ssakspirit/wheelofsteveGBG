// Run inside Blockbench (desktop) with the wheel model open: paints the 혼천의 texture into Texture.all[0].
// Reads the baseline wheel texture and the current NPC skins; re-skinned hosts get new face icons.
// Usage (Blockbench MCP risky_eval): (0, eval)(require('fs').readFileSync('<repo>/tools/skins/run-wheel.bb.js', 'utf8'))(require, '<repo>/', save)
(async function (require, ROOT, save) {
  const fs = require('fs'), { execFileSync } = require('child_process');
  const git = (...a) => execFileSync('git', a, { cwd: ROOT, maxBuffer: 16 << 20 });
  const baseline = f => git('show', 'baseline-rules:' + f);
  const load = buf => new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, img.width, img.height).data;
      res({ get: (px, py) => { const i = (py * img.width + px) * 4; return [d[i], d[i + 1], d[i + 2], d[i + 3]]; } });
    };
    img.onerror = rej;
    img.src = 'data:image/png;base64,' + buf.toString('base64');
  });
  const hex = p => '#' + p.slice(0, 3).map(v => v.toString(16).padStart(2, '0')).join('');
  const RP = 'resource_packs/rp0/', WHEEL = RP + 'textures/rwm/entity/wheel_of_steve.png';

  const base = await load(baseline(WHEEL));
  const sections = { s1: 'npc_1', s2: 'npc_2', s3: 'npc_3', s4: 'npc_5', s5: 'npc_4' };
  const faces = {}, used = {};
  for (const [s, id] of Object.entries(sections)) {
    const texPath = RP + 'textures/rwm/entity/npc/' + id + '.png';
    const cur = fs.readFileSync(ROOT + texPath);
    if (Buffer.compare(cur, baseline(texPath)) === 0) continue; // host not re-skinned yet: keep the original icon
    const img = await load(cur);
    const geo = JSON.parse(fs.readFileSync(ROOT + RP + 'models/entity/npc/' + id + '.geo.json', 'utf8'));
    const g = geo['geometry.rwm.' + id];
    const bone = n => g.bones.find(b => b.name === n);
    const hc = bone('head').cubes[0], face = [];
    for (let y = 0; y < 8; y++) { face.push([]); for (let x = 0; x < 8; x++) face[y].push(hex(img.get(hc.uv[0] + 8 + x, hc.uv[1] + 8 + y))); }
    const hat = bone('hat')?.cubes?.[0];
    if (hat) {
      const d = hat.size[2];
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const p = img.get(hat.uv[0] + d + x, hat.uv[1] + d + y); if (p[3] > 0) face[y][x] = hex(p); }
    }
    faces[s] = face; used[s] = id;
  }

  const painter = (0, eval)(fs.readFileSync(ROOT + 'tools/skins/wheel.js', 'utf8'));
  const P = painter({ orig: base.get, faces });
  const tex = Texture.all[0];
  tex.edit(canvas => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 128, 256);
    P.forEach((c, i) => { if (c) { ctx.fillStyle = c; ctx.fillRect(i % 128, Math.floor(i / 128), 1, 1); } });
  }, { edit_name: '혼천의' });
  if (save) fs.writeFileSync(ROOT + WHEEL, Buffer.from(tex.canvas.toDataURL('image/png').split(',')[1], 'base64'));
  return { icons: used, painted: P.filter(Boolean).length, saved: !!save };
})
