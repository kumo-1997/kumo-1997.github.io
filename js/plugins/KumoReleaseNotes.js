/*:
 * @target MZ
 * @plugindesc Generate Release Notes
 * @author Kumo
 */

// 部署網頁版才會手動貼上物件
const json = {
  "releases": [
    {
      "version": "V0.7.0-alpha Release Notes",
      "sections": [
        {
          "title": "新增多國語系功能",
          "description": "目前支援英文翻譯功能，可在選項中調整語言\nalpha 測試期間預設語言為「英文」，修正英文文本且穩定後會改回預設中文",
          "groups": []
        }
      ]
    },
    {
      "version": "V0.6.2 Release Notes",
      "sections": [
        {
          "title": "技能調整",
          "description": "",
          "groups": [
            {
              "title": "調整魔力恢復數值",
              "description": "",
              "footer": "",
              "items": [
                "魔力恢復(小)：花費 25怒氣 恢復 20%MP (原先是 25怒氣 恢復 30MP)",
                "魔力恢復(大)：花費 35怒氣 恢復 35%MP (原先是 50怒氣 恢復 65MP)"
              ]
            }
          ]
        },
        {
          "title": "BUG 修正",
          "description": "",
          "groups": [
            {
              "title": "修正任務87-走失狐狸任務完成後，可能會重複觸發足跡的對話",
              "description": "假如玩家在沒觸發雪山入口足跡提示的情況下完成任務\n就會在完成後仍然觸發足跡提示，但狐狸已經回村",
              "footer": "",
              "items": [
                "完成任務後，會略過沒觸發的足跡提示"
              ]
            },
            {
              "title": "修正狐狸走失事件提示不足",
              "description": "",
              "footer": "",
              "items": [
                "補上前往南方村鎮的提示",
                "改善事件流程中的任務引導"
              ]
            },
            {
              "title": "修正艾蓮雪山防守任務戰鬥設定",
              "description": "",
              "footer": "",
              "items": [
                "修正雪山防守任務的戰鬥可以逃跑的問題",
                "現在該戰鬥將無法逃跑"
              ]
            }
          ]
        },
        {
          "title": "文字調整",
          "description": "",
          "groups": [
            {
              "title": "統一中文數字格式",
              "description": "為了讓遊戲文本中的數字格式更加一致，將部分中文數字改為阿拉伯數字。",
              "footer": "",
              "items": [
                "三級冒險者 → 3級冒險者",
                "第三章節 → 第3章節",
                "調整其他部分使用中文數字的文本"
              ]
            }
          ]
        },
        {
          "title": "其他",
          "description": "",
          "groups": [
            {
              "title": "",
              "description": "",
              "footer": "",
              "items": [
                "修正部分文本錯誤",
                "修改人物模型"
              ]
            }
          ]
        }
      ]
    },
    {
      "version": "V0.6.1 Release Notes",
      "sections": [
        {
          "title": "新手體驗改善",
          "description": "為了讓首次遊玩的玩家更容易理解遊戲玩法，本次重新設計了新手教學流程",
          "groups": [
            {
              "title": "新增完整教學",
              "description": "",
              "footer": "",
              "items": [
                "新增傳送石教學",
                "新增任務筆記本教學",
                "新增道具與裝備教學",
                "新增探索 PT 教學",
                "新增快捷鍵操作介紹"
              ]
            },
            {
              "title": "教學流程優化",
              "description": "",
              "footer": "",
              "items": [
                "教學期間禁止離開地圖與使用傳送功能，避免流程中斷",
                "新增教學緊急結束機制，避免特殊情況造成卡關",
                "每個教學皆採用獨立完成紀錄，方便未來維護與擴充"
              ]
            }
          ]
        },
        {
          "title": "操作體驗改善",
          "description": "",
          "groups": [
            {
              "title": "新增地圖快捷鍵",
              "description": "減少頻繁開啟選單的操作",
              "footer": "",
              "items": [
                "`T`：傳送石",
                "`N`：任務筆記本",
                "`I`：道具",
                "`E`：裝備"
              ]
            },
            {
              "title": "優化快捷鍵操作",
              "description": "",
              "footer": "",
              "items": [
                "裝備與道具快捷鍵改為沿用原生選單流程",
                "多人隊伍下可正常選擇角色，操作更加直覺"
              ]
            }
          ]
        },
        {
          "title": "任務系統改善",
          "description": "",
          "groups": [
            {
              "title": "任務筆記本調整",
              "description": "",
              "footer": "",
              "items": [
                "移除委託選擇段落",
                "更聚焦目前進行中的任務內容，提升閱讀效率"
              ]
            },
            {
              "title": "任務引導改善",
              "description": "",
              "footer": "",
              "items": [
                "新增部分劇情任務提示，降低卡關機率",
                "優化新手任務導引，降低初期迷路的情況"
              ]
            }
          ]
        },
        {
          "title": "探索體驗改善",
          "description": "重新設計所有隱藏陷阱事件",
          "groups": [
            {
              "title": "",
              "description": "",
              "footer": "",
              "items": [
                "降低探索時的負面體驗",
                "採用「失而復得」的事件設計",
                "鼓勵玩家探索，而非因踩陷阱產生挫折感"
              ]
            }
          ]
        },
        {
          "title": "戰鬥系統改善",
          "description": "",
          "groups": [
            {
              "title": "統一主角戰鬥流程",
              "description": "所有主角參與的戰鬥事件已統一使用共用戰鬥流程，包含：",
              "footer": "重構後可降低重複事件，提高維護性，並減少未來發生相同問題的機率",
              "items": [
                "一般戰鬥",
                "劇情戰鬥",
                "Boss 戰"
              ]
            },
            {
              "title": "Boss 戰 Buff 調整",
              "description": "",
              "footer": "避免因九命怪貓的攻擊力加成影響 Boss 戰平衡",
              "items": [
                "Boss 戰保命效果由「九命怪貓」改為「貓神庇佑」",
                "新增「狐神庇佑」狀態",
                "新增對應狀態 Icon"
              ]
            }
          ]
        },
        {
          "title": "美術更新",
          "description": "",
          "groups": [
            {
              "title": "更新遊戲封面",
              "description": "",
              "footer": "",
              "items": [
                "移除副標題",
                "保留遊戲名稱",
                "配合新版封面調整標題畫面配置"
              ]
            }
          ]
        },
        {
          "title": "其他",
          "description": "",
          "groups": [
            {
              "title": "",
              "description": "",
              "footer": "",
              "items": [
                "調整預設音量為 20，避免原始音效過大的問題"
              ]
            }
          ]
        },
        {
          "title": "Bug Fixes",
          "description": "",
          "groups": [
            {
              "title": "修正森林深處 Boss 戰敗後可能導致無法繼續遊戲的問題",
              "description": "",
              "footer": "",
              "items": [
                "修正 Boss 戰敗後 Boss 消失，造成流程無法繼續的問題",
                "現在 Boss 戰鬥玩家自帶「貓神庇佑」免疫死亡，不會戰敗"
              ]
            },
            {
              "title": "修正任務105-雪山防衛戰任務回到公會無法推進主線的錯誤",
              "description": "修正雪山防衛戰在2級任務中是最後完成時，無法觸發正確的任務階段檢查流程\n導致遊戲判斷玩家未完成所有二級任務而無法推進劇情的問題",
              "footer": "",
              "items": []
            },
            {
              "title": "修正任務103-收集雪山素材的流程問題",
              "description": "在任務105-雪山防衛戰任務開始前，先完成收集雪山素材任務\n接著開始雪山防衛戰時會重複觸發此任務的Boss戰鬥",
              "footer": "",
              "items": [
                "在對應的事件加入新的判斷，完成任務後不會再次觸發"
              ]
            },
            {
              "title": "修正南方小鎮的雞可能卡死的問題",
              "description": "跟雞對話時，如果雞位於角落，可能因無路可退導致事件卡住",
              "footer": "",
              "items": []
            },
            {
              "title": "修正冰窟小鬼事件異常",
              "description": "修正冰窟小鬼對話後不會離開的問題",
              "footer": "",
              "items": []
            },
            {
              "title": "修正奧客支線部分流程問題",
              "description": "",
              "footer": "",
              "items": [
                "修正奧客在冒險者公會的事件異常",
                "補充缺漏的任務提示"
              ]
            },
            {
              "title": "修正多項事件與文本問題",
              "description": "",
              "footer": "",
              "items": [
                "修正部分文本錯誤",
                "修正數個劇情事件細節",
                "移除可能影響後續劇情判定的舊事件內容"
              ]
            }
          ]
        }
      ]
    },
    {
      "version": "V0.6.0 Release Notes",
      "sections": [
        {
          "title": "此版本以及早期版本並無紀錄內容",
          "description": "",
          "groups": []
        }
      ]
    }
  ]
};

