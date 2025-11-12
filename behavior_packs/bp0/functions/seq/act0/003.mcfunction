## Seq for Triggering Final_Showdown
## Wait a few seconds to be ready.
execute if score .seq2 global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq2 global matches 40 run /function utility/tickingarea_add

#Singleplayer lost skip Final Showdown?
execute if score .seq2 global matches 20 run execute if score .game_mode global matches 1 run execute if score "§4Team 1" team_scores matches 3.. run execute if entity @a[scores={team=2}] run scoreboard players set .seq2 global 110
execute if score .seq2 global matches 20 run execute if score .game_mode global matches 1 run execute if score "§9Team 2" team_scores matches 3.. run execute if entity @a[scores={team=1}] run scoreboard players set .seq2 global 110

#Singleplayer? (Allows the Player to play the Final Showdown regardless of how they did)
#execute if score .seq2 global matches 80 run execute if score .game_mode global matches 1 run execute if entity @a[scores={team=1}] run scoreboard players set .team1wins global 100
#execute if score .seq2 global matches 80 run execute if score .game_mode global matches 1 run execute if entity @a[scores={team=2}] run scoreboard players set .team2wins global 100

#Trigger Final Showdown
execute if score .seq2 global matches 100 run function utility/games/final/game_start

#Reset Teams scores on Singleplayer skip
execute if score .seq2 global matches 115 run execute if score .game_mode global matches 1 run execute if score "§4Team 1" team_scores matches 3.. run execute if entity @a[scores={team=2}] run scoreboard players set .team1wins global 0
execute if score .seq2 global matches 115 run execute if score .game_mode global matches 1 run execute if score "§4Team 1" team_scores matches 3.. run execute if entity @a[scores={team=2}] run scoreboard players set .team2wins global 0

execute if score .seq2 global matches 115 run execute if score .game_mode global matches 1 run execute if score "§9Team 2" team_scores matches 3.. run execute if entity @a[scores={team=1}] run scoreboard players set .team1wins global 0
execute if score .seq2 global matches 115 run execute if score .game_mode global matches 1 run execute if score "§9Team 2" team_scores matches 3.. run execute if entity @a[scores={team=1}] run scoreboard players set .team2wins global 0

execute if score .seq2 global matches 116 run scoreboard players operation "§4Team 1" team_scores = .team1wins global
execute if score .seq2 global matches 116 run scoreboard players operation "§9Team 2" team_scores = .team2wins global
execute if score .seq2 global matches 116 run scoreboard objectives setdisplay sidebar team_scores

##Reset
execute if score .seq2 global matches 120 run scoreboard players set .act2 global 0
execute if score .seq2 global matches 120 run function loops/new_act2