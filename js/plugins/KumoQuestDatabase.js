/*:
 * @target MZ
 * @plugindesc Kumo Quest Database
 * @author Kumo
 */

/**
 * @typedef {Object} Quest
 * @property {number} id 任務 ID
 * @property {number} rank 任務需求冒險者等級
 * @property {number} stateVar 用於儲存任務狀態的變數 ID
 * @property {number} rewardEventId 領取獎勵時執行的共用事件 ID
 * @property {string} title 任務標題
 * @property {string[]} description 任務描述內容
 * @property {string[]} rewardText 任務獎勵說明文字
 * @property {number | undefined} previousTaskId 前置任務 ID
 */

(() => {


  window.KumoQuestDatabase = {
    // key = task id = task state variable id
    /** @type {Record<number, Quest>} */
    tasks: {

      82: {
        id: 82,
        rank: 1,
        stateVar: 82,
        rewardEventId: 62,

        title: "「南方小鎮奧客的委託」討伐初始之地的哥布林",

        description: [
          "哥布林威脅村莊",
          "需盡快解決",
          "請冒險者前往南方小鎮取得詳細資訊",
        ],

        rewardText: [""],
      },

      83: {
        id: 83,
        rank: 1,
        stateVar: 83,
        rewardEventId: 63,

        title: "「普通城鎮道具店委託」取回遺失的草藥",

        description: [
          "道具店老闆委託冒險者協助取回遺失的草藥",
          "請前往初始森林尋找草藥",
          "",

          "注意!!! 任務若未完成，「選擇」購買藥水多收取 100 \\G 的手續費",
          "這是老闆要求寫在委託書裡面的重要提醒!!!",
        ],

        rewardText: [
          "400 \\G",
          "藥水 3 個",
          "經驗值 500"
        ],
      },

      84: {
        id: 84,
        rank: 1,
        stateVar: 84,
        rewardEventId: 64,
        previousTaskId: 86,

        title: "「馬修的委託」初始之地Boss調查",

        description: [
          "需要一名幫手前來討伐初始之地的Boss",
          "他說希望再被虐一次",
          "附註: 此戰鬥會有其他新人陪同，請好好表現",
        ],

        rewardText: [
          "650 \\G",
          "敏捷增加劑 1 個",
          "經驗值 750"
        ],
      },

      85: {
        id: 85,
        rank: 1,
        stateVar: 85,
        rewardEventId: 65,

        title: "「普通城鎮武器店委託」急需魔物樹人的精華",

        description: [
          "普通城鎮的武器店老闆最近很苦惱",
          "有個武器的研發需要魔物樹人的材料才可以製作",
          "請接洽任務的冒險者先去普通城鎮的武器店找老闆對話",
        ],

        rewardText: [
          "450 \\G",
          "魔冰罐 2 個",
          "經驗值 800"
        ],
      },

      86: {
        id: 86,
        rank: 1,
        stateVar: 86,
        rewardEventId: 66,

        title: "「南方村落妹妹的請託」協助尋找圍巾材料",

        description: [
          "平常在河邊的小妹妹希望為村落中的狐寶織圍巾",
          "但因為近期魔物的活躍導致材料收集困難",
          "",
          "請接洽任務的冒險者前往南方村落",
          "讓當地狐寶能有條好圍巾"
        ],

        rewardText: [
          "300 \\G",
          "經驗值 700"
        ],
      },

      87: {
        id: 87,
        rank: 1,
        stateVar: 87,
        rewardEventId: 67,
        previousTaskId: 84, // 86 -> 84 -> 87

        title: "「南方村落姊妹的請託」村莊裡的狐狸走失了!",

        description: [
          "平常盯著河邊看的小妹妹突然發現",
          "原本村落常常躺在她身旁的狐狸沒有再出現了",
          "",
          "她焦急的飯不下嚥，每天以淚洗面",
          "希望有好心人士可以協助尋找"
        ],

        rewardText: [
          "500 \\G",
          "經驗值 1100"
        ],
      },

      102: {
        id: 102,
        rank: 2,
        stateVar: 102,
        rewardEventId: 82,

        title: "[普通城鎮武器店老闆的委託] 急需短期鍛造學徒",

        description: [
          "由於最近的武器需求量增加，學徒已經不夠用了",
          "所以發布委託請冒險者自己鍛造自己要用的武器",
          "說是這樣說，材料費還是得收的"
        ],

        rewardText: [
          "1250 \\G",
          "攻擊力增加劑 4 個",
          "EXP: 2000",
        ],
      },
      103: {
        id: 103,
        rank: 2,
        stateVar: 103,
        rewardEventId: 83,
        previousTaskId: 102,

        title: "[普通城鎮道具店老闆的委託] 收集雪山素材",

        description: [
          "委託人表示聽說出現了雪山，說不定裡面有稀有素材",
          "高價懸賞冒險者前往雪山去尋找",
          "該物品的特徵應該是閃閃發光的東西",
          "老闆特別表示，只知道是「閃閃發光」",
          "所以請收集所有會發光的素材",
        ],

        rewardText: [
          "950 \\G",
          "敏捷增加劑 4 個",
          "EXP: 3000",
        ],
      },
      104: {
        id: 104,
        rank: 2,
        stateVar: 104,
        rewardEventId: 84,

        title: "[南方村落村長的請託]尋找失蹤的奧客",

        description: [
          "在某次晚點名的時候發現奧客不見了",
          "雖然他平時對人都愛理不理的",
          "但作為村長的職責還是得尋找他的下落",
          "萬一對方有危險的話請前往救助"
        ],

        rewardText: [
          "1000 \\G",
          "防禦增加劑 4 個",
          "EXP: 3000",
        ],
      },
      105: {
        id: 105,
        rank: 2,
        stateVar: 105,
        rewardEventId: 85,
        previousTaskId: 102,

        title: "[緊急任務: 艾蓮的防禦委託] 雪山外圍魔物防禦戰",

        description: [
          "繼上次雪山調查之後，魔物出現的頻率增加",
          "為了阻擋魔物的攻勢，會在雪山外圍建立營地",
          "營地完成之前需要2級冒險者前來協助防守"
        ],

        rewardText: [
          "1500 \\G",
          "運氣增加劑 4 個",
          "EXP: 3500",
        ],
      },
    }
  };

  // 臨時放在這 demo 到達特定章節後提前結束遊戲
  const CHAPTER_STAGE_ID = 62;
  const DEMO_CHAPTER_STAGE = 4;
  const DEMO_EVENT_ID = 29;
  const IFNORE_DEMO_CHECK_FLAG = 20;

  const _Scene_Map_update =
    Scene_Map.prototype.update;

  Scene_Map.prototype.update =
    function () {

      _Scene_Map_update.call(this);

      const isIgnoreDemoCheck = $gameSwitches.value(IFNORE_DEMO_CHECK_FLAG);

      if (isIgnoreDemoCheck) {
        return;
      }

      const task_102 = $gameVariables.value(102);
      const task_103 = $gameVariables.value(103);
      const task_104 = $gameVariables.value(104);

      if (
        $gameVariables.value(CHAPTER_STAGE_ID) >= DEMO_CHAPTER_STAGE
        && task_102 >= 3
        && task_103 >= 3
        && task_104 >= 3
      ) {

        $gameTemp.reserveCommonEvent(
          DEMO_EVENT_ID
        );
      }
    };
})();
