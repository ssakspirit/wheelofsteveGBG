## [경복궁] 팀 선택 홀 시작 버튼(금 블록 -45 66 1018) 위에 어전대회 포스터 액자를 건다 — 장식 엔티티 gbg:poster (폭 6칸, 광장 쪽 +X를 본다).
## 다시 실행하면 있던 액자를 치우고 새로 건다. 위치를 바꾸려면 아래 summon 좌표만 고친다. 그림은 python tools/skins/poster-frame.py
kill @e[type=gbg:poster]
summon gbg:poster -44.5 67.2 1018.5 -90 0
tellraw @s {"rawtext":[{"text":"§a[경복궁] 시작 버튼 위에 포스터를 걸었습니다."}]}
