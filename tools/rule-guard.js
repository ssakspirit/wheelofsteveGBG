#!/usr/bin/env node
// 규칙 보존 검사: baseline-rules 태그와 비교해 게임 규칙을 담은 파일이 바뀌었는지 확인한다.
// 사용법: node tools/rule-guard.js [기준 ref]   (기본값: baseline-rules)
// 종료 코드: 0 = 통과, 1 = 규칙 파일 변경 발견, 2 = 검사 실행 오류

const { execFileSync } = require("child_process");
const fs = require("fs");

const BASELINE = process.argv[2] || "baseline-rules";
const BP = "behavior_packs/bp0/";

// 수정·삭제하면 안 되는 경로 (새 파일 추가는 허용)
const FROZEN = [
  "functions/", "entities/", "items/", "loot_tables/", "structures/",
  "animation_controllers/", "animations/", "dialogue/", "scripts/", "dimensions/",
  "manifest.json",
].map(p => BP + p);

// 사용자가 승인한 예외: 원본 파일에 아래 바꿈만 적용한 것과 정확히 같아야 통과한다(다른 곳이 바뀌면 위반).
//   2026-10-19 자격루 적은 인원 방식(act2/201)의 승패 판정: 원작은 >=로 비교해 동점이면 두 승리 함수가 모두 돌아
//   화면은 '청포대 승리'인데 어전대회 1승은 홍포대에 기록됐다 → 다른 게임처럼 > 와 무승부(=)로.
const T1 = '"§4Team 1" score', T2 = '"§9Team 2" score', AT = "execute if score .seq global matches 7210 run execute if score ";
const APPROVED = {
  [BP + "functions/seq/act2/201.mcfunction"]: [
    [`${AT}${T1} >= ${T2} run /function utility/wins/team1`, `${AT}${T1} > ${T2} run /function utility/wins/team1`],
    [`${AT}${T2} >= ${T1} run /function utility/wins/team2`,
     `${AT}${T2} > ${T1} run /function utility/wins/team2\n${AT}${T1} = ${T2} run /function utility/wins/tie`],
  ],
};
//   2026-10-19 배경음악(사용자 승인, 여러 번에 걸쳐 합침): 원작은 `execute as @a run playsound … @a`로 플레이어 수만큼
//   모두에게 겹쳐 틀었고(9명이면 9겹), 한 플레이어 자리(~ ~ ~)에서 볼륨 1로 틀어 16칸 밖은 못 들었으며(자격루·활쏘기·백악산),
//   교태전은 팀원에게만 틀어 관전자가 못 들었다. → 모든 음악을 '한 번만, 모두에게' 튼다:
//   앞의 `/execute as|at @a run`을 빼고, 최소 볼륨을 붙여 거리와 상관없이 들리게(6진 망루는 원래 크기 0.3을 최소 볼륨으로),
//   교태전은 관전자(@a[tag=admin])에게 트는 줄을 더한다.  [진행 지점, 원작 명령(run 뒤), 바뀐 명령들]
const S = v => `execute if score .seq global matches ${v} run `;
const PIG = "playsound record.pigstep @a 0 65 1998", STAL = "playsound record.stal @a ~ ~ ~ 1 1.1", CRE = "playsound record.creator @a[";
const BGM = {
  "act1/101": [740, 2220, 3700].map(v => [v, `/execute as @a run ${PIG} 0.5 2 0.5`, [`${PIG} 0.5 2 0.5`]])
    .concat([[5180, `/execute as @a run ${PIG} 0.55 2 0.5`, [`${PIG} 0.55 2 0.5`]]]),
  "act2/201": [1200, 3900, 6600].map(v => [v, `/execute as @a run ${STAL}`, [`${STAL} 1`]]),
  "act2/202": [2200, 4900, 7600].map(v => [v, `/execute as @a run ${STAL}`, [`${STAL} 1`]]),
  "act3/301": [
    [1160, `/execute as @a run ${CRE}scores={team=1}] -33 90 -97 1 0.56 1`, [`${CRE}scores={team=1}] -33 90 -97 1 0.56 1`]],
    [1160, `/execute as @a run ${CRE}scores={team=2}] -33 90 -97 1 0.56 1`, [`${CRE}scores={team=2}] -33 90 -97 1 0.56 1`, `${CRE}tag=admin] -33 90 -97 1 0.56 1`]],
  ],
  "act4/401": [[600, "/execute as @a run playsound record.wait @a ~ ~ ~ 1 1.25", ["playsound record.wait @a ~ ~ ~ 1 1.25 1"]]],
  "act5/501": [[1160, "/execute at @a run playsound record.otherside @a ~ ~ ~ 0.3 1.3", ["playsound record.otherside @a ~ ~ ~ 0.3 1.3 0.3"]],
               [4160, "/execute at @a run playsound record.otherside @a ~ ~ ~ 0.3 1.2", ["playsound record.otherside @a ~ ~ ~ 0.3 1.2 0.3"]]],
  "act6/601": [[1000, "/execute as @a run /playsound record.precipice @a ~ ~ ~ 0.5 1.25", ["playsound record.precipice @a ~ ~ ~ 0.5 1.25 1"]]],
};
for (const [f, rows] of Object.entries(BGM))
  (APPROVED[`${BP}functions/seq/${f}.mcfunction`] ||= []).push(...rows.map(([v, from, to]) => [S(v) + from + "\n", to.map(t => S(v) + t).join("\n") + "\n"]));
