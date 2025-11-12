## Used for Dropping of the Orb
playsound random.explode @a ~ ~ ~ 0.5 1.5
playsound conduit.deactivate @a ~ ~ ~ 0.5 2.5
scoreboard players set .debuff_timer global 0
execute if entity @e [tag=orb_flag_holder,type=rwm:orb_enemy] run event entity @e[tag=orb_flag_holder,type=rwm:orb_enemy] rwm:orb_enemy_hunt
clear @a rwm:orb
tag @e[tag=orb_flag_holder] add orb_flag_holder_cooldown
tag @a remove orb_flag_holder
tag @e[type=rwm:orb_enemy] remove orb_flag_holder
tag @e[type=rwm:orb_flag] remove held
ride @e[type=rwm:orb_flag] stop_riding