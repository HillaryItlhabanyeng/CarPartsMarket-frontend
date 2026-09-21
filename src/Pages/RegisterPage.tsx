import "./RegisterPage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { upsertUser } from "../Components/userStore";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        // city: "",
        // province: "",
        // gender: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check that the passwords match
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Save only the information that should appear on the profile
        // DO NOT save the password here.
        const user = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            mobile: formData.mobile.trim(),
            role: "buyer",
        };

        // Save the user so ProfilePage.tsx can read it
        localStorage.setItem(
            "automarketUser",
            JSON.stringify(user)
        );

        // Keep a permanent record so the admin can see this account
        upsertUser({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile,
        });

        console.log("Registration data saved:", user);

        // Continue to the address page
        navigate("/address");
    };

    const handleSignIn = () => {
        console.log('Navigate to sign-in');
        navigate("/login");
    };

    const handleCancel = () => {
        console.log('Navigate to sign-in');
        navigate("/");
    };

    return (
        <div className="RegisterContainer">

            <div className="Registerlogo-card">

                <img
                    src="logoIcon2.png"
                    className="registerLogo"
                    alt="AutoMarket Logo"
                />

                <h1 className="logoTitle">
                    <span>Auto</span>Market
                </h1>

                <div className="logoButtons">
                    <button type="submit" className="RegisterLogoButton" onClick={(handleSignIn)}>
                        Login
                    </button>

                    <button type="submit" className="RegisterLogoButton" onClick={(handleCancel)}>
                        Cancel
                    </button>

                </div>
            </div>

            <div className="Register-card">

                <h1>Create an Account</h1>

                <form onSubmit={handleSubmit}>

                    {/* First Name + Last Name */}
                    <div className="RegisterformRow">

                        <div className="Registerform-group">
                            <label htmlFor="firstName">
                                First Name
                            </label>

                            <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="Registerform-group">
                            <label htmlFor="lastName">
                                Last Name
                            </label>

                            <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    {/* City + Province
                    <div className="RegisterformRow">

                        <div className="Registerform-group">
                            <label htmlFor="city">
                                City
                            </label>

                            <input
                                id="city"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="Registerform-group">
                            <label htmlFor="province">
                                Province
                            </label>

                            <select
                                id="province"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select Province
                                </option>

                                <option value="Eastern Cape">
                                    Eastern Cape
                                </option>

                                <option value="Free State">
                                    Free State
                                </option>

                                <option value="Gauteng">
                                    Gauteng
                                </option>

                                <option value="KwaZulu-Natal">
                                    KwaZulu-Natal
                                </option>

                                <option value="Limpopo">
                                    Limpopo
                                </option>

                                <option value="Mpumalanga">
                                    Mpumalanga
                                </option>

                                <option value="Northern Cape">
                                    Northern Cape
                                </option>

                                <option value="North West">
                                    North West
                                </option>

                                <option value="Western Cape">
                                    Western Cape
                                </option>

                            </select>
                        </div>

                    </div>
                    */}

                    {/* Email + Mobile */}
                    <div className="RegisterformRow">

                        <div className="Registerform-group">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="Registerform-group">
                            <label htmlFor="mobile">
                                Mobile Number
                            </label>

                            <input
                                id="mobile"
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    {/* Password + Confirm Password */}
                    <div className="RegisterformRow">

                        <div className="Registerform-group">
                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="Registerform-group">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    {/* Terms and Conditions */}
                    <div className="checkboxes">

                        <label>

                            <input
                                type="checkbox"
                                name="option1"
                                required
                            />

                            <span className="label-text">
                                Creating your account and accepting
                                terms & conditions
                            </span>

                        </label>

                    </div>

                    {/* Continue */}
                    <button
                        type="submit"
                        className="RegisterButton"
                    >
                        Continue
                    </button>

                    <div className="bottomButtons">

                        <button
                            type="button"
                            className="RegisterBottomButton1"
                            onClick={() => navigate("/register")}
                            aria-label="Register"
                        >
                        </button>

                        <button
                            type="submit"
                            className="RegisterBottomButton2"
                            aria-label="Continue registration"
                        >
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default RegisterPage;