(() => {
  //-----------------------------------------------------------------------------
  // 字級與顏色設定
  //-----------------------------------------------------------------------------
  const HEADER_SIZES = {
    version: 26,   // #  H1
    section: 24,   // ## H2
    group: 22      // ### H3
  };
  const BODY_FONT_SIZE = 18;
  const BODY_LINE_HEIGHT = BODY_FONT_SIZE + 8;

  const HEADER_COLORS = {
    version: "#DDD8CE",
    section: "#DDD8CE",
    group: "#DDD8CE"
  };

  const BODY_COLOR = "#E5D1AD";
  const BULLET_COLOR = "#E5D1AD";

  // 滑鼠滾輪上下捲動速度
  const WHEEL_SPEED = 48;

  // 鍵盤上下鍵捲動速度（每幀像素，可自行調整）
  const KEY_SCROLL_SPEED = 6;

  //-----------------------------------------------------------------------------
  // MD Loader
  //-----------------------------------------------------------------------------
  function loadReleaseNotes(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "ReleaseNotes.md");
    xhr.overrideMimeType("text/plain");

    xhr.onload = () => {
      if (xhr.status < 400) {
        callback(parseReleaseNotes(xhr.responseText));
      }
    };

    xhr.onerror = () => {
      console.error("Failed to load ReleaseNotes.md");
    };

    xhr.send();
  }

  //-----------------------------------------------------------------------------
  // Parser（支援多個版本）
  //-----------------------------------------------------------------------------
  function parseReleaseNotes(markdown) {
    const releases = [];
    let currentRelease = null;
    let currentSection = null;
    let currentGroup = null;

    for (const rawLine of markdown.split("\n")) {
      const line = rawLine.trim();

      if (!line || line === "---") continue;

      if (line.startsWith("# ")) {
        currentRelease = {
          version: line.substring(2),
          sections: []
        };
        releases.push(currentRelease);
        currentSection = null;
        currentGroup = null;
        continue;
      }

      if (!currentRelease) continue;

      if (line.startsWith("## ")) {
        currentSection = {
          title: line.substring(3),
          description: "",
          groups: []
        };
        currentRelease.sections.push(currentSection);
        currentGroup = null;
        continue;
      }

      if (line.startsWith("### ")) {
        currentGroup = {
          title: line.substring(4),
          description: "",
          footer: "",
          items: []
        };
        currentSection.groups.push(currentGroup);
        continue;
      }

      if (line.startsWith("- ")) {
        if (!currentGroup) {
          currentGroup = {
            title: "",
            description: "",
            footer: "",
            items: []
          };
          currentSection.groups.push(currentGroup);
        }
        currentGroup.items.push(line.substring(2));
        continue;
      }

      // 一般文字
      if (currentGroup) {
        if (currentGroup.items.length === 0) {
          if (currentGroup.description) {
            currentGroup.description += "\n" + line;
          } else {
            currentGroup.description = line;
          }
        } else {
          if (currentGroup.footer) {
            currentGroup.footer += "\n" + line;
          } else {
            currentGroup.footer = line;
          }
        }
      } else if (currentSection) {
        if (currentSection.description) {
          currentSection.description += "\n" + line;
        } else {
          currentSection.description = line;
        }
      }
    }

    return { releases };
  }

  //-----------------------------------------------------------------------------
  // Scene_ReleaseNote
  //-----------------------------------------------------------------------------
  class Scene_ReleaseNote extends Scene_MenuBase {

    create() {
      super.create();
      this.createBackground();
      this.createWindow();
      this.createPageButtons();
      this.createPageText();

      // loadReleaseNotes(data => {
      //   this._window.setData(data);
      //   this.updatePageButtons();
      // });

      // 網頁版: 手動產生 json 物件才會用到這兩行
      this._window.setData(json);
      this.updatePageButtons();
    }

    createPageText() {
      this._pageSprite = new Sprite();
      this._pageSprite.bitmap = new Bitmap(160, 36);
      this._pageSprite.anchor.x = 0.5;
      this._pageSprite.x = Graphics.boxWidth / 2;
      this._pageSprite.y = Graphics.boxHeight - 58;
      this.addChild(this._pageSprite);
    }

    refreshPageText() {
      if (!this._window || !this._pageSprite) return;

      const len = this._window._releases.length;
      const idx = this._window._pageIndex;
      const text = `${idx + 1} / ${len}`;

      const bitmap = this._pageSprite.bitmap;
      bitmap.clear();
      bitmap.fontFace = $gameSystem.mainFontFace();
      bitmap.fontSize = 22;
      bitmap.textColor = "#ffffff";
      bitmap.outlineColor = "rgba(0, 0, 0, 0.85)";
      bitmap.outlineWidth = 4;
      bitmap.drawText(text, 0, 0, bitmap.width, bitmap.height, "center");
    }

    createBackground() {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadSystem("Board");
      this.addChildAt(this._backgroundSprite, 0);
    }

    setBackground(bitmap) {
      this._backgroundSprite.bitmap = bitmap;
    }

    createWindow() {
      this._window = new Window_ReleaseNote(this.windowRect());
      this.addWindow(this._window);
    }

    createPageButtons() {
      this._prevButton = new Sprite_Button("pageup");
      this._prevButton.x = 50;
      this._prevButton.y = Graphics.boxHeight - 55;
      this._prevButton.onClick = () => {
        this._window.changePage(-1);
        this.updatePageButtons();
      };
      this.addChild(this._prevButton);

      this._nextButton = new Sprite_Button("pagedown");
      this._nextButton.x = Graphics.boxWidth - 50 - this._nextButton.width;
      this._nextButton.y = Graphics.boxHeight - 55;
      this._nextButton.onClick = () => {
        this._window.changePage(1);
        this.updatePageButtons();
      };
      this.addChild(this._nextButton);
    }

    updatePageButtons() {
      if (!this._window || !this._prevButton) return;

      const len = this._window._releases.length;
      const idx = this._window._pageIndex;

      this._prevButton.visible = len > 1 && idx > 0;
      this._nextButton.visible = len > 1 && idx < len - 1;

      this.refreshPageText();
    }

    windowRect() {
      const marginX = 165;
      const marginTop = 100;
      const marginBottom = 120;

      return new Rectangle(
        marginX,
        marginTop,
        Graphics.boxWidth - marginX * 2,
        Graphics.boxHeight - marginTop - marginBottom
      );
    }

    update() {
      super.update();

      if (Input.isTriggered("cancel") || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        SceneManager.pop();
      }

      if (Input.isTriggered("left") || Input.isTriggered("right") ||
        Input.isTriggered("pageup") || Input.isTriggered("pagedown")) {
        this.updatePageButtons();
      }
    }
  }

  //-----------------------------------------------------------------------------
  // Window_ReleaseNote
  //-----------------------------------------------------------------------------
  class Window_ReleaseNote extends Window_Base {

    initialize(rect) {
      super.initialize(rect);

      this._releases = [];
      this._pageIndex = 0;
      this._scrollY = 0;
      this._contentHeight = 0;
      this._measureOnly = false;
    }

    _refreshFrame() { }
    _refreshBack() { }

    setData(data) {
      this._releases = (data && data.releases) ? data.releases : [];
      this._pageIndex = 0;
      this._scrollY = 0;
      this.refresh();
    }

    changePage(delta) {
      const len = this._releases.length;
      if (len <= 1) return;

      let newIndex = this._pageIndex + delta;
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= len) newIndex = len - 1;

      if (newIndex === this._pageIndex) return;

      this._pageIndex = newIndex;
      this._scrollY = 0;
      SoundManager.playCursor();
      this.refresh();
    }

    update() {
      super.update();

      if (TouchInput.wheelY > 20) this._scrollY += WHEEL_SPEED;
      if (TouchInput.wheelY < -20) this._scrollY -= WHEEL_SPEED;

      // 鍵盤上下鍵（人物移動的上/下）持續捲動
      if (Input.isPressed("up")) {
        this._scrollY -= KEY_SCROLL_SPEED;
      }
      if (Input.isPressed("down")) {
        this._scrollY += KEY_SCROLL_SPEED;
      }

      const maxScroll = Math.max(0, this._contentHeight - this.innerHeight);
      this._scrollY = this._scrollY.clamp(0, maxScroll);
      this.origin.y = this._scrollY;

      // 左右換頁（維持原本功能）
      if (Input.isTriggered("left") || Input.isTriggered("pageup")) {
        this.changePage(-1);
      }
      if (Input.isTriggered("right") || Input.isTriggered("pagedown")) {
        this.changePage(1);
      }
    }

    refresh() {
      if (!this._releases || this._releases.length === 0) {
        if (this.contents) this.contents.clear();
        return;
      }

      // 1. 量測真實高度
      this._measureOnly = true;
      let y = this.drawReleaseNotes(0);
      this._contentHeight = y;
      this._measureOnly = false;

      // 2. 用正確高度重建 contents
      if (this.contents) this.contents.destroy();
      this.contents = new Bitmap(
        this.contentsWidth(),
        Math.max(this._contentHeight, this.innerHeight)
      );

      // 3. 真正繪製
      this.drawReleaseNotes(0);
    }

    //-------------------------------------------------------------------------
    // 繪製核心
    //-------------------------------------------------------------------------
    drawReleaseNotes(y) {
      const release = this._releases[this._pageIndex];
      if (!release) return y;

      // # Version (H1)
      const h1 = HEADER_SIZES.version;
      if (!this._measureOnly) {
        this.contents.fontSize = h1;
        this.contents.textColor = HEADER_COLORS.version;
        this.drawText(release.version, 0, y, this.contentsWidth(), "center");
        this.resetFontSettings();
      }
      y += h1 + 16;

      for (const section of release.sections) {
        y = this.drawSection(section, y);
      }

      return y;
    }

    drawSection(section, y) {
      // ## Section (H2)
      const h2 = HEADER_SIZES.section;
      if (!this._measureOnly) {
        this.contents.fontSize = h2;
        this.contents.textColor = HEADER_COLORS.section;
        this.drawText(section.title, 0, y, this.contentsWidth());
        this.resetFontSettings();
      }
      y += h2 + 10;

      if (section.description) {
        y = this.drawDescription(section.description, y);
      }

      for (const group of section.groups) {
        y = this.drawGroup(group, y);
      }

      y += BODY_LINE_HEIGHT;
      return y;
    }

    drawDescription(description, y, indent = 0) {
      const lines = description.split("\n");
      for (const line of lines) {
        if (!this._measureOnly) {
          this.contents.fontSize = BODY_FONT_SIZE;
          this.contents.textColor = BODY_COLOR;
          this.drawText(line, indent, y, this.contentsWidth() - indent);
          this.resetFontSettings();
        }
        y += BODY_LINE_HEIGHT;
      }
      return y + BODY_LINE_HEIGHT;
    }

    drawGroup(group, y) {
      // ### Group (H3)
      if (group.title) {
        const h3 = HEADER_SIZES.group;
        if (!this._measureOnly) {
          this.contents.fontSize = h3;
          this.contents.textColor = HEADER_COLORS.group;
          this.drawText(group.title, 24, y, this.contentsWidth() - 24);
          this.resetFontSettings();
        }
        y += h3 + 6;
      }

      // 列表前的描述
      if (group.description) {
        y = this.drawDescription(group.description, y, 24);
      }

      // 項目
      for (const item of group.items) {
        y = this.drawItem(item, y);
      }

      // 列表後的補充說明
      if (group.footer) {
        y = this.drawDescription(group.footer, y, 24);
      }

      y += BODY_LINE_HEIGHT;
      return y;
    }

    drawItem(item, y) {
      if (!this._measureOnly) {
        this.contents.fontSize = BODY_FONT_SIZE;
        this.contents.textColor = BULLET_COLOR;
        this.drawText("• " + item, 48, y, this.contentsWidth() - 48);
        this.resetFontSettings();
      }
      return y + BODY_LINE_HEIGHT;
    }
  }

  //-----------------------------------------------------------------------------
  // Sprite_ReleaseButton（帶平滑 hover 動畫）
  //-----------------------------------------------------------------------------
  class Sprite_ReleaseButton extends Sprite_Clickable {

    initialize() {
      super.initialize();

      this.bitmap = ImageManager.loadSystem("ReleaseNoteButton");
      this.anchor.x = 0.5;
      this.anchor.y = 0.5;

      this._targetOpacity = 255;
      this._targetScale = 1.0;
      this.opacity = 255;
      this.scale.x = 1.0;
      this.scale.y = 1.0;
    }

    update() {
      super.update();
      this.updateHoverEffect();
    }

    updateHoverEffect() {
      const hovered = !!this._hovered;
      const pressed = !!this._pressed;

      this._targetOpacity = pressed ? 180 : (hovered ? 220 : 255);
      this._targetScale = hovered ? 1.05 : 1.0;

      const lerpSpeed = 0.18;

      this.opacity += (this._targetOpacity - this.opacity) * lerpSpeed;

      const newScale = this.scale.x + (this._targetScale - this.scale.x) * lerpSpeed;
      this.scale.x = newScale;
      this.scale.y = newScale;
    }

    onClick() {
      SceneManager.push(Scene_ReleaseNote);
    }
  }

  //-----------------------------------------------------------------------------
  // Scene_Title
  //-----------------------------------------------------------------------------
  const _Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function () {
    _Scene_Title_create.call(this);
    this.createReleaseButton();
  };

  Scene_Title.prototype.createReleaseButton = function () {
    this._releaseButton = new Sprite_ReleaseButton();
    this._releaseButton.x = 20 + 48;
    this._releaseButton.y = Graphics.height - 68;
    this.addChild(this._releaseButton);
  };

})();
