/**
 * API base URL — change for production (your backend host).
 * For GitHub Pages admin panel pointing to a remote API:
 *   const API_BASE_URL = "https://your-api.example.com";
 */
function resolveApiBaseUrl() {
  if (window.location.origin.includes("github.io")) {
    return "https://YOUR_API_HOST.example.com";
  }
  return window.location.origin;
}

const API_BASE_URL = resolveApiBaseUrl();

const TOKEN_KEY = "admin_jwt_token";
const ROLE_KEY = "admin_role";

let citiesCache = [];
let selectedCityId = null;

// ─── Auth helpers ───────────────────────────────────────────

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token, role) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

function isLoginPage() {
  return Boolean(document.getElementById("login-form"));
}

function requireAuth() {
  const token = getToken();
  if (!token) {
    if (!isLoginPage()) {
      window.location.href = "index.html";
    }
    return null;
  }
  return token;
}

async function apiRequest(path, options = {}) {
  const { skipAuthRedirect = false, ...fetchOptions } = options;
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    clearAuth();
    const isAuthRequest = path.includes("/login");
    if (!skipAuthRedirect && !isAuthRequest && !isLoginPage()) {
      window.location.replace("index.html");
    }
    let message = "Unauthorized";
    try {
      const data = await response.json();
      if (typeof data?.detail === "string") message = data.detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail || `Request failed (${response.status})`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  return data;
}

// ─── Login page ─────────────────────────────────────────────

async function initLoginPage() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const token = getToken();
  if (token) {
    try {
      const me = await apiRequest("/api/me", { skipAuthRedirect: true });
      if (me.role === "admin") {
        window.location.replace("dashboard.html");
        return;
      }
      clearAuth();
    } catch {
      clearAuth();
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("login-error");
    errorEl.classList.add("hidden");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const data = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (data.role !== "admin") {
        throw new Error("Доступ только для администраторов");
      }

      setToken(data.access_token, data.role);
      window.location.replace("dashboard.html");
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove("hidden");
    }
  });
}

// ─── Dashboard ──────────────────────────────────────────────

function initDashboard() {
  if (!requireAuth()) return;

  const role = localStorage.getItem(ROLE_KEY);
  document.getElementById("user-badge").textContent = `Роль: ${role}`;

  document.getElementById("logout-btn").addEventListener("click", () => {
    clearAuth();
    window.location.href = "index.html";
  });

  initTabs();
  loadUsers();
  loadOrders();
  loadPromotions();
  loadCities();
  initModals();
}

function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.panel).classList.add("active");
    });
  });
}

function roleBadge(role) {
  return `<span class="badge badge-${role}">${role}</span>`;
}

function statusBadge(status) {
  return `<span class="badge badge-${status}">${status}</span>`;
}

function activeBadge(isActive) {
  return isActive
    ? '<span class="badge badge-active">active</span>'
    : '<span class="badge badge-inactive">inactive</span>';
}

// ─── Users CRUD ─────────────────────────────────────────────

async function loadUsers() {
  const tbody = document.getElementById("users-tbody");
  tbody.innerHTML = '<tr><td colspan="4" class="loading">Загрузка...</td></tr>';

  try {
    const users = await apiRequest("/api/admin/users");
    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Нет пользователей</td></tr>';
      return;
    }
    tbody.innerHTML = users
      .map(
        (u) => `
      <tr>
        <td>${u.id}</td>
        <td>${escapeHtml(u.username)}</td>
        <td>${roleBadge(u.role)}</td>
        <td class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="editUser(${u.id})">Изменить</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">Удалить</button>
        </td>
      </tr>`
      )
      .join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" class="alert-error">${err.message}</td></tr>`;
  }
}

function openUserModal(user = null) {
  document.getElementById("user-modal-title").textContent = user ? "Редактировать пользователя" : "Новый пользователь";
  document.getElementById("user-id").value = user?.id || "";
  document.getElementById("user-username").value = user?.username || "";
  document.getElementById("user-password").value = "";
  document.getElementById("user-role").value = user?.role || "client";
  document.getElementById("user-password").required = !user;
  document.getElementById("user-modal").classList.add("open");
}

async function editUser(id) {
  try {
    const user = await apiRequest(`/api/admin/users/${id}`);
    openUserModal(user);
  } catch (err) {
    alert(err.message);
  }
}

