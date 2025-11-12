## Used for Bomb Scoring

## Team 1 Score
execute if entity @e[type=rwm:elytra_bomb,tag=bomb_active,tag=team1_bomb, x=-60,y=102,z=5084,dx=7,dy=5,dz=7] run /function utility/games/elytra/team1_score
tag @e[type=rwm:elytra_bomb,tag=bomb_active,tag=team1_bomb,x=-60,y=102,z=5084,dx=7,dy=5,dz=7] remove bomb_active

## Team 2 Score
execute if entity @e[type=rwm:elytra_bomb,tag=bomb_active,tag=team2_bomb, x=-108,y=102,z=5084,dx=7,dy=5,dz=7] run /function utility/games/elytra/team2_score
tag @e[type=rwm:elytra_bomb,tag=bomb_active,tag=team2_bomb,x=-108,y=102,z=5084,dx=7,dy=5,dz=7] remove bomb_active


### Player out of Play Area

tp @a[scores={team=1},x=-176,y=58,z=4992,dx=191,dy=15,dz=191] -130 168 5087
tp @a[scores={team=2},x=-176,y=58,z=4992,dx=191,dy=15,dz=191] -31 168 5087
tp @a[scores={team=1},x=-176,y=200,z=4992,dx=191,dy=10,dz=191] -130 168 5087
tp @a[scores={team=2},x=-176,y=200,z=4992,dx=191,dy=10,dz=191] -31 168 5087

tp @a[scores={team=1},x=-60,y=102,z=5084,dx=7,dy=5,dz=7] -130 168 5087
tp @a[scores={team=2},x=-60,y=102,z=5084,dx=7,dy=5,dz=7] -31 168 5087
tp @a[scores={team=1},x=-108,y=102,z=5084,dx=7,dy=5,dz=7] -130 168 5087
tp @a[scores={team=2},x=-108,y=102,z=5084,dx=7,dy=5,dz=7] -31 168 5087

tp @a[scores={team=1},x=-176,y=58,z=4992,dx=191,dy=150,dz=5] -130 168 5087
tp @a[scores={team=1},x=-176,y=58,z=5183,dx=191,dy=150,dz=5] -130 168 5087
tp @a[scores={team=1},x=-176,y=58,z=4992,dx=5,dy=150,dz=191] -130 168 5087
tp @a[scores={team=1},x=15,y=58,z=4992,dx=5,dy=150,dz=191] -130 168 5087

tp @a[scores={team=2},x=-176,y=58,z=4992,dx=191,dy=150,dz=5] -31 168 5087
tp @a[scores={team=2},x=-176,y=58,z=5183,dx=191,dy=150,dz=5] -31 168 5087
tp @a[scores={team=2},x=-176,y=58,z=4992,dx=5,dy=150,dz=191] -31 168 5087
tp @a[scores={team=2},x=15,y=58,z=4992,dx=5,dy=150,dz=191] -31 168 5087

##
execute at @e[type=rwm:elytra_bomb,tag=!team1_bomb,tag=!team2_bomb,tag=!bomb_active] run /execute if entity @a[tag=!bomb_carrier,r=5] run event entity @e[type=rwm:elytra_bomb,tag=!team1_bomb,tag=!team2_bomb,tag=!bomb_active,c=1] rwm:elytra_bomb_pickup


## Constant
execute at @a[tag=bomb_carrier] run execute unless entity @e[type=rwm:elytra_bomb,tag=!team1_bomb,tag=!team2_bomb,tag=!bomb_active,c=1,r=3] run tag @a[tag=bomb_carrier,r=5] remove bomb_carrier 

### Firework Use detection
execute at @a run /execute if entity @e[type=fireworks_rocket,r=3] run event entity @p rwm:elytra_using_firework_add
execute at @a run /execute unless entity @e[type=fireworks_rocket,r=3] run event entity @p rwm:elytra_using_firework_remove

execute if score .tick global matches 1 run function utility/games/elytra/player_loadout_fireworks

##RESPAWNING OF BOMBS
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-81,y=97,z=5087,r=5] run /summon rwm:elytra_bomb -81 97 5087 0 0 rwm:elytra_bomb_interact
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-81,y=182,z=5087,r=5] run /summon rwm:elytra_bomb -81 182 5087 0 0 rwm:elytra_bomb_interact
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-80,y=106,z=5033,r=5] run /summon rwm:elytra_bomb -80 106 5033 0 0 rwm:elytra_bomb_interact
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-80,y=165,z=5033,r=5] run /summon rwm:elytra_bomb -80 165 5033 0 0 rwm:elytra_bomb_interact
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-80,y=107,z=5149,r=5] run /summon rwm:elytra_bomb -80 107 5149 0 0 rwm:elytra_bomb_interact
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-145,y=96,z=5086,r=5] run /summon rwm:elytra_bomb -145 96 5086 0 0 rwm:elytra_bomb_interact
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-9,y=96,z=5086,r=5] run /summon rwm:elytra_bomb -9 96 5086 0 0 rwm:elytra_bomb_interact
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-137,y=121,z=5035,r=5] run /summon rwm:elytra_bomb -137 121 5035 0 0 rwm:elytra_bomb_interact
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-137,y=121,z=5150,r=5] run /summon rwm:elytra_bomb -137 121 5150 0 0 rwm:elytra_bomb_interact
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-34,y=121,z=5150,r=5] run /summon rwm:elytra_bomb -34 121 5150 0 0 rwm:elytra_bomb_interact
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_bomb,x=-34,y=121,z=5035,r=5] run /summon rwm:elytra_bomb -34 121 5035 0 0 rwm:elytra_bomb_interact

###Respawn Rings
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-81,y=97,z=5087,r=5] run /summon rwm:elytra_ring -81 95 5087
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-81,y=182,z=5087,r=5] run /summon rwm:elytra_ring -81 180 5087
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-80,y=106,z=5033,r=5] run /summon rwm:elytra_ring -80 104 5033
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-80,y=165,z=5033,r=5] run /summon rwm:elytra_ring -80 163 5033
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-80,y=107,z=5149,r=5] run /summon rwm:elytra_ring -80 105 5149
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-145,y=96,z=5086,r=5] run /summon rwm:elytra_ring -145 94 5086
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-9,y=96,z=5086,r=5] run /summon rwm:elytra_ring -9 94 5086
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-137,y=121,z=5035,r=5] run /summon rwm:elytra_ring -137 119 5035
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-137,y=121,z=5150,r=5] run /summon rwm:elytra_ring -137 119 5150
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-34,y=121,z=5150,r=5] run /summon rwm:elytra_ring -34 119 5150
execute if score .tick10 global matches 1 run /execute unless entity @e[type=rwm:elytra_ring,x=-34,y=121,z=5035,r=5] run /summon rwm:elytra_ring -34 119 5035