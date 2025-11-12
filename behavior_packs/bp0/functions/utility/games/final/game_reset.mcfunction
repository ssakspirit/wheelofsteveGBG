## Used for Reseting Game 6: Final Showdown
tag @a remove final_players
tag @a remove final_spectators
scoreboard players set .game global 6
kill @e[type=rwm:final_marker]
scoreboard objectives add final_showdown_score dummy "§b§lFinal Showdown Scores"
scoreboard objectives setdisplay sidebar final_showdown_score
scoreboard players set @a[tag=final_players,tag=!final_eliminated] final_showdown_score 0


##Who is competeing?
execute if score .team1wins global > .team2wins global run tag @a[scores={team=1}] add final_players
execute if score .team1wins global > .team2wins global run tag @a[scores={team=2}] add final_spectators

execute if score .team2wins global > .team1wins global run tag @a[scores={team=2}] add final_players
execute if score .team2wins global > .team1wins global run tag @a[scores={team=1}] add final_spectators

#Insert Better Start Points once players get their tags.
tp @a[tag=final_players] 0 317 6238 180 0
tp @a[tag=final_spectators] 1 176 6208 180 0
tp @a[tag=admin] 1 330 6208 180 0
##Spread Players

tp @r[tag=final_players,x=0,y=317,z=6238,r=1] 1 304 6228 180 0
tp @r[tag=final_players,x=0,y=317,z=6238,r=1] 0 304 6228 180 0
tp @r[tag=final_players,x=0,y=317,z=6238,r=1] 2 304 6228 180 0
tp @r[tag=final_players,x=0,y=317,z=6238,r=1]-1 304 6228 180 0