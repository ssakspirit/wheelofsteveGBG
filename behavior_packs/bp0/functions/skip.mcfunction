## /function skip — 지금 나오는 장면을 건너뛴다. 운영자면 누구나, 어전대회·연습 경기 모두.
##   경기 설명(인트로) → 3·2·1 카운트다운부터 / 팀을 정한 뒤 나오는 로비 소개(혼천의·다섯 대결) → 로비로
## 자동 생성(tools/gen-dev.js). 게임 파일은 고치지 않고, 그 장면 동안 실행될 명령을 순서대로 한꺼번에 실행할 뿐이다.
scoreboard players set .play_ok global 0
execute if score .act global matches 1 if score .seq global matches 1483..2379 run scoreboard players set .play_ok global 1
execute if score .act global matches 1 if score .seq global matches ..1482 run tellraw @s {"rawtext":[{"text":"§e[진행] §f로비 소개는 팀을 고르고 시작 버튼을 누른 뒤 나오는 장면에서 건너뛸 수 있어요."}]}
execute if score .act global matches 1 if score .seq global matches ..1482 run scoreboard players set .play_ok global 2
execute if score .act global matches 200 run scoreboard players set .play_ok global 1
execute if score .act global matches 101 if score .seq global matches ..639 run scoreboard players set .play_ok global 1
execute if score .act global matches 201 if score .seq global matches ..1139 run scoreboard players set .play_ok global 1
execute if score .act global matches 202 if score .seq global matches ..2139 run scoreboard players set .play_ok global 1
execute if score .act global matches 301 if score .seq global matches ..1099 run scoreboard players set .play_ok global 1
execute if score .act global matches 401 if score .seq global matches ..539 run scoreboard players set .play_ok global 1
execute if score .act global matches 501 if score .seq global matches ..1099 run scoreboard players set .play_ok global 1
execute if score .act global matches 601 if score .seq global matches ..939 run scoreboard players set .play_ok global 1
execute if score .play_ok global matches 0 run tellraw @s {"rawtext":[{"text":"§e[진행] §f지금은 건너뛸 장면이 없습니다. (경기 설명이나 팀을 정한 뒤의 로비 소개 동안에만 쓸 수 있어요)"}]}
scoreboard players set .dev_wait global 0
execute if score .act global matches 200 run scoreboard players set .dev_wait global 1
execute if score .act global matches 101 if score .seq global matches ..59 run scoreboard players set .dev_wait global 1
execute if score .act global matches 201 if score .seq global matches ..59 run scoreboard players set .dev_wait global 1
execute if score .act global matches 202 if score .seq global matches ..59 run scoreboard players set .dev_wait global 1
execute if score .act global matches 301 if score .seq global matches ..59 run scoreboard players set .dev_wait global 1
execute if score .act global matches 401 if score .seq global matches ..59 run scoreboard players set .dev_wait global 1
execute if score .act global matches 501 if score .seq global matches ..59 run scoreboard players set .dev_wait global 1
execute if score .act global matches 601 if score .seq global matches ..59 run scoreboard players set .dev_wait global 1
execute if score .act global matches 301 if score .seq global matches 20..39 run scoreboard players set .dev_wait global 1
execute if score .act global matches 301 if score .seq global matches 100..299 run scoreboard players set .dev_wait global 1
execute if score .act global matches 301 if score .seq global matches 880..899 run scoreboard players set .dev_wait global 1
execute if score .dev_wait global matches 1 run tellraw @s {"rawtext":[{"text":"§e[진행] §f지금은 준비 중이라 건너뛸 수 없습니다. 몇 초 뒤 다시 해 보세요."}]}
execute if score .play_ok global matches 1 if score .dev_wait global matches 0 run function dev/_play/skip
