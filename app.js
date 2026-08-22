let tripDays = [];
let flights = [];
let bookings = [];
let planningItems = [];
const initial = JSON.parse(localStorage.getItem("osaka-travel-state") || "{}");
const state = { section:"itinerary", day:Number(initial.day) || 1, done:initial.done || {}, tasks:initial.tasks || {}, expenses:initial.expenses || [], journal:initial.journal || [], planningTab:initial.planningTab || "todo", planningMemberFilter:initial.planningMemberFilter || "all" };
const savedExpenseCurrency = localStorage.getItem("osaka-expense-currency");
state.expenseCurrency = savedExpenseCurrency === "TWD" ? "TWD" : "JPY";
let syncedBookings = initial.bookings || null;
let syncedMembers = (() => {
  try {
    const localMembers = JSON.parse(localStorage.getItem("osaka-members") || "null");
    if (Array.isArray(localMembers) && localMembers.length) return localMembers;
  } catch {}
  return Array.isArray(initial.members) ? initial.members : null;
})();
const app = document.querySelector("#app-content");
const safe = (text) => String(text).replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"})[char]);
const icon = (classes) => `<i class="${classes}" aria-hidden="true"></i>`;
const categoryIcon = (category) => ({餐飲:"fa-solid fa-utensils",交通:"fa-solid fa-train-subway",門票:"fa-solid fa-ticket",購物:"fa-solid fa-bag-shopping",住宿:"fa-solid fa-bed"}[category] || "fa-solid fa-receipt");
const expenseMembers = () => Array.isArray(syncedMembers) ? syncedMembers.filter((member) => member && member.id && member.name) : [];
const expensePayerName = (payer) => {
  if (payer === "all" || payer === "全體") return "全體";
  return expenseMembers().find((member) => member.id === payer)?.name || payer || expenseMembers()[0]?.name || "未指定";
};
const expenseMemberInitial = (member) => String(member.name || "?").trim().slice(0, 1) || "?";
const expensePayerOptions = () => {
  const members = expenseMembers();
  return `${members.length ? members.map((member) => `<option value="${safe(member.id)}">${safe(member.name)}</option>`).join("") : `<option value="" disabled>成員載入中…</option>`}<option value="all">全體</option>`;
};
const expenseSplitMembers = () => {
  const members = expenseMembers();
  return members.length ? members.map((member) => `<b title="${safe(member.name)}" aria-label="${safe(member.name)}">${safe(expenseMemberInitial(member))}</b>`).join("") : `<small>成員載入中…</small>`;
};
const EXPENSE_CURRENCIES = {
  JPY: { code: "JPY", label: "日幣", icon: "fa-solid fa-yen-sign", rate: 1, note: "日本円" },
  TWD: { code: "TWD", label: "台幣", icon: "fa-solid fa-dollar-sign", rate: 0.22, note: "估算匯率 1 JPY ≈ NT$0.22" },
};
const currentExpenseCurrency = () => EXPENSE_CURRENCIES[state.expenseCurrency] || EXPENSE_CURRENCIES.JPY;
let syncTimer;
const applyBookingData = (data) => {
  if (!data || typeof data !== "object") return;
  syncedBookings = data;
  const sourceFlights = Array.isArray(data.flights) ? data.flights : data.flight ? [data.flight] : [];
  if (sourceFlights.length) {
    flights = sourceFlights.map((flight, index) => ({
      code: flight.code || "",
      label: flight.label || (index === 0 ? "去程" : "回程"),
      date: String(flight.date || "").replace(/-/g, " / "),
      time: [flight.departure, flight.arrival].filter(Boolean).join("-"),
      from: flight.from || flight.fromCode || "",
      to: flight.to || flight.toCode || "",
    }));
  }
  const stayItems = Array.isArray(data.stays) ? data.stays : [];
  const voucherItems = Array.isArray(data.vouchers) ? data.vouchers : [];
  bookings = [
    ...flights.map((flight) => ["航班", flight.code, `${flight.date} ${flight.label}`, flight.label === "回程" ? "fa-solid fa-plane-arrival" : "fa-solid fa-plane-departure"]),
    ...stayItems.map((stay) => ["住宿", stay.name, stay.detail || `${stay.checkIn || ""} · ${stay.location || ""}`, "fa-solid fa-bed"]),
    ...voucherItems.map((voucher) => ["票券", voucher.title, voucher.file || "", "fa-solid fa-ticket"]),
  ];
};
const applyTripContent = (data) => {
  if (!data || typeof data !== "object") return;
  if (Array.isArray(data.tripDays) && data.tripDays.length) tripDays = data.tripDays;
  if (Array.isArray(data.planningItems)) planningItems = data.planningItems;
};
window.applyBookingData = applyBookingData;
window.applyTripContent = applyTripContent;
window.setSharedMembers = (members) => {
  syncedMembers = Array.isArray(members) ? members : null;
  localStorage.setItem("osaka-travel-state", JSON.stringify(sharedData()));
};
if (initial.tripDays || initial.planningItems) applyTripContent(initial);
if (syncedBookings) applyBookingData(syncedBookings);
const sharedData = () => ({ day:state.day, done:state.done, tasks:state.tasks, expenses:state.expenses, journal:state.journal, planningTab:state.planningTab, planningMemberFilter:state.planningMemberFilter, tripDays, planningItems, ...(syncedBookings ? { bookings:syncedBookings } : {}), ...(syncedMembers ? { members:syncedMembers } : {}) });
const save = () => { const data = sharedData(); localStorage.setItem("osaka-travel-state", JSON.stringify(data)); clearTimeout(syncTimer); syncTimer = setTimeout(() => fetch("./api/state", { method:"PUT", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ data }) }).catch(() => {}), 700); };
function syncedExpensePage() {
  const total = state.expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  return `<section class="section expense-view"><div class="page-title"><p>旅行帳本</p><h2>一起記帳</h2><span>預設日幣；先記下每筆花費，再一起分攤。</span></div><article class="expense-dashboard"><div><span>總支出</span><strong>${money(total)}</strong><small>JPY · 日本円</small></div><div class="expense-dashboard__ring"><b>${state.expenses.length}</b><small>筆紀錄</small></div><p>大阪 11 日旅行</p></article><div class="expense-switch" role="tablist" aria-label="記帳幣別"><button class="is-active" type="button" role="tab" aria-selected="true">${icon("fa-solid fa-yen-sign")} 日幣 JPY</button><button type="button" disabled role="tab" aria-selected="false">NT$ 台幣</button></div><form class="expense-form expense-form--compact" id="expense-form"><div class="expense-form__heading"><span>${icon("fa-solid fa-plus")}</span><h3>新增支出</h3></div><label class="amount-input">${icon("fa-solid fa-yen-sign")}<input name="amount" required type="number" min="1" inputmode="numeric" placeholder="0" autofocus /></label><label>項目<input name="item" required maxlength="36" placeholder="例如：錦市場午餐" /></label><div class="form-row"><label>類別<select name="category"><option>餐飲</option><option>交通</option><option>門票</option><option>購物</option><option>住宿</option></select></label><label>付款人<select name="payer">${expensePayerOptions()}</select></label></div><div class="split-row"><span>分攤對象</span><div>${expenseSplitMembers()}<small>全體均分</small></div></div><button class="primary-button" type="submit">記下這筆日幣支出</button></form><div class="ledger-title"><h3>最近支出</h3><span>${money(total)}</span></div><div class="ledger">${state.expenses.length ? state.expenses.slice().reverse().map((item) => `<article><span class="ledger-dot">${icon(categoryIcon(item.category))}</span><div><h4>${safe(item.item)}</h4><p>${safe(item.category)} · ${safe(expensePayerName(item.payer))} · JPY</p></div><strong>${money(item.amount)}</strong><button data-action="expense-delete" data-id="${item.id}" type="button" aria-label="刪除 ${safe(item.item)}">${icon("fa-solid fa-trash-can")}</button></article>`).join("") : `<div class="empty-state"><span>${icon("fa-solid fa-yen-sign")}</span><p>第一筆旅行支出，從這裡開始。</p></div>`}</div></section>`;
}

