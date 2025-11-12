## Used for Reseting Game 1: Orb Ambush

scoreboard players set .game global 1
scoreboard players set .debuff_timer global 0
tag @a remove orb_flag_holder
kill @e[type=rwm:orb_flag]
kill @e[type=rwm:orb_enemy]
kill @e[type=rwm:timer]
event entity @a rwm:orb_seat_add
scoreboard objectives add score dummy §6§lScore
scoreboard players set "§4Team 1" score 0
scoreboard players set "§9Team 2" score 0

#Insert Better Start Points once players get their tags.
tp @a[scores={team=1}] 0 62 1979 0 0
tp @a[scores={team=2}] 0 62 2017 180 0
tp @a[tag=admin] 0 70 1998 0 0
##Spread Players
tp @r[scores={team=1},x=0,y=62,z=1979,r=1] -1 62 1974 0 0
tp @r[scores={team=1},x=0,y=62,z=1979,r=1] 1 62 1974 0 0
tp @r[scores={team=1},x=0,y=62,z=1979,r=1] -3 62 1975 0 0
tp @r[scores={team=1},x=0,y=62,z=1979,r=1] 3 62 1975 0 0

tp @r[scores={team=2},x=0,y=62,z=2017,r=1] 1 62 2022 180 0
tp @r[scores={team=2},x=0,y=62,z=2017,r=1] -1 62 2022 180 0
tp @r[scores={team=2},x=0,y=62,z=2017,r=1] 3 62 2021 180 0
tp @r[scores={team=2},x=0,y=62,z=2017,r=1] -3 62 2021 180 0


summon rwm:orb_flag 0 66 1998 0 0 rwm:orb_flag_unride_player
## If in singleplayer, Summon an rwm:orb_enemy with the event of rwm:orb_enemy_hunt. Position and team is based on the opposing player.
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run summon rwm:orb_enemy 0 62 2022 180 0 rwm:orb_enemy_hunt
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run scoreboard players set @e[type=rwm:orb_enemy] team 2
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run summon rwm:orb_enemy 0 62 1974 0 0 rwm:orb_enemy_hunt
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run scoreboard players set @e[type=rwm:orb_enemy] team 1

tag @a add orb_player
tag @e[type=rwm:orb_enemy] add orb_player

## Add Barriers to Pillars
fill 7 67 2012 6 69 2011 barrier
fill -6 67 2012 -7 69 2011 barrier
fill 7 67 1985 6 69 1984 barrier
fill -6 67 1985 -7 69 1984 barrier
fill -12 65 1999 -14 69 1997 barrier
fill 14 65 1999 12 69 1997 barrier