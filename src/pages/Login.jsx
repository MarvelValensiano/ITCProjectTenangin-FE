// src/pages/Login.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthIllustration from "../components/AuthIllustration";
import LoginForm from "../components/LoginForm";
import { useLocation } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const expired = query.get("expired") === "1";

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-left">
          <AuthIllustration />
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-title">Log In</h2>

            {/* SESSION EXPIRED BANNER */}
            {expired && (
              <div className="session-expired-banner">
                <strong>Session Expired</strong>
                <p>Your session has ended. Please login again.</p>
              </div>
            )}

            <LoginForm />

            <div className="auth-footer-note">
              No account yet? <a href="/Register">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
