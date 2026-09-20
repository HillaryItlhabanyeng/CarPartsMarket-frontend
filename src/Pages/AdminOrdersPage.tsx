import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaMoneyBillWave, FaShoppingBag, FaTruck } from "react-icons/fa";

import AdminShell from "../Components/AdminShell";
import { formatRand } from "../Components/adminStore";
import { useOrders } from "../Components/useOrders";
import type { Order } from "../Components/OrdersContext.types";

type StatusFilter = "All" | Order["status"];

const statusFilters: StatusFilter[] = ["All", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusLabel = (status: string) => status.charAt(0) + status.slice(1).toLowerCase();

// Every order placed on the marketplace, with the status controls an admin needs.
export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { orders, markOrderShipped } = useOrders();

  const [filter, setFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");

  const countIn = (...statuses: Order["status"][]) =>
    orders.filter((order) => statuses.includes(order.status)).length;

  // Cancelled orders don't count towards revenue
  const revenue = orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: <FaShoppingBag /> },
    { label: "Revenue", value: formatRand(revenue), icon: <FaMoneyBillWave /> },
    { label: "Awaiting Shipping", value: countIn("PENDING", "PAID"), icon: <FaClock /> },
    { label: "Shipped / Delivered", value: countIn("SHIPPED", "DELIVERED"), icon: <FaTruck /> },
  ];

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesFilter = filter === "All" || order.status === filter;
      const matchesSearch =
        !query ||
        `${order.reference} ${order.buyerEmail ?? ""} ${order.items.map((item) => item.name).join(" ")}`
          .toLowerCase()
          .includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  return (
    <AdminShell title="Orders" subtitle="Track every order placed on AutoMarket">
      <div className="adm-stats">
        {stats.map((stat) => (
          <div className="adm-stat" key={stat.label}>
            <div className="adm-stat-icon">{stat.icon}</div>
            <div className="adm-stat-info">
              <span className="adm-stat-value">{stat.value}</span>
              <span className="adm-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-card">
        <div className="adm-toolbar">
          <div className="adm-tabs">
            {statusFilters.map((item) => (
              <button
                type="button"
                key={item}
                className={`adm-tab ${filter === item ? "active" : ""}`}
                onClick={() => setFilter(item)}
              >
                {item === "All" ? "All" : statusLabel(item)}
              </button>
            ))}
          </div>

          <input
            className="adm-input"
            type="text"
            placeholder="Search reference, buyer or item"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {visible.length === 0 ? (
          <div className="adm-empty">
            {orders.length === 0 ? "No orders have been placed yet." : "No orders match your filters."}
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Buyer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => (
                  <tr key={order.reference}>
                    <td>
                      <button
                        type="button"
                        className="adm-ref"
                        onClick={() => navigate(`/orders/${order.reference}`)}
                      >
                        {order.reference}
                      </button>
                    </td>
                    <td>{order.date}</td>
                    <td>{order.buyerEmail || "Guest"}</td>
                    <td>
                      {order.items[0]?.name}
                      {order.items.length > 1 && <small>+{order.items.length - 1} more</small>}
                    </td>
                    <td>{formatRand(order.total)}</td>
                    <td>
                      <span className={`adm-pill adm-pill-${order.status.toLowerCase()}`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      {(order.status === "PENDING" || order.status === "PAID") && (
                        <button
                          type="button"
                          className="adm-btn adm-btn-secondary"
                          onClick={() => markOrderShipped(order.reference)}
                        >
                          <FaTruck /> Mark shipped
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
