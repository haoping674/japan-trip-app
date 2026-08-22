let tripDays = [];
let flights = [];
let bookings = [];
let planningItems = [];
const rainyPlans = window.RAINY_PLANS || {};
const initial = JSON.parse(localStorage.getItem("osaka-travel-state") || "{}");
const state = { section:"itinerary", day:Number(initial.day) || 1, done:initial.done || {}, tasks:initial.tasks || {}, expenses:initial.expenses || [], journal:initial.journal || [], planningTab:initial.planningTab || "todo", planningMemberFilter:initial.planningMemberFilter || "all" };
const storedToolState = (() => {
  try { return JSON.parse(localStorage.getItem("osaka-tool-state-v1") || "{}"); } catch { return {}; }
})();
const toolState = {
  tab:["phrases", "exchange", "emergency"].includes(storedToolState.tab) ? storedToolState.tab : "phrases",
  phraseCategory:storedToolState.phraseCategory || "general",
  speechRate:storedToolState.speechRate === "slow" ? "slow" : "normal",
  exchangeDirection:storedToolState.exchangeDirection === "TWD_JPY" ? "TWD_JPY" : "JPY_TWD",
  rate:Number(storedToolState.rate) > 0 ? Number(storedToolState.rate) : null,
  rateDate:storedToolState.rateDate || "",
  rateFetchedAt:Number(storedToolState.rateFetchedAt) || 0,
  manualRate:Number(storedToolState.manualRate) > 0 ? Number(storedToolState.manualRate) : null,
  useManualRate:Boolean(storedToolState.useManualRate),
};
const saveToolState = () => localStorage.setItem("osaka-tool-state-v1", JSON.stringify(toolState));
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
const clearCacheButton = document.querySelector("[data-action='clear-cache']");
clearCacheButton?.addEventListener("click", async () => {
  if (!window.confirm("清除 PWA 快取並重新載入？現有行程與記帳資料會保留。")) return;
  clearCacheButton.disabled = true;
  clearCacheButton.setAttribute("aria-busy", "true");
  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    } catch {}
  }
  if ("caches" in window) {
    try {
      const cacheKeys = await window.caches.keys();
      await Promise.all(cacheKeys.filter((key) => key.startsWith("osaka-travel-")).map((key) => window.caches.delete(key)));
    } catch {}
  }
  window.location.reload();
});
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
  TWD: { code: "TWD", label: "台幣", icon: "fa-solid fa-dollar-sign", rate: null, note: "尚未取得最新匯率" },
};
const expenseRateNote = (rate) => {
  if (!(rate > 0)) return exchangeStatus === "error" ? (exchangeError || "目前無法取得匯率，請連線後重試。") : "台幣匯率載入中，稍候即可切換。";
  if (toolState.useManualRate && toolState.manualRate) return `自訂匯率 · 1 JPY ≈ NT$${Number(rate).toFixed(4)}`;
  return `${toolState.rateDate ? `最新參考 ${toolState.rateDate} · ` : ""}1 JPY ≈ NT$${Number(rate).toFixed(4)}`;
};
const currentExpenseCurrency = () => {
  const currency = EXPENSE_CURRENCIES[state.expenseCurrency] || EXPENSE_CURRENCIES.JPY;
  const rate = currency.code === "TWD" ? activeExchangeRate() : 1;
  return { ...currency, rate, note: currency.code === "TWD" ? expenseRateNote(rate) : currency.note };
};
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
  if (Array.isArray(data.tripDays) && data.tripDays.length) {
    tripDays = data.tripDays.map((item) => ({ ...item, rainPlan:item.rainPlan || rainyPlans[item.day] || null }));
  }
  if (Array.isArray(data.planningItems)) planningItems = data.planningItems;
  if (Array.isArray(data.japanesePhrases)) japanesePhrases = normalizeJapanesePhrases(data.japanesePhrases);
};
window.applyBookingData = applyBookingData;
window.applyTripContent = applyTripContent;
window.setSharedMembers = (members) => {
  syncedMembers = Array.isArray(members) ? members : null;
  localStorage.setItem("osaka-travel-state", JSON.stringify(sharedData()));
};
if (syncedBookings) applyBookingData(syncedBookings);
const sharedData = () => ({ day:state.day, done:state.done, tasks:state.tasks, expenses:state.expenses, journal:state.journal, planningTab:state.planningTab, planningMemberFilter:state.planningMemberFilter, tripDays, planningItems, japanesePhrases, ...(syncedBookings ? { bookings:syncedBookings } : {}), ...(syncedMembers ? { members:syncedMembers } : {}) });
const save = () => { const data = sharedData(); localStorage.setItem("osaka-travel-state", JSON.stringify(data)); clearTimeout(syncTimer); syncTimer = setTimeout(() => fetch("./api/state", { method:"PUT", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ data }) }).catch(() => {}), 700); };
function syncedExpensePage() {
  const total = state.expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const currency = currentExpenseCurrency();
  const isTwd = currency.code === "TWD";
  const rateReady = !isTwd || currency.rate > 0;
  const rateNote = expenseRateNote(currency.rate);
  return `<section class="section expense-view"><div class="page-title"><p>旅行帳本</p><h2>一起記帳</h2><span>預設日幣；切換台幣時會套用工具頁的最新匯率。</span></div><article class="expense-dashboard"><div><span>總支出</span><strong>${money(total)}</strong><small>${currency.code} · ${currency.note}</small></div><div class="expense-dashboard__ring"><b>${state.expenses.length}</b><small>筆紀錄</small></div><p>大阪 11 日旅行</p></article><div class="expense-switch" role="tablist" aria-label="記帳幣別"><button class="${!isTwd ? "is-active" : ""}" data-action="expense-currency" data-currency="JPY" type="button" role="tab" aria-selected="${!isTwd}">${icon("fa-solid fa-yen-sign")} 日幣 JPY</button><button class="${isTwd ? "is-active" : ""}" data-action="expense-currency" data-currency="TWD" type="button" role="tab" aria-selected="${isTwd}" ${!activeExchangeRate() ? "disabled" : ""}>${icon("fa-solid fa-dollar-sign")} 台幣 TWD</button></div><form class="expense-form expense-form--compact" id="expense-form"><div class="expense-form__heading"><span>${icon("fa-solid fa-plus")}</span><h3>新增支出</h3></div><label class="amount-input">${icon(currency.icon)}<input name="amount" required type="number" min="1" step="${isTwd ? "0.01" : "1"}" inputmode="${isTwd ? "decimal" : "numeric"}" placeholder="${isTwd ? "0.00" : "0"}" autofocus ${!rateReady ? "disabled" : ""} /></label><p class="expense-rate-hint" role="status">${safe(rateNote)}</p><label>項目<input name="item" required maxlength="36" placeholder="例如：錦市場午餐" /></label><div class="form-row"><label>類別<select name="category"><option>餐飲</option><option>交通</option><option>門票</option><option>購物</option><option>住宿</option></select></label><label>付款人<select name="payer">${expensePayerOptions()}</select></label></div><div class="split-row"><span>分攤對象</span><div>${expenseSplitMembers()}<small>全體均分</small></div></div><button class="primary-button" type="submit" ${!rateReady ? "disabled" : ""}>記下這筆${currency.label}支出</button></form><div class="ledger-title"><h3>最近支出</h3><span>${money(total)}</span></div><div class="ledger">${state.expenses.length ? state.expenses.slice().reverse().map((item) => `<article><span class="ledger-dot">${icon(categoryIcon(item.category))}</span><div><h4>${safe(item.item)}</h4><p>${safe(item.category)} · ${safe(expensePayerName(item.payer))} · ${currency.code}</p></div><strong>${money(item.amount)}</strong><button data-action="expense-delete" data-id="${item.id}" type="button" aria-label="刪除 ${safe(item.item)}">${icon("fa-solid fa-trash-can")}</button></article>`).join("") : `<div class="empty-state"><span>${icon("fa-solid fa-yen-sign")}</span><p>第一筆旅行支出，從這裡開始。</p></div>`}</div></section>`;
}

