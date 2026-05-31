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

        title: "「村長A的委託」討伐初始之地的哥布林",

        description: [
          "目前森林內大量哥布林離開他們原本居住的山洞",
          "這將威脅到村莊的安全",
          "請前往討伐該魔物，讓他們回去洞穴裡",
        ],

        rewardText: [
          "500 \\G",
          "攻擊力增加劑 1 個",
          "經驗值 300"
        ],
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
          "經驗值 250"
        ],
      },

      84: {
        id: 84,
        rank: 1,
        stateVar: 84,
        rewardEventId: 64,

        title: "「冒險者導師的委託」討伐初始之地Boss",

        description: [
          "你以為拿到試煉之證很厲害嗎? ",
          "初始之地的Boss表示不同意",
          "他希望再被虐一次，請前往討伐",
        ],

        rewardText: [
          "650 \\G",
          "敏捷增加劑 1 個",
          "經驗值 350"
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
          "經驗值 400"
        ],
      },

      102: {
        id: 102,
        rank: 2,
        stateVar: 102,
        rewardEventId: 82,

        title: "「勇者瑞德的委託」討伐森林狼人 (未完成)",

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
