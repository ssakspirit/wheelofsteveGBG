## Admin Observer Commands - for admin tagged players only

# Show current game state
tellraw @s[tag=admin] {"rawtext":[{"text":"§6=== Game Status ==="}]}
tellraw @s[tag=admin] {"rawtext":[{"text":"§bCurrent Game: "},{"score":{"name":".game","objective":"global"}}]}
tellraw @s[tag=admin] {"rawtext":[{"text":"§bCurrent Act: "},{"score":{"name":".act","objective":"global"}}]}
tellraw @s[tag=admin] {"rawtext":[{"text":"§bTeam 1 Players: "},{"score":{"name":".team1players","objective":"global"}}]}
tellraw @s[tag=admin] {"rawtext":[{"text":"§bTeam 2 Players: "},{"score":{"name":".team2players","objective":"global"}}]}
tellraw @s[tag=admin] {"rawtext":[{"text":"§bGame Mode: "},{"score":{"name":".game_mode","objective":"global"}},{"text":" (0=Multi, 1=Single)"}]}

# Teleport shortcuts for different game areas
tellraw @s[tag=admin] {"rawtext":[{"text":"§6=== Teleport Commands ==="}]}
tellraw @s[tag=admin] {"rawtext":[{"text":"§e/tp @s 0 30 0 §7- Lobby"}]}
tellraw @s[tag=admin] {"rawtext":[{"text":"§e/tp @s -80 70 5088 §7- Elytra Game Area"}]}
tellraw @s[tag=admin] {"rawtext":[{"text":"§e/tp @s 148 60 300 §7- Craft Game Area"}]}

# Admin only message
execute unless entity @s[tag=admin] run tellraw @s {"rawtext":[{"text":"§cThis command is only for admin observers."}]}