## Seq for Spinning the Wheel and starting a wheel minigame
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 02 run inputpermission set @a[tag=!admin] movement disabled

## Cutscene
execute if score .seq global matches 01 run hud @a hide
execute if score .seq global matches 01 run camera @a clear
execute if score .seq global matches 02 run camera @a fade time 0.1 1 1

###Cutscene
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 20 run /camera @a set minecraft:free pos 1.0 62.5 1018.3 rot 5 0
execute if score .seq global matches 21 run /camera @a set minecraft:free ease 10 in_out_quad pos 1.0 64.4 1018.9 rot 21 0
## Cutscene changes depending on selected game
execute if score .wheelgame global matches 1 run execute if score .seq global matches 221 run /camera @a set minecraft:free ease 5 in_out_quad pos 1.0 65.7 1043.2 rot 9 0
execute if score .wheelgame global matches 2 run execute if score .seq global matches 221 run /camera @a set minecraft:free ease 5 in_out_quad pos -9.0 65.7 1041.2 rot 9 10
execute if score .wheelgame global matches 3 run execute if score .seq global matches 221 run /camera @a set minecraft:free ease 5 in_out_quad pos -19.0 65.7 1039.2 rot 9 20
execute if score .wheelgame global matches 4 run execute if score .seq global matches 221 run /camera @a set minecraft:free ease 5 in_out_quad pos 11.0 65.7 1041.2 rot 9 -10
execute if score .wheelgame global matches 5 run execute if score .seq global matches 221 run /camera @a set minecraft:free ease 5 in_out_quad pos 21.0 65.7 1039.2 rot 9 -20
execute if score .seq global matches 301 run camera @a fade time 1 3 1
execute if score .seq global matches 321 run /inputpermission set @s movement enabled
##Cutscene Ends at 321

###Across Cutscenes
execute if score .wheelgame global matches 1 run execute if score .seq global matches 40 run playanimation @e[type=rwm:wheel_of_steve] animation.wheel_of_steve.spin_1 
execute if score .wheelgame global matches 2 run execute if score .seq global matches 40 run playanimation @e[type=rwm:wheel_of_steve] animation.wheel_of_steve.spin_2 
execute if score .wheelgame global matches 3 run execute if score .seq global matches 40 run playanimation @e[type=rwm:wheel_of_steve] animation.wheel_of_steve.spin_5 
execute if score .wheelgame global matches 4 run execute if score .seq global matches 40 run playanimation @e[type=rwm:wheel_of_steve] animation.wheel_of_steve.spin_4 
execute if score .wheelgame global matches 5 run execute if score .seq global matches 40 run playanimation @e[type=rwm:wheel_of_steve] animation.wheel_of_steve.spin_3 

###Sounds
execute if score .seq global matches 50..120 run execute if score .tick global matches 1 run playsound mob.irongolem.hit @a 1 62 1021 1 4.5
execute if score .seq global matches 50..120 run execute if score .tick global matches 6 run playsound mob.irongolem.hit @a 1 62 1021 1 4.5
execute if score .seq global matches 50..120 run execute if score .tick global matches 11 run playsound mob.irongolem.hit @a 1 62 1021 1 4.5
execute if score .seq global matches 50..120 run execute if score .tick global matches 16 run playsound mob.irongolem.hit @a 1 62 1021 1 4.5
execute if score .seq global matches 130 run playsound mob.irongolem.hit @a 1 62 1021 1 4.0
execute if score .seq global matches 140 run playsound mob.irongolem.hit @a 1 62 1021 1 3.5
execute if score .seq global matches 150 run summon minecraft:fireworks_rocket 2 60 1022
execute if score .seq global matches 150 run summon minecraft:fireworks_rocket -1 60 1022
execute if score .seq global matches 170 run execute if score .wheelgame global matches 1 run scoreboard players set .actionbar.objective global 20
execute if score .seq global matches 170 run execute if score .wheelgame global matches 2 run scoreboard players set .actionbar.objective global 22
execute if score .seq global matches 170 run execute if score .wheelgame global matches 3 run scoreboard players set .actionbar.objective global 23
execute if score .seq global matches 170 run execute if score .wheelgame global matches 4 run scoreboard players set .actionbar.objective global 21
execute if score .seq global matches 170 run execute if score .wheelgame global matches 5 run scoreboard players set .actionbar.objective global 24
### Done with Cutscenes
execute if score .seq global matches 300 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 340 run camera @a set minecraft:first_person
execute if score .seq global matches 345 run camera @a clear
execute if score .seq global matches 345 run hud @a reset

# Finished, Setup for next act
execute if score .wheelgame global matches 1 run execute if score .seq global matches 350 run function utility/games/orb/game_start
execute if score .wheelgame global matches 2 run execute if score .seq global matches 350 run function utility/games/craft/game_start
execute if score .wheelgame global matches 3 run execute if score .seq global matches 350 run function utility/games/grid/game_start
execute if score .wheelgame global matches 4 run execute if score .seq global matches 350 run function utility/games/nock/game_start
execute if score .wheelgame global matches 5 run execute if score .seq global matches 350 run function utility/games/elytra/game_start

execute if score .seq global matches 350 run function loops/new_act