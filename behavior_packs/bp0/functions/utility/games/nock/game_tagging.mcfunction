## Used for Tagging Arrows in Game 4: Orb Ambush
## Should run constantly during the game.

effect @e[type=rwm:nock_target] instant_health 1 10 true
effect @e[type=rwm:nock_minecart_hitbox] instant_health 1 10 true
effect @e[type=rwm:nock_target] clear
effect @e[type=rwm:nock_minecart_hitbox] clear

## Arrow Time
scoreboard players add @e[type=arrow] projectile_time 1
kill @e[type=arrow,scores={projectile_time=40..}]

# Other Entities
scoreboard players add @e[type=bat] projectile_time 1
tp @e[type=bat,scores={projectile_time=70..}] 0 -600 4000
kill @e[type=bat,scores={projectile_time=71..}] 

##Arrow Refill
execute if score .tick10 global matches 10 run function utility/games/nock/arrow_refill

###Minecart Facing
##execute as @e[tag=target_type_minecart_rider] at @s run tp @s ~ ~ ~ facing 0 59 4000
##execute as @e[tag=target_type_minecart_rider] at @s run ride @s start_riding @e[type=rwm:nock_minecart_hitbox,c=1] teleport_rider