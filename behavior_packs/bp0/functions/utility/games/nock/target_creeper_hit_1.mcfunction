## Score Team 1
scoreboard players add "§4Team 1" score 3
execute at @a[scores={team=1}] run playsound note.iron_xylophone @a[scores={team=1}] ~ ~ ~ 1 1.5
execute as @s[type=rwm:nock_target] run summon rwm:nock_knockback ~ ~ ~ 
execute as @s[type=rwm:nock_target] run particle rwm:plus_3 ~ ~ ~