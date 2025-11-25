// src/services/videos.js
import { getAccessToken, clearAuthStorage } from "./auth";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://projek-itc-tenangin.vercel.app").replace(/\/$/, "");

/**
 * Helper: deteksi unauthorized / token expired.
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

/**
 * Ambil video rekomendasi berdasarkan latest mood user.
 */
export async function fetchUserVideos() {
  const token = getAccessToken();

  // Tidak ada token sama sekali => user belum login / sudah logout.
  if (!token) {
    clearAuthStorage();
    if (typeof window !== "undefined") {
      const pathNow = window.location.pathname.toLowerCase();
      if (!pathNow.startsWith("/login")) {
        window.location.href = "/login"; // TANPA expired
      }
    }
    throw new Error("Not authenticated");
  }

  const url = `${API_BASE}/api/data/user_video`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  const text = await res.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  // cek auth / expired
  handleSessionExpired(res, payload);

  if (!res.ok) {
    const msg =
      (payload && payload.message) ||
      (payload && payload.raw) ||
      `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = payload;
    throw err;
  }

  return payload; // expect { data: [...] }
}
