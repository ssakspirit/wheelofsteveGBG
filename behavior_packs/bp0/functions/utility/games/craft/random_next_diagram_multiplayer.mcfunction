## Used for Randomly Spawning in the next diagram.
tag @s[type=rwm:craft_contraption] add fixed
#Randomize the Score
scoreboard players set diagram_location craft_scores 0
scoreboard players random diagram_location craft_scores 1 12

##Scoring
execute as @s[tag=contraption_team1] run scoreboard players add "§4Team 1" score 1
execute as @s[tag=contraption_team2] run scoreboard players add "§9Team 2" score 1

##Particle
execute if score .seq global matches 1200.. run execute as @s run particle rwm:craft_contraption_fixed ~ ~ ~

#Sound
execute as @s[tag=contraption_team1] run playsound random.anvil_use @a[scores={team=1}] -4 60 3037 0.55
execute as @s[tag=contraption_team2] run playsound random.anvil_use @a[scores={team=2}] 4 60 3037 0.55

#execute if score contraption_break craft_scores matches 1 run say Random 1
#execute if score contraption_break craft_scores matches 2 run say Random 2
#execute if score contraption_break craft_scores matches 3 run say Random 3
#execute if score contraption_break craft_scores matches 4 run say Random 4
#execute if score contraption_break craft_scores matches 5 run say Random 5
#execute if score contraption_break craft_scores matches 6 run say Random 6
#execute if score contraption_break craft_scores matches 7 run say Random 7
#execute if score contraption_break craft_scores matches 8 run say Random 8
#execute if score contraption_break craft_scores matches 9 run say Random 9
#execute if score contraption_break craft_scores matches 10 run say Random 10
#execute if score contraption_break craft_scores matches 11 run say Random 11
#execute if score contraption_break craft_scores matches 12 run say Random 12

#Team 1
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 1 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -24 60 3047
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 2 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -17 60 3047
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 3 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -14 60 3039
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 4 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -17 60 3042
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 5 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -24 60 3042
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 6 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -24 60 3036
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 7 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -19 60 3032
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 8 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -19 60 3026
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 9 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -24 60 3028
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 10 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -24 60 3020
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 11 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -19 60 3021
execute as @s[tag=contraption_team1] run execute if score diagram_location craft_scores matches 12 run tp @r[type=rwm:craft_diagram,x=-13,y=91,z=3016,r=5] -24 60 3015

#Team 2
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 1 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 24 60 3047
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 2 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 17 60 3047
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 3 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 14 60 3039
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 4 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 17 60 3042
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 5 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 24 60 3042
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 6 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 24 60 3036
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 7 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 19 60 3032
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 8 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 19 60 3026
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 9 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 24 60 3028
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 10 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 24 60 3020
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 11 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 19 60 3021
execute as @s[tag=contraption_team2] run execute if score diagram_location craft_scores matches 12 run tp @r[type=rwm:craft_diagram,x=13,y=91,z=3016,r=5] 24 60 3015