## Lobby Particles

execute if score .tick global matches 1 run particle rwm:logo_orb 1.0 69.0 1043.9
execute if score .tick global matches 1 run particle rwm:logo_nock 11.0 69.0 1041.9
execute if score .tick global matches 1 run particle rwm:logo_elytra 20.5 69.0 1039.9
execute if score .tick global matches 1 run particle rwm:logo_craft -9.0 69.0 1041.9
execute if score .tick global matches 1 run particle rwm:logo_grid -19.0 69.0 1039.9

execute if score .tick global matches 1..5 run particle rwm:mist 1.0 63.5 1044.4
execute if score .tick global matches 1..5  run particle rwm:mist 11.0 63.5 1042.4
execute if score .tick global matches 1..5  run particle rwm:mist 20.5 63.5 1040.4
execute if score .tick global matches 1..5  run particle rwm:mist -9.0 63.5 1042.4
execute if score .tick global matches 1..5  run particle rwm:mist -19.0 63.5 1040.4

execute unless score .act global matches 2 run execute if score .tick global matches 1 run execute if entity @e[type=rwm:wheel_of_steve,tag=game1_played] run particle rwm:game_check 1.0 67.5 1043.9
execute unless score .act global matches 2 run execute if score .tick global matches 1 run execute if entity @e[type=rwm:wheel_of_steve,tag=game4_played] run particle rwm:game_check 11.0 67.5 1041.9
execute unless score .act global matches 2 run execute if score .tick global matches 1 run execute if entity @e[type=rwm:wheel_of_steve,tag=game5_played] run particle rwm:game_check 21.0 67.5 1039.9
execute unless score .act global matches 2 run execute if score .tick global matches 1 run execute if entity @e[type=rwm:wheel_of_steve,tag=game2_played] run particle rwm:game_check -9.0 67.5 1041.9
execute unless score .act global matches 2 run execute if score .tick global matches 1 run execute if entity @e[type=rwm:wheel_of_steve,tag=game3_played] run particle rwm:game_check -19.0 67.5 1039.9

### Starting Void
execute if score .tick global matches 1 run particle rwm:lobby_keyart 0.5 23 3.95
execute if score .tick global matches 1 run particle rwm:interact 0.5 21.5 2.95