/*:
 * @target MZ
 * @plugindesc Kumo Teleport Stone System
 * @author Kumo
 *
 * @command OpenTeleportStone
 * @text 開啟傳送石
 * 
 * @command SavingTeleportPoint
 * @text 儲存傳送點選單
 * 
 * @command ConfirmTeleport
 * @text 確認傳送選單
 * 
 * @command ShowCallbackMessage
 * @text 顯示 Callback 的訊息
 *
 * @command MoveTeleportPointToOtherMap
 * @text 移動地圖傳送點到新地圖，程式內部使用
 * 
 * @param SlotCount
 * @text 傳送點數量
 * @type number
 * @default 5
 *
 * @param BlockedMaps
 * @text 禁止記錄地圖
 * @type number[]
 * @default []
 */

(() => {
  const SAVING_TELEPORT_POINT_FLAG = 102; // 是否打開儲存傳送點 FLAG
  const IS_READY_TELEPORT_FLAG = 103; // 是否傳送 FLAG

  const PLUGIN_NAME = "KumoTeleportSystem";

  window.KumoTeleportData = {
    selectedTeleportSlot: null,
    callbackMessage: null,
  };

  const params =
    PluginManager.parameters(
      PLUGIN_NAME
    );

  const SLOT_COUNT =
    Number(
      params.SlotCount || 5
    );

  const BLOCKED_MAPS =
    JSON.parse(
      params.BlockedMaps || "[]"
    ).map(Number);

  // =========================
  // Game_System
  // =========================

  const aliasInitialize =
    Game_System.prototype.initialize;

  Game_System.prototype.initialize =
    function () {

      aliasInitialize.call(this);

      this._teleportSlots =
        Array(SLOT_COUNT)
          .fill(null);
    };

  Game_System.prototype.teleportSlots =
    function () {

      if (!this._teleportSlots) {

        this._teleportSlots =
          Array(SLOT_COUNT)
            .fill(null);
      }

      return this._teleportSlots;
    };

  Game_System.prototype.setTeleportSlots =
    function (slots) {
      if (!Array.isArray(slots)) return;
      if (slots.length !== this._teleportSlots.length) return;

      this._teleportSlots = slots;
    };

  // =========================
  // Utilities
  // =========================

  function slotText(slot) {

    if (!slot) {
      return "[空]";
    }

    return `${slot.mapName} (${slot.x},${slot.y})`;
  }

  function currentLocationData() {

    return {

      mapId:
        $gameMap.mapId(),

      mapName:
        $gameMap.displayName() ||
        `Map ${$gameMap.mapId()}`,

      x:
        $gamePlayer.x,

      y:
        $gamePlayer.y
    };
  }

  // =========================
  // Main Menu
  // =========================

  function openMainMenu() {

    const slots =
      $gameSystem.teleportSlots();

    const choices =
      slots.map(
        slot => slotText(slot)
      );

    choices.push("記錄目前位置");
    choices.push("取消");

    const cancelIndex = choices.length - 1;

    $gameMessage.setChoices(
      choices,
      0,
      cancelIndex
    );

    $gameMessage.setChoiceCallback(
      index => {

        // 取消
        if (
          index < 0 ||
          index === choices.length - 1
        ) {
          return;
        }

        // 紀錄目前位置
        if (
          index ===
          choices.length - 2
        ) {

          // openSaveMenu();
          $gameSwitches.setValue(SAVING_TELEPORT_POINT_FLAG, true);

          return;
        }

        const slot =
          slots[index];

        if (!slot) {

          window.KumoTeleportData.callbackMessage = "此欄位尚未記錄";

          return;
        }

        $gameSwitches.setValue(IS_READY_TELEPORT_FLAG, true);
        window.KumoTeleportData.selectedTeleportSlot = slot;
      }
    );
  }

  // =========================
  // Save Location
  // =========================

  function openSaveMenu() {

    if (
      BLOCKED_MAPS.includes(
        $gameMap.mapId()
      )
    ) {

      $gameMessage.add(
        "這裡無法建立傳送標記"
      );

      return;
    }

    const slots =
      $gameSystem.teleportSlots();

    const choices =
      slots.map(
        slot => slotText(slot)
      );

    choices.push("取消");

    $gameMessage.setChoices(
      choices,
      0,
      -1
    );

    $gameMessage.setChoiceCallback(
      index => {

        if (
          index < 0 ||
          index >= SLOT_COUNT
        ) {
          return;
        }

        slots[index] = currentLocationData();

        window.KumoTeleportData.callbackMessage = `已儲存至傳送點 ${index + 1}`;
      }
    );
  }

  // =========================
  // Teleport
  // =========================

  function confirmTeleport(slot) {

    $gameMessage.setChoices(
      ["是", "否"],
      0,
      1
    );

    $gameMessage.add(
      `確定傳送至:`
    );

    $gameMessage.add(
      `${slot.mapName} (${slot.x}, ${slot.y})`
    );

    $gameMessage.setChoiceCallback(
      index => {

        if (index !== 0) {
          return;
        }

        $gamePlayer.reserveTransfer(
          slot.mapId,
          slot.x,
          slot.y,
          2,
          0
        );
      }
    );
  }

  // =========================
  // Plugin Command
  // =========================

  PluginManager.registerCommand(
    PLUGIN_NAME,
    "OpenTeleportStone",
    function () {
      openMainMenu();
      this.setWaitMode("message");
    }
  );

  PluginManager.registerCommand(
    PLUGIN_NAME,
    "SavingTeleportPoint",
    function () {
      openSaveMenu();
      this.setWaitMode("message");
    }
  );

  PluginManager.registerCommand(
    PLUGIN_NAME,
    "ConfirmTeleport",
    function () {
      if (!window.KumoTeleportData.selectedTeleportSlot) {
        console.log(
          "missing selectedTeleportSlot:",
          window.KumoTeleportData.selectedTeleportSlot
        );
        return;
      }

      confirmTeleport(window.KumoTeleportData.selectedTeleportSlot);
      this.setWaitMode("message");
    }
  );

  PluginManager.registerCommand(
    PLUGIN_NAME,
    "ShowCallbackMessage",
    function () {
      if (window.KumoTeleportData.callbackMessage) {
        $gameMessage.add(window.KumoTeleportData.callbackMessage);
        window.KumoTeleportData.callbackMessage = null;
      }
    }
  );

  PluginManager.registerCommand(
    PLUGIN_NAME,
    "MoveTeleportPointToOtherMap",
    function () {
      const slots = $gameSystem.teleportSlots();
      const newSlots = [];

      const replacedIdMap = {
        23: 31,
        24: 34,
      };

      const safeTeleportPointMap = {
        31: { x: 12, y: 25 },
        34: { x: 12, y: 31 },
      };

      slots.forEach(slot => {
        const oldMapId = slot?.mapId;

        if (!oldMapId) {
          newSlots.push(slot);
          return;
        }

        const newMapId = replacedIdMap[oldMapId];

        if (!newMapId) {
          newSlots.push(slot);
          return;
        }

        const newSlot = {
          ...slot,
          mapId: newMapId,
          ...(safeTeleportPointMap[newMapId] ?? {}),
        };

        newSlots.push(newSlot);
      });

      $gameSystem.setTeleportSlots(newSlots);
    }
  );

})();
