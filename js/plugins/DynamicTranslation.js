//=============================================================================
// DynamicTranslation.js
//=============================================================================

/*:
 * 必須放在最開頭，其他 plugins 會用到 tr function
 * 相依的內容有:
 * 1. rmmz_windows.js
 * 2. KumoFolatingText.js
 * 3. KumoQuestSystem.js
 * 4. KumoTeleportSystem.js
 * 
 * @plugindesc 動態翻譯系統 - 支援 mtool 工具的 key-value 翻譯檔案格式 + 自動換行
 * @author Supernova
 *
 * @param Default Language
 * @desc 預設語言代碼 (例如: zh, en, ja)
 * @default zh
 *
 * @param Translation Path
 * @desc 翻譯檔案路徑 (相對於遊戲根目錄)
 * @default translations/
 *
 * @param Auto Detect Translations
 * @desc 是否自動偵測並載入所有可用的翻譯檔案
 * @type boolean
 * @default true
 *
 * @help
 * ============================================================================
 * 動態翻譯系統 - 支援 mtool 工具格式 + 自動換行
 * ============================================================================
 *
 * 翻譯檔案結構支援：
 * translations/
 *   ├── zh/          (資料夾模式，可放多個 json)
 *   │    ├── Map001.json
 *   │    └── CommonEvents.json
 *   ├── en/
 *   └── 或單檔 zh.json / en.json
 *
 * 自動換行規則：
 * - 翻譯完成後，根據「有臉圖」的可用寬度自動插入 \n
 * - 翻譯檔本身不要放 \n（保持單行）
 * - 控制字元 \V[n] \N[n] \P[n] \G 等會正確參與寬度計算
 *
 * 腳本呼叫:
 *   TranslationManager.setLanguage('en');
 *   TranslationManager.getCurrentLanguage();
 *   TranslationManager.getAvailableLanguages();
 *
 * 外掛命令:
 *   SetLanguage en
 *   SetLanguage zh
 *
 * ============================================================================
 */

