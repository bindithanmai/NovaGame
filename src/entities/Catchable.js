import { ITEM_TYPES } from '../data/itemTypes.js';

export default class Catchable extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'item-ball');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false).setVisible(false);
    this._type         = null;
    this._motion       = null;
    this._diveTriggered = false;
    this._caught       = false;
    this._missEmitted  = false;
    this._bounced      = false;
    this._flyBaseY     = 0;
    this._flyStartTime = 0;
  }

  spawn(x, y, itemTypeName, speedMul) {
    const itemDef = ITEM_TYPES[itemTypeName];
    if (!itemDef) return;

    this._type          = itemTypeName;
    this._motion        = itemDef.motion;
    this._speed         = itemDef.baseSpeed * speedMul;
    this._points        = itemDef.points;
    this._diveTriggered = false;
    this._caught        = false;
    this._missEmitted   = false;
    this._bounced       = false;
    this._flyBaseY      = 0;
    this._flyStartTime  = 0;

    this.setTexture(itemDef.textureKey);
    this.setPosition(x, y);
    this.setActive(true).setVisible(true);
    this.body.reset(x, y);
    this.clearTint();
    this.setFlipX(false);

    if (this._motion === 'fall') {
      const drift = Phaser.Math.Between(-40, 40);
      this.body.setVelocity(drift, this._speed * 0.6);
      this.body.setGravityY(300);

    } else if (this._motion === 'arc') {
      // setX alone doesn't move the physics body — must call body.reset()
      const fromLeft = Phaser.Math.Between(0, 1) === 0;
      const startX   = fromLeft ? -50 : 850;
      this.body.reset(startX, y);
      this.body.setVelocityX(fromLeft ? this._speed * 0.8 : -this._speed * 0.8);
      this.body.setVelocityY(this._speed * 0.3);
      this.body.setGravityY(100);

    } else if (this._motion === 'dive') {
      // setX/setY don't move the physics body — must call body.reset()
      const fromLeft = Phaser.Math.Between(0, 1) === 0;
      const startX   = fromLeft ? -50 : 850;
      const startY   = Phaser.Math.Between(80, 200);
      this.body.reset(startX, startY);
      this.body.setVelocityX(fromLeft ? this._speed : -this._speed);
      this.body.setVelocityY(0);
      this.body.setAllowGravity(false);
      this._willDive = (itemTypeName !== 'duck') && Math.random() < 0.6;

    } else if (this._motion === 'fly') {
      // Horizontal sine-wave flight (bird, duck, frisbee)
      // setX/setY don't move the physics body — must call body.reset()
      const fromLeft = Phaser.Math.Between(0, 1) === 0;
      const startY   = Phaser.Math.Between(200, 360);
      const startX   = fromLeft ? -50 : 850;
      this.setFlipX(!fromLeft);           // face the direction of travel
      this._flyBaseY = startY;
      this.body.reset(startX, startY);
      this.body.setVelocityX(fromLeft ? this._speed : -this._speed);
      this.body.setVelocityY(0);
      this.body.setAllowGravity(false);
    }
  }

  despawn() {
    this.setActive(false).setVisible(false);
    this.body.reset(0, -100);
    this.body.setVelocity(0, 0);
    this.body.setGravityY(0);
    this.body.setAllowGravity(true);  // restore for next spawn (pool reuse)
    this.setFlipX(false);
    this._caught       = false;
    this._missEmitted  = false;
    this._bounced      = false;
    this._flyBaseY     = 0;
    this._flyStartTime = 0;
  }

  get points() { return this._points || 10; }
  get motion()  { return this._motion; }
  get caught()  { return this._caught; }
  set caught(v) { this._caught = v; }

  update(nova) {
    if (!this.active) return;

    // ── Ball bounce ───────────────────────────────────────────────────────
    if (this._motion === 'fall' && this._type === 'ball' && !this._bounced) {
      const groundY = this.scene.scale.gameSize.height - 30;
      if (this.y >= groundY - this.displayHeight * 0.5 && this.body.velocity.y > 0) {
        this._bounced = true;
        this.y = groundY - this.displayHeight * 0.5 - 1;
        this.body.setVelocityY(-this.body.velocity.y * 0.55);
      }
    }

    // ── Fish/dive-item dive trigger ───────────────────────────────────────
    if (this._motion === 'dive' && this._willDive && !this._diveTriggered) {
      if (this.x > 100 && this.x < 700) {
        this._diveTriggered = true;
        this.body.setAllowGravity(true);
        this.body.setVelocityY(this._speed * 1.2);
        this.body.setGravityY(200);
      }
    }

    // ── Duck-missed event ─────────────────────────────────────────────────
    if (this._motion === 'dive' && !this._caught && !this._missEmitted && nova) {
      if (this.y > nova.y + 50) {
        this._missEmitted = true;
        this.scene.events.emit('duck-missed');
      }
    }

    // ── Bird sine-wave flight ─────────────────────────────────────────────
    if (this._motion === 'fly') {
      if (!this._flyStartTime) this._flyStartTime = this.scene.time.now;
      const elapsed = this.scene.time.now - this._flyStartTime;

      // Oscillate ±35 px around the spawn height, ~3-second wave period
      const targetY = this._flyBaseY + Math.sin(elapsed * 0.002) * 35;
      // Spring toward target — smooth, no gravity needed
      this.body.setVelocityY((targetY - this.y) * 8);
    }

    // ── Off-screen removal ────────────────────────────────────────────────
    const bounds = this.scene.scale.gameSize;
    if (
      this.y > bounds.height + 100 ||
      this.x < -200 ||
      this.x > bounds.width + 200
    ) {
      this.despawn();
    }
  }
}
