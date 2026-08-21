# 大阪｜旅行手帳

2026/09/06–09/16 的 11 日關西旅行 PWA。介面以手機使用為優先，提供行程、票券、記帳、日誌與出發清單。

## 本機啟動

```powershell
npm install
npm run dev
```

`npm run dev` 使用 Vercel CLI，需要先登入。僅預覽 UI 時可用：

```powershell
python -m http.server 4173
```

靜態預覽沒有 `api/state`，資料會保留在瀏覽器本機；部署到 Vercel 且設好 `DATABASE_URL` 後，完成狀態、記帳、日誌與待辦會同步到 Neon。

## 檢查

```powershell
npm run check
```

完整資料結構、PWA 快取與部署注意事項請見 [HANDOFF.md](HANDOFF.md)。
