import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import OrderSummary from "../Components/OrderSummary";
import { useCart } from "../Components/useCart";
import { calculateDiscount, loadAppliedCoupon, DELIVERY_FEE } from "../data/coupons";
import "./DetailsPage.css";


// Reads what the buyer entered on the checkout page
function readCheckoutShipping() {
    try {
        const raw = sessionStorage.getItem("checkoutShipping");
        return raw ? JSON.parse(raw)?.shipping ?? {} : {};
    } catch {
        return {};
    }
}


export default function DetailsPage() {
    const navigate = useNavigate();
    const { items, subtotal } = useCart();
    const saved = readCheckoutShipping();
const [fullName, setFullName] = useState<string>(saved.fullName ?? "");
const [phone, setPhone] = useState<string>(saved.phoneNumber ?? "");
const [email, setEmail] = useState<string>(saved.emailAddress ?? "");

    
    const appliedCoupon = loadAppliedCoupon();
    const delivery = items.length > 0 ? DELIVERY_FEE : 0;
    const discount = calculateDiscount(appliedCoupon, subtotal, delivery);

    const handleContinue = () => {
        if (!fullName || !phone || !email) {
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
                        deliveryFee={delivery}
                        discount={discount}
                        couponCode={appliedCoupon?.code}
                    />
                </div>

                <button className="continue-btn" onClick={handleContinue}>
                    Continue to Payment →
                </button>
            </div>
        </>
    );
}