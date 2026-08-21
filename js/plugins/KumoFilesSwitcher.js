//=============================================================================
// KumoFilesSwitcher.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 根據語言切換標題封面圖片或是其他需要一語言替換的資源
 * @author Kumo
 *
 * @help
 * 準備兩張圖片：
 *   img/titles1/Game_Title.png      ← 繁中使用
 *   img/titles1/Game_Title_en.png   ← 英文（或其他非中文）使用
 *
 * 需要 DynamicTranslation 插件，並放在其後面。
 */

(() => {
  'use strict';

  const TITLE_IMAGE_ZH = 'Game_Title';
  const TITLE_IMAGE_EN = 'Game_Title_en';

  /**
   * 根據目前語言回傳應該使用的標題圖名稱
   */
  function getTitleImageName() {
    if (window.$translationManager && $translationManager._isInitialized) {
      const lang = $translationManager.getCurrentLanguage();
      // 非繁中一律使用英文圖
      if (lang !== 'zh') {
        return TITLE_IMAGE_EN;
      }
    }
    return TITLE_IMAGE_ZH;
  }

  /**
   * 覆寫標題背景建立
   */
  const _Scene_Title_createBackground = Scene_Title.prototype.createBackground;
  Scene_Title.prototype.createBackground = function () {
    // 先執行原本的邏輯（會載入系統設定的 title1/title2）
    _Scene_Title_createBackground.call(this);

    // 額外載入我們的語言專用封面圖（覆蓋或額外顯示）
    // 這裡示範用 _backSprite1 直接替換
    const imageName = getTitleImageName();
    this._backSprite1.bitmap = ImageManager.loadTitle1(imageName);
  };

  /**
   * 語言切換時，如果目前在標題畫面，就即時更新圖片
   */
  const _TranslationManager_setLanguage = TranslationManager.prototype.setLanguage;
  if (window.TranslationManager) {
    TranslationManager.prototype.setLanguage = function (language) {
      _TranslationManager_setLanguage.call(this, language);

      // 如果正在標題畫面，重新整理背景
      if (SceneManager._scene instanceof Scene_Title) {
        const imageName = getTitleImageName();
        if (SceneManager._scene._backSprite1) {
          SceneManager._scene._backSprite1.bitmap = ImageManager.loadTitle1(imageName);
        }
      }
    };
  }

})();
