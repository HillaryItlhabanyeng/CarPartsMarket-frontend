import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useCart } from "../Components/useCart";
import "./CheckoutPage.css";

interface ShippingInfo {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  deliveryLocation: string;
}

interface FormErrors {
  fullName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  deliveryLocation?: string;
}

type PaymentMethod = "payfast" | "card" | "other";

const DELIVERY_FEE = 50;
const DISCOUNT = 0;

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();

  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    deliveryLocation: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("payfast");

  const total = subtotal + DELIVERY_FEE - DISCOUNT;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setShipping((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!shipping.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!shipping.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required.";
    } else if (!emailPattern.test(shipping.emailAddress)) {
      newErrors.emailAddress = "Enter a valid email address.";
    }

    const phoneDigits = shipping.phoneNumber.replace(/\D/g, "");

    if (!phoneDigits) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (phoneDigits.length < 10) {
      newErrors.phoneNumber = "Enter a valid phone number.";
    }

    if (!shipping.deliveryLocation.trim()) {
      newErrors.deliveryLocation = "Delivery location is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (items.length === 0) return;

    if (!validate()) return;

    sessionStorage.setItem(
      "checkoutShipping",
      JSON.stringify({
        shipping,
        paymentMethod,
      })
    );

    navigate("/checkout/details");
  };

  const formatCurrency = (value: number) =>
    `${value < 0 ? "-" : ""}R${Math.abs(value).toFixed(2)}`;

  return (
    <div className="checkout-page">
      <Navbar />

      <main>
        <h1>Checkout</h1>

        {/* CHECKOUT STEPS */}
        <div className="checkout-steps">
          <div className="checkout-step active">
            <span className="checkout-step-number">1</span>
            <span>Shipping</span>
          </div>

          <div className="checkout-step">
            <span className="checkout-step-number">2</span>
            <span>Payment</span>
          </div>

          <div className="checkout-step">
            <span className="checkout-step-number">3</span>
            <span>Review</span>
          </div>

          <div className="checkout-step">
            <span className="checkout-step-number">4</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="checkout-columns">
          {/* LEFT SIDE */}
          <div>
            {/* SHIPPING INFORMATION */}
            <section className="checkout-card">
              <h2>1. Shipping Information</h2>

              <div className="checkout-form-group">
                <label htmlFor="fullName">Full Name</label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter full name"
                  value={shipping.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "error" : ""}
                />

                {errors.fullName && (
                  <span className="checkout-error">
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="checkout-form-group">
                <label htmlFor="emailAddress">
                  Email Address
                </label>

                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  placeholder="Enter email address"
                  value={shipping.emailAddress}
                  onChange={handleChange}
                  className={errors.emailAddress ? "error" : ""}
                />

                {errors.emailAddress && (
                  <span className="checkout-error">
                    {errors.emailAddress}
                  </span>
                )}
              </div>

              <div className="checkout-form-group">
                <label htmlFor="phoneNumber">
                  Phone Number
                </label>

                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={shipping.phoneNumber}
                  onChange={handleChange}
                  className={errors.phoneNumber ? "error" : ""}
                />

                {errors.phoneNumber && (
                  <span className="checkout-error">
                    {errors.phoneNumber}
                  </span>
                )}
              </div>

              <div className="checkout-form-group">
                <label htmlFor="deliveryLocation">
                  Delivery Location
                </label>

                <input
                  id="deliveryLocation"
                  name="deliveryLocation"
                  type="text"
                  placeholder="Enter location"
                  value={shipping.deliveryLocation}
                  onChange={handleChange}
                  className={
                    errors.deliveryLocation ? "error" : ""
                  }
                />

                {errors.deliveryLocation && (
                  <span className="checkout-error">
                    {errors.deliveryLocation}
                  </span>
                )}
              </div>
            </section>

            {/* PAYMENT METHOD */}
            <section className="checkout-card">
              <h2>2. Payment Method</h2>

              <div className="payment-options">
                <label
                  className={`payment-option ${
                    paymentMethod === "payfast" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="payfast"
                    checked={paymentMethod === "payfast"}
                    onChange={() => setPaymentMethod("payfast")}
                  />
                  <label>PayFast (Cards)</label>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === "card" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <label>Debit / Credit Card</label>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === "other" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="other"
                    checked={paymentMethod === "other"}
                    onChange={() => setPaymentMethod("other")}
                  />
                  <label>Other Payment Methods</label>
                </label>
              </div>

              <button
                type="button"
                className="checkout-continue"
                onClick={handleContinue}
                disabled={items.length === 0}
              >
                Continue to Details
              </button>
            </section>
          </div>

          {/* RIGHT SIDE */}
          <aside className="order-summary">
            <h2>Order Summary</h2>

            <div className="order-summary-items">
              {items.length === 0 ? (
                <p>No items in your cart.</p>
              ) : (
                items.map((item) => (
                  <div className="order-summary-item" key={item.id}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : null}

                    <div className="order-summary-item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>

                    <p className="order-summary-item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="summary-row">
              <span>
                Subtotal ({items.length} item
                {items.length !== 1 ? "s" : ""})
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>{formatCurrency(DELIVERY_FEE)}</span>
            </div>

            <div className="summary-row discount">
              <span>Discount</span>
              <span>{formatCurrency(-DISCOUNT)}</span>
            </div>

            {/* TOTAL - matches .apply-btn / .checkout-continue brown via CSS var(--primary) */}
            <div className="summary-total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className="secure-checkout">
              <p>
                🔒 <strong>Secure Checkout</strong>
              </p>
              <p>Your payment is encrypted and secure.</p>
            </div>

            {/* PROCEED BUTTON */}
            <button
              type="button"
              className="proceed-checkout-btn"
              onClick={handleContinue}
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CheckoutPage;