// src/services/videos.js
import { getAccessToken, clearAuthStorage } from "./auth";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://projek-itc-tenangin.vercel.app").replace(/\/$/, "");

/**
 * Helper: deteksi token expired dan redirect ke login.
 */
function handleSessionExpired(res, payload) {
  const status = res.status;
  const rawMessage =
    (payload && (payload.message || payload.error || payload.detail || payload.raw)) ||
    "";
  const msg = String(rawMessage).toLowerCase();

  const looksExpired =
    status === 401 ||
    status === 403 ||
    msg.includes("expired") ||
    msg.includes("jwt") ||
    msg.includes("token kadaluarsa");

  if (!looksExpired) return;

  console.warn("[videos] Session expired detected");

  clearAuthStorage();
  if (typeof window !== "undefined") {
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (!(path === "/login" && search.includes("expired=1"))) {
      window.location.href = "/login?expired=1";
    }
  }

  const err = new Error("Session expired");
  err.status = status;
  err.data = payload;
  throw err;
}

/**
 * Ambil video rekomendasi berdasarkan latest mood user.
 * Mengirim Authorization Bearer <token>.
 * Mengembalikan object { data: [...] } atau throw error.
 */
export async function fetchUserVideos() {
  const token = getAccessToken();

  // kalau tidak ada token sama sekali, anggap session sudah berakhir
  if (!token) {
    clearAuthStorage();
    if (typeof window !== "undefined") {
      window.location.href = "/login?expired=1";
    }
    throw new Error("Session expired");
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

  // 🔥 cek token expired lebih dulu
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
