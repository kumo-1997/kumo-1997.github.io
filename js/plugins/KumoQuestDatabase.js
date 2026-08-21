/*:
 * @target MZ
 * @plugindesc Kumo Quest Database
 * @author Kumo
 * @help
 * 任務資料已獨立到 data/KumoQuest.json
 * 本插件負責載入並提供 window.KumoQuestDatabase
 */

(() => {
  //-------------------------------------------------------------
  // 載入 KumoQuest.json
  //-------------------------------------------------------------
  const _DataManager_loadDatabase = DataManager.loadDatabase;
  DataManager.loadDatabase = function () {
    _DataManager_loadDatabase.call(this);
    this.loadDataFile("$dataKumoQuest", "KumoQuest.json");
  };

  // 確保資料載入完成後再掛到 window
  const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function () {
    if (!_DataManager_isDatabaseLoaded.call(this)) return false;
    if (!window.KumoQuestDatabase) {
      window.KumoQuestDatabase = {
        tasks: $dataKumoQuest || {}
      };
    }
    return true;
  };

  //-------------------------------------------------------------
  // Demo 結束檢查
  //-------------------------------------------------------------
  // 臨時放在這 demo 到達特定章節後提前結束遊戲
  const CHAPTER_STAGE_ID = 62;
  const DEMO_CHAPTER_STAGE = 5; // 5 = 第四章節開始，但是還沒進入第5章節的主要劇情
  const DEMO_EVENT_ID = 29;
  const IFNORE_DEMO_CHECK_FLAG = 20;

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);

    if ($gameSwitches.value(IFNORE_DEMO_CHECK_FLAG)) return;

    const chapter_4_stage = $gameVariables.value(77);

    if (
      $gameVariables.value(CHAPTER_STAGE_ID) >= DEMO_CHAPTER_STAGE &&
      chapter_4_stage >= 5
    ) {
      $gameTemp.reserveCommonEvent(DEMO_EVENT_ID);
    }
  };

  //-------------------------------------------------------------
  // 預設玩家速度
  //-------------------------------------------------------------
  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function () {
    _Scene_Map_onMapLoaded.call(this);
    $gamePlayer.setMoveSpeed(5);
  };

  //-------------------------------------------------------------
  // 教學戰鬥限制道具
  //-------------------------------------------------------------
  const TUTORIAL_SWITCH = 302; // 是否進行較學
  const TUTORIAL_TYPE_VAR = 410; // 5 = 戰鬥教學

  const _Game_BattlerBase_canUse = Game_BattlerBase.prototype.canUse;
  Game_BattlerBase.prototype.canUse = function (item) {
    if (
      $gameSwitches.value(TUTORIAL_SWITCH) &&
      $gameVariables.value(TUTORIAL_TYPE_VAR) === 5 &&
      $gameParty.inBattle() &&
      DataManager.isItem(item) &&
      item.id !== 2 // 教學藥水 id
    ) {
      return false;
    }
    return _Game_BattlerBase_canUse.call(this, item);
  };

  //-------------------------------------------------------------
  // 在技能列表的消耗數字後面加上單位（MP / Rage）
  //-------------------------------------------------------------
  const _Window_SkillList_drawSkillCost = Window_SkillList.prototype.drawSkillCost;
  Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
      if (this._actor.skillTpCost(skill) > 0) {
          this.changeTextColor(ColorManager.tpCostColor());
          const cost = this._actor.skillTpCost(skill);
          // 使用 tr() 讓單位也可以被翻譯
          this.drawText(cost + " " + tr("怒氣"), x, y, width, "right");
      } else if (this._actor.skillMpCost(skill) > 0) {
          this.changeTextColor(ColorManager.mpCostColor());
          const cost = this._actor.skillMpCost(skill);
          this.drawText(cost + " " + tr("MP"), x, y, width, "right");
      }
  };
})();
