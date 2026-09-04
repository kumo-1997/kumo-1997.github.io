/*:
 * @target MZ
 * @plugindesc Kumo Quest System
 * @author Kumo
 * @help
 * ============================================================
 * 版本標籤
 *   【現行】  新事件請用這些
 *   【V2】    第五章（VAR67>=5 或 VAR62>=6）才會走到
 *   【V1凍結】Ch1–4 仍會用，不要改語意、不要刪
 *   【棄用】  CE51 / 新事件都不要再呼叫；留著只為舊事件不相容
 * ============================================================
 *
 * 【現行】
 *   ShowTaskBoard
 *     開任務板場景。內部依 useQuestV2() 選 v1 或 v2 列表。
 *     場景內：選列表 → 說明 → 接受／回列表；列表 Cancel 關場景。
 *   AcceptTask
 *     本體在 KumoQuest.acceptSelectedTask()。
 *     任務板場景已直接呼叫函式；此 command 給舊事件備用。
 *   ShowCurrentTask / CompleteCurrentTask / ReportCurrentTask
 *     狀態機本體，v1／v2 共用。Report 成功後才跑 v2 hook。
 *
 * 【V2】
 *   CheckChapterRequirements
 *     檢查 KumoQuest_v2.json → chapters[章].requiredQuestIds
 *     是否全部 COMPLETED。
 *   ReportCurrentTask 的 tryUnlockChapterStory()
 *     全完成且 nextStorySwitchId > 0 才開 Switch。
 *   getAcceptableTasksV2 / chapters / tasksV2
 *
 * 【V1凍結】
 *   getAcceptableTasksV1
 *     過濾：rank <= VAR3 且 canAccept。資料源 KumoQuest.json。
 *   CheckRankCompleted
 *     舊「某一 rank 是否全完成」。新章改用 CheckChapterRequirements。
 *   KumoQuestDatabase.tasks、task.rank、VAR3
 *
 * 【棄用】不要在新事件使用
 *   ShowRankBoard     CE51 已移除階級選擇
 *   ShowSelectedTask  改由 Scene_QuestBoard 說明頁繪製
 *   ClearSelectedTask 場景 Cancel／回列表會自己清
 *   getTasksByRank    ShowTaskBoard 已改吃 VAR3，不再讀 VAR52
 *   VAR52 SELECTED_RANK_VAR
 *
 * 切換條件 useQuestV2：VAR67 >= 5  OR  VAR62 >= 6
 * 空的 v2 requiredQuestIds 不會開下一章 Switch。
 *
 * @command ShowRankBoard
 * @text 【棄用】顯示任務階級表
 * @desc 棄用。CE51 已不再呼叫。保留以免舊地圖事件報錯。新事件禁止使用。
 *
 * @command ShowTaskBoard
 * @text 【現行】顯示任務列表
 * @desc 開任務板場景。v1 吃 rank<=VAR3；v2 吃本章 requiredQuestIds。
 *
 * @command ShowSelectedTask
 * @text 【棄用】顯示任務說明
 * @desc 棄用。說明已改在任務板場景內顯示。舊事件若還呼叫才會走對話框。
 *
 * @command AcceptTask
 * @text 【現行】接受任務
 * @desc 呼叫 KumoQuest.acceptSelectedTask()。任務板場景已內建，舊事件備用。
 *
 * @command ShowCurrentTask
 * @text 【現行】顯示目前任務
 * @desc 用對話框顯示進行中任務。查看目前任務仍走這條，不是任務板場景。
 *
 * @command CompleteCurrentTask
 * @text 【現行】完成目前任務
 * @desc 狀態機：ACTIVE → READY_TO_REPORT。v1／v2 共用。
 *
 * @command ReportCurrentTask
 * @text 【現行】回報任務
 * @desc 狀態機：回報完成並發獎勵。v2 成功後額外檢查本章任務。
 *
 * @command ClearSelectedTask
 * @text 【棄用】清除已選任務
 * @desc 棄用。任務板 Cancel／回列表已內建清除。舊事件備用。
 *
 * @command CheckRankCompleted
 * @text 【V1凍結】檢查 Rank 是否全部完成
 * @desc V1凍結。檢查某一 rank 底下任務是否全完成。新章請用 CheckChapterRequirements。
 * @arg rank
 * @text rank (第一順位)
 * @arg rankId
 * @text rankId (第二順位)
 * @arg resultSwitchId
 *
 * @command CheckChapterRequirements
 * @text 【V2】檢查本章指定任務是否全部完成
 * @desc V2。讀 KumoQuest_v2.json 的 chapters。空名單不會視為完成。
 * @arg chapter
 * @text chapter（第一順位，0 則改讀變數）
 * @arg chapterVarId
 * @text chapterVarId（第二順位）
 * @arg resultSwitchId
 * @text resultSwitchId
 */

