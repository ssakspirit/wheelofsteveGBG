## Used for Resetting entities in Contraption Craft Off

##Remove old entities
event entity @e[type=rwm:craft_crafting_part] rwm:despawn
event entity @e[type=rwm:craft_part] rwm:despawn
event entity @e[type=rwm:craft_diagram] rwm:despawn
event entity @e[type=rwm:craft_contraption] rwm:despawn
event entity @e[type=rwm:craft_board] rwm:despawn
kill @e[type=rwm:timer]
kill @e[type=minecraft:item]
kill @e[type=rwm:orb_enemy]

##Summon
### Table 1
summon rwm:craft_crafting_part -14 61 3013 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part -13 61 3013 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part -12 61 3013 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part -14 61 3014 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part -13 61 3014 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part -12 61 3014 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part -14 61 3015 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part -13 61 3015 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part -12 61 3015 0 0 rwm:craft_crafting_null
### Table 2
summon rwm:craft_crafting_part 12 61 3013 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part 13 61 3013 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part 14 61 3013 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part 12 61 3014 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part 13 61 3014 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part 14 61 3014 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part 12 61 3015 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part 13 61 3015 0 0 rwm:craft_crafting_null
summon rwm:craft_crafting_part 14 61 3015 0 0 rwm:craft_crafting_null
### Parts
## Team 1
summon rwm:craft_part -24 61 3011 0 0 rwm:part_1
summon rwm:craft_part -24 61 3009 0 0 rwm:part_1
summon rwm:craft_part -24 61 3007 0 0 rwm:part_2
summon rwm:craft_part -24 61 3005 0 0 rwm:part_2
summon rwm:craft_part -24 63 3011 0 0 rwm:part_3
summon rwm:craft_part -24 63 3009 0 0 rwm:part_3
summon rwm:craft_part -24 63 3007 0 0 rwm:part_4
summon rwm:craft_part -24 63 3005 0 0 rwm:part_4

summon rwm:craft_part -16 61 2997 0 0 rwm:part_5
summon rwm:craft_part -14 61 2997 0 0 rwm:part_5
summon rwm:craft_part -12 61 2997 0 0 rwm:part_6
summon rwm:craft_part -10 61 2997 0 0 rwm:part_6
summon rwm:craft_part -16 63 2997 0 0 rwm:part_7
summon rwm:craft_part -14 63 2997 0 0 rwm:part_7
summon rwm:craft_part -12 63 2997 0 0 rwm:part_8
summon rwm:craft_part -10 63 2997 0 0 rwm:part_8

summon rwm:craft_part -2 61 3005 0 0 rwm:part_9
summon rwm:craft_part -2 61 3007 0 0 rwm:part_9
summon rwm:craft_part -2 61 3009 0 0 rwm:part_10
summon rwm:craft_part -2 61 3011 0 0 rwm:part_10
summon rwm:craft_part -2 63 3005 0 0 rwm:part_11
summon rwm:craft_part -2 63 3007 0 0 rwm:part_11
summon rwm:craft_part -2 63 3009 0 0 rwm:part_12
summon rwm:craft_part -2 63 3011 0 0 rwm:part_12

## Team 2
summon rwm:craft_part 2 61 3011 0 0 rwm:part_1
summon rwm:craft_part 2 61 3009 0 0 rwm:part_1
summon rwm:craft_part 2 61 3007 0 0 rwm:part_2
summon rwm:craft_part 2 61 3005 0 0 rwm:part_2
summon rwm:craft_part 2 63 3011 0 0 rwm:part_3
summon rwm:craft_part 2 63 3009 0 0 rwm:part_3
summon rwm:craft_part 2 63 3007 0 0 rwm:part_4
summon rwm:craft_part 2 63 3005 0 0 rwm:part_4

summon rwm:craft_part 10 61 2997 0 0 rwm:part_5
summon rwm:craft_part 12 61 2997 0 0 rwm:part_5
summon rwm:craft_part 14 61 2997 0 0 rwm:part_6
summon rwm:craft_part 16 61 2997 0 0 rwm:part_6
summon rwm:craft_part 10 63 2997 0 0 rwm:part_7
summon rwm:craft_part 12 63 2997 0 0 rwm:part_7
summon rwm:craft_part 14 63 2997 0 0 rwm:part_8
summon rwm:craft_part 16 63 2997 0 0 rwm:part_8

