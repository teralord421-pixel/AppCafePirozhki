/**
 * API base URL — change for production (your backend host).
 * For GitHub Pages admin panel pointing to a remote API:
 *   const API_BASE_URL = "https://your-api.example.com";
 */
const API_BASE_URL = window.location.origin.includes("github.io")
  ? "https://YOUR_API_HOST.example.com"
  : window.location.origin.replace(/\/admin\/?$/, "");

const TOKEN_KEY = "admin_jwt_token";
const ROLE_KEY = "admin_role";

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

function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "index.html";
    return null;
  }
  return token;
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuth();
    window.location.href = "index.html";
    throw new Error("Unauthorized");
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

function initLoginPage() {
  const form = document.getElementById("login-form");
  if (!form) return;

  if (getToken()) {
    window.location.href = "dashboard.html";
    return;
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
      window.location.href = "dashboard.html";
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

function openOrderModal(order = null) {
  document.getElementById("order-modal-title").textContent = order ? "Редактировать заказ" : "Новый заказ";
  document.getElementById("order-id").value = order?.id || "";
  document.getElementById("order-city-id").value = order?.cityId || order?.city_id || "kyiv";
  document.getElementById("order-branch-id").value = order?.branchId || order?.branch_id || "kyiv-podil";
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

document.addEventListener("DOMContentLoaded", () => {
  initLoginPage();
  initDashboard();
});