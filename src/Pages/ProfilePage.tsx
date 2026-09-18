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
} from "react-icons/fa";

import "./ProfilePage.css";

type UserRole = "buyer" | "seller" | "admin";

type User = {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    role: UserRole;
};

type Address = {
    id: number;
    label: string;
    street: string;
    city: string;
    postalCode: string;
    phone?: string;
};

const USER_STORAGE_KEY = "automarketUser";
const ADDRESS_STORAGE_KEY = "marketplace_addresses";

const roleConfig: Record<
    UserRole,
    {
        label: string;
        description: string;
        actionLabel: string;
        actionPath: string;
        statOneLabel: string;
        statTwoLabel: string;
    }
> = {
    buyer: {
        label: "Buyer",
        description: "Shop for quality car parts from trusted sellers.",
        actionLabel: "Browse Marketplace",
        actionPath: "/marketplace",
        statOneLabel: "Orders",
        statTwoLabel: "Favourites",
    },

    seller: {
        label: "Seller",
        description: "Manage your car parts and reach customers.",
        actionLabel: "Manage Products",
        actionPath: "/seller/products",
        statOneLabel: "Products",
        statTwoLabel: "Sales",
    },

    admin: {
        label: "Administrator",
        description: "Manage AutoMarket users, products and platform activity.",
        actionLabel: "Admin Dashboard",
        actionPath: "/admin",
        statOneLabel: "Users",
        statTwoLabel: "Products",
    },
};

function getStoredUser(): User | null {
    try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (!storedUser) {
            return null;
        }

        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser || typeof parsedUser !== "object") {
            return null;
        }

        const role: UserRole =
            parsedUser.role === "seller" || parsedUser.role === "admin"
                ? parsedUser.role
                : "buyer";

        return {
            firstName: String(parsedUser.firstName ?? ""),
            lastName: String(parsedUser.lastName ?? ""),
            email: String(parsedUser.email ?? ""),
            mobile: String(
                parsedUser.mobile ??
                parsedUser.phone ??
                parsedUser.phoneNumber ??
                ""
            ),
            role,
        };
    } catch {
        return null;
    }
}

function getStoredAddresses(): Address[] {
    try {
        const storedAddresses = localStorage.getItem(ADDRESS_STORAGE_KEY);

        if (!storedAddresses) {
            return [];
        }

        const parsedAddresses = JSON.parse(storedAddresses);

        return Array.isArray(parsedAddresses) ? parsedAddresses : [];
    } catch {
        return [];
    }
}

