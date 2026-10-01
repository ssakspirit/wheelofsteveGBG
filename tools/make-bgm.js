// 게임 배경음악 만들기: 음원에서 구간을 잘라, 게임이 바꿔 트는 배속(pitch)을 미리 되돌린 OGG로 저장한다.
//   node tools/make-bgm.js <음원.wav> [<둘째 음원.wav>] <시작 초> --game <게임> [--preview 미리듣기.wav]
// 게임(BP라 고칠 수 없음)은 바닐라 음반 소리를 pitch만큼 빠르게(느리게) 튼다. 그래서 구간을 그 배속만큼 늘려(줄여) 저장한다
// → 게임에서는 원래 빠르기와 음높이로 들린다. 음원을 둘 주면 4초 겹쳐 이어 붙인 뒤 자른다(곡 하나로 모자랄 때).
// 소리 이름은 RP sound_definitions.json에서 sounds/rwm/<게임>_bgm.ogg를 가리킨다.
// ffmpeg: pip install imageio-ffmpeg
const { execFileSync } = require("child_process"), path = require("path");

// len = 게임 안에서 들리는 길이(초). 근거는 각 seq 파일의 playsound·stopsound 시점
const GAMES = {
  orb: { sound: "record.pigstep", len: 74, pitch: 2 },          // act1/101: 74초마다 다시 튼다
  craft: { sound: "record.stal", len: 135, pitch: 1.1 },        // act2/201·202: 135초마다 다시 튼다
  grid: { sound: "record.creator", len: 306, pitch: 0.56 },     // act3/301: 한 번, 경기(1160~7280) 내내
  nock: { sound: "record.wait", len: 190, pitch: 1.25 },        // act4/401: 한 번(600~), 원래 음반 길이만큼
  elytra: { sound: "record.otherside", len: 155, pitch: 1.25 }, // act5/501: 1.3배속(1160~, 150초 뒤 다시) → 1.2배속(4160~7360)
  //   한 파일을 두 배속으로 트므로 가운데 1.25로 맞춘다: 1.3배속이면 149초(다음 재생 전에 끝남), 1.2배속이면 161초
  finale: { sound: "record.precipice", len: 82, pitch: 1.25 },  // act6/601: 1000~2640(stopsound)
};
const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : null; };
const game = opt("--game") || "orb", preview = opt("--preview"), G = GAMES[game];
const start = args.pop(), srcs = args;
if (!srcs.length || srcs.length > 2 || isNaN(+start) || !G) {
  console.error("사용법: node tools/make-bgm.js <음원> [<둘째 음원>] <시작 초> --game " + Object.keys(GAMES).join("|") + " [--preview 파일.wav]");
  process.exit(1);
}
const ff = execFileSync("python", ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"], { encoding: "utf8" }).trim();
const out = path.join(__dirname, "../resource_packs/rp0/sounds/rwm", game + "_bgm.ogg");
const FADE = 2.5, rate = Math.round(48000 / G.pitch);
const joined = srcs.length === 2 ? "[0:a][1:a]acrossfade=d=4:c1=tri:c2=tri[j];[j]" : "[0:a]";
const filter = `${joined}aresample=48000,atrim=start=${start}:duration=${G.len},asetpts=PTS-STARTPTS,`
  + `afade=t=in:d=0.02,afade=t=out:st=${G.len - FADE}:d=${FADE},asetrate=${rate},aresample=44100[o]`;  // 48k로 맞춘 뒤 1/pitch 배속
execFileSync(ff, ["-hide_banner", "-loglevel", "error", "-y", ...srcs.flatMap(s => ["-i", s]),
  "-filter_complex", filter, "-map", "[o]", "-c:a", "libvorbis", "-q:a", "6", out]);
console.log("썼음", path.relative(process.cwd(), out), `(${G.sound}, 게임에서 ${G.len}초, pitch ${G.pitch})`);

if (preview) { // 게임처럼 pitch 배속으로 되돌린 미리듣기
  execFileSync(ff, ["-hide_banner", "-loglevel", "error", "-y", "-i", out, "-af", `asetrate=${Math.round(44100 * G.pitch)},aresample=44100`, preview]);
  console.log("미리듣기", preview);
}
