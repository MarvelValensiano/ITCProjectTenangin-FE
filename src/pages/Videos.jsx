// src/pages/Videos.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoCard from "../components/VideoCard";
import { fetchUserVideos } from "../services/videos";
import videoimg from "/src/assets/video/Group1.png";
import "../styles/Videos.css";

export default function VideosPage() {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [currentMood, setCurrentMood] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchUserVideos();
        const list = (res && res.data) || [];
        if (!list.length) {
          setVideos([]);
          setError("Minimal isi 1 mood terlebih dahulu.");
          setCurrentMood(null);
        } else {
          if (mounted) {
            setVideos(list);
            setCurrentMood(list[0].mood_video || null);
          }
        }
      } catch (err) {
        const msg = err?.message || "Gagal memuat video.";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const goToCheckMood = () => {
    window.location.href = "/CheckMood";
  };

  return (
    <div className="videos-page">
      <Navbar />
      <main className="videos-container">
        <section className="videos-hero card">
          <div className="hero-left">
            <h1>Your Daily Recommendations</h1>
            <p className="lead">Based on your current mood, we've picked something to inspire you.</p>

            <div className="mood-chip">
              {currentMood ? (
                <>😊 Current Mood: <strong style={{ marginLeft: 6, textTransform: "capitalize" }}>{currentMood}</strong></>
              ) : (
                "No mood detected"
              )}
            </div>
          </div>

          <div className="hero-right">
            <img src={videoimg} alt="illustration" />
          </div>
        </section>

        <section className="videos-list">
          <h2>Watch This to Brighten Your Mood</h2>

          {loading && <p className="muted">Loading recommendations…</p>}

          {!loading && error && (
            // improved notice card (uses styles added in Videos.css)
            <div className="notice-card" role="status" aria-live="polite">
              <div className="notice-left">
                <div className="notice-icon" aria-hidden="true">⚠️</div>

                <div className="notice-body">
                  <h3 className="notice-title">Oops — you don't have any mood yet</h3>
                  <p className="notice-text">{error || "Minimal isi 1 mood terlebih dahulu."}</p>

                  <div className="notice-actions">
                    <button
                      className="btn btn-primary"
                      onClick={goToCheckMood}
                      aria-label="Go to Check Mood"
                    >
                      <span className="btn-emoji" aria-hidden="true">😊</span>
                      Go to Check Mood
                    </button>

                    <button
                      className="btn btn-ghost"
                      onClick={() => (window.location.href = "/home")}
                      aria-label="Back to Home"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>

              <div className="notice-right" aria-hidden="true">
                <img
                  src={videoimg}
                  alt="Ilustration - go check your mood"
                  className="notice-illustration"
                />
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid">
              {videos.map((v) => <VideoCard key={v.id_video} item={v} />)}
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <div className="see-more">
              <a href="/videos/all" className="link">See More Videos →</a>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
