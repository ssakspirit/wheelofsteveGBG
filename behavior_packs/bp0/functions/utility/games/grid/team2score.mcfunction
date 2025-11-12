## Used for when team 2 scores

fill -46 61 -79 -43 64 -79 air
fill -24 61 -79 -21 64 -79 air
playsound random.levelup @a[scores={team=2}]
playsound random.explode @a[scores={team=1}]
scoreboard players add "§9Team 2" score 1
function utility/games/grid/new_pattern
summon minecraft:fireworks_rocket -19 60 -79
summon minecraft:fireworks_rocket -26 60 -79