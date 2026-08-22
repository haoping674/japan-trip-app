(() => {
  const stayImages = {
    "Guest House Kyoan": "./images/stays/guest-house-kyoan.jpg",
    "Party&Resort ZERO'sHOUSE": "./images/stays/party-resort-zeros-house.jpg",
    "KYOTO TANGO MIYAZU inn": "./images/stays/kyoto-tango-miyazu-inn.jpg",
    "鹿の宿": "./images/stays/shika-no-yado.jpg",
  };

  const tabs = [
    ["flights", "機票", "fa-solid fa-plane"],
    ["stays", "住宿", "fa-solid fa-building"],
    ["rental", "租車", "fa-solid fa-car"],
    ["vouchers", "憑證", "fa-solid fa-ticket"],
  ];

  const tabNav = () => `<nav class="booking-subnav" aria-label="預訂分類">${tabs.map(([id, label, iconClass]) => `<button class="booking-subnav__item ${state.bookingTab === id ? "is-active" : ""}" data-booking-tab="${id}" type="button"><i class="${iconClass}" aria-hidden="true"></i><span>${label}</span></button>`).join("")}</nav>`;

  const flightPanel = () => {
    const flight = flights[0];
    return `<section class="booking-panel booking-panel--flight"><div class="booking-panel__eyebrow"><span>廈門航空</span><small>同一張訂單</small></div><div class="flight-code">${flight.code}</div><div class="flight-route"><div><strong>${flight.from}</strong><small>高雄</small><b>15:00</b></div><div class="flight-route__path"><small>02h25m</small><i class="fa-solid fa-plane" aria-hidden="true"></i><span></span><small>2026/09/06</small></div><div><strong>${flight.to}</strong><small>關西</small><b>18:25</b></div></div><div class="flight-facts"><div><small>BAGGAGE</small><strong><i class="fa-solid fa-suitcase-rolling" aria-hidden="true"></i> 15kg</strong></div><div><small>AIRCRAFT</small><strong><i class="fa-solid fa-plane-up" aria-hidden="true"></i> A321</strong></div></div><div class="flight-meta"><div><small>PRICE &amp; TYPE</small><strong>NT$ 4,633</strong><span>同一張訂單</span></div><div><small>PURCHASED</small><strong>2025/11/14</strong><span>via 官網</span></div></div><button class="outline-action" type="button"><i class="fa-solid fa-pen" aria-hidden="true"></i> 編輯航班資訊</button></section>`;
  };

  const staysPanel = () => {
    const stays = bookings.filter(([type]) => type === "住宿");
    return `<section class="booking-panel booking-panel--stays"><button class="add-stay" type="button"><i class="fa-solid fa-plus" aria-hidden="true"></i> 新增住宿</button><div class="stay-visual-list">${stays.map(([, name, detail], index) => `<article class="stay-visual-card"><div class="stay-visual-card__photo" style="background-image:url('${stayImages[name]}')" role="img" aria-label="${safe(name)}住宿照片"><span class="location-tag"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${index === 0 ? "京都" : index === 1 ? "小濱" : index === 2 ? "宮津" : "大阪"}</span></div><div class="stay-visual-card__body"><div><h3>${safe(name)}</h3><p>${safe(detail)}</p></div><button type="button" aria-label="編輯 ${safe(name)}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button></div><div class="stay-visual-card__dates"><div><small>CHECK-IN</small><strong>${index === 0 ? "2026-09-06" : index === 1 ? "2026-09-08" : index === 2 ? "2026-09-09" : "2026-09-10"}</strong><span>15:00</span></div><b>→</b><div><small>CHECK-OUT</small><strong>${index === 0 ? "2026-09-08" : index === 1 ? "2026-09-09" : index === 2 ? "2026-09-10" : "2026-09-16"}</strong><span>11:00</span></div></div><div class="stay-visual-card__total"><span>Total</span><strong>NT$ ${index === 0 ? "6,800" : index === 1 ? "4,200" : index === 2 ? "5,000" : "12,600"}</strong></div></article>`).join("")}</div></section>`;
  };

  const rentalPanel = () => `<section class="booking-panel booking-panel--rental"><article class="rental-hero"><div class="rental-hero__heading"><span class="rental-icon"><i class="fa-solid fa-car" aria-hidden="true"></i></span><div><small>租車預約</small><h2>樂天租車</h2><p>Jeju Island Rental Service</p></div><button type="button" aria-label="編輯租車"><i class="fa-solid fa-pen" aria-hidden="true"></i></button></div><div class="rental-number"><small>預約編號</small><strong>RWJD-5223</strong></div><div class="rental-timeline"><div><span class="timeline-dot timeline-dot--green"><i class="fa-solid fa-key" aria-hidden="true"></i></span><small>PICK-UP 取車</small><strong>2026/09/10 15:30</strong><p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> 滋州</p></div><div><span class="timeline-dot timeline-dot--orange"><i class="fa-solid fa-flag-checkered" aria-hidden="true"></i></span><small>RETURN 還車</small><strong>2026/09/24 08:00</strong><p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> 滋州</p></div></div></article></section>`;

  const vouchersPanel = () => `<section class="booking-panel booking-panel--vouchers"><label class="voucher-search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input type="search" placeholder="搜尋憑證／平台…" /></label><button class="primary-button voucher-add" type="button"><i class="fa-solid fa-plus" aria-hidden="true"></i> 新增憑證</button><article class="voucher-card"><span class="voucher-card__badge">機票</span><strong>機票_凱文</strong><button type="button" aria-label="編輯機票凱文"><i class="fa-solid fa-pen" aria-hidden="true"></i></button><div class="voucher-card__file"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i><small>PDF</small></div></article></section>`;

  const renderBookingPage = () => {
    const panel = { flights:flightPanel, stays:staysPanel, rental:rentalPanel, vouchers:vouchersPanel }[state.bookingTab || "flights"]();
    return `<section class="section booking-view booking-redesign"><div class="booking-page-title"><p>旅程收納</p><h2>我的預訂</h2><span>把航班、住宿和旅途票券放在一起。</span></div>${tabNav()}${panel}</section>`;
  };

  state.bookingTab = state.bookingTab || "flights";
  const originalRender = render;
  render = (options = {}) => {
    if (state.section !== "bookings") return originalRender(options);
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
