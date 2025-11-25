// src/components/MoodHistoryChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
 * Expect data in shape:
 * [{ date: '2025-11-12', mood: 'Happy' }, ...]
 * Or fallback to items with created_at property.
 */

const MOOD_SCORE = {
  Happy: 5,
  Excited: 5,
  Calm: 4,
  Neutral: 3,
  Sad: 2,
  Angry: 1,
  Stressed: 1,
};

function parseDateLabel(dateStr) {
  try {
    const d = new Date(dateStr);
    // short label: Nov 12 or 12 Nov depending preference:
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function MoodHistoryChart({ data = [] }) {
  // normalize to daily points (if backend returns many records per day, we take last/mode/avg)
  // group by date
  const grouped = {};
  for (const item of data) {
    const rawDate = item.date || item.created_at || item.day || item.timestamp;
    if (!rawDate) continue;
    const dKey = rawDate.split("T")[0]; // get YYYY-MM-DD
    // keep last entry for the day (or you could average)
    grouped[dKey] = item;
  }
  // convert to sorted array by date
  const arr = Object.keys(grouped)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((d) => {
      const moodLabel =
        grouped[d].mood ||
        grouped[d].label ||
        grouped[d].value_label ||
        "Neutral";
      const score = MOOD_SCORE[moodLabel] ?? MOOD_SCORE["Neutral"];
      return {
        date: d,
        label: parseDateLabel(d),
        value: score,
        mood: moodLabel,
      };
    });

  // If no data, keep empty arr (parent should provide fallback)
  return (
    <div className="chart-card">
      <h3 className="chart-title">Your Mood History</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data.map((d) => ({ date: d.date, value: d.value }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7FDBCA"
              dot={{ r: 4 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
