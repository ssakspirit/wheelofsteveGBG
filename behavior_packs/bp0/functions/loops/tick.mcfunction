## Global loop, 20hz stuff
# The main loop
# @s = server


#say ticking function
execute if score .tick global matches 0..20 run scoreboard players add .tick global 1
execute if score .tick global matches 20..21 run scoreboard players set .tick global 1

execute if score .tick10 global matches 0..200 run scoreboard players add .tick10 global 1
execute if score .tick10 global matches 200..201 run scoreboard players set .tick10 global 1


##Timer (Damage once per second.(Deals 3 half-hearts))
execute if score .tick global matches 1 run /effect @e[type=rwm:timer] instant_damage 1 0 true


#Lobby

#PlayerRegistering
execute unless entity @a[tag=.host] run function utility/lobby/detect_host_player

execute if entity @a[tag=.host] run execute if entity @a[tag=!.host,x=-5,y=25,z=-5,dx=10,dy=10,dz=10] run function utility/lobby/detect_new_player

#Multiplayer
execute if score .tick global matches 1 run execute if entity @a[tag=.host] run execute if entity @a[tag=.nothost] run scoreboard players set .game_mode global 0

#Singleplayer
execute if score .tick global matches 1 run execute unless entity @a[tag=.nothost] run scoreboard players set .game_mode global 1

###Qwerty's Illegal Items
execute if score .tick10 global matches 100 run function lobby/remove_contraband

#Admin Observer Management
## Auto-assign admin tagged players as observers
execute as @a[tag=admin,scores={team=!0}] run function utility/teams/admin_observer_select

## Reset admin observers if they somehow change state (every 10 seconds)
execute if score .tick10 global matches 150 run function utility/admin_observer_reset

#Team Selection
## Team 1
execute if score .team1players global matches -10..-1 run scoreboard players set .team1players global 0
execute if score .team1players global matches 0..3 run execute as @a[scores={team=!1},tag=!admin,x=9,y=-4,z=17,dx=2,dy=4,dz=2] run tag @s add team1joining 
execute if score .team1players global matches 0..3 run execute as @a[scores={team=!1},tag=!admin,x=-31,y=64,z=1012,dx=4,dy=4,dz=4] run tag @s add team1joining 
execute as @a[tag=team1joining] run function utility/teams/team1_select

### If Team 1 is full
execute if score .team1players global matches 4 run execute as @a[scores={team=!1},tag=!admin,x=9,y=-4,z=17,dx=2,dy=4,dz=2] run say §4Team 1§6 is full.
execute if score .team1players global matches 4 run execute as @a[scores={team=!1},tag=!admin,x=-31,y=64,z=1012,dx=4,dy=4,dz=4] run say §4Team 1§6 is full.

### Admin observers cannot join teams (message shown every 10 seconds)
execute if score .tick10 global matches 50 run execute as @a[tag=admin,x=9,y=-4,z=17,dx=2,dy=4,dz=2] run tellraw @s {"rawtext":[{"text":"§c관리자 관찰자는 팀에 참가할 수 없습니다. 크리에이티브 모드로 관찰하세요."}]}
execute if score .tick10 global matches 50 run execute as @a[tag=admin,x=-31,y=64,z=1012,dx=4,dy=4,dz=4] run tellraw @s {"rawtext":[{"text":"§c관리자 관찰자는 팀에 참가할 수 없습니다. 크리에이티브 모드로 관찰하세요."}]}

## Team 2
execute if score .team2players global matches -10..-1 run scoreboard players set .team2players global 0 
execute if score .team2players global matches 0..3 run execute as @a[scores={team=!2},tag=!admin,x=3,y=-4,z=17,dx=2,dy=4,dz=2] run tag @s add team2joining 
execute if score .team2players global matches 0..3 run execute as @a[scores={team=!2},tag=!admin,x=-31,y=64,z=1020,dx=4,dy=4,dz=4] run tag @s add team2joining 
execute as @a[tag=team2joining] run function utility/teams/team2_select

### If Team 2 is full
execute if score .team2players global matches 4 run execute as @a[scores={team=!2},tag=!admin,x=3,y=-4,z=17,dx=2,dy=4,dz=2] run say §9Team 2§6 is full.
execute if score .team2players global matches 4 run execute as @a[scores={team=!2},tag=!admin,x=-31,y=64,z=1020,dx=4,dy=4,dz=4] run say §9Team 2§6 is full.

### Admin observers cannot join teams (message shown every 10 seconds)
execute if score .tick10 global matches 50 run execute as @a[tag=admin,x=3,y=-4,z=17,dx=2,dy=4,dz=2] run tellraw @s {"rawtext":[{"text":"§c관리자 관찰자는 팀에 참가할 수 없습니다. 크리에이티브 모드로 관찰하세요."}]}
execute if score .tick10 global matches 50 run execute as @a[tag=admin,x=-31,y=64,z=1020,dx=4,dy=4,dz=4] run tellraw @s {"rawtext":[{"text":"§c관리자 관찰자는 팀에 참가할 수 없습니다. 크리에이티브 모드로 관찰하세요."}]}


### Games

#Lobby
execute if score .act global matches 1 as @p at @s run function seq/act0/001
execute if score .act global matches 2 as @p at @s run function seq/act0/002
execute if score .act2 global matches 3 as @p at @s run function seq/act0/003

#Game 1 (Orb Ambush)
execute if score .game global matches 1 run function utility/games/orb/scoring
execute if score .game global matches 1 run function utility/games/orb/debuff

##Run Orb Ambush
execute if score .act global matches 101 as @p at @s run function seq/act1/101

