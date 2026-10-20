
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactElement,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FaBell,
  FaBoxOpen,
  FaCamera,
  FaChevronRight,
  FaClock,
  FaCog,
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaPencilAlt,
  FaPhone,
  FaShieldAlt,
  FaShoppingBag,
  FaSignOutAlt,
  FaStore,
  FaTag,
  FaThLarge,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import Navbar from "../Components/Navbar";
import AdminShell from "../Components/AdminShell";
import "./ProfilePage.css";

/* =========================================================
   TYPES
========================================================= */

type UserRole = "buyer" | "seller" | "admin";

type Section =
  | "overview"
  | "details"
  | "addresses"
  | "preferences";

type StoredUser = {
  id?: string | number;
  userid?: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  phoneNumber?: string;
  location?: string;
  role?: string;
  profileImage?: string;
  coverImage?: string;
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
  tagline: string;
  actionLabel: string;
  actionPath: string;
  icon: IconType;
};

type SavedProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  profileImage?: string;
  coverImage?: string;
};

/* =========================================================
   STORAGE KEYS
========================================================= */

const USER_KEYS = [
  "marketplace_current_user",
  "automarketUser",
];

const USERS_KEY = "marketplace_users";
const ADDRESS_KEY = "marketplace_addresses";
const APPROVED_KEY = "marketplace_approved_products";
const PENDING_KEY = "marketplace_pending_products";
const NOTIFY_KEY = "marketplace_notifications_enabled";

const PROFILE_IMAGE_KEY = "automarketProfileImage";
const COVER_IMAGE_KEY = "automarket_profile_cover";

const PROFILE_UPDATED_EVENT = "automarket-user-updated";
const ADDRESS_UPDATED_EVENT = "automarket-address-updated";
const PROFILE_IMAGE_UPDATED_EVENT =
  "automarket-profile-image-updated";

/*
  Persistent account-specific profile storage.

  These keys remain when the user logs out.
  Images and profile details are kept separately for each email.
*/
const PROFILE_PREFIX = "automarket_saved_profile:";

function getProfileStorageKey(email?: string): string {
  const normalizedEmail = (email || "").trim().toLowerCase();

  return normalizedEmail
    ? `${PROFILE_PREFIX}${normalizedEmail}`
    : "";
}

/* =========================================================
   ROLE CONFIG
========================================================= */

const roleConfig: Record<UserRole, RoleConfig> = {
  buyer: {
    label: "Buyer",
    tagline:
      "Shop quality car parts and keep your details ready for checkout.",
    actionLabel: "Browse parts",
    actionPath: "/shop",
    icon: FaShoppingBag,
  },

  seller: {
    label: "Seller",
    tagline:
      "List your parts and reach buyers across the marketplace.",
    actionLabel: "Manage listings",
    actionPath: "/my-listings",
    icon: FaStore,
  },

  admin: {
    label: "Administrator",
    tagline:
      "Oversee users, listings and day-to-day marketplace operations.",
    actionLabel: "Admin dashboard",
    actionPath: "/admin",
    icon: FaShieldAlt,
  },
};

/* =========================================================
   PROFILE NAVIGATION
========================================================= */

const sections: {
  id: Section;
  label: string;
  icon: IconType;
}[] = [
  { id: "overview", label: "Overview", icon: FaThLarge },
  { id: "details", label: "Personal details", icon: FaIdCard },
  { id: "addresses", label: "Addresses", icon: FaMapMarkerAlt },
  { id: "preferences", label: "Preferences", icon: FaCog },
];

/* =========================================================
   STORAGE HELPERS
========================================================= */

