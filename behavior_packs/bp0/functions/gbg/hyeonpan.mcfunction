## [경복궁] 근정전·광화문 양털 현판 앞에 한글 현판을 건다 — python tools/skins/hyeonpan.py 가 만든 파일.
## 다시 실행하면 있던 현판을 치우고 새로 건다. 근처(로비)에 서서 실행한다.
kill @e[type=gbg:hyeonpan_geunjeongjeon]
summon gbg:hyeonpan_geunjeongjeon 1.5 78 1084.96 180 0
kill @e[type=gbg:hyeonpan_gwanghwamun]
summon gbg:hyeonpan_gwanghwamun 1.5 77 996.96 180 0
tellraw @s {"rawtext":[{"text":"§a[경복궁] 근정전·광화문 현판을 걸었습니다."}]}
