/*:
 * @target MZ
 * @plugindesc Disable auto save tool
 * @author Kumo
 *
 * @param BlockedMaps
 * @text 禁止記錄地圖
 * @type number[]
 * @default []
 */

(() => {

  const params = PluginManager.parameters(document.currentScript.src.match(/([^\/]+)\.js$/)[1]);
  const BLOCKED_MAPS = JSON.parse(params.BlockedMaps || "[]").map(Number);

  //--------------------------------
  // Title Command
  //--------------------------------

  const _isAutosaveEnabled = Scene_Base.prototype.isAutosaveEnabled;
  Scene_Base.prototype.isAutosaveEnabled = function () {
  // Credits CG map 不用自動存檔
    if (BLOCKED_MAPS.includes($gameMap.mapId())) {
      return false;
    }
    return _isAutosaveEnabled.call(this);
  };
})();