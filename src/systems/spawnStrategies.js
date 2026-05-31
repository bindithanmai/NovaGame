// Strategy registry: each strategy picks a spawn position (x, y) for a new object
const spawnStrategies = {
  random(scene, levelCfg) {
    const W = scene.scale.gameSize.width;
    const x = Phaser.Math.Between(40, W - 40);
    const y = -40;
    return { x, y };
  },

  wave(scene, levelCfg, waveIndex = 0) {
    const W = scene.scale.gameSize.width;
    // Objects appear in a wave pattern across the top
    const slots = levelCfg.maxSim + 1;
    const slotW = W / slots;
    const offset = Phaser.Math.Between(-20, 20);
    const x = slotW * ((waveIndex % slots) + 1) + offset;
    const y = -40;
    return { x, y };
  },

  diagonal(scene, levelCfg, index = 0) {
    const W = scene.scale.gameSize.width;
    // Alternates from left and right edges at increasing heights
    const fromLeft = index % 2 === 0;
    return { x: fromLeft ? -40 : W + 40, y: Phaser.Math.Between(60, 150) };
  },
};

export default spawnStrategies;
