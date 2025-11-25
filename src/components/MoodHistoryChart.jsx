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

const SCORE_EMOJI = {
  0: "😡",
  1: "😟",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

const SCORE_LABEL = {
  0: "Very low",
  1: "Low",
  2: "Quite low",
  3: "Neutral",
  4: "Good",
  5: "Very good",
};

function parseDateLabel(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Custom tooltip supaya informasi lebih jelas
function MoodTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload; // { date, mood, value }

  const score = point.value;
  const emoji = SCORE_EMOJI[score] || "";
  const label = SCORE_LABEL[score] || "";
  const dateLabel = parseDateLabel(point.date);

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-date">{dateLabel}</div>
      {point.mood && (
        <div className="chart-tooltip-mood">
          <span className="chart-tooltip-emoji" aria-hidden="true">
            {emoji}
          </span>
          <span className="chart-tooltip-text">
            {point.mood} ({label || "Mood"})
          </span>
        </div>
      )}
    </div>
  );
}

export default function MoodHistoryChart({ data = [] }) {
  // data dari Home sudah shape: [{ date, mood, value }]
  const normalized = Array.isArray(data)
    ? data
        .filter((d) => d && d.date)
        .map((d) => ({
          ...d,
        }))
    : [];

  const hasAny = normalized.some((d) => d.value != null);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Your Mood History</h3>
        <p className="chart-subtitle">Last 7 days</p>
      </div>

      {!hasAny ? (
        <p className="chart-empty">
          You don&apos;t have any mood data for this week yet.
        </p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={normalized}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={parseDateLabel}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                tickFormatter={(v) => SCORE_EMOJI[v] || ""}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<MoodTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#7FDBCA"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="chart-legend">
        <span className="chart-legend-title">Scale:</span>
        <span className="chart-legend-item">
          😡 / 😟 = low • 😕 / 😐 = medium • 🙂 / 😄 = high
        </span>
      </div>
    </div>
  );
}