const mapUrl = (place) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
const money = (value) => {
  const currency = currentExpenseCurrency();
  const amount = new Intl.NumberFormat("zh-TW", { maximumFractionDigits:0 }).format((value || 0) * currency.rate);
  return currency.code === "TWD" ? `NT$${amount}` : `¥${amount}`;
};
const dayText = (date) => { const value = new Date(`${date}T12:00:00`); return [value.getMonth() + 1, value.getDate(), new Intl.DateTimeFormat("zh-TW", { weekday:"short" }).format(value).replace("週", "")]; };
const daysUntil = () => Math.max(0, Math.ceil((new Date("2026-09-06T12:40:00+09:00") - Date.now()) / 86400000));

function itineraryPage() {
  const current = tripDays.find((item) => item.day === state.day);
  if (!current) return `<section class="section itinerary-view"><div class="empty-state"><span>${icon("fa-solid fa-compass")}</span><p>正在載入旅程資料…</p></div></section>`;
  const completed = current.stops.filter((_, index) => state.done[`${current.day}-${index}`]).length;
  return `<section class="section itinerary-view"><div class="section-intro"><p>行程日期</p><button class="tiny-action" data-action="today" type="button">今天在哪裡？</button></div><div class="day-scroller" role="tablist" aria-label="選擇旅行日">${tripDays.map((item) => { const [date, month, weekday] = dayText(item.date); return `<button class="day-chip ${item.day === state.day ? "is-active" : ""}" data-day="${item.day}" role="tab" aria-selected="${item.day === state.day}" type="button"><small>DAY ${item.day}</small><strong>${date}/${month}</strong><em>${weekday}</em></button>`; }).join("")}</div><article class="weather-card"><div class="weather-card__cloud cloud-one"></div><div class="weather-card__cloud cloud-two"></div><div><p class="weather-place">${current.weather} · 旅行日天氣</p><h2>晴朗無雲 ${icon("fa-solid fa-sun")}</h2><p class="weather-note">出發前 7 天再確認即時預報與穿著。</p></div><div class="weather-degree"><b>26°</b><span>20° / 29°</span></div><div class="weather-facts"><span>${icon("fa-solid fa-umbrella")} 10%<small>降雨機率</small></span><span>${icon("fa-solid fa-wind")} 2 級<small>風力</small></span><span>${icon("fa-solid fa-sun")} 05:35<small>日出</small></span></div></article><article class="countdown-card"><span aria-hidden="true">${icon("fa-solid fa-plane-departure")}</span><div><small>距離出發</small><strong>${daysUntil()}<i>天</i></strong></div><p>大阪，我們要來了</p></article><div class="day-heading"><div><p>DAY ${current.day}</p><h2>${current.area}</h2><span>${current.date.replaceAll("-", ".")} · 已完成 ${completed}/${current.stops.length}</span></div><span class="day-orb">${current.day}</span></div><ol class="schedule-list">${current.stops.map(([time, place, note], index) => { const key = `${current.day}-${index}`; const done = state.done[key]; return `<li class="schedule-item ${done ? "is-done" : ""}"><button class="stop-check" data-action="stop" data-key="${key}" aria-label="${done ? "標記未完成" : "標記完成"}" type="button">${done ? icon("fa-solid fa-check") : ""}</button><time>${time}</time><div class="schedule-item__copy"><h3>${safe(place)}</h3><p>${safe(note)}</p><a href="${mapUrl(place)}" target="_blank" rel="noopener">在地圖開啟 ${icon("fa-solid fa-arrow-up-right-from-square")}</a></div></li>`; }).join("")}</ol></section>`;
}
function bookingPage() { const stays = bookings.filter(([type]) => type === "住宿"); const tickets = bookings.filter(([type]) => type === "票券"); return `<section class="section booking-view"><div class="page-title"><p>旅程收納</p><h2>我的預訂</h2><span>機票、住宿、租車與憑證都放在同一個地方。</span></div><div class="booking-summary"><span>已整理</span><strong>${bookings.length}<i>項</i></strong><p>出發前再核對一次訂單。</p></div><section class="booking-section"><div class="booking-section__title"><span>${icon("fa-solid fa-plane")}</span><h3>機票</h3><small>${flights.length} 段</small></div><div class="flight-stack">${flights.map((flight) => `<article class="boarding-pass"><div class="boarding-pass__main"><small>${flight.label} · ${flight.code}</small><div><strong>${flight.from}</strong>${icon("fa-solid fa-arrow-right")}<strong>${flight.to}</strong></div><p>${flight.date}</p></div><div class="boarding-pass__stub"><span>${flight.label.includes("去程") ? "抵達時間" : "起飛時間"}</span><b>${flight.time}</b><small>${flight.code}</small></div></article>`).join("")}</div></section><section class="booking-section"><div class="booking-section__title"><span>${icon("fa-solid fa-bed")}</span><h3>住宿</h3><small>${stays.length} 間</small></div><div class="stay-stack">${stays.map(([,name,detail],index) => `<article class="stay-card"><div class="stay-card__photo stay-card__photo--${index + 1}"><span>${icon("fa-solid fa-bed")}</span></div><div><h4>${name}</h4><p>${detail}</p><small>入住資訊與地址待補</small></div><button data-action="copy" data-name="${safe(name)}" type="button" aria-label="複製 ${safe(name)}">${icon("fa-solid fa-ellipsis")}</button></article>`).join("")}</div></section><section class="booking-section"><div class="booking-section__title"><span>${icon("fa-solid fa-car-side")}</span><h3>租車</h3></div><article class="rental-card"><div class="rental-card__car">${icon("fa-solid fa-car-side")}</div><div><h4>關西自駕</h4><p>取還車時間、車型、保險與 ETC</p><small>尚待補上預訂資訊</small></div><button type="button" disabled>待補</button></article></section><section class="booking-section"><div class="booking-section__title"><span>${icon("fa-solid fa-ticket")}</span><h3>憑證</h3><small>${tickets.length} 張</small></div><div class="voucher-list">${tickets.map(([,name,detail,iconClass]) => `<article><span>${icon(iconClass)}</span><div><h4>${name}</h4><p>${detail}</p></div><button data-action="copy" data-name="${safe(name)}" type="button" aria-label="複製 ${safe(name)}">查看</button></article>`).join("")}</div></section></section>`; }
function journalPage() { return `<section class="section"><div class="page-title"><p>旅行回憶</p><h2>今日手記</h2><span>照片會褪色，當下的心情不會。</span></div><form class="journal-compose" id="journal-form"><textarea name="note" required maxlength="180" placeholder="今天最想記住的是⋯⋯"></textarea><button class="primary-button" type="submit">留下這一頁</button></form><div class="journal-list">${state.journal.length ? state.journal.slice().reverse().map((item) => `<article class="journal-entry"><div class="journal-entry__stamp">${item.day}</div><div><p>${safe(item.note)}</p><span>${item.date}</span></div><button data-action="journal-delete" data-id="${item.id}" type="button" aria-label="刪除日誌">${icon("fa-solid fa-trash-can")}</button></article>`).join("") : `<div class="empty-state journal-empty"><span>${icon("fa-solid fa-feather-pointed")}</span><p>旅程還沒開始。<br />等第一個想留下的瞬間。</p></div>`}</div></section>`; }
const planningTabs = [["todo", "待辦", "fa-solid fa-clipboard-check"], ["packing", "行李", "fa-solid fa-suitcase-rolling"], ["wishlist", "想去", "fa-solid fa-heart"], ["shopping", "採買", "fa-solid fa-cart-shopping"]];
const planningMembers = () => Array.isArray(syncedMembers) ? syncedMembers : [];
const legacyMemberAliases = { "member-kevin": "member-a", "member-neil": "member-b", "member-sheep": "member-c", "member-dax": "member-d" };
const canonicalMemberIds = ["member-kevin", "member-neil", "member-sheep", "member-dax"];
const planningMemberIndex = (id) => { const canonicalIndex = canonicalMemberIds.indexOf(id); if (canonicalIndex >= 0) return canonicalIndex; return planningMembers().findIndex((member) => member.id === id); };
const planningMemberName = (id) => planningMembers().find((member) => member.id === id)?.name || planningMembers().find((member) => member.id === legacyMemberAliases[id])?.name || planningMembers()[planningMemberIndex(id)]?.name || id;
const planningMemberMatches = (item, memberId) => item.assignees?.some((id) => id === memberId || legacyMemberAliases[id] === memberId || legacyMemberAliases[memberId] === id || planningMemberIndex(id) === planningMemberIndex(memberId));
const planningMemberChosen = (item, memberId) => planningMemberMatches(item, memberId);
let deletedPlanningItem = null;
let deletedPlanningTimer;
const closePlanningModal = () => document.querySelector(".planning-modal")?.remove();
const planningModal = (content) => {
  closePlanningModal();
  const modal = document.createElement("div");
  modal.className = "planning-modal";
  modal.innerHTML = `<div class="planning-modal__backdrop" data-planning-modal-close></div><section class="planning-modal__sheet" role="dialog" aria-modal="true">${content}</section>`;
  document.body.appendChild(modal);
  if (!window.matchMedia("(pointer: coarse)").matches) modal.querySelector("input, textarea")?.focus();
  return modal;
};
const openPlanningEditor = (item) => {
  const memberOptions = planningMembers().map((member) => `<button class="planning-member-option ${planningMemberChosen(item, member.id) ? "is-selected" : ""}" data-planning-member-option data-member-id="${safe(member.id)}" type="button" aria-pressed="${planningMemberChosen(item, member.id)}">${planningMemberChosen(item, member.id) ? icon("fa-solid fa-check") : ""}${safe(member.name)}</button>`).join("");
  planningModal(`<div class="planning-modal__head"><div><small>準備清單</small><h2>編輯項目</h2></div><button class="planning-modal__close" type="button" data-planning-modal-close aria-label="關閉">×</button></div><p class="planning-modal__hint">把內容整理好，大家就知道下一步要做什麼。</p><form id="planning-edit-form" data-item-id="${safe(item.id)}"><label class="planning-modal__field"><span>項目名稱</span><input name="title" maxlength="60" value="${safe(item.title)}" required /></label><label class="planning-modal__field"><span>備註 <em>選填</em></span><textarea name="note" maxlength="180" rows="3" placeholder="補充時間、地點或提醒…">${safe(item.note || "")}</textarea></label><fieldset class="planning-modal__members"><legend>分配給</legend><div>${memberOptions || `<p>尚未設定旅伴</p>`}</div></fieldset><p class="planning-modal__error" aria-live="polite"></p><div class="planning-modal__actions"><button class="planning-modal__cancel" type="button" data-planning-modal-close>取消</button><button class="planning-modal__save" type="submit">儲存變更</button></div></form>`);
};
const openPlanningDeleteConfirm = (item) => planningModal(`<div class="planning-modal__head"><div><small>準備清單</small><h2>刪除這筆項目？</h2></div><button class="planning-modal__close" type="button" data-planning-modal-close aria-label="關閉">×</button></div><div class="planning-delete-preview"><span>${icon("fa-solid fa-trash-can")}</span><div><strong>${safe(item.title)}</strong><p>刪除後會從所有旅伴的準備清單移除。</p></div></div><div class="planning-modal__actions"><button class="planning-modal__cancel" type="button" data-planning-modal-close>先保留</button><button class="planning-modal__delete" type="button" data-planning-delete-confirm data-item-id="${safe(item.id)}">確認刪除</button></div>`);
const showPlanningUndo = (item) => {
  document.querySelector(".planning-toast")?.remove();
  clearTimeout(deletedPlanningTimer);
  const toast = document.createElement("div");
  toast.className = "planning-toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `<span>已刪除「${safe(item.title)}」</span><button type="button" data-action="planning-undo">復原</button>`;
  document.body.appendChild(toast);
  deletedPlanningTimer = window.setTimeout(() => { toast.remove(); deletedPlanningItem = null; }, 6000);
};
const planningItemsForView = () => planningItems.filter((item) => item.category === state.planningTab && (state.planningMemberFilter === "all" || planningMemberMatches(item, state.planningMemberFilter)));
const planningItemDone = (item) => Array.isArray(item.assignees) && item.assignees.length > 0 && item.assignees.every((memberId) => item.completedBy?.includes(memberId));
const planningAssigneeTags = (item) => (item.assignees || []).map((memberId) => `<button class="planning-assignee-chip ${item.completedBy?.includes(memberId) ? "is-complete" : ""}" data-action="planning-assignee" data-item-id="${safe(item.id)}" data-member-id="${safe(memberId)}" type="button">${item.completedBy?.includes(memberId) ? "✓ " : ""}${safe(planningMemberName(memberId))}</button>`).join("");
const planningCard = (item) => {
  const done = planningItemDone(item);
  const progress = `${(item.completedBy || []).filter((memberId) => item.assignees?.includes(memberId)).length}/${item.assignees?.length || 0}`;
  const extra = state.planningTab === "todo" ? `<span class="planning-progress ${done ? "is-complete" : ""}">${progress}</span>` : `<button class="planning-checkbox ${done ? "is-complete" : ""}" data-action="planning-toggle" data-item-id="${safe(item.id)}" type="button" aria-label="${done ? "標記未完成" : "標記完成"}">${done ? icon("fa-solid fa-check") : ""}</button>`;
  return `<article class="planning-card ${state.planningTab === "wishlist" ? "planning-card--wishlist" : ""} ${done ? "is-complete" : ""}"><div class="planning-card__tags">${(item.assignees || []).map((memberId) => `<span>${safe(planningMemberName(memberId))}</span>`).join("")}</div><div class="planning-card__body">${extra}<div class="planning-card__copy"><h3>${safe(item.title)}</h3>${item.note ? `<p>${safe(item.note)}</p>` : ""}</div><div class="planning-card__actions"><button data-action="planning-edit" data-item-id="${safe(item.id)}" type="button" aria-label="編輯 ${safe(item.title)}">${icon("fa-solid fa-pen")}</button><button data-action="planning-delete" data-item-id="${safe(item.id)}" type="button" aria-label="刪除 ${safe(item.title)}">${icon("fa-solid fa-trash-can")}</button></div></div><div class="planning-card__assignees">${planningAssigneeTags(item)}</div></article>`;
};
function planningPage() {
  const tab = planningTabs.find(([id]) => id === state.planningTab) || planningTabs[0];
  const visibleItems = planningItemsForView();
  const members = planningMembers();
  const completeCount = planningItems.filter(planningItemDone).length;
  const selectedMemberNames = members.filter((member) => member.id === state.planningMemberFilter).map((member) => member.name).join("、");
  return `<section class="section preparation-view"><nav class="booking-subnav preparation-tabs" role="tablist" aria-label="準備分類">${planningTabs.map(([id, label, iconClass]) => `<button class="booking-subnav__item ${id === state.planningTab ? "is-active" : ""}" data-action="planning-tab" data-tab="${id}" type="button" role="tab" aria-selected="${id === state.planningTab}">${icon(iconClass)}<span>${label}</span></button>`).join("")}</nav><div class="preparation-filters" role="tablist" aria-label="旅伴篩選"><button class="${state.planningMemberFilter === "all" ? "is-active" : ""}" data-action="planning-filter" data-member-id="all" type="button">全部</button>${members.map((member) => `<button class="${state.planningMemberFilter === member.id ? "is-active" : ""}" data-action="planning-filter" data-member-id="${safe(member.id)}" type="button">${safe(member.name)}</button>`).join("")}</div><form class="planning-composer" id="planning-form"><div class="planning-composer__field"><input name="title" maxlength="60" required placeholder="新增${tab[1]}（${selectedMemberNames || "全體"}）…" aria-label="新增${tab[1]}" /><textarea name="note" maxlength="180" placeholder="補充備註（選填）"></textarea></div><label class="planning-upload" aria-label="加入照片">${icon("fa-solid fa-camera")}<input name="image" type="file" accept="image/*" /></label><button class="planning-note-toggle" data-action="planning-note" type="button" aria-label="新增備註">${icon("fa-solid fa-pen-to-square")}</button><button class="planning-add" type="submit" aria-label="新增${tab[1]}">${icon("fa-solid fa-plus")}</button></form><div class="preparation-summary"><span>${tab[1]}</span><strong>${visibleItems.length}<i> 項</i></strong><small>已完成 ${completeCount} / ${planningItems.length}</small></div><div class="planning-card-list">${visibleItems.length ? visibleItems.map(planningCard).join("") : `<div class="planning-empty">還沒有${tab[1]}，先加一件吧。</div>`}</div></section>`;
}
function updateExpenseCurrencyUI() {
  if (state.section !== "expenses") return;
  const currency = currentExpenseCurrency();
  document.querySelectorAll(".expense-switch button").forEach((button, index) => {
    const code = index === 0 ? "JPY" : "TWD";
    const selected = code === currency.code;
    const option = EXPENSE_CURRENCIES[code];
    button.disabled = false;
    button.dataset.action = "expense-currency";
    button.dataset.currency = code;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.innerHTML = `${icon(option.icon)} ${option.label} ${code}`;
  });
  const dashboardCurrency = document.querySelector(".expense-dashboard > div:first-child small");
  if (dashboardCurrency) dashboardCurrency.textContent = `${currency.code} · ${currency.note}`;
  const amountLabel = document.querySelector(".amount-input");
  const amountInput = amountLabel?.querySelector("input");
  if (amountLabel && amountInput) {
    amountLabel.innerHTML = `${icon(currency.icon)}`;
    amountLabel.append(amountInput);
    amountInput.placeholder = currency.code === "JPY" ? "0" : "0.00";
  }
  const submit = document.querySelector("#expense-form .primary-button");
  if (submit) submit.textContent = `記下這筆${currency.label}支出`;
  document.querySelectorAll(".ledger article p").forEach((entry) => {
    entry.textContent = entry.textContent.replace(/·\s*(JPY|TWD)$/, `· ${currency.code}`);
  });
}
function render() { const pages = { itinerary:itineraryPage, bookings:bookingPage, expenses:syncedExpensePage, planning:planningPage }; const markup = pages[state.section](); app.innerHTML = window.matchMedia("(pointer: coarse)").matches ? markup.replace(/\sautofocus(?=[\s>])/g, "") : markup; updateExpenseCurrencyUI(); document.querySelectorAll(".bottom-nav__item").forEach((button) => button.classList.toggle("is-active", button.dataset.section === state.section)); }
document.querySelector(".bottom-nav").addEventListener("click", (event) => { const button = event.target.closest("[data-section]"); if (button) { state.section = button.dataset.section; render(); window.scrollTo({ top:0, behavior:"smooth" }); } });
app.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action], [data-day]");
  if (!button) return;
  if (button.dataset.day) { state.day = Number(button.dataset.day); save(); render(); return; }
  const { action, key, id, name } = button.dataset;
  if (action === "expense-currency") {
    state.expenseCurrency = button.dataset.currency === "TWD" ? "TWD" : "JPY";
    localStorage.setItem("osaka-expense-currency", state.expenseCurrency);
    render();
    return;
  }
  if (action === "stop") { state.done[key] = !state.done[key]; save(); render(); }
  if (action === "task") { state.tasks[key] = !state.tasks[key]; save(); render(); }
  if (action === "expense-delete") { state.expenses = state.expenses.filter((item) => item.id !== id); save(); render(); }
  if (action === "copy") { navigator.clipboard?.writeText(name).catch(() => {}); button.textContent = "已複製"; }
  if (action === "today") { const index = tripDays.findIndex((item) => item.date === new Date().toISOString().slice(0, 10)); state.day = index >= 0 ? tripDays[index].day : 1; save(); render(); }
  if (action === "planning-tab") { state.planningTab = button.dataset.tab; save(); render(); }
  if (action === "planning-filter") { state.planningMemberFilter = button.dataset.memberId; save(); render(); }
  if (action === "planning-note") { document.querySelector("#planning-form textarea")?.classList.toggle("is-visible"); }
  if (["planning-assignee", "planning-toggle", "planning-delete", "planning-edit"].includes(action)) {
    const item = planningItems.find((entry) => entry.id === button.dataset.itemId);
    if (!item) return;
    if (action === "planning-assignee") {
      item.completedBy = item.completedBy || [];
      item.completedBy = item.completedBy.includes(button.dataset.memberId) ? item.completedBy.filter((id) => id !== button.dataset.memberId) : [...item.completedBy, button.dataset.memberId];
    }
    if (action === "planning-toggle") item.completedBy = planningItemDone(item) ? [] : [...(item.assignees || [])];
    if (action === "planning-delete") { openPlanningDeleteConfirm(item); return; }
    if (action === "planning-edit") { openPlanningEditor(item); return; }
    save(); render();
  }
});
document.addEventListener("click", (event) => {
  if (event.target.closest("[data-planning-modal-close]")) { closePlanningModal(); return; }
  const option = event.target.closest("[data-planning-member-option]");
  if (option) {
    const selected = option.classList.toggle("is-selected");
    option.setAttribute("aria-pressed", String(selected));
    option.innerHTML = `${selected ? icon("fa-solid fa-check") : ""}${safe(planningMemberName(option.dataset.memberId))}`;
    return;
  }
  const confirmDelete = event.target.closest("[data-planning-delete-confirm]");
  if (confirmDelete) {
    const index = planningItems.findIndex((item) => item.id === confirmDelete.dataset.itemId);
    if (index < 0) { closePlanningModal(); return; }
    deletedPlanningItem = { item: planningItems[index], index };
    planningItems = planningItems.filter((item) => item.id !== confirmDelete.dataset.itemId);
    closePlanningModal();
    save();
    render();
    showPlanningUndo(deletedPlanningItem.item);
    return;
  }
  if (event.target.closest('[data-action="planning-undo"]')) {
    if (deletedPlanningItem && !planningItems.some((item) => item.id === deletedPlanningItem.item.id)) {
      planningItems.splice(Math.min(deletedPlanningItem.index, planningItems.length), 0, deletedPlanningItem.item);
      save();
      render();
    }
    document.querySelector(".planning-toast")?.remove();
    clearTimeout(deletedPlanningTimer);
    deletedPlanningItem = null;
  }
});
document.addEventListener("submit", (event) => {
  const form = event.target.closest("#planning-edit-form");
  if (!form) return;
  event.preventDefault();
  const item = planningItems.find((entry) => entry.id === form.dataset.itemId);
  if (!item) { closePlanningModal(); return; }
  const data = new FormData(form);
  const title = String(data.get("title") || "").trim();
  const error = form.querySelector(".planning-modal__error");
  if (!title) { if (error) error.textContent = "請先輸入項目名稱。"; return; }
  const selectedMembers = [...form.querySelectorAll("[data-planning-member-option].is-selected")].map((button) => button.dataset.memberId);
  const previousAssignees = item.assignees || [];
  if (!selectedMembers.length && previousAssignees.length) { if (error) error.textContent = "至少選一位旅伴，才方便一起追蹤。"; return; }
  item.title = title.slice(0, 60);
  item.note = String(data.get("note") || "").trim().slice(0, 180);
  item.assignees = selectedMembers;
  item.completedBy = (item.completedBy || []).filter((memberId) => selectedMembers.some((id) => id === memberId || legacyMemberAliases[id] === memberId || legacyMemberAliases[memberId] === id));
  closePlanningModal();
  save();
  render();
});
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && document.querySelector(".planning-modal")) closePlanningModal(); });
app.addEventListener("submit", (event) => { event.preventDefault(); const form = event.target; const data = new FormData(form); if (form.id === "expense-form") state.expenses.push({ id:crypto.randomUUID(), item:data.get("item"), amount:Number(data.get("amount")), category:data.get("category"), payer:data.get("payer") }); if (form.id === "journal-form") state.journal.push({ id:crypto.randomUUID(), note:data.get("note"), day:`DAY ${state.day}`, date:new Date().toLocaleDateString("zh-TW") }); if (form.id === "planning-form") { const title = String(data.get("title") || "").trim(); if (!title) return; const assignees = state.planningMemberFilter === "all" ? planningMembers().map((member) => member.id) : [state.planningMemberFilter]; planningItems.push({ id:crypto.randomUUID(), category:state.planningTab, title:title.slice(0, 60), note:String(data.get("note") || "").trim().slice(0, 180), assignees, completedBy:[] }); } save(); render(); });
app.addEventListener("submit", (event) => {
  if (event.target.id !== "expense-form" || state.expenseCurrency === "JPY") return;
  const amount = event.target.elements.amount;
  if (amount?.value) amount.value = Math.round(Number(amount.value) / currentExpenseCurrency().rate);
}, true);
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
render();
fetch("./api/state", { cache:"no-store" }).then((response) => response.ok ? response.json() : Promise.reject()).then(({ data }) => { if (!data || typeof data !== "object") return; state.day = Number(data.day) || state.day; state.done = data.done || state.done; state.tasks = data.tasks || state.tasks; state.expenses = Array.isArray(data.expenses) ? data.expenses : state.expenses; state.journal = Array.isArray(data.journal) ? data.journal : state.journal; state.planningTab = planningTabs.some(([id]) => id === data.planningTab) ? data.planningTab : state.planningTab; state.planningMemberFilter = data.planningMemberFilter || state.planningMemberFilter; applyTripContent(data); if (data.bookings) { applyBookingData(data.bookings); } if (Array.isArray(data.members)) { syncedMembers = data.members; window.applyMembersData?.(data.members); } localStorage.setItem("osaka-travel-state", JSON.stringify(sharedData())); render(); }).catch(() => {});
