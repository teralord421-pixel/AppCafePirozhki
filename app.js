const defaultCities = [
  {
    id: "kyiv",
    name: "Київ",
    deliveryFee: 49,
    freeDeliveryFrom: 300,
    deliveryEta: "25-35 хв",
    branches: [
      {
        id: "kyiv-podil",
        name: "Поділ",
        address: "вул. Нижній Вал 18",
        phone: "+380 67 110 18 18",
        hours: "08:00-21:00",
        pickupEta: "7-10 хв",
      },
      {
        id: "kyiv-pozniaky",
        name: "Позняки",
        address: "просп. Григоренка 22",
        phone: "+380 67 110 22 22",
        hours: "08:00-22:00",
        pickupEta: "8-12 хв",
      },
    ],
  },
  {
    id: "lviv",
    name: "Львів",
    deliveryFee: 45,
    freeDeliveryFrom: 280,
    deliveryEta: "25-35 хв",
    branches: [
      {
        id: "lviv-halytskyi",
        name: "Галицька",
        address: "вул. Братів Рогатинців 9",
        phone: "+380 67 210 09 09",
        hours: "08:00-21:00",
        pickupEta: "8-12 хв",
      },
      {
        id: "lviv-sykhiv",
        name: "Сихів",
        address: "просп. Червоної Калини 60",
        phone: "+380 67 210 60 60",
        hours: "09:00-21:00",
        pickupEta: "9-13 хв",
      },
    ],
  },
  {
    id: "odesa",
    name: "Одеса",
    deliveryFee: 55,
    freeDeliveryFrom: 320,
    deliveryEta: "30-40 хв",
    branches: [
      {
        id: "odesa-center",
        name: "Центр",
        address: "вул. Дерибасівська 14",
        phone: "+380 67 310 14 14",
        hours: "08:00-22:00",
        pickupEta: "10-15 хв",
      },
      {
        id: "odesa-tairova",
        name: "Таїрова",
        address: "вул. Академіка Корольова 72",
        phone: "+380 67 310 72 72",
        hours: "09:00-21:00",
        pickupEta: "10-14 хв",
      },
    ],
  },
  {
    id: "dnipro",
    name: "Дніпро",
    deliveryFee: 50,
    freeDeliveryFrom: 300,
    deliveryEta: "25-35 хв",
    branches: [
      {
        id: "dnipro-center",
        name: "Центр",
        address: "вул. Короленка 3",
        phone: "+380 67 410 03 03",
        hours: "08:00-21:00",
        pickupEta: "9-13 хв",
      },
      {
        id: "dnipro-peremoha",
        name: "Перемога",
        address: "наб. Перемоги 86",
        phone: "+380 67 410 86 86",
        hours: "09:00-21:00",
        pickupEta: "10-14 хв",
      },
    ],
  },
  {
    id: "kharkiv",
    name: "Харків",
    deliveryFee: 49,
    freeDeliveryFrom: 300,
    deliveryEta: "30-40 хв",
    branches: [
      {
        id: "kharkiv-sumska",
        name: "Сумська",
        address: "вул. Сумська 35",
        phone: "+380 67 510 35 35",
        hours: "08:00-21:00",
        pickupEta: "10-14 хв",
      },
      {
        id: "kharkiv-oleksiivka",
        name: "Олексіївка",
        address: "просп. Перемоги 62",
        phone: "+380 67 510 62 62",
        hours: "09:00-21:00",
        pickupEta: "10-15 хв",
      },
    ],
  },
];

let cities = defaultCities.map((city) => ({
  ...city,
  branches: city.branches.map((branch) => ({ ...branch })),
}));

const categories = [
  { id: "all", label: "Усе" },
  { id: "fried", label: "Смажені" },
  { id: "baked", label: "Печені" },
  { id: "sets", label: "Набори" },
  { id: "drinks", label: "Напої" },
];

const defaultMenuItems = [
  {
    id: "potato-fried",
    category: "fried",
    mark: "К",
    name: "Пиріжок з картоплею",
    description: "Смажений, м'яке тісто, картопля з цибулею і легким перцем.",
    price: 34,
    tags: ["хіт", "вегетаріанський"],
    featured: true,
  },
  {
    id: "meat-fried",
    category: "fried",
    mark: "М",
    name: "Пиріжок з м'ясом",
    description: "Соковита начинка з курки та яловичини, без зайвого соусу.",
    price: 48,
    tags: ["ситний", "гарячий"],
    featured: true,
  },
  {
    id: "cabbage-baked",
    category: "baked",
    mark: "К",
    name: "Печений з капустою",
    description: "Капуста, морква, спеції і тонка золотиста скоринка.",
    price: 36,
    tags: ["печений"],
    featured: false,
  },
  {
    id: "cheese-baked",
    category: "baked",
    mark: "С",
    name: "Пиріжок з сиром",
    description: "Домашній сир, трохи ванілі, теплий і не надто солодкий.",
    price: 42,
    tags: ["солодкий"],
    featured: true,
  },
  {
    id: "cherry-baked",
    category: "baked",
    mark: "В",
    name: "Пиріжок з вишнею",
    description: "Вишня у власному соку, щільна начинка без штучного присмаку.",
    price: 44,
    tags: ["солодкий", "печений"],
    featured: false,
  },
  {
    id: "mushroom-fried",
    category: "fried",
    mark: "Г",
    name: "Пиріжок з грибами",
    description: "Печериці, цибуля, зелень і тепла крафтова подача.",
    price: 46,
    tags: ["новинка"],
    featured: false,
  },
  {
    id: "lunch-set",
    category: "sets",
    mark: "2",
    name: "Набір 2+напій",
    description: "Два пиріжки на вибір і фільтр-кава або узвар.",
    price: 109,
    tags: ["вигідно"],
    featured: true,
  },
  {
    id: "family-set",
    category: "sets",
    mark: "6",
    name: "Пакет для своїх",
    description: "Шість пиріжків у крафтовому пакеті для дому або офісу.",
    price: 229,
    tags: ["крафт пакет"],
    featured: false,
  },
  {
    id: "coffee",
    category: "drinks",
    mark: "К",
    name: "Фільтр-кава",
    description: "Крафтовий стакан, чорна кришка, без сиропів і зайвого декору.",
    price: 39,
    tags: ["гарячий напій"],
    featured: false,
  },
  {
    id: "uzvar",
    category: "drinks",
    mark: "У",
    name: "Домашній узвар",
    description: "Сухофрукти, натуральний смак, пляшка 330 мл.",
    price: 35,
    tags: ["холодний напій"],
    featured: false,
  },
];

const defaultProductDetails = {
  "potato-fried": {
    weight: "95 г",
    kcal: "214 ккал",
    ingredients: ["пшеничне тісто", "картопля", "цибуля", "олія", "чорний перець"],
    allergens: ["глютен"],
  },
  "meat-fried": {
    weight: "105 г",
    kcal: "268 ккал",
    ingredients: ["пшеничне тісто", "курка", "яловичина", "цибуля", "перець"],
    allergens: ["глютен"],
  },
  "cabbage-baked": {
    weight: "98 г",
    kcal: "198 ккал",
    ingredients: ["пшеничне тісто", "капуста", "морква", "олія", "спеції"],
    allergens: ["глютен"],
  },
  "cheese-baked": {
    weight: "100 г",
    kcal: "236 ккал",
    ingredients: ["пшеничне тісто", "домашній сир", "ваніль", "цукор"],
    allergens: ["глютен", "молоко"],
  },
  "cherry-baked": {
    weight: "102 г",
    kcal: "224 ккал",
    ingredients: ["пшеничне тісто", "вишня", "цукор", "крохмаль"],
    allergens: ["глютен"],
  },
  "mushroom-fried": {
    weight: "100 г",
    kcal: "246 ккал",
    ingredients: ["пшеничне тісто", "печериці", "цибуля", "зелень", "олія"],
    allergens: ["глютен"],
  },
  "lunch-set": {
    weight: "2 пиріжки + 250 мл",
    kcal: "від 430 ккал",
    ingredients: ["2 пиріжки на вибір", "фільтр-кава або узвар", "крафтове пакування"],
    allergens: ["залежить від вибору пиріжків"],
  },
  "family-set": {
    weight: "6 пиріжків",
    kcal: "від 1180 ккал",
    ingredients: ["6 пиріжків на вибір", "крафтовий пакет", "брендова вкладка"],
    allergens: ["залежить від вибору пиріжків"],
  },
  coffee: {
    weight: "250 мл",
    kcal: "5 ккал",
    ingredients: ["арабіка", "вода"],
    allergens: ["немає"],
  },
  uzvar: {
    weight: "330 мл",
    kcal: "96 ккал",
    ingredients: ["сухофрукти", "вода", "мед", "лимон"],
    allergens: ["мед"],
  },
};

const defaultPromos = [
  {
    id: "svoi10",
    title: "Свої -10%",
    text: "Знижка на перше замовлення у застосунку. Працює для самовивозу і доставки.",
    code: "SVOI10",
    discount: 10,
    minSubtotal: 0,
  },
  {
    id: "ranok",
    title: "Ранковий набір",
    text: "Пиріжок з сиром + фільтр-кава до 11:00 за спеціальною ціною.",
    code: "RANOK",
    discount: 12,
    minSubtotal: 80,
  },
  {
    id: "office",
    title: "Пакет в офіс",
    text: "При замовленні від 6 пиріжків додаємо крафтове пакування без доплати.",
    code: "OFFICE",
    discount: 5,
    minSubtotal: 180,
  },
];

const storageKey = "pyrizhky-lab-app-v3";
const API_BASE = "";
const accountRoles = {
  customer: { label: "Клієнт", pin: "", home: "home" },
  worker: { label: "Працівник", pin: "2222", home: "staff" },
  admin: { label: "Адмін", pin: "9999", home: "admin" },
};
const staffStatusMeta = {
  new: { label: "Нове", index: 0 },
  cooking: { label: "Готуємо", index: 1 },
  ready: { label: "Очікує видачі", index: 2 },
  done: { label: "Видано", index: 3 },
};
const initialState = {
  cityId: "kyiv",
  branchId: "kyiv-podil",
  screen: "home",
  role: "customer",
  category: "all",
  query: "",
  orderType: "pickup",
  cart: {},
  promoCode: "",
  orders: [],
  activeOrder: null,
  staffStatuses: {},
  favorites: [],
  spentPoints: 0,
  loyalty: {
    spentPoints: 0,
    totalSpent: 0,
    earnedPoints: 0,
    points: 0,
  },
  clientSession: null,
  useBonus: false,
  menuItems: cloneData(defaultMenuItems),
  productDetails: cloneData(defaultProductDetails),
  promos: cloneData(defaultPromos),
  profile: {
    name: "",
    phone: "",
    birthday: "",
  },
  authToken: null,
};

