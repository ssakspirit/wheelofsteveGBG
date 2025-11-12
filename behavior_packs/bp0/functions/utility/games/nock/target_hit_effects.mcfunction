## Used for triggering effects on hit targets

##INSERT EFFECTS AND TRIGGERS
##execute as @s run say Ow! (Trigger Effect)
execute as @s[type=rwm:nock_target] run /event entity @e[type=rwm:nock_prop,r=8] rwm:nock_animate
execute as @s[tag=target_type_1] run /summon fireworks_rocket ~ ~ ~
execute as @s[tag=target_type_2] run /summon rwm:nock_knockback ~ ~ ~
execute as @s[tag=target_type_3] run /particle rwm:rainbow ~ ~ ~
execute as @s[tag=target_type_3] run /function utility/games/nock/fog_random

execute as @s[tag=target_type_minecart_rider] run /summon bat ~ ~-0.5 ~
execute as @s[tag=target_type_minecart_rider] run /summon bat ~ ~-0.5 ~
execute as @s[tag=target_type_minecart_rider] run /summon bat ~ ~-0.5 ~

#Points Particle
execute as @s run particle rwm:plus_1 ~ ~ ~

##Minecart Triggers
execute as @s[tag=target_type_minecart_lower_1] run /setblock 0 59 4020 redstone_torch ["torch_facing_direction"="south"]
execute as @s[tag=target_type_minecart_lower_1] run /setblock 20 59 4000 air
execute as @s[tag=target_type_minecart_lower_1] run /setblock 0 59 3980 air
execute as @s[tag=target_type_minecart_lower_1] run /setblock -20 59 4000 air

execute as @s[tag=target_type_minecart_lower_2] run /setblock 0 59 4020 air
execute as @s[tag=target_type_minecart_lower_2] run /setblock 20 59 4000 redstone_torch ["torch_facing_direction"="east"]
execute as @s[tag=target_type_minecart_lower_2] run /setblock 0 59 3980 air
execute as @s[tag=target_type_minecart_lower_2] run /setblock -20 59 4000 air

execute as @s[tag=target_type_minecart_lower_3] run /setblock 0 59 4020 air
execute as @s[tag=target_type_minecart_lower_3] run /setblock 20 59 4000 air
execute as @s[tag=target_type_minecart_lower_3] run /setblock 0 59 3980 redstone_torch ["torch_facing_direction"="north"]
execute as @s[tag=target_type_minecart_lower_3] run /setblock -20 59 4000 air

execute as @s[tag=target_type_minecart_lower_4] run /setblock 0 59 4020 air
execute as @s[tag=target_type_minecart_lower_4] run /setblock 20 59 4000 air
execute as @s[tag=target_type_minecart_lower_4] run /setblock 0 59 3980 air
execute as @s[tag=target_type_minecart_lower_4] run /setblock -20 59 4000 redstone_torch ["torch_facing_direction"="west"]

#Minecart Triggers #Upper
execute as @s[tag=target_type_minecart_upper_1] run /setblock 0 64 4030 redstone_torch ["torch_facing_direction"="south"]
execute as @s[tag=target_type_minecart_upper_1] run /setblock 30 64 4000 air
execute as @s[tag=target_type_minecart_upper_1] run /setblock 0 64 3970 air
execute as @s[tag=target_type_minecart_upper_1] run /setblock -30 64 4000 air

execute as @s[tag=target_type_minecart_upper_2] run /setblock 0 64 4030 air
execute as @s[tag=target_type_minecart_upper_2] run /setblock 30 64 4000 redstone_torch ["torch_facing_direction"="east"]
execute as @s[tag=target_type_minecart_upper_2] run /setblock 0 64 3970 air
execute as @s[tag=target_type_minecart_upper_2] run /setblock -30 64 4000 air

execute as @s[tag=target_type_minecart_upper_3] run /setblock 0 64 4030 air
execute as @s[tag=target_type_minecart_upper_3] run /setblock 30 64 4000 air
execute as @s[tag=target_type_minecart_upper_3] run /setblock 0 64 3970 redstone_torch ["torch_facing_direction"="north"]
execute as @s[tag=target_type_minecart_upper_3] run /setblock -30 64 4000 air

execute as @s[tag=target_type_minecart_upper_4] run /setblock 0 64 4030 air
execute as @s[tag=target_type_minecart_upper_4] run /setblock 30 64 4000 air
execute as @s[tag=target_type_minecart_upper_4] run /setblock 0 64 3970 air
execute as @s[tag=target_type_minecart_upper_4] run /setblock -30 64 4000 redstone_torch ["torch_facing_direction"="west"]

execute as @s[tag=target_type_minecart_upper_5] run execute at @e[type=minecart] run /summon fireworks_rocket ~ ~1 ~

tag @s[type=rwm:nock_target] remove target_hit
