(() => {
  const EDIT_PASSWORD = "0726";
  const STORAGE_KEY = "osaka-booking-records";
  const stayImages = {
    "Guest House Kyoan": "./images/stays/guest-house-kyoan.jpg",
    "Party&Resort ZERO'sHOUSE": "./images/stays/party-resort-zeros-house.jpg",
    "KYOTO TANGO MIYAZU inn": "./images/stays/kyoto-tango-miyazu-inn.jpg",
    "鹿の宿": "./images/stays/shika-no-yado.jpg",
  };

  const defaults = { flight: {}, flights: [], stays: [], rental: {}, vouchers: [] };

  let bookingData;
  try { bookingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || defaults; } catch { bookingData = defaults; }
  const syncAppBookings = () => window.applyBookingData?.(bookingData);
  const saveBookingData = () => {
    syncAppBookings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
    return fetch("./api/state", { method:"PUT", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ data:{ bookings:bookingData, tripDays, planningItems } }) }).catch(() => null);
  };
  const loadBookingData = async () => {
    try {
      const response = await fetch("./api/state", { cache:"no-store" });
      if (!response.ok) return;
      const payload = await response.json();
      if (!payload.data || !payload.data.bookings) return;
      bookingData = { ...bookingData, ...payload.data.bookings, flight:{ ...bookingData.flight, ...(payload.data.bookings.flight || {}) }, rental:{ ...bookingData.rental, ...(payload.data.bookings.rental || {}) }, stays:Array.isArray(payload.data.bookings.stays) ? payload.data.bookings.stays : bookingData.stays, vouchers:Array.isArray(payload.data.bookings.vouchers) ? payload.data.bookings.vouchers : bookingData.vouchers };
      syncAppBookings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
      render();
    } catch {}
  };
  const imageForStay = (name, index) => stayImages[name] || Object.values(stayImages)[index % Object.values(stayImages).length];
  const field = (label, name, value, type = "text", extra = "") => {
    const isNativeDateTime = type === "date" || type === "time";
    const input = `<input name="${name}" type="${type}" value="${safe(value ?? "")}" ${extra} />`;
    return `<label class="edit-field"><span>${label}</span>${isNativeDateTime ? `<span class="edit-field__control">${input}</span>` : input}</label>`;
  };

  const openModal = (content) => {
    document.querySelector(".edit-modal")?.remove();
    const modal = document.createElement("div");
    modal.className = "edit-modal";
    modal.innerHTML = `<div class="edit-modal__backdrop" data-close-edit></div><section class="edit-modal__sheet" role="dialog" aria-modal="true">${content}</section>`;
    document.body.appendChild(modal);
    if (!window.matchMedia("(pointer: coarse)").matches) modal.querySelector("input")?.focus();
    return modal;
  };

  const passwordGate = (target) => {
    const modal = openModal(`<div class="edit-modal__head"><div><small>需要驗證</small><h2>輸入編輯密碼</h2></div><button type="button" data-close-edit aria-label="關閉">×</button></div><p class="edit-modal__hint">輸入密碼後才能修改這筆旅行資料。</p><form class="password-form"><label class="edit-field"><span>編輯密碼</span><input name="password" type="password" inputmode="numeric" autocomplete="off" maxlength="4" placeholder="••••" required /></label><p class="edit-error" aria-live="polite"></p><button class="primary-button" type="submit">繼續編輯</button></form>`);
    modal.querySelector(".password-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const error = modal.querySelector(".edit-error");
      if (new FormData(event.currentTarget).get("password") !== EDIT_PASSWORD) { error.textContent = "密碼不正確，請再試一次。"; return; }
      modal.remove();
      editor(target);
    });
  };

  const editor = (target) => {
    if (target.type === "flight") {
      const item = bookingData.flight;
      openModal(`<div class="edit-modal__head"><div><small>機票資料</small><h2>編輯航班資訊</h2></div><button type="button" data-close-edit aria-label="關閉">×</button></div><form class="edit-form" data-editor="flight">${field("航空公司", "airline", item.airline)}${field("航班編號", "code", item.code)}<div class="edit-grid">${field("出發機場", "fromCode", item.fromCode)}${field("抵達機場", "toCode", item.toCode)}${field("出發城市", "from", item.from)}${field("抵達城市", "to", item.to)}${field("起飛時間", "departure", item.departure, "time")}${field("抵達時間", "arrival", item.arrival, "time")}</div>${field("日期", "date", item.date)}<div class="edit-grid">${field("行李", "baggage", item.baggage)}${field("機型", "aircraft", item.aircraft)}${field("價格 NT$", "price", item.price, "text", "inputmode=decimal")}${field("購買日期", "purchased", item.purchased)}</div><div class="edit-modal__actions"><button class="outline-action" type="button" data-close-edit>取消</button><button class="primary-button" type="submit">儲存航班</button></div></form>`);
      return;
    }
    if (target.type === "stay") {
      const item = target.index === null ? { name: "", location: "", detail: "", checkIn: "", checkInTime: "15:00", checkOut: "", checkOutTime: "11:00", total: "" } : bookingData.stays[target.index];
      openModal(`<div class="edit-modal__head"><div><small>住宿資料</small><h2>${target.index === null ? "新增住宿" : "編輯住宿"}</h2></div><button type="button" data-close-edit aria-label="關閉">×</button></div><form class="edit-form" data-editor="stay" data-index="${target.index === null ? "new" : target.index}">${field("住宿名稱", "name", item.name, "text", "required")}${field("城市／地區", "location", item.location, "text", "required")}${field("顯示日期", "detail", item.detail)}<div class="edit-grid">${field("入住日期", "checkIn", item.checkIn, "date")}${field("入住時間", "checkInTime", item.checkInTime, "time")}${field("退房日期", "checkOut", item.checkOut, "date")}${field("退房時間", "checkOutTime", item.checkOutTime, "time")}</div>${field("總價 NT$", "total", item.total, "text", "inputmode=decimal")}<div class="edit-modal__actions"><button class="outline-action" type="button" data-close-edit>取消</button><button class="primary-button" type="submit">儲存住宿</button></div></form>`);
      return;
    }
    if (target.type === "rental") {
      const item = bookingData.rental;
      openModal(`<div class="edit-modal__head"><div><small>租車資料</small><h2>編輯租車預約</h2></div><button type="button" data-close-edit aria-label="關閉">×</button></div><form class="edit-form" data-editor="rental">${field("租車標題", "title", item.title)}${field("租車公司", "company", item.company)}${field("預約編號", "reservation", item.reservation)}<div class="edit-grid">${field("取車時間", "pickup", item.pickup)}${field("取車地點", "pickupLocation", item.pickupLocation)}${field("還車時間", "return", item.return)}${field("還車地點", "returnLocation", item.returnLocation)}</div><div class="edit-modal__actions"><button class="outline-action" type="button" data-close-edit>取消</button><button class="primary-button" type="submit">儲存租車</button></div></form>`);
      return;
    }
    const item = target.index === null ? { type: "憑證", title: "", file: "PDF" } : bookingData.vouchers[target.index];
    openModal(`<div class="edit-modal__head"><div><small>票券資料</small><h2>${target.index === null ? "新增憑證" : "編輯憑證"}</h2></div><button type="button" data-close-edit aria-label="關閉">×</button></div><form class="edit-form" data-editor="voucher" data-index="${target.index === null ? "new" : target.index}">${field("類型", "type", item.type)}${field("憑證名稱", "title", item.title, "text", "required")}${field("檔案類型", "file", item.file)}<div class="edit-modal__actions"><button class="outline-action" type="button" data-close-edit>取消</button><button class="primary-button" type="submit">儲存憑證</button></div></form>`);
  };

  let editFlightPanel = () => {
    const item = bookingData.flight;
    return `<section class="booking-panel booking-panel--flight"><div class="booking-panel__eyebrow"><span>${safe(item.airline)}</span><small>同一張訂單</small></div><div class="flight-code">${safe(item.code)}</div><div class="flight-route"><div><strong>${safe(item.fromCode)}</strong><small>${safe(item.from)}</small><b>${safe(item.departure)}</b></div><div class="flight-route__path"><small>${safe(item.duration)}</small><i class="fa-solid fa-plane" aria-hidden="true"></i><span></span><small>${safe(item.date)}</small></div><div><strong>${safe(item.toCode)}</strong><small>${safe(item.to)}</small><b>${safe(item.arrival)}</b></div></div><div class="flight-facts"><div><small>BAGGAGE</small><strong><i class="fa-solid fa-suitcase-rolling" aria-hidden="true"></i> ${safe(item.baggage)}</strong></div><div><small>AIRCRAFT</small><strong><i class="fa-solid fa-plane-up" aria-hidden="true"></i> ${safe(item.aircraft)}</strong></div></div><div class="flight-meta"><div><small>PRICE &amp; TYPE</small><strong>NT$ ${safe(item.price)}</strong><span>同一張訂單</span></div><div><small>PURCHASED</small><strong>${safe(item.purchased)}</strong><span>${safe(item.purchaseNote)}</span></div></div><button class="outline-action" type="button" data-edit="flight"><i class="fa-solid fa-pen" aria-hidden="true"></i> 編輯航班資訊</button></section>`;
  };

  const editFlightCards = () => {
    const items = Array.isArray(bookingData.flights) && bookingData.flights.length ? bookingData.flights : [bookingData.flight];
    const airportCodes = { "高雄":"KHH", "關西":"KIX" };
    return `<section class="booking-panel booking-panel--flight"><div class="flight-panel-stack">${items.map((item, index) => { const direction = item.label || (index === 0 ? "去程" : "回程"); const fromCode = item.fromCode || airportCodes[item.from] || ""; const toCode = item.toCode || airportCodes[item.to] || ""; return `<article class="flight-ticket"><div class="booking-panel__eyebrow"><span>${safe(direction)}</span><small>航班資訊</small></div><div class="flight-code">${safe(item.code)}</div><div class="flight-route"><div><strong>${safe(fromCode)}</strong><small>${safe(item.from)}</small><b>${safe(item.departure)}</b></div><div class="flight-route__path"><small>${safe(item.duration || "航班")}</small><i class="fa-solid fa-plane" aria-hidden="true"></i><span></span><small>${safe(item.date)}</small></div><div><strong>${safe(toCode)}</strong><small>${safe(item.to)}</small><b>${safe(item.arrival)}</b></div></div><button class="outline-action" type="button" data-edit="flight" data-index="${index}"><i class="fa-solid fa-pen" aria-hidden="true"></i> 編輯航班資訊</button></article>`; }).join("")}</div></section>`;
  };
  editFlightPanel = editFlightCards;

  const editStaysPanel = () => `<section class="booking-panel booking-panel--stays"><button class="add-stay" type="button" data-new="stay"><i class="fa-solid fa-plus" aria-hidden="true"></i> 新增住宿</button><div class="stay-visual-list">${bookingData.stays.map((item, index) => `<article class="stay-visual-card"><div class="stay-visual-card__photo" style="background-image:url('${imageForStay(item.name, index)}')" role="img" aria-label="${safe(item.name)}住宿照片"><span class="location-tag"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${safe(item.location)}</span></div><div class="stay-visual-card__body"><div><h3>${safe(item.name)}</h3><p>${safe(item.detail)}</p></div><button type="button" data-edit="stay" data-index="${index}" aria-label="編輯 ${safe(item.name)}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button></div><div class="stay-visual-card__dates"><div><small>CHECK-IN</small><strong>${safe(item.checkIn)}</strong><span>${safe(item.checkInTime)}</span></div><b>→</b><div><small>CHECK-OUT</small><strong>${safe(item.checkOut)}</strong><span>${safe(item.checkOutTime)}</span></div></div><div class="stay-visual-card__total"><span>Total</span><strong>NT$ ${safe(item.total)}</strong></div></article>`).join("")}</div></section>`;

  const editRentalPanel = () => { const item = bookingData.rental; return `<section class="booking-panel booking-panel--rental"><article class="rental-hero"><div class="rental-hero__heading"><span class="rental-icon"><i class="fa-solid fa-car" aria-hidden="true"></i></span><div><small>租車預約</small><h2>${safe(item.title)}</h2><p>${safe(item.company)}</p></div><button type="button" data-edit="rental" aria-label="編輯租車"><i class="fa-solid fa-pen" aria-hidden="true"></i></button></div><div class="rental-number"><small>預約編號</small><strong>${safe(item.reservation)}</strong></div><div class="rental-timeline"><div><span class="timeline-dot timeline-dot--green"><i class="fa-solid fa-key" aria-hidden="true"></i></span><small>PICK-UP 取車</small><strong>${safe(item.pickup)}</strong><p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${safe(item.pickupLocation)}</p></div><div><span class="timeline-dot timeline-dot--orange"><i class="fa-solid fa-flag-checkered" aria-hidden="true"></i></span><small>RETURN 還車</small><strong>${safe(item.return)}</strong><p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${safe(item.returnLocation)}</p></div></div></article></section>`; };

  const editVouchersPanel = () => `<section class="booking-panel booking-panel--vouchers"><label class="voucher-search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input type="search" placeholder="搜尋憑證／平台…" /></label><button class="primary-button voucher-add" type="button" data-new="voucher"><i class="fa-solid fa-plus" aria-hidden="true"></i> 新增憑證</button>${bookingData.vouchers.map((item, index) => `<article class="voucher-card"><span class="voucher-card__badge">${safe(item.type)}</span><strong>${safe(item.title)}</strong><button type="button" data-edit="voucher" data-index="${index}" aria-label="編輯 ${safe(item.title)}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button><div class="voucher-card__file"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i><small>${safe(item.file)}</small></div></article>`).join("")}</section>`;

  const bookingPage = () => {
    const tab = state.bookingTab || "flights";
    const panel = { flights:editFlightPanel, stays:editStaysPanel, rental:editRentalPanel, vouchers:editVouchersPanel }[tab]();
    const tabItems = [["flights", "機票", "fa-solid fa-plane"], ["stays", "住宿", "fa-solid fa-building"], ["rental", "租車", "fa-solid fa-car"], ["vouchers", "憑證", "fa-solid fa-ticket"]];
    return `<section class="section booking-view booking-redesign"><div class="booking-page-title"><p>旅程收納</p><h2>我的預訂</h2><span>把航班、住宿和旅途票券放在一起。</span></div><nav class="booking-subnav" aria-label="預訂分類">${tabItems.map(([id, label, iconClass]) => `<button class="booking-subnav__item ${tab === id ? "is-active" : ""}" data-booking-tab="${id}" type="button"><i class="${iconClass}" aria-hidden="true"></i><span>${label}</span></button>`).join("")}</nav>${panel}</section>`;
  };

  const baseRender = render;
  render = () => {
    if (state.section !== "bookings") return baseRender();
    app.innerHTML = bookingPage();
    document.querySelectorAll(".bottom-nav__item").forEach((button) => button.classList.toggle("is-active", button.dataset.section === state.section));
  };

  const closeModal = () => document.querySelector(".edit-modal")?.remove();
  let activeFlightIndex = 0;
  document.addEventListener("click", (event) => {
    const flightEdit = event.target.closest('[data-edit="flight"]');
    if (!flightEdit) return;
    activeFlightIndex = Number(flightEdit.dataset.index || 0);
    if (Array.isArray(bookingData.flights) && bookingData.flights[activeFlightIndex]) bookingData.flight = bookingData.flights[activeFlightIndex];
  }, true);
  document.addEventListener("submit", (event) => {
    const form = event.target.closest('.edit-form[data-editor="flight"]');
    if (!form || !Array.isArray(bookingData.flights) || !bookingData.flights[activeFlightIndex]) return;
    bookingData.flights[activeFlightIndex] = { ...bookingData.flights[activeFlightIndex], ...Object.fromEntries(new FormData(form).entries()) };
  }, true);
  document.addEventListener("click", (event) => {
    const close = event.target.closest("[data-close-edit]");
    if (close) { closeModal(); return; }
    const tab = event.target.closest("[data-booking-tab]");
    if (tab) { state.bookingTab = tab.dataset.bookingTab; render(); return; }
    const edit = event.target.closest("[data-edit]");
    if (edit) { passwordGate({ type:edit.dataset.edit, index:edit.dataset.index === undefined ? null : Number(edit.dataset.index) }); return; }
    const add = event.target.closest("[data-new]");
    if (add) { passwordGate({ type:add.dataset.new, index:null }); }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest(".edit-form");
    if (!form) return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const kind = form.dataset.editor;
    if (kind === "flight") bookingData.flight = { ...bookingData.flight, ...values };
    if (kind === "stay") { const index = form.dataset.index === "new" ? null : Number(form.dataset.index); if (index === null) bookingData.stays.push(values); else bookingData.stays[index] = { ...bookingData.stays[index], ...values }; }
    if (kind === "rental") bookingData.rental = { ...bookingData.rental, ...values };
    if (kind === "voucher") { const index = form.dataset.index === "new" ? null : Number(form.dataset.index); if (index === null) bookingData.vouchers.push(values); else bookingData.vouchers[index] = { ...bookingData.vouchers[index], ...values }; }
    saveBookingData();
    closeModal();
    render();
  });

  render();
  loadBookingData();
})();
