import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { upsertUser } from "../Components/userStore";

import "./LoginPage.css";

import {
    FaEnvelope,
    FaLock,
    FaRegEye,
    FaRegEyeSlash,
    FaUserTag,
} from "react-icons/fa";

const ROLE_OPTIONS = ["Buyer", "Seller", "Admin"] as const;

type UserRole = "buyer" | "seller" | "admin";

type StoredUser = {
    id?: string | number;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    mobile?: string;
    role?: string;
    status?: string;
};

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        /* =========================
           VALIDATE EMAIL
        ========================= */

        if (!email.trim()) {
            alert("Please enter your email address.");
            return;
        }

        const emailRegex =
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(email.trim())) {
            alert("Please enter a valid email address.");
            return;
        }

        /* =========================
           VALIDATE PASSWORD
        ========================= */

        if (!password) {
            alert("Please enter your password.");
            return;
        }

        /* =========================
           VALIDATE ROLE
        ========================= */

        if (!role) {
            alert("Please select your role.");
            return;
        }

        /* =========================
           NORMALISE EMAIL
        ========================= */

        const normalizedEmail = email.trim().toLowerCase();

        const selectedRole = role.toLowerCase() as UserRole;

        /* =========================
           GET REGISTERED USER
        ========================= */

        let registeredUser: StoredUser | null = null;

        try {
            const rawUser =
                window.localStorage.getItem("automarketUser");

            if (rawUser) {
                const parsedUser = JSON.parse(rawUser);

                if (
                    parsedUser &&
                    typeof parsedUser === "object"
                ) {
                    registeredUser = parsedUser;
                }
            }
        } catch {
            registeredUser = null;
        }

        /* =========================
           GET USERS LIST
        ========================= */

        let storedUsers: StoredUser[] = [];

        try {
            const rawUsers =
                window.localStorage.getItem("marketplace_users");

            const parsedUsers = rawUsers
                ? JSON.parse(rawUsers)
                : [];

            if (Array.isArray(parsedUsers)) {
                storedUsers = parsedUsers;
            }
        } catch {
            storedUsers = [];
        }

        /* =========================
           FIND USER BY EMAIL
        ========================= */

        const signedInUser = storedUsers.find(
            (user) =>
                user.email?.toLowerCase() === normalizedEmail
        );

        /* =========================
           SUSPENDED ACCOUNTS CANNOT LOG IN
        ========================= */

        if (signedInUser?.status?.toLowerCase() === "suspended") {
            alert("This account has been suspended. Please contact an administrator.");
            return;
        }

        /* =========================
           GET USER INFORMATION
        ========================= */

        const firstName =
            signedInUser?.firstName ||
            registeredUser?.firstName ||
            "";

        const lastName =
            signedInUser?.lastName ||
            registeredUser?.lastName ||
            "";

        const mobile =
            signedInUser?.mobile ||
            registeredUser?.mobile ||
            "";

        const userName =
            firstName && lastName
                ? `${firstName} ${lastName}`
                : signedInUser?.name ||
                  registeredUser?.name ||
                  normalizedEmail.split("@")[0];

        /* =========================
           CREATE CURRENT USER
        ========================= */

        const currentUser = {
            id:
                signedInUser?.id ||
                registeredUser?.id ||
                normalizedEmail,

            firstName: firstName,

            lastName: lastName,

            name: userName,

            email: normalizedEmail,

            mobile: mobile,

            /*
             * The role selected on Login
             * determines the current role.
             */
            role: selectedRole,
        };

        /* =========================
           STORE THIS LOGIN
           (creates the user if new, keeps the admin's list up to date)
        ========================= */

        upsertUser({
            email: normalizedEmail,
            firstName,
            lastName,
            name: userName,
            mobile,
            role: selectedRole,
            loggedIn: true,
        });

        /* =========================
           SAVE CURRENT USER
        ========================= */

        /*
         * ProfilePage reads this.
         */
        window.localStorage.setItem(
            "automarketUser",
            JSON.stringify(currentUser)
        );

        /*
         * Keep this key as well because
         * other pages may already use it.
         */
        window.localStorage.setItem(
            "marketplace_current_user",
            JSON.stringify(currentUser)
        );

        /* =========================
           REMEMBER ME
        ========================= */

        if (rememberMe) {
            window.localStorage.setItem(
                "automarketRememberMe",
                "true"
            );
        } else {
            window.localStorage.removeItem(
                "automarketRememberMe"
            );
        }

        console.log("Logged in user:", currentUser);

        /* =========================
           ROLE-BASED NAVIGATION
        ========================= */

        if (selectedRole === "seller") {
            navigate("/list-product");
        } else if (selectedRole === "buyer") {
            navigate("/shop");
        } else if (selectedRole === "admin") {
            navigate("/home");
        }
    };

    return (
        <div className="LoginContainer">

            {/* =================================
                LEFT SIDE
                LOGO + AUTOMARKET ONLY
            ================================= */}

            <div className="Loginlogo-card">

                <img
                    src="/logoIcon2.png"
                    className="loginLogo"
                    alt="AutoMarket logo"
                />

                <h1 className="loginLogoTitle">
                    <span>Auto</span>Market
                </h1>

            </div>

            {/* =================================
                LOGIN CARD
            ================================= */}

            <div className="Login-card">

                <h1>Login</h1>

                <p className="Login-subtitle">
                    Access your AutoMarket account
                </p>

                <form onSubmit={handleSubmit}>

                    {/* =================================
                        EMAIL
                    ================================= */}

                    <div className="Loginform-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <div className="Login-input-wrapper">

                            <FaEnvelope />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                            />

                        </div>

                    </div>

                    {/* =================================
                        PASSWORD
                    ================================= */}

                    <div className="Loginform-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="Login-input-wrapper">

                            <FaLock />

                            <input
                                id="password"
                                name="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="LoginPasswordButton"
                                onClick={() =>
                                    setShowPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <FaRegEyeSlash />
                                ) : (
                                    <FaRegEye />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* =================================
                        ACCOUNT TYPE
                    ================================= */}

                    <div className="Loginform-group">

                        <label htmlFor="role">
                            Account Type
                        </label>

                        <div className="Login-input-wrapper">

                            <FaUserTag />

                            <select
                                id="role"
                                name="role"
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value)
                                }
                                required
                            >

                                <option
                                    value=""
                                    disabled
                                >
                                    Select Role
                                </option>

                                {ROLE_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={option}
                                            value={option}
                                        >
                                            {option}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>

                    {/* =================================
                        FORGOT PASSWORD
                    ================================= */}

                    <div className="LoginForgotPassword">

                        <Link to="/reset-password">
                            Forgot Password?
                        </Link>

                    </div>

                    {/* =================================
                        REMEMBER ME
                    ================================= */}

                    <div className="LoginRememberMe">

                        <label>

                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(
                                        e.target.checked
                                    )
                                }
                            />

                            <span>
                                Remember Me
                            </span>

                        </label>

                    </div>

                    {/* =================================
                        LOGIN BUTTON
                    ================================= */}

                    <button
                        type="submit"
                        className="LoginButton"
                    >
                        Login
                    </button>

                    {/* =================================
                        REGISTER
                    ================================= */}

                    <p className="LoginRegisterText">

                        Don't have an account?

                        <Link to="/register">
                            Register
                        </Link>

                    </p>

                </form>

            </div>

        </div>
    );
};

export default LoginPage;