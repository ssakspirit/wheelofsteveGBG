### Successful Crafting
event entity @e[type=rwm:craft_board,x=-13,y=62,z=3019,r=1,c=1] rwm:board_blank
summon fireworks_rocket -12 61 3015
summon fireworks_rocket -14 61 3015
summon fireworks_rocket -13 61 3014
summon fireworks_rocket -12 61 3013
summon fireworks_rocket -14 61 3013
clone -3 60 3021 -3 60 3021 -2 61 3018
fill -2 61 3018 -2 61 3018 air destroy
kill @e[type=item,name=chest]
tp @e[type=item,x=-2,y=61,z=3018,r=2] -10 61 3023
function utility/games/craft/crafting/team1_grid_clear
execute as @a[scores={team=1}] run playsound note.harp @a[scores={team=1}] ~ ~ ~ 1 2