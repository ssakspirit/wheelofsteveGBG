// Run inside Blockbench (desktop): opens any RP model with a texture to check it (nothing is written).
// Usage (Blockbench MCP risky_eval): (0, eval)(require('fs').readFileSync('<repo>/tools/skins/view.bb.js', 'utf8'))(require, '<repo>/', 'models/entity/orb.geo.json', 'textures/rwm/entity/orb.png')
(async function (require, ROOT, geoRel, pngRel) {
  const fs = require('fs'), RP = ROOT + 'resource_packs/rp0/', GEO = RP + geoRel, PNG = RP + pngRel;
  for (const pr of ModelProject.all.slice()) { pr.saved = true; await pr.close(true); }
  loadModelFile({ path: GEO, name: geoRel.split('/').pop(), content: fs.readFileSync(GEO, 'utf8') });
  for (const t of Texture.all.slice()) t.remove(true);
  new Texture({ name: pngRel.split('/').pop() }).fromDataURL('data:image/png;base64,' + fs.readFileSync(PNG).toString('base64')).add(false);
  Project.saved = true;
  return { geo: geoRel, cubes: Cube.all.length, bones: Group.all.map(g => g.name) };
})
