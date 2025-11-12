## Run to reset all players teams (except admin observers)
scoreboard players set .team1players global 0
scoreboard players set .team2players global 0
scoreboard players set @a[tag=!admin] team 0

## Admin observers stay as team 0 and keep spectator mode
execute as @a[tag=admin] run gamemode spectator @s