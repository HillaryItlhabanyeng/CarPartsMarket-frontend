import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaHome,
  FaBoxOpen,
  FaShoppingBag,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import "./SideNav.css";

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [myProductsOpen, setMyProductsOpen] = useState(true);

  const isActive = (path) => {
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
    <aside className="side-nav">

      {/* =========================================
          LOGO
      ========================================== */}

      <div className="side-nav-logo">
        <img
          src="automarket_-_logo-removebg-preview.png"
          alt="automarket logo"
          className="automarket-logo"
        />
      </div>


      {/* =========================================
          NAVIGATION
      ========================================== */}

      <nav className="side-nav-menu">

        {/* HOME */}

        <button
          type="button"
          className={`side-nav-item ${
            isActive("/home") ? "active" : ""
          }`}
          onClick={() => navigate("/home")}
        >
          <FaHome className="side-nav-icon" />

          <span>Home</span>
        </button>


        {/* =========================================
            MY PRODUCTS
        ========================================== */}

        <button
          type="button"
          className="side-nav-item side-nav-parent"
          onClick={() =>
            setMyProductsOpen(!myProductsOpen)
          }
        >
          <span className="side-nav-item-left">

            <FaBoxOpen className="side-nav-icon" />

            <span>My products</span>

          </span>

          {myProductsOpen ? (
            <FaChevronUp className="side-nav-arrow" />
          ) : (
            <FaChevronDown className="side-nav-arrow" />
          )}
        </button>


        {myProductsOpen && (
          <div className="side-nav-submenu">

            <button
              type="button"
              className={`submenu-item ${
                isActive("/my-listings")
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                navigate("/my-listings")
              }
            >
              Selling
            </button>


            <button
              type="button"
              className={`submenu-item ${
                isActive("/buying")
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                navigate("/buying")
              }
            >
              Buying
            </button>


            <button
              type="button"
              className={`submenu-item ${
                isActive("/saved")
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                navigate("/saved")
              }
            >
              Saved
            </button>

          </div>
        )}


        {/* =========================================
            PRODUCTS
        ========================================== */}

        <button
          type="button"
          className={`side-nav-item ${
            isActive("/products") ? "active" : ""
          }`}
          onClick={() => navigate("/products")}
        >
          <FaShoppingBag className="side-nav-icon" />

          <span>Products</span>
        </button>


        {/* =========================================
            PROFILE
        ========================================== */}

        <button
          type="button"
          className={`side-nav-item ${
            isActive("/profile") ? "active" : ""
          }`}
          onClick={() => navigate("/profile")}
        >
          <FaUser className="side-nav-icon" />

          <span>Profile</span>
        </button>

      </nav>


      {/* =========================================
          LOGOUT
      ========================================== */}

      <div className="side-nav-bottom">

        <button
          type="button"
          className="side-nav-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />

          <span>Log out</span>
        </button>

      </div>

    </aside>
  );
}
