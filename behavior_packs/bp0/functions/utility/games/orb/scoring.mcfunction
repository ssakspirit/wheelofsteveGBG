## Used for Adding points to players who have the flag/orb.

execute if score .tick global matches 1 run execute if entity @e[scores={team=1},tag=orb_flag_holder] run scoreboard players add "§4Team 1" score 1
execute if score .tick global matches 1 run execute if entity @e[scores={team=2},tag=orb_flag_holder] run scoreboard players add "§9Team 2" score 1

#Score Sound
execute if score .tick global matches 1 run execute if entity @a[scores={team=1},tag=orb_flag_holder] run execute at @a[scores={team=1},tag=orb_flag_holder] run /playsound note.bell @a[tag=orb_flag_holder] ~ ~ ~ 0.2 1
execute if score .tick global matches 1 run execute if entity @a[scores={team=2},tag=orb_flag_holder] run execute at @a[scores={team=2},tag=orb_flag_holder] run /playsound note.bell @a[tag=orb_flag_holder] ~ ~ ~ 0.2 1

#Score Particle
execute if score .tick global matches 1 run execute if entity @e[scores={team=1},tag=orb_flag_holder] run execute at @e[scores={team=1},tag=orb_flag_holder] run /particle rwm:plus_1 ~ ~2.3 ~
execute if score .tick global matches 1 run execute if entity @e[scores={team=2},tag=orb_flag_holder] run execute at @e[scores={team=2},tag=orb_flag_holder] run /particle rwm:plus_1 ~ ~2.3 ~


## Incriment Debuff Timer
execute if score .tick global matches 1 run execute if entity @a[tag=orb_flag_holder] run scoreboard players add .debuff_timer global 1

## Debuff Effects
execute if score .tick global matches 1 run execute if score .debuff_timer global matches 0..3 run effect @a[tag=orb_flag_holder] speed 2 1 false
execute if score .tick global matches 1 run execute if score .debuff_timer global matches 4..8 run effect @a[tag=orb_flag_holder] speed 2 0 false
execute if score .tick global matches 1 run execute if score .debuff_timer global matches 9..20 run effect @a[tag=orb_flag_holder] slowness 2 0 false
execute if score .tick global matches 1 run execute if score .debuff_timer global matches 21..30 run effect @a[tag=orb_flag_holder] slowness 2 1 false
execute if score .tick global matches 1 run execute if score .debuff_timer global matches 30..40 run effect @a[tag=orb_flag_holder] slowness 2 2 false
execute if score .tick global matches 1 run execute if score .debuff_timer global matches 40..50 run effect @a[tag=orb_flag_holder] slowness 2 3 false
execute if score .tick global matches 1 run execute if score .debuff_timer global matches 50.. run effect @a[tag=orb_flag_holder] slowness 2 5 false