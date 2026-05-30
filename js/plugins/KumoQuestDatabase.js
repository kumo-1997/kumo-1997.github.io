/*:
 * @target MZ
 * @plugindesc Kumo Quest Database
 * @author Kumo
 */

(() => {

  window.KumoQuestDatabase = {
    // key = task id = task state variable id
    tasks: {

      82: {
        id: 82,
        rank: 1,
        stateVar: 82,
        rewardEventId: 62,

        title: "討伐初始之地的哥布林",

        description: [
          "目前森林內突然出現大量哥布林聚集",
          "這將威脅到村莊的安全",
          "請前往討伐該魔物"
        ],

        rewardText: [
          "500 \\G",
          "攻擊力增加劑 1 個"
        ],
      },

      83: {
        id: 83,
        rank: 1,
        stateVar: 83,
        rewardEventId: 63,

        title: "取回遺失的草藥",

        description: [
          "道具店老闆委託冒險者協助取回遺失的草藥",
          "請前往初始森林尋找草藥"
        ],

        rewardText: [
          "350 \\G",
          "藥水 3 個"
        ],
      },

      84: {
        id: 84,
        rank: 1,
        stateVar: 84,
        rewardEventId: 64,

        title: "討伐初始之地Boss",

        description: [
          "初始之地的Boss重生了",
          "請前往討伐"
        ],

        rewardText: [
          "500 \\G",
          "敏捷增加劑 1 個"
        ],
      },

      102: {
        id: 102,
        rank: 2,
        stateVar: 102,
        rewardEventId: 82,

        title: "討伐森林狼人",

        description: [
          "森林深處出現狼人",
          "請前往討伐"
        ],

        rewardText: [
          "650 \\G",
          "攻擊力增加劑 2 個"
        ],
      }
    }
  };

})();
