import { ASSETS } from '../data/assetManifest.js';
import { LEVELS } from '../data/levelConfig.js';
import GameState from '../state/GameState.js';

// Emoji for catchable items and UI — much clearer than colored rectangles
const ITEM_EMOJI = {
  'item-ball':      '🎾',
  'item-duck':      '🦆',
  'item-frisbee':   '🥏',
  'item-butterfly': '🦋',
  'item-starfish':  '⭐',
  'item-pinecone':  '🌲',
  'item-umbrella':  '🌂',
  'item-egg':       '🥚',
  'item-newspaper': '📰',
  'item-snowball':  '❄️',
  'item-coconut':   '🥥',
  'item-fish':      '🐟',
  'item-orb':       '🔮',
  'item-bird':      '🪿',
  'biscuit':        '🦴',
  'heart':          '❤️',
};

export default class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    Object.values(ASSETS).forEach(asset => {
      if (!asset.key) return;
      if (this.textures.exists(asset.key)) return;
      if (!asset.path) return;

      if (asset.frameWidth) {
        // Sprite sheet (e.g. Nova animation frames)
        this.load.spritesheet(asset.key, asset.path, {
          frameWidth:  asset.frameWidth,
          frameHeight: asset.frameHeight,
        });
      } else {
        this.load.image(asset.key, asset.path);
      }
    });

    this.load.on('loaderror', (file) => {
      this._generatePlaceholder(file.key);
    });
  }

  _generatePlaceholder(key) {
    if (this.textures.exists(key)) return;
    const assetDef = Object.values(ASSETS).find(a => a.key === key);
    if (!assetDef) return;

    const w = assetDef.w || 32;
    const h = assetDef.h || 32;

    if (ITEM_EMOJI[key]) {
      this._emojiToTexture(key, ITEM_EMOJI[key], w, h);
      return;
    }

    const g = this.make.graphics({ add: false });

    if (key === 'nova') {
      this._drawNova(g, w, h);
    } else if (key === 'idli') {
      this._drawIdli(g, w, h);
    } else if (key.startsWith('bg-')) {
      this._drawBackground(g, key, w, h);
    } else if (key === 'particle') {
      g.fillStyle(0xffffff);
      g.fillCircle(4, 4, 4);
    } else {
      g.fillStyle(assetDef.color || 0x888888);
      g.fillRoundedRect(0, 0, w, h, Math.min(w, h) / 5);
    }

    g.generateTexture(key, w, h);
    g.destroy();
  }

  // ── Sprite-sheet helpers ──────────────────────────────────────────────────

  /** Replace every near-white pixel in a loaded texture with transparency. */
  _stripWhite(key) {
    const tex  = this.textures.get(key);
    const src  = tex.getSourceImage();       // the raw HTMLImageElement

    const cv   = document.createElement('canvas');
    cv.width   = src.width;
    cv.height  = src.height;
    const ctx  = cv.getContext('2d');
    ctx.drawImage(src, 0, 0);

    const img  = ctx.getImageData(0, 0, cv.width, cv.height);
    const d    = img.data;
    for (let i = 0; i < d.length; i += 4) {
      // Treat pixels brighter than 240 on all channels as white → transparent
      if (d[i] > 240 && d[i + 1] > 240 && d[i + 2] > 240) d[i + 3] = 0;
    }
    ctx.putImageData(img, 0, 0);

    // Swap the existing texture source for the processed canvas
    this.textures.remove(key);
    // Re-add as a spritesheet so frame data is preserved
    const cfg = ASSETS[key];
    this.textures.addSpriteSheet(key, cv, {
      frameWidth:  cfg.frameWidth,
      frameHeight: cfg.frameHeight,
    });
  }

  /** Register Phaser animations from the Nova sprite sheet rows. */
  _createNovaAnims(cfg) {
    const cols = cfg.frameCols || 8;
    const rows = cfg.animRows  || { idle: 0, run: 3, jump: 6 };

    const def = (key, row, fps, repeat, frameCount = cols) => {
      if (this.anims.exists(key)) return;
      const start = row * cols;
      this.anims.create({
        key,
        frames:    this.anims.generateFrameNumbers('nova', { start, end: start + frameCount - 1 }),
        frameRate: fps,
        repeat,
      });
    };

    def('nova-idle',   rows.idle,   8,  -1);
    def('nova-run',    rows.run,    14, -1);
    def('nova-jump',   rows.jump,   12, 0);
    def('nova-sneak',  rows.sneak,  10, -1);
    def('nova-gallop', rows.gallop, 16, -1);
    def('nova-sprint', rows.sprint, 18, -1);
    def('nova-sit',    rows.sit,    8,  -1);
    def('nova-sleep',  rows.sleep,  5,  -1, 4);  // row 8 has only 4 frames
  }

  // ── Emoji / placeholder helpers ───────────────────────────────────────────

  // Renders an emoji character to a Phaser texture via DOM Canvas API
  _emojiToTexture(key, emoji, w, h) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const size = Math.floor(Math.min(w, h) * 0.85);
    ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, w / 2, h / 2);
    this.textures.addCanvas(key, canvas);
  }

  _drawNova(g, w, h) {
    // Golden Retriever colour palette (from breed coat research)
    const body   = 0xd4952a;  // rich golden coat
    const bodyLt = 0xf0bf55;  // lighter golden — feather tips & highlights
    const bodyDk = 0x9b6810;  // deeper golden — ear depth & shadows
    const cream  = 0xf5e8b0;  // cream — muzzle, chest & inner-ear feathering
    const black  = 0x1a1008;

    // ── Feathery tail (Golden Retriever hallmark: long, bushy, carried level) ──
    g.fillStyle(bodyDk);
    g.fillEllipse(w * 0.87, h * 0.50, w * 0.26, h * 0.14);
    g.fillStyle(body);
    g.fillEllipse(w * 0.85, h * 0.45, w * 0.30, h * 0.14);
    g.fillStyle(bodyLt);
    g.fillEllipse(w * 0.82, h * 0.40, w * 0.26, h * 0.12);
    g.fillStyle(cream);                                          // wispy tip
    g.fillEllipse(w * 0.88, h * 0.35, w * 0.14, h * 0.08);

    // ── Torso ──
    g.fillStyle(body);
    g.fillEllipse(w * 0.46, h * 0.64, w * 0.64, h * 0.42);

    // Chest feathering — cream (very visible on Golden Retrievers)
    g.fillStyle(cream);
    g.fillEllipse(w * 0.25, h * 0.68, w * 0.18, h * 0.28);
    g.fillStyle(bodyLt);
    g.fillEllipse(w * 0.26, h * 0.64, w * 0.12, h * 0.18);

    // ── Legs ──
    g.fillStyle(body);
    [0.17, 0.34, 0.53, 0.70].forEach(lx => {
      g.fillRoundedRect(w * lx, h * 0.78, w * 0.13, h * 0.21, 4);
    });
    // Back-leg feathering (rear legs have longer fur on Golden Retrievers)
    g.fillStyle(bodyLt);
    [0.53, 0.70].forEach(lx => {
      g.fillEllipse(w * (lx + 0.09), h * 0.84, w * 0.07, h * 0.16);
    });
    // Paws
    g.fillStyle(bodyDk);
    [0.17, 0.34, 0.53, 0.70].forEach(lx => {
      g.fillRoundedRect(w * lx, h * 0.91, w * 0.13, h * 0.08, 4);
    });

    // ── Collar ──
    g.fillStyle(0xbb2222);
    g.fillRect(w * 0.28, h * 0.37, w * 0.30, h * 0.05);
    g.fillStyle(0xffdd44);
    g.fillCircle(w * 0.44, h * 0.415, h * 0.020);

    // ── Neck ──
    g.fillStyle(body);
    g.fillEllipse(w * 0.42, h * 0.40, w * 0.22, h * 0.22);

    // ── Head — broad and friendly ──
    g.fillStyle(body);
    g.fillEllipse(w * 0.44, h * 0.22, w * 0.46, h * 0.36);

    // ── Long feathery drop ears (hang at eye level — Golden trait) ──
    g.fillStyle(bodyDk);
    g.fillEllipse(w * 0.23, h * 0.29, w * 0.15, h * 0.30);
    g.fillEllipse(w * 0.65, h * 0.29, w * 0.15, h * 0.30);
    g.fillStyle(bodyLt);                                         // inner feathering
    g.fillEllipse(w * 0.23, h * 0.30, w * 0.08, h * 0.20);
    g.fillEllipse(w * 0.65, h * 0.30, w * 0.08, h * 0.20);

    // ── Cream muzzle (broad, slightly longer than a Lab) ──
    g.fillStyle(cream);
    g.fillEllipse(w * 0.44, h * 0.29, w * 0.26, h * 0.16);

    // ── Black nose ──
    g.fillStyle(black);
    g.fillEllipse(w * 0.44, h * 0.23, w * 0.10, h * 0.06);

    // ── Warm expressive dark-brown eyes (Golden Retriever hallmark) ──
    g.fillStyle(0x3a2208);
    g.fillCircle(w * 0.36, h * 0.18, h * 0.033);
    g.fillCircle(w * 0.52, h * 0.18, h * 0.033);
    g.fillStyle(0xffffff);
    g.fillCircle(w * 0.352, h * 0.172, h * 0.012);
    g.fillCircle(w * 0.513, h * 0.172, h * 0.012);
  }

  _drawIdli(g, w, h) {
    // Idli: flat steamed rice-cake — wide disc, gently domed top, flat bottom

    // Shadow / underside (slightly darker, flat ellipse)
    g.fillStyle(0xc4b8a4);
    g.fillEllipse(w * 0.50, h * 0.74, w * 0.86, h * 0.20);

    // Main disc body — wide and squat (real idli is ~2× wider than tall)
    g.fillStyle(0xf2ece2);
    g.fillEllipse(w * 0.50, h * 0.60, w * 0.84, h * 0.44);

    // Gently domed top surface
    g.fillStyle(0xf8f4ee);
    g.fillEllipse(w * 0.50, h * 0.54, w * 0.76, h * 0.30);

    // Soft highlight (top-left — suggests overhead light)
    g.fillStyle(0xfdfcf8);
    g.fillEllipse(w * 0.40, h * 0.48, w * 0.32, h * 0.14);

    // Fermentation pores — small, spread across the top surface
    g.fillStyle(0xddd5c8);
    [[0.36, 0.54], [0.52, 0.50], [0.64, 0.56], [0.44, 0.62],
     [0.58, 0.64], [0.48, 0.44], [0.68, 0.48], [0.38, 0.46]]
      .forEach(([px, py]) => g.fillCircle(w * px, h * py, 2.2));
  }

  _drawBackground(g, key, w, h) {
    // Sky fills the scene; ground visual handled by GameScene._addGroundDecor at depth 1
    const sky = {
      'bg-1': 0x87ceeb, 'bg-2': 0x5599ff, 'bg-3': 0x4a7788,
      'bg-4': 0x445566, 'bg-5': 0x88bb55, 'bg-6': 0x0d1a2e,
      'bg-7': 0x99bbdd, 'bg-8': 0x225533, 'bg-9': 0x0a3550,
      'bg-10': 0x020008,
    };
    g.fillStyle(sky[key] || 0x1a1a2e);
    g.fillRect(0, 0, w, h);

    // Park — sun + fluffy clouds
    if (key === 'bg-1') {
      g.fillStyle(0xffdd44);
      g.fillCircle(w * 0.84, h * 0.13, 30);
      g.fillStyle(0xfff5b0);
      g.fillCircle(w * 0.84, h * 0.13, 22);
      g.fillStyle(0xffffff);
      [[0.15, 0.11, 100, 32], [0.40, 0.07, 120, 28], [0.62, 0.14, 90, 26]].forEach(([cx, cy, cw, ch]) => {
        g.fillEllipse(w * cx, h * cy, cw, ch);
        g.fillEllipse(w * cx - cw * 0.2, h * cy + 5, cw * 0.65, ch * 0.8);
        g.fillEllipse(w * cx + cw * 0.2, h * cy + 4, cw * 0.7, ch * 0.8);
      });
    }

    // Beach — sun + distant horizon
    if (key === 'bg-2') {
      g.fillStyle(0xffcc22);
      g.fillCircle(w * 0.80, h * 0.11, 28);
      g.fillStyle(0xfff5aa);
      g.fillCircle(w * 0.80, h * 0.11, 20);
      g.fillStyle(0x88aaff);
      g.fillEllipse(w * 0.5, h * 0.72, w * 1.2, h * 0.3); // distant water
    }

    // Forest — distant tree silhouettes
    if (key === 'bg-3') {
      g.fillStyle(0x1a4422);
      [0.05, 0.14, 0.24, 0.35, 0.47, 0.58, 0.68, 0.78, 0.88, 0.96].forEach(tx => {
        const th = 80 + (tx * 170) % 60;
        g.fillTriangle(w * tx, h * 0.55, w * tx - 28, h * 0.72, w * tx + 28, h * 0.72);
        g.fillTriangle(w * tx, h * 0.55 - th * 0.4, w * tx - 22, h * 0.55, w * tx + 22, h * 0.55);
      });
    }

    // Rain — clouds + heavy rain streaks
    if (key === 'bg-4') {
      g.fillStyle(0x556677);
      [[0.2, 0.1, 180, 50], [0.55, 0.06, 220, 55], [0.85, 0.12, 160, 45]].forEach(([cx, cy, cw, ch]) => {
        g.fillEllipse(w * cx, h * cy, cw, ch);
      });
      g.fillStyle(0x7799bb);
      for (let i = 0; i < 55; i++) {
        g.fillRect((i * 31 + 7) % w, (i * 47 + 3) % Math.floor(h * 0.80), 1, 18);
      }
    }

    // Farm — blue sky + barn in distance
    if (key === 'bg-5') {
      g.fillStyle(0xffffff);
      [[0.20, 0.09, 90, 26], [0.60, 0.06, 110, 24]].forEach(([cx, cy, cw, ch]) => {
        g.fillEllipse(w * cx, h * cy, cw, ch);
      });
      g.fillStyle(0xbb3311);
      g.fillRect(w * 0.74, h * 0.50, 55, 38);
      g.fillStyle(0x992211);
      g.fillTriangle(w * 0.735, h * 0.50, w * 0.815, h * 0.36, w * 0.895, h * 0.50);
    }

    // City night — skyline with lit windows
    if (key === 'bg-6') {
      g.fillStyle(0x1a2a44);
      [[0.04, 0.28, 44, 130], [0.13, 0.18, 58, 150], [0.26, 0.25, 48, 120],
       [0.42, 0.15, 54, 155], [0.58, 0.22, 50, 130], [0.72, 0.30, 42, 110],
       [0.83, 0.20, 52, 145], [0.93, 0.32, 38, 100]].forEach(([bx, by, bw, bh]) => {
        g.fillRect(w * bx, h * by, bw, bh);
      });
      g.fillStyle(0xffee88);
      for (let i = 0; i < 40; i++) {
        g.fillRect((i * 53 + 8) % (w - 10), h * 0.18 + ((i * 23) % Math.floor(h * 0.55)), 5, 4);
      }
      g.fillStyle(0x4466aa);
      g.fillCircle(w * 0.5, h * 0.06, 18); // moon
      g.fillStyle(0x0d1a2e);
      g.fillCircle(w * 0.52, h * 0.055, 14); // crescent cutout
    }

    // Snow — grey sky + mountain
    if (key === 'bg-7') {
      g.fillStyle(0xddeeff);
      g.fillTriangle(w * 0.50, h * 0.08, w * 0.22, h * 0.55, w * 0.78, h * 0.55);
      g.fillStyle(0xaabbdd);
      g.fillTriangle(w * 0.30, h * 0.18, w * 0.10, h * 0.55, w * 0.50, h * 0.55);
      g.fillStyle(0xffffff);
      g.fillTriangle(w * 0.50, h * 0.08, w * 0.39, h * 0.27, w * 0.61, h * 0.27);
      g.fillStyle(0xffffff);
      for (let i = 0; i < 40; i++) {
        g.fillCircle((i * 37 + 11) % w, (i * 53 + 7) % Math.floor(h * 0.72), i % 3 === 0 ? 3 : 2);
      }
    }

    // Jungle — dense canopy
    if (key === 'bg-8') {
      g.fillStyle(0x113300);
      for (let i = 0; i < 12; i++) {
        const jx = (i * 73 + 5) % w;
        g.fillEllipse(jx, h * 0.40, 90, 120);
      }
      g.fillStyle(0x1a4400);
      for (let i = 0; i < 10; i++) {
        const jx = (i * 89 + 30) % w;
        g.fillEllipse(jx, h * 0.32, 70, 90);
      }
    }

    // Underwater — deep blue with light rays and fish
    if (key === 'bg-9') {
      // Caustic light shafts from above
      g.fillStyle(0x1a6688);
      [0.15, 0.38, 0.60, 0.82].forEach(rx => {
        g.fillTriangle(w * rx, 0, w * rx - 20, h * 0.65, w * rx + 20, h * 0.65);
      });
      g.fillStyle(0x3399cc);
      for (let i = 0; i < 28; i++) {
        g.fillCircle((i * 53 + 7) % w, (i * 37 + 3) % Math.floor(h * 0.75), 2 + i % 4);
      }
    }

    // Space — stars, nebulae, planet
    if (key === 'bg-10') {
      g.fillStyle(0xffffff);
      for (let i = 0; i < 110; i++) {
        g.fillCircle((i * 97 + 13) % w, (i * 71 + 23) % h, i % 7 === 0 ? 2 : 1);
      }
      g.fillStyle(0x1a0033);
      g.fillEllipse(w * 0.20, h * 0.25, 170, 75);
      g.fillStyle(0x003322);
      g.fillEllipse(w * 0.72, h * 0.15, 130, 60);
      g.fillStyle(0x886644);
      g.fillCircle(w * 0.87, h * 0.50, 26);
      g.fillStyle(0xaa8855);
      g.fillCircle(w * 0.87, h * 0.50, 19);
      g.fillStyle(0x664422);
      g.fillEllipse(w * 0.87, h * 0.50, 60, 8); // planet rings
    }
  }

  create() {
    Object.values(ASSETS).forEach(asset => {
      if (!this.textures.exists(asset.key)) {
        this._generatePlaceholder(asset.key);
      }
    });

    // If a real Nova sprite sheet loaded, strip its white background and
    // register animations.  The placeholder path skips this block entirely.
    const novaCfg = ASSETS.nova;
    if (novaCfg.frameWidth && this.textures.exists('nova')) {
      this._stripWhite('nova');
      this._createNovaAnims(novaCfg);
    }

    LEVELS.forEach((l) => {
      const theoreticalMax = (l.timerSec * 1000 / l.spawnIntervalMs) * l.maxSim;
      if (l.quota > 0.7 * theoreticalMax) {
        console.warn(`[BootScene] Level ${l.id} may be unwinnable: quota ${l.quota} > ${(0.7 * theoreticalMax).toFixed(1)}`);
      }
    });

    try {
      const m = localStorage.getItem('nova-muted');
      if (m !== null) GameState.setMuted(m === 'true');
    } catch (_) {}

    const W = this.scale.gameSize.width;
    const H = this.scale.gameSize.height;

    this.add.rectangle(W / 2, H / 2, W, H, 0x1a1a2e);

    // Show Nova sprite on title screen (uses generated texture above)
    this.add.image(W / 2, H / 2 - 20, 'nova').setScale(1.4).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 65, "Nova's Catch Adventure", {
      fontFamily: 'Georgia, serif',
      fontSize: '28px',
      fill: '#ffcc44',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const prompt = this.add.text(W / 2, H / 2 + 108, 'Tap / Press SPACE to Start', {
      fontFamily: 'monospace',
      fontSize: '18px',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.tweens.add({ targets: prompt, alpha: 0, duration: 600, yoyo: true, repeat: -1 });

    const startGame = () => {
      this.input.off('pointerdown', startGame);
      this.input.keyboard.off('keydown-SPACE', startGame);
      this.scene.start('MenuScene');
    };

    this.input.on('pointerdown', startGame);
    this.input.keyboard.on('keydown-SPACE', startGame);

    this._visibilityHandler = () => {
      this.game.events.emit(document.hidden ? 'game-hidden' : 'game-visible');
    };
    document.addEventListener('visibilitychange', this._visibilityHandler);
  }

  shutdown() {
    if (this._visibilityHandler) {
      document.removeEventListener('visibilitychange', this._visibilityHandler);
    }
  }
}
