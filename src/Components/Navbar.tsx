
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiShoppingCart,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiMapPin,
  FiSettings,
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiClipboard,
  FiHeart,
} from "react-icons/fi";

import { useCart } from "./useCart";
import NotificationBell from "./NotificationBell";
import "./Navbar.css";

type Role = "buyer" | "seller" | "admin";

type CurrentUser = {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  role?: string;
  profileImage?: string;
  coverImage?: string;
};

type Address = {
  id?: number | string;
  label?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
};

type Props = {
  userName?: string;
  showLinks?: boolean;
};

const CURRENT_USER_KEY = "marketplace_current_user";
const AUTOMARKET_USER_KEY = "automarketUser";
const ADDRESS_STORAGE_KEY = "marketplace_addresses";
const PROFILE_IMAGE_KEY = "automarketProfileImage";
const SAVED_PROFILE_PREFIX = "automarket_saved_profile:";

function readStoredObject(key: string): CurrentUser | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as CurrentUser;
    }

    return null;
  } catch {
    return null;
  }
}

function getProfileStorageKey(email?: string): string {
  return `${SAVED_PROFILE_PREFIX}${(email ?? "")
    .trim()
    .toLowerCase()}`;
}

function readSavedProfile(email?: string): CurrentUser | null {
  if (!email?.trim()) return null;

  try {
    const raw = localStorage.getItem(getProfileStorageKey(email));
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as CurrentUser;
    }

    return null;
  } catch {
    return null;
  }
}

function readCurrentUser(): CurrentUser | null {
  const primary = readStoredObject(CURRENT_USER_KEY);
  const registered = readStoredObject(AUTOMARKET_USER_KEY);

  // Preserve the existing merge behaviour for active-session details.
  const merged: CurrentUser = {
    ...(primary ?? {}),
    ...(registered ?? {}),
  };

  if (
    !merged.email &&
    !merged.id &&
    !merged.firstName &&
    !merged.name
  ) {
    return null;
  }

  // Restore account-specific profile information without overwriting
  // the role selected for the current session.
  const savedProfile = readSavedProfile(merged.email);

  if (savedProfile) {
    return {
      ...savedProfile,
      ...merged,
      firstName: savedProfile.firstName ?? merged.firstName,
      lastName: savedProfile.lastName ?? merged.lastName,
      name: savedProfile.name ?? merged.name,
      mobile: savedProfile.mobile ?? merged.mobile,
      profileImage:
        savedProfile.profileImage ??
        merged.profileImage,
      coverImage:
        savedProfile.coverImage ??
        merged.coverImage,
      role: merged.role ?? savedProfile.role,
    };
  }

  return merged;
}

function readAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed as Address[];
  } catch {
    return [];
  }
}

function readProfileImage(user: CurrentUser | null): string {
  if (!user) return "";

  // Prefer the current account's saved profile image.
  const savedProfile = readSavedProfile(user.email);

  if (savedProfile?.profileImage) {
    return savedProfile.profileImage;
  }

  if (user.profileImage) {
    return user.profileImage;
  }

  // Legacy fallback for older profile images.
  try {
    return localStorage.getItem(PROFILE_IMAGE_KEY) || "";
  } catch {
    return "";
  }
}

function normalizeRole(role?: string): Role {
  const normalized = role?.toLowerCase().trim();

  if (normalized === "seller" || normalized === "vendor") {
    return "seller";
  }

  if (normalized === "admin" || normalized === "administrator") {
    return "admin";
  }

  return "buyer";
}

function getUserName(user: CurrentUser | null): string {
  if (!user) return "User";

  if (user.name?.trim()) {
    return user.name.trim();
  }

  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return fullName || "User";
}

function getAddressDisplay(addresses: Address[]): string {
  if (!addresses.length) return "Add address";

  const address = addresses[0];

  if (address.street && address.city) {
    return `${address.street}, ${address.city}`;
  }

  return address.city || address.street || "Add address";
}

