export default class KeyboardInput {
  constructor(scene) {
    this._scene = scene;
    this._cursors = scene.input.keyboard.createCursorKeys();
    this._space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this._wasd = scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
    });
    this._jumpConsumed = false;
  }

  isMovingLeft()  { return this._cursors.left.isDown  || this._wasd.left.isDown;  }
  isMovingRight() { return this._cursors.right.isDown || this._wasd.right.isDown; }

  isJumping() {
    const pressed = Phaser.Input.Keyboard.JustDown(this._cursors.up)
      || Phaser.Input.Keyboard.JustDown(this._space)
      || Phaser.Input.Keyboard.JustDown(this._wasd.up);
    return pressed;
  }

  destroy() {
    // keyboard keys auto-clean with scene restart
  }
}
