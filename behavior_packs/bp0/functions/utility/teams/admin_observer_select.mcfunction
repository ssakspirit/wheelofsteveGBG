## Run when joining as admin observer.

tellraw @s {"rawtext":[{"text":"§6이제 §e관리자 관찰자§6입니다. 참여하지 않고 모든 게임을 관람할 수 있습니다."}]}
tellraw @s {"rawtext":[{"text":"§7Observer system modified by stevecoding"}]}

# Remove from any existing team
execute if entity @s[scores={team=1}] run scoreboard players remove .team1players global 1
execute if entity @s[scores={team=2}] run scoreboard players remove .team2players global 1

# Set as observer (team 0 = no team)
scoreboard players set @s team 0

# Clear any team uniforms
replaceitem entity @s slot.armor.head 0 air
replaceitem entity @s slot.armor.chest 0 air  
replaceitem entity @s slot.armor.legs 0 air
replaceitem entity @s slot.armor.feet 0 air

# Give observer equipment (golden armor for identification)
replaceitem entity @s slot.armor.head 0 golden_helmet 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @s slot.armor.chest 0 golden_chestplate 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @s slot.armor.legs 0 golden_leggings 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @s slot.armor.feet 0 golden_boots 1 0 {"item_lock": {"mode": "lock_in_slot"}}

# Give observer abilities
gamemode creative @s

# Remove team joining tags
tag @s remove team1joining
tag @s remove team2joining