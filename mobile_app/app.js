/**
 * Базовий URL API — змініть для production.
 * Локально: http://localhost:8000
 */
const API_BASE_URL = "http://localhost:8000";

const TOKEN_KEY = "mobile_jwt_token";
const ROLE_KEY = "mobile_role";
const USERNAME_KEY = "mobile_username";

const STATUS_LABELS = {
  new: "Нове",
  in_progress: "Готується",
  completed: "Виконано",
  canceled: "Скасовано",
};

const ROLE_LABELS = {
  client: "Клієнт",
  worker: "Працівник",
  admin: "Адміністратор",
};

let ws = null;
let wsReconnectTimer = null;
let workerOrders = [];
let toastTimer = null;

// ─── Storage & API ──────────────────────────────────────────

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveSession(token, role, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USERNAME_KEY, username || "");
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
  disconnectWebSocket();
}

async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    clearSession();
    showLogin();
    throw new Error("Сесію завершено. Увійдіть знову.");
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail;
    const message = typeof detail === "string" ? detail : `Помилка ${response.status}`;
    throw new Error(message);
  }
  return data;
}

function wsBaseUrl() {
  return API_BASE_URL.replace(/^http/, "ws");
}

// ─── UI helpers ─────────────────────────────────────────────

function $(id) {
  return document.getElementById(id);
}

function showToast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

function statusPill(status) {
  return `<span class="status-pill status-${status}">${STATUS_LABELS[status] || status}</span>`;
}

function renderOrderCard(order, { workerMode = false } = {}) {
  const actions = workerMode
    ? `
      <div class="worker-actions">
        ${order.status === "new" ? `<button class="btn btn-secondary btn-sm" data-action="take" data-id="${order.id}">Взяти в роботу</button>` : ""}
        ${order.status === "in_progress" ? `<button class="btn btn-primary btn-sm" data-action="complete" data-id="${order.id}">Готово</button>` : ""}
        ${order.status !== "canceled" && order.status !== "completed"
          ? `<button class="btn btn-secondary btn-sm" data-action="cancel" data-id="${order.id}">Скасувати</button>`
          : ""}
      </div>`
    : "";

  return `
    <article class="card order-card" data-order-id="${order.id}">
      <div class="order-meta">
        <strong>Замовлення #${order.id}</strong>
        ${statusPill(order.status)}
      </div>
      <p>Клієнт ID: ${order.client_id}${order.worker_id ? ` • Працівник ID: ${order.worker_id}` : ""}</p>
      ${actions}
    </article>`;
}

function bindWorkerActions(container) {
  container.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = parseInt(btn.dataset.id, 10);
      const action = btn.dataset.action;
      try {
        if (action === "take") {
          await apiRequest(`/api/worker/orders/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: "in_progress" }),
          });
          showToast(`Замовлення #${id} в роботі`);
        } else if (action === "complete") {
          await apiRequest(`/api/worker/orders/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: "completed" }),
          });
          showToast(`Замовлення #${id} виконано`);
        } else if (action === "cancel") {
          await apiRequest(`/api/worker/orders/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: "canceled" }),
          });
          showToast(`Замовлення #${id} скасовано`);
        }
        await loadWorkerOrders();
      } catch (err) {
        showToast(err.message);
      }
    });
  });
}

// ─── Login / Session ────────────────────────────────────────

function showLogin() {
  $("login-view").classList.remove("hidden");
  $("app-view").classList.add("hidden");
}

