(() => {
  const stayImages = {
    "Guest House Kyoan": "./images/stays/guest-house-kyoan.jpg",
    "Party&Resort ZERO'sHOUSE": "./images/stays/party-resort-zeros-house.jpg",
    "KYOTO TANGO MIYAZU inn": "./images/stays/kyoto-tango-miyazu-inn.jpg",
    "鹿の宿": "./images/stays/shika-no-yado.jpg",
  };

  const tabs = [
    ["flights", "機票", "fa-solid fa-plane"],
    ["activities", "活動", "fa-solid fa-ticket"],
    ["stays", "住宿", "fa-solid fa-building"],
    ["rental", "租車", "fa-solid fa-car"],
    ["vouchers", "憑證", "fa-solid fa-qrcode"],
  ];

  const bookingSource = () => syncedBookings && typeof syncedBookings === "object" ? syncedBookings : {};
  const dateText = (date) => String(date || "").replaceAll("-", " /");
  const tabNav = () => `<nav class="booking-subnav" aria-label="預訂分類">${tabs.map(([id, label, iconClass]) => `<button class="booking-subnav__item ${state.bookingTab === id ? "is-active" : ""}" data-booking-tab="${id}" type="button"><i class="${iconClass}" aria-hidden="true"></i><span>${label}</span></button>`).join("")}</nav>`;

  const flightPanel = () => `<section class="booking-panel booking-panel--flight"><div class="booking-panel__eyebrow"><span>航班資訊</span><small>請以航空公司通知為準</small></div><div class="flight-booking-list">${flights.length ? flights.map((flight) => `<article class="flight-booking-card"><div class="flight-booking-card__head"><span>${safe(flight.airline || "航空公司待確認")}</span><b>${safe(flight.label)} · ${safe(flight.code)}</b></div><div class="flight-route"><div><strong>${safe(flight.from)}</strong><small>出發</small><b>${safe(flight.time.split("-")[0] || "—")}</b></div><div class="flight-route__path"><small>${safe(dateText(flight.date))}</small><i class="fa-solid fa-plane" aria-hidden="true"></i></div><div><strong>${safe(flight.to)}</strong><small>抵達</small><b>${safe(flight.time.split("-")[1] || "—")}</b></div></div><div class="flight-note-grid"><p><i class="fa-solid fa-plane-departure" aria-hidden="true"></i>${safe(flight.terminal || "航廈待確認")}</p><p><i class="fa-solid fa-suitcase-rolling" aria-hidden="true"></i>${safe(flight.baggageNote || "行李額度待確認")}</p></div>${flight.verifyNote ? `<p class="flight-verify">${safe(flight.verifyNote)}</p>` : ""}</article>`).join("") : `<p class="booking-empty">尚未加入航班資料。</p>`}</div></section>`;

  const activitiesPanel = () => {
    const activities = Array.isArray(bookingSource().activities) ? bookingSource().activities : [];
    return `<section class="booking-panel booking-panel--activities"><div class="activity-panel-heading"><div><p>已確認行程</p><h3>活動預約</h3></div><span>${activities.length} 項</span></div><div class="activity-list">${activities.length ? activities.map((activity) => `<article class="activity-card"><span class="activity-card__icon"><i class="fa-solid fa-ticket" aria-hidden="true"></i></span><div><div class="activity-card__head"><h4>${safe(activity.title)}</h4><b>${safe(activity.status || "已整理")}</b></div><p>${safe(dateText(activity.date))} · ${safe(activity.time)}</p><small>${safe(activity.note || activity.place || "")}</small>${activity.place ? `<a href="${mapUrl(activity.place)}" target="_blank" rel="noopener">地圖 <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>` : ""}</div></article>`).join("") : `<p class="booking-empty">尚未加入活動預約。</p>`}</div></section>`;
  };

  const staysPanel = () => {
    const stays = Array.isArray(bookingSource().stays) ? bookingSource().stays : [];
    return `<section class="booking-panel booking-panel--stays"><div class="stay-visual-list">${stays.length ? stays.map((stay) => `<article class="stay-visual-card"><div class="stay-visual-card__photo" style="background-image:url('${stayImages[stay.name] || ""}')" role="img" aria-label="${safe(stay.name)}住宿照片"><span class="location-tag"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${safe(stay.location || "住宿")}</span></div><div class="stay-visual-card__body"><div><h3>${safe(stay.name)}</h3><p>${safe(stay.detail || "")}</p></div></div><div class="stay-visual-card__dates"><div><small>CHECK-IN</small><strong>${safe(dateText(stay.checkIn))}</strong><span>${safe(stay.checkInTime || "待確認")}</span></div><b>→</b><div><small>CHECK-OUT</small><strong>${safe(dateText(stay.checkOut))}</strong><span>${safe(stay.checkOutTime || "待確認")}</span></div></div><div class="stay-visual-card__total"><span>預訂金額</span><strong>${safe(stay.total || "待補")}</strong></div></article>`).join("") : `<p class="booking-empty">尚未加入住宿資料。</p>`}</div></section>`;
  };

  const rentalPanel = () => {
    const rental = bookingSource().rental || {};
    const hasReservation = rental.company || rental.reservation || rental.pickup || rental.return;
    return `<section class="booking-panel booking-panel--rental"><article class="rental-hero"><div class="rental-hero__heading"><span class="rental-icon"><i class="fa-solid fa-car" aria-hidden="true"></i></span><div><small>租車預約</small><h2>${safe(rental.title || "關西自駕")}</h2><p>${safe(rental.company || "尚待補上租車公司與訂單")}</p></div></div>${hasReservation ? `<div class="rental-number"><small>預約編號</small><strong>${safe(rental.reservation || "待確認")}</strong></div><div class="rental-timeline"><div><span class="timeline-dot timeline-dot--green"><i class="fa-solid fa-key" aria-hidden="true"></i></span><small>PICK-UP 取車</small><strong>${safe(rental.pickup || "待確認")}</strong><p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${safe(rental.pickupLocation || "待確認")}</p></div><div><span class="timeline-dot timeline-dot--orange"><i class="fa-solid fa-flag-checkered" aria-hidden="true"></i></span><small>RETURN 還車</small><strong>${safe(rental.return || "待確認")}</strong><p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${safe(rental.returnLocation || "待確認")}</p></div></div>` : `<p class="rental-empty">取還車時間、保險、ETC 與預約編號尚待補上。</p>`}</article></section>`;
  };

  const renderBookingPage = () => {
    const activeTab = tabs.some(([id]) => id === state.bookingTab) ? state.bookingTab : tabs[0][0];
    state.bookingTab = activeTab;
    const panel = { flights:flightPanel, activities:activitiesPanel, stays:staysPanel, rental:rentalPanel }[activeTab]();
    return `<section class="section booking-view booking-redesign"><div class="booking-page-title"><p>旅程收納</p><h2>我的預訂</h2><span>把航班、活動、住宿與租車資訊放在一起。</span></div>${tabNav()}${panel}</section>`;
  };

  state.bookingTab = tabs.some(([id]) => id === state.bookingTab) ? state.bookingTab : tabs[0][0];
  const originalRender = render;
  render = (options = {}) => {
    if (state.section !== "bookings" || state.bookingTab === "vouchers") return originalRender(options);
    window.renderPageContent?.(renderBookingPage(), options);
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-booking-tab]");
    if (!button) return;
    state.bookingTab = button.dataset.bookingTab;
    render();
  });

  render();
})();
