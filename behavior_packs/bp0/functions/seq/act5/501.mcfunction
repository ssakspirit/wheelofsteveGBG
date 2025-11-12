## Seq for Game 5 (Elytra Rumble) (Act501)
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 00 run scoreboard players set .subtitle.objective global 0
execute if score .seq global matches 01 run /function utility/games/elytra/game_reset
execute if score .seq global matches 02 run inputpermission set @a[tag=!admin] movement disabled
execute if score .seq global matches 02 run /function utility/fogs/g5_fog
execute if score .seq global matches 40 run /function utility/tickingarea_remove

## Cutscene
execute if score .seq global matches 01 run hud @a hide
execute if score .seq global matches 01 run camera @a clear
execute if score .seq global matches 02 run camera @a fade time 0.1 2 1


## Team 1 Cutscene
execute if score .seq global matches 20 run /camera @a[scores={team=1}] set minecraft:free pos -129 166.1 5088.0 rot 17 90
execute if score .seq global matches 21 run /camera @a[scores={team=1}] set minecraft:free ease 15 in_out_quad pos -105 166.1 5088.0 rot 17 90
execute if score .seq global matches 321 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -73 109.2 5046.0 rot 19 152
execute if score .seq global matches 521 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -71.6 123.0 5083 rot 38 -70
execute if score .seq global matches 721 run /camera @a[scores={team=1}] set minecraft:free ease 15 in_out_quad pos -52.6 103 5090.0 rot 87 -62

## Admin Observer Cutscene (follows Team 1)
execute if score .seq global matches 20 run /camera @a[tag=admin] set minecraft:free pos -129 166.1 5088.0 rot 17 90
execute if score .seq global matches 21 run /camera @a[tag=admin] set minecraft:free ease 15 in_out_quad pos -105 166.1 5088.0 rot 17 90
execute if score .seq global matches 321 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -73 109.2 5046.0 rot 19 152
execute if score .seq global matches 521 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -71.6 123.0 5083 rot 38 -70
execute if score .seq global matches 721 run /camera @a[tag=admin] set minecraft:free ease 15 in_out_quad pos -52.6 103 5090.0 rot 87 -62

## Team 2 Cutscene
execute if score .seq global matches 20 run /camera @a[scores={team=2}] set minecraft:free pos -30 166.1 5088.0 rot 17 -90
execute if score .seq global matches 21 run /camera @a[scores={team=2}] set minecraft:free ease 15 in_out_quad pos -50 166.1 5088.0 rot 17 -90
execute if score .seq global matches 321 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos -85 112.5 5136 rot 22 -23
execute if score .seq global matches 521 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos -93 123 5091 rot 47 116
execute if score .seq global matches 721 run /camera @a[scores={team=2}] set minecraft:free ease 15 in_out_quad pos -106 103 5086 rot 84 48


##Across both Team Cutscenes
##Actionbar
execute if score .seq global matches 20 run scoreboard players set .actionbar.objective global 501
execute if score .seq global matches 100 run scoreboard players set .actionbar.objective global 502
execute if score .seq global matches 220 run scoreboard players set .actionbar.objective global 503
execute if score .seq global matches 340 run scoreboard players set .actionbar.objective global 504
execute if score .seq global matches 440 run scoreboard players set .actionbar.objective global 505
execute if score .seq global matches 660 run scoreboard players set .actionbar.objective global 506
execute if score .seq global matches 800 run scoreboard players set .actionbar.objective global 507
execute if score .seq global matches 900 run scoreboard players set .actionbar.objective global 508

#Events in the cutscene
execute if score .seq global matches 100..600 run function utility/games/elytra/bomb_score_test
execute if score .seq global matches 700 run summon rwm:elytra_bomb -105 125 5087 ~ ~ rwm:elytra_bomb_explode
execute if score .seq global matches 700 run summon rwm:elytra_bomb -56 125 5088 ~ ~ rwm:elytra_bomb_explode

### Done with Cutscenes
execute if score .seq global matches 1030 run camera @a fade time 1 2 1
execute if score .seq global matches 1060 run camera @a set minecraft:first_person
execute if score .seq global matches 1061 run camera @a clear
execute if score .seq global matches 1060 run hud @a reset
execute if score .seq global matches 1060 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 1062 run camera @a set minecraft:third_person
execute if score .seq global matches 1062 run hud @a hide paperdoll