function showApp(role) {
  $("login-view").classList.add("hidden");
  $("app-view").classList.remove("hidden");

  $("role-badge").textContent = ROLE_LABELS[role] || role;

  const isClient = role === "client";
  const isWorker = role === "worker";

  $("nav-client").classList.toggle("hidden", !isClient);
  $("nav-worker").classList.toggle("hidden", !isWorker);

  document.querySelectorAll("[data-role]").forEach((screen) => {
    const screenRole = screen.dataset.role;
    const visible = screenRole === role;
    screen.classList.toggle("hidden", !visible);
    if (!visible) screen.classList.remove("active");
  });

  if (isClient) {
    $("screen-client-home").classList.add("active");
    document.querySelectorAll("#nav-client .nav-item").forEach((n, i) => {
      n.classList.toggle("active", i === 0);
    });
    loadClientData();
  }

  if (isWorker) {
    $("screen-worker-queue").classList.add("active");
    document.querySelectorAll("#nav-worker .nav-item").forEach((n, i) => {
      n.classList.toggle("active", i === 0);
    });
    loadWorkerData();
    connectWebSocket();
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const errorEl = $("login-error");
  errorEl.classList.add("hidden");

  const username = $("username").value.trim();
  const password = $("password").value;

  try {
    const data = await apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (data.role === "admin") {
      throw new Error("Для адміністратора використовуйте веб-панель admin_frontend");
    }

    if (data.role !== "client" && data.role !== "worker") {
      throw new Error("Невідома роль користувача");
    }

    saveSession(data.access_token, data.role, username);
    showApp(data.role);
    showToast(`Вітаємо, ${ROLE_LABELS[data.role]}!`);
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.remove("hidden");
  }
}

function handleLogout() {
  clearSession();
  workerOrders = [];
  showLogin();
  showToast("Ви вийшли з акаунту");
}

// ─── Navigation ─────────────────────────────────────────────

function initNavigation() {
  document.querySelectorAll(".nav-item[data-screen]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = localStorage.getItem(ROLE_KEY);
      const navId = role === "worker" ? "nav-worker" : "nav-client";
      const screenId = btn.dataset.screen;

      document.querySelectorAll(`#${navId} .nav-item`).forEach((n) => n.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(`[data-role="${role}"]`).forEach((s) => s.classList.remove("active"));
      $(screenId).classList.add("active");

      if (screenId === "screen-client-promos") loadPromotions();
      if (screenId === "screen-client-orders") loadClientOrders();
      if (screenId === "screen-worker-queue") loadWorkerOrders();
      if (screenId.includes("profile")) renderProfile(role);
    });
  });
}

// ─── Client ─────────────────────────────────────────────────

async function loadClientData() {
  await Promise.all([loadClientOrders(), loadPromotions(), renderProfile("client")]);
}

