// src/components/HomeHeader.jsx
import React from "react";
import imageHeader from "../assets/Home/OBJECTS.png"; // pastikan file ada di src/assets/Home/

export default function HomeHeader({ userName, onCheckMood }) {
  return (
    <div className="home-header">
      <div className="header-left">
        <div className="header-greeting">Hi, {userName} 👋</div>
        <h1 className="header-title">Start Your Day with a Positive Mind.</h1>
        <p className="header-subtitle">Simple ways to stay calm, motivated, and inspired.</p>
        <button className="header-button" onClick={onCheckMood}>Check Your Mood Now !</button>
      </div>
      <div className="header-right">
        <img
          src={imageHeader}
          alt="illustration"
          className="header-image"
        />
      </div>
    </div>
  );
}
