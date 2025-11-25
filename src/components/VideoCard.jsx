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
  const thumb =
    id
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : "/assets/default-video-thumb.png";

  return (
    <article className="video-card new-video-card">
      {/* thumbnail wrapper */}
      <div className="thumb-wrapper">
        <img className="thumb-img" src={thumb} alt={item.judul_video || "video"} />

        {/* overlay gradient */}
        <div className="thumb-overlay"></div>

        {/* play icon */}
        <div className="thumb-play-icon" aria-hidden="true">
          ▶
        </div>
      </div>

      {/* meta section */}
      <div className="meta">
        <h4 className="title">{item.judul_video}</h4>

        <p className="video-mood-text">
          <span className="mood-pill">{item.mood_video}</span>
        </p>

        <div className="actions">
          <a
            className="btn watch-btn enhanced-watch-btn"
            href={item.link_video}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="watch-icon" aria-hidden="true">🎬</span>
            Watch Now
          </a>
        </div>
      </div>
    </article>
  );
}