async function deleteUser(id) {
  if (!confirm("Удалить пользователя?")) return;
  try {
    await apiRequest(`/api/admin/users/${id}`, { method: "DELETE" });
    loadUsers();
  } catch (err) {
    alert(err.message);
  }
}

async function saveUser(e) {
  e.preventDefault();
  const id = document.getElementById("user-id").value;
  const body = {
    username: document.getElementById("user-username").value.trim(),
    role: document.getElementById("user-role").value,
  };
  const password = document.getElementById("user-password").value;
  if (password) body.password = password;

  try {
    if (id) {
      await apiRequest(`/api/admin/users/${id}`, { method: "PUT", body: JSON.stringify(body) });
    } else {
      if (!password) throw new Error("Пароль обязателен для нового пользователя");
      body.password = password;
      await apiRequest("/api/admin/users", { method: "POST", body: JSON.stringify(body) });
    }
    document.getElementById("user-modal").classList.remove("open");
    loadUsers();
  } catch (err) {
    alert(err.message);
  }
}

// ─── Orders CRUD ────────────────────────────────────────────

async function loadOrders() {
  const tbody = document.getElementById("orders-tbody");
  tbody.innerHTML = '<tr><td colspan="5" class="loading">Загрузка...</td></tr>';

  try {
    const orders = await apiRequest("/api/admin/orders");
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Нет заказов</td></tr>';
      return;
    }
    tbody.innerHTML = orders
      .map(
        (o) => `
      <tr>
        <td>${escapeHtml(o.id)}</td>
        <td>${escapeHtml(o.customer_name || "—")}<br><small>${escapeHtml(o.customer_phone || "")}</small></td>
        <td>${o.worker_id ?? "—"}</td>
        <td>${statusBadge(o.status)}</td>
        <td class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="editOrder('${escapeHtml(o.id)}')">Изменить</button>
          <button class="btn btn-danger btn-sm" onclick="deleteOrder('${escapeHtml(o.id)}')">Удалить</button>
        </td>
      </tr>`
      )
      .join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="alert-error">${err.message}</td></tr>`;
  }
}

function populateCitySelects() {
  const selects = [
    document.getElementById("order-city-id"),
    document.getElementById("branch-city-id"),
  ].filter(Boolean);

  selects.forEach((select) => {
    const current = select.value;
    select.innerHTML = citiesCache
      .map((city) => `<option value="${escapeHtml(city.id)}">${escapeHtml(city.name)}</option>`)
      .join("");
    if (current && citiesCache.some((city) => city.id === current)) {
      select.value = current;
    }
  });
}

function updateOrderBranchSelect(cityId, selectedBranchId = "") {
  const branchSelect = document.getElementById("order-branch-id");
  if (!branchSelect) return;

  const city = citiesCache.find((item) => item.id === cityId);
  const branches = city?.branches || [];
  branchSelect.innerHTML = branches
    .map((branch) => `<option value="${escapeHtml(branch.id)}">${escapeHtml(branch.name)}</option>`)
    .join("");

  if (selectedBranchId && branches.some((branch) => branch.id === selectedBranchId)) {
    branchSelect.value = selectedBranchId;
  }
}

function openOrderModal(order = null) {
  document.getElementById("order-modal-title").textContent = order ? "Редактировать заказ" : "Новый заказ";
  document.getElementById("order-id").value = order?.id || "";
  const cityId = order?.cityId || order?.city_id || citiesCache[0]?.id || "";
  const branchId = order?.branchId || order?.branch_id || "";
  populateCitySelects();
  document.getElementById("order-city-id").value = cityId;
  updateOrderBranchSelect(cityId, branchId);
  document.getElementById("order-client-name").value = order?.customer?.name || order?.customer_name || "";
  document.getElementById("order-client-phone").value = order?.customer?.phone || order?.customer_phone || "";
  document.getElementById("order-worker-id").value = order?.worker_id ?? "";
  document.getElementById("order-status").value = order?.status || "new";
  document.getElementById("order-modal").classList.add("open");
}

async function editOrder(id) {
  try {
    const order = await apiRequest(`/api/admin/orders/${id}`);
    openOrderModal(order);
  } catch (err) {
    alert(err.message);
  }
}

async function deleteOrder(id) {
  if (!confirm("Удалить заказ?")) return;
  try {
    await apiRequest(`/api/admin/orders/${id}`, { method: "DELETE" });
    loadOrders();
  } catch (err) {
    alert(err.message);
  }
}

async function saveOrder(e) {
  e.preventDefault();
  const id = document.getElementById("order-id").value;
  const workerVal = document.getElementById("order-worker-id").value;

  try {
    if (id) {
      const body = {
        worker_id: workerVal ? parseInt(workerVal, 10) : null,
        status: document.getElementById("order-status").value,
      };
      await apiRequest(`/api/admin/orders/${id}`, { method: "PUT", body: JSON.stringify(body) });
    } else {
      const body = {
        cityId: document.getElementById("order-city-id").value.trim(),
        branchId: document.getElementById("order-branch-id").value.trim(),
        customerName: document.getElementById("order-client-name").value.trim(),
        customerPhone: document.getElementById("order-client-phone").value.trim(),
        worker_id: workerVal ? parseInt(workerVal, 10) : null,
        status: document.getElementById("order-status").value,
      };
      await apiRequest("/api/admin/orders", { method: "POST", body: JSON.stringify(body) });
    }
    document.getElementById("order-modal").classList.remove("open");
    loadOrders();
  } catch (err) {
    alert(err.message);
  }
}

// ─── Locations CRUD ───────────────────────────────────────────

async function loadCities() {
  const tbody = document.getElementById("cities-tbody");
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="7" class="loading">Загрузка...</td></tr>';

  try {
    citiesCache = await apiRequest("/api/admin/cities");
    populateCitySelects();

    if (!citiesCache.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Нет городов</td></tr>';
      renderBranches();
      return;
    }

    if (!selectedCityId || !citiesCache.some((city) => city.id === selectedCityId)) {
      selectedCityId = citiesCache[0].id;
    }

    tbody.innerHTML = citiesCache
      .map(
        (city) => `
      <tr class="${city.id === selectedCityId ? "selected" : ""}" data-city-id="${escapeHtml(city.id)}">
        <td>${escapeHtml(city.id)}</td>
        <td>${escapeHtml(city.name)}</td>
        <td>${city.deliveryFee} грн</td>
        <td>${city.freeDeliveryFrom} грн</td>
        <td>${escapeHtml(city.deliveryEta || "—")}</td>
        <td>${city.branches?.length || 0}</td>
        <td class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="selectCity('${escapeHtml(city.id)}')">Филиалы</button>
          <button class="btn btn-secondary btn-sm" onclick="editCity('${escapeHtml(city.id)}')">Изменить</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCity('${escapeHtml(city.id)}')">Удалить</button>
        </td>
      </tr>`
      )
      .join("");

    renderBranches();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="alert-error">${err.message}</td></tr>`;
  }
}

