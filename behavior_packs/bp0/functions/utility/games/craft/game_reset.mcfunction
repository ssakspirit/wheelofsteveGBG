## Used for Reseting Game 2: Contraption Craft Off

scoreboard players set .game global 2
tag @a remove craft_player
tag @a remove craft_team1
tag @a remove craft_team2
event entity @e[type=rwm:craft_crafting_part] rwm:despawn
event entity @e[type=rwm:craft_part] rwm:despawn
event entity @e[type=rwm:craft_diagram] rwm:despawn
event entity @e[type=rwm:craft_contraption] rwm:despawn
event entity @e[type=rwm:craft_board] rwm:despawn
scoreboard objectives add score dummy §6§lScore
scoreboard players set "§4Team 1" score 0
scoreboard players set "§9Team 2" score 0
function utility/games/craft/respawn_assets
structure load craft_secret_chests -3 59 3016
scoreboard objectives add craft_scores dummy craft_scores
scoreboard players set contraption_break craft_scores 0

## .gamemode value = 0 means multiplayer version. ## .gamemode value = 1 means singleplayer/restricted amount of player version. Assume multiplayer at start of game.
scoreboard players set .gamemode craft_scores 0

tp @a[scores={team=1}] -13 60 3009 0 0
tp @a[scores={team=2}] 13 60 3009 0 0
tp @a[tag=admin] 0 70 3017 180 0
##Spread Players
tp @r[scores={team=1},x=-13,y=60,z=3009,r=1] -13 60 3001 0 0
tp @r[scores={team=1},x=-13,y=60,z=3009,r=1] -13 60 3026 0 0
tp @r[scores={team=1},x=-13,y=60,z=3009,r=1] -15 60 3001 0 0
tp @r[scores={team=1},x=-13,y=60,z=3009,r=1] -11 60 3001 0 0

tp @r[scores={team=2},x=13,y=60,z=3009,r=1] 13 60 3001 0 0
tp @r[scores={team=2},x=13,y=60,z=3009,r=1] 13 60 3026 0 0
tp @r[scores={team=2},x=13,y=60,z=3009,r=1] 11 60 3001 0 0
tp @r[scores={team=2},x=13,y=60,z=3009,r=1] 15 60 3001 0 0

tag @a add craft_player
tag @a[scores={team=1}] add craft_team1
tag @a[scores={team=2}] add craft_team2

### Determine True Game Mode (If enough players are in the game then mode will not change to low player variant)
execute unless entity @a[x=-13,y=60,z=3026,r=2] run scoreboard players set .gamemode craft_scores 1
execute unless entity @a[x=13,y=60,z=3026,r=2] run scoreboard players set .gamemode craft_scores 1

##In case of 3 players in the game
execute if score .gamemode craft_scores matches 1 run tp @a[x=-13,y=60,z=3026,r=2] -15 60 3001 0 0
execute if score .gamemode craft_scores matches 1 run tp @a[x=13,y=60,z=3026,r=2] 11 60 3001 0 0