const mapUrl = (place) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
const externalUrl = (value) => {
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
};
const money = (value) => {
  const currency = currentExpenseCurrency();
  if (!(currency.rate > 0)) return "—";
  const amount = new Intl.NumberFormat("zh-TW", { maximumFractionDigits:0 }).format((value || 0) * currency.rate);
  return currency.code === "TWD" ? `NT$${amount}` : `¥${amount}`;
};
const dayText = (date) => { const value = new Date(`${date}T12:00:00`); return [value.getMonth() + 1, value.getDate(), new Intl.DateTimeFormat("zh-TW", { weekday:"short" }).format(value).replace("週", "")]; };
const daysUntil = () => Math.max(0, Math.ceil((new Date("2026-09-06T12:40:00+09:00") - Date.now()) / 86400000));
const WEATHER_CACHE_KEY = "osaka-weather-state-v1";
const WEATHER_CACHE_TTL = 6 * 60 * 60 * 1000;
const WEATHER_LOCATIONS = {
  "京都": { latitude:35.0116, longitude:135.7681 },
  "若狹": { latitude:35.4950, longitude:135.7460 },
  "宮津": { latitude:35.5350, longitude:135.1950 },
  "大阪": { latitude:34.6937, longitude:135.5023 },
  "關西": { latitude:34.4347, longitude:135.2440 },
};
const weatherCache = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || "{}");
    return { entries: saved.entries && typeof saved.entries === "object" ? saved.entries : {} };
  } catch {
    return { entries:{} };
  }
})();
let weatherStatus = "idle";
let weatherStatusKey = "";
let weatherRequest = null;
const persistWeatherCache = () => localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(weatherCache));
const weatherLocationFor = (tripDay) => {
  const source = tripDay?.weatherLocation;
  if (Number.isFinite(Number(source?.latitude)) && Number.isFinite(Number(source?.longitude))) {
    return { latitude:Number(source.latitude), longitude:Number(source.longitude) };
  }
  return WEATHER_LOCATIONS[tripDay?.weather] || WEATHER_LOCATIONS[tripDay?.area] || null;
};
const weatherCacheKey = (tripDay, location) => `${tripDay.date}:${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;
const weatherCodeInfo = (code) => {
  const groups = [
    [[0], "晴朗", "fa-solid fa-sun"],
    [[1, 2], "晴時多雲", "fa-solid fa-cloud-sun"],
    [[3], "多雲", "fa-solid fa-cloud"],
    [[45, 48], "有霧", "fa-solid fa-smog"],
    [[51, 53, 55, 56, 57], "毛毛雨", "fa-solid fa-cloud-rain"],
    [[61, 63, 65, 66, 67], "雨天", "fa-solid fa-cloud-showers-heavy"],
    [[71, 73, 75, 77, 85, 86], "下雪", "fa-solid fa-snowflake"],
    [[80, 81, 82], "陣雨", "fa-solid fa-cloud-showers-heavy"],
    [[95, 96, 99], "雷雨", "fa-solid fa-cloud-bolt"],
  ];
  const match = groups.find(([codes]) => codes.includes(Number(code)));
  return match ? { label:match[1], icon:match[2] } : { label:"天氣變化", icon:"fa-solid fa-cloud" };
};
const weatherNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : null;
};
const weatherTime = (value) => typeof value === "string" && value.includes("T") ? value.split("T")[1].slice(0, 5) : "—";
const weatherRecordFrom = (payload, tripDay) => {
  const daily = payload?.daily;
  const index = Array.isArray(daily?.time) ? daily.time.indexOf(tripDay.date) : -1;
  if (index < 0) {
    const error = new Error("forecast-unavailable");
    error.code = "forecast-unavailable";
    throw error;
  }
  const code = Number(daily.weather_code?.[index]);
  if (!Number.isFinite(code)) throw new Error("forecast-invalid");
  const info = weatherCodeInfo(code);
  return {
    label:info.label,
    icon:info.icon,
    max:weatherNumber(daily.temperature_2m_max?.[index]),
    min:weatherNumber(daily.temperature_2m_min?.[index]),
    rain:weatherNumber(daily.precipitation_probability_max?.[index]),
    wind:weatherNumber(daily.wind_speed_10m_max?.[index]),
    sunrise:weatherTime(daily.sunrise?.[index]),
    sunset:weatherTime(daily.sunset?.[index]),
  };
};
const isCurrentWeatherDay = (tripDay) => tripDay && tripDays.find((item) => item.day === state.day)?.date === tripDay.date;
const refreshWeatherForDay = (tripDay, force = false) => {
  const location = weatherLocationFor(tripDay);
  if (!tripDay || !location) return Promise.resolve();
  const key = weatherCacheKey(tripDay, location);
  const entry = weatherCache.entries[key];
  const isFresh = entry && Date.now() - Number(entry.fetchedAt) < WEATHER_CACHE_TTL;
  weatherStatusKey = key;
  if (!force && isFresh) {
    weatherStatus = "ready";
    return Promise.resolve(entry.weather);
  }
  if (weatherRequest?.key === key) return weatherRequest.promise;
  weatherStatus = entry?.weather ? "refreshing" : "loading";
  const params = new URLSearchParams({
    latitude:String(location.latitude),
    longitude:String(location.longitude),
    daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset",
    forecast_days:"16",
    timezone:"Asia/Tokyo",
  });
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);
  const promise = fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { cache:"no-store", signal:controller.signal })
    .then((response) => response.ok ? response.json() : Promise.reject(new Error(`weather-${response.status}`)))
    .then((payload) => weatherRecordFrom(payload, tripDay));
  weatherRequest = { key, promise };
  if (state.section === "itinerary" && isCurrentWeatherDay(tripDay)) renderWhenSafe();
  promise.then((weather) => {
    weatherCache.entries[key] = { fetchedAt:Date.now(), weather };
    persistWeatherCache();
    if (weatherStatusKey === key) weatherStatus = "ready";
  }).catch((error) => {
    if (weatherStatusKey === key) weatherStatus = error.code === "forecast-unavailable" ? "unavailable" : entry?.weather ? "stale" : "error";
  }).finally(() => {
    window.clearTimeout(timeout);
    if (weatherRequest?.key === key) weatherRequest = null;
    if (state.section === "itinerary" && isCurrentWeatherDay(tripDay)) renderWhenSafe();
  });
  return promise;
};
const weatherCard = (current) => {
  const location = weatherLocationFor(current);
  const key = location ? weatherCacheKey(current, location) : "";
  const entry = key ? weatherCache.entries[key] : null;
  const weather = entry?.weather;
  const status = weatherStatusKey === key ? weatherStatus : "idle";
  const busy = ["loading", "refreshing"].includes(status);
  const title = weather?.label || (busy ? "正在取得預報" : "尚無預報");
  const note = weather
    ? `${status === "refreshing" ? "正在更新；" : ""}資料來源 Open-Meteo，出發前仍建議再次確認。`
    : status === "unavailable"
      ? "這天目前不在 16 日預報範圍內，接近出發日後會自動更新。"
      : busy
        ? "正在從 Open-Meteo 取得旅行日預報。"
        : status === "error"
          ? "暫時無法取得預報，請稍後再試。"
          : "準備取得旅行日預報。";
  const temperature = weather?.max == null ? "—" : `${weather.max}°`;
  const range = weather && weather.min != null && weather.max != null ? `${weather.min}° / ${weather.max}°` : "—";
  const rain = weather?.rain == null ? "—" : `${weather.rain}%`;
  const wind = weather?.wind == null ? "—" : `${weather.wind} km/h`;
  const sunrise = weather?.sunrise || "—";
  return `<article class="weather-card"><div class="weather-card__cloud cloud-one"></div><div class="weather-card__cloud cloud-two"></div><div><p class="weather-place">${safe(current.weather || "關西")} · 旅行日天氣</p><h2>${safe(title)} ${icon(weather?.icon || (busy ? "fa-solid fa-cloud-arrow-down" : "fa-solid fa-cloud"))}</h2><p class="weather-note">${safe(note)}</p></div><div class="weather-degree"><b>${temperature}</b><span>${range}</span></div><div class="weather-facts"><span>${icon("fa-solid fa-umbrella")} ${rain}<small>降雨機率</small></span><span>${icon("fa-solid fa-wind")} ${wind}<small>最大風速</small></span><span>${icon("fa-solid fa-sun")} ${sunrise}<small>日出</small></span></div></article>`;
};

const rainPlanCard = (current) => {
  const plan = current.rainPlan || rainyPlans[current.day];
  if (!plan || !Array.isArray(plan.stops) || !plan.stops.length) return "";
  const location = weatherLocationFor(current);
  const weather = location ? weatherCache.entries[weatherCacheKey(current, location)]?.weather : null;
  const recommended = Number(weather?.rain) >= 50;
  const forecastBadge = weather?.rain == null
    ? "隨身備用"
    : recommended
      ? `降雨 ${weather.rain}% · 建議打開`
      : `降雨 ${weather.rain}% · 先收藏`;
  const sources = Array.isArray(plan.sources) ? plan.sources : [];
  return `<aside class="rain-plan-wrap" aria-label="第 ${current.day} 天雨天備案"><details class="rain-plan" ${recommended ? "open" : ""}><summary><span class="rain-plan__icon">${icon("fa-solid fa-umbrella")}</span><div class="rain-plan__heading"><span>雨天備案 <em>${safe(forecastBadge)}</em></span><h3>${safe(plan.title)}</h3><p>${safe(plan.summary)}</p></div><span class="rain-plan__toggle">${icon("fa-solid fa-chevron-down")}</span></summary><div class="rain-plan__body"><p class="rain-plan__trigger">${icon("fa-solid fa-cloud-showers-heavy")}<span><b>什麼時候換？</b>${safe(plan.trigger)}</span></p><ol class="rain-plan__list">${plan.stops.map((stop) => `<li><time>${safe(stop.time)}</time><div><h4>${safe(stop.place)}</h4><p>${safe(stop.note)}</p><a href="${mapUrl(stop.place)}" target="_blank" rel="noopener">地圖 ${icon("fa-solid fa-arrow-up-right-from-square")}</a></div></li>`).join("")}</ol>${sources.length ? `<nav class="rain-plan__sources" aria-label="雨天備案官方來源"><span>出發前再確認</span>${sources.map((source) => `<a href="${externalUrl(source.url)}" target="_blank" rel="noopener">${safe(source.label)} ${icon("fa-solid fa-arrow-up-right-from-square")}</a>`).join("")}</nav>` : ""}<p class="rain-plan__footnote">營業時間、臨時休館與天候停駛仍以當日官方公告為準。</p></div></details></aside>`;
};

function itineraryPage() {
  const current = tripDays.find((item) => item.day === state.day);
  if (!current) return `<section class="section itinerary-view"><div class="empty-state"><span>${icon("fa-solid fa-compass")}</span><p>正在載入旅程資料…</p></div></section>`;
  const completed = current.stops.filter((_, index) => state.done[`${current.day}-${index}`]).length;
  return `<section class="section itinerary-view"><div class="section-intro"><p>行程日期</p><button class="tiny-action" data-action="today" type="button">今天在哪裡？</button></div><div class="day-scroller" role="tablist" aria-label="選擇旅行日">${tripDays.map((item) => { const [date, month, weekday] = dayText(item.date); return `<button class="day-chip ${item.day === state.day ? "is-active" : ""}" data-day="${item.day}" role="tab" aria-selected="${item.day === state.day}" type="button"><small>DAY ${item.day}</small><strong>${date}/${month}</strong><em>${weekday}</em></button>`; }).join("")}</div>${weatherCard(current)}<article class="countdown-card"><span aria-hidden="true">${icon("fa-solid fa-plane-departure")}</span><div><small>距離出發</small><strong>${daysUntil()}<i>天</i></strong></div><p>大阪，我們要來了</p></article><div class="day-heading"><div><p>DAY ${current.day}</p><h2>${current.area}</h2><span>${current.date.replaceAll("-", ".")} · 已完成 ${completed}/${current.stops.length}</span></div><span class="day-orb">${current.day}</span></div>${rainPlanCard(current)}<ol class="schedule-list">${current.stops.map(([time, place, note], index) => { const key = `${current.day}-${index}`; const done = state.done[key]; return `<li class="schedule-item ${done ? "is-done" : ""}"><button class="stop-check" data-action="stop" data-key="${key}" aria-label="${done ? "標記未完成" : "標記完成"}" type="button">${done ? icon("fa-solid fa-check") : ""}</button><time>${time}</time><div class="schedule-item__copy"><h3>${safe(place)}</h3><p>${safe(note)}</p><a href="${mapUrl(place)}" target="_blank" rel="noopener">在地圖開啟 ${icon("fa-solid fa-arrow-up-right-from-square")}</a></div></li>`; }).join("")}</ol></section>`;
}
function bookingPage() { const stays = bookings.filter(([type]) => type === "住宿"); const tickets = bookings.filter(([type]) => type === "票券"); return `<section class="section booking-view"><div class="page-title"><p>旅程收納</p><h2>我的預訂</h2><span>機票、住宿、租車與憑證都放在同一個地方。</span></div><div class="booking-summary"><span>已整理</span><strong>${bookings.length}<i>項</i></strong><p>出發前再核對一次訂單。</p></div><section class="booking-section"><div class="booking-section__title"><span>${icon("fa-solid fa-plane")}</span><h3>機票</h3><small>${flights.length} 段</small></div><div class="flight-stack">${flights.map((flight) => `<article class="boarding-pass"><div class="boarding-pass__main"><small>${flight.label} · ${flight.code}</small><div><strong>${flight.from}</strong>${icon("fa-solid fa-arrow-right")}<strong>${flight.to}</strong></div><p>${flight.date}</p></div><div class="boarding-pass__stub"><span>${flight.label.includes("去程") ? "抵達時間" : "起飛時間"}</span><b>${flight.time}</b><small>${flight.code}</small></div></article>`).join("")}</div></section><section class="booking-section"><div class="booking-section__title"><span>${icon("fa-solid fa-bed")}</span><h3>住宿</h3><small>${stays.length} 間</small></div><div class="stay-stack">${stays.map(([,name,detail],index) => `<article class="stay-card"><div class="stay-card__photo stay-card__photo--${index + 1}"><span>${icon("fa-solid fa-bed")}</span></div><div><h4>${name}</h4><p>${detail}</p><small>入住資訊與地址待補</small></div><button data-action="copy" data-name="${safe(name)}" type="button" aria-label="複製 ${safe(name)}">${icon("fa-solid fa-ellipsis")}</button></article>`).join("")}</div></section><section class="booking-section"><div class="booking-section__title"><span>${icon("fa-solid fa-car-side")}</span><h3>租車</h3></div><article class="rental-card"><div class="rental-card__car">${icon("fa-solid fa-car-side")}</div><div><h4>關西自駕</h4><p>取還車時間、車型、保險與 ETC</p><small>尚待補上預訂資訊</small></div><button type="button" disabled>待補</button></article></section><section class="booking-section"><div class="booking-section__title"><span>${icon("fa-solid fa-ticket")}</span><h3>憑證</h3><small>${tickets.length} 張</small></div><div class="voucher-list">${tickets.map(([,name,detail,iconClass]) => `<article><span>${icon(iconClass)}</span><div><h4>${name}</h4><p>${detail}</p></div><button data-action="copy" data-name="${safe(name)}" type="button" aria-label="複製 ${safe(name)}">查看</button></article>`).join("")}</div></section></section>`; }
function journalPage() { return `<section class="section"><div class="page-title"><p>旅行回憶</p><h2>今日手記</h2><span>照片會褪色，當下的心情不會。</span></div><form class="journal-compose" id="journal-form"><textarea name="note" required maxlength="180" placeholder="今天最想記住的是⋯⋯"></textarea><button class="primary-button" type="submit">留下這一頁</button></form><div class="journal-list">${state.journal.length ? state.journal.slice().reverse().map((item) => `<article class="journal-entry"><div class="journal-entry__stamp">${item.day}</div><div><p>${safe(item.note)}</p><span>${item.date}</span></div><button data-action="journal-delete" data-id="${item.id}" type="button" aria-label="刪除日誌">${icon("fa-solid fa-trash-can")}</button></article>`).join("") : `<div class="empty-state journal-empty"><span>${icon("fa-solid fa-feather-pointed")}</span><p>旅程還沒開始。<br />等第一個想留下的瞬間。</p></div>`}</div></section>`; }
const toolTabs = [
  ["phrases", "常用日語", "fa-solid fa-volume-high"],
  ["exchange", "匯率換算", "fa-solid fa-arrow-right-arrow-left"],
  ["emergency", "緊急資訊", "fa-solid fa-kit-medical"],
];
const phraseCategories = [
  ["general", "通用", "fa-solid fa-comments"],
  ["hotel", "飯店", "fa-solid fa-bed"],
  ["restaurant", "餐廳", "fa-solid fa-utensils"],
  ["transport", "交通", "fa-solid fa-train-subway"],
  ["shopping", "購物", "fa-solid fa-bag-shopping"],
  ["emergency", "緊急", "fa-solid fa-triangle-exclamation"],
];
let japanesePhrases = [
  { category:"general", zh:"你好。", ja:"こんにちは。", roma:"Konnichiwa." },
  { category:"general", zh:"謝謝。", ja:"ありがとうございます。", roma:"Arigatou gozaimasu." },
  { category:"general", zh:"不好意思／借過。", ja:"すみません。", roma:"Sumimasen." },
  { category:"general", zh:"我不太會說日文。", ja:"日本語があまり話せません。", roma:"Nihongo ga amari hanasemasen." },
  { category:"general", zh:"請說慢一點。", ja:"もう少しゆっくり話してください。", roma:"Mou sukoshi yukkuri hanashite kudasai." },
  { category:"general", zh:"可以再說一次嗎？", ja:"もう一度お願いします。", roma:"Mou ichido onegaishimasu." },
  { category:"hotel", zh:"我要辦理入住。", ja:"チェックインをお願いします。", roma:"Chekku-in o onegaishimasu." },
  { category:"hotel", zh:"我有預約。", ja:"予約しています。", roma:"Yoyaku shiteimasu." },
  { category:"hotel", zh:"我們訂了兩間房。", ja:"部屋を二部屋予約しています。", roma:"Heya o futaheya yoyaku shiteimasu." },
  { category:"hotel", zh:"可以寄放行李嗎？", ja:"荷物を預かっていただけますか。", roma:"Nimotsu o azukatte itadakemasu ka." },
  { category:"hotel", zh:"退房時間是幾點？", ja:"チェックアウトは何時ですか。", roma:"Chekku-auto wa nanji desu ka." },
  { category:"restaurant", zh:"四位。", ja:"四人です。", roma:"Yonin desu." },
  { category:"restaurant", zh:"請給我菜單。", ja:"メニューをお願いします。", roma:"Menyuu o onegaishimasu." },
  { category:"restaurant", zh:"有推薦的料理嗎？", ja:"おすすめは何ですか。", roma:"Osusume wa nan desu ka." },
  { category:"restaurant", zh:"請給我這個。", ja:"これをください。", roma:"Kore o kudasai." },
  { category:"restaurant", zh:"請結帳。", ja:"お会計をお願いします。", roma:"Okaikei o onegaishimasu." },
  { category:"restaurant", zh:"可以刷卡嗎？", ja:"カードは使えますか。", roma:"Kaado wa tsukaemasu ka." },
  { category:"transport", zh:"請問車站在哪裡？", ja:"駅はどこですか。", roma:"Eki wa doko desu ka." },
  { category:"transport", zh:"這班車有到大阪嗎？", ja:"この電車は大阪に行きますか。", roma:"Kono densha wa Oosaka ni ikimasu ka." },
  { category:"transport", zh:"要在哪裡轉車？", ja:"どこで乗り換えますか。", roma:"Doko de norikaemasu ka." },
  { category:"transport", zh:"請到這個地址。", ja:"この住所までお願いします。", roma:"Kono juusho made onegaishimasu." },
  { category:"transport", zh:"我們迷路了。", ja:"道に迷いました。", roma:"Michi ni mayoimashita." },
  { category:"shopping", zh:"這個多少錢？", ja:"これはいくらですか。", roma:"Kore wa ikura desu ka." },
  { category:"shopping", zh:"可以試穿嗎？", ja:"試着してもいいですか。", roma:"Shichaku shite mo ii desu ka." },
  { category:"shopping", zh:"有別的尺寸嗎？", ja:"別のサイズはありますか。", roma:"Betsu no saizu wa arimasu ka." },
  { category:"shopping", zh:"可以免稅嗎？", ja:"免税できますか。", roma:"Menzei dekimasu ka." },
  { category:"shopping", zh:"請給我兩個。", ja:"これを二つください。", roma:"Kore o futatsu kudasai." },
  { category:"emergency", zh:"請幫幫我。", ja:"助けてください。", roma:"Tasukete kudasai." },
  { category:"emergency", zh:"請叫救護車。", ja:"救急車を呼んでください。", roma:"Kyuukyuusha o yonde kudasai." },
  { category:"emergency", zh:"我需要去醫院。", ja:"病院に行きたいです。", roma:"Byouin ni ikitai desu." },
  { category:"emergency", zh:"我的護照不見了。", ja:"パスポートをなくしました。", roma:"Pasupooto o nakushimashita." },
  { category:"emergency", zh:"請叫警察。", ja:"警察を呼んでください。", roma:"Keisatsu o yonde kudasai." },
];
const normalizeJapanesePhrases = (phrases) => (Array.isArray(phrases) ? phrases : []).filter((phrase) => phrase && typeof phrase === "object").map((phrase, index) => ({
  id: String(phrase.id || `phrase-${phrase.category || "general"}-${index}`),
  category: phraseCategories.some(([id]) => id === phrase.category) ? phrase.category : "general",
  zh: String(phrase.zh || "").trim().slice(0, 80),
  ja: String(phrase.ja || "").trim().slice(0, 120),
  roma: String(phrase.roma || "").trim().slice(0, 120),
})).filter((phrase) => phrase.zh && phrase.ja);
japanesePhrases = normalizeJapanesePhrases(japanesePhrases);
const createPhraseId = () => `phrase-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const phraseTranslationCache = new Map();
const phraseForTranslation = (zh, category, existingPhrase) => {
  if (existingPhrase?.zh === zh && existingPhrase.ja) return { ja:existingPhrase.ja, roma:existingPhrase.roma || "" };
  const knownPhrase = japanesePhrases.find((item) => item.zh === zh && item.ja);
  if (knownPhrase) return { ja:knownPhrase.ja, roma:knownPhrase.roma || "" };
  return phraseTranslationCache.get(`${category}:${zh}`) || null;
};
const generatePhraseTranslation = async (zh, category, existingPhrase) => {
  const cached = phraseForTranslation(zh, category, existingPhrase);
  if (cached?.ja && cached.roma) return cached;
  const cacheKey = `${category}:${zh}`;
  if (phraseTranslationCache.has(cacheKey)) return phraseTranslationCache.get(cacheKey);
  const response = await fetch("./api/translate-phrase", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ zh, category }),
  });
  let result = {};
  try { result = await response.json(); } catch {}
  if (!response.ok || !result.ja) throw new Error(result.error || "無法自動產生日文，請確認網路後重試");
  const generated = { ja:String(result.ja).trim(), roma:String(result.roma || "").trim() };
  phraseTranslationCache.set(cacheKey, generated);
  return generated;
};
const closePhraseEditor = () => document.querySelector(".phrase-editor-modal")?.remove();
const openPhraseEditor = (phraseId = "") => {
  const phrase = japanesePhrases.find((item) => item.id === phraseId) || { category:toolState.phraseCategory || "general", zh:"", ja:"", roma:"" };
  const categoryOptions = phraseCategories.map(([id, label]) => `<option value="${id}" ${phrase.category === id ? "selected" : ""}>${label}</option>`).join("");
  closePhraseEditor();
  app.insertAdjacentHTML("beforeend", `<div class="phrase-editor-modal"><div class="phrase-editor-modal__backdrop" data-phrase-editor-close></div><section class="phrase-editor-modal__sheet" role="dialog" aria-modal="true" aria-labelledby="phrase-editor-title"><div class="phrase-editor-modal__head"><div><small>SHARED PHRASEBOOK</small><h2 id="phrase-editor-title">${phraseId ? "編輯常用短語" : "新增常用短語"}</h2></div><button type="button" data-phrase-editor-close aria-label="關閉">×</button></div><p class="phrase-editor-modal__hint">只要輸入中文並選分類，日文與羅馬拼音會在儲存時自動產生；播放時會使用裝置的日語語音。儲存後同步給所有旅伴。</p><form class="phrase-editor-form" id="phrase-editor-form" data-phrase-id="${safe(phraseId)}"><label class="phrase-editor-field"><span>中文提示</span><input name="zh" required maxlength="80" value="${safe(phrase.zh)}" placeholder="例如：請問洗手間在哪裡？" /></label><label class="phrase-editor-field"><span>分類</span><select name="category">${categoryOptions}</select></label><div class="phrase-generated-preview"><small>自動生成內容</small><strong lang="ja">${safe(phrase.ja || "儲存後自動產生")}</strong><span>${safe(phrase.roma || "羅馬拼音會一起產生")}</span></div><p class="phrase-editor-error" aria-live="polite"></p><div class="phrase-editor-modal__actions"><button class="outline-action" type="button" data-phrase-editor-close>取消</button><button class="primary-button" type="submit">儲存並自動生成</button></div></form></section></div>`);
  if (!window.matchMedia("(pointer: coarse)").matches) app.querySelector("#phrase-editor-form input")?.focus();
};
const persistToolPreference = () => { saveToolState(); };
const activeExchangeRate = () => toolState.useManualRate && toolState.manualRate ? toolState.manualRate : toolState.rate;
const exchangeIsFresh = () => toolState.rateFetchedAt && Date.now() - toolState.rateFetchedAt < 12 * 60 * 60 * 1000;
let exchangeStatus = "idle";
let exchangeError = "";
let exchangeRequest = null;

