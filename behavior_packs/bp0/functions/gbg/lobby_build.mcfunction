## [경복궁] 로비 섬에 광화문·궁궐 놓기 — python tools/gbg-lobby.py 가 만든 파일 (손으로 고치지 않는다).
## 구조물은 그 자리가 불러와져 있을 때만 놓인다: /function gbg/go_1 ~ go_4 로 섬 네 귀퉁이 하늘에 가서 그때마다 이 함수를 실행한다.
## 여러 번 실행해도 같다. 되돌리기는 월드를 닫고 git의 db/ 로 (또는 --restore 로 만든 gbg/lobby_restore).
structure load gbg:new_1_1 -192 49 860
structure load gbg:new_1_2 -128 49 860
structure load gbg:new_1_3 -64 51 860
structure load gbg:new_1_4 0 54 860
structure load gbg:new_1_5 64 59 860
structure load gbg:new_1_6 128 59 858
structure load gbg:new_2_1 -192 49 920
structure load gbg:new_2_2 -128 49 920
structure load gbg:new_2_3 -64 51 920
structure load gbg:new_2_4 0 54 920
structure load gbg:new_2_5 64 59 920
structure load gbg:new_2_6 128 59 920
structure load gbg:new_3_1 -192 51 984
structure load gbg:new_3_2 -128 59 984
structure load gbg:new_3_3 -64 59 984
structure load gbg:new_3_4 0 59 984
structure load gbg:new_3_5 64 59 984
structure load gbg:new_3_6 128 59 984
structure load gbg:new_4_1 -192 59 1048
structure load gbg:new_4_2 -128 59 1048
structure load gbg:new_4_3 -64 59 1048
structure load gbg:new_4_4 0 59 1048
structure load gbg:new_4_5 64 59 1048
structure load gbg:new_4_6 128 59 1048
structure load gbg:new_5_1 -192 59 1112
structure load gbg:new_5_2 -128 59 1112
structure load gbg:new_5_3 -64 59 1112
structure load gbg:new_5_4 0 59 1112
structure load gbg:new_5_5 64 59 1112
structure load gbg:new_5_6 128 59 1112
structure load gbg:new_6_1 -192 59 1176
structure load gbg:new_6_2 -128 59 1176
structure load gbg:new_6_3 -64 59 1176
structure load gbg:new_6_4 0 59 1176
structure load gbg:new_6_5 64 59 1176
structure load gbg:new_6_6 128 59 1176
structure load gbg:new_7_1 -192 59 1240
structure load gbg:new_7_2 -128 59 1240
structure load gbg:new_7_3 -64 59 1240
structure load gbg:new_7_4 0 59 1240
structure load gbg:new_7_5 64 59 1240
structure load gbg:new_7_6 128 59 1240
tellraw @s {"rawtext":[{"text":"§a[경복궁] 조각 42개를 불러왔습니다 — 이 둘레만 놓입니다. go_1~go_4 네 곳에서 한 번씩 실행하세요."}]}
