# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Minecraft Education Edition world containing a custom minigame collection created by ReWrite Media. It features a team-based competition system with 6 different games:
1. Orb Ambush (Game 1)
2. Craft Off (Game 2)
3. Grid Wars (Game 3)
4. Nock it Off (Game 4)
5. Elytra Rumble (Game 5)
6. Finale Showdown (Game 6)

The world supports both single-player and multiplayer modes with up to 2 teams (Team 1 and Team 2), max 4 players per team.

## Architecture

### Behavior Pack (bp0)
- **JavaScript Module**: `scripts/Main.js` - Uses @minecraft/server and @minecraft/server-ui APIs
- **Functions**: Command-based game logic organized by purpose
  - `functions/loops/tick.mcfunction` - Main 20Hz game loop managing all systems
  - `functions/seq/actN/*.mcfunction` - Sequential scripted events for each game
  - `functions/utility/` - Reusable systems (fogs, particles, teams, games)
- **Entities**: Custom entities (`.bp.e.json`) for game mechanics (NPCs, contraptions, markers, etc.)
- **Items**: Custom items for game mechanics (craft parts, diagrams, contraptions, orb)
- **Animations & Controllers**: Gameplay animations and state machines
- **Dialogue**: NPC dialogue system (`dialogue/npc.dialogue.json`)

### Resource Pack (rp0)
- **Models**: Custom 3D geometry (`.geo.json`) for entities
- **Textures**: Visual assets for entities, items, and UI
- **Animations**: Client-side animations (`.animation.json`)
- **Animation Controllers**: Client-side state machines
- **Fogs**: Custom fog effects for different game environments (lobby, g1-g6, g4a-g4g)

### Game Flow System
The main loop (`functions/loops/tick.mcfunction`) uses scoreboard-based state management:
- `.act global` - Controls which sequential event is running (act0-act6)
- `.game global` - Determines which minigame is active (0=lobby, 1-6=games)
- `.actionbar.objective global` - Controls objective text displayed to players
- `.tick global` - 20-tick counter (1 second)
- `.tick10 global` - 200-tick counter (10 seconds)
- `.game_mode global` - 0=multiplayer, 1=singleplayer
- `.team1players global` / `.team2players global` - Player counts per team

### Team Management
- Team selection via physical zones in lobby
- Admin observers (tagged `admin`) cannot join teams, use creative mode
- Team joining zones at specific coordinates with player count validation

## Development Workflow

### Modifying Game Logic
1. For game behavior: Edit `.mcfunction` files in `behavior_packs/bp0/functions/`
2. For entity properties: Edit `.bp.e.json` files in `behavior_packs/bp0/entities/`
3. For JavaScript interactions: Edit `behavior_packs/bp0/scripts/Main.js`

### Adding New Games
1. Create new act sequence in `functions/seq/actN/`
2. Add game logic in `functions/utility/games/[game_name]/`
3. Update main tick loop to call new game functions
4. Create custom entities, items, and loot tables as needed
5. Add resource pack assets (models, textures, animations)

### Testing
- Load world in Minecraft Education Edition
- Use admin commands via `functions/admin.mcfunction` for debugging
- Admin observers can monitor without affecting gameplay

## Key Conventions
- Entity files use `.bp.e.json` (behavior) and `.rp.e.json` (resource) naming
- Custom namespace: `rwm:` (ReWrite Media)
- Language files support multiple languages via `texts/` directory
- Scoreboard objectives track global game state
- Korean language support in dialogue and messages

## Version Control
* Whenever code changes are made, you must record a one-line description with emoji in korean of the change in `.commit_message.txt` with Edit Tool.
   - Read `.commit_message.txt` first, and then Edit.
   - Overwrite regardless of existing content.
   - If it was a git revert related operation, make the .commit_message.txt file empty.
