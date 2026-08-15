/*:
 * @target MZ
 * @plugindesc v1.0 簡易玩家飄字
 * @author Kumo
 *
 * @command ShowFloatingText
 * @text Show Floating Text
 *
 * @arg text
 * @type string
 * @default 探索PT +1
 * @text Text
 * 
 * @arg delay
 * @type number
 * @default 0
 * @text Delay (1/60fps)
 */

(() => {

  const pluginName = "KumoFloatingText";

  //-----------------------------------------------------------------------------
  // Plugin Command
  //-----------------------------------------------------------------------------

  PluginManager.registerCommand(pluginName, "ShowFloatingText", args => {
    const scene = SceneManager._scene;
    if (scene && scene._spriteset) {
      scene._spriteset.showFloatingText(
        tr(args.text),
        Number(args.delay || 0)
      );
    }
  });

  //-----------------------------------------------------------------------------
  // Sprite_FloatingText
  //-----------------------------------------------------------------------------

  class Sprite_FloatingText extends Sprite {

    constructor(text, delay = 0) {
      super(new Bitmap(240, 48));

      this.bitmap.fontSize = 24;
      this.bitmap.outlineWidth = 4;
      this.bitmap.drawText(text, 0, 0, 240, 48, "center");

      this.anchor.set(0.5, 1);

      this._duration = 120;
      this._delay = delay;

      // 延遲期間先隱藏
      if (delay > 0) {
        this.visible = false;
      }
    }

    update() {
      super.update();

      // 延遲倒數
      if (this._delay > 0) {
        this._delay--;

        if (this._delay === 0) {
          this.visible = true;
        }

        return;
      }

      this.y -= 0.5;
      this.opacity -= 255 / this._duration;
    }

    isFinished() {
      return this._delay <= 0 && this.opacity <= 0;
    }
  }

  //-----------------------------------------------------------------------------
  // Spriteset_Map
  //-----------------------------------------------------------------------------

  const _Spriteset_Map_createUpperLayer =
    Spriteset_Map.prototype.createUpperLayer;

  Spriteset_Map.prototype.createUpperLayer = function () {
    _Spriteset_Map_createUpperLayer.call(this);

    this._floatingTextContainer = new Sprite();
    this.addChild(this._floatingTextContainer);
  };

  Spriteset_Map.prototype.showFloatingText = function (text, delay = 0) {

    const sprite = new Sprite_FloatingText(text, delay);

    sprite.x = $gamePlayer.screenX();
    sprite.y = $gamePlayer.screenY() - 48;

    this._floatingTextContainer.addChild(sprite);
  };

  const _Spriteset_Map_update =
    Spriteset_Map.prototype.update;

  Spriteset_Map.prototype.update = function () {
    _Spriteset_Map_update.call(this);

    if (!this._floatingTextContainer) return;

    for (const sprite of [...this._floatingTextContainer.children]) {

      sprite.update();

      if (sprite.isFinished()) {
        this._floatingTextContainer.removeChild(sprite);
      }
    }
  };

})();