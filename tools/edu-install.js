// 설치된 Education의 resource_packs 폴더를 찾는다. 없거나 못 찾으면 null.
// WindowsApps 폴더 목록은 권한 때문에 못 읽고, 폴더 이름에 버전이 들어가 업데이트 때마다 바뀌므로 윈도우에 설치 위치를 물어본다.
const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
function eduResourcePacks() {
  try {
    const out = execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "(Get-AppxPackage Microsoft.MinecraftEducationEdition).InstallLocation"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 30000 });
    for (const loc of out.split(/\r?\n/).map(s => s.trim()).filter(Boolean)) {
      const r = path.join(loc, "data/resource_packs");
      if (fs.existsSync(path.join(r, "vanilla"))) return r;
    }
  } catch {}
  return null;
}
module.exports = { eduResourcePacks };
