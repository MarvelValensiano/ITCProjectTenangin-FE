// src/components/LoginForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SocialButton from "./SocialButton";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://projek-itc-tenangin.vercel.app";

  // Jika halaman diakses lewat ?expired=1, pastikan error message user tidak menimpa banner expired
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("expired") === "1") {
      setError(""); // agar tidak double error
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || `Login gagal (${res.status})`;
        throw new Error(msg);
      }

      const token =
        data?.accessToken ||
        data?.token ||
        data?.access_token ||
        (data?.data && (data.data.accessToken || data.data.token));

      const userObj =
        data?.user ||
        data?.data?.user ||
        { username: data?.username, email: data?.email };

      if (!token) {
        throw new Error("Login sukses tapi token tidak ditemukan pada response.");
      }

      try {
        localStorage.setItem("accessToken", token);
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
      } catch (err) {
        console.warn("Gagal menyimpan ke localStorage:", err);
      }

      navigate("/home");
    } catch (err) {
      setError(err?.message || "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-inner">
          <label className="field-label">
            Email Address
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-label="Email"
            />
          </label>

          <label className="field-label">
            Password
            <input
              id="password"
              type="password"
              placeholder="Input your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-label="Password"
            />
            <small className="hint">
              It must be a combination of minimum 8 letters, numbers, and symbols.
            </small>
          </label>

          <div className="login-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="checkbox-text">Remember me</span>
            </label>

            <a className="forgot-link" href="/forgot">Forgot Password?</a>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Log In"}
          </button>
        </div>
      </form>

      <div className="social-login">
        <SocialButton provider="google" onClick={() => alert("Google login (implement)")}>
          Log in with Google
        </SocialButton>
        <SocialButton provider="apple" onClick={() => alert("Apple login (implement)")}>
          Log in with Apple
        </SocialButton>
      </div>

      <hr className="auth-sep" />
    </>
  );
}