### Start Countdown
execute if score .seq global matches 1100 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.1"}]}
execute if score .seq global matches 1100 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.0
execute if score .seq global matches 1120 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.2"}]}
execute if score .seq global matches 1120 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.1
execute if score .seq global matches 1140 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.3"}]}
execute if score .seq global matches 1140 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.2
execute if score .seq global matches 1160 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.4"}]}
execute if score .seq global matches 1160 run scoreboard players set .actionbar.objective global 509
execute if score .seq global matches 1160 run /execute at @a run /playsound horn.call.0 @a ~ ~ ~ 1 2.0

#Displayed Scoreboard
execute if score .seq global matches 02 run scoreboard objectives setdisplay sidebar
execute if score .seq global matches 1160 run scoreboard objectives add score dummy §6§lScore
execute if score .seq global matches 1160 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 1160 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 1160 run scoreboard players set "§eTime Remaining: " score 306
execute if score .seq global matches 1160..7280 run execute if score .tick global matches 1 run execute if score "§eTime Remaining: " score matches 1..6120 run scoreboard players add "§eTime Remaining: " score -1
execute if score .seq global matches 1160 run scoreboard objectives setdisplay sidebar score

### At game start (Difference Old 700 New 1160)
### execute if score .seq global matches 1160 run summon rwm:timer -81 68 5087 0 0 rwm:timer_elytra
execute if score .seq global matches 1160 run /execute at @a run playsound record.otherside @a ~ ~ ~ 0.3 1.3
execute if score .seq global matches 1160 run inputpermission set @a movement enabled
execute if score .seq global matches 1160 run inputpermission set @a camera enabled
execute if score .seq global matches 4160 run /execute at @a run playsound record.otherside @a ~ ~ ~ 0.3 1.2

### Active till Game Over
execute if score .seq global matches 1160..7280 run function utility/games/elytra/bomb_score_test
execute if score .tick10 global matches 1 run execute if score .seq global matches 1160..7280 run scoreboard players set .actionbar.objective global 509
execute if score .tick10 global matches 101 run execute if score .seq global matches 1160..7280 run scoreboard players set .actionbar.objective global 510


###Singleplayer Scoring
execute if score .game_mode global matches 1 run execute if score .seq global matches 1880 run execute unless entity @a[scores={team=1}] run function utility/games/elytra/team1_score
execute if score .game_mode global matches 1 run execute if score .seq global matches 1880 run execute unless entity @a[scores={team=2}] run function utility/games/elytra/team2_score

execute if score .game_mode global matches 1 run execute if score .seq global matches 2480 run execute unless entity @a[scores={team=1}] run function utility/games/elytra/team1_score
execute if score .game_mode global matches 1 run execute if score .seq global matches 2480 run execute unless entity @a[scores={team=2}] run function utility/games/elytra/team2_score

execute if score .game_mode global matches 1 run execute if score .seq global matches 3080 run execute unless entity @a[scores={team=1}] run function utility/games/elytra/team1_score
execute if score .game_mode global matches 1 run execute if score .seq global matches 3080 run execute unless entity @a[scores={team=2}] run function utility/games/elytra/team2_score

execute if score .game_mode global matches 1 run execute if score .seq global matches 3680 run execute unless entity @a[scores={team=1}] run function utility/games/elytra/team1_score
execute if score .game_mode global matches 1 run execute if score .seq global matches 3680 run execute unless entity @a[scores={team=2}] run function utility/games/elytra/team2_score

execute if score .game_mode global matches 1 run execute if score .seq global matches 4280 run execute unless entity @a[scores={team=1}] run function utility/games/elytra/team1_score
execute if score .game_mode global matches 1 run execute if score .seq global matches 4280 run execute unless entity @a[scores={team=2}] run function utility/games/elytra/team2_score

execute if score .game_mode global matches 1 run execute if score .seq global matches 4880 run execute unless entity @a[scores={team=1}] run function utility/games/elytra/team1_score
execute if score .game_mode global matches 1 run execute if score .seq global matches 4880 run execute unless entity @a[scores={team=2}] run function utility/games/elytra/team2_score

