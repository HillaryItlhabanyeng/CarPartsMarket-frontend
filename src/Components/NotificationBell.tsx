import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { FiBell } from "react-icons/fi";

import {
  getBellNotifications,
  getCurrentUser,
  markNotificationsRead,
  type MarketplaceNotification,
  type NotificationType,
} from "./notificationStore";

import "./NotificationBell.css";

const typeIcons: Record<NotificationType, string> = {
  Order: "📦",
  Message: "💬",
  System: "🔔",
  Listing: "❤️",
};

const VISIBLE_COUNT = 8;

// Where clicking a notification should take this user
function targetFor(notification: MarketplaceNotification, role?: string): string | null {
  const isAdmin = role === "admin";
  const isSeller = role === "seller";

  if (notification.type === "Listing") return isAdmin ? "/admin/listings" : "/my-listings";
  if (notification.type === "Order") return isAdmin ? "/admin/orders" : isSeller ? "/seller-orders" : "/orders";
  if (notification.type === "Message") return "/messages";
  return null;
}

type NotificationBellProps = {
  // "icon" is the bell in the dashboard-style headers; "navbar" matches the buyer navbar item
  variant?: "icon" | "navbar";
  // Lets a page keep its own button styling (e.g. Settings)
  triggerClassName?: string;
};

// The bell that opens a pop-up panel of notifications right where you are,
// instead of sending you to another page.
export default function NotificationBell({ variant = "icon", triggerClassName }: NotificationBellProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<MarketplaceNotification[]>(() => getBellNotifications());
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => setNotifications(getBellNotifications());
    window.addEventListener("marketplace-notifications-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("marketplace-notifications-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const unread = notifications.filter((notification) => !notification.read).length;

  const handleItemClick = (notification: MarketplaceNotification) => {
    if (!notification.read) markNotificationsRead([notification.id]);

    const target = targetFor(notification, getCurrentUser()?.role?.toLowerCase());
    setOpen(false);
    if (target) navigate(target);
  };

  const handleMarkAllRead = () => markNotificationsRead(notifications.map((notification) => notification.id));

  const triggerClass = variant === "navbar" ? "nav-action" : (triggerClassName ?? "nb-trigger");

  return (
    <div className={`nb-wrap ${variant === "navbar" ? "nb-wrap-navbar" : ""}`} ref={wrapRef}>
      <button
        type="button"
        className={triggerClass}
        aria-label="Notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
          setShowAll(false);
        }}
      >
        {variant === "navbar" ? (
          <>
            <span className="nav-action-icon-wrapper">
              <FiBell className="action-icon" />
            </span>
            <span className="action-label">Notifications</span>
          </>
        ) : (
          <FaBell />
        )}
      </button>

      {unread > 0 && <span className="nb-badge">{unread > 9 ? "9+" : unread}</span>}

      {open && (
        <div className="nb-panel" role="dialog" aria-label="Notifications">
          <div className="nb-panel-head">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button type="button" className="nb-link" onClick={handleMarkAllRead}>
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="nb-empty">You're all caught up. No notifications yet.</div>
          ) : (
            <ul className="nb-list">
              {(showAll ? notifications : notifications.slice(0, VISIBLE_COUNT)).map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    className={`nb-item ${notification.read ? "" : "nb-unread"}`}
                    onClick={() => handleItemClick(notification)}
                  >
                    <span className="nb-item-icon">{typeIcons[notification.type]}</span>
                    <span className="nb-item-copy">
                      <b>{notification.title}</b>
                      <span>{notification.body}</span>
                      <small>{notification.timestamp}</small>
                    </span>
                    {!notification.read && <span className="nb-unread-dot" aria-label="Unread" />}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Expands the list inside this same pop-up (no page change) */}
          {notifications.length > VISIBLE_COUNT && (
            <button
              type="button"
              className="nb-footer"
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? "Show less" : `View all notifications (${notifications.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
