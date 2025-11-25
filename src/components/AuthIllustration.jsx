// src/components/AuthIllustration.jsx
import React from "react";
import meditationImg from "../assets/login/meditation-illustration.png"; // pastikan file ada di src/assets/login/

export default function AuthIllustration() {
  return (
    <div className="illustration-wrap">
      <img
        src={meditationImg}
        alt="Meditation illustration"
        className="illustration-img"
      />
    </div>
  );
}
