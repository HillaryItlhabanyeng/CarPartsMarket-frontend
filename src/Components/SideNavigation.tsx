import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import "./SideNavigation.css";

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [myProductsOpen, setMyProductsOpen] = useState(true);
  const [communityOpen, setCommunityOpen] = useState(true);

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

      {/* =========================================
          LOGO
      ========================================== */}

      <div className="listing-side-nav-logo">
        <img
          src="UniTrade logo 2.png"
          alt="UniTrade Campus Marketplace"
          className="listing-unitrade-logo"
        />
      </div>


      {/* =========================================
          NAVIGATION
      ========================================== */}

      <nav className="listing-side-nav-menu">

        {/* HOME */}

        <button
          type="button"
          className={`listing-side-nav-item ${isActive("/home") ? "active" : ""}`}onClick={() => navigate("/home")}>
          {/* <FaHome className="listing-side-nav-icon" /> */}
          <span>Home</span>
        </button>


        {/* =========================================
            MY PRODUCTS
        ========================================== */}

        <button
          type="button"
          className="listing-side-nav-item listing-side-nav-parent" onClick={() =>setMyProductsOpen(!myProductsOpen)}>
          <span className="listing-side-nav-item-left">
            {/* <FaBoxOpen className="listing-side-nav-icon" /> */}
            <span>My products</span>
          </span>

          {myProductsOpen ? (
            <FaChevronUp className="listing-side-nav-arrow" />
          ) : (
            <FaChevronDown className="listing-side-nav-arrow" />
          )}
        </button>


        {myProductsOpen && (
          <div className="listing-side-nav-submenu">

            <button
              type="button"
              className={`listing-submenu-item ${ isActive("/my-listings") ? "active" : "" }`}
              onClick={() => navigate("/my-listings") } >
              Selling
            </button>


            <button
              type="button"
              className={`listing-submenu-item ${ isActive("/buying") ? "active" : "" }`}
              onClick={() => navigate("/buying") } >
              Buying
            </button>


            <button
              type="button"
              className={`listing-submenu-item ${ isActive("/saved") ? "active" : "" }`}
              onClick={() => navigate("/saved") }>
              Saved
            </button>

          </div>
        )}


        {/* =========================================
            PRODUCTS
        ========================================== */}

        <button
          type="button"
          className={`listing-side-nav-item ${ isActive("/products") ? "active" : "" }`}
                    onClick={() => navigate("/products")} >
          {/* <FaShoppingBag className="listing-side-nav-icon" /> */}
          <span>Products</span>
        </button>


        {/* =========================================
            COMMUNITY
        ========================================== */}

        <button
          type="button"
          className="listing-side-nav-item listing-side-nav-parent"
          onClick={() => setCommunityOpen(!communityOpen) } >
          <span className="listing-side-nav-item-left">
            {/* <FaUsers className="listing-side-nav-icon" /> */}
            <span>Community</span>
          </span>

          {communityOpen ? (
            <FaChevronUp className="listing-side-nav-arrow" />
          ) : (
            <FaChevronDown className="listing-side-nav-arrow" />
          )}
        </button>


        {communityOpen && (
          <div className="listing-side-nav-submenu">

            <button
              type="button"
              className={`listing-submenu-item ${ isActive("/announcements") ? "active" : "" }`}
              onClick={() => navigate("/announcements") } >
              {/* <FaBullhorn /> */}
              <span>Announcements</span>
            </button>


            <button
              type="button"
              className={`listing-submenu-item ${ isActive("/services") ? "active": ""}`}
              onClick={() =>navigate("/services")}>
              {/* <FaComments /> */}

              <span>Services</span>
            </button>


            <button
              type="button" className={`listing-submenu-item ${isActive("/events")? "active": ""}`} onClick={() =>navigate("/events")} >
              {/* <FaCalendarAlt /> */}
              <span>Events</span>
            </button>
          </div>
        )}


        {/* =========================================
            PROFILE
        ========================================== */}

        <button
          type="button"
          className={`listing-side-nav-item ${isActive("/profile") ? "active" : ""}`}onClick={() => navigate("/profile")}        >
          {/* <FaUser className="listing-side-nav-icon" /> */}
          <span>Profile</span>
        </button>

      </nav>


      {/* =========================================
          LOGOUT
      ========================================== */}

      <div className="listing-side-nav-bottom">
        <button
          type="button" className="listing-side-nav-logout" onClick={handleLogout}        >
          <FaSignOutAlt />
          <span>Log out</span>
        </button>

      </div>

    </aside>
  );
}