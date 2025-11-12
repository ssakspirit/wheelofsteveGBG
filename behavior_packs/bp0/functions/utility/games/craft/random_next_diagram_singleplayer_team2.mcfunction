## Used for Randomly Choosing the next diagram and giving a score for team2.



#Randomize the Score
scoreboard players set diagram_board_solo_team2 craft_scores 0
execute if score diagram_board_solo_team2 craft_scores matches 0 run event entity @e[type=rwm:craft_board,x=13,y=62,z=3019,r=1,c=1] rwm:board_blank
scoreboard players random diagram_board_solo_team2 craft_scores 1 5

execute if score diagram_board_solo_team2 craft_scores matches 1 run event entity @e[type=rwm:craft_board,x=13,y=62,z=3019,r=1,c=1] rwm:board_1
execute if score diagram_board_solo_team2 craft_scores matches 2 run event entity @e[type=rwm:craft_board,x=13,y=62,z=3019,r=1,c=1] rwm:board_2
execute if score diagram_board_solo_team2 craft_scores matches 3 run event entity @e[type=rwm:craft_board,x=13,y=62,z=3019,r=1,c=1] rwm:board_3
execute if score diagram_board_solo_team2 craft_scores matches 4 run event entity @e[type=rwm:craft_board,x=13,y=62,z=3019,r=1,c=1] rwm:board_4
execute if score diagram_board_solo_team2 craft_scores matches 5 run event entity @e[type=rwm:craft_board,x=13,y=62,z=3019,r=1,c=1] rwm:board_5

