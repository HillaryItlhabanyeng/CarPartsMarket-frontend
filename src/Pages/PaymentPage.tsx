import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import CheckoutSteps from "../Components/CheckoutSteps";
import { useCart } from "../Components/useCart";
import { useOrders } from "../Components/useOrders";
import { FaCcVisa } from "react-icons/fa";
import { addNotification, getCurrentUser } from "../Components/notificationStore";
import {
  calculateDiscount,
  loadAppliedCoupon,
  saveAppliedCoupon,
  DELIVERY_FEE,
} from "../data/coupons"; // NEW
import "./PaymentPage.css";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // CHANGED: same pricing as the cart and checkout
  const appliedCoupon = loadAppliedCoupon();
  const delivery = items.length > 0 ? DELIVERY_FEE : 0;
  const discount = calculateDiscount(appliedCoupon, subtotal, delivery);
  const total = Math.max(0, subtotal + delivery - discount);

  const formatCurrency = (value: number) => `R${value.toFixed(2)}`;

  const formatCardNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
    return digitsOnly.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
    if (digitsOnly.length >= 3) {
      return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    }
    return digitsOnly;
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    const rawCardNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(rawCardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Use MM/YY format";
    } else {
      const [month, year] = expiry.split("/").map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = "Card has expired";
      }
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayNow = () => {
    if (items.length === 0) return;
    if (!validate()) return;

    const orderItems = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      imageUrl: i.imageUrl,
      category: i.category,
      seller: i.seller,
      sellerEmail: i.sellerEmail,
    }));

    const currentUser = getCurrentUser();
    const newOrder = addOrder(orderItems, delivery, currentUser?.email, discount, appliedCoupon?.code);
    const registeredUsers = (() => {
      try {
        const raw = window.localStorage.getItem("marketplace_users");
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

    items.forEach((item) => {
      const seller = registeredUsers.find(
        (user: { name?: string; email?: string }) =>
          user.name?.toLowerCase() === item.seller?.toLowerCase()
      );
      addNotification({
        type: "Order",
        title: "A buyer wants to buy your car part",
        body: `${item.quantity} x ${item.name} was ordered. Order ${newOrder.reference} is awaiting fulfilment.`,
        recipientEmail: item.sellerEmail || seller?.email,
      });
    });
    addNotification({
      type: "Order",
      title: "Payment completed",
      body: `Your payment of ${formatCurrency(total)} for order ${newOrder.reference} was successful.`, // CHANGED: shows amount paid
      recipientEmail: currentUser?.email,
    });

    clearCart();
    saveAppliedCoupon(null); // NEW: coupon is used up with this order

    navigate("/checkout/confirmation", { state: { reference: newOrder.reference } });
  };

  return (
    <>
      <Navbar showLinks={false} />
      <div className="payment-page">
        <p className="step-label">STEP 2 OF 3</p>
        <h2>Secure Payment</h2>

        <CheckoutSteps currentStep={2} />

        <div className="payfast-card">
          <div className="payfast-header">
            <span className="payfast-icon">
              <FaCcVisa />
            </span>
            <div>
              <p className="payfast-title">Visa</p>
              <p className="payfast-subtitle">Secure checkout gateway</p>
            </div>
          </div>

          <div className="amount-due-section">
            <p className="amount-label">AMOUNT DUE</p>
            <p className="amount-value">{formatCurrency(total)}</p>
            <p className="amount-subtext">Delivery - no store pickup</p>
          </div>

          <div className="order-line-box">
            {items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div className="order-line" key={item.id}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))
            )}

            {/* NEW: delivery + discount lines */}
            {items.length > 0 && (
              <div className="order-line">
                <span>Delivery</span>
                <span>{formatCurrency(delivery)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="order-line">
                <span>Discount{appliedCoupon ? ` (${appliedCoupon.code})` : ""}</span>
                <span style={{ color: "#2e7d4f", fontWeight: 600 }}>
                  -{formatCurrency(discount)}
                </span>
              </div>
            )}

            <div className="order-line total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <label>CARD NUMBER</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4111 1111 1111 1111"
            maxLength={19}
          />
          {errors.cardNumber && <p className="field-error">{errors.cardNumber}</p>}

          <div className="form-row">
            <div>
              <label>EXPIRY DATE</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="11/23"
                maxLength={5}
              />
              {errors.expiry && <p className="field-error">{errors.expiry}</p>}
            </div>
            <div>
              <label>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="***"
                maxLength={4}
              />
              {errors.cvv && <p className="field-error">{errors.cvv}</p>}
            </div>
          </div>

          <button className="pay-now-btn" onClick={handlePayNow} disabled={items.length === 0}>
            🔒 Pay Now - {formatCurrency(total)}
          </button>
          <p className="simulated-note">
            Simulated payment for demonstration purposes only
          </p>
        </div>
      </div>
    </>
  );
}