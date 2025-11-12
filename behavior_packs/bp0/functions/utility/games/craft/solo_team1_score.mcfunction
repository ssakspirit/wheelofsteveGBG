## Used for when Team 1 Scores in solo.
kill @e[type=item,x=-10,y=61,z=3023,r=2]
scoreboard players add "§4Team 1" score 1
execute if score "§4Team 1" score matches 8 run function utility/games/craft/solo_gameover
execute unless score "§4Team 1" score matches 8 run function utility/games/craft/random_next_diagram_singleplayer_team1

