export default class TouchInput {
  constructor(scene) {
    this._scene = scene;
    this._left = false;
    this._right = false;
    this._jumpQueued = false;

    const W = scene.scale.gameSize.width;   // 800
    const H = scene.scale.gameSize.height;  // 450

    // Three full-height zones using Phaser game-world coordinates
    const zoneLeft   = scene.add.zone(W * 0.167, H / 2, W / 3, H).setInteractive();
    const zoneCenter = scene.add.zone(W * 0.5,   H / 2, W / 3, H).setInteractive();
    const zoneRight  = scene.add.zone(W * 0.833, H / 2, W / 3, H).setInteractive();

    this._zones = [zoneLeft, zoneCenter, zoneRight];

    zoneLeft.on('pointerdown',   () => { this._left  = true; });
    zoneLeft.on('pointerup',     () => { this._left  = false; });
    zoneLeft.on('pointerout',    () => { this._left  = false; });

    zoneRight.on('pointerdown',  () => { this._right = true; });
    zoneRight.on('pointerup',    () => { this._right = false; });
    zoneRight.on('pointerout',   () => { this._right = false; });

    zoneCenter.on('pointerdown', () => { this._jumpQueued = true; });
  }

  isMovingLeft()  { return this._left;  }
  isMovingRight() { return this._right; }

  isJumping() {
    if (this._jumpQueued) {
      this._jumpQueued = false;
      return true;
    }
    return false;
  }

  destroy() {
    this._zones.forEach(z => z.destroy());
  }
}
