# 大阪｜旅行手帳

2026/09/06–09/16 的 11 日關西旅行 PWA。介面以手機使用為優先，提供行程、票券、記帳與出發清單。

## 本機啟動

```powershell
npm install
npm run dev
```

`npm run dev` 使用 Vercel CLI，需要先登入。僅預覽 UI 時可用：

```powershell
python -m http.server 4173
```

部署到 Vercel 且設好 `DATABASE_URL` 後，行程、預訂、成員與準備清單會從 Neon 載入，完成狀態與記帳也會同步回 Neon。首次匯入或補齊既有資料可執行：

```powershell
npm run db:seed
```

`db:seed` 只補入缺少的頂層資料，會保留現有旅伴資料與使用者狀態。

## 檢查

```powershell
npm run check
```

完整資料結構、PWA 快取與部署注意事項請見 [HANDOFF.md](HANDOFF.md)。
