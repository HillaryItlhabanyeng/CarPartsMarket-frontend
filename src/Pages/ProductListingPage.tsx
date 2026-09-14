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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("productName") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const price = Number(String(formData.get("price") || "0"));
    const quantity = Number(String(formData.get("quantity") || "0"));
    const condition = String(formData.get("condition") || "Used").trim();

    if (!title || !description || !location || !category || !price || !quantity) {
      alert("Please complete all required listing fields before submitting.");
      return;
    }

    const currentUser = (() => {
      try {
        const raw = window.localStorage.getItem("marketplace_current_user");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    const pendingProducts = (() => {
      try {
        const raw = window.localStorage.getItem("marketplace_pending_products");
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

    const product = {
      id: Date.now(),
      title,
      description,
      location,
      category,
      condition,
      price,
      quantity,
      seller: currentUser?.name || "Seller",
      sellerEmail: currentUser?.email || "",
      submitted: "Just now",
      image: "/engine.png",
    };

    window.localStorage.setItem(
      "marketplace_pending_products",
      JSON.stringify([product, ...pendingProducts])
    );

    alert("Your product has been submitted for admin approval.");
    navigate("/my-listings");
  };

  return (
    <div className="listing-app-container">
      <SideNavigation />

      <main className="listing-main-content">
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
          <form onSubmit={handleSubmit}>
            <div className="listing-action-bar">
              <button type="button" className="listing-btn-draft">Save Draft</button>
              <button type="submit" className="listing-btn-list">List product</button>
            </div>

            <div className="listing-form-grid">
              <div className="listing-form-column">
                <div className="listing-card">
                  <h3 className="listing-card-title">General Information</h3>
                  <div className="listing-form-group">
                    <label>Product Name</label>
                    <input type="text" name="productName" className="listing-form-input" />
                  </div>
                  <div className="listing-form-group">
                    <label>Description</label>
                    <input type="text" name="description" className="listing-form-input" />
                  </div>

                  <div className="listing-form-group">
                    <label>Location</label>
                    <select name="location" className="listing-form-select" defaultValue="">
                      <option value="" disabled>Select Location</option>
                      <option value="Bellville">Bellville</option>
                      <option value="District 6">District 6</option>
                      <option value="Granger Bay">Granger Bay</option>
                      <option value="Mowbray">Mowbray</option>
                      <option value="NewLands">NewLands</option>
                      <option value="Wellington">Wellington</option>
                    </select>
                  </div>

                  <div className="listing-form-group">
                    <label>Category</label>
                    <select name="category" className="listing-form-select" defaultValue="">
                      <option value="" disabled>Select Category</option>
                      <option value="Books & Media">Books & Media</option>
                      <option value="Clothes">Clothes</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Home Essentials">Home Essentials</option>
                      <option value="Jewelry & Watches">Jewelry & Watches</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Sports & Outdoors">Sports & Outdoors</option>
                      <option value="Toys & Games">Toys & Games</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="listing-form-group">
                    <label>Condition</label>
                    <select name="condition" className="listing-form-select" defaultValue="Used">
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Used">Used</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                </div>

                <div className="listing-card">
                  <h3 className="listing-card-title">Pricing & Stock</h3>
                  <div className="listing-price-stock-row">
                    <div className="listing-form-group">
                      <label>Price</label>
                      <input type="number" name="price" className="listing-form-input" min="1" />
                    </div>
                    <div className="listing-form-group">
                      <label>Quantity</label>
                      <input type="number" name="quantity" className="listing-form-input" min="1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="listing-image-column">
                <div className="listing-card-upload-card">
                  <ImageUploader />
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProductListingPage;