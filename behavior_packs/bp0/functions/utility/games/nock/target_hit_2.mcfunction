## Score Team 2
scoreboard players add "§9Team 2" score 1
execute at @a[scores={team=2}] run playsound note.bell @a[scores={team=2}] ~ ~ ~ 0.15 1
tag @s[type=rwm:nock_target] add target_hit
execute as @s[type=rwm:nock_target] run function utility/games/nock/target_hit_effects