function readArray(key: string): any[] {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readSavedProfile(email?: string): SavedProfile | null {
  const key = getProfileStorageKey(email);

  if (!key) return null;

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    return parsed && typeof parsed === "object"
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function saveAccountProfile(
  email: string,
  profile: SavedProfile
): void {
  const key = getProfileStorageKey(email);

  if (!key) return;

  try {
    const existing = readSavedProfile(email) || {};

    window.localStorage.setItem(
      key,
      JSON.stringify({
        ...existing,
        ...profile,
        email: email.trim().toLowerCase(),
      })
    );
  } catch (error) {
    console.error("Could not save the local profile:", error);
    throw error;
  }
}

function readStoredUser(): StoredUser | null {
  try {
    let activeUser: StoredUser | null = null;

    for (const key of USER_KEYS) {
      const raw = window.localStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (parsed && typeof parsed === "object") {
        activeUser = parsed;
        break;
      }
    }

    if (!activeUser) return null;

    const savedProfile = readSavedProfile(activeUser.email);

    if (!savedProfile) return activeUser;

    /*
      Preserve the role and ID from the active login.
      Restore the user's previously saved profile details.
    */
    return {
      ...activeUser,
      firstName:
        savedProfile.firstName ?? activeUser.firstName,
      lastName:
        savedProfile.lastName ?? activeUser.lastName,
      email:
        activeUser.email || savedProfile.email,
      mobile:
        savedProfile.mobile ?? activeUser.mobile,
      profileImage:
        savedProfile.profileImage ?? activeUser.profileImage,
      coverImage:
        savedProfile.coverImage ?? activeUser.coverImage,
    };
  } catch {
    return null;
  }
}

function normalizeRole(role?: string): UserRole {
  const value = String(role || "").toLowerCase();

  if (value === "seller" || value === "vendor") {
    return "seller";
  }

  if (value === "admin" || value === "administrator") {
    return "admin";
  }

  return "buyer";
}

function getUserName(user: StoredUser): string {
  const fullName =
    `${user.firstName?.trim() || ""} ${
      user.lastName?.trim() || ""
    }`.trim();

  return fullName || user.name?.trim() || "AutoMarket User";
}

function getPhone(user: StoredUser): string {
  return user.mobile || user.phone || user.phoneNumber || "";
}

function readProfileImage(email?: string): string {
  return readSavedProfile(email)?.profileImage || "";
}

function readCoverImage(email?: string): string {
  return readSavedProfile(email)?.coverImage || "";
}

function writeActiveUser(user: StoredUser): void {
  /*
    Keep both keys consistent for existing components.
  */
  const serialized = JSON.stringify(user);

  window.localStorage.setItem("automarketUser", serialized);
  window.localStorage.setItem(
    "marketplace_current_user",
    serialized
  );
}

function notifyProfileUpdated(): void {
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}

/* =========================================================
   IMAGE COMPRESSION
========================================================= */

function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const source = reader.result;

      if (typeof source !== "string") {
        reject(new Error("Could not read image."));
        return;
      }

      const image = new Image();

      image.onload = () => {
        let width = image.width;
        let height = image.height;

        const scale = Math.min(
          maxWidth / width,
          maxHeight / height,
          1
        );

        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(
            new Error("Your browser could not process the image.")
          );
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      image.onerror = () => {
        reject(new Error("Could not process this image."));
      };

      image.src = source;
    };

    reader.onerror = () => {
      reject(new Error("Could not read the selected image."));
    };

    reader.readAsDataURL(file);
  });
}

/* =========================================================
   USER DATA SYNC
========================================================= */

function syncRegisteredUser(
  previousEmail: string,
  updated: StoredUser
): void {
  const previous = previousEmail.trim().toLowerCase();

  if (!previous) return;

  const users = readArray(USERS_KEY);

  const next = users.map((item) => {
    if (
      String(item?.email || "").trim().toLowerCase() !==
      previous
    ) {
      return item;
    }

    return {
      ...item,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      mobile: updated.mobile,
      role: updated.role,
    };
  });

  window.localStorage.setItem(USERS_KEY, JSON.stringify(next));
}

function removeRegisteredUser(email: string): void {
  const target = email.trim().toLowerCase();

  const next = readArray(USERS_KEY).filter(
    (item) =>
      String(item?.email || "").trim().toLowerCase() !==
      target
  );

  window.localStorage.setItem(USERS_KEY, JSON.stringify(next));
}

