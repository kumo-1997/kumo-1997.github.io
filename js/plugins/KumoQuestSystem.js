/*:
 * @target MZ
 * @plugindesc Kumo Quest System
 * @author Kumo
 *
 * @command ShowRankBoard
 * @text 顯示任務階級表
 * 
 * @command ShowTaskBoard
 * @text 顯示任務列表
 *
 * @command ShowSelectedTask
 * @text 顯示任務說明
 *
 * @command AcceptTask
 * @text 接受任務
 *
 * @command ShowCurrentTask
 * @text 顯示目前任務
 *
 * @command CancelCurrentTask
 * @text 取消目前任務
 * 
 * @command CompleteCurrentTask
 * @text 完成目前任務
 * 
 * @command ReportCurrentTask
 * @text 回報任務
 * 
 * @command CheckRankCompleted
 * @text 檢查 Rank 是否全部完成
 * @arg rank
 * @text rank (第一順位)
 * @arg rankId
 * @text rankId (第二順位)
 * @arg resultSwitchId
 */

(() => {

  const QUEST_STATE = {
    NOT_ACCEPTED: 0,
    ACTIVE: 1,
    READY_TO_REPORT: 2,
    COMPLETED: 3
  };
  const QUEST_STATE_MAP = {
    [QUEST_STATE.NOT_ACCEPTED]: "未接取",
    [QUEST_STATE.ACTIVE]: "進行中",
    [QUEST_STATE.READY_TO_REPORT]: "等待回報",
    [QUEST_STATE.COMPLETED]: "已完成"
  };


  const ACTIVE_TASK_VAR = 51;
  const SELECTED_TASK_VAR = 50;
  const PLAYER_CURRENT_RANK = 3;
  const PREPARE_TO_REPORT_FLAG = 4; // 準備回報任務
  const NO_AVAILABLE_TASK_FLAG = 21; // 當前沒有任務可選
  const SELECTED_RANK_VAR = 52;

  window.KumoQuest = {

    availableTasks: [],
    selectedTask: null,

    getTask(id) {
      return KumoQuestDatabase.tasks[id];
    },

    getTasksByRank(rank) {

      return Object.values(
        KumoQuestDatabase.tasks
      ).filter(task =>
        task.rank === rank
      );
    },

    canAcceptTask(task) {

      if (
        $gameVariables.value(task.stateVar) !==
        QUEST_STATE.NOT_ACCEPTED
      ) {
        return false;
      }

      if (!task.previousTaskId) {
        return true;
      }

      const previousTask =
        this.getTask(task.previousTaskId);

      if (!previousTask) {
        return false;
      }

      return (
        $gameVariables.value(
          previousTask.stateVar
        ) === QUEST_STATE.COMPLETED
      );
    },

    clearSelectedTask() {
      window.KumoQuest.selectedTask = null;
    }
  };

  // ==========================
  // 任務階級板
  // ==========================
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ShowRankBoard",
    function () {

      const currentRank =
        $gameVariables.value(
          PLAYER_CURRENT_RANK
        );

      const choices = [];

      for (let rank = 1; rank <= currentRank; rank++) {
        choices.push(`${rank}級委託`);
      }

      $gameMessage.setChoices(
        choices,
        0,
        -1
      );

      $gameMessage.setChoiceCallback(
        index => {

          if (index < 0) {
            return;
          }

          $gameVariables.setValue(
            SELECTED_RANK_VAR,
            index + 1
          );
        }
      );

      this.setWaitMode("message");
    }
  );

  // ==========================
  // 任務列表
  // ==========================
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ShowTaskBoard",
    function () {

      const rank =
        $gameVariables.value(
          SELECTED_RANK_VAR
        );

      KumoQuest.availableTasks = KumoQuest
        .getTasksByRank(rank)
        .filter(task =>
          KumoQuest.canAcceptTask(task)
        );

      if (
        KumoQuest.availableTasks.length === 0
      ) {

        $gameMessage.add(
          "目前沒有可接受的委託。"
        );

        $gameSwitches.setValue(NO_AVAILABLE_TASK_FLAG, true);

        return;
      }

      const choices =
        KumoQuest.availableTasks.map(
          task => task.title
        );

      $gameMessage.setChoices(
        choices,
        0,
        -1
      );

      $gameMessage.setChoiceCallback(
        index => {

          if (index < 0) {

            window.KumoQuest.clearSelectedTask();

            return;
          }

          const task =
            KumoQuest.availableTasks[
            index
            ];

          KumoQuest.selectedTask =
            task;

          $gameVariables.setValue(
            SELECTED_TASK_VAR,
            task.id
          );
        }
      );

      this.setWaitMode(
        "message"
      );
    }
  );

  // ==========================
  // 任務說明
  // ==========================

  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ShowSelectedTask",
    function () {

      const task =
        KumoQuest.selectedTask;

      if (!task) {

        if (window.KumoQuest.availableTasks.length > 0) {
          $gameMessage.add(
            "尚未選擇任務。"
          );
        }

        return;
      }

      $gameMessage.add(
        `【${task.title}】`
      );

      task.description.forEach(
        line => {
          $gameMessage.add(line);
        }
      );

      $gameMessage.add("完成後將會獲得:");

      task.rewardText.forEach((line) => $gameMessage.add(line));
    }
  );

  // ==========================
  // 接受任務
  // ==========================

  PluginManager.registerCommand(
    "KumoQuestSystem",
    "AcceptTask",
    function () {

      const task =
        KumoQuest.selectedTask;

      if (!task) {

        $gameMessage.add(
          "尚未選擇任務。"
        );

        return;
      }

      if (
        $gameVariables.value(
          ACTIVE_TASK_VAR
        ) !== QUEST_STATE.NOT_ACCEPTED
      ) {

        $gameMessage.add(
          "目前已有進行中的任務。"
        );

        return;
      }

      $gameVariables.setValue(
        task.stateVar,
        QUEST_STATE.ACTIVE
      );

      $gameVariables.setValue(
        ACTIVE_TASK_VAR,
        task.id
      );

      $gameMessage.add(
        "已接受委託。"
      );
    }
  );

  // ==========================
  // 目前任務
  // ==========================

  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ShowCurrentTask",
    function () {

      const taskId =
        $gameVariables.value(
          ACTIVE_TASK_VAR
        );

      if (taskId === 0) {

        $gameMessage.add(
          "目前沒有進行中的任務。"
        );

        return;
      }

      const task =
        KumoQuest.getTask(taskId);

      if (!task) {

        $gameMessage.add(
          "任務資料不存在。"
        );

        return;
      }

      const taskState = $gameVariables.value(task.stateVar);

      $gameMessage.add(
        `【${task.title}】`
      );

      $gameMessage.add(`狀態為: ${QUEST_STATE_MAP[taskState]}`);
      $gameMessage.add("");
      $gameMessage.add("");

      task.description.forEach(
        line => {
          $gameMessage.add(line);
        }
      );
    }
  );

  // ==========================
  // 取消任務
  // ==========================

  PluginManager.registerCommand(
    "KumoQuestSystem",
    "CancelCurrentTask",
    function () {

      const taskId =
        $gameVariables.value(
          ACTIVE_TASK_VAR
        );

      if (taskId === 0) {

        $gameMessage.add(
          "目前沒有任務可取消。"
        );

        return;
      }

      const task =
        KumoQuest.getTask(taskId);

      if (!task) {
        return;
      }

      $gameVariables.setValue(
        task.stateVar,
        QUEST_STATE.NOT_ACCEPTED
      );

      $gameVariables.setValue(
        ACTIVE_TASK_VAR,
        0
      );

      $gameMessage.add(
        "已取消任務。"
      );

      window.KumoQuest.clearSelectedTask();
    }
  );

  // ==========================
  // 完成當前任務
  // ==========================
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "CompleteCurrentTask",
    function () {

      const taskId =
        $gameVariables.value(
          ACTIVE_TASK_VAR
        );

      if (taskId === 0) {
        return;
      }

      const task =
        KumoQuest.getTask(taskId);

      if (!task) {
        return;
      }

      if (
        $gameVariables.value(
          task.stateVar
        ) !== QUEST_STATE.ACTIVE
      ) {
        return;
      }

      $gameVariables.setValue(
        task.stateVar,
        QUEST_STATE.READY_TO_REPORT
      );

      $gameMessage.add(
        "委託目標已達成，請返回公會回報。"
      );


      $gameSwitches.setValue(PREPARE_TO_REPORT_FLAG, true);
    }
  );

  // ==========================
  // 回報任務
  // ==========================
  PluginManager.registerCommand(
    "KumoQuestSystem",
    "ReportCurrentTask",
    function () {

      const taskId =
        $gameVariables.value(
          ACTIVE_TASK_VAR
        );

      if (taskId === 0) {
        return;
      }

      const task =
        KumoQuest.getTask(taskId);

      if (!task) {
        return;
      }

      if (
        $gameVariables.value(
          task.stateVar
        ) !== QUEST_STATE.READY_TO_REPORT
      ) {
        return;
      }

      $gameVariables.setValue(
        task.stateVar,
        QUEST_STATE.COMPLETED
      );

      $gameVariables.setValue(
        ACTIVE_TASK_VAR,
        0
      );

      $gameMessage.add(
        "已完成委託，你獲得了"
      );

      task.rewardText.forEach((line) => $gameMessage.add(line));

      $gameTemp.reserveCommonEvent(
        task.rewardEventId
      );

      $gameSwitches.setValue(PREPARE_TO_REPORT_FLAG, false);
      window.KumoQuest.clearSelectedTask();
    }
  );

  // ==========================
  // 檢查 Rank 是否全部完成
  // ==========================
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

      const resultSwitchId =
        Number(args.resultSwitchId);

      const tasks =
        Object.values(KumoQuestDatabase.tasks)
          .filter(task => task.rank === rank);

      const isCompleted =
        tasks.length > 0 &&
        tasks.every(task =>
          $gameVariables.value(task.stateVar)
          >= QUEST_STATE.COMPLETED
        );

      $gameSwitches.setValue(
        resultSwitchId,
        isCompleted
      );
    }
  );
})();