function ProfilePage() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(() => getStoredUser());
    const [addresses, setAddresses] = useState<Address[]>(() =>
        getStoredAddresses()
    );

    const [isEditing, setIsEditing] = useState(false);

    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const storedUser = getStoredUser();

        if (storedUser) {
            setUser(storedUser);

            setEditForm({
                firstName: storedUser.firstName,
                lastName: storedUser.lastName,
                email: storedUser.email,
                mobile: storedUser.mobile,
            });
        }

        setAddresses(getStoredAddresses());
    }, []);

    const initials = useMemo(() => {
        if (!user) {
            return "U";
        }

        const firstInitial = user.firstName.trim().charAt(0);
        const lastInitial = user.lastName.trim().charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase() || "U";
    }, [user]);

    const role = user?.role ?? "buyer";
    const currentRole = roleConfig[role];

    const handleEditChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSaveProfile = () => {
        if (!user) {
            return;
        }

        const updatedUser: User = {
            ...user,
            firstName: editForm.firstName.trim(),
            lastName: editForm.lastName.trim(),
            email: editForm.email.trim(),
            mobile: editForm.mobile.trim(),
        };

        if (
            !updatedUser.firstName ||
            !updatedUser.lastName ||
            !updatedUser.email ||
            !updatedUser.mobile
        ) {
            alert("Please complete all profile fields.");
            return;
        }

        localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        if (!user) {
            return;
        }

        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
        });

        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("automarketUser");
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");

        navigate("/login");
    };

    const handleDeleteAccount = () => {
        /*
         * This currently removes the locally stored account.
         * When your backend/database is connected, this function
         * should call the account deletion API instead.
         */

        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(ADDRESS_STORAGE_KEY);
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");

        setUser(null);
        setShowDeleteModal(false);

        navigate("/register");
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-empty-state">
                    <div className="profile-empty-avatar">U</div>

                    <h1>No Profile Found</h1>

                    <p>
                        Please register or log in to your AutoMarket
                        account to view your profile.
                    </p>

                    <button
                        type="button"
                        className="profile-primary-btn"
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* Header */}
            <header className="profile-top-header">
                <div className="profile-header-left">
                    <div>
                        <h1>My Profile</h1>
                        <p>Manage your AutoMarket account</p>
                    </div>
                </div>

                <div className="profile-header-right">
                    <button
                        type="button"
                        className="profile-header-icon"
                        aria-label="Notifications"
                        onClick={() => navigate("/notifications")}
                    >
                        <FaBell />
                    </button>

                    <button
                        type="button"
                        className="profile-header-icon"
                        aria-label="Settings"
                        onClick={() => navigate("/settings")}
                    >
                        <FaCog />
                    </button>

                    <button
                        type="button"
                        className="profile-header-avatar"
                        aria-label="My profile"
                    >
                        {initials}
                    </button>
                </div>
            </header>

            <main className="profile-content">
                {/* Profile Summary */}
                <section className="profile-summary-card">
                    <div className="profile-summary-main">
                        <div className="profile-avatar">
                            {initials}
                        </div>

                        <div className="profile-summary-info">
                            <div className="profile-name-row">
                                <h2>
                                    {user.firstName} {user.lastName}
                                </h2>

                                <span className="profile-role-badge">
                                    {currentRole.label}
                                </span>
                            </div>

                            <p className="profile-email">
                                {user.email}
                            </p>

                            <p className="profile-role-description">
                                {currentRole.description}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="profile-edit-btn"
                        onClick={() => setIsEditing(true)}
                    >
                        <FaPencilAlt />
                        Edit Profile
                    </button>
                </section>

                {/* Role Stats */}
                <section className="profile-stats-grid">
                    <div className="profile-stat-card">
                        <span className="profile-stat-label">
                            {currentRole.statOneLabel}
                        </span>

                        <strong className="profile-stat-value">
                            0
                        </strong>
                    </div>

                    <div className="profile-stat-card">
                        <span className="profile-stat-label">
                            {currentRole.statTwoLabel}
                        </span>

                        <strong className="profile-stat-value">
                            0
                        </strong>
                    </div>
                </section>

                {/* Personal Information */}
                <section className="profile-card">
                    <div className="profile-card-header">
                        <div>
                            <h2>Personal Information</h2>
                            <p>
                                Your basic account information
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                className="profile-small-edit-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                <FaPencilAlt />
                                Edit
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="profile-edit-form">
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
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="email">
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
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
                                    />
                                </div>
                            </div>

                            <div className="profile-form-actions">
                                <button
                                    type="button"
                                    className="profile-cancel-btn"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="profile-save-btn"
                                    onClick={handleSaveProfile}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-details-grid">
                            <div className="profile-detail-item">
                                <span>First Name</span>
                                <strong>{user.firstName}</strong>
                            </div>

                            <div className="profile-detail-item">
                                <span>Last Name</span>
                                <strong>{user.lastName}</strong>
                            </div>

                            <div className="profile-detail-item">
                                <span>Email</span>
                                <strong>{user.email}</strong>
                            </div>

                            <div className="profile-detail-item">
                                <span>Mobile Number</span>
                                <strong>{user.mobile}</strong>
                            </div>

                            <div className="profile-detail-item">
                                <span>Account Type</span>
                                <strong>{currentRole.label}</strong>
                            </div>
                        </div>
                    )}
                </section>

                {/* Addresses */}
                <section className="profile-card">
                    <div className="profile-card-header">
                        <div>
                            <h2>Saved Addresses</h2>
                            <p>
                                Manage the addresses used for your orders
                            </p>
                        </div>

                        <button
                            type="button"
                            className="profile-small-edit-btn"
                            onClick={() => navigate("/address")}
                        >
                            <FaMapMarkerAlt />
                            Manage
                        </button>
                    </div>

                    {addresses.length > 0 ? (
                        <div className="profile-address-list">
                            {addresses.slice(0, 2).map((address) => (
                                <div
                                    className="profile-address-item"
                                    key={address.id}
                                >
                                    <div className="profile-address-icon">
                                        <FaMapMarkerAlt />
                                    </div>

                                    <div className="profile-address-info">
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
                                            <p>
                                                {address.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="profile-no-address">
                            <FaMapMarkerAlt />

                            <div>
                                <strong>No saved addresses</strong>

                                <p>
                                    Add an address for faster checkout.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/address")}
                            >
                                Add Address
                            </button>
                        </div>
                    )}
                </section>

                {/* Account Settings */}
                <section className="profile-card">
                    <div className="profile-card-header">
                        <div>
                            <h2>Account Settings</h2>
                            <p>
                                Manage your account preferences
                            </p>
                        </div>
                    </div>

                    <div className="profile-settings-list">
                        <button
                            type="button"
                            className="profile-setting-row"
                            onClick={() => navigate("/settings")}
                        >
                            <div className="profile-setting-icon">
                                <FaCog />
                            </div>

                            <div className="profile-setting-content">
                                <strong>Settings</strong>
                                <span>
                                    Manage your account preferences
                                </span>
                            </div>

                            <FaChevronRight className="profile-setting-arrow" />
                        </button>

                        <button
                            type="button"
                            className="profile-setting-row"
                            onClick={() => navigate("/notifications")}
                        >
                            <div className="profile-setting-icon">
                                <FaBell />
                            </div>

                            <div className="profile-setting-content">
                                <strong>Notifications</strong>
                                <span>
                                    Manage your notification preferences
                                </span>
                            </div>

                            <FaChevronRight className="profile-setting-arrow" />
                        </button>

                        <button
                            type="button"
                            className="profile-setting-row"
                            onClick={() => navigate("/address")}
                        >
                            <div className="profile-setting-icon">
                                <FaMapMarkerAlt />
                            </div>

                            <div className="profile-setting-content">
                                <strong>Addresses</strong>
                                <span>
                                    Manage your saved addresses
                                </span>
                            </div>

                            <FaChevronRight className="profile-setting-arrow" />
                        </button>
                    </div>
                </section>

                {/* Role Action */}
                <section className="profile-role-card">
                    <div>
                        <span className="profile-role-card-badge">
                            {currentRole.label}
                        </span>

                        <h2>{currentRole.actionLabel}</h2>

                        <p>
                            {currentRole.description}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="profile-primary-btn"
                        onClick={() =>
                            navigate(currentRole.actionPath)
                        }
                    >
                        {currentRole.actionLabel}
                        <FaChevronRight />
                    </button>
                </section>

                {/* Logout */}
                <section className="profile-logout-section">
                    <button
                        type="button"
                        className="profile-logout-btn"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt />
                        Log Out
                    </button>
                </section>

                {/* Delete Account */}
                <section className="profile-delete-card">
                    <div>
                        <h2>Delete Account</h2>

                        <p>
                            Permanently remove your AutoMarket
                            account and locally saved profile information.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="profile-delete-btn"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <FaTrash />
                        Delete Account
                    </button>
                </section>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="profile-modal-overlay">
                    <div
                        className="profile-delete-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-account-title"
                    >
                        <div className="profile-modal-icon">
                            <FaTrash />
                        </div>

                        <h2 id="delete-account-title">
                            Delete your account?
                        </h2>

                        <p>
                            This will remove your locally saved
                            AutoMarket profile and saved addresses.
                            This action cannot be undone.
                        </p>

                        <div className="profile-modal-actions">
                            <button
                                type="button"
                                className="profile-cancel-btn"
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="profile-confirm-delete-btn"
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