(() => {

  const QUEST_STATE = {
    NOT_ACCEPTED: 0,
    ACTIVE: 1,
    READY_TO_REPORT: 2,
    COMPLETED: 3
  };

  const getQuestStateText = (state) => {
    const map = {
      [QUEST_STATE.NOT_ACCEPTED]: tr("未接取"),
      [QUEST_STATE.ACTIVE]: tr("進行中"),
      [QUEST_STATE.READY_TO_REPORT]: tr("等待回報"),
      [QUEST_STATE.COMPLETED]: tr("已完成")
    };
    return map[state] || "";
  };

  const ACTIVE_TASK_VAR = 51;
  const SELECTED_TASK_VAR = 50;
  const PLAYER_CURRENT_RANK = 3;
  const PREPARE_TO_REPORT_FLAG = 4;
  const NO_AVAILABLE_TASK_FLAG = 21;
  const SELECTED_RANK_VAR = 52; // 【棄用】僅 ShowRankBoard 還會寫入
  const STORY_CHAPTER_VAR = 67;
  const LEGACY_CHAPTER_STAGE_VAR = 62;
  const V2_CHAPTER_THRESHOLD = 5;
  const V2_LEGACY_STAGE_THRESHOLD = 6;

  const BOARD_MARGIN_X = 165;
  const BOARD_MARGIN_TOP = 100;
  const BOARD_MARGIN_BOTTOM = 120;
  const BOARD_BODY_SIZE = 18;
  const BOARD_TITLE_SIZE = 24;
  const BOARD_LINE_HEIGHT = 26;
  const BOARD_ITEM_HEIGHT = 36;
  const BOARD_BODY_COLOR = "#E5D1AD";
  const BOARD_TITLE_COLOR = "#DDD8CE";

  const v1Tasks = () =>
    (window.KumoQuestDatabase && KumoQuestDatabase.tasks) || {};

  const v2Tasks = () =>
    (window.KumoQuestDatabase && KumoQuestDatabase.tasksV2) || {};

  const v2Chapters = () =>
    (window.KumoQuestDatabase && KumoQuestDatabase.chapters) || {};

  // 【現行／V2 切換】
  const useQuestV2 = () => {
    return (
      $gameVariables.value(STORY_CHAPTER_VAR) >= V2_CHAPTER_THRESHOLD ||
      $gameVariables.value(LEGACY_CHAPTER_STAGE_VAR) >= V2_LEGACY_STAGE_THRESHOLD
    );
  };

  const getV2ChapterKey = () => {
    let chapter = $gameVariables.value(STORY_CHAPTER_VAR);
    if (
      chapter < V2_CHAPTER_THRESHOLD &&
      $gameVariables.value(LEGACY_CHAPTER_STAGE_VAR) >= V2_LEGACY_STAGE_THRESHOLD
    ) {
      chapter = V2_CHAPTER_THRESHOLD;
    }
    return String(chapter);
  };

  const getChapterConfig = (chapterKey) => {
    const chapters = v2Chapters();
    return chapters[chapterKey] || chapters[Number(chapterKey)] || null;
  };

  window.KumoQuest = {

    availableTasks: [],
    selectedTask: null,

    useQuestV2,
    getV2ChapterKey,

    getTask(id) {
      if (id === 0 || id == null) {
        return null;
      }
      return v1Tasks()[id] || v2Tasks()[id] || null;
    },

    // 【棄用】ShowTaskBoard 已改用 getAcceptableTasksV1（rank <= VAR3）
    getTasksByRank(rank) {
      return Object.values(v1Tasks()).filter(task =>
        task.rank === rank
      );
    },

    // 【V1凍結】Ch1–4 可接列表
    getAcceptableTasksV1() {
      const currentRank = $gameVariables.value(PLAYER_CURRENT_RANK);
      return Object.values(v1Tasks()).filter(task =>
        task.rank <= currentRank && this.canAcceptTask(task)
      );
    },

    // 【V2】本章 requiredQuestIds ∩ canAccept
    getAcceptableTasksV2() {
      const config = getChapterConfig(getV2ChapterKey());
      if (!config || !Array.isArray(config.requiredQuestIds)) {
        return [];
      }

      return config.requiredQuestIds
        .map(id => this.getTask(id))
        .filter(task => task && this.canAcceptTask(task));
    },

    canAcceptTask(task) {
      if (!task) {
        return false;
      }

      if (
        $gameVariables.value(task.stateVar) !==
        QUEST_STATE.NOT_ACCEPTED
      ) {
        return false;
      }

      if (!task.previousTaskId) {
        return true;
      }

      const previousTask = this.getTask(task.previousTaskId);

      if (!previousTask) {
        return false;
      }

      return (
        $gameVariables.value(previousTask.stateVar) ===
        QUEST_STATE.COMPLETED
      );
    },

    // 【V2】
    isChapterRequirementsMet(chapterKey) {
      const config = getChapterConfig(chapterKey);
      if (!config || !Array.isArray(config.requiredQuestIds)) {
        return false;
      }
      if (config.requiredQuestIds.length === 0) {
        return false;
      }

      return config.requiredQuestIds.every(id => {
        const task = this.getTask(id);
        if (!task) {
          return false;
        }
        return (
          $gameVariables.value(task.stateVar) >= QUEST_STATE.COMPLETED
        );
      });
    },

    // 【V2】回報後 hook；空名單或 switchId=0 不開 Switch
    tryUnlockChapterStory() {
      if (!useQuestV2()) {
        return false;
      }

      const chapterKey = getV2ChapterKey();
      if (!this.isChapterRequirementsMet(chapterKey)) {
        return false;
      }

      const config = getChapterConfig(chapterKey);
      const switchId = Number(config && config.nextStorySwitchId);

      if (!switchId) {
        return false;
      }

      $gameSwitches.setValue(switchId, true);
      return true;
    },

    selectTask(task) {
      this.selectedTask = task || null;
      if ($gameVariables) {
        $gameVariables.setValue(
          SELECTED_TASK_VAR,
          task ? task.id : 0
        );
      }
    },

    acceptSelectedTask() {
      const task = this.selectedTask;

      if (!task) {
        $gameMessage.add(tr("尚未選擇任務。"));
        return false;
      }

      if (
        $gameVariables.value(ACTIVE_TASK_VAR) !==
        QUEST_STATE.NOT_ACCEPTED
      ) {
        $gameMessage.add(tr("目前已有進行中的任務。"));
        return false;
      }

      $gameVariables.setValue(task.stateVar, QUEST_STATE.ACTIVE);
      $gameVariables.setValue(ACTIVE_TASK_VAR, task.id);
      $gameMessage.add(tr("已接受委託。"));
      return true;
    },

    clearSelectedTask() {
      window.KumoQuest.selectedTask = null;
      if ($gameVariables) {
        $gameVariables.setValue(SELECTED_TASK_VAR, 0);
      }
    }
  };

  const _Game_Interpreter_updateWaitMode =
    Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function () {
    if (this._waitMode === "questBoard") {
      if (SceneManager._scene instanceof Scene_QuestBoard) {
        return true;
      }
      if (SceneManager.isSceneChanging()) {
        return true;
      }
      this._waitMode = "";
      if ($gameMessage.hasText()) {
        this._waitMode = "message";
        return true;
      }
      return false;
    }
    return _Game_Interpreter_updateWaitMode.call(this);
  };

  // 【棄用】任務階級板（CE51 不再呼叫）
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ShowRankBoard",
    function () {

      const currentRank =
        $gameVariables.value(PLAYER_CURRENT_RANK);

      const choices = [];

      for (let rank = 1; rank <= currentRank; rank++) {
        choices.push(tr(`${rank}級委託`));
      }

      $gameMessage.setChoices(choices, 0, -1);

      $gameMessage.setChoiceCallback(index => {
        if (index < 0) {
          return;
        }
        $gameVariables.setValue(SELECTED_RANK_VAR, index + 1);
      });

      this.setWaitMode("message");
    }
  );

  // 【現行】任務列表 → Scene_QuestBoard
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ShowTaskBoard",
    function () {

      KumoQuest.availableTasks = useQuestV2()
        ? KumoQuest.getAcceptableTasksV2()
        : KumoQuest.getAcceptableTasksV1();

      if (KumoQuest.availableTasks.length === 0) {
        $gameMessage.add(tr("目前沒有可接受的委託。"));
        $gameSwitches.setValue(NO_AVAILABLE_TASK_FLAG, true);
        return;
      }

      $gameSwitches.setValue(NO_AVAILABLE_TASK_FLAG, false);
      SceneManager.push(Scene_QuestBoard);
      this.setWaitMode("questBoard");
    }
  );

  // 【棄用】改由 Scene_QuestBoard detail 繪製
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ShowSelectedTask",
    function () {

      const task = KumoQuest.selectedTask;

      if (!task) {
        if (window.KumoQuest.availableTasks.length > 0) {
          $gameMessage.add(tr("尚未選擇任務。"));
        }
        return;
      }

      $gameMessage.add(`${tr(task.title)}: `);

      task.description.forEach(line => {
        $gameMessage.add(tr(line));
      });

      $gameMessage.add(tr("完成後將會獲得:"));
      task.rewardText.forEach(line => $gameMessage.add(tr(line)));
    }
  );

  // 【現行】本體在 acceptSelectedTask
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "AcceptTask",
    function () {
      KumoQuest.acceptSelectedTask();
    }
  );

  // 【現行】
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ShowCurrentTask",
    function () {

      const taskId = $gameVariables.value(ACTIVE_TASK_VAR);

      if (taskId === 0) {
        $gameMessage.add(tr("目前沒有進行中的任務。"));
        return;
      }

      const task = KumoQuest.getTask(taskId);

      if (!task) {
        $gameMessage.add(tr("任務資料不存在。"));
        return;
      }

      const taskState = $gameVariables.value(task.stateVar);

      $gameMessage.add(tr(task.title));
      $gameMessage.add(`${tr("狀態為:")} ${getQuestStateText(taskState)}`);
      $gameMessage.add("");
      $gameMessage.add("");

      task.description.forEach(line => {
        $gameMessage.add(tr(line));
      });
    }
  );

  // 【現行】
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "CompleteCurrentTask",
    function () {

      const taskId = $gameVariables.value(ACTIVE_TASK_VAR);
      if (taskId === 0) {
        return;
      }

      const task = KumoQuest.getTask(taskId);
      if (!task) {
        return;
      }

      if ($gameVariables.value(task.stateVar) !== QUEST_STATE.ACTIVE) {
        return;
      }

      $gameVariables.setValue(task.stateVar, QUEST_STATE.READY_TO_REPORT);
      $gameMessage.add(tr("委託目標已達成，請返回公會回報。"));
      $gameSwitches.setValue(PREPARE_TO_REPORT_FLAG, true);
    }
  );

  // 【現行】v2 在成功後加 hook
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ReportCurrentTask",
    function () {

      const taskId = $gameVariables.value(ACTIVE_TASK_VAR);
      if (taskId === 0) {
        return;
      }

      const task = KumoQuest.getTask(taskId);
      if (!task) {
        return;
      }

      if (
        $gameVariables.value(task.stateVar) !==
        QUEST_STATE.READY_TO_REPORT
      ) {
        return;
      }

      $gameVariables.setValue(task.stateVar, QUEST_STATE.COMPLETED);
      $gameVariables.setValue(ACTIVE_TASK_VAR, 0);

      $gameMessage.add(tr("已完成委託，你獲得了"));
      task.rewardText.forEach(line => $gameMessage.add(tr(line)));

      $gameTemp.reserveCommonEvent(task.rewardEventId);

      $gameSwitches.setValue(PREPARE_TO_REPORT_FLAG, false);
      window.KumoQuest.clearSelectedTask();

      window.KumoQuest.tryUnlockChapterStory();
    }
  );

  // 【棄用】command；函式 clearSelectedTask 仍由場景使用
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ClearSelectedTask",
    function () {
      window.KumoQuest.clearSelectedTask();
    }
  );

  // 【V1凍結】
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "CheckRankCompleted",
    function (args) {

      let rank = Number(args.rank || 0);

      if (rank <= 0) {
        const rankId = Number(args.rankId || 0);
        if (rankId > 0) {
          rank = $gameVariables.value(rankId);
        }
      }

      const resultSwitchId = Number(args.resultSwitchId);

      const tasks = Object.values(v1Tasks()).filter(
        task => task.rank === rank
      );

      const isCompleted =
        tasks.length > 0 &&
        tasks.every(task =>
          $gameVariables.value(task.stateVar) >= QUEST_STATE.COMPLETED
        );

      $gameSwitches.setValue(resultSwitchId, isCompleted);
    }
  );

  // 【V2】
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "CheckChapterRequirements",
    function (args) {

      let chapter = Number(args.chapter || 0);

      if (chapter <= 0) {
        const chapterVarId = Number(args.chapterVarId || 0);
        if (chapterVarId > 0) {
          chapter = $gameVariables.value(chapterVarId);
        } else {
          chapter = Number(getV2ChapterKey());
        }
      }

      const resultSwitchId = Number(args.resultSwitchId);
      const met = KumoQuest.isChapterRequirementsMet(String(chapter));

      if (resultSwitchId) {
        $gameSwitches.setValue(resultSwitchId, met);
      }
    }
  );

  // 【現行】任務板場景
  class Scene_QuestBoard extends Scene_MenuBase {

    create() {
      super.create();
      this.createBoardWindow();
    }

    createBackground() {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadSystem("Board");
      this.addChildAt(this._backgroundSprite, 0);
    }

    createBoardWindow() {
      this._boardWindow = new Window_QuestBoard(this.windowRect());
      this.addWindow(this._boardWindow);
    }

    windowRect() {
      return new Rectangle(
        BOARD_MARGIN_X,
        BOARD_MARGIN_TOP,
        Graphics.boxWidth - BOARD_MARGIN_X * 2,
        Graphics.boxHeight - BOARD_MARGIN_TOP - BOARD_MARGIN_BOTTOM
      );
    }

    createButtons() {
      // 不使用選單場景預設的取消按鈕列，避免擋住羊皮紙
    }

    update() {
      super.update();
      if (!this._boardWindow || !this._boardWindow.active) {
        return;
      }
      if (TouchInput.isCancelled()) {
        this._boardWindow.processCancel();
      }
    }
  }

  window.Scene_QuestBoard = Scene_QuestBoard;

  class Window_QuestBoard extends Window_Selectable {

    initialize(rect) {
      super.initialize(rect);
      this._mode = "list";
      this._listIndex = 0;
      this.opacity = 0;
      this.backOpacity = 0;
      this.refresh();
      this.activate();
      this.select(0);
    }

    _refreshFrame() { }

    _refreshBack() { }

    maxItems() {
      if (this._mode === "detail") {
        return 2;
      }
      return (KumoQuest.availableTasks || []).length;
    }

    itemHeight() {
      return BOARD_ITEM_HEIGHT;
    }

    isOkEnabled() {
      return true;
    }

    isCancelEnabled() {
      return true;
    }

    drawItemBackground(/* index */) {
      // 羊皮紙上不畫選項黑底
    }

    itemRect(index) {
      const rect = super.itemRect(index);
      if (this._mode === "detail") {
        rect.y = this.innerHeight - this.itemHeight() * 2 + index * this.itemHeight();
      }
      return rect;
    }

    wrapLine(text, maxWidth) {
      const source = String(text || "");
      const lines = [];
      let current = "";
      for (const ch of source) {
        if (this.textWidth(current + ch) > maxWidth) {
          if (current) {
            lines.push(current);
          }
          current = ch;
        } else {
          current += ch;
        }
      }
      if (current) {
        lines.push(current);
      }
      return lines.length > 0 ? lines : [""];
    }

    formatBoardText(text) {
      return this.convertEscapeCharacters(String(text == null ? "" : text));
    }

    drawWrappedLines(text, x, y, maxWidth) {
      const lines = this.wrapLine(this.formatBoardText(text), maxWidth);
      for (const line of lines) {
        this.drawText(line, x, y, maxWidth);
        y += BOARD_LINE_HEIGHT;
      }
      return y;
    }

    drawDetail() {
      const task = KumoQuest.selectedTask;
      if (!task) {
        return;
      }

      const width = this.innerWidth;
      let y = 0;

      this.contents.fontSize = BOARD_TITLE_SIZE;
      this.contents.textColor = BOARD_TITLE_COLOR;
      y = this.drawWrappedLines(tr(task.title), 0, y, width);
      this.resetFontSettings();
      y += 8;

      this.contents.fontSize = BOARD_BODY_SIZE;
      this.contents.textColor = BOARD_BODY_COLOR;

      const description = task.description || [];
      description.forEach(line => {
        y = this.drawWrappedLines(tr(line), 0, y, width);
      });

      y += BOARD_LINE_HEIGHT;
      y = this.drawWrappedLines(tr("完成後將會獲得:"), 0, y, width);

      const rewards = task.rewardText || [];
      rewards.forEach(line => {
        y = this.drawWrappedLines(tr(line), 12, y, width - 12);
      });

      this.resetFontSettings();
    }

    drawItem(index) {
      const rect = this.itemLineRect(index);
      this.resetFontSettings();
      this.contents.fontSize = BOARD_BODY_SIZE;
      this.contents.textColor = BOARD_BODY_COLOR;

      if (this._mode === "list") {
        const task = KumoQuest.availableTasks[index];
        if (!task) {
          return;
        }
        this.drawText(
          this.formatBoardText(tr(task.title)),
          rect.x,
          rect.y,
          rect.width
        );
      } else {
        const labels = [tr("接受委託"), tr("返回列表")];
        this.drawText(labels[index], rect.x, rect.y, rect.width, "center");
      }

      this.resetFontSettings();
    }

    refresh() {
      if (this.contents) {
        this.contents.clear();
      }
      if (this.contentsBack) {
        this.contentsBack.clear();
      }
      if (this._mode === "detail") {
        this.drawDetail();
      }
      this.drawAllItems();
    }

    showList() {
      this._mode = "list";
      KumoQuest.clearSelectedTask();
      this.refresh();
      this.activate();
      this.select(this._listIndex);
    }

    showDetail(index) {
      const task = KumoQuest.availableTasks[index];
      if (!task) {
        return;
      }
      this._listIndex = index;
      KumoQuest.selectTask(task);
      this._mode = "detail";
      this.refresh();
      this.activate();
      this.select(0);
    }

    processOk() {
      if (this._mode === "list") {
        if (this.index() < 0) {
          return;
        }
        this.playOkSound();
        this.showDetail(this.index());
        return;
      }

      if (this.index() === 0) {
        if (KumoQuest.acceptSelectedTask()) {
          this.playOkSound();
          this.deactivate();
          SceneManager.pop();
        } else {
          this.playBuzzerSound();
        }
        return;
      }

      SoundManager.playCancel();
      this.showList();
    }

    processCancel() {
      SoundManager.playCancel();
      if (this._mode === "detail") {
        this.showList();
        return;
      }
      KumoQuest.clearSelectedTask();
      this.deactivate();
      SceneManager.pop();
    }
  }

})();
