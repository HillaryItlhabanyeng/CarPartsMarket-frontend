import { useEffect, useRef, useState } from "react";
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

/* =========================================================
   TYPES
========================================================= */

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
};

type Address = {
  id: number;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  phone?: string;
};

/* =========================================================
   STORAGE KEYS
========================================================= */

const CURRENT_USER_KEY = "marketplace_current_user";
const AUTOMARKET_USER_KEY = "automarketUser";
const ADDRESS_STORAGE_KEY = "marketplace_addresses";

/*
  IMPORTANT:
  This must remain exactly the same key used by ProfilePage.
*/
const PROFILE_IMAGE_KEY = "automarketProfileImage";

/* =========================================================
   READ USER
========================================================= */

function readCurrentUser(): CurrentUser | null {
  try {
    const currentUserRaw =
      window.localStorage.getItem(CURRENT_USER_KEY);

    if (currentUserRaw) {
      const parsed = JSON.parse(currentUserRaw);

      if (
        parsed &&
        typeof parsed === "object"
      ) {
        return parsed;
      }
    }

    const automarketUserRaw =
      window.localStorage.getItem(
        AUTOMARKET_USER_KEY
      );

    if (automarketUserRaw) {
      const parsed = JSON.parse(
        automarketUserRaw
      );

      if (
        parsed &&
        typeof parsed === "object"
      ) {
        return parsed;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/* =========================================================
   READ PROFILE IMAGE
========================================================= */

function readProfileImage(): string {
  try {
    return (
      window.localStorage.getItem(
        PROFILE_IMAGE_KEY
      ) || ""
    );
  } catch {
    return "";
  }
}

/* =========================================================
   NORMALIZE ROLE
========================================================= */

function normalizeRole(
  role?: string
): Role {
  const normalized =
    role?.toLowerCase().trim();

  if (
    normalized === "seller" ||
    normalized === "vendor"
  ) {
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

/* =========================================================
   USER NAME
========================================================= */

function getUserName(
  user: CurrentUser | null
): string {
  if (!user) {
    return "User";
  }

  if (user.name?.trim()) {
    return user.name.trim();
  }

  const fullName =
    `${user.firstName ?? ""} ${
      user.lastName ?? ""
    }`.trim();

  return fullName || "User";
}

/* =========================================================
   READ ADDRESSES
========================================================= */

function readAddresses(): Address[] {
  try {
    const raw =
      window.localStorage.getItem(
        ADDRESS_STORAGE_KEY
      );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

/* =========================================================
   ADDRESS DISPLAY
========================================================= */

function getAddressDisplay(
  addresses: Address[]
): string {
  if (!addresses.length) {
    return "Add address";
  }

  const address = addresses[0];

  if (
    address.city &&
    address.street
  ) {
    return `${address.street}, ${address.city}`;
  }

  if (address.city) {
    return address.city;
  }

  if (address.street) {
    return address.street;
  }

  return "Address";
}

/* =========================================================
   PROPS
========================================================= */

type Props = {
  userName?: string;
  showLinks?: boolean;
};

/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar({
  userName = "User",
  showLinks = true,
}: Props) {
  const navigate = useNavigate();

  const { itemCount } = useCart();

  const menuRef =
    useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(() =>
      readCurrentUser()
    );

  /*
    The Navbar reads ONLY from the shared
    automarketProfileImage localStorage key.
  */
  const [profileImage, setProfileImage] =
    useState<string>(() =>
      readProfileImage()
    );

  const [addresses, setAddresses] =
    useState<Address[]>(() =>
      readAddresses()
    );

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const role = normalizeRole(
    currentUser?.role
  );

  const currentUserName =
    getUserName(currentUser);

  const displayName =
    currentUserName !== "User"
      ? currentUserName
      : userName;

  const addressDisplay =
    getAddressDisplay(addresses);

  /* =======================================================
     REFRESH USER + PROFILE IMAGE + ADDRESS
  ======================================================= */

  useEffect(() => {
    const refreshUserData = () => {
      setCurrentUser(
        readCurrentUser()
      );

      setAddresses(
        readAddresses()
      );
    };

    refreshUserData();

    window.addEventListener(
      "storage",
      refreshUserData
    );

    window.addEventListener(
      "automarket-user-updated",
      refreshUserData
    );

    window.addEventListener(
      "automarket-address-updated",
      refreshUserData
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshUserData
      );

      window.removeEventListener(
        "automarket-user-updated",
        refreshUserData
      );

      window.removeEventListener(
        "automarket-address-updated",
        refreshUserData
      );
    };
  }, []);

  /* =======================================================
     PROFILE IMAGE SYNC
  ======================================================= */

  useEffect(() => {
    const refreshProfileImage = () => {
      setProfileImage(
        readProfileImage()
      );
    };

    /*
      Load the image immediately when the Navbar mounts.
    */
    refreshProfileImage();

    /*
      This event is dispatched by ProfilePage after
      uploading or removing the profile image.
    */
    window.addEventListener(
      "automarket-profile-image-updated",
      refreshProfileImage
    );

    /*
      This also handles localStorage changes made
      from another browser tab/window.
    */
    window.addEventListener(
      "storage",
      refreshProfileImage
    );

    return () => {
      window.removeEventListener(
        "automarket-profile-image-updated",
        refreshProfileImage
      );

      window.removeEventListener(
        "storage",
        refreshProfileImage
      );
    };
  }, []);

  /* =======================================================
     CLOSE PROFILE MENU
  ======================================================= */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  function handleSearch() {
    const query =
      search.trim();

    if (query) {
      navigate(
        `/shop?search=${encodeURIComponent(
          query
        )}`
      );
    } else {
      navigate("/shop");
    }
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  function handleLogout() {
    const confirmed =
      window.confirm(
        "Are you sure you want to log out?"
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      CURRENT_USER_KEY
    );

    localStorage.removeItem(
      AUTOMARKET_USER_KEY
    );

    localStorage.removeItem(
      "marketRole"
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "authToken"
    );

    /*
      Remove the shared profile image key.
    */
    localStorage.removeItem(
      PROFILE_IMAGE_KEY
    );

    setCurrentUser(null);
    setProfileImage("");
    setIsMenuOpen(false);

    /*
      Notify every component that the user
      and profile image have changed.
    */
    window.dispatchEvent(
      new Event(
        "automarket-user-updated"
      )
    );

    window.dispatchEvent(
      new Event(
        "automarket-profile-image-updated"
      )
    );

    navigate("/login");
  }

  /* =======================================================
     ROLE LABEL
  ======================================================= */

  const roleLabel =
    role === "seller"
      ? "Seller"
      : role === "admin"
        ? "Admin"
        : "Buyer";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <header className="site-header">
      {/* ===================================================
          MAIN NAVBAR
      =================================================== */}

      <nav className="navbar">
        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/home"
          className="navbar-logo"
        >
          <img
            src="/automarket - logo.png"
            alt="AutoMarket"
            className="navbar-logo-image"
          />
        </Link>

        {/* =================================================
            ADDRESS
        ================================================= */}

        <Link
          to="/addresses"
          className="navbar-address"
          title={
            addressDisplay ===
            "Add address"
              ? "Add your address"
              : addressDisplay
          }
        >
          <span className="navbar-address-icon">
            <FiMapPin />
          </span>

          <span className="navbar-address-content">
            <small>
              Deliver to
            </small>

            <strong>
              {addressDisplay}
            </strong>
          </span>
        </Link>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="navbar-search">
          <FiSearch
            className="search-icon"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                handleSearch();
              }
            }}
            placeholder="Search for car parts, brands, or vehicles..."
            aria-label="Search"
          />

          <button
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* =================================================
            RIGHT ACTIONS
        ================================================= */}

        <div className="navbar-actions">
          {/* ===============================================
              NOTIFICATIONS
          =============================================== */}

          <NotificationBell
            variant="navbar"
          />

          {/* ===============================================
              CART
              BUYER ONLY
          =============================================== */}

          {role === "buyer" && (
            <Link
              to="/cart"
              className="nav-action nav-cart-action"
              aria-label="Shopping cart"
            >
              <span className="nav-action-icon-wrapper">
                <FiShoppingCart
                  className="action-icon"
                />

                {itemCount > 0 && (
                  <span
                    className="cart-count"
                    aria-label={`${itemCount} items in cart`}
                  >
                    {itemCount}
                  </span>
                )}
              </span>

              <span className="action-label">
                Cart
              </span>
            </Link>
          )}

          {/* ===============================================
              PROFILE
          =============================================== */}

          <div
            className="nav-profile-wrapper"
            ref={menuRef}
          >
            <button
              type="button"
              className="nav-profile"
              onClick={() =>
                setIsMenuOpen(
                  (open) => !open
                )
              }
              aria-haspopup="true"
              aria-expanded={
                isMenuOpen
              }
            >
              {/* =========================================
                  PROFILE IMAGE
              ========================================= */}

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

              {/* =========================================
                  USER INFORMATION
              ========================================= */}

              <span className="profile-user-info">
                <strong>
                  {displayName}
                </strong>

                <small>
                  {roleLabel}
                </small>
              </span>

              <FiChevronDown
                className={`profile-chevron ${
                  isMenuOpen
                    ? "open"
                    : ""
                }`}
              />
            </button>

            {/* =============================================
                PROFILE DROPDOWN
            ============================================= */}

            {isMenuOpen && (
              <div className="profile-dropdown">
                {/* =========================================
                    PROFILE HEADER
                ========================================= */}

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
                    <strong>
                      {displayName}
                    </strong>

                    <span>
                      {roleLabel}
                    </span>
                  </div>
                </div>

                {/* =========================================
                    PROFILE
                ========================================= */}

                <Link
                  to="/profile"
                  className="profile-dropdown-item"
                  onClick={() =>
                    setIsMenuOpen(
                      false
                    )
                  }
                >
                  <FiUser />

                  <span>
                    Profile
                  </span>
                </Link>

                {/* =========================================
                    ADDRESS
                ========================================= */}

                <Link
                  to="/addresses"
                  className="profile-dropdown-item"
                  onClick={() =>
                    setIsMenuOpen(
                      false
                    )
                  }
                >
                  <FiMapPin />

                  <span>
                    Addresses
                  </span>
                </Link>

                {/* =========================================
                    SETTINGS
                ========================================= */}

                <Link
                  to="/settings"
                  className="profile-dropdown-item"
                  onClick={() =>
                    setIsMenuOpen(
                      false
                    )
                  }
                >
                  <FiSettings />

                  <span>
                    Settings
                  </span>
                </Link>

                {/* =========================================
                    SELLER LINKS
                ========================================= */}

                {role === "seller" && (
                  <Link
                    to="/my-listings"
                    className="profile-dropdown-item"
                    onClick={() =>
                      setIsMenuOpen(
                        false
                      )
                    }
                  >
                    <FiPackage />

                    <span>
                      My Listings
                    </span>
                  </Link>
                )}

                {/* =========================================
                    ADMIN LINKS
                ========================================= */}

                {role === "admin" && (
                  <>
                    <Link
                      to="/admin"
                      className="profile-dropdown-item"
                      onClick={() =>
                        setIsMenuOpen(
                          false
                        )
                      }
                    >
                      <FiBarChart2 />

                      <span>
                        Admin Dashboard
                      </span>
                    </Link>

                    <Link
                      to="/admin/users"
                      className="profile-dropdown-item"
                      onClick={() =>
                        setIsMenuOpen(
                          false
                        )
                      }
                    >
                      <FiUsers />

                      <span>
                        Manage Users
                      </span>
                    </Link>

                    <Link
                      to="/admin/orders"
                      className="profile-dropdown-item"
                      onClick={() =>
                        setIsMenuOpen(
                          false
                        )
                      }
                    >
                      <FiClipboard />

                      <span>
                        Manage Orders
                      </span>
                    </Link>
                  </>
                )}

                {/* =========================================
                    LOGOUT
                ========================================= */}

                <button
                  type="button"
                  className="profile-dropdown-item logout"
                  onClick={
                    handleLogout
                  }
                >
                  <FiLogOut />

                  <span>
                    Log Out
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===================================================
          SECOND NAVIGATION
      =================================================== */}

      {showLinks && (
        <nav
          className="nav-links-row"
          aria-label="Main navigation"
        >
          {/* =================================================
              BUYER NAVIGATION
          ================================================= */}

          {role === "buyer" && (
            <>
              <NavLink
                to="/home"
                end
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                Browse Listings
              </NavLink>

              <NavLink
                to="/categories"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                Categories
              </NavLink>

              <NavLink
                to="/wishlist"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                <FiHeart />

                <span>
                  Wishlist
                </span>
              </NavLink>

              <NavLink
                to="/contact"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                Contact
              </NavLink>
            </>
          )}

          {/* =================================================
              SELLER NAVIGATION
          ================================================= */}

          {role === "seller" && (
            <>
              <NavLink
                to="/dashboard"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/list-product"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                List a Product
              </NavLink>

              <NavLink
                to="/my-listings"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                My Listings
              </NavLink>

              <NavLink
                to="/seller-orders"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                Orders Received
              </NavLink>

              <NavLink
                to="/contact"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                Contact
              </NavLink>
            </>
          )}

          {/* =================================================
              ADMIN NAVIGATION
          ================================================= */}

          {role === "admin" && (
            <>
              <NavLink
                to="/admin"
                end
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                <FiUsers />

                <span>
                  Users
                </span>
              </NavLink>

              <NavLink
                to="/admin/listings"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                <FiPackage />

                <span>
                  Listings
                </span>
              </NavLink>

              <NavLink
                to="/admin/orders"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                <FiClipboard />

                <span>
                  Orders
                </span>
              </NavLink>

              <NavLink
                to="/contact"
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                Contact
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
}