(function () {
    'use strict';

    // 外掛參數
    var parameters = PluginManager.parameters('DynamicTranslation');
    var defaultLanguage = parameters['Default Language'] || 'zh';
    var translationPath = parameters['Translation Path'] || 'translations/';
    var autoDetectTranslations = parameters['Auto Detect Translations'] === 'true';
    var translationMode = parameters['Translation Mode'] || 'simple'; // simple, full

    //=========================================================================
    // TranslationManager
    //=========================================================================

    var TranslationManager = function () {
        this._currentLanguage = defaultLanguage;
        this._translations = {};
        this._originalTexts = {};
        this._isInitialized = false;
        this._refreshCallbacks = [];
        this._availableLanguages = [];
        this._enableSubstringExtraction = translationMode === 'full';
    };

    TranslationManager.prototype.initialize = function () {
        if (this._isInitialized) return;

        this._buildOriginalTextMapping();
        if (autoDetectTranslations) {
            this._detectAvailableLanguages();
        } else {
            this._availableLanguages = [defaultLanguage];
            this.loadLanguage(defaultLanguage, function () {
                this._isInitialized = true;
                this._applyTranslations();
                this.applyDatabaseTranslations();
            }.bind(this));
        }
    };

    TranslationManager.prototype._buildOriginalTextMapping = function () {
        this._originalTexts = {};

        if ($dataSystem && $dataSystem.terms) {
            var terms = $dataSystem.terms;
            for (var category in terms) {
                if (terms.hasOwnProperty(category)) {
                    for (var id in terms[category]) {
                        if (terms[category].hasOwnProperty(id)) {
                            var originalText = terms[category][id];
                            if (originalText) {
                                this._originalTexts[originalText] = { category: category, id: id };
                            }
                        }
                    }
                }
            }
        }

        if ($dataSystem && $dataSystem.currencyUnit) {
            this._originalTexts[$dataSystem.currencyUnit] = { category: 'currencyUnit', id: 'currencyUnit' };
        }
    };

    /**
     * 載入指定語言（優先資料夾模式，失敗則退回單一檔案）
     */
    TranslationManager.prototype.loadLanguage = function (language, callback) {
        var self = this;
        var folderPath = translationPath + language + '/';
        var singleFilePath = translationPath + language + '.json';

        this._loadLanguageFromFolder(folderPath, language, function (success, mergedTranslations) {
            if (success && mergedTranslations) {
                self._translations[language] = mergedTranslations;
                console.log('【資料夾模式】翻譯載入成功:', language,
                    Object.keys(mergedTranslations).length, '個項目');
                if (callback) callback(true);
                return;
            }
            self._loadLanguageFromFile(singleFilePath, language, callback);
        });
    };

    /**
     * 從資料夾載入並合併所有 .json 檔案
     * - NW.js：使用 fs 掃描
     * - 瀏覽器：讀取 index.json 作為檔案清單後，用 XHR 載入
     */
    TranslationManager.prototype._loadLanguageFromFolder = function (folderPath, language, callback) {
        var self = this;

        // ========================
        // NW.js 模式
        // ========================
        if (Utils.isNwjs()) {
            try {
                var fs = require('fs');
                var path = require('path');

                if (!fs.existsSync(folderPath)) {
                    if (callback) callback(false, null);
                    return;
                }

                var files = fs.readdirSync(folderPath)
                    .filter(function (file) {
                        return file.toLowerCase().endsWith('.json');
                    })
                    .sort();

                if (files.length === 0) {
                    if (callback) callback(false, null);
                    return;
                }

                var merged = {};
                var loadedCount = 0;
                var hasError = false;

                files.forEach(function (file) {
                    var fullPath = path.join(folderPath, file);
                    try {
                        var content = fs.readFileSync(fullPath, 'utf8');
                        var json = JSON.parse(content);
                        Object.assign(merged, json);
                        console.log('  已載入:', file, '→', Object.keys(json).length, '個項目');
                    } catch (e) {
                        console.error('載入翻譯檔失敗:', fullPath, e);
                        hasError = true;
                    }

                    loadedCount++;
                    if (loadedCount === files.length) {
                        if (hasError && Object.keys(merged).length === 0) {
                            if (callback) callback(false, null);
                        } else {
                            if (callback) callback(true, merged);
                        }
                    }
                });
            } catch (e) {
                console.warn('無法掃描翻譯資料夾:', folderPath, e);
                if (callback) callback(false, null);
            }
            return;
        }

        // ========================
        // 瀏覽器模式
        // ========================
        // 需要在語言資料夾內放置 index.json，內容為檔案名稱陣列
        // 例如：["Map001.json", "CommonEvents.json", "Actors.json", "Items.json"]
        var indexUrl = folderPath + 'index.json';

        var xhrIndex = new XMLHttpRequest();
        xhrIndex.open('GET', indexUrl);
        xhrIndex.overrideMimeType('application/json');

        xhrIndex.onload = function () {
            if (xhrIndex.status >= 400) {
                // 沒有 index.json → 視為資料夾模式失敗，讓上層走單檔 fallback
                if (callback) callback(false, null);
                return;
            }

            var fileList = [];
            try {
                fileList = JSON.parse(xhrIndex.responseText);
                if (!Array.isArray(fileList)) {
                    if (callback) callback(false, null);
                    return;
                }
            } catch (e) {
                console.error('解析 index.json 失敗:', indexUrl, e);
                if (callback) callback(false, null);
                return;
            }

            if (fileList.length === 0) {
                if (callback) callback(false, null);
                return;
            }

            var merged = {};
            var loadedCount = 0;
            var hasError = false;

            fileList.forEach(function (file) {
                var fileUrl = folderPath + file;

                var xhr = new XMLHttpRequest();
                xhr.open('GET', fileUrl);
                xhr.overrideMimeType('application/json');

                xhr.onload = function () {
                    if (xhr.status < 400) {
                        try {
                            var json = JSON.parse(xhr.responseText);
                            Object.assign(merged, json);
                            console.log('  已載入:', file, '→', Object.keys(json).length, '個項目');
                        } catch (e) {
                            console.error('載入翻譯檔失敗:', fileUrl, e);
                            hasError = true;
                        }
                    } else {
                        console.warn('翻譯檔不存在或載入失敗:', fileUrl);
                        hasError = true;
                    }

                    loadedCount++;
                    if (loadedCount === fileList.length) {
                        if (hasError && Object.keys(merged).length === 0) {
                            if (callback) callback(false, null);
                        } else {
                            if (callback) callback(true, merged);
                        }
                    }
                };

                xhr.onerror = function () {
                    console.warn('無法載入翻譯檔案:', fileUrl);
                    hasError = true;
                    loadedCount++;
                    if (loadedCount === fileList.length) {
                        if (Object.keys(merged).length === 0) {
                            if (callback) callback(false, null);
                        } else {
                            if (callback) callback(true, merged);
                        }
                    }
                };

                xhr.send();
            });
        };

        xhrIndex.onerror = function () {
            // 沒有 index.json，讓上層退回單檔模式
            if (callback) callback(false, null);
        };

        xhrIndex.send();
    };

    TranslationManager.prototype._loadLanguageFromFile = function (filename, language, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', filename);
        xhr.overrideMimeType('application/json');

        xhr.onload = function () {
            if (xhr.status < 400) {
                try {
                    var translations = JSON.parse(xhr.responseText);
                    this._translations[language] = translations;
                    console.log('【單一檔案模式】翻譯載入成功:', language,
                        Object.keys(translations).length, '個項目');
                    if (callback) callback(true);
                } catch (e) {
                    console.error('翻譯檔案解析失敗:', filename, e);
                    if (callback) callback(false);
                }
            } else {
                console.warn('翻譯檔案載入失敗:', filename, '狀態碼:', xhr.status);
                if (callback) callback(false);
            }
        }.bind(this);

        xhr.onerror = function () {
            console.warn('無法載入翻譯檔案:', filename);
            if (callback) callback(false);
        };

        xhr.send();
    };

    TranslationManager.prototype._detectAvailableLanguages = function () {
        var testFiles = ['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'pt', 'ru', 'zh_TW', 'zh_CN'];
        var loadedCount = 0;
        var self = this;

        testFiles.forEach(function (lang) {
            self.loadLanguage(lang, function (success) {
                loadedCount++;
                if (success && self._availableLanguages.indexOf(lang) === -1) {
                    self._availableLanguages.push(lang);
                }

                if (loadedCount === testFiles.length) {
                    if (self._availableLanguages.length === 0) {
                        self._availableLanguages = [defaultLanguage];
                    }
                    self._isInitialized = true;
                    self._applyTranslations();
                    self.applyDatabaseTranslations();
                    console.log('可用語言:', self._availableLanguages);
                }
            });
        });
    };

    TranslationManager.prototype.setLanguage = function (language) {
        if (this._currentLanguage === language) return;

        if (!this._translations[language]) {
            this.loadLanguage(language, function (success) {
                if (success) {
                    this._currentLanguage = language;
                    this._applyTranslations();
                    this._refreshAllWindows();
                }
            }.bind(this));
        } else {
            this._currentLanguage = language;
            this._applyTranslations();
            this._refreshAllWindows();
        }
    };

    TranslationManager.prototype.getCurrentLanguage = function () {
        return this._currentLanguage;
    };

    TranslationManager.prototype.getAvailableLanguages = function () {
        return this._availableLanguages.slice();
    };

    TranslationManager.prototype._extractCorrespondingTranslation = function (originalPart, fullKey, fullTranslation, keyIndex) {
        var originalLines = fullKey.split('\n');
        var translationLines = fullTranslation.split('\n');

        if (originalLines.length === translationLines.length && originalLines.length > 1) {
            var currentPos = 0;
            for (var i = 0; i < originalLines.length; i++) {
                var lineStart = currentPos;
                var lineEnd = currentPos + originalLines[i].length + (i < originalLines.length - 1 ? 1 : 0);

                if (keyIndex >= lineStart && keyIndex < lineEnd) {
                    var relativeIndex = keyIndex - lineStart;
                    var relativeLength = Math.min(originalPart.length, originalLines[i].length - relativeIndex);
                    var translatedLine = translationLines[i];
                    if (translatedLine) {
                        var lineRatio = translatedLine.length / originalLines[i].length;
                        var transStart = Math.floor(relativeIndex * lineRatio);
                        var transEnd = (relativeIndex + relativeLength >= originalLines[i].length)
                            ? translatedLine.length
                            : Math.floor((relativeIndex + relativeLength) * lineRatio);
                        return translatedLine.substring(transStart, transEnd);
                    }
                }
                currentPos = lineEnd;
            }
        }

        if (Math.abs(fullTranslation.length - fullKey.length) / fullKey.length < 0.5) {
            var startRatio = keyIndex / fullKey.length;
            var endRatio = (keyIndex + originalPart.length) / fullKey.length;
            var translationStart = Math.round(startRatio * fullTranslation.length);
            var translationEnd = Math.round(endRatio * fullTranslation.length);
            translationStart = Math.max(0, Math.min(translationStart, fullTranslation.length));
            translationEnd = Math.max(translationStart, Math.min(translationEnd, fullTranslation.length));
            var result = fullTranslation.substring(translationStart, translationEnd);
            if (originalPart.indexOf('\n') === -1 && result.indexOf('\n') !== -1) {
                result = result.split('\n')[0];
            }
            return result;
        }

        var estimatedLength = Math.round(originalPart.length * (fullTranslation.length / fullKey.length));
        var estimatedStart = Math.round(keyIndex * (fullTranslation.length / fullKey.length));
        estimatedStart = Math.max(0, Math.min(estimatedStart, fullTranslation.length));
        estimatedLength = Math.max(1, Math.min(estimatedLength, fullTranslation.length - estimatedStart));
        var result = fullTranslation.substring(estimatedStart, estimatedStart + estimatedLength);
        if (originalPart.indexOf('\n') === -1 && result.indexOf('\n') !== -1) {
            result = result.replace(/\n/g, '');
        }
        return result;
    };

    TranslationManager.prototype.translate = function (originalText) {
        if (!originalText || !this._isInitialized) {
            return originalText;
        }

        var currentTranslations = this._translations[this._currentLanguage];
        if (!currentTranslations) {
            return originalText;
        }

        var translatedText = originalText;

        // 1. 直接比對完整句子
        if (currentTranslations[originalText] !== undefined) {
            translatedText = currentTranslations[originalText];
        } else {
            // 2. trim 後再比對
            var cleaned = originalText.trim();
            if (cleaned !== originalText && currentTranslations[cleaned] !== undefined) {
                translatedText = currentTranslations[cleaned];
            } else {
                // 3. 反斜線正規化嘗試
                var normalized = originalText.replace(/\\\\/g, '\\');
                if (normalized !== originalText && currentTranslations[normalized] !== undefined) {
                    translatedText = currentTranslations[normalized];
                } else {
                    var doubleSlash = originalText.replace(/\\/g, '\\\\');
                    if (doubleSlash !== originalText && currentTranslations[doubleSlash] !== undefined) {
                        translatedText = currentTranslations[doubleSlash];
                    } else if (this._enableSubstringExtraction && originalText.indexOf('\n') === -1) {
                        // 4. 子字串提取（full mode）
                        for (var key in currentTranslations) {
                            if (currentTranslations.hasOwnProperty(key)) {
                                var keyIndex = key.indexOf(originalText);
                                if (keyIndex !== -1 && key !== originalText) {
                                    translatedText = this._extractCorrespondingTranslation(
                                        originalText, key, currentTranslations[key], keyIndex
                                    );
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        // 5. 處理人物名稱控制字元（\P[n]、\N[n]）
        translatedText = this.replaceActorCodes(translatedText, currentTranslations);

        return translatedText;
    };

    /**
     * 替換 \P[n] 與 \N[n] 為翻譯檔中的名稱
     * 支援在 Actors.json 等檔案寫入：
     *   "\\P[1]": "Meow Meow"
     *   "\\N[9]": "Ao Ao"
     */
    TranslationManager.prototype.replaceActorCodes = function (text, translations) {
        if (!text || !translations) return text;

        // 處理 \P[n]
        text = text.replace(/\\P\[(\d+)\]/gi, function (match) {
            // match 會是 \P[1]
            if (translations[match] !== undefined) {
                return translations[match];
            }
            // 也嘗試雙反斜線形式（以防萬一）
            var double = match.replace(/\\/g, '\\\\');
            if (translations[double] !== undefined) {
                return translations[double];
            }
            return match;
        });

        // 處理 \N[n]
        text = text.replace(/\\N\[(\d+)\]/gi, function (match) {
            if (translations[match] !== undefined) {
                return translations[match];
            }
            var double = match.replace(/\\/g, '\\\\');
            if (translations[double] !== undefined) {
                return translations[double];
            }
            return match;
        });

        return text;
    };

    TranslationManager.prototype.getStatus = function () {
        return {
            isInitialized: this._isInitialized,
            currentLanguage: this._currentLanguage,
            availableLanguages: this._availableLanguages,
            loadedTranslations: Object.keys(this._translations),
            translationCount: this._availableLanguages.reduce(function (count, lang) {
                return count + (this._translations[lang] ? Object.keys(this._translations[lang]).length : 0);
            }.bind(this), 0)
        };
    };

    TranslationManager.prototype._applyTranslations = function () {
        if (!this._isInitialized) return;

        if (!TextManager._originalBasic) {
            TextManager._originalBasic = TextManager.basic;
            TextManager._originalParam = TextManager.param;
            TextManager._originalCommand = TextManager.command;
            TextManager._originalMessage = TextManager.message;
            TextManager._originalGetter = TextManager.getter;
        }

        var self = this;

        TextManager.basic = function (basicId) {
            var originalText = TextManager._originalBasic ? TextManager._originalBasic(basicId) : $dataSystem.terms.basic[basicId] || '';
            return self.translate(originalText);
        };

        TextManager.param = function (paramId) {
            var originalText = TextManager._originalParam ? TextManager._originalParam(paramId) : $dataSystem.terms.params[paramId] || '';
            return self.translate(originalText);
        };

        TextManager.command = function (commandId) {
            var originalText = TextManager._originalCommand ? TextManager._originalCommand(commandId) : $dataSystem.terms.commands[commandId] || '';
            return self.translate(originalText);
        };

        TextManager.message = function (messageId) {
            var originalText = TextManager._originalMessage ? TextManager._originalMessage(messageId) : $dataSystem.terms.messages[messageId] || '';
            return self.translate(originalText);
        };

        if (TextManager._originalGetter) {
            var originalGetter = TextManager._originalGetter;
            TextManager.getter = function (method, param) {
                return {
                    get: function () {
                        var originalText = this[method](param);
                        return self.translate(originalText);
                    }.bind(originalGetter(method, param))
                };
            };
        }

        if (typeof TextManager.currencyUnit === 'object' && TextManager.currencyUnit.get) {
            var originalCurrencyUnit = $dataSystem ? $dataSystem.currencyUnit : '';
            Object.defineProperty(TextManager, 'currencyUnit', {
                get: function () {
                    return self.translate(originalCurrencyUnit);
                },
                configurable: true
            });
        }
    };

    TranslationManager.prototype._refreshAllWindows = function () {
        if (SceneManager._scene) {
            SceneManager._scene._refreshAllWindows();
        }
        this._refreshCallbacks.forEach(function (callback) {
            if (typeof callback === 'function') callback();
        });
    };

    TranslationManager.prototype.onRefresh = function (callback) {
        if (typeof callback === 'function') {
            this._refreshCallbacks.push(callback);
        }
    };

    TranslationManager.prototype.offRefresh = function (callback) {
        var index = this._refreshCallbacks.indexOf(callback);
        if (index >= 0) this._refreshCallbacks.splice(index, 1);
    };

    //=========================================================================
    // 全域實例
    //=========================================================================

    window.TranslationManager = TranslationManager;
    window.$translationManager = new TranslationManager();

    //=========================================================================
    // DataManager / Scene / Options / Config / PluginCommand
    //=========================================================================

    var _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function (object) {
        _DataManager_onLoad.call(this, object);
        if (object === $dataSystem) {
            $translationManager.initialize();
        }
    };

    var _Scene_Base_create = Scene_Base.prototype.create;
    Scene_Base.prototype.create = function () {
        _Scene_Base_create.call(this);
        this._refreshAllWindows = this._refreshAllWindows || function () {
            this.children.forEach(function (child) {
                if (child.refresh && typeof child.refresh === 'function') {
                    child.refresh();
                }
            });
        };
    };

    var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function () {
        _Window_Options_makeCommandList.call(this);
        this.addLanguageOption();
    };

    Window_Options.prototype.addLanguageOption = function () {
        var languages = this.getAvailableLanguages();
        if (languages.length > 1) {
            this.addCommand('Language / 語言', 'language');
        }
    };

    Window_Options.prototype.getAvailableLanguages = function () {
        return $translationManager ? $translationManager.getAvailableLanguages() : ['zh'];
    };

    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        var symbol = this.commandSymbol(index);
        if (symbol === 'language') {
            return this.getCurrentLanguageName();
        }
        return _Window_Options_statusText.call(this, index);
    };

    Window_Options.prototype.getCurrentLanguageName = function () {
        var currentLang = $translationManager ? $translationManager.getCurrentLanguage() : 'zh';
        var langNames = {
            'zh': '中文', 'en': 'English', 'ja': '日本語', 'ko': '한국어',
            'fr': 'Français', 'de': 'Deutsch', 'es': 'Español',
            'pt': 'Português', 'ru': 'Русский'
        };
        return langNames[currentLang] || currentLang.toUpperCase();
    };

    Window_Options.prototype.processOk = function () {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === 'language') {
            this.changeLanguage();
        } else {
            Window_Command.prototype.processOk.call(this);
        }
    };

    Window_Options.prototype.changeLanguage = function () {
        var languages = this.getAvailableLanguages();
        var currentLang = $translationManager ? $translationManager.getCurrentLanguage() : 'zh';
        var currentIndex = languages.indexOf(currentLang);
        var nextIndex = (currentIndex + 1) % languages.length;

        if ($translationManager) {
            $translationManager.setLanguage(languages[nextIndex]);
            ConfigManager.language = languages[nextIndex];
            this.redrawCurrentItem();
            SoundManager.playCursor();
        }
    };

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        var config = _ConfigManager_makeData.call(this);
        config.language = this.language;
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        _ConfigManager_applyData.call(this, config);
        this.language = config.language || 'zh';
        if ($translationManager && this.language !== $translationManager.getCurrentLanguage()) {
            $translationManager.setLanguage(this.language);
        }
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'SetLanguage' && args.length > 0 && $translationManager) {
            $translationManager.setLanguage(args[0]);
        }
    };

    //=========================================================================
    // 翻譯攔截
    //=========================================================================

    var _Game_Message_add = Game_Message.prototype.add;
    Game_Message.prototype.add = function (text) {
        if (window.$translationManager && window.$translationManager._isInitialized) {
            text = window.$translationManager.translate(text);
        }
        _Game_Message_add.call(this, text);
    };

    /**
     * 根據目前訊息視窗可用寬度自動插入換行
     * - 一律假設有臉圖
     * - 翻譯檔不應包含 \n，此函式會完全重新排版
     * - 控制字元會先展開再測量
     */
    Window_Message.prototype.autoWrapText = function (text) {
        if (!text || text.length === 0) return text;

        // 1. 先清除既有換行，全部重新排版
        text = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

        // 2. 正確取得可用寬度（相容 contentsWidth 是函式或屬性的情況）
        var contentsW = this.contentsWidth;
        if (typeof contentsW === 'function') {
            contentsW = contentsW.call(this);
        }
        // 後備方案
        if (!contentsW || contentsW <= 0) {
            contentsW = this.contents ? this.contents.width : (this.innerWidth || 700);
        }

        var faceWidth = ImageManager.faceWidth || 144;
        var maxWidth = contentsW - faceWidth - 28;
        if (maxWidth < 100) {
            maxWidth = Math.floor(contentsW * 0.70);
        }

        // 3. 如果整段已經很短，直接返回
        var fullWidth = this.textWidth(this.convertEscapeCharacters(text));
        if (fullWidth <= maxWidth) {
            return text;
        }

        // 4. 以空白切分（保留空白）
        var tokens = text.split(/(\s+)/);
        var lines = [];
        var currentLine = '';

        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var testLine = currentLine + token;
            var testWidth = this.textWidth(this.convertEscapeCharacters(testLine));

            if (testWidth > maxWidth && currentLine !== '') {
                lines.push(currentLine.replace(/\s+$/, ''));
                currentLine = token.replace(/^\s+/, '');
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) {
            lines.push(currentLine.replace(/\s+$/, ''));
        }

        // 5. 處理單一字詞就超過寬度的情況（強制切開）
        var finalLines = [];
        for (var li = 0; li < lines.length; li++) {
            var line = lines[li];
            var lineWidth = this.textWidth(this.convertEscapeCharacters(line));

            if (lineWidth <= maxWidth) {
                finalLines.push(line);
                continue;
            }

            // 強制依字元切開
            var chars = line.split('');
            var temp = '';
            for (var c = 0; c < chars.length; c++) {
                var test = temp + chars[c];
                if (this.textWidth(this.convertEscapeCharacters(test)) > maxWidth && temp !== '') {
                    finalLines.push(temp);
                    temp = chars[c];
                } else {
                    temp = test;
                }
            }
            if (temp) finalLines.push(temp);
        }

        return finalLines.join('\n');
    };

    //=========================================================================
    // startMessage 整合翻譯 + 自動換行
    //=========================================================================

    var _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
        _Window_Message_startMessage.call(this);

        if (!window.$translationManager || !window.$translationManager._isInitialized) {
            return;
        }

        var originalText = this._textState.text;
        var translated = originalText;

        // 1. 先嘗試整段翻譯
        var fullTranslation = window.$translationManager.translate(originalText);
        if (fullTranslation !== originalText) {
            translated = fullTranslation;
        } else {
            // 2. 退回逐行翻譯
            var lines = originalText.split('\n');
            var translatedLines = [];
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.trim()) {
                    var t = window.$translationManager.translate(line);
                    translatedLines.push(t !== line ? t : line);
                } else {
                    translatedLines.push(line);
                }
            }
            translated = translatedLines.join('\n');
        }

        // 3. 自動換行（翻譯完成後執行）
        translated = this.autoWrapText(translated);

        this._textState.text = translated;
    };

    //=========================================================================
    // 靜態方法
    //=========================================================================

    TranslationManager.getStatus = function () {
        return window.$translationManager ? window.$translationManager.getStatus() : null;
    };

    TranslationManager.setLanguage = function (language) {
        return window.$translationManager ? window.$translationManager.setLanguage(language) : null;
    };

    TranslationManager.getCurrentLanguage = function () {
        return window.$translationManager ? window.$translationManager.getCurrentLanguage() : null;
    };

    TranslationManager.getAvailableLanguages = function () {
        return window.$translationManager ? window.$translationManager.getAvailableLanguages() : [];
    };

    TranslationManager.translateIfNeed = function (text, callback) {
        if (window.$translationManager && window.$translationManager._isInitialized) {
            var translatedText = window.$translationManager.translate(text);
            if (callback && typeof callback === 'function') callback(translatedText);
            return translatedText;
        }
        if (callback && typeof callback === 'function') callback(text);
        return text;
    };

    // 全域快捷翻譯方法（給其他插件使用）
    window.tr = function (text) {
        if (window.$translationManager && window.$translationManager._isInitialized) {
            return window.$translationManager.translate(text);
        }
        return text;
    };

    // 翻譯「顯示文字」的名稱欄位（說話者名字）
    var _Game_Message_setSpeakerName = Game_Message.prototype.setSpeakerName;
    Game_Message.prototype.setSpeakerName = function (speakerName) {
        if (window.$translationManager && window.$translationManager._isInitialized) {
            speakerName = window.$translationManager.translate(speakerName);
        }
        _Game_Message_setSpeakerName.call(this, speakerName);
    };

    // 翻譯「顯示選項」(Show Choices) 的選項文字
    var _Game_Message_setChoices = Game_Message.prototype.setChoices;
    Game_Message.prototype.setChoices = function (choices, defaultType, cancelType) {
        if (window.$translationManager && window.$translationManager._isInitialized && Array.isArray(choices)) {
            choices = choices.map(function (choice) {
                return window.$translationManager.translate(choice);
            });
        }
        _Game_Message_setChoices.call(this, choices, defaultType, cancelType);
    };

    // 讓角色名稱與暱稱即時走翻譯
    var _Game_Actor_name = Game_Actor.prototype.name;
    Game_Actor.prototype.name = function () {
        var name = _Game_Actor_name.call(this);
        return (window.$translationManager && window.$translationManager._isInitialized)
            ? window.$translationManager.translate(name)
            : name;
    };

    var _Game_Actor_nickname = Game_Actor.prototype.nickname;
    Game_Actor.prototype.nickname = function () {
        var nickname = _Game_Actor_nickname.call(this);
        return (window.$translationManager && window.$translationManager._isInitialized)
            ? window.$translationManager.translate(nickname)
            : nickname;
    };

    /**
     * 讓資料庫物件的某個屬性在讀取時自動走 translate()
     * 原文永遠保持不動
     */
    TranslationManager.prototype.makeTranslatable = function (obj, propName) {
        if (!obj || obj[propName] === undefined || obj[propName] === null) return;

        // 已經處理過就跳過
        if (obj['_original_' + propName] !== undefined) return;

        var originalValue = obj[propName];
        obj['_original_' + propName] = originalValue;

        Object.defineProperty(obj, propName, {
            get: function () {
                if (window.$translationManager && window.$translationManager._isInitialized) {
                    return window.$translationManager.translate(originalValue);
                }
                return originalValue;
            },
            set: function (value) {
                // 如果有其他插件想寫入，還是允許
                originalValue = value;
                this['_original_' + propName] = value;
            },
            configurable: true,
            enumerable: true
        });
    };

    TranslationManager.prototype.applyDatabaseTranslations = function () {
        var self = this;

        // 道具
        if ($dataItems) {
            $dataItems.forEach(function (item) {
                if (!item) return;
                self.makeTranslatable(item, 'name');
                self.makeTranslatable(item, 'description');
            });
        }

        // 武器
        if ($dataWeapons) {
            $dataWeapons.forEach(function (item) {
                if (!item) return;
                self.makeTranslatable(item, 'name');
                self.makeTranslatable(item, 'description');
            });
        }

        // 防具
        if ($dataArmors) {
            $dataArmors.forEach(function (item) {
                if (!item) return;
                self.makeTranslatable(item, 'name');
                self.makeTranslatable(item, 'description');
            });
        }

        // 技能
        if ($dataSkills) {
            $dataSkills.forEach(function (skill) {
                if (!skill) return;
                self.makeTranslatable(skill, 'name');
                self.makeTranslatable(skill, 'description');
                self.makeTranslatable(skill, 'message1');
                self.makeTranslatable(skill, 'message2');
            });
        }

        // 角色
        if ($dataActors) {
            $dataActors.forEach(function (actor) {
                if (!actor) return;
                self.makeTranslatable(actor, 'name');
                self.makeTranslatable(actor, 'nickname');
                self.makeTranslatable(actor, 'profile');
            });
        }

        // 敵人
        if ($dataEnemies) {
            $dataEnemies.forEach(function (enemy) {
                if (!enemy) return;
                self.makeTranslatable(enemy, 'name');
            });
        }

        // 狀態
        if ($dataStates) {
            $dataStates.forEach(function (state) {
                if (!state) return;
                self.makeTranslatable(state, 'name');
                self.makeTranslatable(state, 'message1');
                self.makeTranslatable(state, 'message2');
                self.makeTranslatable(state, 'message3');
                self.makeTranslatable(state, 'message4');
            });
        }

        // 職業（可選）
        if ($dataClasses) {
            $dataClasses.forEach(function (cls) {
                if (!cls) return;
                self.makeTranslatable(cls, 'name');
            });
        }

        // 技能類型（戰鬥中「技能」指令的名稱來源）
        if ($dataSystem && $dataSystem.skillTypes) {
            $dataSystem.skillTypes.forEach(function (name, index) {
                if (!name) return;
                // skillTypes 是純字串陣列，要用不一樣的方式處理
                var original = name;
                Object.defineProperty($dataSystem.skillTypes, index, {
                    get: function () {
                        if (window.$translationManager && window.$translationManager._isInitialized) {
                            return window.$translationManager.translate(original);
                        }
                        return original;
                    },
                    set: function (value) {
                        original = value;
                    },
                    configurable: true,
                    enumerable: true
                });
            });
        }

        console.log('【資料庫翻譯】已套用 name/description 即時翻譯');
    };

    // 立即初始化
    var initTranslationManager = function () {
        if (window.$translationManager && !$translationManager._isInitialized) {
            if ($dataSystem) {
                $translationManager.initialize();
            } else {
                var _DataManager_onLoad2 = DataManager.onLoad;
                DataManager.onLoad = function (object) {
                    _DataManager_onLoad2.call(this, object);
                    if (object === $dataSystem) {
                        $translationManager.initialize();
                    }
                };
            }
        }
    };
    initTranslationManager();

})();
