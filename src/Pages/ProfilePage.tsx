import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";

// @ts-expect-error - SideNav.jsx has no type declarations
import SideNav from "../Components/SideNav";

import "./ProfilePage.css";

import {
  FaArrowLeft,
  FaBell,
  FaCog,
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaTrash,
} from "react-icons/fa";


/* =========================================================
   SIPHO PROFILE IMAGE
   Use the SAME image everywhere in the application.

   File must physically live at: public/assets/Sipho.png
========================================================= */

const SIPHO_PROFILE_IMAGE = "/Sipho.png";


/* =========================================================
   FAVOURITE BRANDS

   Files must physically live at:
   public/assets/adidas.png
   public/assets/puma.png
   public/assets/nike.png
========================================================= */

const FAVOURITE_BRANDS = [
  {
    name: "Audi",
    image: "audi.png",
  },
  {
    name: "Toyota",
    image: "toyota.png",
  },
  {
    name: "BMW",
    image: "bmw.png",
  },
];


export default function ProfilePage() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [rating] = useState(3);

  const [profileImageError, setProfileImageError] =
    useState(false);


  /* =======================================================
     HANDLERS
  ======================================================= */

  const handleBack = () => {
    navigate(-1);
  };


  const handleEditProfile = () => {
    alert("Edit Profile coming soon.");
  };


  const handleMyProducts = () => {
    navigate("/my-listings");
  };


  const handleSettings = () => {
    alert("Settings coming soon.");
  };


  const handleNotifications = () => {
    alert("Notifications coming soon.");
  };


  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (confirmed) {
      alert("Account deletion would be processed here.");
    }
  };


  /* =======================================================
     IMAGE ERROR HANDLERS
  ======================================================= */

  const handleProfileImageError = () => {
    setProfileImageError(true);
  };

  const handleBrandImageError = (
    event: SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.style.display = "none";
  };


  /* =======================================================
     PROFILE IMAGE RENDERER
     Accepts the classnames needed for each place the image
     is used (small top avatar vs. large card photo), so the
     <img> always gets sized/clipped correctly by CSS.
  ======================================================= */

  const renderProfileImage = (
    imgClassName: string,
    fallbackClassName: string
  ) =>
    !profileImageError ? (
      <img
        src={SIPHO_PROFILE_IMAGE}
        alt="Sipho Khubeka"
        className={imgClassName}
        onError={handleProfileImageError}
      />
    ) : (
      <span className={fallbackClassName}>S</span>
    );


  return (
    <div className="profile-page">
      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <div className="profile-page-content">

        <main className="profile-main">

          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <header className="profile-topbar">

            {/* BACK */}

            <button
              type="button"
              className="profile-back-button"
              onClick={handleBack}
            >
              <FaArrowLeft />

              <span>
                Profile
              </span>
            </button>


            {/* TOP ACTIONS */}

            <div className="profile-top-actions">

              {/* NOTIFICATIONS */}

              <button
                type="button"
                aria-label="Notifications"
                onClick={handleNotifications}
                className="profile-action-button"
              >
                <FaBell />

                <span className="notification-dot" />
              </button>


              {/* SETTINGS */}

              <button
                type="button"
                aria-label="Settings"
                onClick={handleSettings}
                className="profile-action-button"
              >
                <FaCog />
              </button>


              {/* SIPHO PROFILE IMAGE (small, top-right) */}

              <button
                type="button"
                className="top-avatar"
                onClick={() => navigate("/profile")}
                aria-label="Open profile"
              >
                {renderProfileImage("", "profile-image-fallback")}
              </button>

            </div>

          </header>


          {/* =================================================
              PROFILE BANNER
          ================================================= */}

          <section className="profile-banner">

            <button
              type="button"
              className="edit-profile-button"
              onClick={handleEditProfile}
            >
              <FaEdit />

              <span>
                Edit Profile
              </span>
            </button>

          </section>


          {/* =================================================
              PROFILE CONTENT
          ================================================= */}

          <div className="profile-content">


            {/* =================================================
                LEFT PROFILE CARD
            ================================================= */}

            <section className="profile-card">

              {/* =================================================
                  LARGE SIPHO PROFILE IMAGE

                  Same image as the top-right avatar.
              ================================================= */}

              <div className="profile-photo-wrapper">

                {renderProfileImage(
                  "profile-photo",
                  "profile-photo-fallback"
                )}

              </div>


              {/* NAME */}

              <h1 className="profile-user-name">
                Sipho Khubeka
              </h1>


              {/* ROLE */}

              <p className="profile-role">
                Student Seller
              </p>


              {/* BIO */}

              <p className="profile-bio">
                Curating quality products that blend
                style, value, and practicality. I'm
                committed to offering items you'll love,
                backed by excellent service and a
                smooth shopping experience.
              </p>


              {/* =================================================
                  PRODUCT RANKING
              ================================================= */}

              <div className="product-ranking">

                <h2>
                  Your Product Rankings
                </h2>


                <div
                  className="ranking-stars"
                  aria-label={`${rating} out of 5 stars`}
                >

                  {Array.from({ length: 5 }).map(
                    (_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index < rating
                            ? "ranking-star ranking-star-filled"
                            : "ranking-star"
                        }
                      />
                    )
                  )}

                </div>


                <span className="rating-text">
                  {rating}.0 / 5.0
                </span>

              </div>


              {/* MY PRODUCTS */}

              <button
                type="button"
                className="my-products-button"
                onClick={handleMyProducts}
              >
                My Products
              </button>


              {/* DELETE */}

              <button
                type="button"
                className="delete-account-button"
                onClick={handleDeleteAccount}
              >
                <FaTrash />

                <span>
                  Delete Account
                </span>
              </button>

            </section>


            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <div className="profile-right">


              {/* =================================================
                  DETAILS CARD
              ================================================= */}

              <section className="details-card">

                <div className="profile-section-heading">

                  <h2>
                    My Details
                  </h2>

                  <button
                    type="button"
                    className="settings-button"
                    aria-label="Profile settings"
                    onClick={handleSettings}
                  >
                    <FaCog />
                  </button>

                </div>


                <div className="details-list">

                  {/* PHONE */}

                  <div className="detail-row">

                    <FaPhone className="detail-icon" />

                    <div className="detail-content">

                      <span className="detail-label">
                        Phone
                      </span>

                      <span className="detail-value">
                        +27 734 634 763
                      </span>

                    </div>

                  </div>


                  {/* LOCATION */}

                  <div className="detail-row">

                    <FaMapMarkerAlt className="detail-icon" />

                    <div className="detail-content">

                      <span className="detail-label">
                        Location
                      </span>

                      <span className="detail-value">
                        Cape Town
                      </span>

                    </div>

                  </div>


                  {/* EMAIL */}

                  <div className="detail-row">

                    <FaEnvelope className="detail-icon" />

                    <div className="detail-content">

                      <span className="detail-label">
                        Email
                      </span>

                      <span className="detail-value">
                        siphokhubeka@gmail.com
                      </span>

                    </div>

                  </div>

                </div>

              </section>


              {/* =================================================
                  FAVOURITE BRANDS
              ================================================= */}

              <section className="brands-card">

                <div className="brands-heading">

                  <h2>
                    Favourite Brands
                  </h2>

                </div>


                <div className="brands-row">

                  {FAVOURITE_BRANDS.map(
                    (brand) => (
                      <div
                        className="brand-logo"
                        key={brand.name}
                      >
                        <img
                          src={brand.image}
                          alt={brand.name}
                          onError={handleBrandImageError}
                        />
                      </div>
                    )
                  )}

                </div>

              </section>


              {/* =================================================
                  PROFILE INFORMATION
              ================================================= */}

              <section className="profile-info-card">

                <div className="info-item">

                  <strong>
                    Member since
                  </strong>

                  <span>
                    2025
                  </span>

                </div>


                <div className="info-divider" />


                <div className="info-item">

                  <strong>
                    Products listed
                  </strong>

                  <span>
                    12
                  </span>

                </div>


                <div className="info-divider" />


                <div className="info-item">

                  <strong>
                    Reviews received
                  </strong>

                  <span>
                    128
                  </span>

                </div>

              </section>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}