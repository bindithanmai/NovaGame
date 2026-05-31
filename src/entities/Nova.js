export default class Nova extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'nova');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1.0);
    this.setCollideWorldBounds(true);

    // Physics body sized proportionally to the actual frame, works for both
    // the placeholder (64×96) and the real sprite sheet frames (e.g. 65×54).
    const bw = Math.round(this.width * 0.70);
    const bh = Math.round(this.height * 0.88);
    this.body.setSize(bw, bh);
    this.body.setOffset((this.width - bw) / 2, this.height - bh);

    this._confusedTimer = null;
    this._facingLeft    = false;
    this._hasAnims      = scene.anims.exists('nova-run');
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Play a named animation if the real sprite sheet is loaded, otherwise tint. */
  _playAnim(key, tint) {
    if (this._hasAnims) {
      this.play(key, true);        // ignoreIfPlaying = true → no restart flicker
      this.clearTint();
    } else {
      if (!this._confused) this.setTint(tint);
    }
  }

  // ── Movement API ──────────────────────────────────────────────────────────

  moveLeft() {
    this.body.setVelocityX(-220);
    this._facingLeft = true;
    this.setFlipX(false);
    this._playAnim('nova-run', 0xd4952a);
  }

  moveRight() {
    this.body.setVelocityX(220);
    this._facingLeft = false;
    this.setFlipX(true);
    this._playAnim('nova-run', 0xd4952a);
  }

  stop() {
    this.body.setVelocityX(0);
    if (this.body.blocked.down) {
      this._playAnim('nova-idle', 0xd4952a);
    }
  }

  jump() {
    if (this.body.blocked.down) {
      this.body.setVelocityY(-550);
      this._playAnim('nova-jump', 0xd4952a);
      return true;
    }
    return false;
  }

  // ── Feedback ──────────────────────────────────────────────────────────────

  playConfused() {
    if (this._confused) return;
    this._confused = true;
    this.setTint(0xf5c84a);   // brightened golden — confused flash

    if (this._confusedTimer) this._confusedTimer.remove();
    this._confusedTimer = this.scene.time.delayedCall(1000, () => {
      this._confused = false;
      this.clearTint();
    });
  }

  // ── Per-frame ─────────────────────────────────────────────────────────────

  update(input) {
    if (!input) return;

    // Refresh _hasAnims lazily (animations register in BootScene.create, which
    // runs before GameScene.create, so this is only needed as a safety net).
    if (!this._hasAnims) this._hasAnims = this.scene.anims.exists('nova-run');

    if (input.isMovingLeft()) {
      this.moveLeft();
    } else if (input.isMovingRight()) {
      this.moveRight();
    } else {
      this.stop();
    }

    if (input.isJumping()) {
      this.jump();
    }
  }
}