function approvedOk(file) {
  const lf = s => s.replace(/\r\n/g, "\n");
  let want = lf(git(["show", `${BASELINE}:${file}`]));
  for (const [from, to] of APPROVED[file]) {
    if (want.split(from).length !== 2) return false;   // 원본에 정확히 한 번 있어야 한다
    want = want.replace(from, to);
  }
  return want === lf(fs.readFileSync(file, "utf8"));
}

// 안개는 색만 바꿀 수 있고 거리값은 규칙(시야)에 영향을 준다
const FOG_DIR = "resource_packs/rp0/fogs/";

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

const root = git(["rev-parse", "--show-toplevel"]).trim();
process.chdir(root);

try {
  git(["rev-parse", "--verify", "--quiet", BASELINE + "^{commit}"]);
} catch {
  console.error(`기준 ref '${BASELINE}'를 찾을 수 없습니다. (git fetch --tags 필요?)`);
  process.exit(2);
}

const violations = [], approvedSeen = [];

// 1) 규칙 파일 변경 (작업 트리 포함, 기준 ref 대비)
const diff = git(["-c", "core.quotepath=false", "diff", "--name-status", "--no-renames", BASELINE, "--", ...FROZEN]);
for (const line of diff.split("\n").filter(Boolean)) {
  const [status, file] = line.split("\t");
  if (status === "A") continue;
  if (status === "M" && APPROVED[file]) {
    if (approvedOk(file)) { approvedSeen.push(file); continue; }
    violations.push(`승인된 예외와 다르게 수정됨: ${file}`);
    continue;
  }
  const label = status === "D" ? "삭제됨" : "수정됨";
  violations.push(`${label}: ${file}`);
}

// 2) 안개 거리값 변경
function stripColor(o) {
  if (Array.isArray(o)) return o.map(stripColor);
  if (o && typeof o === "object") {
    const r = {};
    for (const [k, v] of Object.entries(o)) if (k !== "fog_color") r[k] = stripColor(v);
    return r;
  }
  return o;
}
function parseJson(text) {
  return JSON.parse(text.replace(/^\s*\/\/.*$/gm, ""));
}
const baseFogs = git(["ls-tree", "--name-only", BASELINE, FOG_DIR]).split("\n").filter(f => f.endsWith(".json"));
for (const f of baseFogs) {
  if (!fs.existsSync(f)) { violations.push(`삭제됨: ${f}`); continue; }
  try {
    const before = JSON.stringify(stripColor(parseJson(git(["show", `${BASELINE}:${f}`]))));
    const after = JSON.stringify(stripColor(parseJson(fs.readFileSync(f, "utf8"))));
    if (before !== after) violations.push(`안개 거리값 변경: ${f} (fog_color 외 값이 바뀜)`);
  } catch (e) {
    violations.push(`읽기 실패: ${f} (${e.message})`);
  }
}

if (violations.length === 0) {
  console.log(`규칙 보존 검사 통과 (기준: ${BASELINE})` + (approvedSeen.length ? ` — 승인된 예외 ${approvedSeen.length}건: ${approvedSeen.join(", ")}` : ""));
  process.exit(0);
}
console.log(`규칙 보존 검사: 기준(${BASELINE}) 대비 규칙 관련 파일 변경 ${violations.length}건`);
for (const v of violations) console.log("  - " + v);
console.log("의도한 변경이 아니라면 되돌리고, 의도한 변경이라면 사용자 확인 후 커밋하세요.");
process.exit(1);
