import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClock, FaCog, FaHistory, FaSearch, FaShoppingBag, FaTrashAlt } from "react-icons/fa";

import SideNavigation from "../Components/SideNavigation";
import UserInitialsBadge from "../Components/UserInitialsBadge";
import NotificationBell from "../Components/NotificationBell";
import { clearHistory, getHistory, type HistoryPart } from "../Components/historyStore";
import { findLiveListing, toDetailsProduct } from "../Components/marketListings";
import { getCurrentUser } from "../Components/notificationStore";
import { useOrders } from "../Components/useOrders";
import "../Components/DashboardShell.css";
import "./HistoryPage.css";

const formatDateTime = (date: string) => {
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? "Date unavailable" : value.toLocaleString("en-ZA", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const [history, setHistory] = useState(getHistory);
  const [unavailableId, setUnavailableId] = useState<string | null>(null);
  const email = getCurrentUser()?.email?.toLowerCase();
  const previousOrders = orders.filter((order) => !email || order.buyerEmail?.toLowerCase() === email);

  const openPart = (part: HistoryPart) => {
    const listing = findLiveListing(part.id);
    if (!listing) {
      setUnavailableId(part.id);
      return;
    }
    navigate(`/product/${listing.id}`, { state: { product: toDetailsProduct(listing) } });
  };

  const handleClear = () => {
    if (!window.confirm("Are you sure you want to clear your history? You won't be able to recover your history after this.")) return;
    clearHistory();
    setHistory({ parts: [], searches: [] });
    setUnavailableId(null);
  };

  return (
    <div className="dash-app-container">
      <SideNavigation />
      <main className="dash-main-content">
        <header className="dash-top-header">
          <div className="dash-header-left"><h1>History</h1><p>Review searched parts and previous orders.</p></div>
          <div className="dash-header-right"><NotificationBell /><FaCog className="dash-settings" onClick={() => navigate("/settings")} /><UserInitialsBadge /></div>
        </header>

        <div className="dash-scrollable-area history-page">
          <div className="history-heading">
            <div><span className="history-kicker"><FaHistory /> ACTIVITY</span><h2>Your marketplace history</h2><p>Items you opened, searches you made, and orders you placed are kept here.</p></div>
            <button type="button" className="history-clear" onClick={handleClear} disabled={!history.parts.length && !history.searches.length}><FaTrashAlt /> Clear history</button>
          </div>

          <section className="dash-card history-card">
            <div className="history-card-title"><FaBoxOpen /><div><h3>Parts viewed</h3><p>Full details are saved with the date and time you viewed each part.</p></div></div>
            {history.parts.length === 0 ? <div className="history-empty">No parts have been viewed yet. Browse the marketplace to build your history.</div> : <div className="history-parts">
              {history.parts.map((part) => <div className="history-part" key={part.id}>
                <div className="history-image">{part.image ? <img src={part.image} alt="" /> : <FaBoxOpen />}</div>
                <div className="history-part-copy"><span className="history-category">{part.category || "Car part"}</span><h4>{part.title}</h4><p>{part.brand || "Brand not listed"}{part.condition ? ` · ${part.condition}` : ""}{part.location ? ` · ${part.location}` : ""}</p><span className="history-meta"><FaClock /> Viewed {formatDateTime(part.searchedAt)}</span></div>
                <div className="history-part-action"><strong>R{Number(part.price).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</strong><button type="button" onClick={() => openPart(part)}>View listing</button>{unavailableId === part.id && <span className="history-unavailable">This item is no longer available.</span>}</div>
              </div>)}
            </div>}
          </section>

          <section className="dash-card history-card">
            <div className="history-card-title"><FaSearch /><div><h3>Recent searches</h3><p>Your latest marketplace search terms.</p></div></div>
            {history.searches.length === 0 ? <div className="history-empty">No searches have been saved yet.</div> : <div className="history-searches">{history.searches.map((search) => <button type="button" key={search.id} onClick={() => navigate(`/shop?search=${encodeURIComponent(search.query)}`)}><span>{search.query}</span><small>{formatDateTime(search.searchedAt)}</small></button>)}</div>}
          </section>

          <section className="dash-card history-card">
            <div className="history-card-title"><FaShoppingBag /><div><h3>Previous orders</h3><p>Your completed and in-progress purchases.</p></div></div>
            {previousOrders.length === 0 ? <div className="history-empty">You have not placed any orders yet.</div> : <div className="history-orders">{previousOrders.map((order) => <button type="button" key={order.reference} onClick={() => navigate(`/orders/${order.reference}`)}><div><strong>{order.reference}</strong><span>{order.items.map((item) => `${item.name} ×${item.quantity}`).join(", ")}</span></div><div><em className={`history-status ${order.status.toLowerCase()}`}>{order.status}</em><span>{order.date} · R{order.total.toFixed(2)}</span></div></button>)}</div>}
          </section>
        </div>
      </main>
    </div>
  );
}