function selectCity(cityId) {
  selectedCityId = cityId;
  loadCities();
}

function renderBranches() {
  const tbody = document.getElementById("branches-tbody");
  const title = document.getElementById("branches-panel-title");
  const addBtn = document.getElementById("add-branch-btn");
  if (!tbody) return;

  const city = citiesCache.find((item) => item.id === selectedCityId);
  if (!city) {
    title.textContent = "Филиалы";
    addBtn.disabled = true;
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Выберите город</td></tr>';
    return;
  }

  title.textContent = `Филиалы: ${city.name}`;
  addBtn.disabled = false;

  const branches = city.branches || [];
  if (!branches.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Нет филиалов</td></tr>';
    return;
  }

  tbody.innerHTML = branches
    .map(
      (branch) => `
    <tr>
      <td>${escapeHtml(branch.id)}</td>
      <td>${escapeHtml(branch.name)}</td>
      <td>${escapeHtml(branch.address)}</td>
      <td>${escapeHtml(branch.phone || "—")}</td>
      <td>${escapeHtml(branch.hours || "—")}</td>
      <td>${escapeHtml(branch.pickupEta || "—")}</td>
      <td class="actions-cell">
        <button class="btn btn-secondary btn-sm" onclick="editBranch('${escapeHtml(branch.id)}')">Изменить</button>
        <button class="btn btn-danger btn-sm" onclick="deleteBranch('${escapeHtml(branch.id)}')">Удалить</button>
      </td>
    </tr>`
    )
    .join("");
}

function openCityModal(city = null) {
  document.getElementById("city-modal-title").textContent = city ? "Редактировать город" : "Новый город";
  document.getElementById("city-id").value = city?.id || "";
  document.getElementById("city-name").value = city?.name || "";
  document.getElementById("city-delivery-fee").value = city?.deliveryFee ?? 0;
  document.getElementById("city-free-delivery-from").value = city?.freeDeliveryFrom ?? 0;
  document.getElementById("city-delivery-eta").value = city?.deliveryEta || "";
  document.getElementById("city-modal").classList.add("open");
}

