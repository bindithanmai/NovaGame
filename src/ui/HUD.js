import GameState from '../state/GameState.js';

export default class HUD {
  constructor(scene) {
    this._scene = scene;
    const W = scene.scale.gameSize.width;

    const textStyle = {
      fontFamily: 'monospace',
      fontSize: '18px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    };

    const smallStyle = { ...textStyle, fontSize: '15px' };

    // Hearts (lives)
    this._hearts = [];
    for (let i = 0; i < 3; i++) {
      const h = scene.add.text(14 + i * 30, 12, '♥', { ...textStyle, fill: '#ff3366', fontSize: '22px', stroke: '#000', strokeThickness: 3 });
      h.setScrollFactor(0).setDepth(10);
      this._hearts.push(h);
    }

    // Catches
    this._catchText = scene.add.text(W / 2, 12, 'Catches: 0/5', textStyle)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(10);

    // Timer
    this._timerText = scene.add.text(W - 12, 12, '60', textStyle)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(10);

    // Level
    this._levelText = scene.add.text(14, 38, 'Level 1/10', smallStyle)
      .setScrollFactor(0)
      .setDepth(10);

    // Score
    this._scoreText = scene.add.text(W - 12, 38, 'Score: 0', smallStyle)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(10);
  }

  update(catches, quota, timerSec) {
    const lives = GameState.lives;
    const level = GameState.currentLevel;
    const score = GameState.score;

    // Update hearts
    this._hearts.forEach((h, i) => {
      h.setVisible(i < lives);
    });

    this._catchText.setText(`Catches: ${catches}/${quota}`);
    this._timerText.setText(String(timerSec));
    this._levelText.setText(`Level ${level}/10`);
    this._scoreText.setText(`Score: ${score}`);
  }

  destroy() {
    this._hearts.forEach(h => h.destroy());
    this._catchText.destroy();
    this._timerText.destroy();
    this._levelText.destroy();
    this._scoreText.destroy();
  }
}
