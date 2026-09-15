import "./AddressPage.css";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function AddressPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        streetNumber: '',
        suburb: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
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
                    <button className="RegisterLogoButton" onClick={(handleSignIn)}>
                        Login
                    </button>

                    <button className="RegisterLogoButton" onClick={(handleCancel)}>
                        Cancel
                    </button>
                </div>
            </div>

            <div className="Register-card">
                <h1>Enter your Address</h1>

                <form onSubmit={handleSubmit}>
                    <div className="RegisterformRow">
                        <div className="Registerform-group">
                            <label>Street Number</label>
                            <input
                                type="text"
                                name="streetNumber"
                                value={formData.streetNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="Registerform-group">
                            <label>Suburb</label>
                            <input
                                type="text"
                                name="suburb"
                                value={formData.suburb}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="RegisterformRow">
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
                    </div>

                    <div className="RegisterformRow">
                        <div className="Registerform-group">
                            <label>Postal code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="Registerform-group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="RegisterButton">
                        Create Account
                    </button>

                    <div className="bottomButtons">
                        <button className="addressBottomButton1" onClick={() => navigate("/register")}></button>
                        <button className="addressBottomButton2" onClick={() => navigate("/address")}></button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddressPage;