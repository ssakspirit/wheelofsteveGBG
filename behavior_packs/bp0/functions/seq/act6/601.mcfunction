## Seq for Final Showdown (Act601)
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 00 run scoreboard players set .subtitle.objective global 0
execute if score .seq global matches 02 run inputpermission set @a[tag=!admin] movement disabled
execute if score .seq global matches 02 run inputpermission set @a camera disabled
execute if score .seq global matches 02 run /function utility/fogs/g6_fog
execute if score .seq global matches 20 run /function utility/games/final/game_reset
execute if score .seq global matches 40 run /function utility/tickingarea_remove
execute if score .seq global matches 40 run tickingarea add circle 1 -55 5968 4 finale_ending

## Cutscene
execute if score .seq global matches 01 run kill @e[type=item]
execute if score .seq global matches 01 run hud @a hide
execute if score .seq global matches 01 run camera @a clear
execute if score .seq global matches 02 run camera @a fade time 0.1 2 1
execute if score .seq global matches 20 run kill @e[type=item]

execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 20 run /camera @a set minecraft:free pos 1.0 230 6173 rot -26 0
execute if score .seq global matches 21 run /camera @a set minecraft:free ease 35 in_out_quad pos 1.0 306 6218 rot 17 0
execute if score .seq global matches 721 run /camera @a set minecraft:free ease 10 in_out_quad pos 1.0 305 6224 rot 6 0
execute if score .seq global matches 900 run camera @a fade time 0.5 1 0.5
execute if score .seq global matches 915 run /camera @a set minecraft:free pos 1.0 309.0 6220.0 rot 27 0

## Admin Observer Cutscene (follows Team 1)
execute if score .seq global matches 20 run /camera @a[tag=admin] set minecraft:free pos 1.0 230 6173 rot -26 0
execute if score .seq global matches 21 run /camera @a[tag=admin] set minecraft:free ease 35 in_out_quad pos 1.0 306 6218 rot 17 0
execute if score .seq global matches 721 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos 1.0 305 6224 rot 6 0
execute if score .seq global matches 900 run camera @a[tag=admin] fade time 0.5 1 0.5
execute if score .seq global matches 915 run /camera @a[tag=admin] set minecraft:free pos 1.0 309.0 6220.0 rot 27 0

###Across both Cutscenes

execute if score .seq global matches 40 run execute if score .team1wins global > .team2wins global run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.1000.3"}]}
execute if score .seq global matches 40 run execute if score .team2wins global > .team1wins global run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.1000.4"}]}
execute if score .seq global matches 40 run /execute at @a run /playsound horn.call.2 @a ~ ~ ~ 1 1.5

execute if score .seq global matches 120 run scoreboard players set .actionbar.objective global 601
execute if score .seq global matches 260 run scoreboard players set .actionbar.objective global 602
execute if score .seq global matches 430 run scoreboard players set .actionbar.objective global 603
execute if score .seq global matches 600 run scoreboard players set .actionbar.objective global 604
##execute if score .seq global matches 520 run scoreboard players set .actionbar.objective global 605
##execute if score .seq global matches 660 run scoreboard players set .actionbar.objective global 606
execute if score .seq global matches 820 run scoreboard players set .actionbar.objective global 607


### Done with Intro Cutscenes

### Game Cutscene
execute if score .seq global matches 900 run scoreboard players set .actionbar.objective global 608

#elimination zone setup
execute if score .seq global matches 900 run summon rwm:final_marker 1.0 333 6246 
execute if score .seq global matches 900 run tag @e[type=rwm:final_marker,x=1,y=333,z=6246,r=3] add elim_zone_top
execute if score .seq global matches 900 run summon rwm:final_marker 1.0 301 6223
execute if score .seq global matches 900 run tag @e[type=rwm:final_marker,x=1,y=301,z=6223,r=3] add elim_zone_bottom

### Start Countdown
execute if score .seq global matches 940 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.1"}]}
execute if score .seq global matches 940 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.0
execute if score .seq global matches 960 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.2"}]}
execute if score .seq global matches 960 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.1
execute if score .seq global matches 980 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.3"}]}
execute if score .seq global matches 980 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.2
execute if score .seq global matches 1000 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.4"}]}
execute if score .seq global matches 1000 run /execute at @a run /playsound horn.call.0 @a ~ ~ ~ 1 2.0

### At game start
execute if score .seq global matches 1000 run inputpermission set @a[tag=final_players] movement enabled
execute if score .seq global matches 1000 run /execute as @a run /playsound record.precipice @a ~ ~ ~ 0.5 1.25
execute if score .seq global matches 900 run tp @e[type=rwm:final_marker,tag=elim_zone_top] 1.0 315 6234
execute if score .seq global matches 900 run tp @e[type=rwm:final_marker,tag=elim_zone_bottom] 1.0 280 6213

# Camera Movement
execute if score .seq global matches 1000 run /camera @a set minecraft:free pos 1.0 309.0 6220.0 rot 27 0
execute if score .seq global matches 1001 run /camera @a set minecraft:free ease 60 linear pos 1.0 187 6145 rot 27 0
execute if score .seq global matches 1000 run /camera @a[tag=admin] set minecraft:free pos 1.0 309.0 6220.0 rot 27 0
execute if score .seq global matches 1001 run /camera @a[tag=admin] set minecraft:free ease 60 linear pos 1.0 187 6145 rot 27 0



### Throughout the game

#Static Elimination Zones
### execute if score .seq global matches 1000..2300 run execute as @a[tag=final_players,tag=!final_eliminated,x=-5.5,y=-61,z=5996,dx=1,dy=380,dz=253] run function utility/games/final/player_eliminated
### execute if score .seq global matches 1000..2300 run execute as @a[tag=final_players,tag=!final_eliminated,x=5.5,y=-61,z=5996,dx=1,dy=380,dz=253] run function utility/games/final/player_eliminated

#Moving Elimination Zones (now Push Zones)
execute if score .seq global matches 1000..2300 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run execute as @a[tag=final_players,tag=!final_eliminated,r=8] run function utility/games/final/player_eliminated

execute if score .seq global matches 1000..2300 run execute at @e[type=rwm:final_marker,tag=elim_zone_bottom] run execute as @a[tag=final_players,tag=!final_eliminated,r=5] run function utility/games/final/player_eliminated

###Elimination Zone Moving
#Top 1.0 313 6231 -> 1.0 196 6160 #Difference 0 -117 -74
#Bottom 1.0 287 6217 -> 1.0 170 6143 #Difference 0 -117 -74
#Movement across 1200 ticks= ~ ~-0.0975 ~-0.0616
execute if score .seq global matches 1020..2320 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run tp @e[type=rwm:final_marker,tag=elim_zone_top] ~ ~-0.0975 ~-0.0616

execute if score .seq global matches 1120..2320 run execute at @e[type=rwm:final_marker,tag=elim_zone_bottom] run tp @e[type=rwm:final_marker,tag=elim_zone_bottom] ~ ~-0.0975 ~-0.0616

#Emerald Dropper
execute if score .seq global matches 1000 run scoreboard objectives add final_showdown dummy final_showdown
execute if score .tick global matches 1 run execute if score .seq global matches 1000..5800 run function utility/games/final/random_emerald
execute if score .tick global matches 4 run execute if score .seq global matches 1000..5800 run function utility/games/final/random_emerald
execute if score .tick global matches 7 run execute if score .seq global matches 1000..5800 run function utility/games/final/random_emerald
execute if score .tick global matches 10 run execute if score .seq global matches 1000..5800 run function utility/games/final/random_emerald
execute if score .tick global matches 13 run execute if score .seq global matches 1000..5800 run function utility/games/final/random_emerald
execute if score .tick global matches 16 run execute if score .seq global matches 1000..5800 run function utility/games/final/random_emerald
execute if score .tick global matches 19 run execute if score .seq global matches 1000..5800 run function utility/games/final/random_emerald

#Scoring
execute if score .seq global matches 1000..2300 run /execute as @a[hasitem=[{item=emerald,quantity=1..}]] run function utility/games/final/player_score

### Game Over
execute if score .seq global matches 2301 run camera @a fade time 1 1 1
execute if score .seq global matches 2320 run scoreboard players set .actionbar.objective global 0

### Who Wins?
execute if score .seq global matches 2320 run scoreboard objectives setdisplay sidebar
execute if score .seq global matches 2320 run scoreboard players set Winner final_showdown_score 0
execute if score .seq global matches 2321 run execute as @a[tag=final_players] run execute at @s if score @s final_showdown_score > Winner final_showdown_score run scoreboard players operation Winner final_showdown_score = @s final_showdown_score

execute if score .seq global matches 2322 run execute as @a if score @s final_showdown_score = Winner final_showdown_score run tag @s add final_winner
execute if score .seq global matches 2380 run function utility/wins/final_showdown

###Place Players
execute if score .seq global matches 2325 run inputpermission set @a camera enabled
execute if score .seq global matches 2325 run inputpermission set @a[tag=!admin] movement disabled
execute if score .seq global matches 2325 run tp @a[tag=final_players,tag=!final_winner] 1 -62 5972
execute if score .seq global matches 2325 run tp @a[tag=final_spectator] 1 -62 5976
execute if score .seq global matches 2325 run tp @a[tag=final_winner] 1 -55 5968 180 0
execute if score .seq global matches 2326 run tp @r[tag=final_players,tag=!final_winner,x=1,y=-62,z=5972,r=2] 3 -59 5965 180 0
execute if score .seq global matches 2327 run tp @r[tag=final_players,tag=!final_winner,x=1,y=-62,z=5972,r=2] 1 -59 5964 180 0
execute if score .seq global matches 2328 run tp @r[tag=final_players,tag=!final_winner,x=1,y=-62,z=5972,r=2] -1 -59 5965 180 0
execute if score .seq global matches 2325 run tp @r[tag=final_spectator,x=1,y=-62,z=5976,r=2] 2 -62 5957 0 0
execute if score .seq global matches 2326 run tp @r[tag=final_spectator,x=1,y=-62,z=5976,r=2] 0 -62 5957 0 0
execute if score .seq global matches 2327 run tp @r[tag=final_spectator,x=1,y=-62,z=5976,r=2] 3 -62 5957 0 0
execute if score .seq global matches 2328 run tp @r[tag=final_spectator,x=1,y=-62,z=5976,r=2] -1 -62 5957 0 0

##Cutscene
execute if score .seq global matches 2330 run effect @a clear
execute if score .seq global matches 2330 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 2330 run camera @a clear
execute if score .seq global matches 2330 run /camera @a set minecraft:free pos 1.5 -53.5 5965.0 rot 3 0
execute if score .seq global matches 2331 run /camera @a set minecraft:free ease 15 in_out_quad pos 1.5 -61.6 5953.6 rot -23 0
execute if score .seq global matches 2330 run /camera @a[tag=admin] set minecraft:free pos 1.5 -53.5 5965.0 rot 3 0
execute if score .seq global matches 2331 run /camera @a[tag=admin] set minecraft:free ease 15 in_out_quad pos 1.5 -61.6 5953.6 rot -23 0
execute if score .seq global matches 2380 run summon minecraft:fireworks_rocket 2 -56 5971
execute if score .seq global matches 2380 run summon minecraft:fireworks_rocket 1 -56 5971
execute if score .seq global matches 2380 run summon minecraft:fireworks_rocket 0 -56 5971


### Return to Lobby
execute if score .seq global matches 2620 run camera @a fade time 0.5 1 0.5
execute if score .seq global matches 2630 run camera @a set minecraft:first_person
execute if score .seq global matches 2630 run camera @a clear
execute if score .seq global matches 2630 run hud @a reset
execute if score .seq global matches 2639 run kill @e[type=rwm:final_marker]
execute if score .seq global matches 2639 run kill @e[type=item]
execute if score .seq global matches 2639 run scoreboard players set .team1wins global 0
execute if score .seq global matches 2639 run scoreboard players set .team2wins global 0
execute if score .seq global matches 2640 run function utility/lobby/return_to_lobby
execute if score .seq global matches 2640 run stopsound @a
execute if score .seq global matches 2640 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 2640 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 2640 run scoreboard players set .team1wins global 0
execute if score .seq global matches 2640 run scoreboard players set .team2wins global 0
execute if score .seq global matches 2640 run scoreboard objectives remove final_showdown_score
execute if score .seq global matches 2640 run tag @a remove final_players
execute if score .seq global matches 2640 run tag @a remove final_spectator
execute if score .seq global matches 2640 run tag @a remove final_eliminated
execute if score .seq global matches 2640 run tag @a remove final_winner
execute if score .seq global matches 2640 run inputpermission set @a movement enabled
execute if score .seq global matches 2640 run camera @a clear

# Finished, Setup for next act
execute if score .seq global matches 2660 run /function utility/tickingarea_add
execute if score .seq global matches 2660 run /tickingarea remove finale_ending
execute if score .seq global matches 2660 run scoreboard players set .act global 0
execute if score .seq global matches 2660 run function loops/new_act