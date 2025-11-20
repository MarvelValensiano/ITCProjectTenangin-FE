// src/pages/Home.jsx
// ... (keep imports unchanged)
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

// numeric scale used by chart: higher = better (you can adjust)
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
  // moods: array of { date: 'YYYY-MM-DD', mood: 'Happy', value: 5 }
  const [moods, setMoods] = useState([]);
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

  const loadDashboard = async () => {
    const token = getAccessToken();
    if (!token) {
      setFallbackSeries();
      return;
    }

    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://projek-itc-tenangin.vercel.app").replace(/\/$/, "");
    const url = `${API_BASE}/api/data/data_dashboard`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      handleDashboardData(data);
    } catch (err) {
      console.error("[Home] loadDashboard error:", err);
      setFallbackSeries();
    }
  };

  const handleDashboardData = (data) => {
    // set profile
    if (data.username || data.email || data.foto_profile_url) {
      setUser((prev) => ({ ...prev, username: data.username || prev?.username, email: data.email || prev?.email }));
      if (data.foto_profile_url) setAvatarUrl(data.foto_profile_url);
    }

    // convert backend moods (if exist) to map by date
    const moodRecords = Array.isArray(data.moods) ? data.moods : [];
    const mapByDate = {};
    for (const r of moodRecords) {
      const raw = r.date || r.created_at || r.timestamp || null;
      if (!raw) continue;
      const day = raw.indexOf && raw.indexOf("T") > -1 ? raw.split("T")[0] : raw;
      // normalize label if backend uses different field
      const label = r.mood || r.label || r.value_label || r.name || "Neutral";
      mapByDate[day] = label;
    }

    // Build series for last N days (7 or 14)
    const DAYS = 7;
    const todayISO = getISODate(new Date());
    const series = [];
    let checkedToday = false;
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = addDaysISO(todayISO, -i);
      const label = mapByDate[d] || null;
      if (label) {
        const normalizedLabel = normalizeMoodLabel(label);
        const value = MOOD_SCALE[normalizedLabel] ?? MOOD_SCALE["Neutral"];
        series.push({ date: d, mood: normalizedLabel, value });
        if (d === todayISO) checkedToday = true;
      } else {
        // no record on this day
        series.push({ date: d, mood: null, value: null });
      }
    }

    setMoods(series);
    setHasCheckedToday(checkedToday);

    // set today card
    if (data.latest_mood) {
      const lab = normalizeMoodLabel(data.latest_mood.mood || data.latest_mood.label || "Neutral");
      setToday({ mood: { label: lab, emoji: MOOD_MAP[lab] || "🙂" }, dateText: formatDateHuman(data.latest_mood.created_at || data.latest_mood.date) });
    } else if (checkedToday) {
      // if mapByDate had today's label set above, use it
      const todayRec = series.find((s) => s.date === todayISO && s.mood);
      if (todayRec) {
        setToday({ mood: { label: todayRec.mood, emoji: MOOD_MAP[todayRec.mood] || "🙂" }, dateText: `Checked on ${todayISO}` });
      }
    } else {
      // not checked today
      setToday({ mood: { label: "Neutral", emoji: MOOD_MAP["Neutral"] }, dateText: "" });
    }
  };

  const setFallbackSeries = () => {
    const todayISO = getISODate(new Date());
    const DAYS = 7;
    const mock = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = addDaysISO(todayISO, -i);
      mock.push({ date: d, mood: null, value: null });
    }
    setMoods(mock);
    setHasCheckedToday(false);
    setToday({ mood: { label: "Neutral", emoji: MOOD_MAP["Neutral"] }, dateText: "" });
  };

  const handleCheckMood = () => (window.location.href = "/CheckMood");

  return (
    <div className="home-page">
      <Navbar avatarUrl={avatarUrl} />
      <main className="home-container">
        <HomeHeader userName={user?.nama || user?.username || user?.name || "User"} onCheckMood={handleCheckMood} />
        <div className="home-grid">
          <MoodHistoryChart data={moods} />
          <TodayMoodCard mood={today.mood} dateText={today.dateText} checkedToday={hasCheckedToday} />
        </div>
      </main>
      <SiteInfoA />
      <Footer />
    </div>
  );
}

/* helpers (same as before) */
function normalizeMoodLabel(raw) {
  if (!raw) return "Neutral";
  const r = String(raw).trim();
  const key = r.charAt(0).toUpperCase() + r.slice(1).toLowerCase();
  if (key === "Joyful") return "Happy";
  if (key === "Relaxed") return "Calm";
  return key;
}

function getISODate(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split("T")[0];
}

function addDaysISO(dateISO, delta = 0) {
  const d = new Date(dateISO);
  d.setDate(d.getDate() + delta);
  return getISODate(d);
}

function formatDateHuman(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}
