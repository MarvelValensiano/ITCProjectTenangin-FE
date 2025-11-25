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

/** generic fetch wrapper */
async function rawFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const fetchOpts = {
    method: options.method || "GET",
    headers: { ...(options.headers || {}) },
    credentials: options.credentials || "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  // set JSON header if body and not provided
  if (fetchOpts.body && !fetchOpts.headers["Content-Type"]) {
    fetchOpts.headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, fetchOpts);
  const data = await parseJsonSafe(res);

  // ===== SESSION / TOKEN EXPIRED HANDLER =====
  // Hanya perlakukan sebagai "session expired" kalau:
  // - sudah ada accessToken tersimpan, DAN
  // - status 401/403 ATAU pesan error mengandung kata "expired" / "jwt"
  const storedToken = getAccessToken();
  const rawMessage =
    (data && (data.message || data.error || data.detail || data.raw)) || "";
  const msg = String(rawMessage).toLowerCase();

  const looksExpired =
    msg.includes("expired") ||
    msg.includes("jwt expired") ||
    msg.includes("token kadaluarsa");

  if (storedToken && (res.status === 401 || res.status === 403 || looksExpired)) {
    console.warn("[AUTH] Session expired detected, clearing storage and redirecting to login");

    // bersihkan storage
    clearAuthStorage();

    // redirect ke halaman login dengan informasi session habis
    try {
      if (typeof window !== "undefined") {
        // hindari loop tak berujung jika sudah di /login?expired=1
        const currentPath = window.location.pathname.toLowerCase();
        const currentSearch = window.location.search || "";
        if (
          currentPath !== "/login" ||
          !currentSearch.toLowerCase().includes("expired=1")
        ) {
          window.location.href = "/login?expired=1";
        }
      }
    } catch (e) {
      console.error("[AUTH] Redirect after session expired failed:", e);
    }

    const err = new Error("Session expired");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  // ===== ERROR UMUM =====
  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/** AUTH helpers (adapt URLs if berbeda) */

/**
 * Register
 * backend sample expects: { nama, email, password, confirm }
 * NOTE: field 'nama' used per backend sample — if your backend expects 'name', change payload key.
 */
export async function register({ nama, email, password, confirm }) {
  const data = await rawFetch("/api/auth/register", {
    method: "POST",
    body: { nama, email, password, confirm },
    credentials: "include",
  });
  // if backend returns token/user on register, store it (if not, skip)
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
 * If your backend uses a different path, change it here.
 * This uses Authorization header Bearer token (from localStorage) AND credentials include (as backend used).
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
  // optionally update stored user
  if (data?.user || data?.id) {
    // unify common shapes: if backend returns data.user or top-level fields
    const userObj =
      data.user || { id: data.id, username: data.username, email: data.email, ...data };
    setUser(userObj);
  }
  return data;
}

/**
 * Refresh access token
 * Backend sample used body { id_user } — we follow that.
 * Adjust path if backend uses a different refresh endpoint.
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
      await rawFetch("/api/auth/logout", {
        method: "POST",
        body: { id_user: stored.id },
        credentials: "include",
      });
    }
  } catch (err) {
    // ignore server errors for logout, still clear storage
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
