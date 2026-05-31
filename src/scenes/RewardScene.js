import GameState from '../state/GameState.js';

export default class RewardScene extends Phaser.Scene {
  constructor() { super({ key: 'RewardScene' }); }

  init(data) {
    this._completedLevel = data ? data.level : GameState.currentLevel;
    this._gone = false;
    this._autoTimer = null;
  }

  create() {
    const W = this.scale.gameSize.width;
    const H = this.scale.gameSize.height;

    // Semi-transparent dark overlay
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.75);

    // Biscuit
    this.add.image(W / 2, H / 2 - 60, 'biscuit').setScale(1.5);

    // Congratulation text
    this.add.text(W / 2, H / 2 + 20, `Level ${this._completedLevel} Complete!`, {
      fontFamily: 'Georgia, serif',
      fontSize: '28px',
      fill: '#ffdd44',
      stroke: '#000',
      strokeThickness: 5,
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 60, '🦴 Have a biscuit, Nova! 🦴', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 95, `Score: ${GameState.score}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      fill: '#aaffaa',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // Continue button
    const continueBtn = this.add.rectangle(W / 2, H / 2 + 140, 160, 44, 0x33aa55, 0.95).setInteractive({ useHandCursor: true });
    const continueTxt = this.add.text(W / 2, H / 2 + 140, 'Continue ▶', {
      fontFamily: 'monospace', fontSize: '18px', fill: '#fff', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);

    const goNext = () => {
      if (this._gone) return;
      this._gone = true;
      if (this._autoTimer) this._autoTimer.remove(false);
      GameState.nextLevel();
      this.scene.start('GameScene');
    };

    continueBtn.on('pointerdown', goNext);
    continueBtn.on('pointerover', () => continueBtn.setFillStyle(0x44cc66));
    continueBtn.on('pointerout',  () => continueBtn.setFillStyle(0x33aa55));

    // Also allow space/enter to continue
    this.input.keyboard.once('keydown-SPACE', goNext);
    this.input.keyboard.once('keydown-ENTER', goNext);

    // Auto-advance after 3 seconds (use Phaser timer so it honors tab visibility pause)
    this._autoTimer = this.time.delayedCall(3000, goNext);

    // Biscuit bounce animation
    const biscuit = this.children.list.find(c => c.texture && c.texture.key === 'biscuit');
    if (biscuit) {
      this.tweens.add({
        targets: biscuit,
        y: biscuit.y - 15,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  shutdown() {
    if (this._autoTimer) this._autoTimer.remove(false);
  }
}
