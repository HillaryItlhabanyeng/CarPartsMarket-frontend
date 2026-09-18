import "./RegisterPage.css";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        // city: '',
        // province: '',
        // gender: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        console.log('Registration data:', formData);
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
              <img src="logoIcon2.png" className="registerLogo" />
                <h1 className="logoTitle"><span>Auto</span>Market</h1>

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
                    <div className="RegisterformRow">
                        <div className="Registerform-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="Registerform-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* <div className="RegisterformRow">
                        <div className="Registerform-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="Registerform-group">
                            <label>Province</label>
                            <select
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Province</option>
                                <option value="Eastern Cape">Eastern Cape</option>
                                <option value="Free State">Free State</option>
                                <option value="Gauteng">Gauteng</option>
                                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                <option value="Limpopo">Limpopo</option>
                                <option value="Mpumalanga">Mpumalanga</option>
                                <option value="Northern Cape">Northern Cape</option>
                                <option value="North West">North West</option>
                                <option value="Western Cape">Western Cape</option>
                            </select>
                        </div>
                    </div> */}

                    <div className="RegisterformRow">
                        <div className="Registerform-group">
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="Registerform-group">
                            <label>Mobile Number</label>
                            <input
                                type="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="RegisterformRow">
                        <div className="Registerform-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="Registerform-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="checkboxes">
                        <label>
                            <input type="checkbox" name="option1" required/>
                            <span className="label-text">Creating your account and accepting terms & conditions</span>                            </label>

                    </div>

                    <button type="submit" className="RegisterButton">
                        Continue
                    </button>

                    <div className="bottomButtons">
                        <button className="RegisterBottomButton1" onClick={() => navigate("/register")}></button>
                        <button type="submit" className="RegisterBottomButton2"></button>
                    </div>
                    {/* <p className="signin-link">Already have an account? <span
                        role="button"
                        tabIndex={0}
                        onClick={handleSignIn}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleSignIn(); }}
                    >
                        Sign in
                    </span></p> */}
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;