async function refreshExchangeRate(force = false) {
  if (exchangeRequest || (!force && exchangeIsFresh())) return exchangeRequest;
  exchangeStatus = "loading";
  exchangeError = "";
  if ((state.section === "tools" && toolState.tab === "exchange") || state.section === "expenses") renderWhenSafe();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6500);
  exchangeRequest = fetch("https://api.frankfurter.dev/v2/rate/JPY/TWD", { cache:"no-store", signal:controller.signal })
    .then((response) => response.ok ? response.json() : Promise.reject(new Error("rate-request")))
    .then((data) => {
      const rate = Number(data?.rate);
      if (!(rate > 0)) throw new Error("invalid-rate");
      toolState.rate = rate;
      toolState.rateDate = String(data.date || "");
      toolState.rateFetchedAt = Date.now();
      exchangeStatus = "ready";
      saveToolState();
    })
    .catch(() => {
      exchangeStatus = "error";
      exchangeError = toolState.rate ? "目前無法更新，已沿用上次成功匯率。" : "目前無法取得匯率，請連線後重試或輸入自訂匯率。";
    })
    .finally(() => {
      window.clearTimeout(timeout);
      exchangeRequest = null;
      if ((state.section === "tools" && toolState.tab === "exchange") || state.section === "expenses") renderWhenSafe();
    });
  return exchangeRequest;
}

