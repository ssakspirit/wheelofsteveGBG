##Remove fixed tag of the rwm:craft_contraptions entity when chosen to be broken.

tag @s[tag=contraption_3] remove fixed
execute at @s[tag=contraption_3] run summon rwm:orb_knockback ~ ~ ~
execute at @s[tag=contraption_3] run playsound mob.zombie.woodbreak @a ~ ~ ~ 0.4

execute at @s[tag=contraption_3,tag=contraption_team1] run kill @e[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=1]
execute at @s[tag=contraption_3,tag=contraption_team2] run kill @e[type=rwm:craft_diagram,x=13,y=91,z=3016,r=1]
execute at @s[tag=contraption_3,tag=contraption_team1] run summon rwm:craft_diagram -13 91 3016 0 0 rwm:diagram_3
execute at @s[tag=contraption_3,tag=contraption_team2] run summon rwm:craft_diagram 13 91 3016 0 0 rwm:diagram_3