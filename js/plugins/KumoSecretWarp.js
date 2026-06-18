/*:
 * @target MZ
 * @plugindesc Secret Warp Code
 * @author Kumo
 */

(() => {

  const SECRET_CODE = "cat";
  const ACTIVE_MAP_ID = 13; // 旅館二樓

  const TARGET_MAP = 22;
  const TARGET_X = 10;
  const TARGET_Y = 10;

  let buffer = "";

  document.addEventListener("keydown", e => {

    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    const key = e.key.toLowerCase();

    if (!/^[a-z]$/.test(key)) {
      return;
    }

    buffer += key;

    if (buffer.length > SECRET_CODE.length) {
      buffer = buffer.slice(-SECRET_CODE.length);
    }

    if (buffer === SECRET_CODE) {

      buffer = "";

      $gamePlayer.reserveTransfer(
        TARGET_MAP,
        TARGET_X,
        TARGET_Y,
        2,
        0
      );

    }

  });

})();