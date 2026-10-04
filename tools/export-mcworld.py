"""배포용 .mcworld — 게임에 필요한 파일만 담는다 (작업 폴더의 .git·tools·개발자 페이지는 빼고).

  python tools/export-mcworld.py [출력 경로]     (기본: 바탕 화면의 '경복궁 어전대회.mcworld')
월드를 닫은 뒤 실행한다. 게임이 종료하며 world_icon.jpeg를 화면 캡처로 바꿨으면 먼저 git checkout world_icon.jpeg.
"""
import os, sys, zipfile
ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
FILES = ["level.dat", "level.dat_old", "levelname.txt", "world_icon.jpeg", "world_behavior_packs.json", "world_resource_packs.json", "education.json"]
DIRS = ["db", "texts", "behavior_packs", "resource_packs"]
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.expanduser("~"), "Desktop", "경복궁 어전대회.mcworld")
n = raw = 0
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for f in FILES:
        p = os.path.join(ROOT, f)
        if os.path.exists(p): z.write(p, f); n += 1; raw += os.path.getsize(p)
    for d in DIRS:
        for dp, dn, fn in os.walk(os.path.join(ROOT, d)):
            for f in fn:
                p = os.path.join(dp, f); z.write(p, os.path.relpath(p, ROOT).replace("\\", "/")); n += 1; raw += os.path.getsize(p)
with zipfile.ZipFile(out) as z: assert z.testzip() is None
print(f"파일 {n}개, {raw / 1e6:.1f}MB → {out} ({os.path.getsize(out) / 1e6:.1f}MB)")
