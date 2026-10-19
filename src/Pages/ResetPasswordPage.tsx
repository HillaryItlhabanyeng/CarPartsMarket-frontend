import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";   // adjust path if needed
import "./ResetPasswordPage.css";

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // --- Validation ---
    if (!email.trim()) return setError("Please enter your email.");
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email.trim())) return setError("Invalid email address.");

    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    try {
      await api.post("/api/auth/reset-password", {
        email: email.trim().toLowerCase(),
        newPassword,
      });

      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("No account found with that email.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="ResetContainer">
      <div className="Reset-card">
        <h1>Reset Password</h1>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="Resetform-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
            />
          </div>

          <div className="Resetform-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="Resetform-group">
            <label>Retype New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Retype new password"
              required
            />
          </div>

          <div className="ResetButtons">
            <button type="submit" className="ResetsubmitButton">
              Submit
            </button>
            <button
              type="button"
              className="ResetCancelButton"
              onClick={() => navigate("/login")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;