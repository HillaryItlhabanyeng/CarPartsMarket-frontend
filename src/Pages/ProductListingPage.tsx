import './ProductListingPage.css';
import { useNavigate } from "react-router-dom";
import SideNavigation from "../Components/SideNavigation";
import { FaCog } from "react-icons/fa";
import ImageUploader from "../Components/ImageUploader";
import NotificationBell from "../Components/NotificationBell";
import { fileToDataUrl } from "../Components/imageUtils";
import { addNotification, ADMIN_NOTIFICATION_EMAIL } from "../Components/notificationStore";
import { partCategories } from "../data/partCategories";
import { carBrands } from "../data/carBrands";
import { useState } from "react";
import api from "../api/axiosInstance";

type StoredUser = {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

function readCurrentUser(): StoredUser | null {
  try {
    const raw = window.localStorage.getItem("marketplace_current_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getInitials(user: StoredUser | null): string {
  const name =
    user?.name?.trim() || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User";
  const parts = name.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
}

function ProductListingPage() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<File[]>([]);
  const initials = getInitials(readCurrentUser());

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("productName") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const brand = String(formData.get("brand") || "").trim();
    const price = Number(String(formData.get("price") || "0"));
    const quantity = Number(String(formData.get("quantity") || "0"));
    const condition = String(formData.get("condition") || "Used").trim();

    if (!title || !description || !location || !category || !price || !quantity) {
      alert("Please complete all required listing fields before submitting.");
      return;
    }

    if (photos.length === 0) {
      alert("Please upload at least one photo of the part.");
      return;
    }

    const currentUser = readCurrentUser();

    const categoryId = partCategories.indexOf(category) + 1;
    const model = brand || "Unspecified";

    const sellerId =
      (currentUser as any)?.id ||
      (currentUser as any)?.userid ||
      currentUser?.email ||
      "";

    if (!sellerId) {
      alert("Your session has expired. Please log in again.");
      navigate("/login");
      return;
    }

    // Convert the first photo to a data URL, skip it if it's too large
    let imageDataUrl = "";
    try {
      const dataUrl = await fileToDataUrl(photos[0]);
      if (dataUrl.length <= 700_000) {
        imageDataUrl = dataUrl;
      } else {
        console.warn("First photo is too large to store (>500KB). Skipping image.");
      }
    } catch (err) {
      console.warn("Could not convert photo to data URL:", err);
    }

    const payload = {
      partName: title,
      description,
      price,
      stockQuantity: quantity,
      model,
      categoryId,
      sellerId,
      partCondition: condition,
      image: imageDataUrl,
    };

    try {
  await api.post("/carparts/create", payload);

      addNotification({
        type: "Listing",
        title: "New listing needs approval",
        body: `${currentUser?.name || "Seller"} submitted ${title} for review.`,
        recipientEmail: ADMIN_NOTIFICATION_EMAIL,
      });

      alert("Your product has been submitted for admin approval.");
      navigate("/my-listings");
    } catch (err) {
      console.error("Listing submission failed:", err);
      alert("Could not submit listing. Please try again.");
    }
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
            <NotificationBell />
            <FaCog className='listing-settings' />
            <div className="listing-icon-btn user-icon">
              <button
                type="button"
                className="listing-profile"
                onClick={() => navigate("/profile")}
                aria-label="Open profile"
              >
                {initials}
              </button>
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
                    <input
                      type="text"
                      name="location"
                      className="listing-form-input"
                      placeholder="e.g. Cape Town"
                    />
                  </div>

                  <div className="listing-form-group">
                    <label>Category</label>
                    <select name="category" className="listing-form-select" defaultValue="">
                      <option value="" disabled>Select Category</option>
                      {partCategories.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div className="listing-form-group">
                    <label>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      className="listing-form-input"
                      list="listing-brand-options"
                      placeholder="e.g. Toyota"
                    />
                    <datalist id="listing-brand-options">
                      {carBrands.map((item) => (
                        <option key={item} value={item} />
                      ))}
                    </datalist>
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
                  <ImageUploader onChange={setPhotos} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ProductListingPage;