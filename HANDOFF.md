# 大阪｜旅行手帳交接文件

更新日期：2026-08-22
目前分支：`main`

## 專案目的

這是 2026/09/06–09/16 的 11 日關西旅行 PWA。專案名稱為「大阪｜旅行手帳」，手機優先，採溫暖旅行手帳風格：日期卡、天氣與倒數卡、時間軸、固定底部導航。

行程來源為使用者提供的 PDF `69f7ee592728934d2136aabc.pdf`。行程資料已整理在 `app.js` 的 `tripDays`，包含京都、若狹、小濱、宮津與大阪各日的景點、住宿、票券與提醒。

## 技術與檔案

專案維持無框架的靜態前端：

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 手機版殼層、頂端旅行資訊與六項底部導航。 |
| `styles.css` | 奶油色手帳視覺、日期列、天氣／倒數卡、清單與表單。 |
| `app.js` | 頁面 render 與互動狀態；行程、預訂、成員與準備項目由 API 載入。 |
| `rain-plans.js` | 11 天逐日雨天備案、切換條件、替代站點與官方查核連結；瀏覽器與 seed 共用。 |
| `api/state.js` | Vercel + Neon 的共用狀態 API，固定資料列 ID 為 `osaka-2026`。 |
| `api/seed-data.js` | 現有行程、預訂、成員與四類準備清單的唯一 seed 來源。 |
| `scripts/seed-db.js` | 使用 `npm run db:seed` 將 seed 補進 Neon，不覆蓋既有旅伴／使用者資料。 |
| `sw.js` | `osaka-travel-v39` 的離線 App Shell。 |
| `manifest.webmanifest` | PWA 名稱、色彩與圖示設定。 |

## 功能

- 行程：11 天橫向日期選擇、景點時間軸、完成標記與 Google Maps 導航。
- 雨天備案：每天各有一張可展開的藍色備案便條，包含啟用條件、順路的替代時間軸、Google Maps 導航與官方資訊；旅行日降雨機率達 50% 時自動展開。資料由 `rain-plans.js` 同時提供前端離線 fallback 與 `api/seed-data.js`，GET API 會按 day 補進既有資料列，不覆蓋其他共用狀態。
- 天氣：依每日行程座標串接 Open-Meteo 16 日預報，顯示天氣狀況、最高／最低溫、降雨機率、最大風速與日出；資料快取於本機，離線時沿用上次成功資料。
- 票券：航班、住宿、遊船與 USJ 的集中清單。
- 記帳：新增／刪除日圓支出，顯示合計。
- 準備：待辦、行李、想去、採買四組共用清單，可依旅伴篩選並逐人標記完成。
- 工具：常用日語即時朗讀（可新增／編輯／刪除並同步給所有旅伴）、JPY／TWD 雙向換算，以及日本警察、消防／救護車和 JNTO 旅客熱線資訊。

工具頁偏好與匯率快取使用獨立的 `osaka-tool-state-v1` localStorage，不會同步至共用資料庫；常用短語則放在共用狀態的 `japanesePhrases`，可由工具頁 CRUD，並透過 `/api/state` 同步給所有旅伴。新增或編輯短語時只需輸入中文與分類，`/api/translate-phrase` 會自動產生日文與羅馬拼音；日語朗讀使用產生出的日文搭配裝置的 Web Speech API，不儲存或下載語音檔。匯率由 Frankfurter `GET /v2/rate/JPY/TWD` 每 12 小時更新一次；離線時沿用最後成功值，也可手動覆寫。天氣使用獨立的 `osaka-weather-state-v1` localStorage，每 6 小時更新一次。

行程內容、預訂、成員與準備清單由 `trip_state` 的 JSONB 狀態提供；互動狀態會先寫入 `localStorage`，再以 700ms debounce 同步至 `./api/state`。若資料列缺少新欄位，GET API 會自動用 `api/seed-data.js` 補齊而不覆蓋既有內容。部署時需在 Vercel 設定 `DATABASE_URL`。

## 執行與驗證

```powershell
npm install
npm run check
npm run db:seed
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
- 在 390 × 844 的行動版驗證首頁、票券、準備、成員、工具導覽與無水平溢位。
- 已驗證日語分類與朗讀狀態、常用短語新增／編輯／刪除與共用 payload、JPY／TWD 線上及自訂匯率雙向換算、緊急電話連結；Chrome 手機尺寸 Console 無本專案錯誤。
- 唯一 console error 來自瀏覽器擴充套件 `chrome-extension://mfidniedemcgceagapgdekdbmanojomk/`，不是本專案。

## 已知限制

- Open-Meteo 預報最多提供未來 16 天；太早的行程日期會顯示尚無預報，接近出發日後會自動更新。
- 雨天備案的營業時間依 2026-08-22 查到的官方資訊規劃；臨時休館、天候停駛與 USJ 設施狀態仍須在出發當日點卡片內官方連結確認。
- 共用狀態採整份 JSON 最後寫入覆蓋；多人同時編輯仍可能互相覆蓋。
- 沒有登入或權限保護；公開網址的任何使用者都能讀寫共用資料。
- 新增或修改自訂短語需要連線到翻譯服務；若翻譯服務不可用，表單會保留不儲存，不會覆蓋既有短語。
