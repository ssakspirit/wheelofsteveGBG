// Run inside Blockbench (desktop): opens an NPC model with its texture and, if tools/skins/<id>.js exists, paints it.
// mode: 'view' = open the current texture as is, 'paint' = paint in Blockbench only, 'save' = paint and write the PNG.
// Usage (Blockbench MCP risky_eval): (0, eval)(require('fs').readFileSync('<repo>/tools/skins/run-npc.bb.js', 'utf8'))(require, '<repo>/', 'npc_3', 'paint')
(async function (require, ROOT, id, mode = 'paint') {
  const fs = require('fs');
  const RP = ROOT + 'resource_packs/rp0/', GEO = RP + 'models/entity/npc/' + id + '.geo.json', PNG = RP + 'textures/rwm/entity/npc/' + id + '.png';
  for (const pr of ModelProject.all.slice()) { pr.saved = true; await pr.close(true); }
  loadModelFile({ path: GEO, name: id + '.geo.json', content: fs.readFileSync(GEO, 'utf8') });
  for (const t of Texture.all.slice()) t.remove(true);

  let url = 'data:image/png;base64,' + fs.readFileSync(PNG).toString('base64'), painted = 0;
  if (mode !== 'view') {
    const P = (0, eval)(fs.readFileSync(ROOT + 'tools/skins/' + id + '.js', 'utf8'));
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const ctx = c.getContext('2d');
    P.forEach((col, i) => { if (col) { ctx.fillStyle = col; ctx.fillRect(i % 64, Math.floor(i / 64), 1, 1); } });
    url = c.toDataURL('image/png');
    painted = P.filter(Boolean).length;
    if (mode === 'save') fs.writeFileSync(PNG, Buffer.from(url.split(',')[1], 'base64'));
  }
  new Texture({ name: id + '.png' }).fromDataURL(url).add(false);
  Project.saved = true;
  return { id, mode, cubes: Cube.all.length, painted };
})
