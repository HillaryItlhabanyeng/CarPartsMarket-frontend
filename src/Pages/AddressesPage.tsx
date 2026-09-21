import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import SideNavigation from "../Components/SideNavigation";
import UserInitialsBadge from "../Components/UserInitialsBadge";
import NotificationBell from "../Components/NotificationBell";

import "../Components/DashboardShell.css";
import "./AddressesPage.css";

import { FaCog, FaMapMarkerAlt, FaTrash, FaPlus } from "react-icons/fa";

type Address = {
  id: number;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
};

const STORAGE_KEY = "marketplace_addresses";

function readAddresses(): Address[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function AddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>(() => readAddresses());
  const [showForm, setShowForm] = useState(false);

  const persist = (next: Address[]) => {
    setAddresses(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const label = String(formData.get("label") || "").trim();
    const street = String(formData.get("street") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const postalCode = String(formData.get("postalCode") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    if (!label || !street || !city || !postalCode) {
      alert("Please complete all required address fields.");
      return;
    }

    const newAddress: Address = {
      id: Date.now(),
      label,
      street,
      city,
      postalCode,
      phone,
    };

    persist([newAddress, ...addresses]);
    event.currentTarget.reset();
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    persist(addresses.filter((address) => address.id !== id));
  };

  return (
    <div className="dash-app-container">
      <SideNavigation />

      <main className="dash-main-content">
        <header className="dash-top-header">
          <div className="dash-header-left">
            <h1>Addresses</h1>
            <p>Manage the addresses linked to your account</p>
          </div>
          <div className="dash-header-right">
            <NotificationBell />
            <FaCog className="dash-settings" onClick={() => navigate("/settings")} />
            <UserInitialsBadge />
          </div>
        </header>

        <div className="dash-scrollable-area">
          <div className="addr-action-bar">
            <button
              type="button"
              className="addr-add-btn"
              onClick={() => setShowForm((previous) => !previous)}
            >
              <FaPlus /> {showForm ? "Cancel" : "Add Address"}
            </button>
          </div>

          {showForm && (
            <form className="dash-card addr-form" onSubmit={handleAdd}>
              <h3 className="dash-card-title">New Address</h3>
              <div className="addr-form-grid">
                <div className="addr-form-group">
                  <label htmlFor="label">Label</label>
                  <input id="label" name="label" type="text" placeholder="Home, Campus, ..." />
                </div>
                <div className="addr-form-group">
                  <label htmlFor="phone">Phone (optional)</label>
                  <input id="phone" name="phone" type="tel" placeholder="081 234 5678" />
                </div>
                <div className="addr-form-group addr-form-group-wide">
                  <label htmlFor="street">Street Address</label>
                  <input id="street" name="street" type="text" placeholder="12 Campus Road" />
                </div>
                <div className="addr-form-group">
                  <label htmlFor="city">City</label>
                  <input id="city" name="city" type="text" placeholder="Bellville" />
                </div>
                <div className="addr-form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input id="postalCode" name="postalCode" type="text" placeholder="7535" />
                </div>
              </div>
              <button type="submit" className="addr-save-btn">Save Address</button>
            </form>
          )}

          {addresses.length === 0 ? (
            <div className="dash-card addr-empty">
              <FaMapMarkerAlt className="addr-empty-icon" />
              <p>You haven't added any addresses yet.</p>
            </div>
          ) : (
            <div className="addr-grid">
              {addresses.map((address) => (
                <div className="addr-card" key={address.id}>
                  <div className="addr-card-header">
                    <span className="addr-card-label">{address.label}</span>
                    <button
                      type="button"
                      className="addr-delete-btn"
                      onClick={() => handleDelete(address.id)}
                      aria-label={`Delete ${address.label} address`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <p className="addr-card-street">{address.street}</p>
                  <p className="addr-card-city">{address.city}, {address.postalCode}</p>
                  {address.phone && <p className="addr-card-phone">{address.phone}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddressesPage;