async function loadPromotions() {
  const container = $("promo-list");
  container.innerHTML = '<p class="empty-state">Завантаження...</p>';

  try {
    const promos = await apiRequest("/api/promotions");
    if (!promos.length) {
      container.innerHTML = '<p class="empty-state">Наразі немає активних акцій</p>';
      return;
    }
    container.innerHTML = promos
      .map(
        (p) => `
        <article class="card promo-card">
          <strong>${escapeHtml(p.title)}</strong>
          <p>${escapeHtml(p.description)}</p>
        </article>`
      )
      .join("");
  } catch (err) {
    container.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

async function loadClientOrders() {
  const listEl = $("client-orders-list");
  const activeEl = $("client-active-order");
  listEl.innerHTML = '<p class="empty-state">Завантаження...</p>';

  try {
    const orders = await apiRequest("/api/client/orders");
    if (!orders.length) {
      listEl.innerHTML = '<p class="empty-state">У вас ще немає замовлень</p>';
      activeEl.innerHTML = "";
      return;
    }

    const active = orders.find((o) => o.status === "new" || o.status === "in_progress");
    activeEl.innerHTML = active
      ? `<div class="card"><h3>Активне замовлення</h3>${renderOrderCard(active)}</div>`
      : "";

    listEl.innerHTML = orders.map((o) => renderOrderCard(o)).join("");
  } catch (err) {
    listEl.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

async function createOrder() {
  const btn = $("btn-create-order");
  btn.disabled = true;
  try {
    const order = await apiRequest("/api/client/orders", {
      method: "POST",
      body: JSON.stringify({}),
    });
    showToast(`Замовлення #${order.id} створено!`);
    await loadClientOrders();
  } catch (err) {
    showToast(err.message);
  } finally {
    btn.disabled = false;
  }
}

// ─── Worker ─────────────────────────────────────────────────

async function loadWorkerData() {
  await Promise.all([loadWorkerOrders(), renderProfile("worker")]);
}

async function loadWorkerOrders() {
  const container = $("worker-orders-list");
  container.innerHTML = '<p class="empty-state">Завантаження...</p>';

  try {
    const orders = await apiRequest("/api/worker/orders");
    workerOrders = orders;

    if (!orders.length) {
      container.innerHTML = '<p class="empty-state">Черга порожня — очікуємо нові замовлення</p>';
      return;
    }

    container.innerHTML = orders.map((o) => renderOrderCard(o, { workerMode: true })).join("");
    bindWorkerActions(container);
  } catch (err) {
    container.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

function setWsStatus(online) {
  $("ws-status-dot").className = `connection-dot ${online ? "online" : "offline"}`;
  $("ws-status-text").textContent = online ? "WebSocket: підключено" : "WebSocket: відключено";
}

function connectWebSocket() {
  disconnectWebSocket();
  const token = getToken();
  const role = localStorage.getItem(ROLE_KEY);
  if (!token || role !== "worker") return;

  const url = `${wsBaseUrl()}/ws/worker/${encodeURIComponent(token)}`;
  ws = new WebSocket(url);

  ws.onopen = () => {
    setWsStatus(true);
    clearTimeout(wsReconnectTimer);
  };

  ws.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.event === "new_order" && payload.order) {
        const exists = workerOrders.some((o) => o.id === payload.order.id);
        if (!exists) workerOrders.unshift(payload.order);
        showToast(`Нове замовлення #${payload.order.id}!`);
        loadWorkerOrders();
      }
    } catch {
      // ignore malformed messages
    }
  };

  ws.onclose = () => {
    setWsStatus(false);
    ws = null;
    if (localStorage.getItem(ROLE_KEY) === "worker" && getToken()) {
      wsReconnectTimer = setTimeout(connectWebSocket, 3000);
    }
  };

  ws.onerror = () => ws?.close();
}

function disconnectWebSocket() {
  clearTimeout(wsReconnectTimer);
  if (ws) {
    ws.onclose = null;
    ws.close();
    ws = null;
  }
  setWsStatus(false);
}

// ─── Profile ────────────────────────────────────────────────

async function renderProfile(role) {
  const cardId = role === "worker" ? "worker-profile-card" : "client-profile-card";
  const card = $(cardId);
  const username = localStorage.getItem(USERNAME_KEY) || "—";

  try {
    const me = await apiRequest("/api/me");
    card.innerHTML = `
      <div class="profile-row"><span>Логін</span><strong>${escapeHtml(me.username)}</strong></div>
      <div class="profile-row"><span>Роль</span><strong>${ROLE_LABELS[me.role] || me.role}</strong></div>
      <div class="profile-row"><span>ID</span><strong>${me.id}</strong></div>`;
  } catch {
    card.innerHTML = `
      <div class="profile-row"><span>Логін</span><strong>${escapeHtml(username)}</strong></div>
      <div class="profile-row"><span>Роль</span><strong>${ROLE_LABELS[role] || role}</strong></div>`;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ─── Bootstrap ──────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  $("login-form").addEventListener("submit", handleLogin);
  $("btn-create-order").addEventListener("click", createOrder);
  $("btn-logout-client").addEventListener("click", handleLogout);
  $("btn-logout-worker").addEventListener("click", handleLogout);

  initNavigation();

  const token = getToken();
  const role = localStorage.getItem(ROLE_KEY);

  if (token && (role === "client" || role === "worker")) {
    showApp(role);
  } else {
    clearSession();
    showLogin();
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
});