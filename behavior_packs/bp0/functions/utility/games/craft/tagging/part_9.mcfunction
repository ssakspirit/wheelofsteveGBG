## Tag the rwm:craft_crafting entity with the current part tag.

tag @s remove part_1
tag @s remove part_2
tag @s remove part_3
tag @s remove part_4
tag @s remove part_5
tag @s remove part_6
tag @s remove part_7
tag @s remove part_8
tag @s remove part_9
tag @s remove part_10
tag @s remove part_11
tag @s remove part_12
tag @s remove part_null

tag @s add part_9
execute as @s[x=-13,y=61,z=3014,r=3] run playsound block.lantern.place @a[scores={team=1}] -13 60 3014 0.5
execute as @s[x=13,y=61,z=3014,r=3] run playsound block.lantern.place @a[scores={team=2}] 13 60 3014 0.5
execute as @s run particle rwm:craft_crafting ~ ~ ~