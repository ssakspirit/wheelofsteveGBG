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

const violations = [];

// 1) 규칙 파일 변경 (작업 트리 포함, 기준 ref 대비)
const diff = git(["-c", "core.quotepath=false", "diff", "--name-status", "--no-renames", BASELINE, "--", ...FROZEN]);
for (const line of diff.split("\n").filter(Boolean)) {
  const [status, file] = line.split("\t");
  if (status === "A") continue;
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
  console.log(`규칙 보존 검사 통과 (기준: ${BASELINE})`);
  process.exit(0);
}
console.log(`규칙 보존 검사: 기준(${BASELINE}) 대비 규칙 관련 파일 변경 ${violations.length}건`);
for (const v of violations) console.log("  - " + v);
console.log("의도한 변경이 아니라면 되돌리고, 의도한 변경이라면 사용자 확인 후 커밋하세요.");
process.exit(1);
