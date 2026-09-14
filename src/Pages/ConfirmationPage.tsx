import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useOrders } from "../Components/useOrders";
import "./ConfirmationPage.css";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getOrder } = useOrders();

  const reference = (location.state as { reference?: string } | null)?.reference;
  const order = reference ? getOrder(reference) : undefined;

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

  return (
    <>
      <Navbar showLinks={false} />
      <div className="confirmation-page">
        <div className="confirmation-card">
          <div className="success-icon">
            <span className="checkmark">✓</span>
          </div>
          <p className="payment-confirmed-label">PAYMENT CONFIRMED</p>
          <h2>Order Placed!</h2>
          <p className="confirmation-subtext">
            We've received your order and will process it shortly
          </p>

          <div className="order-details-box">
            <div className="reference-row">
              <span className="reference-label">REFERENCE</span>
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status}
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
            <div className="summary-row total">
              <span>Total Paid</span>
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