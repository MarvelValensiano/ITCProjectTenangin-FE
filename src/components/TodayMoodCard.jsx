// src/components/TodayMoodCard.jsx
import React from "react";

export default function TodayMoodCard({ mood = { label: "Neutral", emoji: "😐" }, dateText = "", checkedToday = false }) {
  return (
    <aside className="today-card card">
      <h3>Today's Mood Check</h3>

      {checkedToday ? (
        <>
          <div className="today-emoji" style={{ fontSize: 48 }}>{mood.emoji}</div>
          <h4 style={{ marginTop: 10 }}>{mood.label}</h4>
          {dateText && <p className="muted">{dateText}</p>}
        </>
      ) : (
        <>
          <div style={{ textAlign: "center", padding: "18px 12px" }}>
            <p style={{ margin: 0, fontSize: 18 }}>You haven't checked your mood today.</p>
            <button className="btn-primary small" onClick={() => (window.location.href = "/CheckMood")} style={{ marginTop: 12 }}>
              Check Mood Now
            </button>
            <p className="muted" style={{ marginTop: 12 }}>Regular mood checks help track your wellbeing.</p>
          </div>
        </>
      )}
    </aside>
  );
}
