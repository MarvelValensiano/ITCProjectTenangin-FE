// src/services/profile.js
import { getAccessToken, getStoredUser, setUser } from "./auth";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://projek-itc-tenangin.vercel.app"
).replace(/\/$/, "");

/**
 * Get full user profile from backend:
 * POST /api/data/user-data
 */
export async function fetchUserProfile() {
  const token = getAccessToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const url = `${API_BASE}/api/data/user-data`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}), // backend uses empty POST
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

  const data = payload;

  // normalize "Belum diatur" from backend + description/deskripsi
  const todayISO = new Date().toISOString().split("T")[0];
  const rawJoined = data.joined_date;

  const isJoinedEmpty =
    !rawJoined ||
    rawJoined === "Belum diatur" ||
    rawJoined === "null" ||
    rawJoined === "undefined" ||
    (typeof rawJoined === "string" && rawJoined.trim() === "");

  const descValue = data.description || data.deskripsi || "";

  const normalized = {
    ...data,
    umur: data.umur === "Belum diatur" ? "" : data.umur,
    jenis_kelamin:
      data.jenis_kelamin === "Belum diatur" ? "" : data.jenis_kelamin,
    lokasi: data.lokasi === "Belum diatur" ? "" : data.lokasi,
    joined_date: isJoinedEmpty ? todayISO : rawJoined,
    // keep both keys for convenience on FE
    description: descValue,
    deskripsi: descValue,
  };

  const current = getStoredUser() || {};
  const mergedUser = {
    ...current,
    ...normalized,
    nama: normalized.fullname || normalized.nama || current.nama,
  };

  setUser(mergedUser);

  return mergedUser;
}

/**
 * Update user profile.
 * data = { username, email, fullname, umur, jenis_kelamin, lokasi, password, description/deskripsi }
 * file = File object (optional, can be null)
 */
export async function updateProfile(data = {}, file = null) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const url = `${API_BASE}/api/profile/aksiProfile`;

  let headers = {
    Authorization: `Bearer ${token}`,
  };
  let body;

  if (file) {
    // multipart/form-data
    const formData = new FormData();

    // avatar file
    formData.append("file", file);

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "description") {
          // also send to backend as "deskripsi"
          formData.append("deskripsi", value);
        }
        formData.append(key, value);
      }
    });

    body = formData;
    // DO NOT set Content-Type manually
  } else {
    // JSON body
    const payload = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "description") {
          payload["deskripsi"] = value;
        }
        payload[key] = value;
      }
    });

    headers["Content-Type"] = "application/json";
    body = JSON.stringify(payload);
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
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

  // payload.data = latest profile from backend
  const updated = payload.data || {};

  const descValue = updated.description || updated.deskripsi || "";

  const updatedWithDesc = {
    ...updated,
    description: descValue,
    deskripsi: descValue,
  };

  const current = getStoredUser() || {};
  const mergedUser = {
    ...current,
    ...updatedWithDesc,
    nama: updatedWithDesc.fullname || updatedWithDesc.nama || current.nama,
  };

  setUser(mergedUser);

  return { message: payload.message, user: mergedUser };
}
