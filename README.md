# 富可敵國

## 遊戲大綱
TBD

## 設計理念
TBD

## AI 工具使用披露
本遊戲有使用 AI 工具生成人物立繪、標題、部分程式碼修改

詳細使用方式披露在 [AI_Content_Announcement](./docs/AI_Content_Announcement.md)

## 素材參考

- https://forums.rpgmakerweb.com/threads/hiddenones-resource-warehouse.39752/
- https://forums.rpgmakerweb.com/threads/whtdragons-animals-and-running-horses-now-with-more-dragons.53552/
- https://www.hiddenone-sprites.com/wildlife-series.html

## 其他

- "code"\s*:\s*117[\s\S]*?"parameters"\s*:\s*\[\s*19\s*\] 可以檢查所有的探索互動要素
- BattleTester.repeat(50, { troopId: 12, actorId: 9, level: 8 }) 開啟戰鬥測試用插件就能用這段程式碼快速測試
- "code"\s*:\s*117[\s\S]{0,100}?"parameters"\s*:\s*\[\s*10\b 可以查詢所有用到 通用事件_id = 10 的地方
- steam 成就可能用到的 plugin: https://rabbitteaparty.itch.io/nekogakuen-steamworksplus