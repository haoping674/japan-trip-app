# 關西旅遊小工具交接文件

更新日期：2026-08-09  
目前分支：`main`  
最新已推送 commit：`56c4798 feat(companion): simplify travel controls`

> **交接當下工作區有未提交變更，請先保留。** `app.js`、`index.html`、`styles.css`、`sw.js` 正在將 Today Mode 的展開內容再度精簡，並將記帳改為工具頁快速輸入＋高密度帳本詳情；靜態資源版本與 Service Worker 已升到 **v22**；本 `HANDOFF.md` 的交接更新也尚未提交。詳情見「目前未提交工作」。

## 專案目的

這是部署在 `trip.haoping.tw` 的手機優先 PWA，用於 2026 年 9 月關西自駕／城市旅行。主要功能：

- 11 天原始行程與完整雨天備案切換。
- 各日即時天氣、景點導航、路線、交通與預算提醒。
- 導遊頁面，提供區域故事、吃喝、伴手禮、預約與分日建議。
- 工具頁面：航班、住宿、重要預約、緊急資訊、購物清單、共用記帳。
- 透過 Vercel API + Neon Postgres 同步多人共用資料。
- PWA 離線 App Shell 快取與 iOS standalone 使用。

## 技術與檔案位置

專案刻意保持無框架，沒有 React / TypeScript / build step。

| 檔案 | 用途 |
| --- | --- |
| `index.html` | App 結構、分頁、PWA meta；Today 浮窗根節點在 `main` 之外。 |
| `styles.css` | 全部視覺與響應式樣式，含 iPhone 安全區、底部 Today 浮窗、左側雨天快捷鈕、導遊 sheet、記帳元件。 |
| `app.js` | 行程資料、導遊資料、Today Mode render / 完成進度、前端狀態、Neon 同步、Open-Meteo 天氣。 |
| `api/state.js` | Vercel Node Serverless Function；讀寫 Neon 的共用 JSON state。 |
| `db/schema.sql` | `trip_state` 表的初始 schema。 |
| `sw.js` | Service Worker；離線快取靜態 App Shell，刻意略過 `/api/*`。 |
| `manifest.webmanifest`、`icons/` | PWA 安裝資訊及圖示。 |
| `package.json` | `npm run dev`（`vercel dev`）、`npm run check`。 |

> `README.md` 目前有文字編碼損壞，不建議以它作為開發依據；本文件是目前正確的交接來源。

## 本機啟動與驗證

```powershell
npm install
npm run check
npm run dev
```

`npm run dev` 可同時使用 Vercel API，適合驗證共用狀態。純 UI 快速預覽可用：

```powershell
python -m http.server 4173
```

但靜態伺服器沒有 `/api/state`，工具頁會出現 API 404；這是預期行為，不代表正式站有問題。

UI 瀏覽器驗證優先使用 Chrome。至少檢查：

1. 行程、導遊、工具三個分頁皆可切換。
2. 雨傘圖示可切換 11 天雨天行程，再切回原始行程。
3. 捲到行程中段切換雨天版，頁面不得跳回頂端。
4. 新增、編輯、刪除記帳項目後，重新整理仍存在。
5. 手機尺寸下瀏海／動態島不遮住頂端分頁。

## 行程與內容資料

`app.js` 前段是內容唯一來源：

- `tripDays`：正式 11 日行程。
- `rainTripDays`：同日期的完整雨天替代行程。
- `rainDayBriefs`：各日切換邏輯說明。
- `dayPlans`：交通、每日預算、住宿設施、餐食、超支提醒。
- `dayGuideContent` / 導遊相關資料：區域故事、必吃、必買、預約提醒。
- `budgetPeople`：`煥、英、嘉、銘、評、青`。
- `budgetCategories`：記帳類別與 Lucide 圖示。

所有景點名稱都會被用於 Google Maps 導航 URL。新增或修正行程時，請優先使用 Google Maps 能辨識的正式中文、日文或英文地點名稱。

