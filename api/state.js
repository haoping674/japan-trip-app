const { neon } = require("@neondatabase/serverless");

const TRIP_ID = "kansai-2026";

const DEFAULT_STATE = {
  checklist: {},
  reservations: [
    { item: "航班去程", date: "2026/09/06", detail: "關西機場抵達 12:40", code: "" },
    { item: "航班回程", date: "2026/09/16", detail: "請補航班號、起飛時間、航廈", code: "" },
    { item: "租車", date: "09/06 - 09/16", detail: "取還車地點、保險、ETC、車型", code: "" },
    { item: "京都住宿", date: "09/06 - 09/08", detail: "RESI STAY cotorune KYOTO", code: "" },
    { item: "小濱住宿", date: "09/08 - 09/09", detail: "Party&Resort ZERO'sHOUSE", code: "" },
    { item: "伊根/宮津住宿", date: "09/09 - 09/10", detail: "Private Villa 蒼 Lala & Lino", code: "" },
    { item: "大阪住宿", date: "09/10 - 09/16", detail: "天下茶屋周邊住宿名與地址", code: "" },
    { item: "USJ", date: "2026/09/15", detail: "門票、快速通關、入園 QR", code: "" },
    { item: "海遊館/觀光船", date: "2026/09/14", detail: "海遊館、聖瑪麗亞號、Legoland", code: "" }
  ],
  budget: [
    { item: "餐飲", amount: "", memo: "" },
    { item: "交通/停車", amount: "", memo: "" },
    { item: "門票", amount: "", memo: "" },
    { item: "伴手禮", amount: "", memo: "" }
  ],
  shopping: {}
};

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
      do update set data = excluded.data, updated_at = now()
      returning data, updated_at
    `;

    return res.status(200).json({ data: rows[0].data, updatedAt: rows[0].updated_at });
  } catch (error) {
    return res.status(500).json({ error: "Database request failed", detail: error.message });
  }
};