const toolTabNav = () => `<nav class="booking-subnav tools-tabs" role="tablist" aria-label="旅行工具分類">${toolTabs.map(([id, label, iconClass]) => `<button class="booking-subnav__item ${toolState.tab === id ? "is-active" : ""}" data-action="tool-tab" data-tab="${id}" type="button" role="tab" aria-selected="${toolState.tab === id}">${icon(iconClass)}<span>${label}</span></button>`).join("")}</nav>`;
const phraseCard = (phrase, compact = false) => `<article class="phrase-card ${compact ? "phrase-card--compact" : ""}"><div class="phrase-card__copy"><small>${safe(phrase.zh)}</small><strong lang="ja">${safe(phrase.ja)}</strong>${compact ? "" : `<span>${safe(phrase.roma)}</span>`}</div><div class="phrase-card__actions"><button data-action="phrase-copy" data-phrase="${safe(phrase.ja)}" type="button" aria-label="複製日文：${safe(phrase.zh)}">${icon("fa-regular fa-copy")}</button><button class="phrase-play" data-action="phrase-speak" data-phrase="${safe(phrase.ja)}" type="button" aria-label="播放日文：${safe(phrase.zh)}">${icon("fa-solid fa-volume-high")}</button><button data-action="phrase-edit" data-phrase-id="${safe(phrase.id)}" type="button" aria-label="編輯：${safe(phrase.zh)}">${icon("fa-solid fa-pen")}</button><button data-action="phrase-delete" data-phrase-id="${safe(phrase.id)}" type="button" aria-label="刪除：${safe(phrase.zh)}">${icon("fa-solid fa-trash-can")}</button></div></article>`;

