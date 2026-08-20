# 大阪第二版交接文件

更新日期：2026-08-20
目前分支：`main`

## 專案目的

這是 2026/09/06–09/16 的 11 日關西旅行 PWA。新版以「大阪第二版」為名稱，手機優先，採溫暖旅行手帳風格：日期卡、天氣與倒數卡、時間軸、固定底部導航。

行程來源為使用者提供的 PDF `69f7ee592728934d2136aabc.pdf`。行程資料已整理在 `app.js` 的 `tripDays`，包含京都、若狹、小濱、宮津與大阪各日的景點、住宿、票券與提醒。

## 技術與檔案

專案維持無框架的靜態前端：

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 手機版殼層、頂端旅行資訊與五項底部導航。 |
| `styles.css` | 奶油色手帳視覺、日期列、天氣／倒數卡、清單與表單。 |
| `app.js` | 11 日行程、票券資料、頁面 render 與互動狀態。 |
| `api/state.js` | Vercel + Neon 的共用狀態 API，固定資料列 ID 為 `osaka-2026`。 |
| `sw.js` | `osaka-travel-v7` 的離線 App Shell。 |
| `manifest.webmanifest` | PWA 名稱、色彩與圖示設定。 |

## 功能

- 行程：11 天橫向日期選擇、景點時間軸、完成標記與 Google Maps 導航。
- 票券：航班、住宿、遊船與 USJ 的集中清單。
- 記帳：新增／刪除日圓支出，顯示合計。
- 日誌：新增／刪除短篇旅行紀錄。
- 準備：出發、行李、行程三組共用待辦。

行程完成、待辦、記帳與日誌會先寫入 `localStorage`，再以 700ms debounce 同步至 `./api/state`。若本機預覽沒有 API，功能會保持本機可用；部署時需在 Vercel 設定 `DATABASE_URL`。

## 執行與驗證

```powershell
npm install
npm run check
npm run dev
```

`npm run dev` 需要 Vercel 登入。沒有登入時可用：

```powershell
python -m http.server 4173
```

靜態伺服器不提供 `/api/state`，這時共用同步會靜默退回本機資料。

每次修改 `index.html`、`styles.css`、`app.js`、manifest 或圖示時，都要同步更新 `sw.js` 的 `CACHE_NAME` 與資源版本 query，避免已安裝的 PWA 顯示舊版。

## 已驗證

- `npm run check` 與 `git diff --check` 已通過。
- 在 390 × 844 的 Chromium 行動版驗證首頁版面、日期切換、第 7 天道頓堀資料、票券、準備清單及新增／刪除記帳。
- 唯一 console error 來自瀏覽器擴充套件 `chrome-extension://mfidniedemcgceagapgdekdbmanojomk/`，不是本專案。

## 已知限制

- 天氣卡目前是行前視覺資訊，提示在出發前 7 天確認即時預報，沒有串接天氣 API。
- 共用狀態採整份 JSON 最後寫入覆蓋；多人同時編輯仍可能互相覆蓋。
- 沒有登入或權限保護；公開網址的任何使用者都能讀寫共用資料。
