## Team 1 Wins
titleraw @a title {"rawtext":[{"translate":"subtitle.title"}]}
titleraw @a title {"rawtext":[{"translate":"subtitle.objective.1000.1"}]}
execute if score .wheelgame global matches 1..5 run scoreboard players add .team1wins global 1
scoreboard players set .subtitle.objective global 1001
playsound random.totem @a[scores={team=1}] ~ ~ ~ 1 1.0 
playsound firework.large_blast @a[scores={team=1}] ~ ~ ~ 1 0.5 
playsound firework.twinkle @a[scores={team=1}] ~ ~ ~ 1 1.5 
playsound mob.elderguardian.curse @a[scores={team=2}] ~ ~ ~ 1 0.75  
scoreboard players set .wheelgame global 0