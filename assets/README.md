# Nova's Catch Adventure — Asset Specification

All assets are PNG files. Until real art is delivered, the game uses colored rectangle placeholders that match these dimensions exactly. Swap in real PNGs at the paths below — zero code changes required.

## Character

| Key | File | Size | Anchor | Notes |
|-----|------|------|--------|-------|
| `nova` | `assets/nova/nova-sheet.png` | 64×96 | (0.5, 1.0) | Golden Retriever. Single frame or 4-frame run cycle (idle, run-1, run-2, jump) |

## Core Catchable Items

| Key | File | Size | Color hint |
|-----|------|------|-----------|
| `item-ball` | `assets/items/ball.png` | 36×36 | Red |
| `item-duck` | `assets/items/duck.png` | 44×36 | Yellow |
| `item-frisbee` | `assets/items/frisbee.png` | 48×16 | Blue |

## Level-Specific Items

| Key | File | Size | Level |
|-----|------|------|-------|
| `item-butterfly` | `assets/items/butterfly.png` | 40×32 | 1 — Park |
| `item-starfish` | `assets/items/starfish.png` | 36×36 | 2 — Beach |
| `item-pinecone` | `assets/items/pinecone.png` | 28×36 | 3 — Forest |
| `item-umbrella` | `assets/items/umbrella.png` | 48×40 | 4 — Rain |
| `item-egg` | `assets/items/egg.png` | 28×36 | 5 — Farm |
| `item-newspaper` | `assets/items/newspaper.png` | 44×36 | 6 — City |
| `item-snowball` | `assets/items/snowball.png` | 36×36 | 7 — Snow |
| `item-coconut` | `assets/items/coconut.png` | 32×36 | 8 — Jungle |
| `item-fish` | `assets/items/fish.png` | 44×28 | 9 — Underwater |
| `item-orb` | `assets/items/orb.png` | 36×36 | 10 — Space |

## Backgrounds (800×450 each)

| Key | File | Level | Environment |
|-----|------|-------|-------------|
| `bg-1` | `assets/backgrounds/level1.png` | 1 | Sunny Park |
| `bg-2` | `assets/backgrounds/level2.png` | 2 | Beach / Ocean |
| `bg-3` | `assets/backgrounds/level3.png` | 3 | Lush Forest |
| `bg-4` | `assets/backgrounds/level4.png` | 4 | Rainy Storm |
| `bg-5` | `assets/backgrounds/level5.png` | 5 | Farm |
| `bg-6` | `assets/backgrounds/level6.png` | 6 | City Rooftop |
| `bg-7` | `assets/backgrounds/level7.png` | 7 | Snowy Mountain |
| `bg-8` | `assets/backgrounds/level8.png` | 8 | Tropical Jungle |
| `bg-9` | `assets/backgrounds/level9.png` | 9 | Underwater |
| `bg-10` | `assets/backgrounds/level10.png` | 10 | Space |

## UI Assets

| Key | File | Size | Notes |
|-----|------|------|-------|
| `biscuit` | `assets/biscuit.png` | 80×80 | Dog biscuit / bone treat |
| `idli` | `assets/idli.png` | 100×80 | Idli (South Indian rice cake) |
| `heart` | `assets/heart.png` | 28×28 | Life indicator |
| `particle` | `assets/particle.png` | 8×8 | White circle for fireworks |

## Audio

| Key | File | Format | Notes |
|-----|------|--------|-------|
| `celebrate` | `assets/audio/celebrate.ogg` | OGG/MP3 | Looped celebration music for Idli finale. Use CC0 license. |

**Tip:** [freesound.org](https://freesound.org) and [opengameart.org](https://opengameart.org) have CC0 audio and sprites.
