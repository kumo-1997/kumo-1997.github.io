/*:
 * @target MZ
 * @plugindesc Tutorial Transfer Lock
 * @author Kumo
 */

(() => {
  // ============================
  // Config
  // ============================

  const SW = {
    TUTORIAL_RUNNING: 302,
    ALLOW_TRANSFER_ONCE: 320,
  };

  const TUTORIAL = {
    TELEPORT: 1,
    NOTEBOOK: 2,
    ITEM: 3,
    EQUIP: 4,
    BATTLE: 5,
  };

  const VAR = {
    CURRENT_TUTORIAL: 410,
  };



  // ============================
  // Utils
  // ============================

  function isTutorialRunning() {
    return $gameSwitches.value(SW.TUTORIAL_RUNNING);
  }

  function allowTransferOnce() {
    return $gameSwitches.value(SW.ALLOW_TRANSFER_ONCE);
  }

  function consumeTransferPermission() {
    $gameSwitches.setValue(SW.ALLOW_TRANSFER_ONCE, false);
  }

  function currentTutorial() {
    return $gameVariables.value(VAR.CURRENT_TUTORIAL);
  }

  // ============================
  // Hook
  // ============================

  const COMMON_EVENT = {
    SHOW_TUTORIAL_HINT: 223,
  };

  const _reserveTransfer = Game_Player.prototype.reserveTransfer;

  Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
    if (!isTutorialRunning()) {
      return _reserveTransfer.call(this, mapId, x, y, d, fadeType);
    }

    if (allowTransferOnce()) {
      consumeTransferPermission();
      return _reserveTransfer.call(this, mapId, x, y, d, fadeType);
    }

    if (!$gameTemp.isCommonEventReserved()) {
      $gameTemp.reserveCommonEvent(COMMON_EVENT.SHOW_TUTORIAL_HINT);
    }
  };
})();
