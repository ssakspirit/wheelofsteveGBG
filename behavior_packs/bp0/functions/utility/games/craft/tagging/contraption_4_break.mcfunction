##Remove fixed tag of the rwm:craft_contraptions entity when chosen to be broken.

tag @s[tag=contraption_4] remove fixed
execute at @s[tag=contraption_4] run summon rwm:orb_knockback ~ ~ ~
execute at @s[tag=contraption_4] run playsound mob.zombie.woodbreak @a ~ ~ ~ 0.4

execute at @s[tag=contraption_4,tag=contraption_team1] run kill @e[type=rwm:craft_diagram,x=-11,y=91,z=3016,r=1]
execute at @s[tag=contraption_4,tag=contraption_team2] run kill @e[type=rwm:craft_diagram,x=15,y=91,z=3016,r=1]
execute at @s[tag=contraption_4,tag=contraption_team1] run summon rwm:craft_diagram -11 91 3016 0 0 rwm:diagram_4
execute at @s[tag=contraption_4,tag=contraption_team2] run summon rwm:craft_diagram 15 91 3016 0 0 rwm:diagram_4