export default function Navbar({
  userName = "User",
  showLinks = true,
}: Props) {
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const menuRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(() => readCurrentUser());
  const [addresses, setAddresses] =
    useState<Address[]>(() => readAddresses());
  const [profileImage, setProfileImage] = useState<string>(() =>
    readProfileImage(readCurrentUser())
  );

  useEffect(() => {
    const refreshUserData = () => {
      const updatedUser = readCurrentUser();

      setCurrentUser(updatedUser);
      setAddresses(readAddresses());
      setProfileImage(readProfileImage(updatedUser));
    };

    refreshUserData();

    window.addEventListener("storage", refreshUserData);
    window.addEventListener("automarket-user-updated", refreshUserData);
    window.addEventListener("automarket-address-updated", refreshUserData);
    window.addEventListener(
      "automarket-profile-image-updated",
      refreshUserData
    );

    return () => {
      window.removeEventListener("storage", refreshUserData);
      window.removeEventListener("automarket-user-updated", refreshUserData);
      window.removeEventListener("automarket-address-updated", refreshUserData);
      window.removeEventListener(
        "automarket-profile-image-updated",
        refreshUserData
      );
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const role = normalizeRole(currentUser?.role);
  const storedName = getUserName(currentUser);
  const displayName = storedName !== "User" ? storedName : userName;
  const addressDisplay = getAddressDisplay(addresses);

  const isLoggedIn =
    !!currentUser &&
    !!(
      currentUser.id ||
      currentUser.email ||
      currentUser.firstName ||
      currentUser.name
    );

  const roleLabel =
    role === "seller"
      ? "Seller"
      : role === "admin"
        ? "Admin"
        : "Buyer";

  function handleSearch() {
    const query = search.trim();

    navigate(
      query
        ? `/shop?search=${encodeURIComponent(query)}`
        : "/shop"
    );
  }

  function handleLogout() {
    if (!window.confirm("Are you sure you want to log out?")) {
      return;
    }

    // Remove only active-session information.
    // Keep per-account profile data and profile images.
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTOMARKET_USER_KEY);
    localStorage.removeItem("marketRole");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    setCurrentUser(null);
    setProfileImage("");
    setIsMenuOpen(false);

    window.dispatchEvent(new Event("automarket-user-updated"));
    window.dispatchEvent(new Event("automarket-profile-image-updated"));

    navigate("/login");
  }

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/home" className="navbar-logo">
          <img
            src="/automarket - logo.png"
            alt="AutoMarket"
            className="navbar-logo-image"
          />
        </Link>

        <Link
          to={isLoggedIn ? "/addresses" : "/login"}
          className="navbar-address"
          title={addressDisplay}
        >
          <span className="navbar-address-icon">
            <FiMapPin />
          </span>

          <span className="navbar-address-content">
            <small>
              {isLoggedIn ? "Deliver to" : "Delivery location"}
            </small>
            <strong>
              {isLoggedIn ? addressDisplay : "Sign in to add address"}
            </strong>
          </span>
        </Link>

        <div className="navbar-search">
          <FiSearch className="search-icon" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSearch();
            }}
            placeholder="Search for car parts, brands, or vehicles..."
            aria-label="Search"
          />

          <button type="button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="navbar-actions">
          {isLoggedIn && <NotificationBell variant="navbar" />}

          {isLoggedIn && role === "buyer" && (
            <Link
              to="/cart"
              className="nav-action nav-cart-action"
              aria-label="Shopping cart"
            >
              <span className="nav-action-icon-wrapper">
                <FiShoppingCart className="action-icon" />

                {itemCount > 0 && (
                  <span className="cart-count">{itemCount}</span>
                )}
              </span>

              <span className="action-label">Cart</span>
            </Link>
          )}

          {!isLoggedIn ? (
            <div className="navbar-auth-actions">
              <Link to="/login" className="nav-action">
                Login
              </Link>
              <Link to="/register" className="nav-action">
                Register
              </Link>
            </div>
          ) : (
            <div className="nav-profile-wrapper" ref={menuRef}>
              <button
                type="button"
                className="nav-profile"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${displayName} profile`}
                    className="profile-avatar-image"
                  />
                ) : (
                  <span className="profile-avatar-placeholder">
                    <FiUser />
                  </span>
                )}

                <span className="profile-user-info">
                  <strong>{displayName}</strong>
                  <small>{roleLabel}</small>
                </span>

                <FiChevronDown
                  className={`profile-chevron ${isMenuOpen ? "open" : ""}`}
                />
              </button>

              {isMenuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={`${displayName} profile`}
                        className="profile-dropdown-avatar-image"
                      />
                    ) : (
                      <span className="profile-dropdown-avatar-placeholder">
                        <FiUser />
                      </span>
                    )}

                    <div>
                      <strong>{displayName}</strong>
                      <span>{roleLabel}</span>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="profile-dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/addresses"
                    className="profile-dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiMapPin />
                    <span>Addresses</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="profile-dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiSettings />
                    <span>Settings</span>
                  </Link>

                  {role === "seller" && (
                    <Link
                      to="/my-listings"
                      className="profile-dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiPackage />
                      <span>My Listings</span>
                    </Link>
                  )}

                  {role === "admin" && (
                    <>
                      <Link
                        to="/admin"
                        className="profile-dropdown-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiBarChart2 />
                        <span>Admin Dashboard</span>
                      </Link>

                      <Link
                        to="/admin/users"
                        className="profile-dropdown-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUsers />
                        <span>Manage Users</span>
                      </Link>

                      <Link
                        to="/admin/orders"
                        className="profile-dropdown-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiClipboard />
                        <span>Manage Orders</span>
                      </Link>
                    </>
                  )}

                  <button
                    type="button"
                    className="profile-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <FiLogOut />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {showLinks && (
        <nav className="nav-links-row" aria-label="Main navigation">
          {(!isLoggedIn || role === "buyer") && (
            <>
              <NavLink to="/home" end>
                Home
              </NavLink>

              <NavLink to="/shop">
                Browse Listings
              </NavLink>

              <NavLink to="/categories">
                Categories
              </NavLink>

              {isLoggedIn && (
                <NavLink to="/wishlist">
                  <FiHeart />
                  <span>Wishlist</span>
                </NavLink>
              )}

              <NavLink to="/contact">
                Contact
              </NavLink>
            </>
          )}

          {isLoggedIn && role === "seller" && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/list-product">List a Product</NavLink>
              <NavLink to="/my-listings">My Listings</NavLink>
              <NavLink to="/seller-orders">Orders Received</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <>
              <NavLink to="/admin" end>
                Dashboard
              </NavLink>

              <NavLink to="/admin/users">
                <FiUsers />
                <span>Users</span>
              </NavLink>

              <NavLink to="/admin/listings">
                <FiPackage />
                <span>Listings</span>
              </NavLink>

              <NavLink to="/admin/orders">
                <FiClipboard />
                <span>Orders</span>
              </NavLink>

              <NavLink to="/contact">Contact</NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
