## Seq for Game 4 (Nock it off) (Act401)
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 00 run scoreboard players set .subtitle.objective global 0
execute if score .seq global matches 02 run inputpermission set @a[tag=!admin] movement disabled
execute if score .seq global matches 02 run /function utility/fogs/g4_fog
execute if score .seq global matches 05 run /function utility/games/nock/game_reset
execute if score .seq global matches 10 run /function utility/games/nock/game_reset
execute if score .seq global matches 20 run /function utility/tickingarea_remove

## Cutscene
execute if score .seq global matches 01 run hud @a hide
execute if score .seq global matches 01 run camera @a clear
execute if score .seq global matches 02 run camera @a fade time 0.1 2 1


## Team 1 Cutscene
execute if score .seq global matches 20 run /camera @a[scores={team=1}] set minecraft:free pos -12.2 68.7 4012 facing 0 64 4000
execute if score .seq global matches 21 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos 12.2 67.7 4012 facing 0 64 4000
execute if score .seq global matches 221 run /camera @a[scores={team=1}] set minecraft:free ease 8 in_out_quad pos 12.2 66.7 3989 facing 0 64 4000
execute if score .seq global matches 381 run /camera @a[scores={team=1}] set minecraft:free ease 8 in_out_quad pos -12.2 65.7 3989 facing 0 64 4000

## Admin Observer Cutscene (follows Team 1)
execute if score .seq global matches 20 run /camera @a[tag=admin] set minecraft:free pos -12.2 68.7 4012 facing 0 64 4000
execute if score .seq global matches 21 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos 12.2 67.7 4012 facing 0 64 4000
execute if score .seq global matches 221 run /camera @a[tag=admin] set minecraft:free ease 8 in_out_quad pos 12.2 66.7 3989 facing 0 64 4000
execute if score .seq global matches 381 run /camera @a[tag=admin] set minecraft:free ease 8 in_out_quad pos -12.2 65.7 3989 facing 0 64 4000

## Team 2 Cutscene
execute if score .seq global matches 20 run /camera @a[scores={team=2}] set minecraft:free pos -12.2 68.7 4012 facing 0 64 4000
execute if score .seq global matches 21 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 12.2 67.7 4012 facing 0 64 4000
execute if score .seq global matches 221 run /camera @a[scores={team=2}] set minecraft:free ease 8 in_out_quad pos 12.2 66.7 3989 facing 0 64 4000
execute if score .seq global matches 381 run /camera @a[scores={team=2}] set minecraft:free ease 8 in_out_quad pos -12.2 65.7 3989 facing 0 64 4000


##Across both Team Cutscenes
##Actionbar
execute if score .seq global matches 20 run scoreboard players set .actionbar.objective global 401
execute if score .seq global matches 100 run scoreboard players set .actionbar.objective global 402
execute if score .seq global matches 200 run scoreboard players set .actionbar.objective global 403
execute if score .seq global matches 300 run scoreboard players set .actionbar.objective global 404
execute if score .seq global matches 440 run scoreboard players set .actionbar.objective global 405

#Events in the cutscene
execute if score .seq global matches 100 run execute unless entity @e[type=rwm:nock_target] run function utility/games/nock/respawn_targets
execute if score .seq global matches 500 run function utility/games/nock/player_loadout

### Done with Cutscenes
execute if score .seq global matches 480 run camera @a fade time 1 2 1
execute if score .seq global matches 480 run function utility/games/nock/upper_rail_active
execute if score .seq global matches 490 run function utility/games/nock/upper_rail_active
execute if score .seq global matches 500 run function utility/games/nock/upper_rail_active
execute if score .seq global matches 510 run camera @a set minecraft:first_person
execute if score .seq global matches 511 run camera @a clear
execute if score .seq global matches 510 run hud @a reset
execute if score .seq global matches 510 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 512 run camera @a clear


