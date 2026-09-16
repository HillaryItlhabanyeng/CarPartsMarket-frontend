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

  if (normalized === "admin" || normalized === "administrator") {
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

type Props = {
  onRoleChange?: (role: Role) => void;
};

export default function SideNavigation({ onRoleChange }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<CurrentUser | null>(() =>
    getStoredUser()
  );

  const [accountOpen, setAccountOpen] = useState(
    location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/addresses") ||
      location.pathname.startsWith("/settings")
  );

  /*
   * Read the role from the same storage item used by LoginPage.
   */
  const role = normalizeRole(user?.role);

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

  useEffect(() => {
    if (
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/addresses") ||
      location.pathname.startsWith("/settings")
    ) {
      setAccountOpen(true);
    }
  }, [location.pathname]);

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const isSectionActive = (paths: string[]) => {
    return paths.some((path) => isActive(path));
  };

  const handleRoleSwitch = (nextRole: Role) => {
    if (nextRole === role) {
      return;
    }

    /*
     * Keep the current user's selected role in sync.
     * This is useful for your current frontend setup.
     */
    const currentUser = getStoredUser();

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        role: nextRole,
      };

      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);
    }

    onRoleChange?.(nextRole);

    /*
     * Send the user to the appropriate area.
     */
    if (nextRole === "seller") {
      navigate("/my-listings");
    } else if (nextRole === "buyer") {
      navigate("/shop");
    } else {
      navigate("/admin");
    }
  };

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

      {/* =========================
          BRAND
      ========================= */}
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

      {/* =========================
          USER CARD
      ========================= */}
      <div className="listing-side-nav-user">

        <div className="listing-side-nav-avatar">
          {initials}
        </div>

        <div className="listing-side-nav-user-info">
          <strong>{userName}</strong>
          <span>{roleLabel}</span>
        </div>

      </div>

      {/* =========================
          ROLE SWITCH
          Only show for Buyer/Seller
      ========================= */}
      {role !== "admin" && (
        <div
          className="listing-role-switch"
          role="tablist"
          aria-label="Account mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={role === "buyer"}
            className={`listing-role-switch-btn ${
              role === "buyer" ? "active" : ""
            }`}
            onClick={() => handleRoleSwitch("buyer")}
          >
            Buying
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={role === "seller"}
            className={`listing-role-switch-btn ${
              role === "seller" ? "active" : ""
            }`}
            onClick={() => handleRoleSwitch("seller")}
          >
            Selling
          </button>
        </div>
      )}

      {/* =========================
          NAVIGATION
      ========================= */}
      <nav className="listing-side-nav-menu">

        {/* =========================
            MAIN
        ========================= */}
        <div className="listing-nav-section-title">
          {role === "admin" ? "ADMIN" : "MAIN"}
        </div>

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

        {/* =========================
            BUYER
        ========================= */}
        {role === "buyer" && (
          <>
            <div className="listing-nav-section-title">
              SHOPPING
            </div>

            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/shop") ? "active" : ""
              }`}
              onClick={() => navigate("/shop")}
            >
              <FiShoppingBag className="listing-side-nav-icon" />
              <span>Shop</span>
            </button>

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

        {/* =========================
            SELLER
        ========================= */}
        {role === "seller" && (
          <>
            <div className="listing-nav-section-title">
              SELLING
            </div>

            <button
              type="button"
              className="listing-side-nav-cta"
              onClick={() => navigate("/list-product")}
            >
              <FiPlusCircle />
              <span>Add Listing</span>
            </button>

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

            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/seller-orders") ? "active" : ""
              }`}
              onClick={() => navigate("/seller-orders")}
            >
              <FiClipboard className="listing-side-nav-icon" />
              <span>Orders Received</span>
            </button>
          </>
        )}

        {/* =========================
            ADMIN
        ========================= */}
        {role === "admin" && (
          <>
            <div className="listing-nav-section-title">
              MANAGEMENT
            </div>

            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/admin") ? "active" : ""
              }`}
              onClick={() => navigate("/admin")}
            >
              <FiBarChart2 className="listing-side-nav-icon" />
              <span>Admin Dashboard</span>
            </button>

            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/admin/users") ? "active" : ""
              }`}
              onClick={() => navigate("/admin/users")}
            >
              <FiUsers className="listing-side-nav-icon" />
              <span>Users</span>
            </button>

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

            <button
              type="button"
              className={`listing-side-nav-item ${
                isActive("/admin/orders") ? "active" : ""
              }`}
              onClick={() => navigate("/admin/orders")}
            >
              <FiClipboard className="listing-side-nav-icon" />
              <span>Orders</span>
            </button>
          </>
        )}

        {/* =========================
            ACCOUNT
        ========================= */}
        <div className="listing-nav-section-title">
          ACCOUNT
        </div>

        <button
          type="button"
          className={`listing-side-nav-item listing-side-nav-parent ${
            isSectionActive(accountPaths)
              ? "has-active-child"
              : ""
          }`}
          onClick={() => setAccountOpen((previous) => !previous)}
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

        {accountOpen && (
          <div className="listing-side-nav-submenu">

            <button
              type="button"
              className={`listing-submenu-item ${
                isActive("/profile") ? "active" : ""
              }`}
              onClick={() => navigate("/profile")}
            >
              <FiUser />
              <span>Profile</span>
            </button>

            <button
              type="button"
              className={`listing-submenu-item ${
                isActive("/addresses") ? "active" : ""
              }`}
              onClick={() => navigate("/addresses")}
            >
              <FiMapPin />
              <span>Addresses</span>
            </button>

            <button
              type="button"
              className={`listing-submenu-item ${
                isActive("/settings") ? "active" : ""
              }`}
              onClick={() => navigate("/settings")}
            >
              <FiSettings />
              <span>Settings</span>
            </button>
          </div>
        )}

      </nav>

      {/* =========================
          LOGOUT
      ========================= */}
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