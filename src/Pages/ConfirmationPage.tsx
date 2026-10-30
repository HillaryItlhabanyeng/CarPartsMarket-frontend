import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useOrders } from "../Components/useOrders";
import "./ConfirmationPage.css";

type ConfirmationState = {
  reference?: string;
  paymentMethod?: "payfast" | "card" | "eft" | "snapscan" | "cod";
} | null;

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getOrder } = useOrders();

  const state = location.state as ConfirmationState;
  const reference = state?.reference;
  const paymentMethod = state?.paymentMethod;
  const order = reference ? getOrder(reference) : undefined;

  // EFT and cash on delivery haven't been paid yet
  const awaitingPayment = paymentMethod === "eft" || paymentMethod === "cod";

  const formatCurrency = (value: number) => `R${value.toFixed(2)}`;

  if (!order) {
    return (
      <>
        <Navbar showLinks={false} />
        <div className="confirmation-page">
          <div className="confirmation-card">
            <p>We couldn't find that order.</p>
            <button className="continue-shopping-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  const subtext =
    paymentMethod === "eft"
      ? `Pay ${formatCurrency(order.total)} by EFT using reference ${order.reference}. We'll process your order once the payment reflects.`
      : paymentMethod === "cod"
      ? `Please have ${formatCurrency(order.total)} ready in cash when your part arrives.`
      : "We've received your order and will process it shortly";

  return (
    <>
      <Navbar showLinks={false} />
      <div className="confirmation-page">
        <div className="confirmation-card">
          <div className="success-icon">
            <span className="checkmark">✓</span>
          </div>
          <p className="payment-confirmed-label">
            {awaitingPayment ? "ORDER PLACED" : "PAYMENT CONFIRMED"}
          </p>
          <h2>Order Placed!</h2>
          <p className="confirmation-subtext">{subtext}</p>

          {paymentMethod === "eft" && (
            <div className="eft-details-box">
              <p className="eft-details-title">Pay into this account</p>
              <div className="eft-details-grid">
                <span>Bank</span><strong>Demo Bank</strong>
                <span>Account name</span><strong>AutoMarket (Pty) Ltd</strong>
                <span>Account number</span><strong>0000 000 000</strong>
                <span>Branch code</span><strong>000000</strong>
                <span>Reference</span><strong>{order.reference}</strong>
              </div>
            </div>
          )}

          <div className="order-details-box">
            <div className="reference-row">
              <span className="reference-label">REFERENCE</span>
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {awaitingPayment ? "AWAITING PAYMENT" : order.status}
              </span>
            </div>
            <p className="reference-number">{order.reference}</p>

            {order.items.map((item, i) => (
              <div key={i} className="confirmation-item">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                <div className="confirmation-item-info">
                  <p className="item-name">{item.name}</p>
                  {item.category && <p className="item-specs">{item.category}</p>}
                  <p className="item-extra">Qty: {item.quantity}</p>
                </div>
                <span className="item-price">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>

            {order.discount !== undefined && order.discount > 0 && (
              <div className="summary-row">
                <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                <span style={{ color: "#2e7d4f", fontWeight: 600 }}>
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}

            <div className="summary-row total">
              <span>{awaitingPayment ? "Amount Due" : "Total Paid"}</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              className="track-order-btn"
              onClick={() => navigate(`/orders/${order.reference}`)}
            >
              Track Order
            </button>
            <button className="continue-shopping-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}