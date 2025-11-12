## Used for Reseting Game 4: Orb Ambush

scoreboard players set .game global 4
scoreboard objectives remove projectile_time
tag @a remove nock_player
tag @a remove nock_team1
tag @a remove nock_team2
kill @e[type=rwm:nock_target]
kill @e[type=rwm:timer]
scoreboard objectives add score dummy §6§lScore
scoreboard players set "§4Team 1" score 0
scoreboard players set "§9Team 2" score 0
function utility/games/nock/respawn_targets
scoreboard objectives add projectile_time dummy projectile_time

#Insert Better Start Points once players get their tags.
tp @a[scores={team=1}] 0 60 3998 0 0
tp @a[scores={team=2}] 0 60 4002 0 0
tp @a[tag=admin] 0 70 4000 0 0
##Spread Players
tp @r[scores={team=1},x=0,y=60,z=3998,r=1] 4 60 4004 135 0
tp @r[scores={team=1},x=0,y=60,z=3998,r=1] 4 60 3996 45 0
tp @r[scores={team=1},x=0,y=60,z=3998,r=1] -4 60 3996 -45 0
tp @r[scores={team=1},x=0,y=60,z=3998,r=1] -4 60 4004 -135 0

tp @r[scores={team=2},x=0,y=60,z=4002,r=1] 5 60 4000 180 0
tp @r[scores={team=2},x=0,y=60,z=4002,r=1] 0 60 3995 90 0
tp @r[scores={team=2},x=0,y=60,z=4002,r=1] -5 60 4000 0 0
tp @r[scores={team=2},x=0,y=60,z=4002,r=1] 0 60 4005 -90 0

tag @a add nock_player
tag @a[scores={team=1}] add nock_team1
tag @a[scores={team=2}] add nock_team2