const { neon } = require("@neondatabase/serverless");

const TRIP_ID = "osaka-2026";

const DEFAULT_STATE = { day: 1, done: {}, tasks: {}, expenses: [], journal: [] };

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  return JSON.parse(body);
}

async function ensureTable(sql) {
  await sql`
    create table if not exists trip_state (
      id text primary key,
      data jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ error: "DATABASE_URL is not configured" });
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!["GET", "PUT"].includes(req.method)) {
    res.setHeader("Allow", "GET, PUT, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await ensureTable(sql);

    if (req.method === "GET") {
      await sql`
        insert into trip_state (id, data)
        values (${TRIP_ID}, ${JSON.stringify(DEFAULT_STATE)}::jsonb)
        on conflict (id) do nothing
      `;
      const rows = await sql`select data, updated_at from trip_state where id = ${TRIP_ID}`;
      return res.status(200).json({ data: rows[0].data, updatedAt: rows[0].updated_at });
    }

    const payload = parseBody(req.body);
    if (!payload || typeof payload.data !== "object" || Array.isArray(payload.data)) {
      return res.status(400).json({ error: "Expected JSON body with object field: data" });
    }

    const rows = await sql`
      insert into trip_state (id, data, updated_at)
      values (${TRIP_ID}, ${JSON.stringify(payload.data)}::jsonb, now())
      on conflict (id)
      do update set data = trip_state.data || excluded.data, updated_at = now()
      returning data, updated_at
    `;

    return res.status(200).json({ data: rows[0].data, updatedAt: rows[0].updated_at });
  } catch (error) {
    return res.status(500).json({ error: "Database request failed", detail: error.message });
  }
};
