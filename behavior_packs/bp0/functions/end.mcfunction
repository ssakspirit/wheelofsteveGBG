## /function end — 진행 중인 경기를 무승부로 끝낸다(승리 기록 없음). 운영자면 누구나, 어전대회·연습 경기 모두. 백악산은 제외.
## 자동 생성(tools/gen-dev.js). 게임 파일은 고치지 않는다. 판정은 게임 자신의 판정 지점에서 원래 명령으로 한다.
scoreboard players set .play_ok global 0
execute if score .act global matches 200 run scoreboard players set .play_ok global 1
execute if score .act global matches 101 if score .seq global matches ..6699 run scoreboard players set .play_ok global 1
execute if score .act global matches 201 if score .seq global matches ..7199 run scoreboard players set .play_ok global 1
execute if score .act global matches 202 if score .seq global matches ..8199 run scoreboard players set .play_ok global 1
execute if score .act global matches 301 if score .seq global matches ..7279 run scoreboard players set .play_ok global 1
execute if score .act global matches 401 if score .seq global matches ..4159 run scoreboard players set .play_ok global 1
execute if score .act global matches 501 if score .seq global matches ..7279 run scoreboard players set .play_ok global 1
execute if score .act global matches 601 run tellraw @s {"rawtext":[{"text":"§e[진행] §f백악산 엽전 달리기는 팀 경기가 아니라 무승부로 끝낼 수 없습니다."}]}
execute unless score .act global matches 601 if score .play_ok global matches 0 run tellraw @s {"rawtext":[{"text":"§e[진행] §f지금은 끝낼 경기가 없습니다. (경기 설명이나 경기 중에만 쓸 수 있어요)"}]}
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
execute if score .dev_wait global matches 1 run tellraw @s {"rawtext":[{"text":"§e[진행] §f지금은 준비 중이라 끝낼 수 없습니다. 몇 초 뒤 다시 해 보세요."}]}
execute if score .play_ok global matches 1 if score .dev_wait global matches 0 run function dev/_play/end