function phrasesToolPanel() {
  const activeCategory = phraseCategories.some(([id]) => id === toolState.phraseCategory) ? toolState.phraseCategory : "general";
  const phrases = japanesePhrases.filter((phrase) => phrase.category === activeCategory);
  return `<div class="tool-panel phrase-panel" role="tabpanel"><article class="phrase-hero"><div><small>JAPANESE POCKET GUIDE</small><h3>指一下，也能把話說清楚。</h3><p>點喇叭立即播放，或把日文直接出示給對方看。</p></div><div class="speech-speed" role="group" aria-label="日語播放速度"><button class="${toolState.speechRate === "normal" ? "is-active" : ""}" data-action="speech-rate" data-rate="normal" type="button">一般</button><button class="${toolState.speechRate === "slow" ? "is-active" : ""}" data-action="speech-rate" data-rate="slow" type="button">慢速</button></div></article><div class="phrase-library-head"><div><small>SHARED PHRASEBOOK</small><h3>常用短語</h3><p>新增或調整後會同步給所有旅伴。</p></div><button class="phrase-add" data-action="phrase-add" type="button">${icon("fa-solid fa-plus")} 新增</button></div><div class="phrase-categories" role="tablist" aria-label="日語情境">${phraseCategories.map(([id, label, iconClass]) => `<button class="${activeCategory === id ? "is-active" : ""}" data-action="phrase-category" data-category="${id}" type="button" role="tab" aria-selected="${activeCategory === id}">${icon(iconClass)}<span>${label}</span></button>`).join("")}</div><div class="phrase-list">${phrases.length ? phrases.map((phrase) => phraseCard(phrase)).join("") : `<div class="phrase-empty"><span>${icon("fa-solid fa-comment-slash")}</span><p>這個分類還沒有短語。</p><button class="outline-action" data-action="phrase-add" type="button">新增第一句</button></div>`}</div><p class="speech-status" role="status" aria-live="polite">點選一句日文開始播放。</p></div>`;
}

