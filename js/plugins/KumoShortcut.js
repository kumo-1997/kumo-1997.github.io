/*:
 * @target MZ
 * @plugindesc Shortcut
 * @author Kumo
 */

(() => {
  const COMMON_EVENT = {
    TELEPORT: 18,
    NOTEBOOK: 55
  };

  // 功能鍵
  Input.keyMapper[84] = "teleport"; // T
  Input.keyMapper[78] = "notebook"; // N
  Input.keyMapper[73] = "item";     // I
  Input.keyMapper[69] = "equip";    // E

  // WASD 移動
  Input.keyMapper[87] = "up";       // W
  Input.keyMapper[65] = "left";     // A
  Input.keyMapper[83] = "down";     // S
  Input.keyMapper[68] = "right";    // D

  // 角色切換
  Input.keyMapper[219] = "pageup";    // [
  Input.keyMapper[221] = "pagedown";  // ]

  function canOpenShortcut() {
    return (
      $gamePlayer.canMove() &&
      !$gameMessage.isBusy() &&
      !$gameMap.isEventRunning()
    );
  }

  function reserveCommonEvent(id) {
    if ($gameTemp.isCommonEventReserved()) {
      return;
    }

    $gameTemp.reserveCommonEvent(id);
  }

  const _Scene_Menu_start = Scene_Menu.prototype.start;
  Scene_Menu.prototype.start = function () {
    _Scene_Menu_start.call(this);

    if ($gameTemp._quickEquip) {
      $gameTemp._quickEquip = false;

      this._commandWindow.selectSymbol("equip");
      this._commandWindow.processOk();

      // 隊伍只有一人，自動確認第一位角色
      if ($gameParty.size() === 1) {
        this._statusWindow.processOk();
      }
      return;
    }

    if ($gameTemp._quickItem) {
      $gameTemp._quickItem = false;

      this._commandWindow.selectSymbol("item");
      this._commandWindow.processOk();
      return;
    }
  }

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);

    if (!canOpenShortcut()) {
      return;
    }

    if (Input.isTriggered("teleport")) {
      SoundManager.playOk();
      reserveCommonEvent(COMMON_EVENT.TELEPORT);
      return;
    }

    if (Input.isTriggered("notebook")) {
      SoundManager.playOk();
      reserveCommonEvent(COMMON_EVENT.NOTEBOOK);
      return;
    }

    if (Input.isTriggered("item")) {
      $gameTemp._quickItem = true;
      SceneManager.push(Scene_Menu);
      return;
    }

    if (Input.isTriggered("equip")) {
      $gameTemp._quickEquip = true;
      SceneManager.push(Scene_Menu);
      return;
    }
  };
})();
