import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SideNavigation from "../Components/SideNavigation";
import UserInitialsBadge from "../Components/UserInitialsBadge";
import NotificationBell from "../Components/NotificationBell";
import { getSellerOrderRows } from "../Components/sellerOrders";
import { useOrders } from "../Components/useOrders";
import { useSaved } from "../Components/useSaved";
import api from "../api/axiosInstance";

import "../Components/DashboardShell.css";
import "./DashboardPage.css";

import {
  FaCog,
  FaBoxOpen,
  FaClock,
  FaShoppingBag,
  FaHeart,
  FaMapMarkerAlt,
  FaPlus,
  FaTruck,
  FaCheckCircle,
  FaWallet,
} from "react-icons/fa";

type CurrentUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

type PendingProduct = {
  id: number;
  sellerEmail?: string;
  sold?: boolean;
};

// What the backend returns for /carparts/seller/{id}
type BackendCarPart = {
  carPartId?: string;
  status?: string | null;
};

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const formatCurrency = (value: number) =>
  `R${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function DashboardPage() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { savedItems } = useSaved();

  const currentUser = readFromStorage<CurrentUser | null>(
    "marketplace_current_user",
    null
  );
  const isSeller = currentUser?.role?.toLowerCase() === "seller";
  const sellerId = currentUser?.id;

  // Listings saved in the backend
  const [myParts, setMyParts] = useState<BackendCarPart[]>([]);

  useEffect(() => {
    if (!sellerId) return;
    let cancelled = false;

    api
      .get<BackendCarPart[]>(`/carparts/seller/${sellerId}`)
      .then((res) => {
        if (!cancelled) setMyParts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Could not load your listings:", err));

    return () => {
      cancelled = true;
    };
  }, [sellerId]);

  // Older listings that were saved in the browser
  const pendingProducts = readFromStorage<PendingProduct[]>("marketplace_pending_products", []);
  const approvedProducts = readFromStorage<PendingProduct[]>("marketplace_approved_products", []);

  const email = currentUser?.email?.toLowerCase();
  const isMine = (product: PendingProduct) =>
    !email || product.sellerEmail?.toLowerCase() === email;
  const myLocalPending = pendingProducts.filter(isMine);
  const myLocalApproved = approvedProducts.filter(isMine).filter((product) => !product.sold);

  const hasStatus = (part: BackendCarPart, status: string) =>
    (part.status ?? "").toUpperCase() === status;

  const activeCount =
    myParts.filter((p) => hasStatus(p, "APPROVED")).length + myLocalApproved.length;
  const pendingCount =
    myParts.filter((p) => hasStatus(p, "PENDING")).length + myLocalPending.length;

  // Orders containing this seller's parts
  const sellerRows = isSeller ? getSellerOrderRows(orders, currentUser) : [];
  const toShipCount = sellerRows.filter((r) => r.status === "PENDING" || r.status === "PAID").length;
  const shippedCount = sellerRows.filter((r) => r.status === "SHIPPED" || r.status === "DELIVERED").length;
  const earnings = sellerRows
    .filter((r) => r.status !== "CANCELLED")
    .reduce((sum, r) => sum + r.subtotal, 0);

  const stats = isSeller
    ? [
        { label: "Active Listings", value: activeCount, icon: <FaBoxOpen />, onClick: () => navigate("/my-listings") },
        { label: "Pending Approval", value: pendingCount, icon: <FaClock />, onClick: () => navigate("/my-listings") },
        { label: "Orders Received", value: sellerRows.length, icon: <FaShoppingBag />, onClick: () => navigate("/seller-orders") },
        { label: "To Ship", value: toShipCount, icon: <FaTruck />, onClick: () => navigate("/seller-orders") },
        { label: "Shipped", value: shippedCount, icon: <FaCheckCircle />, onClick: () => navigate("/seller-orders") },
        { label: "Earnings", value: formatCurrency(earnings), icon: <FaWallet />, onClick: () => navigate("/seller-orders") },
      ]
    : [
        { label: "Active Listings", value: activeCount, icon: <FaBoxOpen />, onClick: () => navigate("/my-listings") },
        { label: "Pending Approval", value: pendingCount, icon: <FaClock />, onClick: () => navigate("/my-listings") },
        {
          label: "My Orders",
          value: orders.filter((order) => order.buyerEmail?.toLowerCase() === email).length,
          icon: <FaShoppingBag />,
          onClick: () => navigate("/orders"),
        },
        { label: "Wishlist", value: savedItems.length, icon: <FaHeart />, onClick: () => navigate("/wishlist") },
      ];

  const quickActions = [
    { label: "List a Product", onClick: () => navigate("/list-product") },
    { label: "View My Listings", onClick: () => navigate("/my-listings") },
    isSeller
      ? { label: "Orders Received", onClick: () => navigate("/seller-orders") }
      : { label: "My Orders", onClick: () => navigate("/orders") },
    ...(isSeller ? [] : [{ label: "Wishlist", onClick: () => navigate("/wishlist") }]),
    { label: "Addresses", onClick: () => navigate("/addresses") },
    { label: "Settings", onClick: () => navigate("/settings") },
  ];

  return (
    <div className="dash-app-container">
      <SideNavigation />

      <main className="dash-main-content">
        <header className="dash-top-header">
          <div className="dash-header-left">
            <h1>Dashboard</h1>
            <p>Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}</p>
          </div>
          <div className="dash-header-right">
            <NotificationBell />
            <FaCog className="dash-settings" onClick={() => navigate("/settings")} />
            <UserInitialsBadge />
          </div>
        </header>

        <div className="dash-scrollable-area">
          <div className="dash-stats-grid">
            {stats.map((stat) => (
              <button
                type="button"
                className="dash-stat-card"
                key={stat.label}
                onClick={stat.onClick}
              >
                <div className="dash-stat-icon">{stat.icon}</div>
                <div className="dash-stat-info">
                  <span className="dash-stat-value">{stat.value}</span>
                  <span className="dash-stat-label">{stat.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="dash-card dash-quick-actions">
            <h3 className="dash-card-title">Quick Actions</h3>
            <div className="dash-actions-row">
              <button
                type="button"
                className="dash-primary-action"
                onClick={() => navigate("/list-product")}
              >
                <FaPlus /> List a Product
              </button>
              {quickActions.slice(1).map((action) => (
                <button
                  type="button"
                  className="dash-secondary-action"
                  key={action.label}
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title">Account</h3>
            <div className="dash-account-row">
              <FaMapMarkerAlt className="dash-account-icon" />
              <div>
                <p className="dash-account-name">{currentUser?.name ?? "Guest"}</p>
                <p className="dash-account-email">{currentUser?.email ?? "Not signed in"}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;