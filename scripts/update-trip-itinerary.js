const fs = require("node:fs");
const { neon } = require("@neondatabase/serverless");
const { buildDefaultState } = require("../api/seed-data");

const TRIP_ID = "osaka-2026";

function readDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = ".env.local";
  if (!fs.existsSync(envPath)) return "";
  const line = fs.readFileSync(envPath, "utf8").split(/\r?\n/).find((entry) => entry.startsWith("DATABASE_URL="));
  return line?.slice("DATABASE_URL=".length).replace(/^"|"$/g, "") || "";
}

async function main() {
  const databaseUrl = readDatabaseUrl();
  if (!databaseUrl) throw new Error("DATABASE_URL 未設定，請先在 .env.local 或執行環境設定 Neon 連線字串。");

  const sql = neon(databaseUrl);
  await sql`
    create table if not exists trip_state (
      id text primary key,
      data jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;

  const defaults = buildDefaultState();
  const current = await sql`select id from trip_state where id = ${TRIP_ID}`;
  let saved;
  if (!current.length) {
    [saved] = await sql`
      insert into trip_state (id, data)
      values (${TRIP_ID}, ${JSON.stringify(defaults)}::jsonb)
      returning data
    `;
  } else {
    [saved] = await sql`
      update trip_state
      set data = jsonb_set(
            jsonb_set(data, '{tripDays}', ${JSON.stringify(defaults.tripDays)}::jsonb, true),
            '{itineraryRevision}',
            to_jsonb(${defaults.itineraryRevision}::text),
            true
          ),
          updated_at = now()
      where id = ${TRIP_ID}
      returning data
    `;
  }

  const tripDays = saved?.data?.tripDays || [];
  const stopCount = tripDays.reduce((total, day) => total + (Array.isArray(day.stops) ? day.stops.length : 0), 0);
  if (tripDays.length !== 11 || stopCount !== 67) throw new Error("資料庫回傳的行程筆數與來源 PDF 不一致。");
  console.log("已將 Funliday 行程同步至 trip_state / osaka-2026（11 日／67 個停靠點）；其他共用資料保持不變。");
}

main().catch((error) => { console.error(error.message); process.exit(1); });