summon rwm:craft_part 24 61 3005 0 0 rwm:part_9
summon rwm:craft_part 24 61 3007 0 0 rwm:part_9
summon rwm:craft_part 24 61 3009 0 0 rwm:part_10
summon rwm:craft_part 24 61 3011 0 0 rwm:part_10
summon rwm:craft_part 24 63 3005 0 0 rwm:part_11
summon rwm:craft_part 24 63 3007 0 0 rwm:part_11
summon rwm:craft_part 24 63 3009 0 0 rwm:part_12
summon rwm:craft_part 24 63 3011 0 0 rwm:part_12

###Boards
summon rwm:craft_board -13 62 3019 0 0 rwm:board_blank
summon rwm:craft_board 13 62 3019 0 0 rwm:board_blank

### Contraptions
###Team 1
summon rwm:craft_contraption -4.0 61.0 3029.0 90 0 rwm:contraption_1_fixed
summon rwm:craft_contraption -4.0 61.0 3033.0 90 0 rwm:contraption_2_fixed
summon rwm:craft_contraption -4.0 61.0 3037.0 90 0 rwm:contraption_3_fixed
summon rwm:craft_contraption -4.0 61.0 3041.0 90 0 rwm:contraption_4_fixed
summon rwm:craft_contraption -4.0 61.0 3045.0 90 0 rwm:contraption_5_fixed
###Team 2
summon rwm:craft_contraption 5.0 61.0 3029.0 -90 0 rwm:contraption_5_fixed
summon rwm:craft_contraption 5.0 61.0 3033.0 -90 0 rwm:contraption_4_fixed
summon rwm:craft_contraption 5.0 61.0 3037.0 -90 0 rwm:contraption_3_fixed
summon rwm:craft_contraption 5.0 61.0 3041.0 -90 0 rwm:contraption_2_fixed
summon rwm:craft_contraption 5.0 61.0 3045.0 -90 0 rwm:contraption_1_fixed

tag @e[type=rwm:craft_contraption] add fixed
tag @e[type=rwm:craft_contraption,x=-4,y=61,z=3045,r=1] add contraption_5
tag @e[type=rwm:craft_contraption,x=5,y=61,z=3029,r=1] add contraption_5
tag @e[type=rwm:craft_contraption,x=-4,y=61,z=3041,r=1] add contraption_4
tag @e[type=rwm:craft_contraption,x=5,y=61,z=3033,r=1] add contraption_4
tag @e[type=rwm:craft_contraption,x=-4,y=61,z=3037,r=1] add contraption_3
tag @e[type=rwm:craft_contraption,x=5,y=61,z=3037,r=1] add contraption_3
tag @e[type=rwm:craft_contraption,x=-4,y=61,z=3033,r=1] add contraption_2
tag @e[type=rwm:craft_contraption,x=5,y=61,z=3041,r=1] add contraption_2
tag @e[type=rwm:craft_contraption,x=-4,y=61,z=3029,r=1] add contraption_1
tag @e[type=rwm:craft_contraption,x=5,y=61,z=3045,r=1] add contraption_1

tag @e[type=rwm:craft_contraption,x=-4,y=61,z=3045,r=1] add contraption_team1
tag @e[type=rwm:craft_contraption,x=5,y=61,z=3029,r=1] add contraption_team2
tag @e[type=rwm:craft_contraption,x=-4,y=61,z=3041,r=1] add contraption_team1
tag @e[type=rwm:craft_contraption,x=5,y=61,z=3033,r=1] add contraption_team2
tag @e[type=rwm:craft_contraption,x=-4,y=61,z=3037,r=1] add contraption_team1
tag @e[type=rwm:craft_contraption,x=5,y=61,z=3037,r=1] add contraption_team2
tag @e[type=rwm:craft_contraption,x=-4,y=61,z=3033,r=1] add contraption_team1
tag @e[type=rwm:craft_contraption,x=5,y=61,z=3041,r=1] add contraption_team2
tag @e[type=rwm:craft_contraption,x=-4,y=61,z=3029,r=1] add contraption_team1
tag @e[type=rwm:craft_contraption,x=5,y=61,z=3045,r=1] add contraption_team2

