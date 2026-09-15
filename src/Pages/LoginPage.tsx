import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./LoginPage.css";

import {
  FaEnvelope,
  FaLock,
  FaRegEye,
  FaRegEyeSlash,
  FaUserTag,
} from "react-icons/fa";

const ROLE_OPTIONS = ["Buyer", "Seller", "Admin"] as const;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    if (!role) {
      alert("Please select your role.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const storedUsers = (() => {
      try {
        const raw = window.localStorage.getItem("marketplace_users");
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();
    const signedInUser = storedUsers.find(
      (user: { email?: string }) => user.email?.toLowerCase() === normalizedEmail
    );

    window.localStorage.setItem(
      "marketplace_current_user",
      JSON.stringify({
        id: signedInUser?.id ?? normalizedEmail,
        name: signedInUser?.name ?? email.split("@")[0],
        email: normalizedEmail,
        role,
      })
    );

    console.log({ email, password, role, rememberMe });

    // Sellers land on the listing form, buyers land on the shop, everyone else goes home.
    if (role === "Seller") {
      navigate("/list-product");
    } else if (role === "Buyer") {
      navigate("/shop");
    } else {
      navigate("/home");
    }
  };

  return (
    <main className="login-page">
      {/* ================= LEFT PANEL ================= */}
      <section className="login-left-panel">
        <video
          className="login-video"
          src="/login-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="login-video-overlay">
          <div className="login-video-content">
            <span className="login-video-eyebrow">AutoMarket</span>
            <h2 className="login-video-heading">Welcome Back to AutoMarket</h2>
            <span className="login-video-divider" />
          </div>
        </div>
      </section>

      {/* ================= RIGHT PANEL ================= */}
      <section className="login-right-panel">
        <div className="login-form-container">
          <h2>Login</h2>
          <p className="login-subtitle">Access your account</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="login-input-group">
              <FaEnvelope />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                aria-label="Email Address"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="login-input-group">
              <FaLock />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            {/* Role */}
            <div className="login-input-group">
              <FaUserTag />
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label="Select your role"
                className="role-select"
              >
                <option value="" disabled>
                  Select Role
                </option>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Forgot password */}
            <div className="forgot-password-row">
              <Link to="/reset-password">Forgot Password?</Link>
            </div>

            {/* Remember me */}
            <div className="remember-me">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>

            <button type="submit" className="login-button">Login</button>
          </form>

          {/* Register */}
          <p className="register-link">
            Don't have an account?
            <Link to="/register">Register</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;