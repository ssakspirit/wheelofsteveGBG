##Remove fixed tag of the rwm:craft_contraptions entity when chosen to be broken.

tag @e[tag=contraption_5] remove fixed
execute at @e[tag=contraption_5] run summon rwm:orb_knockback ~ ~ ~
execute at @e[tag=contraption_5] run playsound mob.zombie.woodbreak @a ~ ~ ~ 0.4

execute at @s[tag=contraption_5,tag=contraption_team1] run kill @e[type=rwm:craft_diagram,x=-9,y=91,z=3016,r=1]
execute at @s[tag=contraption_5,tag=contraption_team2] run kill @e[type=rwm:craft_diagram,x=17,y=91,z=3016,r=1]
execute at @s[tag=contraption_5,tag=contraption_team1] run summon rwm:craft_diagram -9 91 3016 0 0 rwm:diagram_5
execute at @s[tag=contraption_5,tag=contraption_team2] run summon rwm:craft_diagram 17 91 3016 0 0 rwm:diagram_5