export const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: 'game',
  backgroundColor: '#1a1a2e',
  dom: {
    createContainer: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 450,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false,
    },
  },
};
