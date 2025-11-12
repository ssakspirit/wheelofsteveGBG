## Used for Picking up the orb

playsound conduit.activate @a ~ ~ ~ 0.5 1.5
ride @e[type=rwm:orb_flag] stop_riding
tag @e[tag=orb_player] remove orb_flag_holder
tag @e[tag=orb_player,tag=!orb_flag_holder_cooldown,c=1,r=7] add orb_flag_holder
tag @e[type=rwm:orb_flag] add held
replaceitem entity @a[tag=orb_player,tag=orb_flag_holder] slot.weapon.mainhand 0 rwm:orb 1 0 {"item_lock": {"mode": "lock_in_slot"}}
execute at @e[type=rwm:orb_flag] run ride @e[type=rwm:orb_flag] start_riding @e[tag=orb_flag_holder,c=1]
execute if entity @e [tag=orb_flag_holder,type=rwm:orb_enemy] run event entity @e[tag=orb_flag_holder,type=rwm:orb_enemy] rwm:orb_enemy_run