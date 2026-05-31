# Nova's Catch Adventure 🐾

A browser-only 2D catch game featuring **Nova** — a fox-red Labrador who runs and jumps to catch falling objects across 10 increasingly wild environments!

## 🎮 How to Play

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move left | ← Arrow / A | Tap left third of screen |
| Move right | → Arrow / D | Tap right third of screen |
| Jump | ↑ Arrow / W / Space | Tap center of screen |

**Goal:** Catch the required number of objects before the timer runs out. Miss too many and Nova gets confused! 🤔

- **3 lives** per run — lose a life each time the timer expires
- Lose all 3 lives → game resets to level 1
- Complete all **10 levels** → earn the grand Idli celebration! 🍚

### 🏆 Rewards
- **Biscuit** 🦴 — earned after completing each level
- **Idli** 🍚 — grand finale after completing level 10 (with fireworks!)

## 🌍 Levels

| # | Environment | Special Item |
|---|------------|-------------|
| 1 | Sunny Park | 🦋 Butterfly |
| 2 | Beach | ⭐ Starfish |
| 3 | Forest | 🌲 Pinecone |
| 4 | Rainy Storm | ☂️ Umbrella |
| 5 | Farm | 🥚 Egg |
| 6 | City Rooftop | 📰 Newspaper |
| 7 | Snowy Mountain | ❄️ Snowball |
| 8 | Tropical Jungle | 🥥 Coconut |
| 9 | Underwater | 🐟 Fish |
| 10 | Space | ✨ Glowing Orb |

## 🚀 Running Locally

Requires a local server (ES modules don't work on `file://`):

```bash
# Python 3
python -m http.server 8080

# Then open: http://localhost:8080
```

Or use VS Code Live Server, `npx serve .`, etc.

## 📦 Deployment

Push to `main` branch — GitHub Actions automatically deploys to GitHub Pages.

**One-time setup:**
1. Go to repo Settings → Pages
2. Set Source to **GitHub Actions**
3. Push to `main`

Live URL: `https://<your-username>.github.io/<repo-name>/`

## 🎨 Adding Real Art

The game ships with colored placeholder shapes. To add real art:
1. See [`assets/README.md`](assets/README.md) for the full sprite spec
2. Drop PNG files at the listed paths — **no code changes required**

## 🛠 Tech Stack

- [Phaser 3](https://phaser.io) — HTML5 game framework
- Pure ES modules — no build step, no bundler
- GitHub Pages — static hosting
- localStorage — leaderboard persistence

## 🐾 QA Tips

Jump to any level with `?level=N`:
```
http://localhost:8080/?level=10
```

Mute toggle: 🔊 button in top-right corner of every scene.
