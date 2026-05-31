import { LEVELS } from '../data/levelConfig.js';
import GameState from '../state/GameState.js';

export default class LevelManager {
  constructor(scene, spawner, hud) {
    this._scene = scene;
    this._spawner = spawner;
    this._hud = hud;
    this._timer = null;
    this._remaining = 0;
    this._quota = 0;
    this._paused = false;
  }

  init() {
    const cfg = LEVELS[GameState.currentLevel - 1];
    this._quota = cfg.quota;
    this._remaining = cfg.timerSec;
    this._paused = false;

    this._spawner.configure(cfg);
    this._spawner.start();

    // 1-second tick
    this._timer = this._scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this._onTick,
      callbackScope: this,
    });

    this._hud.update(GameState.catches, this._quota, this._remaining);
  }

  get quota() { return this._quota; }

  _onTick() {
    if (this._paused) return;
    this._remaining = Math.max(0, this._remaining - 1);
    this._hud.update(GameState.catches, this._quota, this._remaining);

    if (this._remaining === 0) {
      this._onTimerExpired();
    }
  }

  onCatch() {
    this._hud.update(GameState.catches, this._quota, this._remaining);

    if (GameState.catches >= this._quota) {
      this._passLevel();
    }
  }

  pauseTimer() {
    this._paused = true;
  }

  resumeTimer() {
    this._paused = false;
  }

  _onTimerExpired() {
    if (this._paused) return;
    this._stop();
    GameState.loseLife();

    if (GameState.lives > 0) {
      this._scene.time.delayedCall(500, () => {
        this._scene.scene.restart({ level: GameState.currentLevel });
      });
    } else {
      this._scene.time.delayedCall(500, () => {
        this._scene.scene.start('GameOverScene');
      });
    }
  }

  _passLevel() {
    if (this._paused) return;
    this._paused = true;
    this._stop();

    if (GameState.currentLevel >= 10) {
      this._scene.time.delayedCall(300, () => {
        this._scene.scene.start('FinaleScene');
      });
    } else {
      this._scene.time.delayedCall(300, () => {
        this._scene.scene.start('RewardScene', { level: GameState.currentLevel });
      });
    }
  }

  _stop() {
    this._spawner.stop();
    this._spawner.despawnAll();
    if (this._timer) {
      this._timer.remove(false);
      this._timer = null;
    }
  }

  destroy() {
    this._stop();
  }
}