async function editCity(id) {
  try {
    const city = await apiRequest(`/api/admin/cities/${id}`);
    openCityModal(city);
  } catch (err) {
    alert(err.message);
  }
}

async function deleteCity(id) {
  if (!confirm("Удалить город и все его филиалы?")) return;
  try {
    await apiRequest(`/api/admin/cities/${id}`, { method: "DELETE" });
    if (selectedCityId === id) {
      selectedCityId = null;
    }
    loadCities();
  } catch (err) {
    alert(err.message);
  }
}

async function saveCity(e) {
  e.preventDefault();
  const id = document.getElementById("city-id").value;
  const body = {
    name: document.getElementById("city-name").value.trim(),
    deliveryFee: parseInt(document.getElementById("city-delivery-fee").value, 10) || 0,
    freeDeliveryFrom: parseInt(document.getElementById("city-free-delivery-from").value, 10) || 0,
    deliveryEta: document.getElementById("city-delivery-eta").value.trim(),
  };

  try {
    if (id) {
      await apiRequest(`/api/admin/cities/${id}`, { method: "PUT", body: JSON.stringify(body) });
    } else {
      await apiRequest("/api/admin/cities", { method: "POST", body: JSON.stringify(body) });
    }
    document.getElementById("city-modal").classList.remove("open");
    loadCities();
  } catch (err) {
    alert(err.message);
  }
}

function openBranchModal(branch = null, cityId = null) {
  populateCitySelects();
  document.getElementById("branch-modal-title").textContent = branch ? "Редактировать филиал" : "Новый филиал";
  document.getElementById("branch-id").value = branch?.id || "";
  document.getElementById("branch-city-id").value = branch?.cityId || cityId || selectedCityId || citiesCache[0]?.id || "";
  document.getElementById("branch-city-id").disabled = Boolean(branch);
  document.getElementById("branch-name").value = branch?.name || "";
  document.getElementById("branch-address").value = branch?.address || "";
  document.getElementById("branch-phone").value = branch?.phone || "";
  document.getElementById("branch-hours").value = branch?.hours || "";
  document.getElementById("branch-pickup-eta").value = branch?.pickupEta || "";
  document.getElementById("branch-modal").classList.add("open");
}

async function editBranch(id) {
  try {
    const cities = await apiRequest("/api/admin/cities");
    const branch = cities.flatMap((city) => city.branches || []).find((item) => item.id === id);
    if (!branch) {
      throw new Error("Филиал не найден");
    }
    const city = cities.find((item) => (item.branches || []).some((b) => b.id === id));
    openBranchModal({ ...branch, cityId: city?.id }, city?.id);
  } catch (err) {
    alert(err.message);
  }
}

async function deleteBranch(id) {
  if (!confirm("Удалить филиал?")) return;
  try {
    await apiRequest(`/api/admin/branches/${id}`, { method: "DELETE" });
    loadCities();
  } catch (err) {
    alert(err.message);
  }
}

