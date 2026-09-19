import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCog,
  FaMapMarkerAlt,
  FaPencilAlt,
  FaTrash,
  FaSignOutAlt,
  FaChevronRight,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaShoppingBag,
  FaStore,
} from "react-icons/fa";

import "./ProfilePage.css";

type UserRole = "buyer" | "seller" | "admin";

type StoredUser = {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  phoneNumber?: string;
  location?: string;
  role?: string;
};

type Address = {
  id: number;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  phone?: string;
};

type RoleConfig = {
  label: string;
  description: string;
  primaryAction: string;
  primaryPath: string;
  statOneLabel: string;
  statOneValue: string;
  statTwoLabel: string;
  statTwoValue: string;
};

const USER_KEYS = [
  "marketplace_current_user",
  "automarketUser",
];

const ADDRESS_KEY = "marketplace_addresses";

const roleConfig: Record<UserRole, RoleConfig> = {
  buyer: {
    label: "Buyer",
    description: "Shop for quality car parts and manage your orders.",
    primaryAction: "Browse Products",
    primaryPath: "/shop",
    statOneLabel: "Orders",
    statOneValue: "0",
    statTwoLabel: "Saved Items",
    statTwoValue: "0",
  },

  seller: {
    label: "Seller",
    description: "Manage your products, listings and customer orders.",
    primaryAction: "Manage Listings",
    primaryPath: "/my-listings",
    statOneLabel: "Products",
    statOneValue: "0",
    statTwoLabel: "Orders Received",
    statTwoValue: "0",
  },

  admin: {
    label: "Administrator",
    description: "Manage users, products and marketplace operations.",
    primaryAction: "Admin Dashboard",
    primaryPath: "/admin",
    statOneLabel: "Users",
    statOneValue: "0",
    statTwoLabel: "Listings",
    statTwoValue: "0",
  },
};

function normalizeRole(role?: string): UserRole {
  const normalized = String(role || "").toLowerCase();

  if (
    normalized === "seller" ||
    normalized === "vendor"
  ) {
    return "seller";
  }

  if (
    normalized === "admin" ||
    normalized === "administrator"
  ) {
    return "admin";
  }

  return "buyer";
}

