const fs = require("node:fs");
const { neon } = require("@neondatabase/serverless");
const { buildDefaultState } = require("../api/seed-data");

function readDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = ".env.local";
  if (!fs.existsSync(envPath)) return "";
  const line = fs.readFileSync(envPath, "utf8").split(/\r?\n/).find((entry) => entry.startsWith("DATABASE_URL="));
  return line?.slice("DATABASE_URL=".length).replace(/^"|"$/g, "") || "";
}

async function main() {
  const url = readDatabaseUrl();
  if (!url) throw new Error("DATABASE_URL 未設定，請先在 .env.local 或執行環境設定 Neon 連線字串。");
  const sql = neon(url);
  await sql`
    create table if not exists trip_state (
      id text primary key,
      data jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;
  const defaults = buildDefaultState();
  const currentRows = await sql`select data from trip_state where id = ${"osaka-2026"}`;
  const current = currentRows[0]?.data || {};
  const next = { ...defaults, ...current };
  next.bookings = { ...defaults.bookings, ...(current.bookings || {}) };
  ["flights", "stays", "vouchers"].forEach((key) => {
    if (!Array.isArray(next.bookings[key]) || !next.bookings[key].length) next.bookings[key] = defaults.bookings[key];
  });
  next.bookings.flight = { ...defaults.bookings.flight, ...(next.bookings.flight || {}) };
  next.bookings.rental = { ...defaults.bookings.rental, ...(next.bookings.rental || {}) };
  const state = JSON.stringify(next);
  await sql`
    insert into trip_state (id, data, updated_at)
    values (${"osaka-2026"}, ${state}::jsonb, now())
    on conflict (id) do update set data = excluded.data || trip_state.data, updated_at = now()
  `;
  console.log("已將行程、預訂、成員與準備清單匯入 trip_state / osaka-2026");
}

main().catch((error) => { console.error(error.message); process.exit(1); });