let state = normalizeState(loadState());
let menuItems = state.menuItems;
let productDetails = state.productDetails;
let promos = state.promos;
let promotions = [];
let authToken = state.authToken || null;
let clientAuthToken = state.clientSession?.token || null;
let serverOnline = false;
let staffOrders = [];
let deferredInstallPrompt = null;
let toastTimer = null;
let scannerStream = null;
let scannerFrame = null;
let scannerDetector = null;
let workerSocket = null;
let workerSocketTimer = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function isClientLoggedIn() {
  return Boolean(clientAuthToken);
}

async function clientApiRequest(path, options = {}) {
  if (!clientAuthToken) throw new Error("Увійдіть в акаунт клієнта");
  const headers = { ...(options.headers || {}) };
  if (options.body) headers["Content-Type"] = "application/json";
  headers.Authorization = `Bearer ${clientAuthToken}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    let message = `Помилка ${response.status}`;
    try {
      const data = await response.json();
      if (typeof data.detail === "string") message = data.detail;
    } catch {
      // ignore parse errors
    }
    if (response.status === 401) {
      logoutClient(false);
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body) headers["Content-Type"] = "application/json";
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    let message = `Помилка ${response.status}`;
    try {
      const data = await response.json();
      if (typeof data.detail === "string") message = data.detail;
      else if (Array.isArray(data.detail)) {
        message = data.detail.map((entry) => entry.msg || entry).join(", ");
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

function applyCatalog(catalog) {
  cities = catalog.cities.map((city) => ({
    id: city.id,
    name: city.name,
    deliveryFee: city.deliveryFee,
    freeDeliveryFrom: city.freeDeliveryFrom,
    deliveryEta: city.deliveryEta,
    branches: city.branches.map((branch) => ({
      id: branch.id,
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      hours: branch.hours,
      pickupEta: branch.pickupEta,
    })),
  }));

  menuItems = catalog.menuItems.map((item) =>
    normalizeMenuItem({
      id: item.id,
      category: item.category,
      mark: item.mark,
      name: item.name,
      description: item.description,
      price: item.price,
      tags: item.tags,
      featured: item.featured,
      image: item.image || "",
    })
  );

  productDetails = normalizeProductDetails(
    Object.fromEntries(
      catalog.menuItems
        .filter((item) => item.details)
        .map((item) => [item.id, item.details])
    )
  );
  promos = catalog.promos.map(normalizePromo);
  if (Array.isArray(catalog.promotions)) {
    promotions = catalog.promotions.map(normalizePromotion);
  }
  serverOnline = true;
}

async function reloadCatalog() {
  const catalog = await apiRequest("/api/catalog");
  applyCatalog(catalog);
  state = normalizeState({
    ...state,
    menuItems,
    productDetails,
    promos,
  });
  saveState();
  renderHomePromotions();
}

async function loadPromotions() {
  if (promotions.length) return promotions;
  try {
    const data = await apiRequest("/api/promotions");
    promotions = Array.isArray(data) ? data.map(normalizePromotion) : [];
  } catch {
    promotions = [];
  }
  return promotions;
}

function mapServerOrder(order) {
  return {
    id: order.id,
    city: order.city,
    branch: order.branch,
    cityId: order.cityId,
    branchId: order.branchId,
    orderType: order.orderType,
    typeLabel: order.typeLabel,
    status: order.status,
    total: order.total,
    promoCode: order.promoCode || "",
    bonusDiscount: order.bonusDiscount || 0,
    itemsCount: order.itemsCount,
    eta: order.eta,
    time: order.time || "",
    payment: order.payment,
    address: order.address || "",
    apartment: order.apartment || "",
    items: (order.items || []).map((entry) => ({
      id: entry.id,
      quantity: entry.quantity,
    })),
    createdAtMs: order.createdAtMs,
    createdAt: order.createdAt,
    customer: order.customer || { name: "", phone: "" },
  };
}

function wsBaseUrl() {
  const base = API_BASE || window.location.origin;
  return base.replace(/^http/, "ws");
}

function disconnectWorkerSocket() {
  clearTimeout(workerSocketTimer);
  if (workerSocket) {
    workerSocket.onclose = null;
    workerSocket.close();
    workerSocket = null;
  }
}

function connectWorkerSocket() {
  disconnectWorkerSocket();
  if (!authToken || !(state.role === "worker" || state.role === "admin")) return;

  const socket = new WebSocket(`${wsBaseUrl()}/ws/worker/${encodeURIComponent(authToken)}`);
  workerSocket = socket;

  socket.onopen = () => {
    clearTimeout(workerSocketTimer);
  };

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.event === "new_order") {
        showToast(`Нове замовлення: ${payload.order?.id || ""}`);
        refreshStaffOrders().then(() => renderStaff()).catch(() => {});
      }
    } catch {
      // ignore malformed payloads
    }
  };

  socket.onclose = () => {
    workerSocket = null;
    if (authToken && (state.role === "worker" || state.role === "admin")) {
      workerSocketTimer = setTimeout(connectWorkerSocket, 3000);
    }
  };

  socket.onerror = () => socket.close();
}

async function refreshStaffOrders() {
  if (!serverOnline || !authToken) return;
  const orders = await apiRequest("/api/orders?limit=50");
  staffOrders = orders.map(mapServerOrder);
  staffOrders.forEach((order) => {
    state.staffStatuses[order.id] = order.status;
  });
  saveState();
}

async function refreshActiveOrderStatus() {
  if (!serverOnline || !state.activeOrder) return;
  try {
    const order = mapServerOrder(await apiRequest(`/api/orders/${state.activeOrder.id}`));
    state.activeOrder = order;
    state.staffStatuses[order.id] = order.status;
    saveState();
    renderActiveOrder();
  } catch {
    // order may be archived or unavailable
  }
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function cleanText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function cleanList(value) {
  return String(value || "")
    .split(",")
    .map((item) => cleanText(item))
    .filter(Boolean);
}

function makeId(prefix, value) {
  const base = cleanText(value)
    .toLocaleLowerCase("uk-UA")
    .replace(/[^a-z0-9а-яіїєґ]+/giu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
  return `${prefix}-${base || Date.now().toString(36)}`;
}

function normalizeMenuItem(item) {
  return {
    id: cleanText(item?.id) || makeId("item", item?.name || "new"),
    category: categories.some((category) => category.id === item?.category && category.id !== "all") ? item.category : "fried",
    mark: cleanText(item?.mark || item?.name?.[0] || "П").slice(0, 2).toLocaleUpperCase("uk-UA"),
    name: cleanText(item?.name) || "Новий товар",
    description: cleanText(item?.description) || "Опис товару.",
    price: Math.max(1, Math.round(Number(item?.price || 1))),
    tags: Array.isArray(item?.tags) ? item.tags.map(cleanText).filter(Boolean) : [],
    featured: Boolean(item?.featured),
    image: typeof item?.image === "string" && (item.image.startsWith("data:") || item.image.startsWith("http") || item.image.startsWith("/")) ? item.image : "",
  };
}

function normalizeProductDetails(details) {
  const source = details && typeof details === "object" ? details : {};
  return Object.fromEntries(
    Object.entries(source).map(([id, detail]) => [
      id,
      {
        weight: cleanText(detail?.weight) || "уточнюйте на точці",
        kcal: cleanText(detail?.kcal) || "уточнюйте",
        ingredients: Array.isArray(detail?.ingredients) ? detail.ingredients.map(cleanText).filter(Boolean) : [],
        allergens: Array.isArray(detail?.allergens) ? detail.allergens.map(cleanText).filter(Boolean) : [],
      },
    ])
  );
}

function normalizePromotion(promotion) {
  return {
    id: Number(promotion?.id) || 0,
    title: cleanText(promotion?.title) || "Акція",
    description: cleanText(promotion?.description) || "",
  };
}

function normalizePromo(promo) {
  const code = cleanText(promo?.code).toLocaleUpperCase("uk-UA");
  return {
    id: cleanText(promo?.id) || makeId("promo", code || promo?.title || "new"),
    title: cleanText(promo?.title) || "Нова акція",
    text: cleanText(promo?.text) || "Опис акції.",
    code: code || `PROMO${Date.now().toString().slice(-4)}`,
    discount: Math.min(90, Math.max(1, Math.round(Number(promo?.discount || 1)))),
    minSubtotal: Math.max(0, Math.round(Number(promo?.minSubtotal || 0))),
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    authToken = saved?.authToken || null;
    clientAuthToken = saved?.clientSession?.token || null;
    return {
      ...initialState,
      ...saved,
      cart: saved?.cart || {},
      orders: saved?.orders || [],
      authToken: saved?.authToken || null,
    };
  } catch {
    return { ...initialState };
  }
}

function normalizeState(nextState = {}) {
  const selectedCity = cities.find((item) => item.id === nextState.cityId) || cities[0];
  const selectedBranch = selectedCity.branches.find((item) => item.id === nextState.branchId) || selectedCity.branches[0];
  const role = accountRoles[nextState.role] ? nextState.role : "customer";
  return {
    ...initialState,
    ...nextState,
    cityId: selectedCity.id,
    branchId: selectedBranch.id,
    role,
    cart: nextState.cart || {},
    orders: Array.isArray(nextState.orders) ? nextState.orders : [],
    activeOrder: nextState.activeOrder || null,
    staffStatuses: nextState.staffStatuses && typeof nextState.staffStatuses === "object" ? nextState.staffStatuses : {},
    favorites: Array.isArray(nextState.favorites) ? nextState.favorites : [],
    spentPoints: Number(nextState.spentPoints || 0),
    loyalty: {
      spentPoints: Number(nextState.loyalty?.spentPoints || 0),
      totalSpent: Number(nextState.loyalty?.totalSpent || 0),
      earnedPoints: Number(nextState.loyalty?.earnedPoints || 0),
      points: Number(nextState.loyalty?.points || 0),
    },
    clientSession: nextState.clientSession || null,
    useBonus: Boolean(nextState.useBonus),
    menuItems: Array.isArray(nextState.menuItems) ? nextState.menuItems.map(normalizeMenuItem) : cloneData(defaultMenuItems),
    productDetails: normalizeProductDetails(nextState.productDetails || defaultProductDetails),
    promos: Array.isArray(nextState.promos) ? nextState.promos.map(normalizePromo) : cloneData(defaultPromos),
    profile: { ...initialState.profile, ...(nextState.profile || {}) },
  };
}

function saveState() {
  state.authToken = authToken;
  state.clientSession = clientAuthToken
    ? { token: clientAuthToken, username: state.clientSession?.username || "" }
    : null;
  const payload = { ...state };
  if (serverOnline) {
    delete payload.menuItems;
    delete payload.productDetails;
    delete payload.promos;
  } else {
    payload.menuItems = menuItems;
    payload.productDetails = productDetails;
    payload.promos = promos;
  }
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function currentCity() {
  return cities.find((item) => item.id === state.cityId) || cities[0];
}

function currentBranch() {
  return currentCity().branches.find((item) => item.id === state.branchId) || currentCity().branches[0];
}

function money(value) {
  return `${value.toLocaleString("uk-UA")} грн`;
}

function productInfo(item) {
  return {
    weight: "уточнюйте на точці",
    kcal: "уточнюйте",
    ingredients: ["свіже тісто", "начинка"],
    allergens: ["глютен"],
    ...(productDetails[item.id] || {}),
  };
}

function isFavorite(itemId) {
  return state.favorites.includes(itemId);
}

function loyaltyStats() {
  const nextReward = 100;
  if (isClientLoggedIn() && serverOnline) {
    const loyalty = state.loyalty || {};
    const points = Number(loyalty.points || 0);
    return {
      spent: Number(loyalty.totalSpent || 0),
      earnedPoints: Number(loyalty.earnedPoints || 0),
      spentPoints: Number(loyalty.spentPoints || 0),
      points,
      nextReward,
      progress: Math.min(100, Math.round((points / nextReward) * 100)),
    };
  }
  const spent = state.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const earnedPoints = Math.floor(spent * 0.05);
  const spentPoints = Number(state.spentPoints || 0);
  const points = Math.max(0, earnedPoints - spentPoints);
  const progress = Math.min(100, Math.round((points / nextReward) * 100));
  return { spent, earnedPoints, spentPoints, points, nextReward, progress };
}

function applyClientProfile(profile) {
  state.profile = {
    name: profile.displayName || state.profile.name,
    phone: profile.phone || state.profile.phone,
    birthday: profile.birthday || state.profile.birthday,
  };
  state.favorites = Array.isArray(profile.favorites) ? profile.favorites : [];
  state.loyalty = {
    spentPoints: profile.loyalty?.spentPoints || 0,
    totalSpent: profile.loyalty?.totalSpent || 0,
    earnedPoints: profile.loyalty?.earnedPoints || 0,
    points: profile.loyalty?.points || 0,
  };
  state.spentPoints = state.loyalty.spentPoints;
  state.clientSession = {
    token: clientAuthToken,
    username: profile.username || state.clientSession?.username || "",
  };
}

async function pushClientProfile() {
  if (!isClientLoggedIn() || !serverOnline) return;
  const profile = await clientApiRequest("/api/client/profile", {
    method: "PUT",
    body: JSON.stringify({
      displayName: state.profile.name,
      phone: state.profile.phone,
      birthday: state.profile.birthday,
      favorites: state.favorites,
    }),
  });
  applyClientProfile(profile);
  saveState();
}

async function syncClientData() {
  if (!isClientLoggedIn() || !serverOnline) return;
  const [profile, orders] = await Promise.all([
    clientApiRequest("/api/client/profile"),
    clientApiRequest("/api/client/orders"),
  ]);
  applyClientProfile(profile);
  state.orders = orders.map(mapServerOrder);
  if (state.activeOrder) {
    const active = state.orders.find((order) => order.id === state.activeOrder.id);
    if (active) state.activeOrder = active;
  }
  saveState();
  renderHistory();
  renderProfile();
  renderHome();
  renderFeatured();
  renderMenu();
}

async function loginClient() {
  const phone = String($("#profileForm")?.elements.profilePhone?.value || state.profile.phone || "").trim();
  const password = String($("#clientPassword")?.value || "").trim();
  if (!phone || !isValidPhone(phone)) {
    showToast("Введіть коректний телефон у профілі");
    return;
  }
  if (password.length < 4) {
    showToast("Пароль має містити щонайменше 4 символи");
    return;
  }
  if (!serverOnline) {
    showToast("Сервер недоступний");
    return;
  }
  try {
    const session = await apiRequest("/api/client/login", {
      method: "POST",
      body: JSON.stringify({ username: phone, password }),
    });
    clientAuthToken = session.access_token;
    state.clientSession = { token: clientAuthToken, username: phone };
    await syncClientData();
    $("#clientPassword").value = "";
    renderProfile();
    showToast("Ви увійшли в акаунт");
  } catch (error) {
    showToast(error.message || "Не вдалося увійти");
  }
}

async function registerClient() {
  const phone = String($("#profileForm")?.elements.profilePhone?.value || state.profile.phone || "").trim();
  const name = String($("#profileForm")?.elements.profileName?.value || state.profile.name || "").trim();
  const birthday = String($("#profileForm")?.elements.profileBirthday?.value || state.profile.birthday || "");
  const password = String($("#clientPassword")?.value || "").trim();
  if (!phone || !isValidPhone(phone)) {
    showToast("Введіть коректний телефон у профілі");
    return;
  }
  if (password.length < 4) {
    showToast("Пароль має містити щонайменше 4 символи");
    return;
  }
  if (!serverOnline) {
    showToast("Сервер недоступний");
    return;
  }
  try {
    const session = await apiRequest("/api/client/register", {
      method: "POST",
      body: JSON.stringify({ phone, name, password, birthday }),
    });
    clientAuthToken = session.access_token;
    state.clientSession = { token: clientAuthToken, username: phone };
    state.profile = { name, phone, birthday };
    await pushClientProfile();
    await syncClientData();
    $("#clientPassword").value = "";
    renderProfile();
    showToast("Акаунт створено");
  } catch (error) {
    showToast(error.message || "Не вдалося зареєструватися");
  }
}

function logoutClient(notify = true) {
  clientAuthToken = null;
  state.clientSession = null;
  saveState();
  renderProfile();
  if (notify) showToast("Ви вийшли з акаунта");
}

const qrAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
const qrGfExp = Array(512);
const qrGfLog = Array(256);
let qrGfValue = 1;
for (let index = 0; index < 255; index += 1) {
  qrGfExp[index] = qrGfValue;
  qrGfLog[qrGfValue] = index;
  qrGfValue <<= 1;
  if (qrGfValue & 0x100) qrGfValue ^= 0x11d;
}
for (let index = 255; index < 512; index += 1) qrGfExp[index] = qrGfExp[index - 255];

function qrGfMultiply(left, right) {
  return left && right ? qrGfExp[qrGfLog[left] + qrGfLog[right]] : 0;
}

function qrReedSolomonDivisor(degree) {
  const result = [1];
  for (let index = 0; index < degree; index += 1) {
    result.push(0);
    for (let term = 0; term < result.length - 1; term += 1) {
      result[term] = qrGfMultiply(result[term], qrGfExp[index]) ^ result[term + 1];
    }
  }
  return result.slice(0, degree);
}

function qrReedSolomonRemainder(data, degree) {
  const divisor = qrReedSolomonDivisor(degree);
  const result = Array(degree).fill(0);
  data.forEach((byte) => {
    const factor = byte ^ result.shift();
    result.push(0);
    divisor.forEach((coefficient, index) => {
      result[index] ^= qrGfMultiply(coefficient, factor);
    });
  });
  return result;
}

function qrAppendBits(bits, value, length) {
  for (let index = length - 1; index >= 0; index -= 1) bits.push((value >>> index) & 1);
}

function qrCodewords(seed) {
  const text = cleanText(seed).toLocaleUpperCase("uk-UA");
  const bits = [];
  qrAppendBits(bits, 0b0010, 4);
  qrAppendBits(bits, text.length, 9);
  for (let index = 0; index < text.length; index += 2) {
    const first = qrAlphabet.indexOf(text[index]);
    const second = qrAlphabet.indexOf(text[index + 1]);
    if (first < 0) continue;
    if (second >= 0) {
      qrAppendBits(bits, first * 45 + second, 11);
    } else {
      qrAppendBits(bits, first, 6);
    }
  }
  qrAppendBits(bits, 0, Math.min(4, 152 - bits.length));
  while (bits.length % 8) bits.push(0);

  const codewords = [];
  for (let index = 0; index < bits.length; index += 8) {
    codewords.push(Number.parseInt(bits.slice(index, index + 8).join(""), 2));
  }
  for (let pad = 0; codewords.length < 19; pad += 1) codewords.push(pad % 2 ? 0x11 : 0xec);
  return [...codewords, ...qrReedSolomonRemainder(codewords, 7)];
}

function qrFormatBits() {
  const data = 0b01000;
  let remainder = data << 10;
  for (let bit = 14; bit >= 10; bit -= 1) {
    if ((remainder >>> bit) & 1) remainder ^= 0x537 << (bit - 10);
  }
  return ((data << 10) | remainder) ^ 0x5412;
}

function qrMatrix(seed) {
  const size = 21;
  const modules = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const set = (x, y, dark, reserve = true) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    modules[y][x] = Boolean(dark);
    if (reserve) reserved[y][x] = true;
  };
  const finder = (left, top) => {
    for (let y = -1; y <= 7; y += 1) {
      for (let x = -1; x <= 7; x += 1) {
        const xx = left + x;
        const yy = top + y;
        const dark =
          x >= 0 &&
          x <= 6 &&
          y >= 0 &&
          y <= 6 &&
          (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4));
        set(xx, yy, dark);
      }
    }
  };

  finder(0, 0);
  finder(size - 7, 0);
  finder(0, size - 7);
  for (let index = 8; index < size - 8; index += 1) {
    set(index, 6, index % 2 === 0);
    set(6, index, index % 2 === 0);
  }
  for (let index = 0; index < 9; index += 1) {
    reserved[8][index] = true;
    reserved[index][8] = true;
  }
  for (let index = size - 8; index < size; index += 1) {
    reserved[8][index] = true;
    reserved[index][8] = true;
  }
  set(8, size - 8, true);

  const dataBits = qrCodewords(seed).flatMap((byte) =>
    Array.from({ length: 8 }, (_, index) => (byte >>> (7 - index)) & 1)
  );
  let bitIndex = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vertical = 0; vertical < size; vertical += 1) {
      const y = upward ? size - 1 - vertical : vertical;
      for (let delta = 0; delta < 2; delta += 1) {
        const x = right - delta;
        if (reserved[y][x]) continue;
        let dark = bitIndex < dataBits.length && dataBits[bitIndex] === 1;
        bitIndex += 1;
        if ((x + y) % 2 === 0) dark = !dark;
        modules[y][x] = dark;
      }
    }
    upward = !upward;
  }

  const format = qrFormatBits();
  for (let index = 0; index <= 5; index += 1) set(8, index, (format >>> index) & 1);
  set(8, 7, (format >>> 6) & 1);
  set(8, 8, (format >>> 7) & 1);
  set(7, 8, (format >>> 8) & 1);
  for (let index = 9; index < 15; index += 1) set(14 - index, 8, (format >>> index) & 1);
  for (let index = 0; index < 8; index += 1) set(size - 1 - index, 8, (format >>> index) & 1);
  for (let index = 8; index < 15; index += 1) set(8, size - 15 + index, (format >>> index) & 1);
  set(8, size - 8, true);
  return modules;
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => ({
      item: menuItems.find((menuItem) => menuItem.id === id),
      quantity,
    }))
    .filter((entry) => entry.item && entry.quantity > 0);
}

function subtotal() {
  return cartEntries().reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
}

function cartCount() {
  return Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0);
}

function activePromo() {
  return promos.find((promo) => promo.code === state.promoCode) || null;
}

function discountAmount() {
  const promo = activePromo();
  if (!promo || subtotal() < promo.minSubtotal) return 0;
  return Math.round((subtotal() * promo.discount) / 100);
}

function bonusDiscountAmount() {
  if (!state.useBonus) return 0;
  if (loyaltyStats().points < 100) return 0;
  if (subtotal() < 100) return 0;
  return 50;
}

function deliveryFee() {
  if (state.orderType !== "delivery" || subtotal() === 0) return 0;
  const selectedCity = currentCity();
  return subtotal() >= selectedCity.freeDeliveryFrom ? 0 : selectedCity.deliveryFee;
}

function total() {
  return Math.max(0, subtotal() - discountAmount() - bonusDiscountAmount() + deliveryFee());
}

function normalizeSearch(value) {
  return value.trim().toLocaleLowerCase("uk-UA");
}

function isValidPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

function showToast(message) {
  const toast = $("#toast");
  const live = $("#statusLive");
  toast.textContent = message;
  live.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function canOpenScreen(screen) {
  if (screen === "staff") return state.role === "worker" || state.role === "admin";
  if (screen === "admin") return state.role === "admin";
  return true;
}

function roleRequiredMessage(screen) {
  return screen === "admin" ? "Увійдіть як адміністратор" : "Увійдіть як працівник";
}

function setRole(role) {
  if (!accountRoles[role]) return;
  state.role = role;
  if (role === "customer") authToken = null;
  if (!canOpenScreen(state.screen)) state.screen = accountRoles[role].home;
  saveState();
  renderAccount();
  renderStaff();
  renderAdmin();
  setScreen(accountRoles[role].home);
  if ($("#accountDialog")?.open) $("#accountDialog").close();
  showToast(`Аккаунт: ${accountRoles[role].label}`);
}

async function loginRole(role) {
  const pinInput = $("#accountPin");
  const pin = String(pinInput?.value || "").trim();

  try {
    if (role === "customer") {
      authToken = null;
      disconnectWorkerSocket();
      if (pinInput) pinInput.value = "";
      setRole(role);
      return;
    }

    if (!serverOnline) {
      if (pin !== accountRoles[role].pin) {
        showToast("Невірний PIN");
        return;
      }
      if (pinInput) pinInput.value = "";
      setRole(role);
      return;
    }

    const session = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ role, pin }),
    });
    authToken = session.token || session.access_token;
    if (pinInput) pinInput.value = "";
    setRole(role);
    if (role === "worker" || role === "admin") {
      await refreshStaffOrders();
      renderStaff();
      connectWorkerSocket();
    }
  } catch (error) {
    showToast(error.message || "Не вдалося увійти");
  }
}

function setScreen(screen) {
  if (!canOpenScreen(screen)) {
    showToast(roleRequiredMessage(screen));
    $("#accountDialog")?.showModal();
    return;
  }

  state.screen = screen;
  saveState();

  $$(".screen").forEach((section) => {
    section.classList.toggle("is-active", section.dataset.screen === screen);
  });

  $$(".nav-item[data-nav]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.nav === screen);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (screen === "staff" && serverOnline && authToken) {
    refreshStaffOrders().then(() => renderStaff()).catch(() => {});
  }
}

function setCity(cityId) {
  const selectedCity = cities.find((item) => item.id === cityId);
  if (!selectedCity) return;

  state.cityId = selectedCity.id;
  state.branchId = selectedCity.branches[0].id;
  saveState();
  renderAll(false);
  showToast(`Місто змінено: ${selectedCity.name}`);
}

function setBranch(branchId) {
  const selectedBranch = currentCity().branches.find((item) => item.id === branchId);
  if (!selectedBranch) return;

  state.branchId = selectedBranch.id;
  saveState();
  renderAll(false);
  showToast(`Філія: ${selectedBranch.name}`);
}

function setOrderType(orderType) {
  state.orderType = orderType;
  saveState();
  renderCheckout();
  renderCart();
}

function changeQuantity(itemId, delta) {
  const nextQuantity = (state.cart[itemId] || 0) + delta;
  if (nextQuantity <= 0) {
    delete state.cart[itemId];
  } else {
    state.cart[itemId] = nextQuantity;
  }

  saveState();
  renderFeatured();
  renderMenu();
  renderCart();
}

function removeItem(itemId) {
  delete state.cart[itemId];
  saveState();
  renderFeatured();
  renderMenu();
  renderCart();
}

async function toggleFavorite(itemId) {
  const added = !isFavorite(itemId);
  state.favorites = added ? [...state.favorites, itemId] : state.favorites.filter((favoriteId) => favoriteId !== itemId);
  saveState();
  renderFeatured();
  renderMenu();
  renderProfile();
  if (isClientLoggedIn() && serverOnline) {
    try {
      await pushClientProfile();
    } catch (error) {
      showToast(error.message || "Не вдалося зберегти улюблене на сервері");
    }
  }
  showToast(added ? "Додано в улюблене" : "Прибрано з улюбленого");
}

function openProduct(itemId) {
  const item = menuItems.find((menuItem) => menuItem.id === itemId);
  if (!item) return;

  const info = productInfo(item);
  const quantity = state.cart[item.id] || 0;
  $("#productDialogContent").innerHTML = `
    <div class="product-hero">
      ${item.image
        ? `<div class="item-visual item-photo" aria-hidden="true"><img src="${item.image}" alt="${item.name}"></div>`
        : `<div class="item-visual item-visual-${item.category}" aria-hidden="true">${item.mark}</div>`
      }
      <div>
        <span class="label">${categories.find((category) => category.id === item.category)?.label || "позиція"}</span>
        <h2>${item.name}</h2>
        <p>${item.description}</p>
      </div>
    </div>
    <div class="product-facts">
      <span><strong>${money(item.price)}</strong> ціна</span>
      <span><strong>${info.weight}</strong> вага</span>
      <span><strong>${info.kcal}</strong> енергія</span>
    </div>
    <section class="product-section">
      <h3>Склад</h3>
      <p>${info.ingredients.join(", ")}.</p>
    </section>
    <section class="product-section">
      <h3>Алергени</h3>
      <p>${info.allergens.join(", ")}.</p>
    </section>
    <div class="product-actions">
      <button class="ghost-btn" type="button" data-favorite="${item.id}">
        ${isFavorite(item.id) ? "В улюбленому" : "В улюблене"}
      </button>
      <button class="primary-btn" type="button" data-add="${item.id}">
        ${quantity ? `Додати ще (${quantity})` : "Додати в кошик"}
      </button>
    </div>
  `;
  $("#productDialog").showModal();
}

function clearCart() {
  state.cart = {};
  state.promoCode = "";
  state.useBonus = false;
  saveState();
  renderFeatured();
  renderMenu();
  renderPromos();
  renderCart();
  showToast("Кошик очищено");
}

function applyPromo(code) {
  const promo = promos.find((item) => item.code === code);
  if (!promo) return;

  if (subtotal() < promo.minSubtotal) {
    showToast(`Промокод ${code} працює від ${money(promo.minSubtotal)}`);
    return;
  }

  state.promoCode = code;
  saveState();
  renderPromos();
  renderCart();
  setScreen("orders");
  showToast(`Промокод ${code} застосовано`);
}

function removePromo() {
  state.promoCode = "";
  saveState();
  renderPromos();
  renderCart();
}

function toggleBonus() {
  const loyalty = loyaltyStats();
  if (!state.useBonus && loyalty.points < 100) {
    showToast("Для списання потрібно 100 балів");
    return;
  }
  if (!state.useBonus && subtotal() < 100) {
    showToast("Бонус можна списати в замовленні від 100 грн");
    setScreen("menu");
    return;
  }

  state.useBonus = !state.useBonus;
  saveState();
  renderCart();
  renderProfile();
  showToast(state.useBonus ? "Бонус 50 грн застосовано" : "Бонус прибрано");
}

function filteredMenuItems() {
  const query = normalizeSearch(state.query);
  return menuItems.filter((item) => {
    const categoryMatch = state.category === "all" || item.category === state.category;
    const text = `${item.name} ${item.description} ${item.tags.join(" ")}`.toLocaleLowerCase("uk-UA");
    const queryMatch = !query || text.includes(query);
    return categoryMatch && queryMatch;
  });
}

function renderHome() {
  const selectedCity = currentCity();
  const selectedBranch = currentBranch();
  $("#activeCityLabel").textContent = selectedCity.name;
  $("#homeBranchName").textContent = selectedBranch.name;
  $("#homeBranchAddress").textContent = selectedBranch.address;
  $("#homePickupEta").textContent = selectedBranch.pickupEta;
  $("#homeDeliveryMeta").textContent = `${money(selectedCity.deliveryFee)} • ${selectedCity.deliveryEta}`;
  $("#homeDeliveryFree").textContent = `безкоштовно від ${money(selectedCity.freeDeliveryFrom)}`;
  $("#openStatus").textContent = `сьогодні ${selectedBranch.hours}`;
  renderHomePromotions();
}

function renderHomePromotions() {
  const section = $("#homePromotionsSection");
  const container = $("#homePromotions");
  if (!section || !container) return;

  if (!promotions.length) {
    section.hidden = true;
    container.innerHTML = "";
    return;
  }

  section.hidden = false;
  container.innerHTML = promotions
    .map(
      (promotion) => `
      <article class="promo-card home-promo-card">
        <h2>${cleanText(promotion.title)}</h2>
        <p>${cleanText(promotion.description)}</p>
      </article>`
    )
    .join("");
}

function renderCategories() {
  $("#categoryFilters").innerHTML = categories
    .map(
      (category) => `
        <button class="category-btn ${state.category === category.id ? "is-active" : ""}" type="button" data-category="${category.id}">
          ${category.label}
        </button>
      `
    )
    .join("");
}

function itemCard(item, featured = false) {
  const quantity = state.cart[item.id] || 0;
  const favorite = isFavorite(item.id);
  const controls = quantity
    ? `
      <div class="item-controls" aria-label="Кількість ${item.name}">
        <button class="qty-btn" type="button" data-dec="${item.id}" aria-label="Зменшити">−</button>
        <strong>${quantity}</strong>
        <button class="qty-btn" type="button" data-inc="${item.id}" aria-label="Збільшити">+</button>
      </div>
    `
    : `<button class="add-btn" type="button" data-add="${item.id}">Додати</button>`;

  const visualHtml = item.image
    ? `<div class="item-visual item-photo" aria-hidden="true"><img src="${item.image}" alt="${cleanText(item.name)}" loading="lazy"></div>`
    : `<div class="item-visual item-visual-${item.category}" aria-hidden="true">${item.mark}</div>`;

  return `
    <article class="menu-card ${featured ? "featured" : ""}">
      ${visualHtml}
      <div class="item-content">
        <div class="item-meta">
          <div>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </div>
          <div class="item-side">
            <button class="favorite-btn ${favorite ? "is-active" : ""}" type="button" data-favorite="${item.id}" aria-label="${favorite ? "Прибрати з улюбленого" : "Додати в улюблене"}">★</button>
            <span class="price">${money(item.price)}</span>
          </div>
        </div>
        <div class="tags">
          ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <div class="item-actions">
          <button class="details-btn" type="button" data-detail="${item.id}">Докладніше</button>
          ${controls}
        </div>
      </div>
    </article>
  `;
}

function renderFeatured() {
  $("#featuredMenu").innerHTML = menuItems
    .filter((item) => item.featured)
    .map((item) => itemCard(item, true))
    .join("");
}

function renderMenu() {
  renderCategories();
  const items = filteredMenuItems();
  $("#menuSearch").value = state.query;
  $("#menuResultMeta").textContent = items.length
    ? `Знайдено ${items.length} позицій. Обрана філія: ${currentBranch().name}.`
    : "Нічого не знайдено. Спробуйте інший запит або категорію.";

  $("#menuGrid").innerHTML = items.length
    ? items.map((item) => itemCard(item)).join("")
    : `
      <div class="empty-state empty-card">
        <strong>Немає позицій</strong>
        <p>Очистіть пошук або оберіть іншу категорію.</p>
        <button class="ghost-btn" type="button" data-action="clear-search">Очистити пошук</button>
      </div>
    `;
}

function renderPromos() {
  const currentSubtotal = subtotal();
  $("#promoList").innerHTML = promos
    .map((promo) => {
      const isActive = state.promoCode === promo.code;
      const isAvailable = currentSubtotal >= promo.minSubtotal;
      const meta = promo.minSubtotal ? `від ${money(promo.minSubtotal)}` : "без мінімальної суми";
      return `
        <article class="promo-card ${isActive ? "is-selected" : ""}">
          <h2>${promo.title}</h2>
          <p>${promo.text}</p>
          <div class="promo-footer">
            <span class="promo-code">${promo.code}</span>
            <span class="label">-${promo.discount}% • ${meta}</span>
          </div>
          <button class="small-link" type="button" data-promo="${promo.code}" ${isActive ? "disabled" : ""}>
            ${isActive ? "Застосовано" : isAvailable ? "Застосувати" : "Застосувати пізніше"}
          </button>
        </article>
      `;
    })
    .join("");
}

function renderCart() {
  if (state.useBonus && bonusDiscountAmount() === 0) {
    state.useBonus = false;
    saveState();
  }

  const entries = cartEntries();
  const badge = $("#cartBadge");
  badge.textContent = cartCount();
  badge.classList.toggle("is-visible", cartCount() > 0);

  if (!entries.length) {
    $("#cartList").innerHTML = $("#emptyCartTemplate").innerHTML;
    $("#cartSummary").innerHTML = "";
    return;
  }

  $("#cartList").innerHTML = entries
    .map(
      ({ item, quantity }) => `
        <div class="cart-row">
          <div>
            <strong>${item.name}</strong>
            <p>${money(item.price)} за 1 шт. • ${money(item.price * quantity)}</p>
          </div>
          <div class="quantity-controls">
            <button class="qty-btn" type="button" data-dec="${item.id}" aria-label="Зменшити">−</button>
            <span>${quantity}</span>
            <button class="qty-btn" type="button" data-inc="${item.id}" aria-label="Збільшити">+</button>
            <button class="qty-btn danger" type="button" data-remove="${item.id}" aria-label="Видалити">×</button>
          </div>
        </div>
      `
    )
    .join("");

  const promo = activePromo();
  const promoLine = promo
    ? `
      <div class="summary-row">
        <span>Промокод ${promo.code}</span>
        <button class="inline-btn" type="button" data-action="remove-promo">прибрати</button>
      </div>
    `
    : `
      <div class="summary-row">
        <span>Промокод</span>
        <button class="inline-btn" type="button" data-nav="promos">обрати</button>
      </div>
    `;

  const loyalty = loyaltyStats();
  const canUseBonus = loyalty.points >= 100 && subtotal() >= 100;
  const bonusLine = `
    <div class="summary-row">
      <span>Бонуси</span>
      <button class="inline-btn" type="button" data-action="toggle-bonus" ${!state.useBonus && !canUseBonus ? "disabled" : ""}>
        ${state.useBonus ? "прибрати −50 грн" : canUseBonus ? "списати 100 балів" : `${loyalty.points}/100 балів`}
      </button>
    </div>
  `;

  $("#cartSummary").innerHTML = `
    <div class="summary-row"><span>Сума</span><strong>${money(subtotal())}</strong></div>
    ${promoLine}
    <div class="summary-row"><span>Знижка</span><strong>${money(discountAmount())}</strong></div>
    ${bonusLine}
    <div class="summary-row"><span>Списання балів</span><strong>${bonusDiscountAmount() ? `-${money(bonusDiscountAmount())}` : "0 грн"}</strong></div>
    <div class="summary-row"><span>Доставка</span><strong>${deliveryFee() ? money(deliveryFee()) : "0 грн"}</strong></div>
    <div class="summary-row total"><span>До сплати</span><strong>${money(total())}</strong></div>
    <div class="cart-actions">
      <button class="ghost-btn" type="button" data-action="clear-cart">Очистити</button>
      <button class="primary-btn" type="button" data-nav="orders">Оформити</button>
    </div>
    <p class="form-hint">${currentCity().name}, ${currentBranch().name}. ${state.orderType === "pickup" ? `Самовивіз ${currentBranch().pickupEta}` : `Доставка ${currentCity().deliveryEta}`}.</p>
  `;
}

function renderCheckout() {
  $$("input[name='orderType']").forEach((input) => {
    input.checked = input.value === state.orderType;
  });

  $("#branchSelect").innerHTML = currentCity().branches
    .map((branch) => `<option value="${branch.id}" ${branch.id === state.branchId ? "selected" : ""}>${branch.name} - ${branch.address}</option>`)
    .join("");

  const deliveryFields = $("#deliveryFields");
  deliveryFields.hidden = state.orderType !== "delivery";
  $$("[name='address']").forEach((input) => {
    input.required = state.orderType === "delivery";
  });
}

function renderCustomerDefaults() {
  const form = $("#orderForm");
  if (!form) return;

  if (!form.elements.name.value && state.profile.name) form.elements.name.value = state.profile.name;
  if (!form.elements.phone.value && state.profile.phone) form.elements.phone.value = state.profile.phone;
}

function renderLocations() {
  $("#locationList").innerHTML = cities
    .map(
      (cityItem) => `
        <article class="location-card ${cityItem.id === state.cityId ? "is-selected" : ""}">
          <div class="section-heading">
            <div>
              <span class="label">${cityItem.id === state.cityId ? "обрано" : "місто"}</span>
              <h2>${cityItem.name}</h2>
              <p>Доставка ${cityItem.deliveryEta} • ${money(cityItem.deliveryFee)}</p>
            </div>
            <button class="small-link" type="button" data-city="${cityItem.id}">Обрати</button>
          </div>
          <div class="branch-list">
            ${cityItem.branches
              .map(
                (branchItem) => `
                  <button class="branch-card ${branchItem.id === state.branchId ? "is-selected" : ""}" type="button" data-city="${cityItem.id}" data-branch="${branchItem.id}">
                    <strong>${branchItem.name}</strong>
                    <span>${branchItem.address}</span>
                    <small>${branchItem.hours} • самовивіз ${branchItem.pickupEta}</small>
                  </button>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderCityDialog() {
  $("#cityDialogList").innerHTML = cities
    .map(
      (cityItem) => `
        <button class="city-choice ${cityItem.id === state.cityId ? "is-selected" : ""}" type="button" data-city="${cityItem.id}">
          <strong>${cityItem.name}</strong>
          <span>Філій: ${cityItem.branches.length}. Доставка ${cityItem.deliveryEta}, ${money(cityItem.deliveryFee)}.</span>
        </button>
      `
    )
    .join("");
}

function renderHistory() {
  if (!state.orders.length) {
    $("#orderHistory").innerHTML = `<p class="form-hint">Поки що немає оформлених замовлень.</p>`;
    return;
  }

  $("#orderHistory").innerHTML = state.orders
    .slice(0, 6)
    .map(
      (order) => `
        <article class="history-item">
          <div class="section-heading">
            <div>
              <strong>${order.id}</strong>
              <p>${order.city}, ${order.branch} • ${order.typeLabel}</p>
            </div>
            <span class="price">${money(order.total)}</span>
          </div>
          <p>${order.createdAt} • ${order.itemsCount} позицій • ${order.eta}</p>
          <button class="small-link" type="button" data-repeat="${order.id}">Повторити</button>
        </article>
      `
    )
    .join("");
}

function renderNetworkState() {
  const isOnline = navigator.onLine && serverOnline;
  $("#networkLabel").textContent = isOnline ? "online" : serverOnline ? "offline" : "local";
  $("#networkLabel").classList.toggle("is-offline", !isOnline);
}

function orderStatus(order) {
  const isDelivery = order.orderType === "delivery" || order.typeLabel === "Доставка";
  const steps = isDelivery
    ? ["Прийнято", "Готуємо", "Передано кур'єру", "Доставлено"]
    : ["Прийнято", "Готуємо", "Очікує видачі", "Видано"];
  const staffStatus = order.status || state.staffStatuses?.[order.id];
  if (staffStatus && staffStatusMeta[staffStatus]) {
    return { label: staffStatusMeta[staffStatus].label, index: staffStatusMeta[staffStatus].index, steps };
  }
  const ageMinutes = Math.floor((Date.now() - Number(order.createdAtMs || Date.now())) / 60000);
  const index = Math.min(steps.length - 1, Math.max(0, Math.floor(ageMinutes / 8)));
  return { label: steps[index], index, steps };
}

function renderQr(seed) {
  const quietZone = 4;
  const matrix = qrMatrix(seed);
  const moduleCount = matrix.length;
  const size = moduleCount + quietZone * 2;
  const rects = [];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const mx = x - quietZone;
      const my = y - quietZone;
      if (matrix[my]?.[mx]) {
        rects.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
      }
    }
  }

  const label = cleanText(seed);
  return `<svg class="qr-svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="QR ${label}"><rect class="qr-bg" width="${size}" height="${size}"/><g class="qr-fg">${rects.join("")}</g></svg>`;
}

function activeOrderMarkup(order, compact = false) {
  const status = orderStatus(order);
  return `
    <div class="active-order-head">
      <div>
        <span class="label">активне замовлення</span>
        <h2>${order.id}</h2>
        <p>${order.city}, ${order.branch} • ${order.typeLabel} • ${order.eta}</p>
      </div>
      <div class="mini-qr" aria-label="Код замовлення">${renderQr(order.id)}</div>
    </div>
    <div class="status-steps" aria-label="Статус замовлення">
      ${status.steps
        .map((step, index) => `<span class="${index <= status.index ? "is-done" : ""}">${step}</span>`)
        .join("")}
    </div>
    ${compact ? "" : `<button class="small-link" type="button" data-action="complete-active-order">Позначити отриманим</button>`}
  `;
}

function renderActiveOrder() {
  const targets = [$("#homeActiveOrder"), $("#activeOrderCard")];
  targets.forEach((target, index) => {
    if (!target) return;
    if (!state.activeOrder) {
      target.hidden = true;
      target.innerHTML = "";
      return;
    }

    target.hidden = false;
    target.innerHTML = activeOrderMarkup(state.activeOrder, index === 0);
  });
}

function renderProfile() {
  const form = $("#profileForm");
  if (!form) return;

  form.elements.profileName.value = state.profile.name;
  form.elements.profilePhone.value = state.profile.phone;
  form.elements.profileBirthday.value = state.profile.birthday;

  const loggedIn = isClientLoggedIn();
  $("#clientAuthLoggedOut")?.toggleAttribute("hidden", loggedIn);
  $("#clientAuthLoggedIn")?.toggleAttribute("hidden", !loggedIn);
  if (loggedIn) {
    const label = state.profile.name || state.profile.phone || state.clientSession?.username || "клієнт";
    $("#clientAuthStatus").textContent = `Ви увійшли як ${label}. Дані синхронізуються з сервером.`;
  }
  $("#profileSyncHint").textContent = loggedIn
    ? "Профіль, улюблене, історія та бали зберігаються на сервері."
    : "Без входу дані зберігаються лише на цьому пристрої.";

  const loyalty = loyaltyStats();
  $("#loyaltyPoints").textContent = `${loyalty.points} балів`;
  $("#loyaltyProgress").style.width = `${loyalty.progress}%`;
  $("#loyaltyText").textContent = loyalty.points
    ? `Нараховано ${loyalty.earnedPoints}, списано ${loyalty.spentPoints}. До бонусу 100 балів залишилось ${Math.max(0, loyalty.nextReward - loyalty.points)}.`
    : "Оформіть перше замовлення, щоб отримати бали.";
  const bonusToggle = $("#bonusToggle");
  const canUseBonus = loyalty.points >= 100 && subtotal() >= 100;
  bonusToggle.disabled = !state.useBonus && !canUseBonus;
  bonusToggle.textContent = state.useBonus
    ? "Бонус −50 грн застосовано"
    : loyalty.points >= 100 && subtotal() < 100
      ? "Додайте замовлення від 100 грн"
      : loyalty.points >= 100
        ? "Списати 100 балів"
      : `Потрібно ще ${Math.max(0, 100 - loyalty.points)} балів`;

  const favorites = state.favorites
    .map((id) => menuItems.find((item) => item.id === id))
    .filter(Boolean);

  $("#favoritesList").innerHTML = favorites.length
    ? favorites
        .map(
          (item) => `
            <article class="favorite-row">
              <div>
                <strong>${item.name}</strong>
                <p>${money(item.price)} • ${item.tags.join(", ")}</p>
              </div>
              <button class="small-link" type="button" data-add="${item.id}">Додати</button>
            </article>
          `
        )
        .join("")
    : `<p class="form-hint">Натисніть ★ біля позиції в меню, щоб зберегти її тут.</p>`;
}

function renderInstallButton() {
  const header = $(".top-row");
  let button = $("#installButton");
  if (!deferredInstallPrompt) {
    button?.remove();
    return;
  }

  if (!button) {
    button = document.createElement("button");
    button.id = "installButton";
    button.className = "install-pill";
    button.type = "button";
    button.dataset.action = "install-app";
    button.textContent = "встановити";
    header.append(button);
  }
}

function renderAccount() {
  const role = accountRoles[state.role] || accountRoles.customer;
  $("#accountLabel").textContent = role.label;
  $$("[data-nav='staff']").forEach((button) => {
    button.hidden = !(state.role === "worker" || state.role === "admin");
  });
  $$("[data-nav='admin']").forEach((button) => {
    button.hidden = state.role !== "admin";
  });
}

function orderItemsText(order) {
  return (order.items || [])
    .map((entry) => {
      const item = menuItems.find((menuItem) => menuItem.id === entry.id);
      return `${item?.name || entry.id} x${entry.quantity}`;
    })
    .join(", ");
}

async function setOrderWorkflow(orderId, status) {
  if (!staffStatusMeta[status]) return;

  try {
    if (serverOnline && authToken) {
      const updated = mapServerOrder(
        await apiRequest(`/api/orders/${orderId}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        })
      );
      state.staffStatuses = { ...state.staffStatuses, [orderId]: updated.status };
      if (state.activeOrder?.id === orderId) state.activeOrder = updated;
      await refreshStaffOrders();
    } else {
      state.staffStatuses = { ...state.staffStatuses, [orderId]: status };
      if (state.activeOrder?.id === orderId) {
        state.activeOrder = { ...state.activeOrder, status };
      }
      saveState();
      renderStaff();
    }
    renderActiveOrder();
    showToast(`${orderId}: ${staffStatusMeta[status].label}`);
  } catch (error) {
    showToast(error.message || "Не вдалося оновити статус");
  }
}

function renderStaff() {
  const target = $("#staffOrders");
  if (!target) return;
  if (!(state.role === "worker" || state.role === "admin")) {
    target.innerHTML = `<p class="form-hint">Увійдіть як працівник або адміністратор.</p>`;
    return;
  }

  const orders = serverOnline && authToken ? staffOrders : state.orders;
  if (!orders.length) {
    target.innerHTML = `<p class="form-hint">Поки що немає замовлень у черзі.</p>`;
    return;
  }

  target.innerHTML = orders
    .map((order) => {
      const status = order.status || state.staffStatuses[order.id] || "new";
      const statusInfo = staffStatusMeta[status] || staffStatusMeta.new;
      const address = order.orderType === "delivery" ? ` • ${order.address || "адресу не вказано"}` : "";
      return `
        <article class="staff-order">
          <div class="section-heading">
            <div>
              <strong>${order.id}</strong>
              <p>${order.createdAt} • ${order.city}, ${order.branch}${address}</p>
            </div>
            <span class="status-pill ${status === "new" ? "is-muted" : ""}">${statusInfo.label}</span>
          </div>
          <p><strong>Клієнт:</strong> ${order.customer?.name || "без імені"} • ${order.customer?.phone || "без телефону"}</p>
          <p><strong>Склад:</strong> ${orderItemsText(order) || "немає позицій"}</p>
          <p><strong>Сума:</strong> ${money(order.total)} • ${order.typeLabel} • ${order.payment || "оплата не вказана"}</p>
          <div class="worker-actions">
            <button class="ghost-btn" type="button" data-staff-status="${order.id}" data-status="cooking">Готуємо</button>
            <button class="ghost-btn" type="button" data-staff-status="${order.id}" data-status="ready">Готово</button>
            <button class="primary-btn" type="button" data-staff-status="${order.id}" data-status="done">Видано</button>
          </div>
        </article>
      `;
    })
    .join("");
}

async function verifyOrderCode(rawCode) {
  const code = cleanText(rawCode || $("#workerScanInput")?.value).toLocaleUpperCase("uk-UA");
  const target = $("#workerScanResult");
  if (!code) {
    target.textContent = "Введіть або відскануйте код замовлення.";
    return;
  }

  try {
    let order = null;
    if (serverOnline && authToken) {
      order = mapServerOrder(await apiRequest(`/api/orders/${code}`));
      await setOrderWorkflow(order.id, "done");
      await refreshStaffOrders();
      order = staffOrders.find((item) => item.id === order.id) || order;
    } else {
      order = state.orders.find((item) => item.id.toLocaleUpperCase("uk-UA") === code);
      if (!order) {
        target.textContent = `Замовлення ${code} не знайдено.`;
        showToast("Замовлення не знайдено");
        return;
      }
      state.staffStatuses = { ...state.staffStatuses, [order.id]: "done" };
      saveState();
      renderStaff();
      renderActiveOrder();
    }

    target.textContent = `${order.id} підтверджено. До сплати: ${money(order.total)}.`;
    showToast(`QR підтверджено: ${order.id}`);
  } catch (error) {
    target.textContent = `Замовлення ${code} не знайдено.`;
    showToast(error.message || "Замовлення не знайдено");
  }
}

async function startQrScanner() {
  const video = $("#qrScannerVideo");
  if (!("BarcodeDetector" in window) || !navigator.mediaDevices?.getUserMedia) {
    showToast("Камера/BarcodeDetector не підтримуються. Введіть код вручну.");
    return;
  }
  stopQrScanner(false);
  try {
    scannerDetector = new BarcodeDetector({ formats: ["qr_code"] });
    scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = scannerStream;
    video.hidden = false;
    await video.play();
    const scan = async () => {
      if (!scannerStream) return;
      try {
        const codes = await scannerDetector.detect(video);
        if (codes.length) {
          verifyOrderCode(codes[0].rawValue);
          stopQrScanner(false);
          return;
        }
      } catch {
        stopQrScanner(false);
        showToast("Не вдалося прочитати QR");
        return;
      }
      scannerFrame = requestAnimationFrame(scan);
    };
    scan();
    showToast("Сканер увімкнено");
  } catch {
    stopQrScanner(false);
    showToast("Не вдалося відкрити камеру");
  }
}

function stopQrScanner(notify = true) {
  if (scannerFrame) cancelAnimationFrame(scannerFrame);
  scannerFrame = null;
  scannerStream?.getTracks().forEach((track) => track.stop());
  scannerStream = null;
  const video = $("#qrScannerVideo");
  if (video) {
    video.pause();
    video.srcObject = null;
    video.hidden = true;
  }
  if (notify) showToast("Сканер зупинено");
}

function fillAdminCategoryOptions() {
  const select = $("#adminProductForm")?.elements.productCategory;
  if (!select) return;
  select.innerHTML = categories
    .filter((category) => category.id !== "all")
    .map((category) => `<option value="${category.id}">${category.label}</option>`)
    .join("");
}

function resetAdminProductForm() {
  const form = $("#adminProductForm");
  if (!form) return;
  form.reset();
  form.elements.productId.value = "";
  form.elements.productCategory.value = "fried";
  form.elements.productMark.value = "П";
  form.elements.productFeatured.value = "false";
  if (form.elements.productImage) form.elements.productImage.value = "";
  const file = $("#productImageFile");
  if (file) file.value = "";
  const preview = $("#productImagePreview");
  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }
}

function resetAdminPromoForm() {
  const form = $("#adminPromoForm");
  if (!form) return;
  form.reset();
  form.elements.promoId.value = "";
  form.elements.promoDiscount.value = 10;
  form.elements.promoMinSubtotal.value = 0;
}

async function saveAdminProduct(form) {
  if (state.role !== "admin") {
    showToast("Потрібен аккаунт адміністратора");
    return;
  }
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const existingId = cleanText(formData.get("productId"));
  const payload = {
    category: formData.get("productCategory"),
    mark: formData.get("productMark"),
    name: formData.get("productName"),
    description: formData.get("productDescription"),
    price: Number(formData.get("productPrice")),
    tags: cleanList(formData.get("productTags")),
    featured: formData.get("productFeatured") === "true",
    image: formData.get("productImage") || "",
    weight: formData.get("productWeight"),
    kcal: formData.get("productKcal"),
    ingredients: cleanList(formData.get("productIngredients")),
    allergens: cleanList(formData.get("productAllergens")),
  };

  try {
    if (serverOnline && authToken) {
      const path = existingId ? `/api/menu/${existingId}` : "/api/menu";
      const method = existingId ? "PUT" : "POST";
      if (existingId) payload.id = existingId;
      await apiRequest(path, { method, body: JSON.stringify(payload) });
      await reloadCatalog();
    } else {
      let productId = existingId || makeId("item", formData.get("productName"));
      while (!existingId && menuItems.some((item) => item.id === productId)) {
        productId = `${productId}-${Date.now().toString(36).slice(-4)}`;
      }
      const item = normalizeMenuItem({ id: productId, ...payload });
      const details = normalizeProductDetails({
        [item.id]: {
          weight: payload.weight,
          kcal: payload.kcal,
          ingredients: payload.ingredients,
          allergens: payload.allergens,
        },
      })[item.id];
      const index = menuItems.findIndex((menuItem) => menuItem.id === item.id);
      if (index >= 0) {
        menuItems = menuItems.map((menuItem) => (menuItem.id === item.id ? item : menuItem));
      } else {
        menuItems = [item, ...menuItems];
      }
      productDetails = { ...productDetails, [item.id]: details };
      saveState();
    }

    resetAdminProductForm();
    renderFeatured();
    renderMenu();
    renderProfile();
    renderAdmin();
    showToast("Товар збережено");
  } catch (error) {
    showToast(error.message || "Не вдалося зберегти товар");
  }
}

async function deleteAdminProduct(productId) {
  if (state.role !== "admin") return;
  const item = menuItems.find((menuItem) => menuItem.id === productId);
  if (!item) return;
  if (!confirm(`Видалити товар "${item.name}"?`)) return;

  try {
    if (serverOnline && authToken) {
      await apiRequest(`/api/menu/${productId}`, { method: "DELETE" });
      await reloadCatalog();
    } else {
      menuItems = menuItems.filter((menuItem) => menuItem.id !== productId);
      productDetails = Object.fromEntries(Object.entries(productDetails).filter(([id]) => id !== productId));
      saveState();
    }
    delete state.cart[productId];
    state.favorites = state.favorites.filter((id) => id !== productId);
    saveState();
    renderFeatured();
    renderMenu();
    renderCart();
    renderProfile();
    renderAdmin();
    showToast("Товар видалено");
  } catch (error) {
    showToast(error.message || "Не вдалося видалити товар");
  }
}

async function saveAdminPromo(form) {
  if (state.role !== "admin") {
    showToast("Потрібен аккаунт адміністратора");
    return;
  }
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const existingId = cleanText(formData.get("promoId"));
  const payload = {
    title: formData.get("promoTitle"),
    code: formData.get("promoCode"),
    discount: Number(formData.get("promoDiscount")),
    minSubtotal: Number(formData.get("promoMinSubtotal")),
    text: formData.get("promoText"),
  };

  try {
    if (serverOnline && authToken) {
      const path = existingId ? `/api/promos/${existingId}` : "/api/promos";
      const method = existingId ? "PUT" : "POST";
      if (existingId) payload.id = existingId;
      await apiRequest(path, { method, body: JSON.stringify(payload) });
      await reloadCatalog();
    } else {
      const promo = normalizePromo({
        id: existingId || makeId("promo", formData.get("promoCode") || formData.get("promoTitle")),
        ...payload,
      });
      const duplicateCode = promos.some((item) => item.code === promo.code && item.id !== promo.id);
      if (duplicateCode) {
        showToast("Промокод вже існує");
        return;
      }
      const index = promos.findIndex((item) => item.id === promo.id);
      if (index >= 0) {
        promos = promos.map((item) => (item.id === promo.id ? promo : item));
      } else {
        promos = [promo, ...promos];
      }
      saveState();
    }

    resetAdminPromoForm();
    renderPromos();
    renderCart();
    renderAdmin();
    showToast("Акцію збережено");
  } catch (error) {
    showToast(error.message || "Не вдалося зберегти акцію");
  }
}

async function deleteAdminPromo(promoId) {
  if (state.role !== "admin") return;
  const promo = promos.find((item) => item.id === promoId);
  if (!promo) return;
  if (!confirm(`Видалити акцію "${promo.title}"?`)) return;

  try {
    if (serverOnline && authToken) {
      await apiRequest(`/api/promos/${promoId}`, { method: "DELETE" });
      await reloadCatalog();
    } else {
      promos = promos.filter((item) => item.id !== promoId);
      saveState();
    }
    if (state.promoCode === promo.code) state.promoCode = "";
    saveState();
    renderPromos();
    renderCart();
    renderAdmin();
    showToast("Акцію видалено");
  } catch (error) {
    showToast(error.message || "Не вдалося видалити акцію");
  }
}

function loadAdminProduct(productId) {
  const item = menuItems.find((menuItem) => menuItem.id === productId);
  const form = $("#adminProductForm");
  if (!item || !form) return;
  const details = productInfo(item);
  form.elements.productId.value = item.id;
  form.elements.productName.value = item.name;
  form.elements.productCategory.value = item.category;
  form.elements.productMark.value = item.mark;
  form.elements.productPrice.value = item.price;
  form.elements.productDescription.value = item.description;
  form.elements.productTags.value = item.tags.join(", ");
  form.elements.productWeight.value = details.weight;
  form.elements.productKcal.value = details.kcal;
  form.elements.productFeatured.value = String(Boolean(item.featured));
  form.elements.productIngredients.value = details.ingredients.join(", ");
  form.elements.productAllergens.value = details.allergens.join(", ");
  if (form.elements.productImage) form.elements.productImage.value = item.image || "";
  const preview = $("#productImagePreview");
  if (preview) {
    if (item.image) {
      preview.src = item.image;
      preview.style.display = "block";
    } else {
      preview.src = "";
      preview.style.display = "none";
    }
  }
  const file = $("#productImageFile");
  if (file) file.value = "";
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function loadAdminPromo(promoId) {
  const promo = promos.find((item) => item.id === promoId);
  const form = $("#adminPromoForm");
  if (!promo || !form) return;
  form.elements.promoId.value = promo.id;
  form.elements.promoTitle.value = promo.title;
  form.elements.promoCode.value = promo.code;
  form.elements.promoDiscount.value = promo.discount;
  form.elements.promoMinSubtotal.value = promo.minSubtotal;
  form.elements.promoText.value = promo.text;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderAdmin() {
  fillAdminCategoryOptions();
  const productList = $("#adminProductList");
  const promoList = $("#adminPromoList");
  if (!productList || !promoList) return;
  if (state.role !== "admin") {
    productList.innerHTML = `<p class="form-hint">Увійдіть як адміністратор.</p>`;
    promoList.innerHTML = "";
    return;
  }

  productList.innerHTML = menuItems
    .map(
      (item) => `
        <article class="admin-row">
          <div class="section-heading">
            <div>
              ${item.image ? `<img src="${item.image}" alt="" style="width:42px;height:42px;object-fit:cover;border-radius:8px;margin-right:8px;vertical-align:middle;">` : ""}
              <strong>${item.name}</strong>
              <p>${categories.find((category) => category.id === item.category)?.label || item.category} • ${money(item.price)} • ${item.tags.join(", ") || "без тегів"}</p>
            </div>
            <span class="status-pill is-muted">${item.featured ? "популярне" : "меню"}</span>
          </div>
          <div class="admin-row-actions">
            <button class="ghost-btn" type="button" data-admin-edit-product="${item.id}">Редагувати</button>
            <button class="ghost-btn danger-outline" type="button" data-admin-delete-product="${item.id}">Видалити</button>
          </div>
        </article>
      `
    )
    .join("");

  promoList.innerHTML = promos
    .map(
      (promo) => `
        <article class="admin-row">
          <div class="section-heading">
            <div>
              <strong>${promo.title}</strong>
              <p>${promo.code} • -${promo.discount}% • від ${money(promo.minSubtotal)}</p>
            </div>
          </div>
          <p>${promo.text}</p>
          <div class="admin-row-actions">
            <button class="ghost-btn" type="button" data-admin-edit-promo="${promo.id}">Редагувати</button>
            <button class="ghost-btn danger-outline" type="button" data-admin-delete-promo="${promo.id}">Видалити</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderAll(restoreScreen = true) {
  renderHome();
  renderFeatured();
  renderMenu();
  renderPromos();
  renderCheckout();
  renderCustomerDefaults();
  renderCart();
  renderLocations();
  renderCityDialog();
  renderHistory();
  renderActiveOrder();
  renderProfile();
  renderAccount();
  renderStaff();
  renderAdmin();
  renderNetworkState();
  renderInstallButton();

  if (restoreScreen) {
    setScreen(state.screen);
  }
}

async function submitOrder(form) {
  if (!cartCount()) {
    $("#orderHint").textContent = "Спочатку додайте позиції в кошик.";
    setScreen("menu");
    return;
  }

  if (!isValidPhone(form.elements.phone.value)) {
    form.elements.phone.setCustomValidity("Введіть коректний номер телефону");
  } else {
    form.elements.phone.setCustomValidity("");
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const typeLabel = state.orderType === "pickup" ? "Самовивіз" : "Доставка";
  const eta = state.orderType === "pickup" ? currentBranch().pickupEta : currentCity().deliveryEta;
  const usedBonus = bonusDiscountAmount() > 0;
  let order;

  const orderPayload = {
    cityId: state.cityId,
    branchId: state.branchId,
    orderType: state.orderType,
    items: cartEntries().map(({ item, quantity }) => ({ id: item.id, quantity })),
    promoCode: state.promoCode,
    useBonus: state.useBonus,
    time: formData.get("time") || "",
    payment: formData.get("payment"),
    address: formData.get("address") || "",
    apartment: formData.get("apartment") || "",
    customerName: formData.get("name"),
    customerPhone: formData.get("phone"),
  };

  try {
    if (serverOnline) {
      const request = isClientLoggedIn() ? clientApiRequest : apiRequest;
      const path = isClientLoggedIn() ? "/api/client/orders" : "/api/orders";
      order = mapServerOrder(
        await request(path, {
          method: "POST",
          body: JSON.stringify(orderPayload),
        })
      );
    } else {
      const now = Date.now();
      order = {
        id: `LAB-${now.toString().slice(-6)}`,
        city: currentCity().name,
        branch: currentBranch().name,
        orderType: state.orderType,
        typeLabel,
        status: "new",
        total: total(),
        promoCode: state.promoCode,
        bonusDiscount: bonusDiscountAmount(),
        itemsCount: cartCount(),
        eta,
        time: formData.get("time"),
        payment: formData.get("payment"),
        address: formData.get("address") || "",
        apartment: formData.get("apartment") || "",
        items: cartEntries().map(({ item, quantity }) => ({ id: item.id, quantity })),
        createdAtMs: now,
        createdAt: new Date().toLocaleString("uk-UA", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        customer: {
          name: formData.get("name"),
          phone: formData.get("phone"),
        },
      };
    }
  } catch (error) {
    $("#orderHint").textContent = error.message || "Не вдалося оформити замовлення.";
    showToast(error.message || "Не вдалося оформити замовлення");
    return;
  }

  if (isClientLoggedIn() && serverOnline) {
    try {
      await syncClientData();
    } catch {
      state.orders = [order, ...state.orders].slice(0, 50);
    }
  } else {
    state.orders = [order, ...state.orders].slice(0, 10);
    if (usedBonus) state.spentPoints += 100;
  }
  state.activeOrder = order;
  state.staffStatuses[order.id] = order.status || "new";
  if (!state.profile.name && order.customer.name) state.profile.name = order.customer.name;
  if (!state.profile.phone && order.customer.phone) state.profile.phone = order.customer.phone;
  state.cart = {};
  state.promoCode = "";
  state.useBonus = false;
  saveState();
  form.reset();
  $("#orderHint").textContent = serverOnline
    ? isClientLoggedIn()
      ? "Замовлення збережено на сервері та в історії вашого акаунта."
      : "Замовлення збережено на сервері та в історії на цьому пристрої."
    : "Після підтвердження замовлення збережеться в історії на цьому пристрої.";
  $("#orderDialogTitle").textContent = order.id;
  $("#orderQr").innerHTML = renderQr(order.id);
  $("#orderDialogText").textContent = `${order.typeLabel || typeLabel}, ${order.city}, ${order.branch}. Орієнтовний час: ${order.eta}. До сплати: ${money(order.total)}.`;
  renderAll();
  $("#orderDialog").showModal();
}

function completeActiveOrder() {
  if (!state.activeOrder) return;
  state.activeOrder = null;
  saveState();
  renderActiveOrder();
  showToast("Замовлення позначено отриманим");
}

async function saveProfile(form) {
  const formData = new FormData(form);
  const phone = String(formData.get("profilePhone") || "").trim();
  if (phone && !isValidPhone(phone)) {
    form.elements.profilePhone.setCustomValidity("Введіть коректний номер телефону");
    form.reportValidity();
    return;
  }
  form.elements.profilePhone.setCustomValidity("");

  state.profile = {
    name: String(formData.get("profileName") || "").trim(),
    phone,
    birthday: String(formData.get("profileBirthday") || ""),
  };
  saveState();
  if (isClientLoggedIn() && serverOnline) {
    try {
      await pushClientProfile();
    } catch (error) {
      showToast(error.message || "Не вдалося зберегти профіль на сервері");
      return;
    }
  }
  renderProfile();
  showToast("Профіль збережено");
}

async function clearFavorites() {
  state.favorites = [];
  saveState();
  if (isClientLoggedIn() && serverOnline) {
    try {
      await pushClientProfile();
    } catch (error) {
      showToast(error.message || "Не вдалося очистити улюблене на сервері");
    }
  }
  renderFeatured();
  renderMenu();
  renderProfile();
  showToast("Улюблене очищено");
}

function exportData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "Пиріжки.lab",
    state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pyrizhky-lab-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Дані експортовано");
}

function resetAppData() {
  if (!confirm("Скинути профіль, кошик, історію та улюблене?")) return;
  localStorage.removeItem(storageKey);
  authToken = null;
  staffOrders = [];
  state = normalizeState({ ...initialState });
  saveState();
  renderAll();
  showToast("Дані застосунку скинуто");
}

function repeatOrder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;

  state.cart = {};
  order.items.forEach((item) => {
    state.cart[item.id] = item.quantity;
  });
  saveState();
  renderAll();
  setScreen("orders");
  showToast(`Замовлення ${orderId} додано в кошик`);
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest(
    "[data-nav], [data-action], [data-category], [data-add], [data-inc], [data-dec], [data-remove], [data-city], [data-branch], [data-promo], [data-repeat], [data-favorite], [data-detail], [data-admin-edit-product], [data-admin-delete-product], [data-admin-edit-promo], [data-admin-delete-promo], [data-role-login], [data-staff-status]"
  );

  if (!target) return;

  if (target.dataset.nav) setScreen(target.dataset.nav);
  if (target.dataset.action === "open-account") $("#accountDialog")?.showModal();
  if (target.dataset.roleLogin) await loginRole(target.dataset.roleLogin);
  if (target.dataset.staffStatus) await setOrderWorkflow(target.dataset.staffStatus, target.dataset.status);
  if (target.dataset.action === "start-qr-scan") await startQrScanner();
  if (target.dataset.action === "stop-qr-scan") stopQrScanner();
  if (target.dataset.action === "verify-order-code") await verifyOrderCode();
  if (target.dataset.action === "open-city") $("#cityDialog").showModal();
  if (target.dataset.action === "clear-search") {
    state.query = "";
    saveState();
    renderMenu();
  }
  if (target.dataset.action === "clear-cart") clearCart();
  if (target.dataset.action === "remove-promo") removePromo();
  if (target.dataset.action === "clear-history") {
    if (isClientLoggedIn() && serverOnline) {
      showToast("Історія зберігається в акаунті на сервері");
      return;
    }
    state.orders = [];
    saveState();
    renderHistory();
    renderProfile();
    showToast("Історію очищено");
  }
  if (target.dataset.action === "client-login") await loginClient();
  if (target.dataset.action === "client-register") await registerClient();
  if (target.dataset.action === "client-logout") logoutClient();
  if (target.dataset.action === "clear-favorites") clearFavorites();
  if (target.dataset.action === "complete-active-order") completeActiveOrder();
  if (target.dataset.action === "export-data") exportData();
  if (target.dataset.action === "reset-app") resetAppData();
  if (target.dataset.action === "install-app" && deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    renderInstallButton();
  }
  if (target.dataset.category) {
    state.category = target.dataset.category;
    saveState();
    renderMenu();
  }
  if (target.dataset.add) changeQuantity(target.dataset.add, 1);
  if (target.dataset.inc) changeQuantity(target.dataset.inc, 1);
  if (target.dataset.dec) changeQuantity(target.dataset.dec, -1);
  if (target.dataset.remove) removeItem(target.dataset.remove);
  if (target.dataset.city) {
    setCity(target.dataset.city);
    if (target.dataset.branch) setBranch(target.dataset.branch);
    if ($("#cityDialog").open) $("#cityDialog").close();
  }
  if (target.dataset.branch && !target.dataset.city) setBranch(target.dataset.branch);
  if (target.dataset.promo) applyPromo(target.dataset.promo);
  if (target.dataset.repeat) repeatOrder(target.dataset.repeat);
  if (target.dataset.favorite) await toggleFavorite(target.dataset.favorite);
  if (target.dataset.detail) openProduct(target.dataset.detail);
  if (target.dataset.adminEditProduct) loadAdminProduct(target.dataset.adminEditProduct);
  if (target.dataset.adminDeleteProduct) await deleteAdminProduct(target.dataset.adminDeleteProduct);
  if (target.dataset.adminEditPromo) loadAdminPromo(target.dataset.adminEditPromo);
  if (target.dataset.adminDeletePromo) await deleteAdminPromo(target.dataset.adminDeletePromo);
  if (target.dataset.action === "new-product") {
    resetAdminProductForm();
    const form = $("#adminProductForm");
    if (form) {
      form.elements.productImage && (form.elements.productImage.value = "");
    }
    const file = $("#productImageFile");
    if (file) file.value = "";
    const preview = $("#productImagePreview");
    if (preview) {
      preview.src = "";
      preview.style.display = "none";
    }
    form?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (target.dataset.action === "new-promo") {
    resetAdminPromoForm();
    $("#adminPromoForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (target.dataset.action === "clear-product-image") {
    const form = $("#adminProductForm");
    if (form) {
      if (form.elements.productImage) form.elements.productImage.value = "";
    }
    const file = $("#productImageFile");
    if (file) file.value = "";
    const preview = $("#productImagePreview");
    if (preview) {
      preview.src = "";
      preview.style.display = "none";
    }
  }
});

$("#menuSearch").addEventListener("input", (event) => {
  state.query = event.target.value;
  saveState();
  renderMenu();
});

$("#branchSelect").addEventListener("change", (event) => {
  setBranch(event.target.value);
});

$$("input[name='orderType']").forEach((input) => {
  input.addEventListener("change", (event) => {
    setOrderType(event.target.value);
  });
});

$("#orderForm").addEventListener("submit", (event) => {
  event.preventDefault();
  submitOrder(event.currentTarget).catch(() => {});
});

$("#profileForm").addEventListener("submit", (event) => {
  event.preventDefault();
  saveProfile(event.currentTarget).catch(() => {});
});

const adminProductFormEl = $("#adminProductForm");
if (adminProductFormEl) {
  adminProductFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAdminProduct(event.currentTarget).catch(() => {});
  });
}
const adminPromoFormEl = $("#adminPromoForm");
if (adminPromoFormEl) {
  adminPromoFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAdminPromo(event.currentTarget).catch(() => {});
  });
}

const productImageFileInput = $("#productImageFile");
const productImageHidden = () => {
  const f = $("#adminProductForm");
  return f ? f.elements.productImage : null;
};
const productImagePreviewEl = $("#productImagePreview");
if (productImageFileInput && productImagePreviewEl) {
  productImageFileInput.addEventListener("change", () => {
    const file = productImageFileInput.files && productImageFileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      const hidden = productImageHidden();
      if (hidden) hidden.value = dataUrl;
      productImagePreviewEl.src = dataUrl;
      productImagePreviewEl.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}

window.addEventListener("online", () => {
  Promise.all([reloadCatalog(), loadPromotions()])
    .then(() => {
      renderAll(false);
      if (authToken && (state.role === "worker" || state.role === "admin")) {
        return refreshStaffOrders().then(() => renderStaff());
      }
      return null;
    })
    .catch(() => {})
    .finally(() => {
      renderNetworkState();
      showToast(serverOnline ? "З'єднання відновлено" : "Мережа є, сервер недоступний");
    });
});

window.addEventListener("offline", () => {
  renderNetworkState();
  showToast("Офлайн режим: меню доступне з кешу");
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  renderInstallButton();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

async function bootstrapApp() {
  renderAll(false);
  try {
    await Promise.all([reloadCatalog(), loadPromotions()]);
    state = normalizeState({ ...state, menuItems, productDetails, promos });
    saveState();
    if (isClientLoggedIn()) {
      try {
        await syncClientData();
      } catch {
        logoutClient(false);
        showToast("Сесію клієнта завершено. Увійдіть знову");
      }
    }
    renderAll(false);
    if ((state.role === "worker" || state.role === "admin") && !authToken) {
      state.role = "customer";
      saveState();
      showToast("Увійдіть знову для доступу до сервера");
    } else if (authToken && (state.role === "worker" || state.role === "admin")) {
      await refreshStaffOrders();
      connectWorkerSocket();
    }
    if (state.activeOrder) {
      await refreshActiveOrderStatus();
    }
  } catch {
    serverOnline = false;
    showToast("Сервер недоступний: локальний режим");
  }
  setScreen(state.screen);
}

bootstrapApp().catch(() => {
  setScreen(state.screen);
});
setInterval(() => {
  renderActiveOrder();
  if (serverOnline && state.activeOrder) {
    refreshActiveOrderStatus().catch(() => {});
  }
}, 60000);
