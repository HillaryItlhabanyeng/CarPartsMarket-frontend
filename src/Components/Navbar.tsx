import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaComments,
  FaBell,
  FaHeart,
  FaShoppingBag,
  FaShoppingCart,
  FaChevronDown,
  FaUser,
  FaExchangeAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useCart } from "./useCart";
import "./Navbar.css";
import { MdLocationOn} from 'react-icons/md';

type Props = {
  userName?: string;
  showLinks?: boolean;
};

export default function Navbar({
  userName = "Sipho",
  showLinks = true,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}
      <nav className="navbar">

        {/* LOGO */}
        <Link to="/home" className="navbar-logo">
          <img
            src="/UniTrade logo 2.png"
            alt="UniTrade Campus Marketplace"
            className="navbar-logo-image"
          />
        </Link>

        {/* Messages */}
          <Link to="/messages" className="nav-action-address">
            <MdLocationOn className="action-icon-address" />
            <span className="action-label">Address</span>
          </Link>

        {/* SEARCH */}
        <div className="navbar-search">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") navigate(`/shop?search=${encodeURIComponent(search)}`); }}
            placeholder="Search for items, users or categories..."
            aria-label="Search"
          />

          <button type="button" aria-label="Search" onClick={() => navigate(`/shop?search=${encodeURIComponent(search)}`)}>
            <FaSearch />
          </button>
        </div>

        {/* NAV ACTIONS */}
        <div className="navbar-actions">

          {/* Messages */}
          {/* <Link to="/messages" className="nav-action">
            <FaComments className="action-icon" />
            <span className="action-label">Messages</span>
          </Link> */}

          {/* Notifications */}
          <Link to="/notifications" className="nav-action">
            <FaBell className="action-icon" />
            <span className="action-label">Notifications</span>
          </Link>

          {/* Saved */}
          {/* <Link to="/saved" className="nav-action">
            <FaHeart className="action-icon" />
            <span className="action-label">Saved</span>
          </Link> */}

          {/* Cart */}
          <Link to="/cart" className="nav-action nav-cart-action">
            <FaShoppingCart className="action-icon" />
            <span className="action-label">Cart</span>
            {itemCount > 0 && <span className="cart-count" aria-label={`${itemCount} items in cart`}>{itemCount}</span>}
          </Link>

          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}
          <div className="nav-profile-wrapper" ref={menuRef}>

            <button
              type="button"
              className="nav-profile"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              <img
                src="/Sipho.png"
                alt={`${userName} profile`}
                className="profile-avatar-image"
              />

              <span className="profile-name">{userName}</span>

              <FaChevronDown
                className={`profile-chevron ${isMenuOpen ? "open" : ""}`}
              />
            </button>

            {isMenuOpen && (
              <div className="profile-dropdown">
                <Link
                  to="/profile"
                  className="profile-dropdown-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="dropdown-icon" />
                  Profile
                </Link>

                <Link
                  to="/switch-user"
                  className="profile-dropdown-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaExchangeAlt className="dropdown-icon" />
                  Switch User
                </Link>

                <button
                  type="button"
                  className="profile-dropdown-item logout"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // TODO: hook this up to your actual logout logic
                    console.log("Logging out...");
                  }}
                >
                  <FaSignOutAlt className="dropdown-icon" />
                  Log Out
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* =====================================================
          SECOND NAVIGATION
      ===================================================== */}
      {showLinks && (
        <div className="nav-links-row">

          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Browse Listings
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Categories
          </NavLink>

          {/* <NavLink
            to="/bulletin-board"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Bulletin Board
          </NavLink> */}

          {/* <NavLink
            to="/announcements"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Announcements
          </NavLink> */}

          {/* <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Events
          </NavLink> */}

          {/* <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Services
          </NavLink> */}

          {/* <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            My Orders
          </NavLink> */}

          {/* <NavLink
            to="/my-listings"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            My Listings
          </NavLink> */}

          {/* <NavLink
            to="/ratings-reviews"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Ratings & Reviews
          </NavLink> */}

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Contact
          </NavLink>

        </div>
      )}
    </>
  );
}