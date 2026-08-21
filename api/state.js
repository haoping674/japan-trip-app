const { neon } = require("@neondatabase/serverless");
const { buildDefaultState } = require("./seed-data");

const TRIP_ID = "osaka-2026";

const defaultState = () => buildDefaultState();

function mergeWithDefaults(data) {
  const defaults = defaultState();
  const merged = { ...defaults, ...(data && typeof data === "object" ? data : {}) };
  ["tripDays", "planningItems", "members"].forEach((key) => {
    if (!Array.isArray(merged[key]) || !merged[key].length) merged[key] = defaults[key];
  });
  if (!merged.bookings || typeof merged.bookings !== "object") merged.bookings = defaults.bookings;
  else {
    merged.bookings = { ...defaults.bookings, ...merged.bookings };
    ["flights", "stays", "vouchers"].forEach((key) => {
      if (!Array.isArray(merged.bookings[key]) || !merged.bookings[key].length) merged.bookings[key] = defaults.bookings[key];
    });
    merged.bookings.flight = { ...defaults.bookings.flight, ...(merged.bookings.flight || {}) };
    merged.bookings.rental = { ...defaults.bookings.rental, ...(merged.bookings.rental || {}) };
  }
  if (!Array.isArray(merged.expenses)) merged.expenses = [];
  if (!Array.isArray(merged.journal)) merged.journal = [];
  return merged;
}

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
      const seed = defaultState();
      await sql`
        insert into trip_state (id, data)
        values (${TRIP_ID}, ${JSON.stringify(seed)}::jsonb)
        on conflict (id) do nothing
      `;
      const rows = await sql`select data, updated_at from trip_state where id = ${TRIP_ID}`;
      const data = mergeWithDefaults(rows[0].data);
      if (JSON.stringify(data) !== JSON.stringify(rows[0].data)) {
        const updated = await sql`
          update trip_state set data = ${JSON.stringify(data)}::jsonb, updated_at = now()
          where id = ${TRIP_ID}
          returning data, updated_at
        `;
        return res.status(200).json({ data: updated[0].data, updatedAt: updated[0].updated_at });
      }
      return res.status(200).json({ data, updatedAt: rows[0].updated_at });
    }

    const payload = parseBody(req.body);
    if (!payload || typeof payload.data !== "object" || Array.isArray(payload.data)) {
      return res.status(400).json({ error: "Expected JSON body with object field: data" });
    }

    const current = await sql`select data from trip_state where id = ${TRIP_ID}`;
    const nextData = mergeWithDefaults({ ...(current[0]?.data || {}), ...payload.data });
    const rows = await sql`
      insert into trip_state (id, data, updated_at)
      values (${TRIP_ID}, ${JSON.stringify(nextData)}::jsonb, now())
      on conflict (id)
      do update set data = excluded.data, updated_at = now()
      returning data, updated_at
    `;

    return res.status(200).json({ data: rows[0].data, updatedAt: rows[0].updated_at });
  } catch (error) {
    return res.status(500).json({ error: "Database request failed", detail: error.message });
  }
};
