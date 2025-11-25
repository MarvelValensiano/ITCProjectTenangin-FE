// src/pages/Register.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthIllustration from "../components/AuthIllustration";
import RegisterForm from "../components/RegisterForm";
import "../styles/Register.css";

export default function Register() {
  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-left">
          <AuthIllustration />
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-title">Register</h2>
            <RegisterForm />
            <div className="auth-footer-note">
              Have an account ? <a href="/login">Sign In</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
