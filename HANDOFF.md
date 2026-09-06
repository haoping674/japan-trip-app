# 大阪｜旅行手帳交接文件

更新日期：2026-08-31
目前分支：`main`

## 專案目的

這是 2026/09/06–09/16 的 11 日關西旅行 PWA。專案名稱為「大阪｜旅行手帳」，手機優先，採溫暖旅行手帳風格：日期卡、天氣與倒數卡、時間軸、固定底部導航。

行程來源為使用者提供的 Funliday PDF `69f7ee592728934d2136aabc.pdf`。2026-09-04 已逐頁同步 PDF 的 67 個行程停靠點、時間與原有備註至 `api/seed-data.js` 的 `tripDays`，包含京都、若狹、小濱、宮津、奈良與大阪各日的景點及住宿。

## 技術與檔案

專案維持無框架的靜態前端：

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 手機版殼層、頂端旅行資訊與六項底部導航。 |
| `styles.css` | 奶油色手帳視覺、日期列、天氣／倒數卡、清單與表單。 |
| `app.js` | 頁面 render 與互動狀態；行程、預訂、成員與準備項目由 API 載入。 |
| `rain-plans.js` | 11 天逐日雨天備案、切換條件、替代站點與官方查核連結；瀏覽器與 seed 共用。 |
| `api/state.js` | Vercel + Neon 的共用狀態 API，固定資料列 ID 為 `osaka-2026`。 |
| `api/expenses.js` | 記帳專用的逐筆新增／修改／刪除 API；不會覆寫整份共用狀態。 |
| `api/expense-store.js` | 記帳資料表、既有 JSONB 記帳資料的一次性遷移與資料庫存取共用邏輯。 |
| `api/seed-data.js` | 現有行程、預訂、成員與四類準備清單的唯一 seed 來源。 |
| `scripts/seed-db.js` | 使用 `npm run db:seed` 將 seed 補進 Neon，不覆蓋既有旅伴／使用者資料。 |
| `scripts/update-trip-itinerary.js` | 使用 `npm run db:update-itinerary` 將 seed 中的行程欄位精確覆寫到 Neon，保留既有預訂、旅伴、待辦與其他共用資料。 |
| `sw.js` | `osaka-travel-v65` 的離線 App Shell。 |
| `manifest.webmanifest` | PWA 名稱、色彩與圖示設定。 |

## 功能

- 行程：11 天橫向日期選擇、景點時間軸、完成標記與 Google Maps 導航。
- 雨天備案：每天各有一張可展開的藍色備案便條，包含啟用條件、順路的替代時間軸、Google Maps 導航與官方資訊；旅行日降雨機率達 50% 時自動展開。資料由 `rain-plans.js` 同時提供前端離線 fallback 與 `api/seed-data.js`，GET API 會按 day 補進既有資料列，不覆蓋其他共用狀態。
- 天氣：依每日行程座標串接 Open-Meteo 16 日預報，顯示天氣狀況、最高／最低溫、降雨機率、最大風速與日出；資料快取於本機，離線時沿用上次成功資料。
- 票券：航班、住宿、遊船與 USJ 的集中清單。
- 預訂／憑證：可將既有 QR code 圖片放進「憑證」分頁，以使用者設定的密碼在瀏覽器端使用 PBKDF2 + AES-256-GCM 加密後同步；密碼不會保存或上傳。解鎖後點 QR 圖片可全螢幕顯示；點背景、關閉鈕或 Esc 可返回。可輸入舊密碼後改設新密碼，系統會重新加密所有 QR。憑證匣在切換 App、離開憑證分頁或閒置 5 分鐘後鎖上。忘記密碼無法復原加密內容。
- 記帳：每筆支出會個別新增、修改或刪除於 Neon 的 `trip_expenses` 表；按「記下並儲存到資料庫」會立刻同步並顯示儲存中、已儲存或失敗提示。網路失敗的操作只保留在該裝置待同步清單，使用者可按「立即儲存」重試，不會靜默覆寫其他旅伴的帳目。
- 準備：待辦、行李、想去、採買四組共用清單，可依旅伴篩選並逐人標記完成。
- 工具：常用日語即時朗讀（可新增／編輯／刪除並同步給所有旅伴）、JPY／TWD 雙向換算，以及日本警察、消防／救護車和 JNTO 旅客熱線資訊。

工具頁偏好與匯率快取使用獨立的 `osaka-tool-state-v1` localStorage，不會同步至共用資料庫；常用短語則放在共用狀態的 `japanesePhrases`，可由工具頁 CRUD，並透過 `/api/state` 同步給所有旅伴。新增或編輯短語時只需輸入中文與分類，`/api/translate-phrase` 會依序嘗試 Google Translate、Google Translate fallback 與 MyMemory，若翻譯備援未附羅馬拼音，會再以 Yomitan 取得讀音並交給 Romaji2Kana 轉寫；成功後自動產生日文與羅馬拼音。日語朗讀使用產生出的日文搭配裝置的 Web Speech API，不儲存或下載語音檔。匯率由 Frankfurter `GET /v2/rate/JPY/TWD` 每 12 小時更新一次；離線時沿用上次成功值，也可手動覆寫。天氣使用獨立的 `osaka-weather-state-v1` localStorage，每 6 小時更新一次。

行程內容、預訂、成員與準備清單由 `trip_state` 的 JSONB 狀態提供；互動狀態會先寫入 `localStorage`，再以 700ms debounce 同步至 `./api/state`。記帳資料已從整份 JSONB 狀態分離到 `trip_expenses`，`/api/state` 會在首次新版請求時一次性遷移既有 `expenses`，之後忽略舊版客戶端送來的整份 `expenses`，避免舊畫面覆寫新帳目。若資料列缺少新欄位，GET API 會自動用 `api/seed-data.js` 補齊而不覆蓋既有內容。若 `itineraryRevision` 落後最新 Funliday 來源，GET API 只會更新 `tripDays` 與其版本，保留所有旅伴的其他共用資料。PWA 靜態 App Shell 與同源 `/api/*` GET 採快取優先；但 `/api/state` 與 `/api/expenses` 一律走網路，失敗時 App 會保留本機資料，避免讀取快取的舊帳務。憑證匣的 `./api/state?vault=1` 讀取例外採網路優先、離線才使用快取，以便跨裝置快速取回最新加密憑證。部署時需在 Vercel 設定 `DATABASE_URL`。

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

每次修改 `index.html`、`styles.css`、`app.js`、manifest、圖示或會影響快取資料的 API 行為時，都要同步更新 `sw.js` 的 `CACHE_NAME` 與資源版本 query，避免已安裝的 PWA 顯示舊版。目前為 `osaka-travel-v65`。

`app.js` 的 `knownPlaceLocations` 會覆寫模糊地名的文字搜尋；已固定 Day 5 的京丹波 PA 停車場、Day 3 的 Sotomo Cruise 乘船處，以及 Day 7 的 Wonder Cruise 日本橋船著場，避免 Google Maps 導向相近但錯誤的地點。

## 部署流程

使用者指定所有後續 production 部署都要走 GitHub：完成檢查後先建立 commit 並 `git push`，再由 Vercel 的 Git 整合自動部署。除非使用者明確要求，請勿直接執行 `vercel --prod` 或其他本機直推 production 的指令。

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
- 新增或修改自訂短語需要連線到翻譯服務；若三個翻譯上游都不可用，表單會保留不儲存，不會覆蓋既有短語。
