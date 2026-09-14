import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./LoginPage.css";

import {
  FaEnvelope,
  FaLock,
  FaRegEye,
  FaRegEyeSlash,
  FaShieldAlt,
  FaUsers,
  FaLeaf,
  FaCommentDots,
  FaUserGraduate,
  FaStore,
  FaHome,
  FaBuilding,
} from "react-icons/fa";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    console.log({ email, password, rememberMe });

    // Redirect to the home page after a successful login
    navigate("/home");
  };

  return (
    <main className="login-page">
      {/* ================= LEFT PANEL ================= */}
      <section className="login-left-panel">
        <img
          src="/image.png"
          alt="UniTrade Campus Marketplace"
          className="login-logo"
        />

        <h1>
          Welcome <span>Back</span>!
        </h1>

        <p className="welcome-text">
          Login to continue to
          <br />
          UniTrade Campus Marketplace.
        </p>

        <img
          src="/LoginPage.png"
          alt="Students using the UniTrade marketplace"
          className="login-illustration"
        />

        {/* Features */}
        <div className="login-features">
          <div className="login-feature">
            <div className="login-feature-icon"><FaShieldAlt /></div>
            <span>Secure<br />Transactions</span>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon"><FaUsers /></div>
            <span>Trusted<br />Community</span>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon"><FaLeaf /></div>
            <span>Sustainable<br />Marketplace</span>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon"><FaCommentDots /></div>
            <span>Community<br />Engagement</span>
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

          {/* Divider */}
          <div className="or-divider">
            <span />
            <p>OR</p>
            <span />
          </div>

          {/* Role login options */}
          <p className="login-as-text">Login as :</p>
          <div className="role-options">
            <button type="button" className="role-option" aria-label="Login as student">
              <FaUserGraduate />
              <span>Student</span>
            </button>
            <button type="button" className="role-option" aria-label="Login as vendor">
              <FaStore />
              <span>Vendor</span>
            </button>
            <button type="button" className="role-option" aria-label="Login as resident">
              <FaHome />
              <span>Resident</span>
            </button>
            <button type="button" className="role-option" aria-label="Login as faculty">
              <FaBuilding />
              <span>Faculty</span>
            </button>
          </div>

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