## Seq for Game 1 (Orb Ambush) (Act101)
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 00 run scoreboard players set .subtitle.objective global 0
execute if score .seq global matches 40 run /function utility/tickingarea_remove
execute if score .seq global matches 20 run /function utility/games/orb/game_reset
execute if score .seq global matches 02 run inputpermission set @a[tag=!admin] movement disabled
execute if score .seq global matches 02 run /function utility/fogs/g1_fog
execute if score .seq global matches 02 run /tag @e remove orb_flag_holder_cooldown
execute if score .seq global matches 02 run scoreboard objectives remove orb_cooldown

## Contain Orb Enemies during cutscene
execute if score .seq global matches 03..700 run tp @e[type=rwm:orb_enemy,scores={team=1}] 0 62 1974
execute if score .seq global matches 03..700 run tp @e[type=rwm:orb_enemy,scores={team=2}] 0 62 2022

## Cutscene
execute if score .seq global matches 01 run hud @a hide
execute if score .seq global matches 01 run camera @a clear
execute if score .seq global matches 02 run camera @a fade time 0.1 2 1

### Team 1 Cutscene
#### Shot 1
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 20 run /camera @a[scores={team=1}] set minecraft:free pos -5 66 1973 rot 17 -32
execute if score .seq global matches 21 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos 0.5 68.4 1986 rot 15 0
execute if score .seq global matches 200 run camera @a[scores={team=1}] fade time 0.5 1 0.5
#### Shot 2
execute if score .seq global matches 219 run /camera @a[scores={team=1}] set minecraft:free pos 0.5 68 2004.5 facing 0 66 1998
execute if score .seq global matches 220 run /camera @a[scores={team=1}] set minecraft:free ease 3 in_out_quad pos 5.5 68 1998.5 facing 0 66 1998 
execute if score .seq global matches 280 run /camera @a[scores={team=1}] set minecraft:free ease 3 in_out_quad pos 0.5 68 1993.5 facing 0 66 1998
execute if score .seq global matches 340 run /camera @a[scores={team=1}] set minecraft:free ease 3 in_out_quad pos -5.0 68 1998.5 facing 0 66 1998
execute if score .seq global matches 400 run /camera @a[scores={team=1}] set minecraft:free ease 3 in_out_quad pos 0.5 68 2004.5 facing 0 66 1998
#### Shot 3
execute if score .seq global matches 460 run /camera @a[scores={team=1}] set minecraft:free ease 7 in_out_quad pos 0.5 64.3 1980 facing 0 62 1974

### Admin Observer Cutscene (follows Team 1)
execute if score .seq global matches 20 run /camera @a[tag=admin] set minecraft:free pos -5 66 1973 rot 17 -32
execute if score .seq global matches 21 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos 0.5 68.4 1986 rot 15 0
execute if score .seq global matches 200 run camera @a[tag=admin] fade time 0.5 1 0.5
execute if score .seq global matches 219 run /camera @a[tag=admin] set minecraft:free pos 0.5 68 2004.5 facing 0 66 1998
execute if score .seq global matches 220 run /camera @a[tag=admin] set minecraft:free ease 3 in_out_quad pos 5.5 68 1998.5 facing 0 66 1998 
execute if score .seq global matches 280 run /camera @a[tag=admin] set minecraft:free ease 3 in_out_quad pos 0.5 68 1993.5 facing 0 66 1998
execute if score .seq global matches 340 run /camera @a[tag=admin] set minecraft:free ease 3 in_out_quad pos -5.0 68 1998.5 facing 0 66 1998
execute if score .seq global matches 400 run /camera @a[tag=admin] set minecraft:free ease 3 in_out_quad pos 0.5 68 2004.5 facing 0 66 1998
execute if score .seq global matches 460 run /camera @a[tag=admin] set minecraft:free ease 7 in_out_quad pos 0.5 64.3 1980 facing 0 62 1974

### Team 2 Cutscene
execute if score .seq global matches 20 run /camera @a[scores={team=2}] set minecraft:free pos 5 66 2022 rot 19 130
execute if score .seq global matches 21 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 0.5 68.4 2017 rot 15 180
#### Shot 2
execute if score .seq global matches 219 run /camera @a[scores={team=2}] set minecraft:free pos 0.5 68 1993.5 facing 0 66 1998
execute if score .seq global matches 220 run /camera @a[scores={team=2}] set minecraft:free ease 3 in_out_quad pos -5.0 68 1998.5 facing 0 66 1998 
execute if score .seq global matches 280 run /camera @a[scores={team=2}] set minecraft:free ease 3 in_out_quad pos 0.5 68 2004.5 facing 0 66 1998
execute if score .seq global matches 340 run /camera @a[scores={team=2}] set minecraft:free ease 3 in_out_quad pos 5.5 68 1998.5 facing 0 66 1998
execute if score .seq global matches 400 run /camera @a[scores={team=2}] set minecraft:free ease 3 in_out_quad pos 0.5 68 1993.5 facing 0 66 1998
#### Shot 3
execute if score .seq global matches 460 run /camera @a[scores={team=2}] set minecraft:free ease 7 in_out_quad pos 0.5 64.3 2016 facing 0 62 2022

