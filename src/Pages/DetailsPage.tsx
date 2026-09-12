import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import CheckoutSteps from "../Components/CheckoutSteps";
import OrderSummary from "../Components/OrderSummary";
import { useCart } from "../Components/useCart";
import "./DetailsPage.css"

const DELIVERY_FEE = 150.0;

export default function DetailsPage(){
    const navigate = useNavigate();
    const { items } = useCart();
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const[email,setEmail] = useState("");

    const handleContinue = ()=> {
        if(!fullName || !phone || !email){
            alert("Please fill in all fields");
            return;
        }
        navigate("/checkout/payment");
    };

    const orderSummaryItems = items.map((item) => ({
        name: item.name,
        specs: item.category ?? "",
        price: item.price * item.quantity,
        image: item.imageUrl ?? "",
    }));

    return (
    <>
    <Navbar showLinks={false} />
    <div className="checkout-page">
        <p className="secure-label">SECURE CHECKOUT</p>
        <h2>Your Details</h2>

        <CheckoutSteps currentStep={1} />

        <div className="checkout-content">
          <div className="details-form">
            <p className="section-label">CONTACT INFORMATION</p>

            <label>FULL NAME</label>
            <input
               type="text"
               value={fullName}
               onChange={(e) => setFullName(e.target.value)}
               placeholder="Sipho Paul Modise"
            />

            <div className="form-row">
                <div>
                    <label>PHONE NUMBER</label>
                    <input
                       type="tel"
                       value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                       placeholder="0893452344"
                    />
                </div>
                <div>
                    <label>EMAIL ADDRESS</label>
                    <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="paulmodise12@gmail.com"
                    />
                </div>
            </div>
          </div>

          <OrderSummary
            items={orderSummaryItems}
            deliveryFee={DELIVERY_FEE}
          />
        </div>

        <button className="continue-btn" onClick={handleContinue}>
            Continue to Payment →
        </button>
    </div>
    </>
);
}