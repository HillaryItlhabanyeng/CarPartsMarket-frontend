export type NotificationType = "Order" | "Message" | "System" | "Listing";

export const ADMIN_NOTIFICATION_EMAIL = "admin@automarket.local";

export type MarketplaceNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  recipientEmail?: string;
};

const NOTIFICATIONS_STORAGE_KEY = "marketplace_notifications";

const readNotifications = (): MarketplaceNotification[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getCurrentUser = (): { name?: string; email?: string; role?: string } | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem("marketplace_current_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getNotificationsForCurrentUser = () => {
  const currentUser = getCurrentUser();
  const notifications = readNotifications();

  if (!currentUser?.email) return notifications;
  return notifications.filter(
    (notification) =>
      !notification.recipientEmail ||
      notification.recipientEmail.toLowerCase() === currentUser.email?.toLowerCase()
  );
};

export const getNotificationsForRecipient = (recipientEmail: string) => {
  const normalizedEmail = recipientEmail.toLowerCase();
  return readNotifications().filter(
    (notification) => notification.recipientEmail?.toLowerCase() === normalizedEmail
  );
};

export const addNotification = (
  notification: Omit<MarketplaceNotification, "id" | "timestamp" | "read">
) => {
  if (typeof window === "undefined") return;

  const nextNotification: MarketplaceNotification = {
    ...notification,
    id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toLocaleString("en-ZA", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  };

  window.localStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify([nextNotification, ...readNotifications()])
  );
  window.dispatchEvent(new Event("marketplace-notifications-updated"));
};

export const saveNotifications = (notifications: MarketplaceNotification[]) => {
  const currentUser = getCurrentUser();
  const allNotifications = readNotifications();
  const preservedNotifications = currentUser?.email
    ? allNotifications.filter(
        (notification) =>
          notification.recipientEmail &&
          notification.recipientEmail.toLowerCase() !== currentUser.email?.toLowerCase()
      )
    : [];

  window.localStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify([...notifications, ...preservedNotifications])
  );
  window.dispatchEvent(new Event("marketplace-notifications-updated"));
};

// Newest first. Ids look like "notification-<timestamp>-<random>", which sorts reliably
// (the display timestamp is a formatted string that doesn't).
const createdAt = (notification: MarketplaceNotification) =>
  Number(notification.id.split("-")[1]) || 0;

// What the notification bell shows: this user's notifications, plus the admin inbox
// (new listing submissions) when the logged-in user is an admin.
export const getBellNotifications = (): MarketplaceNotification[] => {
  const user = getCurrentUser();
  if (!user?.email) return [];

  const mine = getNotificationsForCurrentUser();
  const isAdmin = user.role?.toLowerCase() === "admin";
  const combined = isAdmin
    ? [...mine, ...getNotificationsForRecipient(ADMIN_NOTIFICATION_EMAIL)]
    : mine;

  const unique = new Map(combined.map((notification) => [notification.id, notification]));
  return Array.from(unique.values()).sort((a, b) => createdAt(b) - createdAt(a));
};

// Marks the given notifications as read (works on the whole store, so it also covers the admin inbox)
export const markNotificationsRead = (ids: string[]) => {
  if (typeof window === "undefined" || ids.length === 0) return;

  const wanted = new Set(ids);
  const next = readNotifications().map((notification) =>
    wanted.has(notification.id) ? { ...notification, read: true } : notification
  );

  window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("marketplace-notifications-updated"));
};
