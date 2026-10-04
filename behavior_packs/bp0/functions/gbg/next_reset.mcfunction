## [경복궁] 되풀이 놓기를 처음부터
scoreboard objectives add gbg_step dummy
scoreboard players set .step gbg_step 0
tellraw @s {"rawtext":[{"text":"§e[경복궁] 처음부터 — /function gbg/next"}]}
