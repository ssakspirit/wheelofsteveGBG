## Team 2 Wins
titleraw @a title {"rawtext":[{"translate":"subtitle.title"}]}
titleraw @a title {"rawtext":[{"translate":"subtitle.objective.1000.2"}]}
execute if score .wheelgame global matches 1..5 run scoreboard players add .team2wins global 1
scoreboard players set .subtitle.objective global 1002
playsound random.totem @a[scores={team=2}] ~ ~ ~ 1 1.0 
playsound firework.large_blast @a[scores={team=2}] ~ ~ ~ 1 0.5 
playsound firework.twinkle @a[scores={team=2}] ~ ~ ~ 1 1.5 
playsound mob.elderguardian.curse @a[scores={team=1}] ~ ~ ~ 1 0.75
scoreboard players set .wheelgame global 0