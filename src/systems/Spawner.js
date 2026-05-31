import Catchable from '../entities/Catchable.js';
import spawnStrategies from './spawnStrategies.js';

export default class Spawner {
  constructor(scene) {
    this._scene = scene;
    this._group = scene.physics.add.group({
      classType: Catchable,
      runChildUpdate: true,
      maxSize: -1,
    });
    this._timer = null;
    this._levelCfg = null;
    this._spawnCount = 0;
    this._active = false;
  }

  get group() { return this._group; }

  configure(levelCfg) {
    this._levelCfg = levelCfg;
    this._spawnCount = 0;
  }

  start() {
    if (!this._levelCfg) return;
    this._active = true;
    this._scheduleNext();
  }

  stop() {
    this._active = false;
    if (this._timer) {
      this._timer.remove(false);
      this._timer = null;
    }
  }

  despawnAll() {
    this._group.getChildren().forEach(c => {
      if (c.active) c.despawn();
    });
  }

  _scheduleNext() {
    if (!this._active || !this._levelCfg) return;
    this._timer = this._scene.time.delayedCall(this._levelCfg.spawnIntervalMs, () => {
      this._trySpawn();
      if (this._active) this._scheduleNext();
    });
  }

  _trySpawn() {
    const cfg = this._levelCfg;
    const activeCount = this._group.getChildren().filter(c => c.active).length;
    if (activeCount >= cfg.maxSim) return;

    const itemType = this._weightedRandom(cfg.itemMix);
    const strategy = spawnStrategies[cfg.spawnPattern] || spawnStrategies.random;
    const { x, y } = strategy(this._scene, cfg, this._spawnCount);

    // Get or create a Catchable from the pool
    let obj = this._group.getFirstDead(false);
    if (!obj) {
      obj = new Catchable(this._scene, x, y);
      this._group.add(obj);
    }
    obj.spawn(x, y, itemType, cfg.speedMul);
    this._spawnCount++;
  }

  _weightedRandom(itemMix) {
    const total = itemMix.reduce((s, i) => s + i.weight, 0);
    let r = Math.random() * total;
    for (const item of itemMix) {
      r -= item.weight;
      if (r <= 0) return item.type;
    }
    return itemMix[0].type;
  }

  update(nova) {
    this._group.getChildren().forEach(c => {
      if (c.active) c.update(nova);
    });
  }
}
