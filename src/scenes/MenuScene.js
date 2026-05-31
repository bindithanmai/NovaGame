import Leaderboard from '../state/Leaderboard.js';
import GameState from '../state/GameState.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const W = this.scale.gameSize.width;
    const H = this.scale.gameSize.height;

    // Background
    this.add.rectangle(W / 2, H / 2, W, H, 0x1a1a2e);

    // Stars decoration
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H * 0.5);
      this.add.circle(x, y, Phaser.Math.Between(1, 3), 0xffffff, Phaser.Math.FloatBetween(0.3, 1));
    }

    // Title
    this.add.text(W / 2, 60, "Nova's Catch Adventure", {
      fontFamily: 'Georgia, serif',
      fontSize: '32px',
      fill: '#ffcc44',
      stroke: '#000',
      strokeThickness: 5,
    }).setOrigin(0.5);

    // Nova sleeping — plays the actual sleep animation frames from row 8
    const novaSpr = this.add.sprite(W / 2, 170, 'nova')
      .setOrigin(0.5, 0.5)
      .setScale(2.5);

    // Check the animation key itself, not the texture key
    const menuAnim = ['nova-sleep','nova-sit','nova-idle'].find(k => this.anims.exists(k));
    if (menuAnim) {
      novaSpr.play(menuAnim);
    }

    // Gentle breathing tween
    this.tweens.add({
      targets: novaSpr,
      scaleY: 2.3,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // ZZZ floating upward
    const makeZzz = (text, startX, startY, delay) => {
      const z = this.add.text(startX, startY, text, {
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        fill: '#aabbff',
        alpha: 0,
        stroke: '#334',
        strokeThickness: 2,
      }).setOrigin(0.5);
      this.tweens.add({
        targets: z,
        y: startY - 30,
        alpha: { from: 0, to: 0.9 },
        duration: 1200,
        ease: 'Sine.easeIn',
        delay,
        yoyo: true,
        repeat: -1,
        repeatDelay: 600,
      });
    };
    makeZzz('z',   W / 2 + 52, 148, 0);
    makeZzz('z z', W / 2 + 62, 138, 700);
    makeZzz('Z Z', W / 2 + 68, 126, 1400);

    // Play button
    const playBtn = this._makeButton(W / 2, 260, '▶  PLAY', 0xff5533, () => {
      GameState.reset();
      this.scene.start('GameScene');
    });

    // Leaderboard
    this.add.text(W / 2, 310, '🏆 High Scores', {
      fontFamily: 'monospace',
      fontSize: '16px',
      fill: '#ffdd44',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Load scores async — show placeholder while waiting
    const loadingTxt = this.add.text(W / 2, 335, '⏳ Loading scores…', {
      fontFamily: 'monospace', fontSize: '13px', fill: '#aaaaaa',
    }).setOrigin(0.5);

    Leaderboard.load().then(entries => {
      if (!this.scene.isActive('MenuScene')) return; // scene changed while loading
      loadingTxt.destroy();
      const top5 = entries.slice(0, 5);
      if (top5.length === 0) {
        this.add.text(W / 2, 335, 'No scores yet — play to be first!', {
          fontFamily: 'monospace', fontSize: '13px', fill: '#aaaaaa',
        }).setOrigin(0.5);
      } else {
        top5.forEach((entry, i) => {
          this.add.text(W / 2, 335 + i * 20,
            `${i + 1}. ${entry.name.padEnd(12)} ${String(entry.score).padStart(6)}  Lv${entry.level}`,
            { fontFamily: 'monospace', fontSize: '13px', fill: '#ffffff', stroke: '#000', strokeThickness: 2 }
          ).setOrigin(0.5);
        });
      }
    });

    // Mute toggle
    this._muteBtn = this._makeButton(W - 44, 14, GameState.muted ? '🔇' : '🔊', 0x334455, () => {
      GameState.toggleMute();
      this._muteBtn.label.setText(GameState.muted ? '🔇' : '🔊');
    }, 36, 28);

    // Controls hint
    this.add.text(W / 2, H - 20, '← → move  |  ↑ / SPACE jump  |  Mobile: tap zones', {
      fontFamily: 'monospace', fontSize: '12px', fill: '#888888',
    }).setOrigin(0.5);
  }

  _makeButton(x, y, label, color, callback, w = 160, h = 40) {
    const bg = this.add.rectangle(x, y, w, h, color, 0.9).setInteractive({ useHandCursor: true });
    const txt = this.add.text(x, y, label, {
      fontFamily: 'monospace', fontSize: '18px', fill: '#ffffff', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);

    bg.on('pointerover', () => bg.setFillStyle(Phaser.Display.Color.ValueToColor(color).lighten(20).color));
    bg.on('pointerout',  () => bg.setFillStyle(color));
    bg.on('pointerdown', callback);
    bg.on('pointerup', () => bg.setFillStyle(color));

    return { bg, label: txt };
  }
}
