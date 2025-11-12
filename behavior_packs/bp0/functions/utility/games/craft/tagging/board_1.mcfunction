## Tag the rwm:craft_board entity with the current board tag.

tag @s remove board_1
tag @s remove board_2
tag @s remove board_3
tag @s remove board_4
tag @s remove board_5
tag @s remove board_blank

tag @s add board_1
execute as @s[tag=board_1,x=-13,y=62,z=3019,r=1] run playsound item.book.page_turn @a[scores={team=1}] ~ ~ ~ 1 1
execute as @s[tag=board_1,x=13,y=62,z=3019,r=1] run playsound item.book.page_turn @a[scores={team=2}] ~ ~ ~ 1 1