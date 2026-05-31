import { GAME_CONFIG }  from './config.js';
import BootScene        from './scenes/BootScene.js';
import MenuScene        from './scenes/MenuScene.js';
import GameScene        from './scenes/GameScene.js';
import RewardScene      from './scenes/RewardScene.js';
import FinaleScene      from './scenes/FinaleScene.js';
import GameOverScene    from './scenes/GameOverScene.js';

const game = new Phaser.Game({
  ...GAME_CONFIG,
  scene: [BootScene, MenuScene, GameScene, RewardScene, FinaleScene, GameOverScene],
});

// Expose for debugging
if (typeof window !== 'undefined') {
  window.__novaGame = game;
}
