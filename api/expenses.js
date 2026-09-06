const { neon } = require("@neondatabase/serverless");
const { ensureExpenseStore, listExpenses, createExpense, updateExpense, deleteExpense } = require("./expense-store");

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  return JSON.parse(body);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!process.env.DATABASE_URL) return res.status(503).json({ error:"DATABASE_URL is not configured" });
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!["GET", "POST", "PUT", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST, PUT, DELETE, OPTIONS");
    return res.status(405).json({ error:"Method not allowed" });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await ensureExpenseStore(sql);
    if (req.method === "GET") return res.status(200).json({ expenses:await listExpenses(sql) });

    const payload = parseBody(req.body);
    if (req.method === "POST") {
      const expense = await createExpense(sql, payload.expense);
      if (!expense) return res.status(400).json({ error:"無效的記帳資料" });
      return res.status(201).json({ expense });
    }
    if (req.method === "PUT") {
      const expense = await updateExpense(sql, payload.expense);
      if (!expense) return res.status(404).json({ error:"找不到要更新的支出" });
      return res.status(200).json({ expense });
    }
    const deleted = await deleteExpense(sql, payload.id);
    if (!deleted) return res.status(404).json({ error:"找不到要刪除的支出" });
    return res.status(200).json({ deleted:true });
  } catch (error) {
    return res.status(500).json({ error:"資料庫請求失敗", detail:error.message });
  }
};