function exchangeToolPanel() {
  const rate = activeExchangeRate();
  const fromJpy = toolState.exchangeDirection === "JPY_TWD";
  const quickAmounts = fromJpy ? [1000, 5000, 10000] : [500, 1000, 3000];
  const sourceLabel = toolState.useManualRate ? "自訂匯率" : toolState.rateDate ? `參考匯率 · ${toolState.rateDate}` : "每日參考匯率";
  const status = exchangeStatus === "loading" ? "正在更新今日匯率…" : exchangeError || (rate ? `1 JPY ≈ NT$${Number(rate).toFixed(4)}` : "尚未取得匯率，連線後會自動更新。");
  return `<div class="tool-panel exchange-panel" role="tabpanel"><article class="exchange-card"><div class="exchange-card__head"><div><small>${sourceLabel}</small><h3>旅費快速換算</h3></div><button class="exchange-refresh ${exchangeStatus === "loading" ? "is-loading" : ""}" data-action="exchange-refresh" type="button" aria-label="重新整理匯率" ${exchangeStatus === "loading" ? "disabled" : ""}>${icon("fa-solid fa-rotate")}</button></div><div class="exchange-converter"><label><span>${fromJpy ? "日圓 JPY" : "台幣 TWD"}</span><div><b>${fromJpy ? "¥" : "NT$"}</b><input id="exchange-amount" type="number" min="0" step="any" inputmode="decimal" placeholder="0" aria-label="要換算的${fromJpy ? "日圓" : "台幣"}金額" /></div></label><button class="exchange-swap" data-action="exchange-swap" type="button" aria-label="交換換算方向">${icon("fa-solid fa-arrow-down-up-across-line")}</button><div class="exchange-result"><span>${fromJpy ? "約為台幣" : "約為日圓"}</span><strong id="exchange-output" data-rate="${rate || ""}" data-direction="${toolState.exchangeDirection}">—</strong><small>${fromJpy ? "TWD · 新台幣" : "JPY · 日本円"}</small></div></div><div class="quick-amounts" aria-label="常用金額">${quickAmounts.map((amount) => `<button data-action="exchange-quick" data-amount="${amount}" type="button">${fromJpy ? "¥" : "NT$"}${new Intl.NumberFormat("zh-TW").format(amount)}</button>`).join("")}</div><p class="exchange-status ${exchangeStatus === "error" ? "is-error" : ""}" role="status">${icon(rate ? "fa-solid fa-circle-info" : "fa-solid fa-wifi")}${safe(status)}</p></article><details class="rate-editor" ${toolState.useManualRate ? "open" : ""}><summary>${icon("fa-solid fa-sliders")} 調整換算匯率</summary><form id="exchange-rate-form"><label>1 日圓等於多少台幣<input name="rate" type="number" min="0.0001" step="0.0001" inputmode="decimal" required value="${toolState.useManualRate && toolState.manualRate ? toolState.manualRate : toolState.rate || ""}" placeholder="例如 0.2200" /></label><div><button class="rate-save" type="submit">使用自訂匯率</button>${toolState.useManualRate ? `<button class="rate-auto" data-action="exchange-auto" type="button">恢復自動</button>` : ""}</div></form></details><p class="exchange-disclaimer">匯率僅供旅費概算，不含現金、刷卡匯差與手續費。</p></div>`;
}

