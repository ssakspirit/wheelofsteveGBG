## Run when joining a team.

tellraw @s {"rawtext":[{"translate":"chat.join.team.2"}]}
execute if entity @s[scores={team=1}] run scoreboard players remove .team1players global 1
scoreboard players set @s team 2
scoreboard players add .team2players global 1

#Uniform:
replaceitem entity @a[scores={team=2}] slot.armor.chest 0 diamond_chestplate 1 0  {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=2}] slot.armor.legs 0 diamond_leggings 1 0  {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=2}] slot.armor.feet 0 diamond_boots 1 0  {"item_lock": {"mode": "lock_in_slot"}}

tag @s remove team2joining