# 關西旅遊小工具

PDF 行程已整理成手機優先的靜態 Web App。

## 使用方式

直接開啟 `index.html`，或在此資料夾啟動本機伺服器：

```powershell
python -m http.server 4173
```

瀏覽 `http://localhost:4173`。

## 功能

- 每日行程卡片，依景點、餐廳/市場、交通、住宿、活動、購物分類。
- 每個地點自動產生 Google Maps 導航按鈕。
- 每日目的地即時天氣，使用 Open-Meteo 公開 API。
- 導遊筆記標示必吃美食、必點菜單、必買伴手禮、重要預約代號。
- 工具頁包含行前檢查清單、航班資訊、住宿資訊、緊急電話、記帳/預算表。
- 每日卡片補上今日重點、自駕停車、雨天備案與用餐提醒。
- 工具頁新增可編輯的預約代號表與可勾選的伴手禮採買清單。
- 記帳表支援分類、付款人、刪除與各人小計，適合多人共用旅費紀錄。
- 今日模式會在旅程期間自動定位當天行程；旅程前會定位到下一個行程日。
- PWA 支援基本離線快取，離線時仍可閱讀行程與工具資料。
- 部署到 Vercel 並設定 Neon `DATABASE_URL` 後，檢查清單、預約代號、記帳與採買清單會共用同步。

## Neon / Vercel

1. 在 Neon 建立 Postgres database。
2. 到 Vercel 專案 `Settings → Environment Variables` 新增：

```txt
DATABASE_URL=postgresql://...
```

3. 部署到 Vercel。API 會自動建立 `trip_state` table，也可手動執行 `db/schema.sql`。
4. 若要使用 `trip.haoping.tw`，請把 Cloudflare DNS 的 `trip` CNAME 指向 Vercel 提供的 target，而不是 GitHub Pages。
