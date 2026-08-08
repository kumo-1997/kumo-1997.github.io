/*:
 * @target MZ
 * @plugindesc Generate Release Notes
 * @author Kumo
 */

const json = {
  "releases": [
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

((param) => {
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
          footer: "",        // 列表後面的文字
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
          // 還在列表之前 → 當作 description
          if (currentGroup.description) {
            currentGroup.description += "\n" + line;
          } else {
            currentGroup.description = line;
          }
        } else {
          // 已經有列表了 → 當作 footer
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

      // Windows: 直接讀取 md 檔案，不用手動產生 json
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
      this._pageSprite.y = Graphics.boxHeight - 58;   // 跟按鈕對齊
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
      this.addChildAt(this._backgroundSprite, 0);   // 強制放到最下層
    }

    setBackground(bitmap) {
      this._backgroundSprite.bitmap = bitmap;
    }

    createWindow() {
      this._window = new Window_ReleaseNote(this.windowRect());
      this.addWindow(this._window);
    }

    createPageButtons() {
      // 左（上一頁）
      this._prevButton = new Sprite_Button("pageup");
      this._prevButton.x = 50;
      this._prevButton.y = Graphics.boxHeight - 55;   // 往下移，落在留白區
      this._prevButton.onClick = () => {
        this._window.changePage(-1);
        this.updatePageButtons();
      };
      this.addChild(this._prevButton);

      // 右（下一頁）
      this._nextButton = new Sprite_Button("pagedown");
      this._nextButton.x = Graphics.boxWidth - 50 - this._nextButton.width;
      this._nextButton.y = Graphics.boxHeight - 55;   // 往下移，落在留白區
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

      // 鍵盤換頁時也更新按鈕狀態
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

    // 無邊框
    _refreshFrame() { }

    // 背景透明
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

      const speed = 48;
      if (TouchInput.wheelY > 20) this._scrollY += speed;
      if (TouchInput.wheelY < -20) this._scrollY -= speed;

      const maxScroll = Math.max(0, this._contentHeight - this.innerHeight);
      this._scrollY = this._scrollY.clamp(0, maxScroll);
      this.origin.y = this._scrollY;

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

    drawReleaseNotes(y) {
      const release = this._releases[this._pageIndex];
      if (!release) return y;

      if (!this._measureOnly) {
        this.drawText(release.version, 0, y, this.contentsWidth(), "center");
      }
      y += this.lineHeight() * 2;

      for (const section of release.sections) {
        y = this.drawSection(section, y);
      }

      return y;
    }

    drawSection(section, y) {
      if (!this._measureOnly) {
        this.drawText(section.title, 0, y, this.contentsWidth());
      }
      y += this.lineHeight();

      if (section.description) {
        y = this.drawDescription(section.description, y);
      }

      for (const group of section.groups) {
        y = this.drawGroup(group, y);
      }

      y += this.lineHeight();
      return y;
    }

    drawDescription(description, y, indent = 0) {
      const lines = description.split("\n");
      for (const line of lines) {
        if (!this._measureOnly) {
          this.drawText(line, indent, y, this.contentsWidth() - indent);
        }
        y += this.lineHeight();
      }
      return y + this.lineHeight(); // 描述後面多留一行空白
    }

    drawGroup(group, y) {
      if (group.title) {
        if (!this._measureOnly) {
          this.drawText(group.title, 24, y, this.contentsWidth() - 24);
        }
        y += this.lineHeight();
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

      y += this.lineHeight();
      return y;
    }

    drawItem(item, y) {
      if (!this._measureOnly) {
        this.drawText("• " + item, 48, y, this.contentsWidth() - 48);
      }
      return y + this.lineHeight();
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
      super.update();          // 一定要先呼叫，才會更新 _hovered / _pressed
      this.updateHoverEffect();
    }

    updateHoverEffect() {
      // 使用內部屬性（RMMZ 沒有公開 isHovered / isPressed）
      const hovered = !!this._hovered;
      const pressed = !!this._pressed;

      // 目標值
      this._targetOpacity = pressed ? 180 : (hovered ? 220 : 255);
      this._targetScale = hovered ? 1.05 : 1.0;

      // 平滑過渡
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

    // 因為改成 anchor 0.5，所以座標改為中心點
    // 原本 y = Graphics.height - 116（圖片高度約 96 + 邊距）
    this._releaseButton.x = 20 + 48;               // 大約圖片寬度一半
    this._releaseButton.y = Graphics.height - 68;  // 中心點

    this.addChild(this._releaseButton);
  };

})();