execute if score .game_mode global matches 1 run execute if score .seq global matches 5480 run execute unless entity @a[scores={team=1}] run function utility/games/elytra/team1_score
execute if score .game_mode global matches 1 run execute if score .seq global matches 5480 run execute unless entity @a[scores={team=2}] run function utility/games/elytra/team2_score

execute if score .game_mode global matches 1 run execute if score .seq global matches 6080 run execute unless entity @a[scores={team=1}] run function utility/games/elytra/team1_score
execute if score .game_mode global matches 1 run execute if score .seq global matches 6080 run execute unless entity @a[scores={team=2}] run function utility/games/elytra/team2_score

execute if score .game_mode global matches 1 run execute if score .seq global matches 6680 run execute unless entity @a[scores={team=1}] run function utility/games/elytra/team1_score
execute if score .game_mode global matches 1 run execute if score .seq global matches 6680 run execute unless entity @a[scores={team=2}] run function utility/games/elytra/team2_score

execute if score .game_mode global matches 1 run execute if score .seq global matches 7270 run execute unless entity @a[scores={team=1}] run function utility/games/elytra/team1_score
execute if score .game_mode global matches 1 run execute if score .seq global matches 7270 run execute unless entity @a[scores={team=2}] run function utility/games/elytra/team2_score

execute if score .seq global matches 1160..7280 run execute if score "§4Team 1" score matches 10 run scoreboard players set .seq global 7280
execute if score .seq global matches 1160..7280 run execute if score "§9Team 2" score matches 10 run scoreboard players set .seq global 7280

### Game Over
execute if score .seq global matches 7280 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 7280 run scoreboard players reset "§eTime Remaining: " score

### Who Wins?
execute if score .seq global matches 7290 run execute if score "§4Team 1" score > "§9Team 2" score run /function utility/wins/team1
execute if score .seq global matches 7290 run execute if score "§9Team 2" score > "§4Team 1" score run /function utility/wins/team2
execute if score .seq global matches 7290 run execute if score "§4Team 1" score = "§9Team 2" score run /function utility/wins/tie

execute if score .seq global matches 7290 run scoreboard players set .subtitle.objective global 0
execute if score .seq global matches 7290 run kill @e[type=rwm:elytra_bomb] 
execute if score .seq global matches 7290 run kill @e[type=rwm:elytra_ring] 
### Return to Lobby
execute if score .seq global matches 7360 run function utility/lobby/return_to_lobby
execute if score .seq global matches 7360 run stopsound @a
execute if score .seq global matches 7360 run clear @a fireworks
execute if score .seq global matches 7360 run clear @a elytra
execute if score .seq global matches 7360 run hud @a reset
execute if score .seq global matches 7360 run effect @a[tag=admin] clear
execute if score .seq global matches 7360 run replaceitem entity @a[tag=admin] slot.armor.head 0 golden_helmet 1 0 {"item_lock": {"mode": "lock_in_slot"}}
execute if score .seq global matches 7360 run replaceitem entity @a[tag=admin] slot.armor.chest 0 golden_chestplate 1 0 {"item_lock": {"mode": "lock_in_slot"}}
execute if score .seq global matches 7360 run replaceitem entity @a[tag=admin] slot.armor.legs 0 golden_leggings 1 0 {"item_lock": {"mode": "lock_in_slot"}}
execute if score .seq global matches 7360 run replaceitem entity @a[tag=admin] slot.armor.feet 0 golden_boots 1 0 {"item_lock": {"mode": "lock_in_slot"}}
execute if score .seq global matches 7360 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 7360 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 7360 run tag @a remove elytra_player
execute if score .seq global matches 7360 run camera @a clear
execute if score .seq global matches 7360 run inputpermission set @a camera enabled
execute if score .seq global matches 7360 run scoreboard players reset "§eTime Remaining: " score

# Finished, Setup for next act
execute if score .seq global matches 7380 run /function utility/tickingarea_add
execute if score .seq global matches 7380 run scoreboard players set .act global 0
execute if score .seq global matches 7380 run function loops/new_act