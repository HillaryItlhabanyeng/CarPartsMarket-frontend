import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import {
  getNotificationsForCurrentUser,
  saveNotifications,
  type MarketplaceNotification,
  type NotificationType,
} from "../Components/notificationStore";
import "./NotificationsPage.css";

const typeIcons: Record<NotificationType, string> = {
  Order: "📦",
  Message: "💬",
  System: "🔔",
  Listing: "❤️",
};

const filters: ("All" | "Unread" | NotificationType)[] = [
  "All",
  "Unread",
  "Order",
  "Message",
  "Listing",
  "System",
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<MarketplaceNotification[]>(() => {
    return getNotificationsForCurrentUser();
  });
  const [toast, setToast] = useState<MarketplaceNotification | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Unread" | NotificationType
  >("All");

  const visibleNotifications = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const refreshNotifications = () => {
      const nextNotifications = getNotificationsForCurrentUser();
      if (nextNotifications.length > notifications.length) {
        setToast(nextNotifications[0]);
        window.setTimeout(() => setToast(null), 4500);
      }
      setNotifications(nextNotifications);
    };

    window.addEventListener("marketplace-notifications-updated", refreshNotifications);
    window.addEventListener("storage", refreshNotifications);
    return () => {
      window.removeEventListener("marketplace-notifications-updated", refreshNotifications);
      window.removeEventListener("storage", refreshNotifications);
    };
  }, [notifications.length]);

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(next);
      return next;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(next);
      return next;
    });
  };

  return (
    <div className="nt-page">
      <Navbar />

      {toast && (
        <div className="nt-toast" role="status">
          <strong>{toast.title}</strong>
          <span>{toast.body}</span>
        </div>
      )}

      <div className="nt-page-header">
        <div>
          <h1>Notifications</h1>
          <p>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="nt-mark-all-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="nt-filter-bar">
        {filters.map((f) => (
          <button
            key={f}
            className={
              activeFilter === f ? "nt-filter-chip nt-active" : "nt-filter-chip"
            }
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="nt-list">
        {visibleNotifications.map((n) => (
          <div
            className={`nt-card ${n.read ? "" : "nt-unread"}`}
            key={n.id}
            onClick={() => markAsRead(n.id)}
          >
            <span className="nt-icon">{typeIcons[n.type]}</span>

            <div className="nt-content">
              <div className="nt-content-top">
                <h4 className="nt-title">{n.title}</h4>
                {!n.read && <span className="nt-dot" />}
              </div>
              <p className="nt-body">{n.body}</p>
              <span className="nt-time">{n.timestamp}</span>
            </div>
          </div>
        ))}

        {visibleNotifications.length === 0 && (
          <div className="nt-empty">
            <p>Nothing here right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}