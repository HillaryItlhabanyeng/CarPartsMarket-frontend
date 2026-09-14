import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiBell,
  FiShoppingCart,
  FiChevronDown,
  FiUser,
  FiRepeat,
  FiLogOut,
  FiMapPin,
} from "react-icons/fi";

import { useCart } from "./useCart";
import "./Navbar.css";

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

  /* =====================================================
     CLOSE PROFILE MENU WHEN CLICKING OUTSIDE
  ===================================================== */

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

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =====================================================
     SEARCH
  ===================================================== */

  function handleSearch() {
    const query = search.trim();

    if (query) {
      navigate(
        `/shop?search=${encodeURIComponent(query)}`
      );
    } else {
      navigate("/shop");
    }
  }

  return (
    <header className="site-header">

      {/* =================================================
          MAIN NAVBAR
      ================================================= */}

      <nav className="navbar">

        {/* LOGO */}
        <Link to="/home" className="navbar-logo">

          <img
            src="/automarket - logo.png"
            alt="AutoMarket"
            className="navbar-logo-image"
          />

        </Link>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="navbar-search">

          <FiSearch className="search-icon" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search for car parts, brands, or vehicles..."
            aria-label="Search"
          />

          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search"
          >
            Search
          </button>

        </div>


        {/* =================================================
            RIGHT SIDE ACTIONS
        ================================================= */}

        <div className="navbar-actions">


          {/* ADDRESS */}

          <Link
            to="/address"
            className="nav-action"
          >
            <FiMapPin className="action-icon" />

            <span className="action-label">
              Address
            </span>
          </Link>


          {/* NOTIFICATIONS */}

          <Link
            to="/notifications"
            className="nav-action"
          >
            <FiBell className="action-icon" />

            <span className="action-label">
              Notifications
            </span>
          </Link>


          {/* CART */}

          <Link
            to="/cart"
            className="nav-action nav-cart-action"
          >

            <span className="icon-wrapper">

              <FiShoppingCart className="action-icon" />

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


          {/* =================================================
              PROFILE
          ================================================= */}

          <div
            className="nav-profile-wrapper"
            ref={menuRef}
          >

            <button
              type="button"
              className="nav-profile"
              onClick={() =>
                setIsMenuOpen((open) => !open)
              }
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >

              <span className="profile-icon">
                <FiUser />
              </span>

              <span className="profile-name">
                {userName}
              </span>

              <FiChevronDown
                className={`profile-chevron ${
                  isMenuOpen ? "open" : ""
                }`}
              />

            </button>


            {/* PROFILE DROPDOWN */}

            {isMenuOpen && (
              <div className="profile-dropdown">

                <Link
                  to="/profile"
                  className="profile-dropdown-item"
                  onClick={() =>
                    setIsMenuOpen(false)
                  }
                >

                  <FiUser />

                  <span>
                    Profile
                  </span>

                </Link>


                <Link
                  to="/switch-user"
                  className="profile-dropdown-item"
                  onClick={() =>
                    setIsMenuOpen(false)
                  }
                >

                  <FiRepeat />

                  <span>
                    Switch User
                  </span>

                </Link>


                <button
                  type="button"
                  className="profile-dropdown-item logout"
                  onClick={() => {
                    setIsMenuOpen(false);

                    // Add your logout logic here
                    console.log("Logging out...");
                  }}
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


      {/* =====================================================
          SECOND NAVIGATION
      ===================================================== */}

      {showLinks && (
        <nav className="nav-links-row">

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


          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Contact
          </NavLink>

        </nav>
      )}

    </header>
  );
}