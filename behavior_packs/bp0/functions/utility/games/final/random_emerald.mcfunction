## Used for spawning emeralds
scoreboard players random .random_emerald final_showdown 0 15
execute if score .random_emerald final_showdown matches 1 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~3 ~25 ~-14
execute if score .random_emerald final_showdown matches 2 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~2 ~25 ~-14 
execute if score .random_emerald final_showdown matches 3 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~1 ~25 ~-14 
execute if score .random_emerald final_showdown matches 4 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~ ~25 ~-14
execute if score .random_emerald final_showdown matches 5 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~-1 ~25 ~-14 
execute if score .random_emerald final_showdown matches 6 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~-2 ~25 ~-14 
execute if score .random_emerald final_showdown matches 7 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~-3 ~25 ~-14 
execute if score .random_emerald final_showdown matches 8 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~3.5 ~25 ~-15
execute if score .random_emerald final_showdown matches 9 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~2.5 ~25 ~-15
execute if score .random_emerald final_showdown matches 10 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~1.5 ~25 ~-15
execute if score .random_emerald final_showdown matches 11 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~0.5 ~25 ~-15
execute if score .random_emerald final_showdown matches 12 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~-0.5 ~25 ~-15 
execute if score .random_emerald final_showdown matches 13 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~-1.5 ~25 ~-15
execute if score .random_emerald final_showdown matches 14 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~-2.5 ~25 ~-15
execute if score .random_emerald final_showdown matches 15 run execute at @e[type=rwm:final_marker,tag=elim_zone_top] run /summon rwm:final_emerald ~-3.5 ~25 ~-15
kill @e[type=rwm:final_emerald] 
