/*:
 * @target MZ
 * @plugindesc Kumo Camera System v1.0
 * @author Kumo
 *
 * @command CameraFocusEvent
 * @text Focus Event
 *
 * @arg eventId
 * @type number
 * @default 1
 *
 * @command CameraFocusPlayer
 * @text Focus Player
 *
 * @command CameraMoveTo
 * @text Move Camera To
 *
 * @arg x
 * @type number
 * @default 0
 *
 * @arg y
 * @type number
 * @default 0
 */

(() => {

  let cameraMode = "player";
  let targetEventId = 0;

  const centerOn = (x, y) => {
    const displayX = x - $gamePlayer.centerX();
    const displayY = y - $gamePlayer.centerY();

    $gameMap.setDisplayPos(displayX, displayY);
  };

  PluginManager.registerCommand(
    "KumoCameraSystem",
    "CameraFocusEvent",
    args => {
      cameraMode = "event";
      targetEventId = Number(args.eventId);
    }
  );

  PluginManager.registerCommand(
    "KumoCameraSystem",
    "CameraFocusPlayer",
    () => {
      cameraMode = "player";
      targetEventId = 0;

      centerOn(
        $gamePlayer.x,
        $gamePlayer.y
      );
    }
  );

  PluginManager.registerCommand(
    "KumoCameraSystem",
    "CameraMoveTo",
    args => {

      cameraMode = "fixed";

      centerOn(
        Number(args.x),
        Number(args.y)
      );
    }
  );

  const _Game_Map_update = Game_Map.prototype.update;

  Game_Map.prototype.update = function (sceneActive) {

    _Game_Map_update.call(this, sceneActive);

    if (cameraMode === "event") {

      const event = $gameMap.event(targetEventId);

      if (event) {
        centerOn(
          event.x,
          event.y
        );
      }
    }
  };

})();