## Used for Reseting targets for Nock it off

function utility/games/nock/upper_rail_active

##Remove old Targets
kill @e[type=rwm:nock_target]
kill @e[type=minecart]
kill @e[type=item]
kill @e[type=bat]
event entity @e[type=rwm:nock_prop] rwm:despawn
event entity @e[type=rwm:nock_minecart_hitbox] rwm:despawn
kill @e[type=rwm:nock_target]

##Summon
##Special Targets
summon rwm:nock_target -16 60 4016 facing 0 59 4000 rwm:nock_creeper_cooldown_end
summon rwm:nock_target 16 60 3984 facing 0 59 4000 rwm:nock_enderman_cooldown_end
tag @e[type=rwm:nock_target,x=-16,y=60,z=4016,r=1] add target_type_creeper
tag @e[type=rwm:nock_target,x=16,y=60,z=3984,r=1] add target_type_enderman

##Railway
summon rwm:nock_target -19 60 4000 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 0 60 4019 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 19 60 4000 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 0 60 3981 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -29 64 4000 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -21 64 4021 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 0 64 4029 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 21 64 4021 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 29 64 4000 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 21 64 3979 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 0 64 3971 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -21 64 3979 facing 0 59 4000 rwm:nock_cooldown_end
tag @e[type=rwm:nock_target,x=-19,y=60,z=4000,r=1] add target_type_minecart_lower_4
tag @e[type=rwm:nock_target,x=0,y=60,z=4019,r=1] add target_type_minecart_lower_1
tag @e[type=rwm:nock_target,x=19,y=60,z=4000,r=1] add target_type_minecart_lower_2
tag @e[type=rwm:nock_target,x=0,y=60,z=3981,r=1] add target_type_minecart_lower_3
tag @e[type=rwm:nock_target,x=-29,y=64,z=4000,r=1] add target_type_minecart_upper_4
tag @e[type=rwm:nock_target,x=-21,y=64,z=4021,r=1] add target_type_minecart_upper_5
tag @e[type=rwm:nock_target,x=0,y=64,z=4029,r=1] add target_type_minecart_upper_1
tag @e[type=rwm:nock_target,x=21,y=64,z=4021,r=1] add target_type_minecart_upper_5
tag @e[type=rwm:nock_target,x=29,y=64,z=4000,r=1] add target_type_minecart_upper_2
tag @e[type=rwm:nock_target,x=21,y=64,z=3979,r=1] add target_type_minecart_upper_5
tag @e[type=rwm:nock_target,x=0,y=64,z=3971,r=1] add target_type_minecart_upper_3
tag @e[type=rwm:nock_target,x=-21,y=64,z=3979,r=1] add target_type_minecart_upper_5

