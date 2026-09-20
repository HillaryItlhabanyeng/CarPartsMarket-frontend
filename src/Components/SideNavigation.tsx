import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiPackage,
  FiMapPin,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiPlusCircle,
  FiClipboard,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";

import "./SideNavigation.css";

type Role = "buyer" | "seller" | "admin";

type CurrentUser = {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  role?: string;
};

const CURRENT_USER_KEY = "marketplace_current_user";

function getStoredUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function normalizeRole(role?: string): Role {
  const normalized = role?.toLowerCase().trim();

  if (normalized === "seller") {
    return "seller";
  }

  if (
    normalized === "admin" ||
    normalized === "administrator"
  ) {
    return "admin";
  }

  return "buyer";
}

function getUserName(user: CurrentUser | null): string {
  if (!user) {
    return "User";
  }

  if (user.name?.trim()) {
    return user.name.trim();
  }

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return fullName || "User";
}

function getInitials(user: CurrentUser | null): string {
  const name = getUserName(user);

  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
}

type SideNavigationProps = {
  // Lets a page force a sidebar (the admin pages always show the admin menu)
  role?: Role;
};

export default function SideNavigation({ role: roleOverride }: SideNavigationProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<CurrentUser | null>(() =>
    getStoredUser()
  );

  const [accountOpen, setAccountOpen] = useState(
    location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/addresses") ||
      location.pathname.startsWith("/settings") ||
      location.pathname.startsWith("/notifications")
  );

  /*
   * The role comes from the logged-in user.
   *
   * Buyer  -> buyer sidebar
   * Seller -> seller sidebar
   * Admin  -> admin sidebar
   */
  const role = roleOverride ?? normalizeRole(user?.role);

  /*
   * Refresh the user if another part of the application
   * updates localStorage.
   */
  useEffect(() => {
    const refreshUser = () => {
      setUser(getStoredUser());
    };

    refreshUser();

    window.addEventListener("storage", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  /*
   * Automatically open My Account when the user is already
   * on one of the account pages.
   *
   * This does NOT navigate the user anywhere.
   */
  useEffect(() => {
    if (
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/addresses") ||
      location.pathname.startsWith("/settings") ||
      location.pathname.startsWith("/notifications")
    ) {
      setAccountOpen(true);
    }
  }, [location.pathname]);

  /*
   * ACTIVE ROUTE
   *
   * Supports nested routes.
   *
   * Example:
   * /orders/123
   * will still highlight /orders.
   */
  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const isSectionActive = (paths: string[]) => {
    return paths.some((path) => isActive(path));
  };

  /*
   * LOGOUT
   */
  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem("automarketUser");
    localStorage.removeItem("marketRole");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    navigate("/login");
  };

  const accountPaths = [
    "/profile",
    "/addresses",
    "/settings",
    "/notifications",
  ];

  const userName = getUserName(user);
  const initials = getInitials(user);

  const roleLabel =
    role === "seller"
      ? "Seller"
      : role === "admin"
        ? "Admin"
        : "Buyer";

  return (
    <aside className="listing-side-nav">

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="listing-side-nav-brand">

        <img
          src="/logoIcon2.png"
          alt="AutoMarket"
          className="listing-side-nav-logo"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <div className="listing-side-nav-brand-name">
          <span className="brand-auto">Auto</span>
          <span className="brand-market">Market</span>
        </div>

      </div>


      {/* =====================================================
          USER
      ===================================================== */}

      <div className="listing-side-nav-user">

        <div className="listing-side-nav-avatar">
          {initials}
        </div>

        <div className="listing-side-nav-user-info">

          <strong>{userName}</strong>

          <span>{roleLabel}</span>

        </div>

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="listing-side-nav-menu">

        {/* =================================================
            BUYER SIDEBAR
        ================================================= */}

        {role === "buyer" && (
          <>

            <div className="listing-nav-section-title">
              MAIN
            </div>

            {/* Dashboard */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/dashboard") ? "active" : ""
              }`}
              onClick={() => navigate("/dashboard")}
            >
              <FiHome className="listing-side-nav-icon" />

              <span>Dashboard</span>
            </button>


            <div className="listing-nav-section-title">
              SHOPPING
            </div>

            {/* Shop */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/shop") ||
                isActive("/marketplace")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/shop")}
            >
              <FiShoppingBag className="listing-side-nav-icon" />

              <span>Shop</span>
            </button>


            {/* My Orders */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/orders") ? "active" : ""
              }`}
              onClick={() => navigate("/orders")}
            >
              <FiClipboard className="listing-side-nav-icon" />

              <span>My Orders</span>
            </button>


            {/* Wishlist */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/wishlist") ? "active" : ""
              }`}
              onClick={() => navigate("/wishlist")}
            >
              <FiHeart className="listing-side-nav-icon" />

              <span>Wishlist</span>
            </button>

          </>
        )}


        {/* =================================================
            SELLER SIDEBAR
        ================================================= */}

        {role === "seller" && (
          <>

            <div className="listing-nav-section-title">
              MAIN
            </div>

            {/* Dashboard */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/dashboard") ? "active" : ""
              }`}
              onClick={() => navigate("/dashboard")}
            >
              <FiHome className="listing-side-nav-icon" />

              <span>Dashboard</span>
            </button>


            <div className="listing-nav-section-title">
              SELLING
            </div>

            {/* Add Listing */}
            <button
              type="button"
              className="listing-side-nav-cta"
              onClick={() => navigate("/list-product")}
            >
              <FiPlusCircle />

              <span>Add Listing</span>
            </button>


            {/* My Listings */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/my-listings") ||
                isActive("/list-product")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/my-listings")}
            >
              <FiPackage className="listing-side-nav-icon" />

              <span>My Listings</span>
            </button>


            {/* Orders Received */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/seller-orders")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/seller-orders")}
            >
              <FiClipboard className="listing-side-nav-icon" />

              <span>Orders Received</span>
            </button>

          </>
        )}


        {/* =================================================
            ADMIN SIDEBAR
        ================================================= */}

        {role === "admin" && (
          <>

            <div className="listing-nav-section-title">
              ADMIN
            </div>

            {/* Admin Dashboard */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                location.pathname === "/admin" ? "active" : ""
              }`}
              onClick={() => navigate("/admin")}
            >
              <FiBarChart2 className="listing-side-nav-icon" />

              <span>Admin Dashboard</span>
            </button>


            <div className="listing-nav-section-title">
              MANAGEMENT
            </div>

            {/* Users */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/admin/users")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/admin/users")}
            >
              <FiUsers className="listing-side-nav-icon" />

              <span>Users</span>
            </button>


            {/* Listings */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/admin/listings")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/admin/listings")}
            >
              <FiPackage className="listing-side-nav-icon" />

              <span>Listings</span>
            </button>


            {/* Orders */}
            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/admin/orders")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/admin/orders")}
            >
              <FiClipboard className="listing-side-nav-icon" />

              <span>Orders</span>
            </button>

          </>
        )}


        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div className="listing-nav-section-title">
          ACCOUNT
        </div>


        {/* My Account */}
        <button
          type="button"
          className={`listing-side-nav-item listing-side-nav-parent ${
            isSectionActive(accountPaths)
              ? "has-active-child"
              : ""
          }`}
          onClick={() =>
            setAccountOpen((previous) => !previous)
          }
        >

          <span className="listing-side-nav-item-left">

            <FiUser className="listing-side-nav-icon" />

            <span>My Account</span>

          </span>


          {accountOpen ? (
            <FiChevronUp className="listing-side-nav-arrow" />
          ) : (
            <FiChevronDown className="listing-side-nav-arrow" />
          )}

        </button>


        {/* Account Submenu */}
        {accountOpen && (
          <div className="listing-side-nav-submenu">

            {/* Profile */}
            <button
              type="button"
              className={`listing-submenu-item ${
                isActive("/profile")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/profile")}
            >
              <FiUser />

              <span>Profile</span>
            </button>


            {/* Addresses */}
            <button
              type="button"
              className={`listing-submenu-item ${
                isActive("/addresses")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/addresses")}
            >
              <FiMapPin />

              <span>Addresses</span>
            </button>


            {/* Settings */}
            <button
              type="button"
              className={`listing-submenu-item ${
                isActive("/settings")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/settings")}
            >
              <FiSettings />

              <span>Settings</span>
            </button>

          </div>
        )}

      </nav>


      {/* =====================================================
          LOGOUT
      ===================================================== */}

      <div className="listing-side-nav-bottom">

        <button
          type="button"
          className="listing-side-nav-logout"
          onClick={handleLogout}
        >
          <FiLogOut />

          <span>Log out</span>
        </button>

      </div>

    </aside>
  );
}