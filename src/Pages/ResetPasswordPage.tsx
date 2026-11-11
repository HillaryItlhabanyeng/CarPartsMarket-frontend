import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./ResetPasswordPage.css";

type Step = "request" | "reset";

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();

  // Step 1: ask the backend for a code
  const handleRequestCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) return setError("Please enter a valid email address.");

    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email: normalizedEmail });
      setInfo("If an account exists for that email, a 6-digit code has been sent. It expires in 10 minutes.");
      setStep("reset");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: reset with the code
  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(code.trim())) return setError("Enter the 6-digit code.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", {
        email: normalizedEmail,
        code: code.trim(),
        newPassword,
      });
      setInfo("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ResetContainer">
      <div className="Reset-card">
        <h1>Reset Password</h1>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {info && <p style={{ color: "green", textAlign: "center" }}>{info}</p>}

        {step === "request" ? (
          <form onSubmit={handleRequestCode}>
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

            <div className="ResetButtons">
              <button type="submit" className="ResetsubmitButton" disabled={loading}>
                {loading ? "Sending..." : "Send Code"}
              </button>
              <button type="button" className="ResetCancelButton" onClick={() => navigate("/login")}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className="Resetform-group">
              <label>6-digit Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter the code"
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
              <button type="submit" className="ResetsubmitButton" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="button"
                className="ResetCancelButton"
                onClick={() => {
                  setStep("request");
                  setCode("");
                  setError("");
                  setInfo("");
                }}
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;