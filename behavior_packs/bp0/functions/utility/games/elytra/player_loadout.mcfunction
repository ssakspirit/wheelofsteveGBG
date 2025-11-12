## Run to replace a player's loadout for the elytra rumble.

#Uniform:
replaceitem entity @a[scores={team=1}] slot.armor.chest 0 elytra 1 0  {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=2}] slot.armor.chest 0 elytra 1 0  {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=!admin] slot.hotbar 0 firework_rocket 64 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=!admin] slot.hotbar 1 firework_rocket 64 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=!admin] slot.hotbar 2 firework_rocket 64 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=!admin] slot.hotbar 3 firework_rocket 64 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=!admin] slot.hotbar 4 firework_rocket 64 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=!admin] slot.hotbar 5 firework_rocket 64 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=!admin] slot.hotbar 6 firework_rocket 64 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=!admin] slot.hotbar 7 firework_rocket 64 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=!admin] slot.hotbar 8 firework_rocket 64 0 {"item_lock": {"mode": "lock_in_slot"}}

# Admin observers: Clear items and add invisibility
clear @a[tag=admin]
effect @a[tag=admin] invisibility 999999 0 true