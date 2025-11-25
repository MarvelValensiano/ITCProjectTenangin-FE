// src/services/auth.js
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://projek-itc-tenangin.vercel.app").replace(/\/$/, "");

/** Storage helpers */
export function setAccessToken(token) {
  if (!token) return;
  localStorage.setItem("accessToken", token);
}
export function getAccessToken() {
  return localStorage.getItem("accessToken") || null;
}
export function setUser(userObj) {
  if (!userObj) return;
  localStorage.setItem("user", JSON.stringify(userObj));
}
export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}
export function clearAuthStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
}

/** small JSON parse helper */
async function parseJsonSafe(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

/**
 * Generic fetch wrapper untuk semua endpoint auth.
 * Di sini kita bedakan:
 * - ada token + message mengandung "expired" => SESSION EXPIRED → redirect /login?expired=1
 * - tidak ada token => cuma "belum login", JANGAN pakai expired banner
 */
async function rawFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const fetchOpts = {
    method: options.method || "GET",
    headers: { ...(options.headers || {}) },
    credentials: options.credentials || "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  };
  if (fetchOpts.body && !fetchOpts.headers["Content-Type"]) {
    fetchOpts.headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, fetchOpts);
  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const status = res.status;
    const msgRaw = data?.message || data?.error || data?.raw || "";
    const msg = String(msgRaw).toLowerCase();
    const hasToken = !!getAccessToken();

    const looksExpired =
      status === 401 ||
      status === 403 ||
      msg.includes("expired") ||
      msg.includes("jwt") ||
      msg.includes("token kadaluarsa");

    // Hanya kalau MASIH ADA token & kelihatan expired -> paksa expired flow
    if (hasToken && looksExpired) {
      console.warn("[auth] session expired detected from", path);
      clearAuthStorage();

      if (typeof window !== "undefined") {
        const loc = window.location;
        const pathNow = loc.pathname.toLowerCase();
        const searchNow = loc.search.toLowerCase();
        if (!(pathNow === "/login" && searchNow.includes("expired=1"))) {
          window.location.href = "/login?expired=1";
        }
      }

      const err = new Error("Session expired");
      err.status = status;
      err.data = data;
      throw err;
    }

    // selain itu: unauthorized biasa (belum login / token sudah dibersihkan)
    const err = new Error(data?.message || `HTTP ${status}`);
    err.status = status;
    err.data = data;
    throw err;
  }

  return data;
}

/** AUTH helpers */

/**
 * Register
 * backend sample expects: { nama, email, password, confirm }
 */
export async function register({ nama, email, password, confirm }) {
  const data = await rawFetch("/api/auth/register", {
    method: "POST",
    body: { nama, email, password, confirm },
    credentials: "include",
  });
  if (data?.accessToken) setAccessToken(data.accessToken);
  if (data?.user) setUser(data.user);
  return data;
}

/**
 * Login
 * expects body { email, password }
 * backend returns { accessToken, user }
 */
export async function login({ email, password }) {
  const data = await rawFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
    credentials: "include",
  });
  if (data?.accessToken) setAccessToken(data.accessToken);
  if (data?.user) setUser(data.user);
  return data;
}

/**
 * Get user data (assume /api/auth/me).
 */
export async function getUserData() {
  const token = getAccessToken();
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const data = await rawFetch("/api/auth/me", {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (data?.user || data?.id) {
    const userObj =
      data.user ||
      ({ id: data.id, username: data.username, email: data.email, ...data });
    setUser(userObj);
  }
  return data;
}

/**
 * Refresh access token
 */
export async function refreshAccessToken() {
  const stored = getStoredUser();
  if (!stored?.id) throw new Error("No stored user to refresh token for.");
  const data = await rawFetch("/api/auth/refresh", {
    method: "POST",
    body: { id_user: stored.id },
    credentials: "include",
  });
  if (data?.accessToken) setAccessToken(data.accessToken);
  return data;
}

/**
 * Logout
 */
export async function logout() {
  const stored = getStoredUser();
  try {
    if (stored?.id) {
      // kalau ini 401 karena token sudah mati, biarin; kita tetap clear storage di bawah
      await rawFetch("/api/auth/logout", {
        method: "POST",
        body: { id_user: stored.id },
        credentials: "include",
      });
    }
  } catch (err) {
    console.warn("Logout request failed:", err);
  }
  clearAuthStorage();
  return true;
}

export default {
  register,
  login,
  getUserData,
  refreshAccessToken,
  logout,
  setAccessToken,
  getAccessToken,
  setUser,
  getStoredUser,
  clearAuthStorage,
};