async function saveBranch(e) {
  e.preventDefault();
  const id = document.getElementById("branch-id").value;
  const body = {
    cityId: document.getElementById("branch-city-id").value,
    name: document.getElementById("branch-name").value.trim(),
    address: document.getElementById("branch-address").value.trim(),
    phone: document.getElementById("branch-phone").value.trim(),
    hours: document.getElementById("branch-hours").value.trim(),
    pickupEta: document.getElementById("branch-pickup-eta").value.trim(),
  };

  try {
    if (id) {
      await apiRequest(`/api/admin/branches/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: body.name,
          address: body.address,
          phone: body.phone,
          hours: body.hours,
          pickupEta: body.pickupEta,
        }),
      });
    } else {
      await apiRequest("/api/admin/branches", { method: "POST", body: JSON.stringify(body) });
    }
    document.getElementById("branch-modal").classList.remove("open");
    loadCities();
  } catch (err) {
    alert(err.message);
  }
}

// ─── Promotions CRUD ────────────────────────────────────────

async function loadPromotions() {
  const tbody = document.getElementById("promotions-tbody");
  tbody.innerHTML = '<tr><td colspan="5" class="loading">Загрузка...</td></tr>';

  try {
    const promotions = await apiRequest("/api/admin/promotions");
    if (!promotions.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Нет акций</td></tr>';
      return;
    }
    tbody.innerHTML = promotions
      .map(
        (p) => `
      <tr>
        <td>${p.id}</td>
        <td>${escapeHtml(p.title)}</td>
        <td>${escapeHtml(p.description)}</td>
        <td>${activeBadge(p.is_active)}</td>
        <td class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="editPromotion(${p.id})">Изменить</button>
          <button class="btn btn-danger btn-sm" onclick="deletePromotion(${p.id})">Удалить</button>
        </td>
      </tr>`
      )
      .join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="alert-error">${err.message}</td></tr>`;
  }
}

function openPromotionModal(promotion = null) {
  document.getElementById("promotion-modal-title").textContent = promotion ? "Редактировать акцию" : "Новая акция";
  document.getElementById("promotion-id").value = promotion?.id || "";
  document.getElementById("promotion-title").value = promotion?.title || "";
  document.getElementById("promotion-description").value = promotion?.description || "";
  document.getElementById("promotion-is-active").checked = promotion?.is_active ?? true;
  document.getElementById("promotion-modal").classList.add("open");
}

async function editPromotion(id) {
  try {
    const promotion = await apiRequest(`/api/admin/promotions/${id}`);
    openPromotionModal(promotion);
  } catch (err) {
    alert(err.message);
  }
}

async function deletePromotion(id) {
  if (!confirm("Удалить акцию?")) return;
  try {
    await apiRequest(`/api/admin/promotions/${id}`, { method: "DELETE" });
    loadPromotions();
  } catch (err) {
    alert(err.message);
  }
}

async function savePromotion(e) {
  e.preventDefault();
  const id = document.getElementById("promotion-id").value;
  const body = {
    title: document.getElementById("promotion-title").value.trim(),
    description: document.getElementById("promotion-description").value.trim(),
    is_active: document.getElementById("promotion-is-active").checked,
  };

  try {
    if (id) {
      await apiRequest(`/api/admin/promotions/${id}`, { method: "PUT", body: JSON.stringify(body) });
    } else {
      await apiRequest("/api/admin/promotions", { method: "POST", body: JSON.stringify(body) });
    }
    document.getElementById("promotion-modal").classList.remove("open");
    loadPromotions();
  } catch (err) {
    alert(err.message);
  }
}

// ─── Modals & utils ─────────────────────────────────────────

function initModals() {
  document.getElementById("add-user-btn").addEventListener("click", () => openUserModal());
  document.getElementById("user-form").addEventListener("submit", saveUser);
  document.getElementById("user-cancel").addEventListener("click", () =>
    document.getElementById("user-modal").classList.remove("open")
  );

  document.getElementById("add-order-btn").addEventListener("click", () => openOrderModal());
  document.getElementById("order-form").addEventListener("submit", saveOrder);
  document.getElementById("order-cancel").addEventListener("click", () =>
    document.getElementById("order-modal").classList.remove("open")
  );

  document.getElementById("add-promotion-btn").addEventListener("click", () => openPromotionModal());
  document.getElementById("promotion-form").addEventListener("submit", savePromotion);
  document.getElementById("promotion-cancel").addEventListener("click", () =>
    document.getElementById("promotion-modal").classList.remove("open")
  );

  const addCityBtn = document.getElementById("add-city-btn");
  if (addCityBtn) {
    addCityBtn.addEventListener("click", () => openCityModal());
    document.getElementById("city-form").addEventListener("submit", saveCity);
    document.getElementById("city-cancel").addEventListener("click", () =>
      document.getElementById("city-modal").classList.remove("open")
    );
  }

  const addBranchBtn = document.getElementById("add-branch-btn");
  if (addBranchBtn) {
    addBranchBtn.addEventListener("click", () => openBranchModal());
    document.getElementById("branch-form").addEventListener("submit", saveBranch);
    document.getElementById("branch-cancel").addEventListener("click", () =>
      document.getElementById("branch-modal").classList.remove("open")
    );
  }

  const orderCitySelect = document.getElementById("order-city-id");
  if (orderCitySelect) {
    orderCitySelect.addEventListener("change", (e) => updateOrderBranchSelect(e.target.value));
  }

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ─── Bootstrap ──────────────────────────────────────────────

async function unregisterMainServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
}

document.addEventListener("DOMContentLoaded", () => {
  unregisterMainServiceWorker().finally(() => {
    if (isLoginPage()) {
      initLoginPage().catch(() => {});
      return;
    }
    initDashboard();
  });
});