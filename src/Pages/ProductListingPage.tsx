// import React from 'react';
import './ProductListingPage.css';
import { useNavigate } from "react-router-dom";
// import { useNavigate, useLocation } from "react-router-dom";
import SideNavigation from "../Components/SideNavigation";
import { FaCog, FaBell } from "react-icons/fa";
import ImageUploader from "../Components/ImageUploader";
// import {useState } from 'react';

function ProductListingPage() {
  const navigate = useNavigate();
  // const location = useLocation();
  // const { cartCount } = useCart();

  // const [formData, setFormData] = useState({
  //   id: listingData.id || 1,
  //   name: listingData.name || "",
  //   vehicle: listingData.vehicle || "",
  //   price: listingData.price || "",
  //   image: listingData.image || "",
  //   views: listingData.views || 0,
  //   likes: listingData.likes || 0,
  //   description: listingData.description || "",
  //   category: listingData.category || "",
  //   condition: listingData.condition || "",
  //   year: listingData.year || "",
  //   location: listingData.location || "",
  //   gender: listingData.gender || "",
  //   quantity: listingData.quantity || "",
  //   isActive: true
  // });

  return (
    <div className="listing-app-container">
      {/* Sidebar */}
      <SideNavigation />

      {/* Main Content */}
      <main className="listing-main-content">
        {/* Header */}
        <header className="listing-top-header">
          <div className="listing-header-left">
            <button className="listing-close-btn" onClick={() => navigate("/my-listings")}>×</button>
            <h1>Product Listing</h1>
          </div>
          <div className="listing-header-right">
            <FaBell className='listing-notification' onClick={() => navigate("/register")} />
            <FaCog className='listing-settings' />
            <div className="listing-icon-btn user-icon">
              <img src="https://i.pravatar.cc/150?img=12" alt="User" className='listing-profile' onClick={() => navigate("/profile")}/>
            </div>
          </div>
        </header>

        <div className="listing-scrollable-area">
          {/* Action Buttons */}
          <div className="listing-action-bar">
            <button className="listing-btn-draft">Save Draft</button>
            <button className="listing-btn-list">List product</button>
          </div>

          <div className="listing-form-grid">
            {/* Left Column: Forms */}
            <div className="listing-form-column">
              <div className="listing-card">
                <h3 className="listing-card-title">General Information</h3>
                <div className="listing-form-group">
                  <label>Product Name</label>
                  <input type="text" className="listing-form-input" />
                </div>
                <div className="listing-form-group">
                  <label>Description</label>
                  <input type="text" className="listing-form-input" />
                </div>

                <div className="listing-form-group">
                  <label>Location</label>
                  <select className="listing-form-select">
                    <option>Select Location</option>
                    <option>Bellville</option>
                    <option>District 6</option>
                    <option>Granger Bay</option>
                    <option>Mowbray</option>
                    <option>NewLands</option>
                    <option>Wellington</option>
                    </select>
                </div>

                <div className="listing-form-group">
                  <label>Category</label>
                  <select className="listing-form-select">
                    <option>Select Category</option>
                  <option>Books & Media</option>
                  <option>Clothes</option>
                  <option>Electronics</option>
                  <option>Furniture </option>
                  <option>Home Essentials</option>
                  <option>Jewelry & Watches</option>
                  <option>Office Supplies </option>
                  <option>Sports & Outdoors</option>
                  <option>Toys & Games</option>
                  <option>Other</option>
                  </select>
                </div>

                <div className="listing-form-group">
                  <label>Gender (Optional)</label>
                  <div className="listing-radio-group">
                    <label className="listing-radio-label">
                      <input type="radio" name="gender" /> Female
                    </label>
                    <label className="listing-radio-label">
                      <input type="radio" name="gender" /> Bisexual
                    </label>
                    <label className="listing-radio-label">
                      <input type="radio" name="gender" /> Unisex
                    </label>
                    <label className="listing-radio-label">
                      <input type="radio" name="gender" /> Not Applicable
                    </label>
                  </div>
                </div>
              </div>

              <div className="listing-card">
                <h3 className="listing-card-title">Pricing & Stock</h3>
                <div className="listing-price-stock-row">
                  <div className="listing-form-group">
                    <label>Price</label>
                    <input type="text" className="listing-form-input" />
                  </div>
                  <div className="listing-form-group">
                    <label>Quantity</label>
                    <input type="text" className="listing-form-input" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Image Upload */}
            <div className="listing-image-column">
              <div className="listing-card-upload-card">
                <ImageUploader />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductListingPage;