## Run to replace a player's loadout for Nock it off.

#Uniform:
replaceitem entity @a slot.hotbar 0 bow 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=1}] slot.hotbar 1 arrow 8 22 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[scores={team=2}] slot.hotbar 1 arrow 8 15 {"item_lock": {"mode": "lock_in_slot"}}