雨天切換由 `itineraryMode` 控制，值寫入 `localStorage` 的 `kansai-itinerary-mode`。按鈕僅顯示 icon，但有 `title` 與 `aria-label`；切換後只 rerender 行程，不應呼叫 `scrollTo`。

### Today Mode

- `renderTodayMode()` 會從既有 `displayedTripDays()`、`dayPlans`、`travelEstimates`、天氣快取與 `tripState.completedStops` 組出目前階段、下一站與時間線；不要另建重複資料來源。
- Today 浮窗固定在畫面下方，預設收合，只顯示 Now / Next、時間、天氣與完成數。點擊後展開；完整內容在浮窗內捲動，`todayModeExpanded` 只保留在前端記憶體。
- 展開時，若目標是尚未到來的行程日（`target.mode === "upcoming"`），不顯示重複的 Current Activity；實際旅行日仍會顯示 Current Activity、Next Stop、導航與時間線。
- 手機版 Next Stop 的「預計出發／下一段移動」維持雙欄。桌面若只有 Next Stop，`.today-next:only-child` 必須跨滿 Today summary 的兩欄。
- 雨天切換鈕 `#itinerary-mode-toggle` 是左側垂直置中的 fixed 側欄快捷鈕；在窄螢幕仍要保留安全邊距與至少 46px 點擊區。
- 現場導覽、單站攻略與路段導覽已移除；導遊 sheet 僅用於開啟區域筆記。

## 共用資料與 Neon

### 資料流

前端以 `fetch("./api/state")` 取得和儲存資料：

```text
Browser local state
  -> PUT /api/state
  -> Vercel Function (api/state.js)
  -> Neon Postgres trip_state.data (JSONB)
```

API 固定使用 `TRIP_ID = "kansai-2026"`，因此所有造訪正式網址的人都共用同一份狀態。資料欄位為：

```js
{
  checklist: {},
  reservations: [{ item, date, detail, code }],
  budget: [{ id, person, category, item, amount, memo }],
  shopping: {}
}
```

前端會先用 localStorage 當離線／載入前 fallback，再向 API 拉取遠端資料。更新時會整份 state PUT 回伺服器，並有短暫 debounce。

### 必要環境變數

在 Vercel 專案的 Production、Preview、Development 都設定：

```text
DATABASE_URL=postgresql://...
```

不需要手動跑 migration：`api/state.js` 的 `ensureTable` 會建立 `trip_state`。`db/schema.sql` 僅供需要手動建立時使用。`.env*` 已被 git 忽略，絕不可提交資料庫連線字串。

### 重要限制

- 沒有登入或權限控制。知道網址的人都能讀寫共用資料；若要公開網址，下一步應加入簡單 PIN、Vercel Protection，或改為具使用者身份的資料模型。
- 目前為「最後一次寫入覆蓋整份 JSON」；多人同時更動不同欄位仍可能互相覆蓋。若共用頻率提高，應改為 checklist、reservation、budget、shopping 各自的資料表與 patch API。
- API 請求的 `Cache-Control` 是 `no-store`，Service Worker 也不快取 `/api/*`，避免共用資料被離線快取覆蓋。

## 部署、網址與 PWA

GitHub remote：`https://github.com/haoping674/japan-trip-app.git`。`main` 已連接 Vercel；推送 `main` 會觸發正式部署。

預期網域架構：

```text
trip.haoping.tw
  -> Cloudflare DNS CNAME
  -> Vercel 專案網域設定
  -> Vercel deployment
```

在 Vercel 先加入 `trip.haoping.tw`，再依 Vercel 顯示的 target 在 Cloudflare 建立 `trip` CNAME。若 Cloudflare 啟用 Proxy，先以 DNS only 完成 Vercel 驗證；之後是否開 Proxy 應依 Vercel 的 DNS 建議決定。

每次改動 `index.html`、`styles.css`、`app.js`、manifest、icon 或 Service Worker 時，請把 `sw.js` 中的 `CACHE_NAME` 版本遞增（例如 `kansai-trip-v9`）。否則已安裝 PWA 可能繼續使用舊的靜態檔案。交接當下未提交版本是 `kansai-trip-v22`，`index.html` 的 `styles.css?v=22` 與 `app.js?v=22` 必須和它一致。

