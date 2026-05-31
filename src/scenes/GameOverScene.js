import GameState   from '../state/GameState.js';
import Leaderboard from '../state/Leaderboard.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  init(data) {
    this._isFinale    = data && data.isFinale;
    this._submitting  = false;
  }

  create() {
    const W = this.scale.gameSize.width;
    const H = this.scale.gameSize.height;

    // Background
    this.add.rectangle(W / 2, H / 2, W, H, 0x0d0d1a);

    const title = this._isFinale
      ? '🏆 You Won! All 10 Levels!'
      : '💔 Game Over';
    const titleColor = this._isFinale ? '#ffdd44' : '#ff4444';

    this.add.text(W / 2, 30, title, {
      fontFamily: 'Georgia, serif',
      fontSize: '30px',
      fill: titleColor,
      stroke: '#000',
      strokeThickness: 5,
    }).setOrigin(0.5);

    this.add.text(W / 2, 75, `Final Score: ${GameState.score}  |  Reached Level: ${GameState.currentLevel}`, {
      fontFamily: 'monospace',
      fontSize: '17px',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Name input label
    this.add.text(W / 2, 115, 'Enter your name:', {
      fontFamily: 'monospace', fontSize: '15px', fill: '#aaaaaa',
    }).setOrigin(0.5);

    // DOM input for name entry
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.maxLength = 12;
    inputEl.placeholder = 'Nova Fan';
    inputEl.value = '';
    inputEl.style.cssText = `
      width: 180px; height: 32px; font-size: 16px;
      text-align: center; border-radius: 6px;
      border: 2px solid #ffcc44; background: #1a1a2e;
      color: #ffffff; outline: none; font-family: monospace;
    `;

    const inputDom = this.add.dom(W / 2, 145, inputEl);
    inputEl.focus();

    // Submit button
    const submitBtn = this.add.rectangle(W / 2, 195, 160, 40, 0x33aa55).setInteractive({ useHandCursor: true });
    const submitTxt = this.add.text(W / 2, 195, 'Submit Score', {
      fontFamily: 'monospace', fontSize: '16px', fill: '#fff', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);

    const submit = async () => {
      if (this._submitting) return;
      this._submitting = true;

      const name = inputEl.value.trim() || 'Nova Fan';
      submitTxt.setText('Saving…');

      await Leaderboard.save({
        name,
        score: GameState.score,
        level: GameState.currentLevel,
        date: Date.now(),
      });

      inputDom.destroy();
      submitBtn.destroy();
      submitTxt.destroy();
      await this._showLeaderboard(W, H);
    };

    submitBtn.on('pointerdown', submit);
    submitBtn.on('pointerover', () => submitBtn.setFillStyle(0x44cc66));
    submitBtn.on('pointerout',  () => submitBtn.setFillStyle(0x33aa55));
    this.input.keyboard.once('keydown-ENTER', submit);
  }

  async _showLeaderboard(W, H) {
    const loading = this.add.text(W / 2, 230, '⏳ Loading scores…', {
      fontFamily: 'monospace', fontSize: '14px', fill: '#aaaaaa',
    }).setOrigin(0.5);

    const entries = await Leaderboard.load();
    loading.destroy();

    this.add.text(W / 2, 230, '🏆 Leaderboard', {
      fontFamily: 'monospace', fontSize: '18px', fill: '#ffdd44',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);

    const top10 = entries.slice(0, 10);
    if (top10.length === 0) {
      this.add.text(W / 2, 255, 'No scores yet!', {
        fontFamily: 'monospace', fontSize: '14px', fill: '#888',
      }).setOrigin(0.5);
    } else {
      top10.forEach((entry, i) => {
        const isNew = i === 0 && entry.date > Date.now() - 5000;
        this.add.text(W / 2, 255 + i * 18,
          `${i + 1}. ${String(entry.name).padEnd(12)} ${String(entry.score).padStart(7)}  Lv${entry.level}`,
          {
            fontFamily: 'monospace',
            fontSize: '13px',
            fill: isNew ? '#aaffaa' : '#ffffff',
            stroke: '#000',
            strokeThickness: 2,
          }
        ).setOrigin(0.5);
      });
    }

    // Play Again
    const playBtn = this.add.rectangle(W / 2, H - 40, 180, 44, 0xff5533)
      .setInteractive({ useHandCursor: true });
    this.add.text(W / 2, H - 40, '▶ Play Again', {
      fontFamily: 'monospace', fontSize: '18px', fill: '#fff', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);

    playBtn.on('pointerdown', () => {
      GameState.reset();
      this.scene.start('GameScene');
    });
    playBtn.on('pointerover', () => playBtn.setFillStyle(0xff6644));
    playBtn.on('pointerout',  () => playBtn.setFillStyle(0xff5533));

    // Menu button
    const menuBtn = this.add.rectangle(W / 2 + 110, H - 40, 100, 44, 0x334466)
      .setInteractive({ useHandCursor: true });
    this.add.text(W / 2 + 110, H - 40, 'Menu', {
      fontFamily: 'monospace', fontSize: '16px', fill: '#fff', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);

    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
