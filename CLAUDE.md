# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 3D browser-based fighting game called "3D バトルファイター" (3D Battle Fighter). The entire game is implemented as a single HTML file with embedded CSS and JavaScript, using Three.js for 3D graphics.

## Architecture

- **Single File Application**: The entire game exists in `index.html` with all code embedded
- **3D Engine**: Uses Three.js (CDN version r128) for 3D rendering and graphics
- **Game Loop**: Standard requestAnimationFrame-based game loop with delta time calculations
- **Object-Oriented Design**: Player class encapsulates all character behavior and state
- **Entity Systems**: Separate systems for players, bullets, particles, and effects

### Key Components

- **Player Class** (lines 434-829): Handles all player state, movement, combat, and visual effects
- **Particle System** (lines 296-337): Creates and manages visual effects like sparks and explosions
- **Input System** (lines 880-1005): Handles keyboard input with charge/release mechanics for attacks
- **Physics** (lines 515-583): Simple physics with gravity, collision detection, and knockback
- **UI System** (lines 20-188): HTML/CSS-based UI overlays for health bars and controls

## Game Mechanics

- **Two-player local fighting game** with different control schemes
- **Charge-based combat**: Hold attack/gun keys to charge, release for stronger attacks
- **Special gauge system**: Build up energy for ultimate attacks
- **Knockback physics**: Damage increases knockback multiplier (Smash Bros style)
- **Visual feedback**: Extensive particle effects and screen shake

## Development Notes

- No build system required - open `index.html` directly in browser
- All dependencies loaded via CDN (Three.js r128)
- Japanese text throughout the UI
- No external assets or files needed
- Game automatically reloads after victory

## Controls

**Player 1**: WASD (move), Space (jump), F (attack), G (gun), Left Shift (defend), Q (ultimate)
**Player 2**: Arrow keys (move), Up (jump), J (attack), K (gun), Right Shift (defend), O (ultimate)