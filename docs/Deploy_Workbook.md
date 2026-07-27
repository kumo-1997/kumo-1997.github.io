# RMMZ 部署 SOP（Web / Steam）

### 專案確認

* □ 所有事件測試完成
* □ Debug 功能已移除或關閉
* □ Console 無錯誤訊息
* □ Plugin 順序確認完成

### Phileas_FileManager (圖片、音樂等檔案有變動就會需要重新執行一次遊戲)

* □ `updateStamp = true` 時執行一次遊戲
* □ 確認 `data/FilesStamp.json` 已更新
* □ 將 `updateStamp` 改為 `false`

### Deployment

* □ 執行 RPG Maker MZ Deployment
* □ Exclude Unused Files（依需求）
* □ 加密圖片／音樂（依需求）

### 部署檢查

* □ `data/FilesStamp.json` 已包含於部署版本
* □ 所有 Plugin (`js/plugins/`) 已更新
* □ `plugins.js` 為最新版本
* □ 所有自訂資源（圖片、音效、影片、字型）皆已包含
* □ JSON 資料已更新

### Web 版測試

* □ 新遊戲正常
* □ 存檔／讀檔正常
* □ Plugin 功能正常
* □ Console 無 Error / 404
* □ 所有圖片、音效正常載入
* □ 匯出／下載功能（若有）正常

### Steam 版測試

* □ 新遊戲正常
* □ 舊存檔可正常讀取（若需相容）
* □ 全螢幕／視窗正常
* □ 存檔正常
* □ 無 Node.js 相關錯誤

### 發布

* □ Git Tag（可選）
* □ 備份發布版本
* □ 上傳 Steam / Web
* □ 發布後再次實機測試

---

## Deploy 時候要忽略的檔案夾
### Web
Worldview,AllContext.md,CompressedContext.md,TODO,GIMP,img_tmp,README,local_utils,NamingConvention,save_bk

### Windows/Mac
.md
GIMP,img_tmp,local_utils,save_bk