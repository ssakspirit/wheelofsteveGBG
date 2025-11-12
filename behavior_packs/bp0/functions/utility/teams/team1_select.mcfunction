## Run when joining a team.

tellraw @s {"rawtext":[{"translate":"chat.join.team.1"}]}
execute if entity @s[scores={team=2}] run scoreboard players remove .team2players global 1
scoreboard players set @s team 1
scoreboard players add .team1players global 1

#Uniform:
replaceitem entity @a[scores={team=1}] slot.armor.chest 0 iron_chestplate 1 0  {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=1}] slot.armor.legs 0 iron_leggings 1 0  {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=1}] slot.armor.feet 0 iron_boots 1 0  {"item_lock": {"mode": "lock_in_slot"}}
tag @s remove team1joining