// src/services/videos.js
import { getAccessToken } from "./auth";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://projek-itc-tenangin.vercel.app").replace(/\/$/, "");

/**
 * Ambil video rekomendasi berdasarkan latest mood user.
 * Mengirim Authorization Bearer <token>.
 * Mengembalikan object { data: [...] } atau me-throw error.
 */
export async function fetchUserVideos() {
  const token = getAccessToken();
  if (!token) throw new Error("No access token");

  const url = `${API_BASE}/api/data/user_video`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({}), // backend nampaknya menerima POST kosong
  });

  // parse
  const text = await res.text();
  let payload = null;
  try { payload = text ? JSON.parse(text) : {}; } catch { payload = { raw: text }; }

  if (!res.ok) {
    const msg = (payload && payload.message) || (payload && payload.raw) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = payload;
    throw err;
  }

  return payload; // expect { data: [ ... ] }
}
