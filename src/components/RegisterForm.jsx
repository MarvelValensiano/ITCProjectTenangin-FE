// src/components/RegisterForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as authRegister } from "../services/auth";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!name.trim()) return "Nama harus diisi.";
    if (!email.trim()) return "Email harus diisi.";
    if (password.length < 8) return "Password minimal 8 karakter.";
    if (password !== confirm) return "Konfirmasi password tidak cocok.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      // Backend sample uses 'nama' field in register payload (based on backend snippet)
      // and also expects 'confirm' field. Adjust if backend expects different names.
      const data = await authRegister({
        nama: name,
        email,
        password,
        confirm,
      });

      // If backend returns accessToken & user on register, authRegister may already store them.
      // For most flows, redirect to login after successful registration.
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      const serverMsg = err?.data?.message || err?.message;
      setError(serverMsg || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-inner">
          <label className="field-label">
            Your Name
            <input
              type="text"
              className="textfield"
              placeholder="Nama lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>

          <label className="field-label">
            Email Address
            <input
              type="email"
              className="textfield"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="field-label">
            Password
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                className="textfield password-input"
                placeholder="Masukkan kata sandi Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4b5563" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/><circle cx="12" cy="12" r="2.2" fill="#111"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4b5563" d="M2.808 2.808 1.394 4.221l3.273 3.273A11.306 11.306 0 0 0 1 11s4 7 11 7c2.17 0 4.17-.43 5.975-1.176l3.05 3.05 1.414-1.414L2.808 2.808Zm8.785 8.785a3 3 0 0 1 3.49 3.49l-3.49-3.49Z"/></svg>
                )}
              </button>
            </div>
            <small className="hint">It must be a combination of minimum 8 letters, numbers, and symbols.</small>
          </label>

          <label className="field-label">
            Confirm Password
            <div className="password-wrap">
              <input
                type={showConfirm ? "text" : "password"}
                className="textfield password-input"
                placeholder="Ulangi kata sandi Anda"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? "Hide confirm" : "Show confirm"}
              >
                {showConfirm ? (
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4b5563" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/><circle cx="12" cy="12" r="2.2" fill="#111"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4b5563" d="M2.808 2.808 1.394 4.221l3.273 3.273A11.306 11.306 0 0 0 1 11s4 7 11 7c2.17 0 4.17-.43 5.975-1.176l3.05 3.05 1.414-1.414L2.808 2.808Zm8.785 8.785a3 3 0 0 1 3.49 3.49l-3.49-3.49Z"/></svg>
                )}
              </button>
            </div>
            <small className="hint">It must be a combination of minimum 8 letters, numbers, and symbols.</small>
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>

      <hr className="auth-sep" />
    </>
  );
}
