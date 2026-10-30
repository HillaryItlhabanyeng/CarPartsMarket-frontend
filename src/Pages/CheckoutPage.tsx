import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useCart } from "../Components/useCart";
import { calculateDiscount, loadAppliedCoupon, DELIVERY_FEE } from "../data/coupons";
import {
  FaCcVisa,
  FaCcMastercard,
  FaUniversity,
  FaMoneyBillWave,
  FaQrcode,
} from "react-icons/fa";
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

type PaymentMethod = "payfast" | "card" | "eft" | "snapscan" | "cod";

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    value: "payfast",
    label: "PayFast",
    description: "Cards, Instant EFT and more",
    icon: (
      <img
        src="/payfast-logo.png"
        alt=""
        className="payment-logo"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    ),
  },
  {
    value: "card",
    label: "Debit / Credit Card",
    description: "Visa or Mastercard",
    icon: (
      <>
        <FaCcVisa className="icon-visa" />
        <FaCcMastercard className="icon-mastercard" />
      </>
    ),
  },
  {
    value: "eft",
    label: "EFT / Bank Transfer",
    description: "Pay from your bank using your order reference",
    icon: <FaUniversity />,
  },
  {
    value: "snapscan",
    label: "SnapScan / Zapper",
    description: "Scan a QR code with your phone",
    icon: <FaQrcode />,
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay when your part arrives",
    icon: <FaMoneyBillWave />,
  },
];

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

  // Use the coupon applied in the cart
  const appliedCoupon = loadAppliedCoupon();
  const delivery = items.length > 0 ? DELIVERY_FEE : 0;
  const discount = calculateDiscount(appliedCoupon, subtotal, delivery);
  const total = Math.max(0, subtotal + delivery - discount);

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

    // Pass the pricing on so later steps show the same totals
    sessionStorage.setItem(
      "checkoutShipping",
      JSON.stringify({
        shipping,
        paymentMethod,
        couponCode: appliedCoupon?.code ?? null,
        subtotal,
        delivery,
        discount,
        total,
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
                  <span className="checkout-error">{errors.fullName}</span>
                )}
              </div>

              <div className="checkout-form-group">
                <label htmlFor="emailAddress">Email Address</label>
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
                  <span className="checkout-error">{errors.emailAddress}</span>
                )}
              </div>

              <div className="checkout-form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
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
                  <span className="checkout-error">{errors.phoneNumber}</span>
                )}
              </div>

              <div className="checkout-form-group">
                <label htmlFor="deliveryLocation">Delivery Location</label>
                <input
                  id="deliveryLocation"
                  name="deliveryLocation"
                  type="text"
                  placeholder="Enter location"
                  value={shipping.deliveryLocation}
                  onChange={handleChange}
                  className={errors.deliveryLocation ? "error" : ""}
                />
                {errors.deliveryLocation && (
                  <span className="checkout-error">{errors.deliveryLocation}</span>
                )}
              </div>
            </section>

            {/* PAYMENT METHOD */}
            <section className="checkout-card">
              <h2>2. Payment Method</h2>

              <div className="payment-options">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`payment-option ${paymentMethod === option.value ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value)}
                    />
                    <span className="payment-option-text">
                      <span className="payment-option-label">{option.label}</span>
                      <span className="payment-option-desc">{option.description}</span>
                    </span>
                    <span className="payment-option-icons">{option.icon}</span>
                  </label>
                ))}
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
          {/* end LEFT SIDE */}

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
                Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>{formatCurrency(delivery)}</span>
            </div>

            <div className="summary-row discount">
              <span>
                Discount{appliedCoupon && discount > 0 ? ` (${appliedCoupon.code})` : ""}
              </span>
              <span>{formatCurrency(-discount)}</span>
            </div>

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