function emergencyToolPanel() {
  const quickPhrases = japanesePhrases.filter((phrase) => phrase.category === "emergency").slice(0, 3);
  return `<div class="tool-panel emergency-panel" role="tabpanel"><article class="emergency-hero"><span>${icon("fa-solid fa-shield-heart")}</span><div><small>KEEP CALM & ASK FOR HELP</small><h3>先確認位置，再清楚求助。</h3><p>撥號按鈕會先開啟手機確認畫面，不會直接撥出。</p></div></article><div class="emergency-call-list"><article class="emergency-call emergency-call--police"><div class="emergency-call__number"><small>POLICE</small><strong>110</strong></div><div><h3>警察</h3><p>犯罪、事故或需要緊急警察協助</p></div><a href="tel:110" aria-label="撥打日本警察 110">${icon("fa-solid fa-phone")} 撥號</a></article><article class="emergency-call emergency-call--medical"><div class="emergency-call__number"><small>FIRE / EMS</small><strong>119</strong></div><div><h3>消防・救護車</h3><p>火災、重傷、突發疾病或需要救護車</p></div><a href="tel:119" aria-label="撥打日本消防或救護車 119">${icon("fa-solid fa-phone")} 撥號</a></article><article class="emergency-call emergency-call--visitor"><div class="emergency-call__number"><small>JNTO 24H</small><strong>旅客</strong></div><div><h3>Japan Visitor Hotline</h3><p>中文／英文／韓文支援 · 事故、疾病與災害協助</p><b>050-3816-2787</b></div><a href="tel:05038162787" aria-label="撥打 JNTO 旅客熱線 050-3816-2787">${icon("fa-solid fa-phone")} 撥號</a></article></div><div class="emergency-phrases"><div class="tool-section-heading"><small>QUICK VOICE</small><h3>緊急求助日語</h3></div>${quickPhrases.map((phrase) => phraseCard(phrase, true)).join("")}</div><a class="official-emergency-link" href="https://www.japan.travel/en/plan/hotline/" target="_blank" rel="noopener">查看 JNTO 官方緊急資訊 ${icon("fa-solid fa-arrow-up-right-from-square")}</a><p class="emergency-note">通話時盡量提供目前地址、附近地標、受傷人數與可回撥的電話。</p><p class="speech-status" role="status" aria-live="polite">可播放日文求助句給身旁的人聽。</p></div>`;
}

function toolsPage() {
  const panels = { phrases:phrasesToolPanel, exchange:exchangeToolPanel, emergency:emergencyToolPanel };
  return `<section class="section tools-view"><div class="tools-page-title"><p>TRAVEL TOOLBOX</p><h2>旅途小工具</h2><span>需要開口、換算或求助時，這一頁隨手就到。</span></div>${toolTabNav()}${panels[toolState.tab]()}</section>`;
}
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
    button.disabled = code === "TWD" && !(currency.rate > 0);
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
    amountInput.step = currency.code === "JPY" ? "1" : "0.01";
    amountInput.inputMode = currency.code === "JPY" ? "numeric" : "decimal";
    amountInput.disabled = currency.code === "TWD" && !(currency.rate > 0);
  }
  const submit = document.querySelector("#expense-form .primary-button");
  if (submit) {
    submit.textContent = `記下這筆${currency.label}支出`;
    submit.disabled = currency.code === "TWD" && !(currency.rate > 0);
  }
  const rateHint = document.querySelector(".expense-rate-hint");
  if (rateHint) rateHint.textContent = expenseRateNote(currency.rate);
  document.querySelectorAll(".ledger article p").forEach((entry) => {
    entry.textContent = entry.textContent.replace(/·\s*(JPY|TWD)$/, `· ${currency.code}`);
  });
}
let activeJapaneseUtterance = null;
const setSpeechStatus = (message) => { const status = document.querySelector(".speech-status"); if (status) status.textContent = message; };
const stopJapaneseSpeech = () => {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  activeJapaneseUtterance = null;
  document.querySelectorAll(".phrase-card.is-speaking").forEach((card) => card.classList.remove("is-speaking"));
};
const speakJapanese = (button, text) => {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    setSpeechStatus("這台裝置不支援即時朗讀，請複製或直接出示日文文字。");
    return;
  }
  stopJapaneseSpeech();
  const utterance = new SpeechSynthesisUtterance(text);
  const japaneseVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang?.toLowerCase().startsWith("ja"));
  utterance.lang = "ja-JP";
  utterance.rate = toolState.speechRate === "slow" ? 0.65 : 0.88;
  utterance.pitch = 1;
  if (japaneseVoice) utterance.voice = japaneseVoice;
  const card = button.closest(".phrase-card");
  card?.classList.add("is-speaking");
  setSpeechStatus(`播放中：${text}`);
  const finish = (failed = false) => {
    card?.classList.remove("is-speaking");
    if (activeJapaneseUtterance === utterance) activeJapaneseUtterance = null;
    setSpeechStatus(failed ? "語音播放失敗，請複製或直接出示日文文字。" : "播放完成，可再點一次重播。");
  };
  utterance.onend = () => finish(false);
  utterance.onerror = () => finish(true);
  activeJapaneseUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};