##Desert
summon rwm:nock_target -23 64 4004 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -24 64 4007 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -24 61 4013 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -27 63 4020 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -36 69 4012 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -38 69 4004 facing 0 59 4000 rwm:nock_cooldown_end
tag @e[type=rwm:nock_target,x=-23,y=64,z=4004,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=-24,y=64,z=4007,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=-24,y=61,z=4013,r=1] add target_type_3
tag @e[type=rwm:nock_target,x=-27,y=63,z=4020,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=-36,y=69,z=4012,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=-38,y=69,z=4004,r=1] add target_type_3
##Mesa
summon rwm:nock_target -16 61 4021 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -10 62 4027 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -3 61 4025 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -8 63 4032 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -13 66 4031 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -19 63 4028 facing 0 59 4000 rwm:nock_cooldown_end
tag @e[type=rwm:nock_target,x=-16,y=61,z=4021,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=-10,y=62,z=4027,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=-3,y=61,z=4025,r=1] add target_type_3
tag @e[type=rwm:nock_target,x=-8,y=63,z=4032,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=-13,y=66,z=4031,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=-19,y=63,z=4028,r=1] add target_type_3
##Savannah
summon rwm:nock_target 3 62 4030 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 9 63 4023 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 14 61 4025 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 20 62 4023 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 19 67 4028 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 5 68 4035 facing 0 59 4000 rwm:nock_cooldown_end
tag @e[type=rwm:nock_target,x=3,y=62,z=4032,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=9,y=63,z=4025,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=14,y=61,z=4025,r=1] add target_type_3
tag @e[type=rwm:nock_target,x=20,y=62,z=4023,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=19,y=67,z=4028,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=5,y=68,z=4035,r=1] add target_type_3
##Taiga
summon rwm:nock_target 20 61 4015 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 21 63 4009 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 29 61 4004 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 35 68 4004 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 30 62 4019 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 27 69 4020 facing 0 59 4000 rwm:nock_cooldown_end
tag @e[type=rwm:nock_target,x=20,y=61,z=4015,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=21,y=63,z=4009,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=29,y=61,z=4004,r=1] add target_type_3
tag @e[type=rwm:nock_target,x=35,y=68,z=4004,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=30,y=62,z=4019,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=27,y=69,z=4020,r=1] add target_type_3
##Snow
summon rwm:nock_target 22 63 3997 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 19 61 3988 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 19 67 3988 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 22 62 3979 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 33 62 3987 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 34 68 3995 facing 0 59 4000 rwm:nock_cooldown_end
tag @e[type=rwm:nock_target,x=22,y=63,z=3997,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=19,y=61,z=3988,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=19,y=67,z=3988,r=1] add target_type_3
tag @e[type=rwm:nock_target,x=22,y=62,z=3979,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=33,y=62,z=3987,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=34,y=68,z=3995,r=1] add target_type_3
##Cherry
summon rwm:nock_target 17 62 3980 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 9 62 3974 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 3 61 3974 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 6 69 3968 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 13 69 3968 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target 21 67 3971 facing 0 59 4000 rwm:nock_cooldown_end
tag @e[type=rwm:nock_target,x=17,y=62,z=3980,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=9,y=62,z=3974,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=3,y=61,z=3974,r=1] add target_type_3
tag @e[type=rwm:nock_target,x=6,y=69,z=3968,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=13,y=69,z=3968,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=21,y=67,z=3971,r=1] add target_type_3
##Forest
summon rwm:nock_target -4 62 3979 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -11 61 3980 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -21 68 3972 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -15 68 3968 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -9 62 3969 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -4 68 3964 facing 0 59 4000 rwm:nock_cooldown_end
tag @e[type=rwm:nock_target,x=-4,y=62,z=3978,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=-11,y=61,z=3980,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=-21,y=68,z=3972,r=1] add target_type_3
tag @e[type=rwm:nock_target,x=-15,y=68,z=3968,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=-9,y=62,z=3969,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=-4,y=68,z=3964,r=1] add target_type_3
##Plains
summon rwm:nock_target -19 61 3984 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -25 61 3988 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -27 61 3996 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -33 63 3994 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -32 68 3994 facing 0 59 4000 rwm:nock_cooldown_end
summon rwm:nock_target -31 63 3978 facing 0 59 4000 rwm:nock_cooldown_end
tag @e[type=rwm:nock_target,x=-19,y=61,z=3984,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=-25,y=61,z=3988,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=-27,y=61,z=3996,r=1] add target_type_3
tag @e[type=rwm:nock_target,x=-33,y=63,z=3994,r=1] add target_type_1
tag @e[type=rwm:nock_target,x=-32,y=68,z=3994,r=1] add target_type_2
tag @e[type=rwm:nock_target,x=-31,y=63,z=3978,r=1] add target_type_3

### Nock Props
##Desert
summon rwm:nock_prop -22.47 61.00 4014.52 -130.99 10.04 rwm:nock_rabbit_desert
summon rwm:nock_prop -24.74 61.00 4012.71 175.16 11.95 rwm:nock_rabbit_desert
summon rwm:nock_prop -27.77 63.00 4020.47 -144.65 21.30 rwm:nock_chicken
summon rwm:nock_prop -34.97 63.00 4006.51 -33.61 19.57 rwm:nock_camel
summon rwm:nock_prop -32.76 62.00 4013.36 -165.61 11.08 rwm:nock_rabbit_desert
summon rwm:nock_prop -23.30 60.00 4005.65 -65.83 9.35 rwm:nock_camel

##Mesa
summon rwm:nock_prop -8.33 62.00 4029.87 -152.10 10.73 rwm:nock_spider
summon rwm:nock_prop -14.63 62.00 4028.13 -170.64 15.76 rwm:nock_spider
summon rwm:nock_prop -3.35 60.00 4027.00 143.97 12.98 rwm:nock_donkey
summon rwm:nock_prop -17.10 61.00 4020.68 -108.27 25.11 rwm:nock_rabbit_desert
summon rwm:nock_prop -21.82 63.00 4029.72 -144.67 15.41 rwm:nock_spider
summon rwm:nock_prop -11.44 66.00 4033.87 -136.18 20.78 rwm:nock_donkey

##Savannah
summon rwm:nock_prop 2.55 61.00 4029.22 -141.38 16.10 rwm:nock_armadillo
summon rwm:nock_prop 20.76 62.00 4025.74 114.68 18.35 rwm:nock_armadillo
summon rwm:nock_prop 11.54 60.00 4024.73 -175.51 4.67 rwm:nock_llama
summon rwm:nock_prop 2.13 65.00 4034.79 -151.77 22.51 rwm:nock_llama
summon rwm:nock_prop 16.62 61.00 4025.48 120.05 9.17 rwm:nock_rabbit_plains
summon rwm:nock_prop 19.12 68.00 4029.67 129.04 31.17 rwm:nock_rabbit_plains

