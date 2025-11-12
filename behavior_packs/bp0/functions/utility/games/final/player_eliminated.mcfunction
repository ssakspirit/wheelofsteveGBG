## Used for when a player gets eliminated

##execute as @s[tag=final_players] run execute if entity @e[type=rwm:final_marker,tag=elim_zone_top,c=1,r=10] run say Top Zone

##execute as @s[tag=final_players] run execute if entity @e[type=rwm:final_marker,tag=elim_zone_bottom,c=1,r=10] run say Bottom Zone

execute as @s[tag=final_players] run execute if entity @e[type=rwm:final_marker,tag=elim_zone_top,c=1,r=10] run summon rwm:final_knockback ~ ~2.5 ~1
execute as @s[tag=final_players] run execute if entity @e[type=rwm:final_marker,tag=elim_zone_bottom,c=1,r=10] run summon rwm:final_knockback ~ ~-1 ~-2

#Old Elimination Stuff
##tag @s[tag=final_players] add final_eliminated
##effect @s[tag=final_eliminated] invisibility 60 0 true
##execute at @s[tag=final_eliminated] run summon lightning_bolt ~ ~-20 ~
##inputpermission set @s[tag=final_eliminated] movement disabled