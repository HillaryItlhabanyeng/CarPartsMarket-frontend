import { useState } from "react";
import Navbar from "../Components/Navbar";
import "./NotificationsPage.css";

type NotificationType = "Order" | "Message" | "System" | "Listing";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "Order",
    title: "Your order FR-78TRFGDUN3452 is confirmed",
    body: "PROLINE INTEL CELERON — delivery to Bellville Campus.",
    timestamp: "10 minutes ago",
    read: false,
  },
  {
    id: "n2",
    type: "Message",
    title: "New message from Naledi M.",
    body: "\"Hey, is the desk still available?\"",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    type: "Listing",
    title: "Your listing got a new favorite",
    body: "Bugani FreeBuds B20 Wireless Earbuds was saved by another student.",
    timestamp: "3 hours ago",
    read: false,
  },
  {
    id: "n4",
    type: "System",
    title: "Verify your student email",
    body: "Verified accounts get priority placement on the marketplace.",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    type: "Order",
    title: "Payment received",
    body: "R40.00 for A4 Counter Books - 3 Quire.",
    timestamp: "2 days ago",
    read: true,
  },
];

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
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications
  );
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Unread" | NotificationType
  >("All");

  const visibleNotifications = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="nt-page">
      <Navbar />

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