/*
  Logging out removes active user/session keys only.
  It does not delete the saved profile, images or addresses.
*/
function clearSession(): void {
  [
    "automarketUser",
    "marketplace_current_user",
    "marketplace_token",
    "authToken",
    "token",
  ].forEach((key) => {
    window.localStorage.removeItem(key);
  });

  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  window.dispatchEvent(new Event(PROFILE_IMAGE_UPDATED_EVENT));
}

/* =========================================================
   SMALL FIELD COMPONENT
========================================================= */

function Field({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="pf-field">
      <span className="pf-field-label">{label}</span>

      {value ? <strong>{value}</strong> : <em>Not added</em>}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<StoredUser | null>(
    () => readStoredUser()
  );

  const [addresses, setAddresses] = useState<Address[]>(() =>
    readArray(ADDRESS_KEY)
  );

  const [section, setSection] = useState<Section>("overview");
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(
      () =>
        window.localStorage.getItem(NOTIFY_KEY) !== "false"
    );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [profileImage, setProfileImage] = useState<string>(
    () => readProfileImage(readStoredUser()?.email)
  );

  const [coverImage, setCoverImage] = useState<string>(
    () => readCoverImage(readStoredUser()?.email)
  );

  const [imageMessage, setImageMessage] = useState("");

  /* =======================================================
     ROLE AND PROFILE
  ======================================================= */

  const role = normalizeRole(user?.role);
  const config = roleConfig[role];
  const RoleIcon = config.icon;

  const fullName = user ? getUserName(user) : "AutoMarket User";
  const phone = user ? getPhone(user) : "";

  const primaryAddress = addresses[0];

  const addressText = primaryAddress
    ? `${primaryAddress.city}, ${primaryAddress.postalCode}`
    : "";

  /* =======================================================
     LOAD SAVED PROFILE WHEN ACCOUNT CHANGES
  ======================================================= */

  useEffect(() => {
    if (!user?.email) return;

    const savedProfile = readSavedProfile(user.email);

    const nextUser: StoredUser = {
      ...user,
      firstName:
        savedProfile?.firstName ?? user.firstName,
      lastName:
        savedProfile?.lastName ?? user.lastName,
      mobile:
        savedProfile?.mobile ?? user.mobile,
      profileImage:
        savedProfile?.profileImage ?? user.profileImage,
      coverImage:
        savedProfile?.coverImage ?? user.coverImage,
    };

    setEditForm({
      firstName: nextUser.firstName || "",
      lastName: nextUser.lastName || "",
      email: nextUser.email || "",
      mobile: getPhone(nextUser),
    });

    setProfileImage(
      savedProfile?.profileImage || ""
    );

    setCoverImage(
      savedProfile?.coverImage || ""
    );

    /*
      Refresh the active objects with the saved account details.
      Keep the active role unchanged.
    */
    writeActiveUser(nextUser);
    setUser(nextUser);
  // Only reload when the active account changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  /* =======================================================
     REFRESH USER AND ADDRESS DATA
  ======================================================= */

  useEffect(() => {
    const refresh = () => {
      const refreshedUser = readStoredUser();

      setUser(refreshedUser);
      setAddresses(readArray(ADDRESS_KEY));

      if (refreshedUser?.email) {
        setProfileImage(readProfileImage(refreshedUser.email));
        setCoverImage(readCoverImage(refreshedUser.email));
      } else {
        setProfileImage("");
        setCoverImage("");
      }
    };

    window.addEventListener("storage", refresh);
    window.addEventListener(PROFILE_UPDATED_EVENT, refresh);
    window.addEventListener(ADDRESS_UPDATED_EVENT, refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(PROFILE_UPDATED_EVENT, refresh);
      window.removeEventListener(ADDRESS_UPDATED_EVENT, refresh);
    };
  }, []);

  /* =======================================================
     PROFILE IMAGE REFRESH
  ======================================================= */

  useEffect(() => {
    const refreshImage = () => {
      const activeUser = readStoredUser();

      setProfileImage(
        activeUser?.email
          ? readProfileImage(activeUser.email)
          : ""
      );

      setCoverImage(
        activeUser?.email
          ? readCoverImage(activeUser.email)
          : ""
      );
    };

    window.addEventListener(
      PROFILE_IMAGE_UPDATED_EVENT,
      refreshImage
    );

    window.addEventListener("storage", refreshImage);

    return () => {
      window.removeEventListener(
        PROFILE_IMAGE_UPDATED_EVENT,
        refreshImage
      );

      window.removeEventListener("storage", refreshImage);
    };
  }, []);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const approved = readArray(APPROVED_KEY);
    const pending = readArray(PENDING_KEY);

    const email = (user?.email || "").trim().toLowerCase();

    const mine = (list: any[]) =>
      list.filter(
        (item) =>
          String(
            item.sellerEmail ?? item.seller_email ?? ""
          ).trim().toLowerCase() === email
      );

    if (role === "admin") {
      return [
        {
          label: "Live listings",
          value: approved.filter((product) => !product.sold).length,
          icon: FaBoxOpen,
        },
        {
          label: "Awaiting approval",
          value: pending.length,
          icon: FaClock,
        },
      ];
    }

    if (role === "seller") {
      const myApproved = mine(approved);

      return [
        {
          label: "Live listings",
          value: myApproved.filter((product) => !product.sold).length,
          icon: FaBoxOpen,
        },
        {
          label: "Pending review",
          value: mine(pending).length,
          icon: FaClock,
        },
        {
          label: "Sold",
          value: myApproved.filter((product) => product.sold).length,
          icon: FaTag,
        },
      ];
    }

    return [
      {
        label: "Saved addresses",
        value: addresses.length,
        icon: FaMapMarkerAlt,
      },
      {
        label: "Notifications",
        value: notificationsEnabled ? "On" : "Off",
        icon: FaBell,
      },
    ];
  }, [user, role, addresses, notificationsEnabled]);

  /* =======================================================
     IMAGE VALIDATION
  ======================================================= */

  const validateImage = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      setImageMessage("Please select an image file.");
      return false;
    }

    if (file.size > 15 * 1024 * 1024) {
      setImageMessage("Please choose an image smaller than 15MB.");
      return false;
    }

    return true;
  };

  /* =======================================================
     SAVE PROFILE IMAGE
  ======================================================= */

  const handleProfileImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    event.target.value = "";

    if (!validateImage(file)) return;

    if (!user?.email) {
      setImageMessage("Please sign in before updating your picture.");
      return;
    }

    try {
      setImageMessage("Updating profile picture...");

      const compressed = await compressImage(file, 512, 512, 0.82);

      saveAccountProfile(user.email, {
        profileImage: compressed,
      });

      setProfileImage(compressed);

      const updatedUser: StoredUser = {
        ...user,
        profileImage: compressed,
      };

      writeActiveUser(updatedUser);
      setUser(updatedUser);

      /*
        Keep the shared key for older components that still use it.
        The account-specific key above remains the source of truth
        for this page.
      */
      window.localStorage.setItem(
        PROFILE_IMAGE_KEY,
        compressed
      );

      setImageMessage("Profile picture updated.");

      window.dispatchEvent(
        new Event(PROFILE_IMAGE_UPDATED_EVENT)
      );
      notifyProfileUpdated();
    } catch {
      setImageMessage(
        "We could not save that image. Please try a smaller image."
      );
    }
  };

  const removeProfileImage = () => {
    if (!user?.email) return;

    saveAccountProfile(user.email, {
      profileImage: "",
    });

    setProfileImage("");

    window.localStorage.removeItem(PROFILE_IMAGE_KEY);

    const updatedUser: StoredUser = {
      ...user,
      profileImage: "",
    };

    writeActiveUser(updatedUser);
    setUser(updatedUser);

    setImageMessage("Profile picture removed.");

    window.dispatchEvent(
      new Event(PROFILE_IMAGE_UPDATED_EVENT)
    );
    notifyProfileUpdated();
  };

  /* =======================================================
     COVER IMAGE
  ======================================================= */

  const handleCoverImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    event.target.value = "";

    if (!validateImage(file)) return;

    if (!user?.email) {
      setImageMessage("Please sign in before updating your cover.");
      return;
    }

    try {
      setImageMessage("Updating cover image...");

      const compressed = await compressImage(
        file,
        1600,
        650,
        0.82
      );

      saveAccountProfile(user.email, {
        coverImage: compressed,
      });

      setCoverImage(compressed);

      const updatedUser: StoredUser = {
        ...user,
        coverImage: compressed,
      };

      writeActiveUser(updatedUser);
      setUser(updatedUser);

      window.localStorage.setItem(
        COVER_IMAGE_KEY,
        compressed
      );

      setImageMessage("Cover image updated.");

      window.dispatchEvent(
        new Event(PROFILE_IMAGE_UPDATED_EVENT)
      );
      notifyProfileUpdated();
    } catch {
      setImageMessage(
        "We could not save that image. Please try another one."
      );
    }
  };

  const removeCoverImage = () => {
    if (!user?.email) return;

    saveAccountProfile(user.email, {
      coverImage: "",
    });

    setCoverImage("");

    window.localStorage.removeItem(COVER_IMAGE_KEY);

    const updatedUser: StoredUser = {
      ...user,
      coverImage: "",
    };

    writeActiveUser(updatedUser);
    setUser(updatedUser);

    setImageMessage("Cover image removed.");

    window.dispatchEvent(
      new Event(PROFILE_IMAGE_UPDATED_EVENT)
    );
    notifyProfileUpdated();
  };

  /* =======================================================
     PROFILE EDIT
  ======================================================= */

  const startEditing = () => {
    setSection("details");

    setEditForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      mobile: getPhone(user || {}),
    });

    setIsEditing(true);
  };

  const handleEditChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveProfile = (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!user) return;

    const newEmail = editForm.email.trim().toLowerCase();

    if (!newEmail) {
      setImageMessage("Please enter a valid email address.");
      return;
    }

    const updatedUser: StoredUser = {
      ...user,
      firstName: editForm.firstName.trim(),
      lastName: editForm.lastName.trim(),
      email: newEmail,
      mobile: editForm.mobile.trim(),
      profileImage,
      coverImage,
    };

    try {
      /*
        Save account details independently of the active login.
        They can be restored when the user logs in again.
      */
      saveAccountProfile(newEmail, {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: newEmail,
        mobile: updatedUser.mobile,
        profileImage,
        coverImage,
      });

      writeActiveUser(updatedUser);

      syncRegisteredUser(user.email || "", updatedUser);

      setUser(updatedUser);
      setIsEditing(false);
      setImageMessage("Profile details saved in this browser.");

      notifyProfileUpdated();
      window.dispatchEvent(
        new Event(PROFILE_IMAGE_UPDATED_EVENT)
      );
    } catch {
      setImageMessage(
        "Could not save your profile. Your browser storage may be full."
      );
    }
  };

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const toggleNotifications = () => {
    const next = !notificationsEnabled;

    setNotificationsEnabled(next);

    window.localStorage.setItem(
      NOTIFY_KEY,
      String(next)
    );
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    /*
      Do not delete account-specific profile details,
      profile pictures, cover pictures or saved addresses.
    */
    clearSession();

    navigate("/login", { replace: true });
  };

  /* =======================================================
     DELETE ACCOUNT
  ======================================================= */

  const handleDeleteAccount = () => {
    if (user?.email) {
      removeRegisteredUser(user.email);

      const key = getProfileStorageKey(user.email);

      if (key) {
        window.localStorage.removeItem(key);
      }
    }

    clearSession();

    /*
      This is a local-browser deletion only.
      It does not delete a MySQL account.
    */
    window.localStorage.removeItem(ADDRESS_KEY);
    window.localStorage.removeItem(PROFILE_IMAGE_KEY);
    window.localStorage.removeItem(COVER_IMAGE_KEY);

    window.dispatchEvent(
      new Event(PROFILE_IMAGE_UPDATED_EVENT)
    );

    setShowDeleteModal(false);

    navigate("/register", { replace: true });
  };

  /* =======================================================
     NOT SIGNED IN
  ======================================================= */

  if (!user) {
    return (
      <>
        <Navbar />

        <div className="pf-page">
          <section className="pf-empty">
            <div className="pf-empty-icon">
              <FaShieldAlt />
            </div>

            <h2>You're not signed in</h2>

            <p>
              Sign in to view and manage your AutoMarket profile.
            </p>

            <button
              type="button"
              className="pf-btn pf-btn-primary"
              onClick={() => navigate("/login")}
            >
              Go to login
            </button>
          </section>
        </div>
      </>
    );
  }

  /* =======================================================
     OVERVIEW
  ======================================================= */

  const overview = (
    <>
      <div className="pf-panel-head">
        <h3>Overview</h3>
        <p>A quick look at your account.</p>
      </div>

      <div className="pf-stats">
        {stats.map((stat) => {
          const StatIcon = stat.icon;

          return (
            <div className="pf-stat" key={stat.label}>
              <span className="pf-stat-icon">
                <StatIcon />
              </span>

              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          );
        })}
      </div>

      <div className="pf-links">
        <button
          type="button"
          className="pf-link-row"
          onClick={() => navigate(config.actionPath)}
        >
          <span className="pf-link-icon">
            <RoleIcon />
          </span>

          <span className="pf-link-text">
            <strong>{config.actionLabel}</strong>
            <small>{config.tagline}</small>
          </span>

          <FaChevronRight />
        </button>

        <button
          type="button"
          className="pf-link-row"
          onClick={() => navigate("/notifications")}
        >
          <span className="pf-link-icon">
            <FaBell />
          </span>

          <span className="pf-link-text">
            <strong>Notifications</strong>
            <small>See what's new on your account</small>
          </span>

          <FaChevronRight />
        </button>

        <button
          type="button"
          className="pf-link-row"
          onClick={() => navigate("/settings")}
        >
          <span className="pf-link-icon">
            <FaCog />
          </span>

          <span className="pf-link-text">
            <strong>Settings</strong>
            <small>Manage your account preferences</small>
          </span>

          <FaChevronRight />
        </button>
      </div>
    </>
  );

  /* =======================================================
     PERSONAL DETAILS
  ======================================================= */

  const details = (
    <>
      <div className="pf-panel-head pf-panel-head-row">
        <div>
          <h3>Personal details</h3>
          <p>The information linked to your account.</p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="pf-btn pf-btn-outline"
            onClick={() => setIsEditing(true)}
          >
            <FaPencilAlt />
            Edit
          </button>
        )}
      </div>

      {role === "admin" && !isEditing && (
        <div className="pf-image-message">
          Your email is your login username. Add your preferred name to personalize your admin profile.
          <button type="button" className="pf-text-button" onClick={startEditing}>
            Set preferred name
          </button>
        </div>
      )}

      <div className="pf-image-settings">
        <div className="pf-image-setting">
          <div className="pf-image-setting-preview">
            {profileImage ? (
              <img src={profileImage} alt={`${fullName} profile`} />
            ) : (
              <FaUser />
            )}
          </div>

          <div className="pf-image-setting-content">
            <strong>Profile picture</strong>
            <span>Choose a picture from your device.</span>

            <div className="pf-image-actions">
              <label
                htmlFor="profile-image-input"
                className="pf-btn pf-btn-outline"
              >
                <FaCamera />
                {profileImage ? "Change picture" : "Upload picture"}
              </label>

              <input
                id="profile-image-input"
                className="pf-hidden-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfileImageChange}
              />

              {profileImage && (
                <button
                  type="button"
                  className="pf-text-button"
                  onClick={removeProfileImage}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pf-image-setting">
          <div
            className="pf-cover-mini-preview"
            style={
              coverImage
                ? { backgroundImage: `url("${coverImage}")` }
                : undefined
            }
          >
            {!coverImage && <FaCamera />}
          </div>

          <div className="pf-image-setting-content">
            <strong>Cover image</strong>
            <span>
              Choose the background image shown at the top of your profile.
            </span>

            <div className="pf-image-actions">
              <label
                htmlFor="cover-image-input"
                className="pf-btn pf-btn-outline"
              >
                <FaCamera />
                {coverImage ? "Change cover" : "Upload cover"}
              </label>

              <input
                id="cover-image-input"
                className="pf-hidden-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverImageChange}
              />

              {coverImage && (
                <button
                  type="button"
                  className="pf-text-button"
                  onClick={removeCoverImage}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {imageMessage && (
        <div className="pf-image-message">{imageMessage}</div>
      )}

      {isEditing ? (
        <form onSubmit={handleSaveProfile}>
          <div className="pf-form-grid">
            <div className="pf-form-group">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={editForm.firstName}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="pf-form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={editForm.lastName}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="pf-form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="pf-form-group">
              <label htmlFor="mobile">Mobile number</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={editForm.mobile}
                onChange={handleEditChange}
              />
            </div>
          </div>

          <div className="pf-form-actions">
            <button
              type="button"
              className="pf-btn pf-btn-outline"
              onClick={() => {
                setIsEditing(false);
                setEditForm({
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  email: user.email || "",
                  mobile: getPhone(user),
                });
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="pf-btn pf-btn-primary"
            >
              Save changes
            </button>
          </div>
        </form>
      ) : (
        <div className="pf-fields">
          <Field label="First name" value={user.firstName} />
          <Field label="Last name" value={user.lastName} />
          <Field label={role === "admin" ? "Login username" : "Email"} value={user.email} />
          <Field label="Mobile" value={phone} />
          <Field label="Account type" value={config.label} />
          <Field label="Location" value={addressText} />
        </div>
      )}
    </>
  );

  /* =======================================================
     ADDRESSES
  ======================================================= */

  const addressesSection = (
    <>
      <div className="pf-panel-head pf-panel-head-row">
        <div>
          <h3>Saved addresses</h3>
          <p>Addresses you can use at checkout.</p>
        </div>

        <button
          type="button"
          className="pf-btn pf-btn-outline"
          onClick={() => navigate("/addresses")}
        >
          Manage
          <FaChevronRight />
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="pf-empty-block">
          <FaMapMarkerAlt />

          <div>
            <strong>No saved addresses yet</strong>
            <p>Add an address to check out faster.</p>
          </div>

          <button
            type="button"
            className="pf-btn pf-btn-primary"
            onClick={() => navigate("/addresses")}
          >
            Add address
          </button>
        </div>
      ) : (
        <div className="pf-address-list">
          {addresses.map((address, index) => (
            <div className="pf-address" key={address.id}>
              <span className="pf-address-icon">
                <FaMapMarkerAlt />
              </span>

              <div>
                <strong>
                  {address.label}

                  {index === 0 && (
                    <span className="pf-tag">Default</span>
                  )}
                </strong>

                <p>{address.street}</p>
                <p>
                  {address.city}, {address.postalCode}
                </p>

                {address.phone && <small>{address.phone}</small>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  /* =======================================================
     PREFERENCES
  ======================================================= */

  const preferences = (
    <>
      <div className="pf-panel-head">
        <h3>Preferences</h3>
        <p>Choose how AutoMarket keeps in touch.</p>
      </div>

      <div className="pf-toggle-row">
        <span className="pf-link-icon">
          <FaBell />
        </span>

        <span className="pf-link-text">
          <strong>Account notifications</strong>
          <small>Receive important updates about your account</small>
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={notificationsEnabled}
          aria-label="Account notifications"
          className={
            notificationsEnabled
              ? "pf-toggle pf-toggle-on"
              : "pf-toggle"
          }
          onClick={toggleNotifications}
        >
          <span />
        </button>
      </div>

      <div className="pf-danger">
        <div>
          <h4>Delete account</h4>

          <p>
            Remove your saved profile information from this browser.
            This local action does not delete your MySQL account.
          </p>
        </div>

        <button
          type="button"
          className="pf-btn pf-btn-danger-outline"
          onClick={() => setShowDeleteModal(true)}
        >
          <FaTrash />
          Delete account
        </button>
      </div>
    </>
  );

  const panels: Record<Section, ReactElement> = {
    overview,
    details,
    addresses: addressesSection,
    preferences,
  };

  /* =======================================================
     MAIN PAGE
  ======================================================= */

  const page = (
    <div
      className={
        role === "admin"
          ? "pf-page pf-embedded"
          : "pf-page"
      }
    >
      <div
        className={
          coverImage
            ? "pf-banner pf-banner-custom"
            : "pf-banner"
        }
        style={
          coverImage
            ? {
                backgroundImage: `
                  linear-gradient(
                    115deg,
                    rgba(12, 22, 38, 0.45),
                    rgba(12, 22, 38, 0.25)
                  ),
                  url("${coverImage}")
                `,
              }
            : undefined
        }
      >
        <div className="pf-banner-actions">
          <label
            htmlFor="cover-image-header-input"
            className="pf-cover-action"
          >
            <FaCamera />
            {coverImage ? "Change cover" : "Add cover"}
          </label>

          <input
            id="cover-image-header-input"
            className="pf-hidden-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleCoverImageChange}
          />

          {coverImage && (
            <button
              type="button"
              className="pf-cover-remove"
              onClick={removeCoverImage}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <header className="pf-identity">
        <div className="pf-profile-photo">
          {profileImage ? (
            <img src={profileImage} alt={`${fullName} profile`} />
          ) : (
            <div className="pf-profile-placeholder">
              <FaUser />
            </div>
          )}

          <label
            htmlFor="profile-image-header-input"
            className="pf-profile-camera"
            title="Change profile picture"
          >
            <FaCamera />
          </label>

          <input
            id="profile-image-header-input"
            className="pf-hidden-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleProfileImageChange}
          />
        </div>

        <div className="pf-identity-text">
          <div className="pf-name-row">
            <h2>{fullName}</h2>
            <span className="pf-role">{config.label}</span>
          </div>

          <div className="pf-meta">
            {user.email && (
              <span>
                <FaEnvelope />
                {user.email}
              </span>
            )}

            {phone && (
              <span>
                <FaPhone />
                {phone}
              </span>
            )}

            {addressText && (
              <span>
                <FaMapMarkerAlt />
                {addressText}
              </span>
            )}
          </div>
        </div>

        <div className="pf-identity-actions">
          <button
            type="button"
            className="pf-btn pf-btn-outline"
            onClick={startEditing}
          >
            <FaPencilAlt />
            Edit profile
          </button>

          <button
            type="button"
            className="pf-btn pf-btn-primary"
            onClick={() => navigate(config.actionPath)}
          >
            {config.actionLabel}
          </button>
        </div>
      </header>

      {imageMessage && (
        <div className="pf-image-toast">{imageMessage}</div>
      )}

      <div className="pf-layout">
        <nav className="pf-nav" aria-label="Account sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={
                section === id
                  ? "pf-nav-item active"
                  : "pf-nav-item"
              }
              aria-current={section === id ? "page" : undefined}
              onClick={() => setSection(id)}
            >
              <Icon />
              {label}
            </button>
          ))}

          <button
            type="button"
            className="pf-nav-item pf-nav-signout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </nav>

        <section className="pf-panel">
          {panels[section]}
        </section>
      </div>

      {showDeleteModal && (
        <div
          className="pf-modal-overlay"
          onMouseDown={() => setShowDeleteModal(false)}
        >
          <div
            className="pf-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pf-delete-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="pf-modal-icon">
              <FaTrash />
            </div>

            <h2 id="pf-delete-title">Delete your account?</h2>

            <p>
              Your saved profile information will be removed from this
              browser and you will be signed out. This does not delete
              your account from the server.
            </p>

            <div className="pf-modal-actions">
              <button
                type="button"
                className="pf-btn pf-btn-outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Keep my account
              </button>

              <button
                type="button"
                className="pf-btn pf-btn-danger"
                onClick={handleDeleteAccount}
              >
                Delete local profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* =======================================================
     ADMIN / NORMAL USER
  ======================================================= */

  if (role === "admin") {
    return (
      <AdminShell
        title="My Account"
        subtitle="Manage your profile and preferences"
      >
        {page}
      </AdminShell>
    );
  }

  return (
    <>
      <Navbar />
      {page}
    </>
  );
}

export default ProfilePage;
