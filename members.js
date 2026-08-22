(() => {
  const EDIT_PASSWORD = "0726";
  const STORAGE_KEY = "osaka-members";
  const COLORS = ["#d69b65", "#6faaa0", "#d9949d", "#8fa5b4", "#b69a67", "#879f79"];
  const makeId = () => globalThis.crypto?.randomUUID?.() || `member-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const defaults = [
    { id: "member-kevin", name: "凱文", role: "旅伴", avatar: "", color: COLORS[0] },
    { id: "member-neil", name: "尼歐", role: "旅伴", avatar: "", color: COLORS[1] },
    { id: "member-sheep", name: "小羊", role: "旅伴", avatar: "", color: COLORS[2] },
    { id: "member-dax", name: "大俠", role: "旅伴", avatar: "", color: COLORS[3] },
  ];

  const normalize = (items) => (Array.isArray(items) && items.length ? items : defaults).map((item, index) => ({
    id: item.id || `member-${index + 1}`,
    name: String(item.name || "未命名").slice(0, 20),
    role: String(item.role || "旅伴").slice(0, 30),
    avatar: typeof item.avatar === "string" ? item.avatar : "",
    color: item.color || COLORS[index % COLORS.length],
  }));

  let members;
  try { members = normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")); } catch { members = normalize(); }

  const initials = (name) => String(name || "?").trim().slice(0, 1) || "?";
  const avatarMarkup = (member, className = "member-avatar") => member.avatar
    ? `<img class="${className}" src="${safe(member.avatar)}" alt="${safe(member.name)}的頭貼" />`
    : `<span class="${className} member-avatar--fallback" style="--avatar-color:${safe(member.color)}">${safe(initials(member.name))}</span>`;

  const renderHeader = () => {
    const stack = document.querySelector(".member-stack");
    if (!stack) return;
    stack.setAttribute("aria-label", "旅伴成員");
    stack.innerHTML = members.slice(0, 5).map((member) => avatarMarkup(member, "member")).join("");
  };

  const openModal = (content) => {
    document.querySelector(".member-modal")?.remove();
    const modal = document.createElement("div");
    modal.className = "member-modal";
    modal.innerHTML = `<div class="member-modal__backdrop" data-close-member></div><section class="member-modal__sheet" role="dialog" aria-modal="true">${content}</section>`;
    document.body.appendChild(modal);
    modal.querySelector("input")?.focus();
    return modal;
  };

  const closeModal = () => document.querySelector(".member-modal")?.remove();
  const passwordGate = (target) => {
    const modal = openModal(`<div class="member-modal__head"><div><small>旅伴管理</small><h2>輸入密碼後編輯</h2></div><button type="button" data-close-member aria-label="關閉">×</button></div><p class="member-modal__hint">成員姓名與頭貼會同步到 Neon，共同維護旅程資料。</p><form class="member-password-form"><label class="member-field"><span>編輯密碼</span><input name="password" type="password" inputmode="numeric" autocomplete="off" maxlength="4" placeholder="••••" required /></label><p class="member-error" aria-live="polite"></p><button class="primary-button" type="submit">確認密碼</button></form>`);
    modal.querySelector(".member-password-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const error = modal.querySelector(".member-error");
      if (new FormData(event.currentTarget).get("password") !== EDIT_PASSWORD) {
        error.textContent = "密碼不正確，請再試一次。";
        return;
      }
      modal.remove();
      editor(target);
    });
  };

  const editor = (target) => {
    const isNew = target.index === null;
    const member = isNew ? { id: makeId(), name: "", role: "旅伴", avatar: "", color: COLORS[members.length % COLORS.length] } : members[target.index];
    const modal = openModal(`<div class="member-modal__head"><div><small>成員資料</small><h2>${isNew ? "新增成員" : "編輯成員"}</h2></div><button type="button" data-close-member aria-label="關閉">×</button></div><form class="member-form" data-index="${isNew ? "new" : target.index}"><div class="member-editor-preview">${avatarMarkup(member, "member-avatar member-avatar--large")}<span>上傳一張最像你的照片</span></div><label class="member-field"><span>姓名</span><input name="name" value="${safe(member.name)}" maxlength="20" placeholder="例如：小明" required /></label><label class="member-field"><span>稱呼／角色</span><input name="role" value="${safe(member.role)}" maxlength="30" placeholder="例如：旅伴、司機" /></label><label class="member-upload"><i class="fa-solid fa-camera" aria-hidden="true"></i><span>選擇頭貼</span><input name="avatar" type="file" accept="image/*" /></label><p class="member-upload-note">圖片會自動縮小後保存，建議使用正方形照片。</p><div class="member-modal__actions"><button class="outline-action" type="button" data-close-member>取消</button><button class="primary-button" type="submit">儲存成員</button></div></form>`);
    const file = modal.querySelector("input[type=file]");
    file.addEventListener("change", () => {
      const selected = file.files?.[0];
      if (!selected) return;
      const preview = modal.querySelector(".member-editor-preview .member-avatar");
      if (preview) preview.src = URL.createObjectURL(selected);
    });
  };

  const compressAvatar = (file) => new Promise((resolve, reject) => {
    if (!file) return resolve("");
    if (file.size > 8 * 1024 * 1024) return reject(new Error("圖片大小不能超過 8MB"));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("圖片讀取失敗"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("圖片格式無法使用"));
      image.onload = () => {
        const size = 320;
        const scale = Math.min(1, size / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", .82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  const saveMembers = async () => {
    window.setSharedMembers?.(members);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    const response = await fetch("./api/state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: { members } }) });
    if (!response.ok) throw new Error("資料庫同步失敗");
    renderHeader();
  };

  const memberCard = (member, index) => `<article class="member-card"><div class="member-card__avatar">${avatarMarkup(member, "member-avatar member-avatar--card")}</div><div class="member-card__copy"><h3>${safe(member.name)}</h3><p>${safe(member.role)}</p><span>旅程成員 ${String(index + 1).padStart(2, "0")}</span></div><button type="button" class="member-card__edit" data-edit-member="${index}" aria-label="編輯 ${safe(member.name)}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button></article>`;
  const membersPage = () => `<section class="section members-view"><div class="members-page-title"><p>旅伴資料</p><h2>我們的成員</h2><span>把每個人的名字和笑臉，放進這本旅行手帳。</span></div><article class="members-hero"><div><small>TRAVEL CREW</small><strong>${members.length}<i> 位旅伴</i></strong><p>一起出發，也一起把回憶帶回家。</p></div><div class="members-hero__orbit"><span>✦</span><b>${members.slice(0, 3).map((member) => initials(member.name)).join(" · ")}</b></div></article><div class="members-section-head"><div><small>MEMBERS</small><h3>旅程成員</h3></div><span>${members.length} 人</span></div><div class="member-card-list">${members.map(memberCard).join("")}</div><button class="primary-button member-add" type="button" data-new-member><i class="fa-solid fa-plus" aria-hidden="true"></i> 新增成員</button></section>`;

  window.applyMembersData = (data) => {
    members = normalize(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    window.setSharedMembers?.(members);
    renderHeader();
    render();
  };

  const baseRender = render;
  render = () => {
    if (state.section !== "members") return baseRender();
    app.innerHTML = membersPage();
    document.querySelectorAll(".bottom-nav__item").forEach((button) => button.classList.toggle("is-active", button.dataset.section === state.section));
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-member]")) { closeModal(); return; }
    const edit = event.target.closest("[data-edit-member]");
    if (edit) { passwordGate({ index: Number(edit.dataset.editMember) }); return; }
    if (event.target.closest("[data-new-member]")) passwordGate({ index: null });
  });

  document.addEventListener("submit", async (event) => {
    const form = event.target.closest(".member-form");
    if (!form) return;
    event.preventDefault();
    const index = form.dataset.index === "new" ? null : Number(form.dataset.index);
    const current = index === null ? { id: makeId(), color: COLORS[members.length % COLORS.length] } : members[index];
    const selected = form.querySelector("input[type=file]").files?.[0];
    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    try {
      const avatar = selected ? await compressAvatar(selected) : current.avatar || "";
      const updated = { ...current, name: new FormData(form).get("name"), role: new FormData(form).get("role") || "旅伴", avatar };
      if (index === null) members.push(updated); else members[index] = updated;
      await saveMembers();
      closeModal();
      render();
    } catch (error) {
      const note = form.querySelector(".member-upload-note");
      if (note) note.textContent = error.message || "儲存失敗，請稍後再試。";
      submit.disabled = false;
    }
  });

  renderHeader();
  render();
  fetch("./api/state", { cache: "no-store" }).then((response) => response.ok ? response.json() : Promise.reject()).then(({ data }) => {
    if (Array.isArray(data?.members)) window.applyMembersData(data.members);
  }).catch(() => {});
})();
