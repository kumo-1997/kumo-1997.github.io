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
 */

(() => {

  const QUEST_STATE = {
    NOT_ACCEPTED: 0,
    ACTIVE: 1,
    READY_TO_REPORT: 2,
    COMPLETED: 3
  };

  const ACTIVE_TASK_VAR = 51;
  const SELECTED_TASK_VAR = 50;
  const PLAYER_CURRENT_RANK = 3;
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

      KumoQuest.availableTasks =
        KumoQuest
          .getTasksByRank(rank)
          .filter(task =>
            $gameVariables.value(
              task.stateVar
            ) === QUEST_STATE.NOT_ACCEPTED
          );

      if (
        KumoQuest.availableTasks.length === 0
      ) {

        $gameMessage.add(
          "目前沒有可接受的委託。"
        );

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

            KumoQuest.selectedTask =
              null;

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

        $gameMessage.add(
          "尚未選擇任務。"
        );

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

      $gameMessage.add(
        `【${task.title}】`
      );

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
    }
  );

})();