### Start Countdown
execute if score .seq global matches 540 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.1"}]}
execute if score .seq global matches 540 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.0
execute if score .seq global matches 560 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.2"}]}
execute if score .seq global matches 560 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.1
execute if score .seq global matches 580 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.3"}]}
execute if score .seq global matches 580 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.2
execute if score .seq global matches 600 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.4"}]}
execute if score .seq global matches 600 run scoreboard players set .actionbar.objective global 406
execute if score .seq global matches 600 run /execute at @a run /playsound horn.call.0 @a ~ ~ ~ 1 2.0

#Displayed Scoreboard
execute if score .seq global matches 02 run scoreboard objectives setdisplay sidebar
execute if score .seq global matches 600 run scoreboard objectives add score dummy §6§lScore
execute if score .seq global matches 600 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 600 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 600 run scoreboard objectives setdisplay sidebar score

### At game start (Difference Old 1160 New 600)
execute if score .seq global matches 600 run summon rwm:timer 0 90 4000 0 0 rwm:timer_nock
execute if score .seq global matches 600 run /execute as @a run playsound record.wait @a ~ ~ ~ 1 1.25
execute if score .game_mode global matches 1 run execute if score .seq global matches 600 run inputpermission set @a movement enabled

### Active till Game Over
execute if score .seq global matches 200..4160 run execute if score .tick10 global matches 1 run function utility/games/nock/random_creeper_target
execute if score .seq global matches 200..4160 run execute if score .tick10 global matches 101 run function utility/games/nock/random_enderman_target

execute if score .seq global matches 600..4160 run function utility/games/nock/game_tagging

### Singleplayer Scoring
execute if score .seq global matches 600..4160 run execute if score .tick10 global matches 80 run execute if score .game_mode global matches 1 run execute unless entity @a[scores={team=1}] run scoreboard players add "§4Team 1" score 1
execute if score .seq global matches 600..4160 run execute if score .tick10 global matches 180 run execute if score .game_mode global matches 1 run execute unless entity @a[scores={team=1}] run scoreboard players add "§4Team 1" score 2
execute if score .seq global matches 600..4160 run execute if score .tick10 global matches 80 run execute if score .game_mode global matches 1 run execute unless entity @a[scores={team=2}] run scoreboard players add "§9Team 2" score 1
execute if score .seq global matches 600..4160 run execute if score .tick10 global matches 180 run execute if score .game_mode global matches 1 run execute unless entity @a[scores={team=2}] run scoreboard players add "§9Team 2" score 2

### Game Over
execute if score .seq global matches 4160 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 4160 run /kill @e[type=rwm:timer]

### Who Wins?
execute if score .seq global matches 4170 run execute if score "§4Team 1" score > "§9Team 2" score run /function utility/wins/team1
execute if score .seq global matches 4170 run execute if score "§9Team 2" score > "§4Team 1" score run /function utility/wins/team2
execute if score .seq global matches 4170 run execute if score "§4Team 1" score = "§9Team 2" score run /function utility/wins/tie

execute if score .seq global matches 4240 run scoreboard players set .subtitle.objective global 0
### Return to Lobby
execute if score .seq global matches 4240 run /kill @e[type=rwm:nock_target]
execute if score .seq global matches 4250 run function utility/lobby/return_to_lobby
execute if score .seq global matches 4240 run inputpermission set @a movement enabled
execute if score .seq global matches 4240 run clear @a bow
execute if score .seq global matches 4240 run clear @a arrow
execute if score .seq global matches 4240 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 4240 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 4240 run tag @a remove nock_player
execute if score .seq global matches 4240 run tag @a remove nock_team1
execute if score .seq global matches 4240 run tag @a remove nock_team2
execute if score .seq global matches 4240 run camera @a clear
execute if score .seq global matches 4240 run scoreboard objectives remove projectile_time

# Finished, Setup for next act
execute if score .seq global matches 4280 run /function utility/tickingarea_add
execute if score .seq global matches 4280  run scoreboard players set .act global 0
execute if score .seq global matches 4280  run function loops/new_act