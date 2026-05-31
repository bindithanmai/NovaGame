import Nova            from '../entities/Nova.js';
import Spawner         from '../systems/Spawner.js';
import LevelManager    from '../systems/LevelManager.js';
import InputController from '../input/InputController.js';
import HUD             from '../ui/HUD.js';
import GameState       from '../state/GameState.js';
import { LEVELS }      from '../data/levelConfig.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    const params = new URLSearchParams(window.location.search);
    const urlLevel = parseInt(params.get('level'), 10);
    if (!isNaN(urlLevel) && urlLevel >= 1 && urlLevel <= 10) {
      GameState.setLevelDirectly(urlLevel);
    }
  }

  create() {
    const W = this.scale.gameSize.width;
    const H = this.scale.gameSize.height;
    const cfg = LEVELS[GameState.currentLevel - 1];

    // Background image (generated in BootScene with sky + atmosphere)
    this._bg = this.add.image(W / 2, H / 2, cfg.bgKey).setDepth(0).setDisplaySize(W, H);
    this._addGroundDecor(cfg);

    // Ground platform (static physics body — visual comes from _addGroundDecor)
    this._ground = this.physics.add.staticGroup();
    const groundTile = this.add.rectangle(W / 2, H - 15, W, 30, 0, 0).setDepth(1);
    this.physics.add.existing(groundTile, true);
    this._ground.add(groundTile);

    // Nova
    this._nova = new Nova(this, W / 2, H - 30);
    this.physics.add.collider(this._nova, this._ground);

    // Input
    this._input = new InputController(this);

    // Spawner
    this._spawner = new Spawner(this);

    // HUD (depth 10 = always on top)
    this._hud = new HUD(this);

    // Level manager
    this._levelManager = new LevelManager(this, this._spawner, this._hud);
    this._levelManager.init();

    // Catch overlap detection
    this.physics.add.overlap(this._nova, this._spawner.group, this._onCatch, null, this);

    // Duck missed event
    this.events.on('duck-missed', () => this._nova.playConfused());

    // Pause on visibility change
    this._visibilityHandler = () => {
      if (document.hidden) {
        this._levelManager.pauseTimer();
      } else {
        this._levelManager.resumeTimer();
      }
    };
    document.addEventListener('visibilitychange', this._visibilityHandler);

    // Mute button (corner)
    this._addMuteButton();
  }

  _addGroundDecor(cfg) {
    const W = this.scale.gameSize.width;
    const H = this.scale.gameSize.height;

    // Per-level ground strip color and decoration color
    const levels = {
      1:  { ground: 0x5aaa5a, decor: 0x338833, style: 'trees' },
      2:  { ground: 0xf0d890, decor: 0x4488ff, style: 'waves' },
      3:  { ground: 0x336622, decor: 0x114400, style: 'trees' },
      4:  { ground: 0x556644, decor: 0x445566, style: 'plain' },
      5:  { ground: 0x886633, decor: 0x7a5522, style: 'plain' },
      6:  { ground: 0x334455, decor: 0x223344, style: 'city' },
      7:  { ground: 0xddeeff, decor: 0xbbccee, style: 'snow' },
      8:  { ground: 0x225511, decor: 0x114400, style: 'jungle' },
      9:  { ground: 0x0d4060, decor: 0x336688, style: 'sea' },
      10: { ground: 0x110033, decor: 0x220055, style: 'space' },
    };
    const lv = levels[cfg.id] || { ground: 0x333333, decor: 0x222222, style: 'plain' };
    const g = this.add.graphics().setDepth(1);

    // Ground strip
    g.fillStyle(lv.ground);
    g.fillRect(0, H - 30, W, 30);

    // Style-specific decorations above ground
    if (lv.style === 'trees') {
      g.fillStyle(lv.decor);
      [0.06, 0.18, 0.35, 0.52, 0.68, 0.82, 0.93].forEach(tx => {
        const tw = 22 + Math.floor((tx * 137) % 14);
        g.fillTriangle(W * tx, H - 30, W * tx - tw, H - 30 + 1, W * tx + tw, H - 30 + 1);
        g.fillTriangle(W * tx, H - 72, W * tx - tw * 0.8, H - 42, W * tx + tw * 0.8, H - 42);
      });
    }
    if (lv.style === 'waves') {
      g.fillStyle(lv.decor);
      [0, 1, 2, 3].forEach(i => {
        g.fillEllipse(W * (0.12 + i * 0.26), H - 36, 120, 14);
      });
    }
    if (lv.style === 'city') {
      g.fillStyle(lv.decor);
      [0.05, 0.18, 0.33, 0.50, 0.65, 0.80].forEach((bx, i) => {
        const bh = 50 + (i * 23) % 35;
        g.fillRect(W * bx, H - 30 - bh, 38, bh);
      });
    }
    if (lv.style === 'snow') {
      g.fillStyle(lv.decor);
      [0.08, 0.22, 0.40, 0.58, 0.74, 0.90].forEach(sx => {
        g.fillEllipse(W * sx, H - 38, 70, 22);
      });
    }
    if (lv.style === 'jungle') {
      g.fillStyle(lv.decor);
      [0.04, 0.20, 0.42, 0.60, 0.78, 0.94].forEach(jx => {
        g.fillEllipse(W * jx, H - 55, 30, 60);
      });
    }
    if (lv.style === 'sea') {
      g.fillStyle(lv.decor);
      [0, 1, 2, 3, 4].forEach(i => {
        g.fillEllipse(W * (0.08 + i * 0.22), H - 50, 18, 40);
      });
    }
    if (lv.style === 'space') {
      g.fillStyle(lv.decor);
      [0.12, 0.30, 0.48, 0.65, 0.82].forEach(px => {
        g.fillRect(W * px - 20, H - 30, 40, 8);
      });
    }
  }

  _addMuteButton() {
    const W = this.scale.gameSize.width;
    const muteBtn = this.add.text(W - 10, 65, GameState.muted ? '🔇' : '🔊', {
      fontFamily: 'monospace', fontSize: '20px',
    }).setOrigin(1, 0).setDepth(15).setInteractive({ useHandCursor: true });

    muteBtn.on('pointerdown', () => {
      GameState.toggleMute();
      muteBtn.setText(GameState.muted ? '🔇' : '🔊');
    });
    this._muteBtn = muteBtn;
  }

  _onCatch(nova, catchable) {
    if (!catchable.active || catchable.caught) return;
    catchable.caught = true;
    GameState.addCatch(catchable.points);
    catchable.despawn();

    // Visual feedback
    this.tweens.add({
      targets: nova,
      scaleX: 1.15, scaleY: 1.15,
      duration: 80,
      yoyo: true,
    });

    this._levelManager.onCatch();
  }

  update() {
    if (!this._nova || !this._input) return;
    this._nova.update(this._input);
    this._spawner.update(this._nova);
  }

  shutdown() {
    if (this._visibilityHandler) {
      document.removeEventListener('visibilitychange', this._visibilityHandler);
    }
    this.events.off('duck-missed');
  }
}
