## Reset admin observer to proper state if they somehow change gamemode

# Force spectator mode for admin observers
execute as @a[tag=admin] unless entity @s[m=spectator] run gamemode spectator @s

# Ensure admin observers have team 0
execute as @a[tag=admin] unless entity @s[scores={team=0}] run scoreboard players set @s team 0

# Give admin observers their distinctive equipment if missing
execute as @a[tag=admin,hasitem={item=golden_helmet,quantity=0,slot=slot.armor.head}] run replaceitem entity @s slot.armor.head 0 golden_helmet 1 0 {"item_lock": {"mode": "lock_in_slot"}}
execute as @a[tag=admin,hasitem={item=golden_chestplate,quantity=0,slot=slot.armor.chest}] run replaceitem entity @s slot.armor.chest 0 golden_chestplate 1 0 {"item_lock": {"mode": "lock_in_slot"}}
execute as @a[tag=admin,hasitem={item=golden_leggings,quantity=0,slot=slot.armor.legs}] run replaceitem entity @s slot.armor.legs 0 golden_leggings 1 0 {"item_lock": {"mode": "lock_in_slot"}}
execute as @a[tag=admin,hasitem={item=golden_boots,quantity=0,slot=slot.armor.feet}] run replaceitem entity @s slot.armor.feet 0 golden_boots 1 0 {"item_lock": {"mode": "lock_in_slot"}}