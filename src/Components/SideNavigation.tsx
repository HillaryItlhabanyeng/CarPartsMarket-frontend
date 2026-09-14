import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
} from "react-icons/fi";

import "./SideNavigation.css";

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [accountOpen, setAccountOpen] = useState(true);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (confirmed) {
      navigate("/login");
    }
  };

  return (
    <aside className="listing-side-nav">

      {/* =================================================
          LOGO
      ================================================= */}

      <div className="listing-side-nav-logo">

        <img
          src="/automarket-logo.png"
          alt="AutoMarket"
          className="listing-automarket-logo"
        />

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="listing-side-nav-menu">


        {/* DASHBOARD */}

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


        {/* MY ORDERS */}

        <button
          type="button"
          className={`listing-side-nav-item ${
            isActive("/orders") ? "active" : ""
          }`}
          onClick={() => navigate("/orders")}
        >

          <FiShoppingBag className="listing-side-nav-icon" />

          <span>My Orders</span>

        </button>


        {/* WISHLIST */}

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


        {/* =================================================
            ACCOUNT SECTION
        ================================================= */}

        <button
          type="button"
          className="listing-side-nav-item listing-side-nav-parent"
          onClick={() =>
            setAccountOpen(!accountOpen)
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


        {/* ACCOUNT SUBMENU */}

        {accountOpen && (
          <div className="listing-side-nav-submenu">


            {/* PROFILE */}

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


            {/* ADDRESSES */}

            <button
              type="button"
              className={`listing-submenu-item ${
                isActive("/addresses")
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                navigate("/addresses")
              }
            >

              <FiMapPin />

              <span>Addresses</span>

            </button>


            {/* SETTINGS */}

            <button
              type="button"
              className={`listing-submenu-item ${
                isActive("/settings")
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                navigate("/settings")
              }
            >

              <FiSettings />

              <span>Settings</span>

            </button>

          </div>
        )}


        {/* =================================================
            MY LISTINGS
        ================================================= */}

        <button
          type="button"
          className={`listing-side-nav-item ${
            isActive("/my-listings")
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/my-listings")
          }
        >

          <FiPackage className="listing-side-nav-icon" />

          <span>My Listings</span>

        </button>

      </nav>


      {/* =================================================
          LOGOUT
      ================================================= */}

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