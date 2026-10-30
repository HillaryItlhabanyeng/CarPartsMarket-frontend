import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import CheckoutSteps from "../Components/CheckoutSteps";
import { useCart } from "../Components/useCart";
import { useOrders } from "../Components/useOrders";
import {
  FaCcVisa,
  FaCcMastercard,
  FaUniversity,
  FaMoneyBillWave,
  FaQrcode,
} from "react-icons/fa";
import { addNotification, getCurrentUser } from "../Components/notificationStore";
import {
  calculateDiscount,
  loadAppliedCoupon,
  saveAppliedCoupon,
  DELIVERY_FEE,
} from "../data/coupons";
import "./PaymentPage.css";

type PaymentMethod = "payfast" | "card" | "eft" | "snapscan" | "cod";

const METHODS: PaymentMethod[] = ["payfast", "card", "eft", "snapscan", "cod"];

const METHOD_INFO: Record<PaymentMethod, { title: string; subtitle: string; button: string }> = {
  card: { title: "Debit / Credit Card", subtitle: "Visa or Mastercard", button: "Pay Now" },
  payfast: { title: "PayFast", subtitle: "Secure payment gateway", button: "Pay with PayFast" },
  eft: { title: "EFT / Bank Transfer", subtitle: "Pay from your bank", button: "Place Order" },
  snapscan: { title: "SnapScan / Zapper", subtitle: "Scan to pay", button: "I've Paid" },
  cod: { title: "Cash on Delivery", subtitle: "Pay when your part arrives", button: "Place Order" },
};

// Reads the method the buyer picked on the checkout page
function readPaymentMethod(): PaymentMethod {
  try {
    const raw = sessionStorage.getItem("checkoutShipping");
    const method = raw ? JSON.parse(raw)?.paymentMethod : null;
    return METHODS.includes(method) ? method : "card";
  } catch {
    return "card";
  }
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [method] = useState<PaymentMethod>(readPaymentMethod);
  const [processing, setProcessing] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const appliedCoupon = loadAppliedCoupon();
  const delivery = items.length > 0 ? DELIVERY_FEE : 0;
  const discount = calculateDiscount(appliedCoupon, subtotal, delivery);
  const total = Math.max(0, subtotal + delivery - discount);

  const info = METHOD_INFO[method];
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

  const validateCard = () => {
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

  const placeOrder = () => {
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

    // Buyer message depends on how they're paying
    const buyerMessage =
      method === "eft"
        ? {
            title: "Order placed: awaiting EFT payment",
            body: `Please pay ${formatCurrency(total)} using reference ${newOrder.reference}.`,
          }
        : method === "cod"
        ? {
            title: "Order placed: cash on delivery",
            body: `Please have ${formatCurrency(total)} ready when order ${newOrder.reference} arrives.`,
          }
        : {
            title: "Payment completed",
            body: `Your payment of ${formatCurrency(total)} for order ${newOrder.reference} was successful.`,
          };

    addNotification({
      type: "Order",
      ...buyerMessage,
      recipientEmail: currentUser?.email,
    });

    clearCart();
    saveAppliedCoupon(null);

    navigate("/checkout/confirmation", {
      state: { reference: newOrder.reference, paymentMethod: method },
    });
  };

  const handlePay = () => {
    if (items.length === 0 || processing) return;
    if (method === "card" && !validateCard()) return;

    // Simulate the gateway taking a moment
    if (method === "payfast" || method === "snapscan") {
      setProcessing(true);
      setTimeout(placeOrder, 1500);
      return;
    }

    placeOrder();
  };

  const headerIcon =
    method === "payfast" ? (
      <img
        src="/payfast-logo.png"
        alt="PayFast"
        className="payment-header-logo"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    ) : method === "eft" ? (
      <FaUniversity />
    ) : method === "snapscan" ? (
      <FaQrcode />
    ) : method === "cod" ? (
      <FaMoneyBillWave />
    ) : (
      <>
        <FaCcVisa />
        <FaCcMastercard />
      </>
    );

  return (
    <>
      <Navbar showLinks={false} />
      <div className="payment-page">
        <p className="step-label">STEP 2 OF 3</p>
        <h2>Secure Payment</h2>

        <CheckoutSteps currentStep={2} />

        <div className="payfast-card">
          <div className="payfast-header">
            <span className="payfast-icon">{headerIcon}</span>
            <div>
              <p className="payfast-title">{info.title}</p>
              <p className="payfast-subtitle">{info.subtitle}</p>
            </div>
            <button
              type="button"
              className="change-method-btn"
              onClick={() => navigate("/checkout")}
            >
              Change
            </button>
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

          {/* ---------- Method-specific step ---------- */}

          {method === "card" && (
            <>
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
            </>
          )}

          {method === "payfast" && (
            <div className="method-panel">
              <p>
                {processing
                  ? "Connecting to PayFast…"
                  : "You'll complete your payment securely through PayFast using a card or Instant EFT."}
              </p>
            </div>
          )}

          {method === "eft" && (
            <div className="method-panel">
              <p className="method-panel-title">Pay into this account</p>
              <div className="bank-details">
                <span>Bank</span><strong>Demo Bank</strong>
                <span>Account name</span><strong>AutoMarket (Pty) Ltd</strong>
                <span>Account number</span><strong>0000 000 000</strong>
                <span>Branch code</span><strong>000000</strong>
                <span>Reference</span><strong>Your order number (shown after placing the order)</strong>
              </div>
              <p className="method-panel-note">
                Your order is confirmed once the payment reflects. Demo details only.
              </p>
            </div>
          )}

          {method === "snapscan" && (
            <div className="method-panel method-panel-center">
              <FaQrcode className="qr-placeholder" />
              <p>
                {processing
                  ? "Checking payment…"
                  : `Scan with SnapScan or Zapper and pay ${formatCurrency(total)}.`}
              </p>
            </div>
          )}

          {method === "cod" && (
            <div className="method-panel">
              <p>
                Please have <strong>{formatCurrency(total)}</strong> ready in cash when the courier
                arrives with your part.
              </p>
            </div>
          )}


          <button
            className="pay-now-btn"
            onClick={handlePay}
            disabled={items.length === 0 || processing}
          >
            {processing ? "Processing…" : `🔒 ${info.button} - ${formatCurrency(total)}`}
          </button>
          <p className="simulated-note">
            Simulated payment for demonstration purposes only
          </p>
        </div>
      </div>
    </>
  );
}