const updateExchangeResult = () => {
  const input = document.querySelector("#exchange-amount");
  const output = document.querySelector("#exchange-output");
  if (!input || !output) return;
  const amount = Number(input.value);
  const rate = Number(output.dataset.rate);
  if (!(amount >= 0) || !(rate > 0) || input.value === "") { output.textContent = "—"; return; }
  const converted = output.dataset.direction === "JPY_TWD" ? amount * rate : amount / rate;
  const prefix = output.dataset.direction === "JPY_TWD" ? "NT$" : "¥";
  output.textContent = `${prefix}${new Intl.NumberFormat("zh-TW", { maximumFractionDigits:0 }).format(Math.round(converted))}`;
};
const renderPageContent = (markup, { preserveScroll = true } = {}) => {
  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;
  if (app.innerHTML !== markup) app.innerHTML = markup;
  updateExpenseCurrencyUI();
  document.querySelectorAll(".bottom-nav__item").forEach((button) => button.classList.toggle("is-active", button.dataset.section === state.section));
  if (preserveScroll && (window.scrollY !== scrollTop || window.scrollX !== scrollLeft)) {
    window.scrollTo({ top:scrollTop, left:scrollLeft, behavior:"auto" });
  }
};
window.renderPageContent = renderPageContent;
function render(options = {}) { const pages = { itinerary:itineraryPage, bookings:bookingPage, expenses:syncedExpensePage, planning:planningPage, tools:toolsPage }; const page = pages[state.section] || itineraryPage; const markup = page(); stopJapaneseSpeech(); renderPageContent(window.matchMedia("(pointer: coarse)").matches ? markup.replace(/\sautofocus(?=[\s>])/g, "") : markup, options); }
const renderWhenSafe = (options = {}) => {
  if (document.querySelector(".phrase-editor-modal, .planning-modal, .edit-modal, .member-modal")) return false;
  render(options);
  return true;
};
window.renderWhenSafe = renderWhenSafe;
document.querySelector(".bottom-nav").addEventListener("click", (event) => { const button = event.target.closest("[data-section]"); if (button) { stopJapaneseSpeech(); state.section = button.dataset.section; render({ preserveScroll:false }); if ((state.section === "tools" && toolState.tab === "exchange") || state.section === "expenses") refreshExchangeRate(); window.scrollTo({ top:0, behavior:"smooth" }); } });
app.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action], [data-day]");
  if (!button) return;
  if (button.dataset.day) { state.day = Number(button.dataset.day); save(); render(); refreshWeatherForDay(tripDays.find((item) => item.day === state.day)); return; }
  const { action, key, id, name, phraseId } = button.dataset;
  if (action === "expense-currency") {
    if (button.dataset.currency === "TWD" && !(activeExchangeRate() > 0)) { refreshExchangeRate(); return; }
    state.expenseCurrency = button.dataset.currency === "TWD" ? "TWD" : "JPY";
    localStorage.setItem("osaka-expense-currency", state.expenseCurrency);
    render();
    return;
  }
  if (action === "stop") { state.done[key] = !state.done[key]; save(); render(); }
  if (action === "task") { state.tasks[key] = !state.tasks[key]; save(); render(); }
  if (action === "expense-delete") { state.expenses = state.expenses.filter((item) => item.id !== id); save(); render(); }
  if (action === "copy") { navigator.clipboard?.writeText(name).catch(() => {}); button.textContent = "已複製"; }
  if (action === "tool-tab") {
    toolState.tab = button.dataset.tab;
    persistToolPreference();
    render();
    if (toolState.tab === "exchange") refreshExchangeRate();
    return;
  }
  if (action === "phrase-category") { toolState.phraseCategory = button.dataset.category; persistToolPreference(); render(); return; }
  if (action === "phrase-add") { openPhraseEditor(); return; }
  if (action === "phrase-edit") { openPhraseEditor(phraseId); return; }
  if (action === "phrase-delete") {
    const phrase = japanesePhrases.find((item) => item.id === phraseId);
    if (!phrase || !window.confirm(`刪除「${phrase.zh}」？這會同步移除所有旅伴看到的版本。`)) return;
    japanesePhrases = japanesePhrases.filter((item) => item.id !== phraseId);
    save();
    render();
    return;
  }
  if (action === "speech-rate") { toolState.speechRate = button.dataset.rate === "slow" ? "slow" : "normal"; persistToolPreference(); render(); return; }
  if (action === "phrase-speak") { speakJapanese(button, button.dataset.phrase); return; }
  if (action === "phrase-copy") {
    navigator.clipboard?.writeText(button.dataset.phrase).then(() => { setSpeechStatus("日文已複製。可貼到翻譯、訊息或備忘錄中。"); }).catch(() => { setSpeechStatus("無法自動複製，請長按日文文字選取。"); });
    return;
  }
  if (action === "exchange-refresh") { refreshExchangeRate(true); return; }
  if (action === "exchange-swap") { toolState.exchangeDirection = toolState.exchangeDirection === "JPY_TWD" ? "TWD_JPY" : "JPY_TWD"; persistToolPreference(); render(); return; }
  if (action === "exchange-quick") { const input = document.querySelector("#exchange-amount"); if (input) { input.value = button.dataset.amount; updateExchangeResult(); } return; }
  if (action === "exchange-auto") { toolState.useManualRate = false; persistToolPreference(); render(); refreshExchangeRate(true); return; }
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
  if (event.target.closest("[data-phrase-editor-close]")) { closePhraseEditor(); return; }
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
app.addEventListener("input", (event) => { if (event.target.id === "exchange-amount") updateExchangeResult(); });
app.addEventListener("submit", async (event) => {
  const form = event.target;
  if (form.id === "phrase-editor-form") {
    event.preventDefault();
    const data = new FormData(form);
    const zh = String(data.get("zh") || "").trim();
    const category = String(data.get("category") || "general");
    const existingPhrase = japanesePhrases.find((item) => item.id === form.dataset.phraseId);
    const error = form.querySelector(".phrase-editor-error");
    const submitButton = form.querySelector("button[type='submit']");
    if (!zh) { if (error) error.textContent = "請先輸入中文提示。"; return; }
    if (error) error.textContent = "正在產生日文與羅馬拼音…";
    form.setAttribute("aria-busy", "true");
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = "生成中…"; }
    let generated;
    try {
      generated = await generatePhraseTranslation(zh, category, existingPhrase);
    } catch (translationError) {
      if (error) error.textContent = translationError.message || "無法自動產生，請稍後重試。";
      form.removeAttribute("aria-busy");
      if (submitButton) { submitButton.disabled = false; submitButton.textContent = "儲存並自動生成"; }
      return;
    }
    const phrase = { id:form.dataset.phraseId || createPhraseId(), category, zh, ja:generated.ja, roma:generated.roma };
    const existingIndex = japanesePhrases.findIndex((item) => item.id === phrase.id);
    if (existingIndex >= 0) japanesePhrases[existingIndex] = phrase;
    else japanesePhrases.push(phrase);
    closePhraseEditor();
    save();
    render();
    return;
  }
  if (!["expense-form", "journal-form", "planning-form", "exchange-rate-form"].includes(form.id)) return;
  event.preventDefault();
  const data = new FormData(form);
  if (form.id === "exchange-rate-form") {
    const rate = Number(data.get("rate"));
    if (!(rate > 0)) return;
    toolState.manualRate = rate;
    toolState.useManualRate = true;
    persistToolPreference();
    exchangeError = "";
    render();
    return;
  }
  if (form.id === "expense-form") state.expenses.push({ id:crypto.randomUUID(), item:data.get("item"), amount:Number(data.get("amount")), category:data.get("category"), payer:data.get("payer") });
  if (form.id === "journal-form") state.journal.push({ id:crypto.randomUUID(), note:data.get("note"), day:`DAY ${state.day}`, date:new Date().toLocaleDateString("zh-TW") });
  if (form.id === "planning-form") {
    const title = String(data.get("title") || "").trim();
    if (!title) return;
    const assignees = state.planningMemberFilter === "all" ? planningMembers().map((member) => member.id) : [state.planningMemberFilter];
    planningItems.push({ id:crypto.randomUUID(), category:state.planningTab, title:title.slice(0, 60), note:String(data.get("note") || "").trim().slice(0, 180), assignees, completedBy:[] });
  }
  save();
  render();
});
app.addEventListener("submit", (event) => {
  if (event.target.id !== "expense-form" || state.expenseCurrency === "JPY") return;
  const amount = event.target.elements.amount;
  if (amount?.value) amount.value = Math.round(Number(amount.value) / currentExpenseCurrency().rate);
}, true);
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
if (initial.tripDays || initial.planningItems || initial.japanesePhrases) applyTripContent(initial);
render();
refreshWeatherForDay(tripDays.find((item) => item.day === state.day));
if (state.section === "expenses" || (state.section === "tools" && toolState.tab === "exchange")) refreshExchangeRate();
fetch("./api/state", { cache:"no-store" }).then((response) => response.ok ? response.json() : Promise.reject()).then(({ data }) => { if (!data || typeof data !== "object") return; state.day = Number(data.day) || state.day; state.done = data.done || state.done; state.tasks = data.tasks || state.tasks; state.expenses = Array.isArray(data.expenses) ? data.expenses : state.expenses; state.journal = Array.isArray(data.journal) ? data.journal : state.journal; state.planningTab = planningTabs.some(([id]) => id === data.planningTab) ? data.planningTab : state.planningTab; state.planningMemberFilter = data.planningMemberFilter || state.planningMemberFilter; applyTripContent(data); if (data.bookings) { applyBookingData(data.bookings); } if (Array.isArray(data.members)) { syncedMembers = data.members; window.applyMembersData?.(data.members); } localStorage.setItem("osaka-travel-state", JSON.stringify(sharedData())); renderWhenSafe(); refreshWeatherForDay(tripDays.find((item) => item.day === state.day)); }).catch(() => {});