function readStoredUser(): StoredUser | null {
  try {
    for (const key of USER_KEYS) {
      const raw = window.localStorage.getItem(key);

      if (!raw) {
        continue;
      }

      const parsed = JSON.parse(raw);

      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function readAddresses(): Address[] {
  try {
    const raw = window.localStorage.getItem(ADDRESS_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getUserName(user: StoredUser) {
  const firstName = user.firstName?.trim() || "";
  const lastName = user.lastName?.trim() || "";

  if (firstName || lastName) {
    return `${firstName} ${lastName}`.trim();
  }

  if (user.name?.trim()) {
    return user.name.trim();
  }

  return "AutoMarket User";
}

function getInitials(user: StoredUser) {
  const firstName = user.firstName?.trim() || "";
  const lastName = user.lastName?.trim() || "";

  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase()
      .trim();
  }

  if (user.name?.trim()) {
    const parts = user.name.trim().split(/\s+/);

    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  }

  return "AU";
}

function getPhone(user: StoredUser) {
  return (
    user.mobile ||
    user.phone ||
    user.phoneNumber ||
    "Not provided"
  );
}

function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<StoredUser | null>(() =>
    readStoredUser()
  );

  const [addresses, setAddresses] = useState<Address[]>(() =>
    readAddresses()
  );

  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const role = normalizeRole(user?.role);

  const config = roleConfig[role];

  const fullName = user ? getUserName(user) : "AutoMarket User";

  const initials = user ? getInitials(user) : "AU";

  const phone = user ? getPhone(user) : "Not provided";

  const primaryAddress = addresses[0];

  const addressText = primaryAddress
    ? `${primaryAddress.city}, ${primaryAddress.postalCode}`
    : "No address added";

  useEffect(() => {
    if (!user) {
      return;
    }

    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobile: user.mobile || user.phone || user.phoneNumber || "",
    });
  }, [user]);

  useEffect(() => {
    const refreshUser = () => {
      setUser(readStoredUser());
      setAddresses(readAddresses());
    };

    window.addEventListener("storage", refreshUser);
    window.addEventListener(
      "automarket-user-updated",
      refreshUser
    );
    window.addEventListener(
      "automarket-address-updated",
      refreshUser
    );

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener(
        "automarket-user-updated",
        refreshUser
      );
      window.removeEventListener(
        "automarket-address-updated",
        refreshUser
      );
    };
  }, []);

  const initialsClass = useMemo(() => {
    return initials.length === 1
      ? "profile-avatar profile-avatar-single"
      : "profile-avatar";
  }, [initials]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveProfile = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    const updatedUser: StoredUser = {
      ...user,
      firstName: editForm.firstName.trim(),
      lastName: editForm.lastName.trim(),
      email: editForm.email.trim(),
      mobile: editForm.mobile.trim(),
    };

    window.localStorage.setItem(
      "automarketUser",
      JSON.stringify(updatedUser)
    );

    window.localStorage.setItem(
      "marketplace_current_user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setIsEditing(false);

    window.dispatchEvent(
      new Event("automarket-user-updated")
    );
  };

  const handleLogout = () => {
    window.localStorage.removeItem(
      "automarketUser"
    );

    window.localStorage.removeItem(
      "marketplace_current_user"
    );

    window.localStorage.removeItem(
      "marketplace_token"
    );

    window.localStorage.removeItem("authToken");

    navigate("/login");
  };

  const handleDeleteAccount = () => {
    window.localStorage.removeItem(
      "automarketUser"
    );

    window.localStorage.removeItem(
      "marketplace_current_user"
    );

    window.localStorage.removeItem(
      "marketplace_addresses"
    );

    window.localStorage.removeItem(
      "marketplace_token"
    );

    window.localStorage.removeItem("authToken");

    setShowDeleteModal(false);

    navigate("/register");
  };

  if (!user) {
    return (
      <div className="profile-page">
        <header className="profile-page-header">
          <button
            type="button"
            className="profile-back-button"
            onClick={handleBack}
            aria-label="Go back"
          >
            <FaTimes />
          </button>

          <h1>Profile</h1>
        </header>

        <main className="profile-content">
          <section className="profile-empty-card">
            <div className="profile-empty-icon">
              <FaShieldAlt />
            </div>

            <h2>No profile found</h2>

            <p>
              Please sign in to view your AutoMarket profile.
            </p>

            <button
              type="button"
              className="profile-primary-button"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* PAGE HEADER */}
      <header className="profile-page-header">
        <button
          type="button"
          className="profile-back-button"
          onClick={handleBack}
          aria-label="Go back"
        >
          <FaTimes />
        </button>

        <h1>Profile</h1>
      </header>

      <main className="profile-content">

        {/* PROFILE SUMMARY */}
        <section className="profile-summary-card">

          <div className={initialsClass}>
            {initials}
          </div>

          <div className="profile-summary-info">
            <div className="profile-name-row">
              <h2>{fullName}</h2>

              <span className="profile-role-badge">
                {config.label}
              </span>
            </div>

            <p className="profile-summary-description">
              {config.description}
            </p>

            <div className="profile-contact-row">

              {user.email && (
                <span>
                  <FaEnvelope />
                  {user.email}
                </span>
              )}

              <span>
                <FaPhone />
                {phone}
              </span>

              <span>
                <FaMapMarkerAlt />
                {addressText}
              </span>

            </div>
          </div>

          <button
            type="button"
            className="profile-edit-button"
            onClick={() => setIsEditing((previous) => !previous)}
          >
            <FaPencilAlt />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>

        </section>

        {/* EDIT PROFILE */}
        {isEditing && (
          <section className="profile-card profile-edit-card">

            <div className="profile-card-header">
              <div>
                <h3>Edit Profile</h3>
                <p>
                  Update the information linked to your account.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>

              <div className="profile-form-grid">

                <div className="profile-form-group">
                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={editForm.firstName}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="lastName">
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={editForm.lastName}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="mobile">
                    Mobile Number
                  </label>

                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={editForm.mobile}
                    onChange={handleEditChange}
                    required
                  />
                </div>

              </div>

              <div className="profile-form-actions">

                <button
                  type="button"
                  className="profile-secondary-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-primary-button"
                >
                  Save Changes
                </button>

              </div>

            </form>
          </section>
        )}

        {/* STATS */}
        <section className="profile-stats-grid">

          <div className="profile-stat-card">
            <span className="profile-stat-label">
              {config.statOneLabel}
            </span>

            <strong>{config.statOneValue}</strong>
          </div>

          <div className="profile-stat-card">
            <span className="profile-stat-label">
              {config.statTwoLabel}
            </span>

            <strong>{config.statTwoValue}</strong>
          </div>

        </section>

        {/* ACCOUNT INFORMATION */}
        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <h3>Account Information</h3>

              <p>
                Your personal details associated with AutoMarket.
              </p>
            </div>
          </div>

          <div className="profile-information-grid">

            <div className="profile-information-item">
              <span className="profile-information-label">
                First Name
              </span>

              <strong>
                {user.firstName || "Not provided"}
              </strong>
            </div>

            <div className="profile-information-item">
              <span className="profile-information-label">
                Last Name
              </span>

              <strong>
                {user.lastName || "Not provided"}
              </strong>
            </div>

            <div className="profile-information-item">
              <span className="profile-information-label">
                Email
              </span>

              <strong>
                {user.email || "Not provided"}
              </strong>
            </div>

            <div className="profile-information-item">
              <span className="profile-information-label">
                Mobile
              </span>

              <strong>
                {phone}
              </strong>
            </div>

            <div className="profile-information-item">
              <span className="profile-information-label">
                Account Type
              </span>

              <strong>
                {config.label}
              </strong>
            </div>

          </div>

        </section>

        {/* ADDRESSES */}
        <section className="profile-card">

          <div className="profile-card-header profile-card-header-action">

            <div>
              <h3>Saved Addresses</h3>

              <p>
                Manage the addresses used for your orders.
              </p>
            </div>

            <button
              type="button"
              className="profile-text-button"
              onClick={() => navigate("/addresses")}
            >
              Manage
              <FaChevronRight />
            </button>

          </div>

          {addresses.length === 0 ? (
            <div className="profile-empty-address">

              <FaMapMarkerAlt />

              <div>
                <strong>No saved addresses</strong>

                <p>
                  Add an address for faster checkout.
                </p>
              </div>

              <button
                type="button"
                className="profile-secondary-button"
                onClick={() => navigate("/addresses")}
              >
                Add Address
              </button>

            </div>
          ) : (
            <div className="profile-address-list">

              {addresses.slice(0, 2).map((address) => (
                <div
                  className="profile-address-item"
                  key={address.id}
                >

                  <div className="profile-address-icon">
                    <FaMapMarkerAlt />
                  </div>

                  <div className="profile-address-content">

                    <strong>
                      {address.label}
                    </strong>

                    <p>
                      {address.street}
                    </p>

                    <p>
                      {address.city},{" "}
                      {address.postalCode}
                    </p>

                    {address.phone && (
                      <small>
                        {address.phone}
                      </small>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* ACCOUNT SETTINGS */}
        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <h3>Account Settings</h3>

              <p>
                Manage your preferences and account options.
              </p>
            </div>
          </div>

          <div className="profile-settings-list">

            <button
              type="button"
              className="profile-setting-row"
              onClick={() => navigate("/settings")}
            >
              <span className="profile-setting-icon">
                <FaCog />
              </span>

              <span className="profile-setting-content">
                <strong>Settings</strong>
                <small>
                  Manage your account preferences
                </small>
              </span>

              <FaChevronRight className="profile-setting-arrow" />
            </button>

            <button
              type="button"
              className="profile-setting-row"
              onClick={() => navigate("/notifications")}
            >
              <span className="profile-setting-icon">
                <FaBell />
              </span>

              <span className="profile-setting-content">
                <strong>Notifications</strong>
                <small>
                  View your marketplace notifications
                </small>
              </span>

              <FaChevronRight className="profile-setting-arrow" />
            </button>

            <div className="profile-setting-row profile-setting-toggle">

              <span className="profile-setting-icon">
                <FaBell />
              </span>

              <span className="profile-setting-content">
                <strong>Notification Preferences</strong>
                <small>
                  Receive important account updates
                </small>
              </span>

              <button
                type="button"
                className={`profile-toggle ${
                  notificationsEnabled
                    ? "profile-toggle-active"
                    : ""
                }`}
                onClick={() =>
                  setNotificationsEnabled(
                    (previous) => !previous
                  )
                }
                aria-label="Toggle notifications"
              >
                <span />
              </button>

            </div>

          </div>

        </section>

        {/* ROLE ACTION */}
        <section className="profile-role-card">

          <div className="profile-role-icon">
            {role === "seller" ? (
              <FaStore />
            ) : role === "admin" ? (
              <FaShieldAlt />
            ) : (
              <FaShoppingBag />
            )}
          </div>

          <div className="profile-role-content">

            <span className="profile-role-small">
              {config.label}
            </span>

            <h3>
              {config.primaryAction}
            </h3>

            <p>
              {config.description}
            </p>

          </div>

          <button
            type="button"
            className="profile-primary-button"
            onClick={() =>
              navigate(config.primaryPath)
            }
          >
            {config.primaryAction}
          </button>

        </section>

        {/* LOGOUT */}
        <section className="profile-logout-section">

          <button
            type="button"
            className="profile-logout-button"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Sign Out
          </button>

        </section>

        {/* DELETE ACCOUNT */}
        <section className="profile-danger-card">

          <div>
            <h3>Delete Account</h3>

            <p>
              Permanently remove your AutoMarket account
              and saved account information from this browser.
            </p>
          </div>

          <button
            type="button"
            className="profile-delete-button"
            onClick={() => setShowDeleteModal(true)}
          >
            <FaTrash />
            Delete Account
          </button>

        </section>

      </main>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div
          className="profile-modal-overlay"
          onMouseDown={() => setShowDeleteModal(false)}
        >

          <div
            className="profile-delete-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="profile-modal-icon">
              <FaTrash />
            </div>

            <h2>Delete your account?</h2>

            <p>
              This will remove your saved AutoMarket
              account information from this browser.
              This action cannot be undone.
            </p>

            <div className="profile-modal-actions">

              <button
                type="button"
                className="profile-secondary-button"
                onClick={() =>
                  setShowDeleteModal(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="profile-delete-confirm-button"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default ProfilePage;