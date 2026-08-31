(() => {
  const EDIT_PASSWORD = "0726";
  const STORAGE_KEY = "osaka-booking-records";
  const stayImages = {
    "Guest House Kyoan": "./images/stays/guest-house-kyoan.jpg",
    "Party&Resort ZERO'sHOUSE": "./images/stays/party-resort-zeros-house.jpg",
    "KYOTO TANGO MIYAZU inn": "./images/stays/kyoto-tango-miyazu-inn.jpg",
    "鹿の宿": "./images/stays/shika-no-yado.jpg",
  };

  const defaults = { flight: {}, flights: [], stays: [], rental: {}, vouchers: [], voucherVault: null };
  const VAULT_VERSION = 1;
  const VAULT_ITERATIONS = 600000;
  const VAULT_IDLE_TIMEOUT = 5 * 60 * 1000;
  const MAX_VOUCHER_FILE_SIZE = 1500000;

  let bookingData;
  try { bookingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || defaults; } catch { bookingData = defaults; }
  let vaultKey = null;
  let vaultEntries = [];
  let vaultIdleTimer = null;
  const syncAppBookings = () => window.applyBookingData?.(bookingData);
  const saveBookingData = () => {
    syncAppBookings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
    return fetch("./api/state", { method:"PUT", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ data:{ bookings:bookingData, tripDays, planningItems } }) }).catch(() => null);
  };
  const loadBookingData = async () => {
    try {
      const response = await fetch("./api/state?vault=1", { cache:"no-store" });
      if (!response.ok) return;
      const payload = await response.json();
      if (!payload.data || !payload.data.bookings) return;
      bookingData = { ...bookingData, ...payload.data.bookings, flight:{ ...bookingData.flight, ...(payload.data.bookings.flight || {}) }, rental:{ ...bookingData.rental, ...(payload.data.bookings.rental || {}) }, stays:Array.isArray(payload.data.bookings.stays) ? payload.data.bookings.stays : bookingData.stays, vouchers:Array.isArray(payload.data.bookings.vouchers) ? payload.data.bookings.vouchers : bookingData.vouchers };
      syncAppBookings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
      if (state.section === "bookings") window.renderWhenSafe?.();
    } catch {}
  };
  const imageForStay = (name, index) => stayImages[name] || Object.values(stayImages)[index % Object.values(stayImages).length];
  const field = (label, name, value, type = "text", extra = "") => {
    const isNativeDateTime = type === "date" || type === "time";
    const input = `<input name="${name}" type="${type}" value="${safe(value ?? "")}" ${extra} />`;
    return `<label class="edit-field"><span>${label}</span>${isNativeDateTime ? `<span class="edit-field__control">${input}</span>` : input}</label>`;
  };

  const bytesToBase64 = (bytes) => {
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  };
  const base64ToBytes = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
  const vaultSupported = () => Boolean(window.crypto?.subtle && window.TextEncoder && window.TextDecoder);
  const vaultIsUnlocked = () => Boolean(vaultKey);
  const vaultRecord = () => bookingData.voucherVault && typeof bookingData.voucherVault === "object" ? bookingData.voucherVault : null;
  const deriveVaultKey = async (password, salt) => crypto.subtle.deriveKey(
    { name:"PBKDF2", salt, iterations:VAULT_ITERATIONS, hash:"SHA-256" },
    await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]),
    { name:"AES-GCM", length:256 }, false, ["encrypt", "decrypt"]
  );
  const encryptVault = async (entries, key, salt = crypto.getRandomValues(new Uint8Array(16))) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name:"AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(entries)));
    return { version:VAULT_VERSION, kdf:"PBKDF2-SHA-256", iterations:VAULT_ITERATIONS, salt:bytesToBase64(salt), iv:bytesToBase64(iv), ciphertext:bytesToBase64(new Uint8Array(ciphertext)) };
  };
  const decryptVault = async (record, password) => {
    if (!record || record.version !== VAULT_VERSION || !record.salt || !record.iv || !record.ciphertext) throw new Error("invalid-vault");
    const key = await deriveVaultKey(password, base64ToBytes(record.salt));
    const plaintext = await crypto.subtle.decrypt({ name:"AES-GCM", iv:base64ToBytes(record.iv) }, key, base64ToBytes(record.ciphertext));
    const entries = JSON.parse(new TextDecoder().decode(plaintext));
    if (!Array.isArray(entries)) throw new Error("invalid-entries");
    return { key, entries };
  };
  const resetVaultTimer = () => {
    clearTimeout(vaultIdleTimer);
    if (vaultIsUnlocked()) vaultIdleTimer = window.setTimeout(() => lockVault(true), VAULT_IDLE_TIMEOUT);
  };
  const lockVault = (shouldRender = false) => {
    vaultKey = null;
    vaultEntries = [];
    clearTimeout(vaultIdleTimer);
    if (shouldRender && state.section === "bookings" && state.bookingTab === "vouchers") render();
  };
  const persistVault = async () => {
    if (!vaultKey) throw new Error("vault-locked");
    bookingData.voucherVault = await encryptVault(vaultEntries, vaultKey, base64ToBytes(vaultRecord().salt));
    resetVaultTimer();
    return saveBookingData();
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

  const vaultSetupGate = () => {
    if (!vaultSupported()) { window.alert("這個瀏覽器不支援加密憑證匣，請改用最新版 Chrome 或 Safari。"); return; }
    const modal = openModal(`<div class="edit-modal__head"><div><small>加密憑證匣</small><h2>設定憑證密碼</h2></div><button type="button" data-close-edit aria-label="關閉">×</button></div><p class="edit-modal__hint">密碼不會儲存或上傳；忘記後無法復原現有 QR 憑證。</p><form class="voucher-password-form" data-vault-setup><label class="edit-field"><span>憑證密碼（至少 6 碼）</span><input name="password" type="password" autocomplete="new-password" minlength="6" required /></label><label class="edit-field"><span>再輸入一次</span><input name="confirmPassword" type="password" autocomplete="new-password" minlength="6" required /></label><p class="edit-error" aria-live="polite"></p><button class="primary-button" type="submit">建立加密憑證匣</button></form>`);
    modal.querySelector("[data-vault-setup]").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const error = modal.querySelector(".edit-error");
      const values = new FormData(form);
      const password = String(values.get("password") || "");
      if (password !== values.get("confirmPassword")) { error.textContent = "兩次輸入的密碼不同。"; return; }
      const submit = form.querySelector("button[type='submit']");
      submit.disabled = true; submit.textContent = "正在建立…";
      try {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        vaultKey = await deriveVaultKey(password, salt);
        vaultEntries = [];
        bookingData.voucherVault = await encryptVault(vaultEntries, vaultKey, salt);
        await saveBookingData();
        resetVaultTimer();
        modal.remove();
        render();
      } catch {
        submit.disabled = false; submit.textContent = "建立加密憑證匣";
        error.textContent = "建立失敗，請確認網路後重試。";
      }
    });
  };

  const vaultUnlockGate = () => {
    if (!vaultSupported()) { window.alert("這個瀏覽器不支援加密憑證匣，請改用最新版 Chrome 或 Safari。"); return; }
    const modal = openModal(`<div class="edit-modal__head"><div><small>加密憑證匣</small><h2>輸入憑證密碼</h2></div><button type="button" data-close-edit aria-label="關閉">×</button></div><p class="edit-modal__hint">解鎖後可快速顯示 QR code；閒置 5 分鐘或切換 App 時會自動鎖上。</p><form class="voucher-password-form" data-vault-unlock><label class="edit-field"><span>憑證密碼</span><input name="password" type="password" autocomplete="current-password" required autofocus /></label><p class="edit-error" aria-live="polite"></p><button class="primary-button" type="submit">解鎖憑證匣</button></form>`);
    modal.querySelector("[data-vault-unlock]").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const submit = form.querySelector("button[type='submit']");
      const error = modal.querySelector(".edit-error");
      submit.disabled = true; submit.textContent = "正在解鎖…";
      try {
        const unlocked = await decryptVault(vaultRecord(), String(new FormData(form).get("password") || ""));
        vaultKey = unlocked.key;
        vaultEntries = unlocked.entries;
        resetVaultTimer();
        modal.remove();
        render();
      } catch {
        submit.disabled = false; submit.textContent = "解鎖憑證匣";
        error.textContent = "密碼不正確，或憑證資料無法讀取。";
      }
    });
  };

  const voucherEditor = () => {
    const modal = openModal(`<div class="edit-modal__head"><div><small>加密憑證匣</small><h2>新增 QR 憑證</h2></div><button type="button" data-close-edit aria-label="關閉">×</button></div><p class="edit-modal__hint">選取 QR code 圖片（PNG、JPG 或 WebP，最大 1.5 MB）。內容加密後才會同步。</p><form class="voucher-form" data-voucher-form><label class="edit-field"><span>憑證名稱</span><input name="title" maxlength="48" placeholder="例如：去程登機證" required /></label><label class="voucher-upload"><i class="fa-solid fa-qrcode" aria-hidden="true"></i><span>選取 QR 圖片</span><input name="image" type="file" accept="image/png,image/jpeg,image/webp" required /></label><p class="voucher-file-name" aria-live="polite">尚未選取圖片</p><p class="edit-error" aria-live="polite"></p><div class="edit-modal__actions"><button class="outline-action" type="button" data-close-edit>取消</button><button class="primary-button" type="submit">加密並儲存</button></div></form>`);
    const form = modal.querySelector("[data-voucher-form]");
    form.querySelector("input[type='file']").addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      form.querySelector(".voucher-file-name").textContent = file ? `${file.name} · ${Math.ceil(file.size / 1024)} KB` : "尚未選取圖片";
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const error = form.querySelector(".edit-error");
      const values = new FormData(form);
      const image = values.get("image");
      if (!(image instanceof File) || !image.size) { error.textContent = "請先選取 QR 圖片。"; return; }
      if (image.size > MAX_VOUCHER_FILE_SIZE) { error.textContent = "圖片超過 1.5 MB，請先裁切或壓縮後再加入。"; return; }
      const submit = form.querySelector("button[type='submit']");
      submit.disabled = true; submit.textContent = "正在加密…";
      try {
        const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(image); });
        vaultEntries.unshift({ id:crypto.randomUUID?.() || `voucher-${Date.now()}`, title:String(values.get("title") || "QR 憑證"), image:dataUrl, createdAt:new Date().toISOString() });
        await persistVault();
        modal.remove();
        render();
      } catch {
        submit.disabled = false; submit.textContent = "加密並儲存";
        error.textContent = "儲存失敗，請稍後再試。";
      }
    });
  };

  const voucherPanel = () => {
    const record = vaultRecord();
    if (!record) return `<section class="booking-panel voucher-vault voucher-vault--empty"><div class="voucher-vault__seal"><i class="fa-solid fa-qrcode" aria-hidden="true"></i></div><small>加密 QR 憑證匣</small><h2>隨時取回你的憑證</h2><p>把既有的登機證、景點票券或預約 QR 圖片加進來。每一張都以你設定的密碼加密後同步。</p><button class="primary-button voucher-vault__action" type="button" data-vault-setup><i class="fa-solid fa-lock" aria-hidden="true"></i> 設定密碼並新增憑證</button></section>`;
    if (!vaultIsUnlocked()) return `<section class="booking-panel voucher-vault voucher-vault--locked"><div class="voucher-vault__seal"><i class="fa-solid fa-lock" aria-hidden="true"></i></div><small>已加密保護</small><h2>QR 憑證匣已鎖上</h2><p>輸入憑證密碼，即可快速查看已同步的 QR code。</p><button class="primary-button voucher-vault__action" type="button" data-vault-unlock><i class="fa-solid fa-key" aria-hidden="true"></i> 輸入密碼取回憑證</button></section>`;
    return `<section class="booking-panel voucher-vault voucher-vault--open"><div class="voucher-vault__head"><div><small><i class="fa-solid fa-lock-open" aria-hidden="true"></i> 已解鎖 · 5 分鐘後自動鎖上</small><h2>QR 憑證匣</h2></div><button type="button" class="voucher-vault__lock" data-vault-lock aria-label="鎖上憑證匣"><i class="fa-solid fa-lock" aria-hidden="true"></i></button></div><button class="voucher-add" type="button" data-voucher-add><i class="fa-solid fa-plus" aria-hidden="true"></i> 新增 QR 憑證</button><div class="voucher-qr-list">${vaultEntries.length ? vaultEntries.map((entry) => `<article class="voucher-qr-card"><div><small>加密憑證</small><h3>${safe(entry.title)}</h3></div><button type="button" data-voucher-delete="${safe(entry.id)}" aria-label="刪除 ${safe(entry.title)}"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button><img src="${entry.image}" alt="${safe(entry.title)} QR code" /></article>`).join("") : `<div class="voucher-empty"><i class="fa-solid fa-qrcode" aria-hidden="true"></i><p>還沒有 QR 憑證。從上方加入第一張吧。</p></div>`}</div></section>`;
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

  const bookingPage = () => {
    const tab = state.bookingTab || "flights";
    const tabItems = [["flights", "機票", "fa-solid fa-plane"], ["stays", "住宿", "fa-solid fa-building"], ["rental", "租車", "fa-solid fa-car"], ["vouchers", "憑證", "fa-solid fa-qrcode"]];
    const activeTab = tabItems.some(([id]) => id === tab) ? tab : tabItems[0][0];
    state.bookingTab = activeTab;
    const panel = { flights:editFlightPanel, stays:editStaysPanel, rental:editRentalPanel, vouchers:voucherPanel }[activeTab]();
    return `<section class="section booking-view booking-redesign"><div class="booking-page-title"><p>旅程收納</p><h2>我的預訂</h2><span>把航班、住宿和租車資訊放在一起。</span></div><nav class="booking-subnav" aria-label="預訂分類">${tabItems.map(([id, label, iconClass]) => `<button class="booking-subnav__item ${activeTab === id ? "is-active" : ""}" data-booking-tab="${id}" type="button"><i class="${iconClass}" aria-hidden="true"></i><span>${label}</span></button>`).join("")}</nav>${panel}</section>`;
  };

  const baseRender = render;
  render = (options = {}) => {
    if (state.section !== "bookings") return baseRender(options);
    window.renderPageContent?.(bookingPage(), options);
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
    if (tab) { state.bookingTab = tab.dataset.bookingTab; if (state.bookingTab !== "vouchers") lockVault(); render(); return; }
    if (event.target.closest("[data-vault-setup]")) { vaultSetupGate(); return; }
    if (event.target.closest("[data-vault-unlock]")) { vaultUnlockGate(); return; }
    if (event.target.closest("[data-vault-lock]")) { lockVault(true); return; }
    if (event.target.closest("[data-voucher-add]")) { voucherEditor(); return; }
    const voucherDelete = event.target.closest("[data-voucher-delete]");
    if (voucherDelete) {
      const entry = vaultEntries.find((item) => item.id === voucherDelete.dataset.voucherDelete);
      if (!entry || !window.confirm(`刪除「${entry.title}」？這會移除所有裝置上同步的加密憑證。`)) return;
      vaultEntries = vaultEntries.filter((item) => item.id !== entry.id);
      persistVault().then(() => render()).catch(() => window.alert("刪除失敗，請稍後再試。"));
      return;
    }
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
    saveBookingData();
    closeModal();
    render();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) lockVault(true);
  });
  document.addEventListener("pointerdown", (event) => {
    if (vaultIsUnlocked() && event.target.closest(".voucher-vault")) resetVaultTimer();
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-section]") && state.section === "bookings") lockVault();
  }, true);

  render();
  loadBookingData();
})();