Service Worker 有更新時，前端的更新提示會通知使用者；不要把 `/api/*` 放進 App Shell 或 runtime cache。

## 外部服務

- **Open-Meteo**：`app.js` 以各日 `weather.lat/lon` 取得目前天氣與當日小時預報；失敗時 UI 顯示「天氣暫不可用」。不需要 API key。
- **Google Maps**：以網址開啟導航，不需要 Maps API key。
- **Lucide**：圖示透過前端載入並在動態 render 後呼叫 `window.lucide.createIcons()`。

## 目前未提交工作

這些變更已完成檢查，但**尚未 commit 或 push**；下一個 session 若要提交，應和下列檔案一起檢查：

- `app.js`：Today 展開區改為精簡狀態列；預覽日略過重複的 Current Activity，移除現場導覽，並將記帳改為工具頁快速輸入與高密度詳情帳本。
- `styles.css`：縮小 Today 展開資訊的間距與字級，Next Stop 在手機維持雙欄；記帳的金額輸入放大，詳情改為資料庫式緊湊欄位。
- `index.html`、`sw.js`：資源 query 與 cache name 已由 v17 更新到 v22。
- `HANDOFF.md`：記錄本次交接狀態、已推送版本與未提交的 UI 調整。
- 已執行 `npm run check` 與 `git diff --check`，均通過。
- Chrome 已檢查桌面與 390×844 手機：展開卡片在視窗內、沒有水平 overflow、內部可捲動；本站資源沒有 console error。唯一 error 來自 `chrome-extension://mfidniedemcgceagapgdekdbmanojomk/content.js`，不是 App 程式碼。

## 最近完成的工作

- `fad2e6e`：Today Mode 改為下方可展開 Travel Companion 浮窗，並將雨天切換改為左側固定快捷鈕；已推送至 `main`（快取 v17）。
- `6691bad`：加入個人導遊與站點導覽內容，Today Mode 可直接開啟。
- `eb07ba1`：加入可依行程、時間、完成景點推進的 Today Mode 與 PWA 更新提示。
- `c200bd9`：雨天備案切換改為純圖標，保留 tooltip / `aria-label`；取消切換時回到頁面頂端的行為。
- `631315b`：新增 11 日完整雨天備案與右側行程切換鈕。
- `88fbcb4` / `69954bc`：以最新 PDF 內容更新行程、細節與移動資訊。
- `1dbf48c`：記帳可選付款人、類別圖示，並可刪除項目。
- `8093a5e`：加入 Neon 共用資料 API。
- `8a32c7e`：導遊底部彈出詳細內容。

## 建議下一步

1. 加入共用資料的存取保護，至少避免陌生人直接修改記帳與預約。
2. 將整份 JSON 覆寫改為細粒度資料表／API，解決多人同時編輯衝突。
3. 在正式網域以 iPhone 實機測試「加入主畫面」、離線重開、動態島安全區與 Service Worker 更新。
4. 出發前逐一用官方來源確認航班、住宿地址、USJ／遊船／展望台預約號碼與營業狀態，然後更新 `app.js` 和共用 reservations。
5. 修復或重寫 `README.md` 的文字編碼；若要改檔，採 UTF-8（無 BOM）並用繁體中文完整重建。

## 開發習慣與注意事項

- 原始碼應保持 UTF-8；PowerShell 預設輸出有時會顯示亂碼，不代表檔案內容一定損壞。用 Chrome 或設定 UTF-8 的編輯器確認文字。
- 避免無關的格式化與大範圍重構；行程資料量大，變更前先定位對應 day number。
- 開始工作前先看 `git status --short`：目前可能存在尚未提交的 Today UI 修改，未經確認不要 `reset`、`checkout` 或覆蓋它們。
- 動態更新 DOM 後，如出現空白圖示，確認是否補上 `window.lucide.createIcons()`。
- 日後若擴充 PWA，不能把 `/api/*` 加進 Service Worker 靜態快取。
