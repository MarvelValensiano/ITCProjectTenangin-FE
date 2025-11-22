// src/components/VideoCard.jsx
import React from "react";

/** helper: ambil youtube id dari berbagai macam URL */
function extractYouTubeId(url = "") {
  try {
    // common patterns
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
    if (u.searchParams && u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }
    // fallback: last path segment
    const parts = u.pathname.split("/");
    return parts.pop() || "";
  } catch (e) {
    // fallback regex
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return m ? m[1] : "";
  }
}

export default function VideoCard({ item = {} }) {
  const id = extractYouTubeId(item.link_video || "");
  const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/assets/default-video-thumb.png";

  return (
    <article className="video-card">
      <div className="thumb">
        <img src={thumb} alt={item.judul_video || "video"} />
      </div>
      <div className="meta">
        <h4 className="title">{item.judul_video}</h4>
        <p className="muted">Keyword mood: {item.mood_video}</p>
        <div className="actions">
          <a className="btn watch-btn" href={item.link_video} target="_blank" rel="noopener noreferrer">Watch Now</a>
        </div>
      </div>
    </article>
  );
}
