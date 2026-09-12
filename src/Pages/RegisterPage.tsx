import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaRegEye,
  FaRegEyeSlash,
  FaShieldAlt,
  FaUsers,
  FaLeaf,
  FaCommentDots,
} from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const fullName = String(data.fullName || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();
    const role = String(data.role || "");
    const password = String(data.password || "");
    const confirmPassword = String(data.confirmPassword || "");
    const agreeToTerms = data.agreeToTerms === "on";

    if (!fullName) return alert("Please enter your full name and surname.");
    if (!email) return alert("Please enter your email address.");

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) return alert("Please enter a valid email address.");
    if (!phone) return alert("Please enter your phone number.");
    if (!role) return alert("Please select your role.");
    if (!password) return alert("Please enter a password.");
    if (password.length < 8) return alert("Password must be at least 8 characters long.");
    if (password !== confirmPassword) return alert("Passwords do not match.");
    if (!agreeToTerms) return alert("Please agree to the Terms and Conditions to continue.");

    console.log("Form submitted:", { fullName, email, phone, role, password });

    // Go to login page after successful registration
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-card">
        {/* ===== LEFT SIDE ===== */}
        <div className="left-panel">
          <img src="/image.png" alt="UniTrade Logo" className="logo" />

          <h1>
            Join <span>UniTrade</span><br />Today!
          </h1>

          <p>
            Buy, sell and connect with students, faculty, vendors and residents
            across your campus community.
          </p>

          <img
            src="/RegisterPage.png"
            alt="Register Illustration"
            className="register-image"
          />

          <div className="features">
            <div className="feature">
              <div className="feature-icon"><FaShieldAlt /></div>
              <span>Secure Transactions</span>
            </div>
            <div className="feature">
              <div className="feature-icon"><FaUsers /></div>
              <span>Trusted Community</span>
            </div>
            <div className="feature">
              <div className="feature-icon"><FaLeaf /></div>
              <span>Sustainable Marketplace</span>
            </div>
            <div className="feature">
              <div className="feature-icon"><FaCommentDots /></div>
              <span>Community Engagement</span>
            </div>
          </div>
        </div>

        {/* ===== RIGHT SIDE ===== */}
        <div className="right-panel">
          <h2>Create Your UniTrade Account</h2>
          <p className="subtitle">Join the Campus Marketplace Today</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <FaUser />
              <input
                name="fullName"
                type="text"
                placeholder="Full Name and Surname"
                aria-label="Full Name and Surname"
                autoComplete="name"
              />
            </div>

            <div className="input-group">
              <FaEnvelope />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                aria-label="Email Address"
                autoComplete="email"
              />
            </div>

            <small className="email-note">
              Student must use their university email address.
            </small>

            <div className="input-group">
              <FaPhone />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                aria-label="Phone Number"
                autoComplete="tel"
              />
            </div>

            <div className="input-group">
              <MdOutlineWorkOutline />
              <select name="role" defaultValue="" aria-label="Select Your Role">
                <option value="" disabled>Select Your Role</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="vendor">Vendor</option>
                <option value="resident">Resident</option>
              </select>
            </div>

            <div className="input-group">
              <FaLock />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                aria-label="Password"
                autoComplete="new-password"
              />
              <span
                className="eye"
                onClick={() => setShowPassword((p) => !p)}
                role="button"
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowPassword((p) => !p);
                  }
                }}
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>

            <div className="input-group">
              <FaLock />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                aria-label="Confirm Password"
                autoComplete="new-password"
              />
              <span
                className="eye"
                onClick={() => setShowConfirmPassword((p) => !p)}
                role="button"
                tabIndex={0}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowConfirmPassword((p) => !p);
                  }
                }}
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>

            <div className="checkbox">
              <input type="checkbox" id="terms" name="agreeToTerms" />
              <label htmlFor="terms">
                I agree to the<span> Terms and Conditions</span>
              </label>
            </div>

            <button type="submit">Create Account</button>
          </form>

          <p className="login">
            Already have an account?<Link to="/login"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;