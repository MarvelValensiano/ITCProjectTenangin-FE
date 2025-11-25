// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeHeader from "../components/HomeHeader";
import MoodHistoryChart from "../components/MoodHistoryChart";
import TodayMoodCard from "../components/TodayMoodCard";
import { getStoredUser, getAccessToken } from "../services/auth";
import { SiteInfoA } from "../components/SiteInfo";
import "../styles/home.css";

const MOOD_MAP = {
  Happy: "😄",
  Calm: "😌",
  Neutral: "😐",
  Sad: "😔",
  Angry: "😠",
  Stressed: "😩",
  Excited: "😍",
};

const MOOD_SCALE = {
  Happy: 5,
  Excited: 5,
  Calm: 4,
  Neutral: 3,
  Sad: 2,
  Stressed: 1,
  Angry: 0,
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [moods, setMoods] = useState([]); // [{ date, mood, value }]
  const [today, setToday] = useState({
    mood: { label: "Neutral", emoji: MOOD_MAP["Neutral"] },
    dateText: "",
  });
  const [hasCheckedToday, setHasCheckedToday] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDashboard() {
    const token = getAccessToken();
    if (!token) {
      setFallbackSeries();
      return;
    }

    const API_BASE = (
      import.meta.env.VITE_API_BASE_URL ||
      "https://projek-itc-tenangin.vercel.app"
    ).replace(/\/$/, "");
    const url = `${API_BASE}/api/data/data_dashboard`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        // === DETEKSI TOKEN EXPIRED ===
        if (res.status === 401 || res.status === 403) {
          console.warn("Session expired from Home.jsx");
          window.location.href = "/login?expired=1";
          return;
        }
    
        const msg = json?.message || `HTTP ${res.status}`;
        throw new Error(msg);
    }    

      const data = json?.data || json;
      handleDashboardData(data);
    } catch (err) {
      console.error("[Home] loadDashboard error:", err);
      setFallbackSeries();
    }
  }

  function handleDashboardData(data) {
    // ========= 1. PROFILE =========
    if (data.username || data.email || data.foto_profile_url || data.fullname || data.nama) {
      setUser((prev) => ({
        ...prev,
        username: data.username || prev?.username,
        nama: data.fullname || data.nama || prev?.nama,
        email: data.email || prev?.email,
      }));
      if (data.foto_profile_url) setAvatarUrl(data.foto_profile_url);
    }

    // ========= 2. MOODS =========
    const moodRecords = Array.isArray(data.moods) ? data.moods : [];

    // id → created_at ISO (UTC) untuk dipakai Today card
    const isoById = {};
    // per tanggal (lokal) → mood terbaru di hari itu
    const perDayNewest = {}; // { "YYYY-MM-DD": { label, ts } }

    for (const r of moodRecords) {
      const created = r.created_at || r.date || r.timestamp;
      if (!created) continue;

      const d = new Date(created);
      if (Number.isNaN(d.getTime())) continue;

      const dayKey = getISODate(d); // tanggal lokal
      const label = normalizeMoodLabel(
        r.mood || r.label || r.value_label || r.name
      );
      const ts = d.getTime();

      if (r.id) {
        isoById[r.id] = created; // simpan ISO per id
      }

      if (!perDayNewest[dayKey] || ts > perDayNewest[dayKey].ts) {
        perDayNewest[dayKey] = { label, ts };
      }
    }

    const DAYS = 7;
    const todayISO = getISODate(new Date());
    const series = [];
    let checkedToday = false;

    for (let i = DAYS - 1; i >= 0; i--) {
      const day = addDaysISO(todayISO, -i);
      const entry = perDayNewest[day];

      if (entry) {
        const value = MOOD_SCALE[entry.label] ?? MOOD_SCALE["Neutral"];
        series.push({ date: day, mood: entry.label, value });
        if (day === todayISO) checkedToday = true;
      } else {
        series.push({ date: day, mood: null, value: null });
      }
    }

    setMoods(series);
    setHasCheckedToday(checkedToday);

    // ========= 3. TODAY'S CARD =========
    if (data.latest_mood) {
      const lab = normalizeMoodLabel(
        data.latest_mood.mood || data.latest_mood.label || "Neutral"
      );

      const latestId = data.latest_mood.id;
      // PRIORITAS: pakai ISO dari moods[id] → sehingga timezone jelas (UTC → lokal)
      let when =
        (latestId && isoById[latestId]) ||
        data.latest_mood.created_at ||
        data.latest_mood.date ||
        (checkedToday
          ? series.find((s) => s.date === todayISO && s.mood)?.date
          : "");

      setToday({
        mood: { label: lab, emoji: MOOD_MAP[lab] || "🙂" },
        dateText: when ? formatDateHuman(when) : "",
      });
    } else if (checkedToday) {
      const t = series.find((s) => s.date === todayISO && s.mood);
      if (t) {
        setToday({
          mood: { label: t.mood, emoji: MOOD_MAP[t.mood] || "🙂" },
          dateText: `Checked on ${todayISO}`,
        });
      } else {
        setToday({
          mood: { label: "Neutral", emoji: MOOD_MAP["Neutral"] },
          dateText: "",
        });
      }
    } else {
      setToday({
        mood: { label: "Neutral", emoji: MOOD_MAP["Neutral"] },
        dateText: "",
      });
    }
  }

  function setFallbackSeries() {
    const todayISO = getISODate(new Date());
    const DAYS = 7;
    const mock = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      mock.push({ date: addDaysISO(todayISO, -i), mood: null, value: null });
    }
    setMoods(mock);
    setHasCheckedToday(false);
    setToday({
      mood: { label: "Neutral", emoji: MOOD_MAP["Neutral"] },
      dateText: "",
    });
  }

  const handleCheckMood = () => {
    window.location.href = "/CheckMood";
  };

  return (
    <div className="home-page">
      <Navbar avatarUrl={avatarUrl} />
      <main className="home-container">
        <HomeHeader
          userName={user?.nama || user?.username || user?.name || "User"}
          onCheckMood={handleCheckMood}
        />
        <div className="home-grid">
          <MoodHistoryChart data={moods} />
          <TodayMoodCard
            mood={today.mood}
            dateText={today.dateText}
            checkedToday={hasCheckedToday}
          />
        </div>
      </main>
      <SiteInfoA />
      <Footer />
    </div>
  );
}

/* ================= helpers ================= */

function normalizeMoodLabel(raw) {
  if (!raw) return "Neutral";
  const r = String(raw).trim();
  const key = r.charAt(0).toUpperCase() + r.slice(1).toLowerCase();
  if (key === "Joyful") return "Happy";
  if (key === "Relaxed") return "Calm";
  return key;
}

// LOCAL date (nggak pakai UTC offset)
function getISODate(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysISO(dateISO, delta = 0) {
  const d = new Date(dateISO);
  d.setDate(d.getDate() + delta);
  return getISODate(d);
}

// Konversi ke waktu lokal browser (GMT+7 di laptop kamu)
// value boleh ISO "2025-11-24T17:41:46.151131+00:00"
function formatDateHuman(value) {
  if (!value) return "";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    // kalau stringnya aneh & nggak bisa diparse, tampilkan apa adanya
    return String(value);
  }

  return d.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