#Game 2 (Craft Off)
##Run Craft Off
execute if score .act global matches 200 as @p at @s run function seq/act2/200
execute if score .act global matches 201 as @p at @s run function seq/act2/201
execute if score .act global matches 202 as @p at @s run function seq/act2/202

#Game 3 (Grid Wars)
##Run Grid Wars
execute if score .act global matches 301 as @p at @s run function seq/act3/301

#Game 4 (Nock it Off)
execute if score .act global matches 401 as @p at @s run function seq/act4/401

#Game 5 (Elytra Rumble)
execute if score .act global matches 501 as @p at @s run function seq/act5/501

#Game 6 (Finale Showdown)
execute if score .act global matches 601 as @p at @s run function seq/act6/601

#Particles
execute if score .game global matches 0 run function utility/particles/lobby_particles
execute if score .game global matches 1 run function utility/particles/g1_particles
execute if score .game global matches 2 run function utility/particles/g2_particles
execute if score .game global matches 3 run function utility/particles/g3_particles
execute if score .game global matches 4 run function utility/particles/g4_particles
execute if score .game global matches 5 run function utility/particles/g5_particles
execute if score .game global matches 6 run function utility/particles/g6_particles

execute if score .game global matches 5 run execute if score .tick global matches 1 run particle rwm:elytra_fog_1 -80 113 5088
execute if score .game global matches 5 run execute if score .tick global matches 1 run particle rwm:elytra_fog_2 -80 70 5088
execute if score .game global matches 5 run execute if score .tick global matches 1 run particle rwm:elytra_fog_2 200 113 5088

#Objectives
#Lobby
execute if score .actionbar.objective global matches 10000 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.000.10000", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 001 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.1", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 002 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.2", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 003 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.3", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 004 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.4", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 005 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.5", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 006 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.6", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 007 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.7", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 008 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.8", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 009 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.9", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 010 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.10", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 011 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.11", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 012 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.12", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 013 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.13", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 014 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.14", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 015 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.15", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 016 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.16", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 017 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.17", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 018 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.001.18", "with": ["\n"]}]}

execute if score .actionbar.objective global matches 020 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.003.20", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 021 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.003.21", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 022 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.003.22", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 023 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.003.23", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 024 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.003.24", "with": ["\n"]}]}

#Game 1 Orb Ambush
execute if score .actionbar.objective global matches 101 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.101.1", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 102 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.101.2", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 103 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.101.3", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 104 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.101.4", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 105 run /titleraw @a[tag=!orb_flag_holder] actionbar {"rawtext":[{"translate":"actionbar.objective.101.5"}]}
execute if score .actionbar.objective global matches 105 run /titleraw @a[tag=orb_flag_holder] actionbar {"rawtext":[{"translate":"actionbar.objective.101.6"}]}

#Game 1 Craft Off
execute if score .actionbar.objective global matches 201 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.201.1", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 202 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.201.2", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 203 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.201.3", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 204 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.201.4", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 205 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.201.5", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 206 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.201.6", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 207 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.201.7", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 208 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.201.8", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 209 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.201.9", "with": ["\n"]}]}

execute if score .actionbar.objective global matches 211 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.1", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 212 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.2", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 213 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.3", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 214 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.4", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 215 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.5", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 216 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.6", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 217 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.7", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 218 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.8", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 219 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.9", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 210 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.10", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 221 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.11", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 222 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.12", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 223 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.13", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 224 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.14", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 225 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.15", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 226 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.202.16", "with": ["\n"]}]}

#Game 3 Grid Wars
execute if score .actionbar.objective global matches 301 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.301.1", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 302 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.301.2", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 303 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.301.3", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 304 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.301.4", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 305 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.301.5", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 306 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.301.6", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 307 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.301.7", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 308 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.301.8", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 309 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.301.9", "with": ["\n"]}]}

#Game 4 Nock it Off
execute if score .actionbar.objective global matches 401 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.401.1", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 402 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.401.2", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 403 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.401.3", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 404 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.401.4", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 405 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.401.5", "with": ["\n"]}]}

#Game 5 Elytra Rumble
execute if score .actionbar.objective global matches 501 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.501.1", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 502 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.501.2", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 503 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.501.3", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 504 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.501.4", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 505 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.501.5", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 506 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.501.6", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 507 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.501.7", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 508 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.501.8", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 509 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.501.9", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 510 run /titleraw @a[scores={team=1}] actionbar {"rawtext":[{"translate":"actionbar.objective.501.10", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 510 run /titleraw @a[scores={team=2}] actionbar {"rawtext":[{"translate":"actionbar.objective.501.11", "with": ["\n"]}]}


#Game 6 Finale
execute if score .actionbar.objective global matches 601 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.601.1", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 602 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.601.2", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 603 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.601.3", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 604 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.601.4", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 605 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.601.5", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 606 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.601.6", "with": ["\n"]}]}
execute if score .actionbar.objective global matches 607 run /titleraw @a actionbar {"rawtext":[{"translate":"actionbar.objective.601.7", "with": ["\n"]}]}

# Sequences
# Increment seq if set to run
execute if score .run global matches 1 run scoreboard players add .seq global 1
execute if score .run2 global matches 1 run scoreboard players add .seq2 global 1
execute if score .run3 global matches 1 run scoreboard players add .seq3 global 1

#Player Effects:
execute if score .tick global matches 01 run effect @a[tag=!admin] instant_health 1 10 true
execute if score .tick global matches 01 run effect @a[tag=!admin] saturation 1 10 true

#Admin Observer Effects removed - observers use creative mode
