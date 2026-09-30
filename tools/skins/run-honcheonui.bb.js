// Run inside Blockbench (desktop): opens honcheonui.geo.json, paints its 128x256 texture from tools/skins/honcheonui.js,
// using each host's current skin face for the section medallions, and optionally saves the PNG.
// Usage (Blockbench MCP risky_eval): (0, eval)(require('fs').readFileSync('<repo>/tools/skins/run-honcheonui.bb.js', 'utf8'))(require, '<repo>/', save)
(async function (require, ROOT, save) {
  const fs = require('fs');
  const RP = ROOT + 'resource_packs/rp0/', GEO = RP + 'models/entity/honcheonui.geo.json', PNG = RP + 'textures/rwm/entity/honcheonui.png';
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

  // host faces: head front with the hat overlay on top
  const hosts = { s1: 'npc_1', s2: 'npc_2', s3: 'npc_3', s4: 'npc_5', s5: 'npc_4' }, faces = {};
  for (const [s, id] of Object.entries(hosts)) {
    const img = await load(fs.readFileSync(RP + 'textures/rwm/entity/npc/' + id + '.png'));
    const g = JSON.parse(fs.readFileSync(RP + 'models/entity/npc/' + id + '.geo.json', 'utf8'))['geometry.rwm.' + id];
    const bone = n => g.bones.find(b => b.name === n);
    const hc = bone('head').cubes[0], face = [];
    for (let y = 0; y < 8; y++) { face.push([]); for (let x = 0; x < 8; x++) face[y].push(hex(img.get(hc.uv[0] + 8 + x, hc.uv[1] + 8 + y))); }
    const hat = bone('hat')?.cubes?.[0];
    if (hat) {
      const d = hat.size[2];
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const p = img.get(hat.uv[0] + d + x, hat.uv[1] + d + y); if (p[3] > 0) face[y][x] = hex(p); }
    }
    faces[s] = face;
  }

  const H = (0, eval)(fs.readFileSync(ROOT + 'tools/skins/honcheonui.js', 'utf8'));
  const P = H.paint({ faces });
  const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  P.forEach((c, i) => { if (c) { ctx.fillStyle = c; ctx.fillRect(i % 128, Math.floor(i / 128), 1, 1); } });
  const url = canvas.toDataURL('image/png');

  for (const pr of ModelProject.all.slice()) { pr.saved = true; await pr.close(true); }
  loadModelFile({ path: GEO, name: 'honcheonui.geo.json', content: fs.readFileSync(GEO, 'utf8') });
  for (const t of Texture.all.slice()) t.remove(true);
  new Texture({ name: 'honcheonui.png' }).fromDataURL(url).add(false);
  if (save) fs.writeFileSync(PNG, Buffer.from(url.split(',')[1], 'base64'));
  return { cubes: Cube.all.length, bones: Group.all.length, painted: P.filter(Boolean).length, saved: !!save };
})
