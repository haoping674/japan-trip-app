const { buildDefaultState } = require("./seed-data");

const TRIP_ID = "osaka-2026";
const EXPENSE_STORE_REVISION = 1;
const isExpenseDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));

const normalizeExpense = (source, fallbackId = "") => {
  if (!source || typeof source !== "object") return null;
  const id = String(source.id || fallbackId).trim();
  const amount = Math.round(Number(source.amount));
  const item = String(source.item || "").trim().slice(0, 36);
  if (!id || !(amount > 0) || !item) return null;
  const occurredOn = isExpenseDate(source.occurredOn) ? String(source.occurredOn) : "";
  const createdAtValue = source.createdAt || source.created_at;
  const createdAt = createdAtValue ? String(createdAtValue) : "";
  return {
    id,
    amount,
    item,
    category:String(source.category || "餐飲").trim().slice(0, 24) || "餐飲",
    payer:String(source.payer || "").trim().slice(0, 80),
    ...(occurredOn ? { occurredOn } : {}),
    ...(createdAt ? { createdAt } : {}),
  };
};

async function ensureTables(sql) {
  await sql`
    create table if not exists trip_state (
      id text primary key,
      data jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists trip_expenses (
      id text primary key,
      trip_id text not null,
      data jsonb not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`create index if not exists trip_expenses_trip_id_created_at_idx on trip_expenses (trip_id, created_at)`;
}

async function ensureExpenseStore(sql) {
  await ensureTables(sql);
  const seed = buildDefaultState();
  await sql`
    insert into trip_state (id, data)
    values (${TRIP_ID}, ${JSON.stringify(seed)}::jsonb)
    on conflict (id) do nothing
  `;
  const rows = await sql`select data from trip_state where id = ${TRIP_ID}`;
  const current = rows[0]?.data && typeof rows[0].data === "object" ? rows[0].data : seed;
  if (current.expenseStoreRevision === EXPENSE_STORE_REVISION) return current;

  const legacyExpenses = Array.isArray(current.expenses) ? current.expenses : [];
  for (const [index, expense] of legacyExpenses.entries()) {
    const normalized = normalizeExpense(expense, `legacy-expense-${index}`);
    if (!normalized) continue;
    await sql`
      insert into trip_expenses (id, trip_id, data)
      values (${normalized.id}, ${TRIP_ID}, ${JSON.stringify(normalized)}::jsonb)
      on conflict (id) do nothing
    `;
  }

  const next = { ...current, expenseStoreRevision:EXPENSE_STORE_REVISION };
  const updated = await sql`
    update trip_state
    set data = ${JSON.stringify(next)}::jsonb, updated_at = now()
    where id = ${TRIP_ID}
    returning data
  `;
  return updated[0]?.data || next;
}

async function listExpenses(sql) {
  const rows = await sql`
    select data, created_at from trip_expenses
    where trip_id = ${TRIP_ID}
    order by created_at asc
  `;
  return rows.map((row) => normalizeExpense({ ...row.data, createdAt:row.created_at })).filter(Boolean);
}

async function createExpense(sql, expense) {
  const normalized = normalizeExpense(expense);
  if (!normalized) return null;
  const { createdAt:_createdAt, ...storedExpense } = normalized;
  const inserted = await sql`
    insert into trip_expenses (id, trip_id, data)
    values (${storedExpense.id}, ${TRIP_ID}, ${JSON.stringify(storedExpense)}::jsonb)
    on conflict (id) do nothing
    returning data, created_at
  `;
  if (inserted[0]?.data) return normalizeExpense({ ...inserted[0].data, createdAt:inserted[0].created_at });
  const existing = await sql`
    select data, created_at from trip_expenses
    where trip_id = ${TRIP_ID} and id = ${normalized.id}
  `;
  return normalizeExpense(existing[0] && { ...existing[0].data, createdAt:existing[0].created_at });
}

async function updateExpense(sql, expense) {
  const normalized = normalizeExpense(expense);
  if (!normalized) return null;
  const { createdAt:_createdAt, ...storedExpense } = normalized;
  const rows = await sql`
    update trip_expenses
    set data = ${JSON.stringify(storedExpense)}::jsonb, updated_at = now()
    where trip_id = ${TRIP_ID} and id = ${storedExpense.id}
    returning data, created_at
  `;
  return normalizeExpense(rows[0] && { ...rows[0].data, createdAt:rows[0].created_at });
}

async function deleteExpense(sql, id) {
  const expenseId = String(id || "").trim();
  if (!expenseId) return false;
  const rows = await sql`
    delete from trip_expenses
    where trip_id = ${TRIP_ID} and id = ${expenseId}
    returning id
  `;
  return Boolean(rows[0]?.id);
}

module.exports = { TRIP_ID, ensureExpenseStore, listExpenses, createExpense, updateExpense, deleteExpense };
