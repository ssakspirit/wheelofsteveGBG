## Used for initializing scoreboards
scoreboard objectives remove team 
scoreboard objectives remove global
scoreboard objectives remove player
scoreboard objectives remove projectile_time
scoreboard objectives remove team_scores
scoreboard objectives add global dummy global
scoreboard objectives add team dummy team
scoreboard objectives add player dummy player
scoreboard objectives add projectile_time dummy projectile_time
scoreboard objectives add team_scores dummy "§6§lTeam Scores"
scoreboard players set @a[x=-203,y=67,z=1055,dx=8,dy=8,dz=8] team 0
scoreboard players set .team1players global 0
scoreboard players set .team2players global 0
scoreboard players set .team1wins global 0
scoreboard players set .team2wins global 0
scoreboard players set .act global 0
scoreboard players set .seq global 0
scoreboard players set .run global 0
scoreboard players set .act2 global 0
scoreboard players set .seq2 global 0
scoreboard players set .run2 global 0
scoreboard players set .actionbar.objective global 0
scoreboard players set .subtitle.objective global 0
scoreboard players set .game global 0
scoreboard players set .tick global 0
scoreboard players set .tick10 global 0
scoreboard players set .debuff_timer global 0
###(Games 1-6 correspond to a game)

#scoreboard players set .game_mode global 1
###(.game_mode=1 is singleplayer, .game_mode=0 is multiplayer)

## Game Scores
scoreboard objectives add score dummy §6§lScore
scoreboard players set "§4Team 1" score 0
scoreboard players set "§9Team 2" score 0
scoreboard objectives setdisplay sidebar team_scores
scoreboard players set "§4Team 1" team_scores 0
scoreboard players set "§9Team 2" team_scores 0

##Tickingareas
##tickingarea remove orb.arena
##tickingarea remove craft.arena
##tickingarea remove grid.arena
##tickingarea remove nock.arena
##tickingarea remove elytra.arena
##tickingarea remove finale.arena
##tickingarea remove lobby.arena

tickingarea add circle 0 65 1998 4 orb.arena
tickingarea add circle 0 66 3019 4 craft.arena
tickingarea add circle -33 63 -95 4 grid.arena
tickingarea add circle 0 59 4000 4 nock.arena
tickingarea add circle -79 76 5089 4 elytra.arena
tickingarea add circle 0 303 6226 4 finale.arena
tickingarea add circle 0 59 1026 4 lobby.arena

## Scores for Players
## Assign .team in the lobby. Players can change this at the team station. Team 1 has a score of 1. Team 2 has a score of 2. Player's without a team are team 0.
## Assign .player when a player joins a team. Check the .team#players of .global and assign players a score based on what number they are the team. So for the second player on team 1: #execute if score .team1players global matches 0 execute as @a[scores={.team=1},#areaselector#] run function add player

