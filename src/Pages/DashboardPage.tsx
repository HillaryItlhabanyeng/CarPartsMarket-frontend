import { useNavigate } from "react-router-dom";

import SideNavigation from "../Components/SideNavigation";
import UserInitialsBadge from "../Components/UserInitialsBadge";
import NotificationBell from "../Components/NotificationBell";
import { getSellerOrderRows } from "../Components/sellerOrders";
import { useOrders } from "../Components/useOrders";
import { useSaved } from "../Components/useSaved";

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

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function DashboardPage() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { savedItems } = useSaved();

  const currentUser = readFromStorage<CurrentUser | null>(
    "marketplace_current_user",
    null
  );
  const isSeller = currentUser?.role?.toLowerCase() === "seller";
  const pendingProducts = readFromStorage<PendingProduct[]>(
    "marketplace_pending_products",
    []
  );
  const approvedProducts = readFromStorage<PendingProduct[]>(
    "marketplace_approved_products",
    []
  );

  // Only this user's own listings, the same rule the My Listings page uses
  const email = currentUser?.email?.toLowerCase();
  const isMine = (product: PendingProduct) =>
    !email || product.sellerEmail?.toLowerCase() === email;
  const myPending = pendingProducts.filter(isMine);
  // Sold items stay in My Listings as "Sold" but are no longer active
  const myApproved = approvedProducts.filter(isMine).filter((product) => !product.sold);

  const stats = [
    {
      label: "Active Listings",
      value: myApproved.length,
      icon: <FaBoxOpen />,
      onClick: () => navigate("/my-listings"),
    },
    {
      label: "Pending Approval",
      value: myPending.length,
      icon: <FaClock />,
      onClick: () => navigate("/my-listings"),
    },
    // Sellers see the orders buyers placed for their items; buyers see their own purchases
    isSeller
      ? {
          label: "Orders Received",
          value: getSellerOrderRows(orders, currentUser).length,
          icon: <FaShoppingBag />,
          onClick: () => navigate("/seller-orders"),
        }
      : {
          label: "My Orders",
          value: orders.filter((order) => order.buyerEmail?.toLowerCase() === currentUser?.email?.toLowerCase()).length,
          icon: <FaShoppingBag />,
          onClick: () => navigate("/orders"),
        },
    // Wishlists belong to buyers, so sellers don't get one
    ...(isSeller
      ? []
      : [
          {
            label: "Wishlist",
            value: savedItems.length,
            icon: <FaHeart />,
            onClick: () => navigate("/wishlist"),
          },
        ]),
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
