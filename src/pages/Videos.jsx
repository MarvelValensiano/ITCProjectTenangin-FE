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
          if (mounted) {
            setVideos([]);
            setCurrentMood(null);
            setError("Minimal isi 1 mood terlebih dahulu.");
          }
        } else {
          if (mounted) {
            setVideos(list);
            setCurrentMood(list[0].mood_video || null);
          }
        }
      } catch (err) {
        const msg = err?.message || "Gagal memuat video.";
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const goToCheckMood = () => {
    window.location.href = "/CheckMood";
  };

  return (
    <div className="videos-page">
      <Navbar />
      <main className="videos-container">
        {/* HERO SECTION */}
        <section className="videos-hero card">
          <div className="hero-left">
            <p className="eyebrow">Mood-based suggestions</p>
            <h1>Your Daily Recommendations</h1>
            <p className="lead">
              We’ve curated videos based on how you feel today – to help you
              unwind, reset, or boost your energy.
            </p>

            <div className="hero-meta-row">
              <div className="mood-chip">
                {currentMood ? (
                  <>
                    <span className="mood-emoji" aria-hidden="true">
                      😊
                    </span>
                    <span className="mood-label-text">
                      Current Mood:{" "}
                      <strong className="mood-current-label">
                        {String(currentMood).toLowerCase()}
                      </strong>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="mood-emoji" aria-hidden="true">
                      🙂
                    </span>
                    <span className="mood-label-text">
                      No mood detected yet
                    </span>
                  </>
                )}
              </div>

              <p className="hero-caption">
                New mood check will refresh your recommendations instantly.
              </p>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-image-shell">
              <img src={videoimg} alt="Mood based video illustration" />
              <div className="hero-glow-dot hero-glow-dot-1" />
              <div className="hero-glow-dot hero-glow-dot-2" />
            </div>
          </div>
        </section>

        {/* VIDEO LIST */}
        <section className="videos-list">
          <div className="videos-list-header">
            <div>
              <h2>Watch This to Brighten Your Mood</h2>
              <p className="videos-list-subtitle">
                Bite-sized, calming, and uplifting content tailored around your
                latest mood check.
              </p>
            </div>

            {!loading && !error && (
              <div className="videos-list-meta">
                <span className="pill pill-soft">
                  {videos.length} recommended{" "}
                  {videos.length === 1 ? "video" : "videos"}
                </span>
              </div>
            )}
          </div>

          {loading && (
            <div className="loading-state" aria-busy="true" aria-live="polite">
              <div className="loading-bar" />
              <p className="muted">Loading your personalized feed…</p>
            </div>
          )}

          {!loading && error && (
            <div className="notice-card" role="status" aria-live="polite">
              <div className="notice-left">
                <div className="notice-icon" aria-hidden="true">
                  ⚠️
                </div>

                <div className="notice-body">
                  <h3 className="notice-title">
                    Oops — you don&apos;t have any mood yet
                  </h3>
                  <p className="notice-text">
                    {error || "Minimal isi 1 mood terlebih dahulu."}
                  </p>

                  <div className="notice-actions">
                    <button
                      className="btn btn-primary"
                      onClick={goToCheckMood}
                      aria-label="Go to Check Mood"
                    >
                      <span className="btn-emoji" aria-hidden="true">
                        😊
                      </span>
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
                  alt="Illustration - go check your mood"
                  className="notice-illustration"
                />
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-videos">
              {videos.map((v) => (
                <VideoCard key={v.id_video} item={v} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
