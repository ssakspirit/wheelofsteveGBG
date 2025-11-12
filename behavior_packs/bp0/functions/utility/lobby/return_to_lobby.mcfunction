## Run to replace a player's loadout when returning to the lobby.

tp @a 1.0 60 1000 0 0
spawnpoint @a 1.0 60 1000
function utility/fogs/clear
scoreboard players set .game global 0
execute if score .wheelgame global matches 1 run scoreboard players set .wheelgame global 0

# Ensure admin observers can move and have proper permissions
inputpermission set @a[tag=admin] movement enabled
inputpermission set @a[tag=admin] camera enabled
gamemode creative @a[tag=admin]

#Update Team Scores
scoreboard players operation "§4Team 1" team_scores = .team1wins global
scoreboard players operation "§9Team 2" team_scores = .team2wins global
scoreboard objectives setdisplay sidebar team_scores

#Uniform:
replaceitem entity @a[scores={team=1}] slot.armor.chest 0 iron_chestplate 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=1}] slot.armor.legs 0 iron_leggings 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=1}] slot.armor.feet 0 iron_boots 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=2}] slot.armor.chest 0 diamond_chestplate 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=2}] slot.armor.legs 0 diamond_leggings 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=2}] slot.armor.feet 0 diamond_boots 1 0 {"item_lock": {"mode": "lock_in_slot"}}

# Give admin observers their golden armor back
replaceitem entity @a[tag=admin] slot.armor.head 0 golden_helmet 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=admin] slot.armor.chest 0 golden_chestplate 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=admin] slot.armor.legs 0 golden_leggings 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=admin] slot.armor.feet 0 golden_boots 1 0 {"item_lock": {"mode": "lock_in_slot"}}

replaceitem entity @a slot.hotbar 0 air
replaceitem entity @a slot.hotbar 1 air
replaceitem entity @a slot.hotbar 2 air
replaceitem entity @a slot.hotbar 3 air
replaceitem entity @a slot.hotbar 4 air
replaceitem entity @a slot.hotbar 5 air
replaceitem entity @a slot.hotbar 6 air
replaceitem entity @a slot.hotbar 7 air
replaceitem entity @a slot.hotbar 8 air
replaceitem entity @a slot.inventory 0 air
replaceitem entity @a slot.inventory 1 air
replaceitem entity @a slot.inventory 2 air
replaceitem entity @a slot.inventory 3 air
replaceitem entity @a slot.inventory 4 air
replaceitem entity @a slot.inventory 5 air
replaceitem entity @a slot.inventory 6 air
replaceitem entity @a slot.inventory 7 air
replaceitem entity @a slot.inventory 8 air
replaceitem entity @a slot.inventory 9 air
replaceitem entity @a slot.inventory 10 air
replaceitem entity @a slot.inventory 11 air
replaceitem entity @a slot.inventory 12 air
replaceitem entity @a slot.inventory 13 air
replaceitem entity @a slot.inventory 14 air
replaceitem entity @a slot.inventory 15 air
replaceitem entity @a slot.inventory 16 air
replaceitem entity @a slot.inventory 17 air
replaceitem entity @a slot.inventory 18 air
replaceitem entity @a slot.inventory 19 air
replaceitem entity @a slot.inventory 20 air
replaceitem entity @a slot.inventory 21 air
replaceitem entity @a slot.inventory 22 air
replaceitem entity @a slot.inventory 23 air
replaceitem entity @a slot.inventory 24 air
replaceitem entity @a slot.inventory 25 air
replaceitem entity @a slot.inventory 26 air
replaceitem entity @a slot.inventory 27 air
replaceitem entity @a slot.inventory 27 air
replaceitem entity @a slot.weapon.offhand 0 air

##If a Team has more than 3 points
execute if score "§4Team 1" team_scores matches 3.. run scoreboard players set .act2 global 003
execute if score "§4Team 1" team_scores matches 3.. run scoreboard players set .seq2 global 0
execute if score "§4Team 1" team_scores matches 3.. run scoreboard players set .run2 global 1

execute if score "§9Team 2" team_scores matches 3.. run scoreboard players set .act2 global 003
execute if score "§9Team 2" team_scores matches 3.. run scoreboard players set .seq2 global 0
execute if score "§9Team 2" team_scores matches 3.. run scoreboard players set .run2 global 1