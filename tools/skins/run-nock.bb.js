// Run inside Blockbench (desktop): builds one 활쏘기장 동물 (tools/skins/nock/<key>.js) as a Blockbench project — model and painted texture.
// mode: 'view' = build and show only, 'save' = also export the model through Blockbench's Bedrock codec, write the texture(s),
//       and keep the project as tools/skins/nock/bbmodel/<key>.bbmodel (open it in Blockbench to tweak by hand).
// Usage (Blockbench MCP risky_eval): (0, eval)(require('fs').readFileSync('<repo>/tools/skins/run-nock.bb.js', 'utf8'))(require, '<repo>/', 'wolf', 'view')
(async function (require, ROOT, key, mode = 'view') {
  const fs = require('fs'), path = require('path');
  const SK = path.join(ROOT, 'tools/skins'), RP = path.join(ROOT, 'resource_packs/rp0');
  // Blockbench의 require는 기본 모듈(fs, path, zlib)만 연다 → tools/skins의 파일은 이 작은 로더로 읽는다 (매번 새로 읽어 고친 내용이 바로 반영된다)
  const cache = {};
  const load = file => {
    if (!file.endsWith('.js')) file += '.js';
    if (cache[file]) return cache[file].exports;
    const module = cache[file] = { exports: {} };
    const req = p => (p.startsWith('.') ? load(path.resolve(path.dirname(file), p)) : require(p));
    new Function('require', 'module', 'exports', '__dirname', fs.readFileSync(file, 'utf8'))(req, module, module.exports, path.dirname(file));
    return module.exports;
  };
  const M = load(path.join(SK, 'nock/minhwa.js'));
  const spec = load(path.join(SK, 'nock', key + '.js'));
  // ref: 바닐라 모델은 그대로 두고 텍스처 색만 바꾸는 경우(박쥐) — 모델은 보기만 하고 쓰지 않는다
  let built, geoFile = null;
  if (spec.ref) {
    const PNG = load(path.join(SK, 'png.js')), dir = path.join(SK, 'nock');
    const img = spec.recolor(PNG.decode(fs.readFileSync(path.join(dir, spec.ref.png))), PNG);
    built = [{ tex: spec.tex, geo: JSON.parse(fs.readFileSync(path.join(dir, spec.ref.geo), 'utf8')), png: PNG.encode(img), used: { rows: img.height, height: img.height } }];
  } else {
    built = M.make(spec);
    geoFile = path.join(RP, spec.dir || 'models/entity/target_mobs', spec.geo.replace(/^geometry\.(rwm\.)?/, '') + '.geo.json');
  }
  const texFile = t => path.join(RP, spec.texDir || 'textures/rwm/entity/target_mobs', t + '.png');

  for (const pr of ModelProject.all.slice()) { pr.saved = true; await pr.close(true); }
  const name = geoFile ? path.basename(geoFile) : key + '.geo.json';
  loadModelFile({ path: geoFile || path.join(SK, 'nock', spec.ref.geo), name, content: JSON.stringify(built[0].geo) });
  for (const t of Texture.all.slice()) t.remove(true);
  for (const b of built) new Texture({ name: b.tex + '.png' }).fromDataURL('data:image/png;base64,' + b.png.toString('base64')).add(false);
  Texture.all[0].select();

  const out = { key, geo: spec.geo, cubes: Cube.all.length, bones: Group.all.map(g => g.name), textures: built.map(b => b.tex + ' ' + b.used.rows + '/' + b.used.height) };
  if (mode === 'save') {
    if (geoFile) fs.writeFileSync(geoFile, Codecs.bedrock.compile());
    for (const b of built) { fs.mkdirSync(path.dirname(texFile(b.tex)), { recursive: true }); fs.writeFileSync(texFile(b.tex), b.png); }
    fs.mkdirSync(path.join(SK, 'nock/bbmodel'), { recursive: true });
    fs.writeFileSync(path.join(SK, 'nock/bbmodel', key + '.bbmodel'), Codecs.project.compile());
    out.saved = [...(geoFile ? [path.relative(ROOT, geoFile)] : []), ...built.map(b => path.relative(ROOT, texFile(b.tex)))];
  }
  Project.saved = true;
  return out;
})
