import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useOrders } from "../Components/useOrders";
import { addNotification } from "../Components/notificationStore";
import "./OrderDetailPage.css";

// NEW: who is viewing this order
function readCurrentUser(): { email?: string; role?: string } | null {
  try {
    const raw = localStorage.getItem("marketplace_current_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function OrderDetailPage() {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const { getOrder, markOrderShipped } = useOrders();

  const order = reference ? getOrder(reference) : undefined;
  const formatCurrency = (value: number) => `R${value.toFixed(2)}`;

  const handleMarkAsShipped = () => {
    if (!order || order.status === "SHIPPED") return;
    markOrderShipped(order.reference);

    addNotification({
      type: "Order",
      title: "Your car-part order has shipped",
      body: `Order ${order.reference} is on its way to you.`,
      recipientEmail: order.buyerEmail,
    });
  };

  if (!order) {
    return (
      <div className="order-detail-page">
        <Navbar />
        <div className="order-detail-empty">
          <p>We couldn't find that order.</p>
          <button className="back-to-buying-btn" onClick={() => navigate("/buying")}>
            Back to Buying
          </button>
        </div>
      </div>
    );
  }

  // NEW: only the seller (or an admin) can mark the order as shipped, never the buyer
  const currentUser = readCurrentUser();
  const email = currentUser?.email?.trim().toLowerCase() ?? "";
  const role = currentUser?.role?.toLowerCase() ?? "";
  const isBuyerOfOrder = !!email && order.buyerEmail?.toLowerCase() === email;
  const sellsItemInOrder = order.items.some(
    (item) => item.sellerEmail?.toLowerCase() === email
  );
  const canMarkShipped =
    !isBuyerOfOrder && (sellsItemInOrder || role === "seller" || role === "admin");

  return (
    <div className="order-detail-page">
      <Navbar />

      <div className="order-detail-header">
        <button className="order-back-btn" onClick={() => navigate("/buying")}>
          ‹ Back to Buying
        </button>
        <h1>Order Details</h1>
      </div>

      <div className="order-detail-card">
        <div className="order-detail-top">
          <div>
            <span className="order-detail-label">ORDER REFERENCE</span>
            <p className="order-detail-reference">{order.reference}</p>
            <p className="order-detail-date">{order.date}</p>
          </div>
          <span className={`order-detail-status ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>

        <div className="order-detail-items">
          {order.items.map((item) => (
            <div className="order-detail-item" key={item.id}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
              <div className="order-detail-item-info">
                <p className="order-detail-item-name">{item.name}</p>
                <p className="order-detail-item-qty">Qty: {item.quantity}</p>
              </div>
              <span className="order-detail-item-price">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="order-detail-summary">
          <div className="order-detail-row">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="order-detail-row">
            <span>Delivery</span>
            <span>{formatCurrency(order.deliveryFee)}</span>
          </div>

          {/* NEW: discount from a coupon */}
          {order.discount !== undefined && order.discount > 0 && (
            <div className="order-detail-row">
              <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
              <span className="order-detail-discount">-{formatCurrency(order.discount)}</span>
            </div>
          )}

          <div className="order-detail-row total">
            <span>Total Paid</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* CHANGED: sellers/admins only, with its own class */}
        {canMarkShipped && order.status !== "SHIPPED" && order.status !== "DELIVERED" && (
          <button className="mark-shipped-btn" onClick={handleMarkAsShipped}>
            Mark order as shipped
          </button>
        )}
      </div>
    </div>
  );
}