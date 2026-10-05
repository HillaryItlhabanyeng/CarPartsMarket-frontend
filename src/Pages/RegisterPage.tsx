import "./RegisterPage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { upsertUser } from "../Components/userStore";
import { registerBuyer } from "../api/authService"; 

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            // 1. Save to backend
            const { data } = await registerBuyer({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,          
                buyingPart: "Engine",                 
            });

            
            const user = {
                firstName: data.firstName ?? formData.firstName.trim(),
                lastName: data.lastName ?? formData.lastName.trim(),
                email: data.email ?? formData.email.trim(),
                mobile: formData.mobile.trim(),
                role: "buyer",
            };

            localStorage.setItem("automarketUser", JSON.stringify(user));
            upsertUser({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                mobile: user.mobile,
            });

            console.log("Registered:", data);

            // 3. Continue
            navigate("/address");
        } catch (err: any) {
            console.error(
                "Register failed:",
                err.response?.status,
                err.response?.data
            );
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = () => navigate("/login");
    const handleCancel = () => navigate("/");

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
                    {/* type="button" so they don't submit the form */}
                    <button
                        type="button"
                        className="RegisterLogoButton"
                        onClick={handleSignIn}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className="RegisterLogoButton"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <div className="Register-card">
                <h1>Create an Account</h1>

                <form onSubmit={handleSubmit}>
                    {/* First + Last name */}
                    <div className="RegisterformRow">
                        <div className="Registerform-group">
                            <label htmlFor="firstName">First Name</label>
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
                            <label htmlFor="lastName">Last Name</label>
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

                    {/* Email + Mobile */}
                    <div className="RegisterformRow">
                        <div className="Registerform-group">
                            <label htmlFor="email">Email</label>
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
                            <label htmlFor="mobile">Mobile Number</label>
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

                    {/* Passwords */}
                    <div className="RegisterformRow">
                        <div className="Registerform-group">
                            <label htmlFor="password">Password</label>
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
                            <label htmlFor="confirmPassword">Confirm Password</label>
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

                    {/* Terms */}
                    <div className="checkboxes">
                        <label>
                            <input type="checkbox" name="option1" required />
                            <span className="label-text">
                                Creating your account and accepting terms & conditions
                            </span>
                        </label>
                    </div>

                    {error && (
                        <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
                    )}

                    <button
                        type="submit"
                        className="RegisterButton"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Continue"}
                    </button>

                    <div className="bottomButtons">
                        <button
                            type="button"
                            className="RegisterBottomButton1"
                            onClick={() => navigate("/register")}
                            aria-label="Register"
                        />
                        <button
                            type="submit"
                            className="RegisterBottomButton2"
                            aria-label="Continue registration"
                            disabled={loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;