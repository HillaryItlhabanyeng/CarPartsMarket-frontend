import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { upsertUser } from "../Components/userStore";
import { loginUser } from "../api/authService";

import "./LoginPage.css";

import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash, FaUserTag } from "react-icons/fa";

const ROLE_OPTIONS = ["Buyer", "Seller", "Admin"] as const;

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            alert("Please enter your email address.");
            return;
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!password) {
            alert("Please enter your password.");
            return;
        }

        if (!selectedRole) {
            alert("Please select your role.");
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();

        try {
            const res = await loginUser({ email: normalizedEmail, password });
            const { userid, firstName, lastName, email: returnedEmail, role: backendRole } = res.data;

            // Buyers and sellers are interchangeable; only admin is restricted.
            const chosenRole = selectedRole.toLowerCase();
            const accountRole = String(backendRole).toLowerCase();
            if (chosenRole === "admin" && accountRole !== "admin") {
                setError("This account is not an admin account.");
                return;
            }
            if (accountRole === "admin" && chosenRole !== "admin") {
                setError("Admin accounts must log in as Admin.");
                return;
            }

            const role = chosenRole;
            const userName = firstName && lastName ? `${firstName} ${lastName}` : returnedEmail.split("@")[0];

            const currentUser = {
                id: userid,
                firstName,
                lastName,
                name: userName,
                email: returnedEmail,
                mobile: "",
                role,
            };

            upsertUser({
                email: returnedEmail,
                firstName,
                lastName,
                name: userName,
                mobile: "",
                role,
                loggedIn: true,
            });

            window.localStorage.setItem("automarketUser", JSON.stringify(currentUser));
            window.localStorage.setItem("marketplace_current_user", JSON.stringify(currentUser));

            if (rememberMe) {
                window.localStorage.setItem("automarketRememberMe", "true");
            } else {
                window.localStorage.removeItem("automarketRememberMe");
            }

            console.log("Logged in user:", currentUser);

            if (role === "seller") {
                navigate("/list-product");
            } else if (role === "buyer") {
                navigate("/shop");
            } else if (role === "admin") {
                navigate("/home");
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError("Wrong email or password.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="LoginContainer">
            <div className="Loginlogo-card">
                <img src="/logoIcon2.png" className="loginLogo" alt="AutoMarket logo" />
                <h1 className="loginLogoTitle">
                    <span>Auto</span>Market
                </h1>
            </div>

            <div className="Login-card">
                <h1>Login</h1>
                <p className="Login-subtitle">Access your AutoMarket account</p>

                {error && <p className="LoginError">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="Loginform-group">
                        <label htmlFor="email">Email</label>
                        <div className="Login-input-wrapper">
                            <FaEnvelope />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    <div className="Loginform-group">
                        <label htmlFor="password">Password</label>
                        <div className="Login-input-wrapper">
                            <FaLock />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="LoginPasswordButton"
                                onClick={() => setShowPassword((previous) => !previous)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>

                    <div className="Loginform-group">
                        <label htmlFor="role">Account Type</label>
                        <div className="Login-input-wrapper">
                            <FaUserTag />
                            <select
                                id="role"
                                name="role"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                required
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
                    </div>

                    <div className="LoginForgotPassword">
                        <Link to="/reset-password">Forgot Password?</Link>
                    </div>

                    <div className="LoginRememberMe">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Remember Me</span>
                        </label>
                    </div>

                    <button type="submit" className="LoginButton">
                        Login
                    </button>

                    <p className="LoginRegisterText">
                        Don't have an account?
                        <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;