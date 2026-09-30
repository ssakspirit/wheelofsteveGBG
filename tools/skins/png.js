// 아주 작은 PNG 읽기/쓰기 (8비트 RGBA·RGB·회색·팔레트, 비월 없음). 외부 패키지 없이 zlib만 쓴다.
const zlib = require("zlib");

const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = buf => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

// img = { width, height, data: Uint8Array(width*height*4) }
function encode(img) {
  const { width: w, height: h, data } = img;
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) Buffer.from(data.buffer, data.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

function decode(buf) {
  let p = 8, w, h, depth, type, plte = null, trns = null; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), t = buf.toString("ascii", p + 4, p + 8), d = buf.slice(p + 8, p + 8 + len);
    if (t === "IHDR") { w = d.readUInt32BE(0); h = d.readUInt32BE(4); depth = d[8]; type = d[9]; if (d[12]) throw new Error("interlaced PNG not supported"); }
    else if (t === "PLTE") plte = d; else if (t === "tRNS") trns = d; else if (t === "IDAT") idat.push(d);
    p += 12 + len;
  }
  if (depth !== 8) throw new Error("only 8-bit PNG supported");
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[type], bpl = w * ch, raw = zlib.inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(bpl * h);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (bpl + 1)], src = raw.slice(y * (bpl + 1) + 1, (y + 1) * (bpl + 1)), o = y * bpl;
    for (let x = 0; x < bpl; x++) {
      const a = x >= ch ? px[o + x - ch] : 0, b = y ? px[o - bpl + x] : 0, c = x >= ch && y ? px[o - bpl + x - ch] : 0;
      let v = src[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      px[o + x] = v & 255;
    }
  }
  const data = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const s = i * ch;
    if (type === 6) data.set(px.slice(s, s + 4), i * 4);
    else if (type === 2) { data.set(px.slice(s, s + 3), i * 4); data[i * 4 + 3] = 255; }
    else if (type === 0) { data.fill(px[s], i * 4, i * 4 + 3); data[i * 4 + 3] = 255; }
    else if (type === 4) { data.fill(px[s], i * 4, i * 4 + 3); data[i * 4 + 3] = px[s + 1]; }
    else { const k = px[s]; data.set(plte.slice(k * 3, k * 3 + 3), i * 4); data[i * 4 + 3] = trns && k < trns.length ? trns[k] : 255; }
  }
  return { width: w, height: h, data };
}

// 편의 함수: 빈 그림, 색 칠하기('#rrggbb' 또는 null), 그림 붙이기
const blank = (width, height) => ({ width, height, data: new Uint8Array(width * height * 4) });
function put(img, x, y, c) {
  if (x < 0 || y < 0 || x >= img.width || y >= img.height) return;
  const i = (y * img.width + x) * 4;
  if (c == null) { img.data.fill(0, i, i + 4); return; }
  const n = parseInt(c.slice(1, 7), 16);
  img.data[i] = n >> 16; img.data[i + 1] = (n >> 8) & 255; img.data[i + 2] = n & 255; img.data[i + 3] = c.length > 7 ? parseInt(c.slice(7, 9), 16) : 255;
}
function get(img, x, y) { const i = (y * img.width + x) * 4; return [...img.data.slice(i, i + 4)]; }
function paste(dst, src, dx, dy, { alpha = true } = {}) {
  for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) {
    const s = get(src, x, y);
    if (alpha && s[3] === 0) continue;
    const X = dx + x, Y = dy + y;
    if (X < 0 || Y < 0 || X >= dst.width || Y >= dst.height) continue;
    dst.data.set(s, (Y * dst.width + X) * 4);
  }
}

module.exports = { encode, decode, blank, put, get, paste };
