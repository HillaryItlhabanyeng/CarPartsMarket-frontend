import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./AccountPage.css";

type Order = {
  reference: string;
  status: string;
  date: string;
  itemCount: number;
  fulfillment: string;
  total: number;
};

export default function AccountPage() {
  const navigate = useNavigate();

  const orders: Order[] = [
    {
      reference: "FR-78TRFGDUN3452",
      status: "PENDING",
      date: "12 May 2026, 22:34",
      itemCount: 1,
      fulfillment: "Delivery",
      total: 3699.0,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="account-page">
        <p className="breadcrumb">Your Account</p>
        <h2>My Orders</h2>

        <div className="orders-list">
          {orders.map((order, i) => (
            <div key={i} className="order-card">
              <div className="order-card-header">
                <span className="order-reference-label">ORDER REFERENCE</span>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p className="order-reference-number">{order.reference}</p>

              <div className="order-info-grid">
                <div>
                  <p className="info-label">DATE</p>
                  <p className="info-value">{order.date}</p>
                </div>
                <div>
                  <p className="info-label">ITEMS</p>
                  <p className="info-value">{order.itemCount}</p>
                </div>
                <div>
                  <p className="info-label">FULLFILLMENT</p>
                  <p className="info-value">{order.fulfillment}</p>
                </div>
                <div>
                  <p className="info-label">FULLFILLMENT</p>
                  <p className="info-value price">R {order.total.toFixed(2)}</p>
                </div>
              </div>

              <button
                className="view-details-btn"
                onClick={() => navigate(`/account/orders/${order.reference}`)}
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}