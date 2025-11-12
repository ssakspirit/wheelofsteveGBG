## team1 scores on elytra rumble
scoreboard players add "§4Team 1" score 1
camerashake add @a 1 1 positional
playsound ambient.weather.thunder @a ~ ~ ~ 0.5 0.5
summon fireworks_rocket -53 107 5084
summon fireworks_rocket -60 107 5084
summon fireworks_rocket -60 107 5091
summon fireworks_rocket -53 107 5091
execute if score "§4Team 1" score matches 2 run structure load elytra_tower_blue_1 -59 95 5109
execute if score "§4Team 1" score matches 4 run structure load elytra_tower_blue_2 -59 95 5109
execute if score "§4Team 1" score matches 6 run structure load elytra_tower_blue_3 -59 95 5109
execute if score "§4Team 1" score matches 8 run structure load elytra_tower_blue_4 -59 95 5109
execute if score "§4Team 1" score matches 10 run structure load elytra_tower_blue_5 -59 95 5109