###Across both Cutscenes
execute if score .seq global matches 20 run scoreboard players set .actionbar.objective global 101
execute if score .seq global matches 140 run scoreboard players set .actionbar.objective global 102
execute if score .seq global matches 400 run scoreboard players set .actionbar.objective global 103
execute if score .seq global matches 520 run scoreboard players set .actionbar.objective global 104
### Done with Cutscenes
execute if score .seq global matches 580 run camera @a[scores={team=1}] fade time 0.5 1 0.5
execute if score .seq global matches 600 run camera @a set minecraft:first_person
execute if score .seq global matches 601 run camera @a clear
execute if score .seq global matches 600 run hud @a reset
execute if score .seq global matches 600 run scoreboard players set .actionbar.objective global 0

### Start Countdown
execute if score .seq global matches 640 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.1"}]}
execute if score .seq global matches 640 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.0
execute if score .seq global matches 660 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.2"}]}
execute if score .seq global matches 660 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.1
execute if score .seq global matches 680 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.3"}]}
execute if score .seq global matches 680 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.2
execute if score .seq global matches 700 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.4"}]}
execute if score .seq global matches 700 run scoreboard players set .actionbar.objective global 105
execute if score .seq global matches 700 run /execute at @a run /playsound horn.call.0 @a ~ ~ ~ 1 2.0

#Displayed Scoreboard
execute if score .seq global matches 02 run scoreboard objectives setdisplay sidebar
execute if score .seq global matches 700 run scoreboard objectives add score dummy §6§lScore
execute if score .seq global matches 700 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 700 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 700 run scoreboard objectives setdisplay sidebar score

### At game start
execute if score .seq global matches 700 run summon rwm:timer 0 90 1998 0 0 rwm:timer_orb
execute if score .seq global matches 700 run inputpermission set @a movement enabled
execute if score .seq global matches 740 run /execute as @a run playsound record.pigstep @a 0 65 1998 0.5 2 0.5
execute if score .seq global matches 2220 run /execute as @a run playsound record.pigstep @a 0 65 1998 0.5 2 0.5
execute if score .seq global matches 3700 run /execute as @a run playsound record.pigstep @a 0 65 1998 0.5 2 0.5
execute if score .seq global matches 5180 run /execute as @a run playsound record.pigstep @a 0 65 1998 0.55 2 0.5

###Across whole game
execute if score .seq global matches 680 run scoreboard objectives add orb_cooldown dummy orb_cooldown
execute if score .seq global matches 700..6820 run scoreboard players add @e[tag=orb_flag_holder_cooldown] orb_cooldown 1
execute if score .seq global matches 700..6820 run tag @e[tag=orb_flag_holder_cooldown,scores={orb_cooldown=60..}] remove orb_flag_holder_cooldown
execute if score .seq global matches 700..6820 run scoreboard players reset @e[scores={orb_cooldown=60..}] orb_cooldown
execute if score .seq global matches 700..6820 run execute if score .tick global matches 1 run execute at @e[type=rwm:orb_flag,tag=!held] run particle rwm:rainbow ~ ~ ~

### Game Over
execute if score .seq global matches 6820 run tag @a remove orb_flag_holder
execute if score .seq global matches 6820 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 6700 run kill @e[type=rwm:timer]
execute if score .seq global matches 6700 run tp @e[type=rwm:orb_flag] 0 -256 0
execute if score .seq global matches 6700 run tp @e[type=rwm:orb_enemy] 0 -256 0
execute if score .seq global matches 6705 run kill @e[type=rwm:orb_flag]
execute if score .seq global matches 6705 run kill @e[type=rwm:orb_enemy]

### Who Wins?
execute if score .seq global matches 6720 run execute if score "§4Team 1" score > "§9Team 2" score run /function utility/wins/team1
execute if score .seq global matches 6720 run execute if score "§9Team 2" score > "§4Team 1" score run /function utility/wins/team2
execute if score .seq global matches 6720 run execute if score "§4Team 1" score = "§9Team 2" score run /function utility/wins/tie
execute if score .seq global matches 6820 run stopsound @a 
execute if score .seq global matches 6820 run scoreboard players set .subtitle.objective global 0
### Return to Lobby
execute if score .seq global matches 6820 run function utility/lobby/return_to_lobby
execute if score .seq global matches 6820 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 6820 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 6820 run event entity @a rwm:orb_seat_remove
execute if score .seq global matches 6820 run tag @a remove orb_player

# Finished, Setup for next act
execute if score .seq global matches 6840 run /function utility/tickingarea_add
execute if score .seq global matches 6840 run scoreboard players set .act global 0
execute if score .seq global matches 6840 run function loops/new_act