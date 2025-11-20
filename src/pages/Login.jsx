// src/pages/Login.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthIllustration from "../components/AuthIllustration";
import LoginForm from "../components/LoginForm";
import "../styles/Login.css";

export default function Login() {
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
