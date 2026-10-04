## [경복궁] 되풀이 놓기 — 실행할 때마다 지금 묶음의 조각을 놓고 다음 묶음 하늘로 간다. 이동한 뒤 땅이 다 보이면 다시 실행한다 (34번 + 처음 1번).
## 처음부터 다시: /function gbg/next_reset. 묶음 하나만 다시: /function gbg/go_N → /function gbg/build_N
scoreboard objectives add gbg_step dummy
scoreboard players add .step gbg_step 0
execute if score .step gbg_step matches 1 run function gbg/build_1
execute if score .step gbg_step matches 2 run function gbg/build_2
execute if score .step gbg_step matches 3 run function gbg/build_3
execute if score .step gbg_step matches 4 run function gbg/build_4
execute if score .step gbg_step matches 5 run function gbg/build_5
execute if score .step gbg_step matches 6 run function gbg/build_6
execute if score .step gbg_step matches 7 run function gbg/build_7
execute if score .step gbg_step matches 8 run function gbg/build_8
execute if score .step gbg_step matches 9 run function gbg/build_9
execute if score .step gbg_step matches 10 run function gbg/build_10
execute if score .step gbg_step matches 11 run function gbg/build_11
execute if score .step gbg_step matches 12 run function gbg/build_12
execute if score .step gbg_step matches 13 run function gbg/build_13
execute if score .step gbg_step matches 14 run function gbg/build_14
execute if score .step gbg_step matches 15 run function gbg/build_15
execute if score .step gbg_step matches 16 run function gbg/build_16
execute if score .step gbg_step matches 17 run function gbg/build_17
execute if score .step gbg_step matches 18 run function gbg/build_18
execute if score .step gbg_step matches 19 run function gbg/build_19
execute if score .step gbg_step matches 20 run function gbg/build_20
execute if score .step gbg_step matches 21 run function gbg/build_21
execute if score .step gbg_step matches 22 run function gbg/build_22
execute if score .step gbg_step matches 23 run function gbg/build_23
execute if score .step gbg_step matches 24 run function gbg/build_24
execute if score .step gbg_step matches 25 run function gbg/build_25
execute if score .step gbg_step matches 26 run function gbg/build_26
execute if score .step gbg_step matches 27 run function gbg/build_27
execute if score .step gbg_step matches 28 run function gbg/build_28
execute if score .step gbg_step matches 29 run function gbg/build_29
execute if score .step gbg_step matches 30 run function gbg/build_30
execute if score .step gbg_step matches 31 run function gbg/build_31
execute if score .step gbg_step matches 32 run function gbg/build_32
execute if score .step gbg_step matches 33 run function gbg/build_33
execute if score .step gbg_step matches 34 run function gbg/build_34
scoreboard players add .step gbg_step 1
execute if score .step gbg_step matches 1 run function gbg/go_1
execute if score .step gbg_step matches 2 run function gbg/go_2
execute if score .step gbg_step matches 3 run function gbg/go_3
execute if score .step gbg_step matches 4 run function gbg/go_4
execute if score .step gbg_step matches 5 run function gbg/go_5
execute if score .step gbg_step matches 6 run function gbg/go_6
execute if score .step gbg_step matches 7 run function gbg/go_7
execute if score .step gbg_step matches 8 run function gbg/go_8
execute if score .step gbg_step matches 9 run function gbg/go_9
execute if score .step gbg_step matches 10 run function gbg/go_10
execute if score .step gbg_step matches 11 run function gbg/go_11
execute if score .step gbg_step matches 12 run function gbg/go_12
execute if score .step gbg_step matches 13 run function gbg/go_13
execute if score .step gbg_step matches 14 run function gbg/go_14
execute if score .step gbg_step matches 15 run function gbg/go_15
execute if score .step gbg_step matches 16 run function gbg/go_16
execute if score .step gbg_step matches 17 run function gbg/go_17
execute if score .step gbg_step matches 18 run function gbg/go_18
execute if score .step gbg_step matches 19 run function gbg/go_19
execute if score .step gbg_step matches 20 run function gbg/go_20
execute if score .step gbg_step matches 21 run function gbg/go_21
execute if score .step gbg_step matches 22 run function gbg/go_22
execute if score .step gbg_step matches 23 run function gbg/go_23
execute if score .step gbg_step matches 24 run function gbg/go_24
execute if score .step gbg_step matches 25 run function gbg/go_25
execute if score .step gbg_step matches 26 run function gbg/go_26
execute if score .step gbg_step matches 27 run function gbg/go_27
execute if score .step gbg_step matches 28 run function gbg/go_28
execute if score .step gbg_step matches 29 run function gbg/go_29
execute if score .step gbg_step matches 30 run function gbg/go_30
execute if score .step gbg_step matches 31 run function gbg/go_31
execute if score .step gbg_step matches 32 run function gbg/go_32
execute if score .step gbg_step matches 33 run function gbg/go_33
execute if score .step gbg_step matches 34 run function gbg/go_34
execute if score .step gbg_step matches 35.. run tellraw @s {"rawtext":[{"text":"§a[경복궁] 묶음 34개를 모두 놓았습니다. 월드를 닫고 확인을 맡기세요."}]}
execute if score .step gbg_step matches 35.. run scoreboard players set .step gbg_step 0
