import { startServer, stopServer } from "../index.js";

let server: any;
let baseUrl = "";
let apiKey = "local_dev_api_key";
let passengerToken = "";
let adminToken = "";
let operatorToken = "";
let routeInstanceId = "";
let reservationId = "";

const req = async (
  method: string,
  path: string,
  options: { headers?: Record<string, string>; body?: any } = {}
) => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers || {}),
  };
  const body = options.body ? JSON.stringify(options.body) : undefined;
  const res = await fetch(baseUrl + path, { method, headers, body });
  const json = await res.json();
  return { status: res.status, json };
};

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.USE_IN_MEMORY_DB = "true";
  process.env.PORT = "0";
  process.env.API_KEY = apiKey;
  process.env.JWT_SECRET = "local_dev_secret";
  process.env.JWT_EXPIRES_IN = "7d";
  server = await startServer();
  const addr: any = server.address();
  baseUrl = `http://localhost:${addr.port}/api/v1`;
  const pLogin = await req("POST", "/auth/login", {
    headers: { "Content-Type": "application/json" },
    body: { email: "test.user2@example.com", password: "Password123" },
  });
  passengerToken = pLogin.json?.data?.token || "";
  const aLogin = await req("POST", "/auth/login", {
    headers: { "Content-Type": "application/json" },
    body: { email: "admin.local@example.com", password: "AdminPass123" },
  });
  adminToken = aLogin.json?.data?.token || "";
  const oLogin = await req("POST", "/auth/login", {
    headers: { "Content-Type": "application/json" },
    body: { email: "operador.local@example.com", password: "Operador456" },
  });
  operatorToken = oLogin.json?.data?.token || "";
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd = String(tomorrow.getDate()).padStart(2, "0");
  const date = `${yyyy}-${mm}-${dd}`;
  const routes = await req("GET", `/routes?date=${date}`, {
    headers: { "X-API-Key": apiKey },
  });
  routeInstanceId = routes.json?.data?.[0]?._id || "";
});

afterAll(async () => {
  await stopServer();
});

test("login devuelve token", async () => {
  const { status, json } = await req("POST", "/auth/login", {
    headers: { "Content-Type": "application/json" },
    body: { email: "test.user2@example.com", password: "Password123" },
  });
  expect(status).toBe(200);
  expect(json.success).toBe(true);
  expect(json.data.token).toBeTruthy();
});

test("perfil requiere api key y bearer", async () => {
  const { status, json } = await req("GET", "/auth/profile", {
    headers: { Authorization: `Bearer ${passengerToken}`, "X-API-Key": apiKey },
  });
  expect(status).toBe(200);
  expect(json.success).toBe(true);
});

test("listar rutas por fecha", async () => {
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd = String(tomorrow.getDate()).padStart(2, "0");
  const date = `${yyyy}-${mm}-${dd}`;
  const { status, json } = await req("GET", `/routes?date=${date}`, {
    headers: { "X-API-Key": apiKey },
  });
  expect(status).toBe(200);
  expect(json.success).toBe(true);
  expect(Array.isArray(json.data)).toBe(true);
  expect(json.data.length).toBeGreaterThan(0);
});

test("crear reserva manual y verla", async () => {
  const rid = routeInstanceId;
  const created = await req("POST", "/reservations", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${passengerToken}`,
      "X-API-Key": apiKey,
    },
    body: { routeInstanceId: rid, paymentMethod: "manual" },
  });
  expect(created.status).toBe(201);
  expect(created.json.success).toBe(true);
  reservationId = created.json.data._id;
  const got = await req("GET", `/reservations/${reservationId}`, {
    headers: { Authorization: `Bearer ${passengerToken}`, "X-API-Key": apiKey },
  });
  expect(got.status).toBe(200);
  expect(got.json.success).toBe(true);
});

test("crear pago manual y aprobar como admin", async () => {
  const my = await req("GET", "/reservations/my-reservations", {
    headers: { Authorization: `Bearer ${passengerToken}`, "X-API-Key": apiKey },
  });
  const resId = reservationId || my.json.data[0]._id;
  const payment = await req("POST", "/payments/create", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${passengerToken}`,
      "X-API-Key": apiKey,
    },
    body: { reservationId: resId, paymentMethod: "manual", notes: "test" },
  });
  expect(payment.status).toBe(201);
  expect(payment.json.success).toBe(true);
  const list = await req("GET", `/payments/reservation/${resId}`, {
    headers: { Authorization: `Bearer ${adminToken}`, "X-API-Key": apiKey },
  });
  const paymentId = list.json.data[0]._id;
  const upd = await req("PATCH", `/payments/${paymentId}/status`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
      "X-API-Key": apiKey,
    },
    body: { status: "approved" },
  });
  expect(upd.status).toBe(200);
  expect(upd.json.success).toBe(true);
});

test("endpoints admin y config", async () => {
  const summary = await req("GET", "/admin/summary", {
    headers: { Authorization: `Bearer ${adminToken}`, "X-API-Key": apiKey },
  });
  expect(summary.status).toBe(200);
  expect(summary.json.success).toBe(true);
  const pub = await req("GET", "/config/public", {
    headers: { "X-API-Key": apiKey },
  });
  expect(pub.status).toBe(200);
  const full = await req("GET", "/config", {
    headers: { Authorization: `Bearer ${adminToken}`, "X-API-Key": apiKey },
  });
  expect(full.status).toBe(200);
  expect(full.json.success).toBe(true);
});

test("cancelar reserva del usuario", async () => {
  const my = await req("GET", "/reservations/my-reservations", {
    headers: { Authorization: `Bearer ${passengerToken}`, "X-API-Key": apiKey },
  });
  const resId = reservationId || my.json.data[0]._id;
  const can = await req("PATCH", `/reservations/${resId}/cancel`, {
    headers: { Authorization: `Bearer ${passengerToken}`, "X-API-Key": apiKey },
  });
  expect(can.status).toBe(200);
  expect(can.json.success).toBe(true);
});
