import KeyboardInput from './KeyboardInput.js';
import TouchInput    from './TouchInput.js';

export default class InputController {
  constructor(scene) {
    const useTouch = scene.sys.game.device.input.touch && !scene.sys.game.device.os.desktop;
    this._impl = useTouch ? new TouchInput(scene) : new KeyboardInput(scene);

    // Always also listen to keyboard on desktop even if touch is available
    if (useTouch && scene.sys.game.device.os.desktop) {
      this._keyboard = new KeyboardInput(scene);
    }
  }

  isMovingLeft() {
    return this._impl.isMovingLeft() || (this._keyboard?.isMovingLeft() ?? false);
  }

  isMovingRight() {
    return this._impl.isMovingRight() || (this._keyboard?.isMovingRight() ?? false);
  }

  isJumping() {
    return this._impl.isJumping() || (this._keyboard?.isJumping() ?? false);
  }

  destroy() {
    this._impl.destroy();
    this._keyboard?.destroy();
  }
}
