/*:
 * @target MZ
 * @plugindesc Adds a Credits command to the Title Screen.
 * @author Kumo
 *
 * @param Command Name
 * @default Credits
 *
 * @param Map ID
 * @type number
 * @default 1
 *
 * @param X
 * @type number
 * @default 0
 *
 * @param Y
 * @type number
 * @default 0
 *
 * @param Direction
 * @type select
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 2
 */

(() => {

const params = PluginManager.parameters(document.currentScript.src.match(/([^\/]+)\.js$/)[1]);

const commandName = params["Command Name"] || "Credits";
const mapId = Number(params["Map ID"] || 1);
const x = Number(params["X"] || 0);
const y = Number(params["Y"] || 0);
const dir = Number(params["Direction"] || 2);

//--------------------------------
// Title Command
//--------------------------------

const _makeCommandList = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function() {
    _makeCommandList.call(this);
    this.addCommand(commandName, "credits");
};

const _createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
    _createCommandWindow.call(this);
    this._commandWindow.setHandler("credits", this.commandCredits.bind(this));
};

Scene_Title.prototype.commandCredits = function() {
    DataManager.setupNewGame();
    $gamePlayer.reserveTransfer(mapId, x, y, dir, 0);
    SceneManager.goto(Scene_Map);
};

})();