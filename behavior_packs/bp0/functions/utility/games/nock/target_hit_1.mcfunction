## Score Team 1
scoreboard players add "§4Team 1" score 1
execute at @a[scores={team=1}] run playsound note.bell @a[scores={team=1}] ~ ~ ~ 0.15 1
tag @s[type=rwm:nock_target] add target_hit
execute as @s[type=rwm:nock_target] run function utility/games/nock/target_hit_effects