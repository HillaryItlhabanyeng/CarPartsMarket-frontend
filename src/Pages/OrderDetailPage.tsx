import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useOrders } from "../Components/useOrders";
import { addNotification } from "../Components/notificationStore";
import "./OrderDetailPage.css";

// Who is viewing this order
function readCurrentUser(): { id?: string; email?: string; role?: string } | null {
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
  const { getOrder, markOrderShipped, loading } = useOrders();

  const order = reference ? getOrder(reference) : undefined;
  const formatCurrency = (value: number) => `R${value.toFixed(2)}`;

  const handleMarkAsShipped = async () => {
    if (!order || order.status === "SHIPPED") return;

    const shipped = await markOrderShipped(order.reference);
    if (!shipped) {
      alert("Could not mark this order as shipped. Please try again.");
      return;
    }

    addNotification({
      type: "Order",
      title: "Your car-part order has shipped",
      body: `Order ${order.reference} is on its way to you.`,
      recipientEmail: order.buyerEmail,
    });
  };

  // Still loading orders from the server
  if (!order && loading) {
    return (
      <div className="order-detail-page">
        <Navbar />
        <div className="order-detail-empty">
          <p>Loading order...</p>
        </div>
      </div>
    );
  }

  // Finished loading, but this order isn't one the user can see
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

  // Only a seller of an item in this order (or an admin) can mark it shipped
  const currentUser = readCurrentUser();
  const userId = currentUser?.id ?? "";
  const role = currentUser?.role?.toLowerCase() ?? "";
  const sellsItemInOrder = !!userId && order.items.some((item) => item.seller === userId);
  const canMarkShipped =(role == "seller" && sellsItemInOrder)  || role === "admin";

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

          {order.discount !== undefined && order.discount > 0 && (
            <div className="order-detail-row">
              <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
              <span className="order-detail-discount">-{formatCurrency(order.discount)}</span>
            </div>
          )}

          <div className="order-detail-row total">
            <span>{order.status === "PENDING" ? "Amount Due" : "Total Paid"}</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        {canMarkShipped && order.status !== "SHIPPED" && order.status !== "DELIVERED" && (
          <button className="mark-shipped-btn" onClick={handleMarkAsShipped}>
            Mark order as shipped
          </button>
        )}
      </div>
    </div>
  );
}