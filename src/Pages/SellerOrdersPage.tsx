import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaCog, FaMoneyBillWave, FaShoppingBag, FaTruck } from "react-icons/fa";

import SideNavigation from "../Components/SideNavigation";
import UserInitialsBadge from "../Components/UserInitialsBadge";
import NotificationBell from "../Components/NotificationBell";
import { getCurrentUser } from "../Components/notificationStore";
import { getSellerOrderRows } from "../Components/sellerOrders";
import { useOrders } from "../Components/useOrders";
import type { Order } from "../Components/OrdersContext.types";

import "../Components/DashboardShell.css";
import "./SellerOrdersPage.css";

type StatusFilter = "All" | Order["status"];

const statusFilters: StatusFilter[] = ["All", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusLabel = (status: string) => status.charAt(0) + status.slice(1).toLowerCase();
const formatCurrency = (value: number) => `R${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Seller side: the orders buyers have placed for this seller's items.
export default function SellerOrdersPage() {
  const navigate = useNavigate();
  const { orders, markOrderShipped } = useOrders();
  const currentUser = getCurrentUser();

  const rows = useMemo(() => getSellerOrderRows(orders, currentUser), [orders, currentUser]);
  const [filter, setFilter] = useState<StatusFilter>("All");
  const visible = rows.filter((row) => filter === "All" || row.status === filter);

  const countIn = (...statuses: Order["status"][]) =>
    rows.filter((row) => statuses.includes(row.status)).length;
  const earnings = rows
    .filter((row) => row.status !== "CANCELLED")
    .reduce((sum, row) => sum + row.subtotal, 0);

  const stats = [
    { label: "Orders Received", value: rows.length, icon: <FaShoppingBag /> },
    { label: "Awaiting Shipping", value: countIn("PENDING", "PAID"), icon: <FaClock /> },
    { label: "Shipped / Delivered", value: countIn("SHIPPED", "DELIVERED"), icon: <FaTruck /> },
    { label: "Earnings", value: formatCurrency(earnings), icon: <FaMoneyBillWave /> },
  ];

  return (
    <div className="dash-app-container">
      <SideNavigation />

      <main className="dash-main-content">
        <header className="dash-top-header">
          <div className="dash-header-left">
            <h1>Orders Received</h1>
            <p>Orders buyers have placed for the items you sell at AutoMarket</p>
          </div>
          <div className="dash-header-right">
            <NotificationBell />
            <FaCog className="dash-settings" onClick={() => navigate("/settings")} />
            <UserInitialsBadge />
          </div>
        </header>

        <div className="dash-scrollable-area">
          <div className="so-stats">
            {stats.map((stat) => (
              <div className="so-stat" key={stat.label}>
                <div className="so-stat-icon">{stat.icon}</div>
                <div className="so-stat-info">
                  <span className="so-stat-value">{stat.value}</span>
                  <span className="so-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="so-tabs">
            {statusFilters.map((item) => (
              <button
                type="button"
                key={item}
                className={`so-tab ${filter === item ? "active" : ""}`}
                onClick={() => setFilter(item)}
              >
                {item === "All" ? "All" : statusLabel(item)}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="dash-card so-empty">
              {rows.length === 0
                ? "No orders yet. When a buyer orders one of your items, it will appear here."
                : `No ${statusLabel(filter).toLowerCase()} orders to show.`}
            </div>
          ) : (
            <div className="so-list">
              {visible.map((row) => {
                const status = row.status;

                return (
                  <article className="dash-card so-order" key={row.reference}>
                    <div className="so-order-head">
                      <div>
                        <span className="so-ref">{row.reference}</span>
                        <p className="so-date">{row.date}</p>
                      </div>
                      <span className={`so-status so-status-${status.toLowerCase()}`}>{statusLabel(status)}</span>
                    </div>

                    <p className="so-buyer">
                      Buyer: <strong>{row.buyer}</strong>
                    </p>

                    {row.items.map((item) => (
                      <div className="so-item" key={item.id}>
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                        <div className="so-item-info">
                          <p className="so-item-name">{item.name}</p>
                          <p className="so-item-meta">
                            Qty: {item.quantity}
                            {item.category ? ` · ${item.category}` : ""}
                          </p>
                        </div>
                        <span className="so-item-price">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}

                    <div className="so-order-foot">
                      <span>
                        Your total <strong>{formatCurrency(row.subtotal)}</strong>
                      </span>
                      {(status === "PENDING" || status === "PAID") && (
                        <button type="button" className="so-ship-btn" onClick={() => markOrderShipped(row.reference)}>
                          <FaTruck /> Mark as shipped
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
