// src/services/tenanginData.js
import { getAccessToken, clearAuthStorage } from "./auth";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://projek-itc-tenangin.vercel.app"
).replace(/\/$/, "");

/**
 * Helper: deteksi token expired / unauthorized untuk endpoint yang pakai Authorization.
 */
function handleSessionExpired(res, payload) {
  const status = res.status;
  const rawMessage =
    (payload &&
      (payload.message || payload.error || payload.detail || payload.raw)) ||
    "";
  const msg = String(rawMessage).toLowerCase();

  const looksAuthError =
    status === 401 ||
    status === 403 ||
    msg.includes("expired") ||
    msg.includes("jwt") ||
    msg.includes("token kadaluarsa");

  if (!looksAuthError) return;

  const hasToken = !!getAccessToken();
  clearAuthStorage();

  if (typeof window !== "undefined") {
    const loc = window.location;
    const pathNow = loc.pathname.toLowerCase();
    const searchNow = loc.search.toLowerCase();

    const target = hasToken ? "/login?expired=1" : "/login";

    // jangan spam redirect kalau sudah di halaman login yang sama
    if (
      !(
        pathNow === "/login" &&
        (hasToken ? searchNow.includes("expired=1") : true)
      )
    ) {
      window.location.href = target;
    }
  }

  const err = new Error(hasToken ? "Session expired" : "Not authenticated");
  err.status = status;
  err.data = payload;
  throw err;
}

/** ==== SEND PUBLIC MESSAGE (About Page) ==== */
export async function sendPublicMessage({ nama, email, pesan }) {
  const url = `${API_BASE}/pesan-publik`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, email, pesan }),
  });

  const text = await res.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!res.ok) {
    const msg = payload?.message || payload?.raw || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = payload;
    throw err;
  }

  return payload;
}

/** ==== SAVE USER MOOD ==== */
export async function saveUserMood({ mood, note }) {
  const url = `${API_BASE}/api/data/user_mood`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ mood, note }),
  });

  const text = await res.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  // cek expired / belum login
  handleSessionExpired(res, payload);

  if (!res.ok) {
    const msg = payload?.message || payload?.raw || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = payload;
    throw err;
  }

  return payload;
}

/** ==== FETCH USER QUOTE ==== */
export async function fetchUserQuote() {
  const url = `${API_BASE}/api/data/user_quote`;

  const headers = { "Content-Type": "application/json" };
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });

  const text = await res.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  // cek expired / belum login
  handleSessionExpired(res, payload);

  if (!res.ok) {
    const msg = payload?.message || payload?.raw || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = payload;
    throw err;
  }

  return payload.data;
}