##Taiga
summon rwm:nock_prop 21.13 62.00 4016.84 125.92 32.21 rwm:nock_wolf
summon rwm:nock_prop 21.65 60.00 4010.28 86.77 9.17 rwm:nock_wolf
summon rwm:nock_prop 31.76 62.00 4017.29 68.73 24.94 rwm:nock_fox
summon rwm:nock_prop 29.30 61.00 4002.63 99.57 22.69 rwm:nock_fox
summon rwm:nock_prop 29.34 61.00 4006.80 79.30 21.13 rwm:nock_fox
summon rwm:nock_prop 22.70 60.00 4009.31 57.32 20.61 rwm:nock_rabbit_plains

##Ice
summon rwm:nock_prop 34.68 61.00 3988.28 84.69 10.90 rwm:nock_snowgolem
summon rwm:nock_prop 22.51 60.00 3994.92 72.56 2.76 rwm:nock_snowgolem
summon rwm:nock_prop 35.04 66.00 3997.14 129.56 31.87 rwm:nock_goat
summon rwm:nock_prop 18.47 60.00 3985.66 27.35 16.10 rwm:nock_goat
summon rwm:nock_prop 30.91 61.00 3993.07 122.28 20.26 rwm:nock_polarbear
summon rwm:nock_prop 26.79 62.00 3977.35 36.88 11.08 rwm:nock_polarbear

##Cherry
summon rwm:nock_prop 12.04 61.00 3974.30 116.91 16.10 rwm:nock_sniffer
summon rwm:nock_prop 17.60 60.00 3977.44 67.19 12.81 rwm:nock_sniffer
summon rwm:nock_prop 4.44 60.00 3976.80 -19.77 14.20 rwm:nock_pig
summon rwm:nock_prop 2.87 61.00 3970.95 28.22 20.78 rwm:nock_pig
summon rwm:nock_prop 17.51 62.00 3969.17 24.92 16.45 rwm:nock_chicken
summon rwm:nock_prop 10.37 72.00 3966.60 -4.54 33.77 rwm:nock_chicken

##Forest
summon rwm:nock_prop -9.12 61.87 3980.12 -33.28 15.75 rwm:nock_bee
summon rwm:nock_prop -9.58 62.53 3974.87 -13.73 10.04 rwm:nock_bee
summon rwm:nock_prop -17.13 68.22 3971.93 10.18 23.03 rwm:nock_bee
summon rwm:nock_prop -6.59 67.94 3967.08 -61.54 27.88 rwm:nock_bee
summon rwm:nock_prop -14.72 60.00 3983.29 -68.12 9.69 rwm:nock_chicken
summon rwm:nock_prop -7.23 60.00 3978.95 2.23 12.64 rwm:nock_rabbit_plains

##Plains
summon rwm:nock_prop -31.60 63.00 3979.74 -108.83 22.34 rwm:nock_cow
summon rwm:nock_prop -20.17 61.00 3983.49 -25.68 19.05 rwm:nock_sheep
summon rwm:nock_prop -27.83 61.00 3994.89 -118.88 18.01 rwm:nock_cow
summon rwm:nock_prop -21.45 60.00 3986.99 -13.55 10.38 rwm:nock_sheep
summon rwm:nock_prop -33.23 69.00 3994.47 -111.78 20.61 rwm:nock_rabbit_plains
summon rwm:nock_prop -31.42 62.00 3992.52 -66.22 24.94 rwm:nock_rabbit_plains

###Minecarts
setblock 0 59 4020 air
setblock 20 59 4000 air
setblock 0 59 3980 air
setblock -20 59 4000 air
setblock 0 64 4030 air
setblock 30 64 4000 air
setblock 0 64 3970 air
setblock -30 64 4000 air

summon minecart 1 62 4020
summon minecart 20 62 3999
summon minecart -1 62 3980
summon minecart -20 62 4001
summon minecart 30 65 4001
summon minecart 1 65 3970
summon minecart -30 65 3999
summon minecart -1 65 4030

ride @e[type=minecart] summon_rider rwm:nock_minecart_hitbox 
ride @e[type=rwm:nock_minecart_hitbox] summon_rider rwm:nock_target rwm:nock_cooldown_end
tag @e[type=rwm:nock_target,x=1,y=63,z=4020,r=1] add target_type_minecart_rider
tag @e[type=rwm:nock_target,x=20,y=63,z=3999,r=1] add target_type_minecart_rider
tag @e[type=rwm:nock_target,x=-1,y=63,z=3980,r=1] add target_type_minecart_rider
tag @e[type=rwm:nock_target,x=-20,y=63,z=4001,r=1] add target_type_minecart_rider
tag @e[type=rwm:nock_target,x=30,y=66,z=4001,r=1] add target_type_minecart_rider
tag @e[type=rwm:nock_target,x=1,y=66,z=3970,r=1] add target_type_minecart_rider
tag @e[type=rwm:nock_target,x=-30,y=66,z=3999,r=1] add target_type_minecart_rider
tag @e[type=rwm:nock_target,x=-1,y=66,z=4030,r=1] add target_type_minecart_rider