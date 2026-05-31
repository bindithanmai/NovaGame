import GameState from '../state/GameState.js';

export default class FinaleScene extends Phaser.Scene {
  constructor() { super({ key: 'FinaleScene' }); }

  preload() {
    if (!this.cache.audio.exists('celebrate')) {
      // Attempt to load audio if not already loaded
      // If this fails silently, game continues without music
    }
  }

  create() {
    const W = this.scale.gameSize.width;
    const H = this.scale.gameSize.height;

    // Deep space background
    this.add.rectangle(W / 2, H / 2, W, H, 0x050510);

    // Stars
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H);
      const r = Phaser.Math.FloatBetween(1, 3);
      this.add.circle(x, y, r, 0xffffff, Phaser.Math.FloatBetween(0.5, 1));
    }

    // Check reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleCount = reducedMotion ? 5 : 60;

    // Fireworks particle emitter
    this._createFireworks(W, H, particleCount);

    // Idli image center
    const idli = this.add.image(W / 2, H / 2 - 40, 'idli').setScale(2).setDepth(5);
    this.tweens.add({
      targets: idli,
      y: idli.y - 20,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Celebration title
    this.add.text(W / 2, 40, '🎉 GRAND IDLI CELEBRATION! 🎉', {
      fontFamily: 'Georgia, serif',
      fontSize: '26px',
      fill: '#ffdd44',
      stroke: '#000',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(5);

    this.add.text(W / 2, 82, "Nova completed all 10 levels! What a good girl! 🐾", {
      fontFamily: 'monospace',
      fontSize: '16px',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(5);

    // Score display
    this.add.text(W / 2, H / 2 + 60, `Final Score: ${GameState.score}`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      fill: '#aaffaa',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(5);

    // Submit score button
    const btn = this.add.rectangle(W / 2, H - 60, 200, 48, 0xcc4400, 0.95)
      .setInteractive({ useHandCursor: true })
      .setDepth(5);
    this.add.text(W / 2, H - 60, 'Submit Score 🏆', {
      fontFamily: 'monospace', fontSize: '18px', fill: '#fff', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(6);

    btn.on('pointerdown', () => this.scene.start('GameOverScene', { isFinale: true }));
    btn.on('pointerover', () => btn.setFillStyle(0xee5511));
    btn.on('pointerout',  () => btn.setFillStyle(0xcc4400));

    // Celebration music (gated behind mute + audio unlock)
    if (!GameState.muted && this.sound.locked === false) {
      try {
        if (this.cache.audio.exists('celebrate')) {
          this._music = this.sound.add('celebrate', { loop: true, volume: 0.6 });
          this._music.play();
        }
      } catch (_) {}
    }
  }

  _createFireworks(W, H, count) {
    // Burst multiple times from random positions
    const colors = [0xff4444, 0xffdd44, 0x44ff44, 0x44aaff, 0xff44ff, 0xff9900, 0xffffff];

    const burst = () => {
      const x = Phaser.Math.Between(80, W - 80);
      const y = Phaser.Math.Between(60, H * 0.6);
      const color = Phaser.Utils.Array.GetRandom(colors);

      try {
        const particles = this.add.particles(x, y, 'particle', {
          speed: { min: 50, max: 180 },
          angle: { min: 0, max: 360 },
          scale: { start: 1.5, end: 0 },
          gravityY: 100,
          lifespan: 1200,
          quantity: Math.floor(count / 3),
          tint: color,
          blendMode: Phaser.BlendModes.ADD,
        });

        this.time.delayedCall(1500, () => particles.destroy());
      } catch (_) {
        // Particle system failed — show flash instead
        const flash = this.add.circle(x, y, 20, color, 0.9).setDepth(4);
        this.tweens.add({ targets: flash, alpha: 0, scale: 3, duration: 800, onComplete: () => flash.destroy() });
      }
    };

    // Initial burst + repeated bursts
    burst();
    this._fireworksTimer = this.time.addEvent({
      delay: 800,
      loop: true,
      callback: burst,
    });
  }

  shutdown() {
    if (this._music) {
      try { this._music.stop(); } catch (_) {}
    }
    if (this._fireworksTimer) {
      this._fireworksTimer.remove(false);
    }
  }
}
