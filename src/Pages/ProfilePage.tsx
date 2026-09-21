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

/*
  IMPORTANT:
  This is the single profile-image storage key used
  throughout the frontend, including Navbar.tsx.
*/
const PROFILE_IMAGE_KEY =
  "automarketProfileImage";

const COVER_IMAGE_KEY =
  "automarket_profile_cover";

/* =========================================================
   EVENTS
========================================================= */

const PROFILE_IMAGE_UPDATED_EVENT =
  "automarket-profile-image-updated";

/* =========================================================
   ROLE CONFIG
========================================================= */

const roleConfig: Record<
  UserRole,
  RoleConfig
> = {
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
  {
    id: "overview",
    label: "Overview",
    icon: FaThLarge,
  },
  {
    id: "details",
    label: "Personal details",
    icon: FaIdCard,
  },
  {
    id: "addresses",
    label: "Addresses",
    icon: FaMapMarkerAlt,
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: FaCog,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function readArray(key: string): any[] {
  try {
    const raw =
      window.localStorage.getItem(key);

    const parsed = raw
      ? JSON.parse(raw)
      : [];

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function readStoredUser(): StoredUser | null {
  try {
    for (const key of USER_KEYS) {
      const raw =
        window.localStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (
        parsed &&
        typeof parsed === "object"
      ) {
        return parsed;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function readProfileImage(): string {
  try {
    return (
      window.localStorage.getItem(
        PROFILE_IMAGE_KEY
      ) || ""
    );
  } catch {
    return "";
  }
}

function normalizeRole(
  role?: string
): UserRole {
  const value = String(
    role || ""
  ).toLowerCase();

  if (
    value === "seller" ||
    value === "vendor"
  ) {
    return "seller";
  }

  if (
    value === "admin" ||
    value === "administrator"
  ) {
    return "admin";
  }

  return "buyer";
}

function getUserName(
  user: StoredUser
) {
  const full =
    `${user.firstName?.trim() || ""} ${
      user.lastName?.trim() || ""
    }`.trim();

  return (
    full ||
    user.name?.trim() ||
    "AutoMarket User"
  );
}

function getPhone(
  user: StoredUser
) {
  return (
    user.mobile ||
    user.phone ||
    user.phoneNumber ||
    ""
  );
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
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const source =
          reader.result;

        if (
          typeof source !== "string"
        ) {
          reject(
            new Error(
              "Could not read image."
            )
          );
          return;
        }

        const image = new Image();

        image.onload = () => {
          let width =
            image.width;

          let height =
            image.height;

          const scale =
            Math.min(
              maxWidth / width,
              maxHeight / height,
              1
            );

          width = Math.round(
            width * scale
          );

          height = Math.round(
            height * scale
          );

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width = width;
          canvas.height = height;

          const context =
            canvas.getContext(
              "2d"
            );

          if (!context) {
            reject(
              new Error(
                "Your browser could not process the image."
              )
            );
            return;
          }

          context.drawImage(
            image,
            0,
            0,
            width,
            height
          );

          const compressed =
            canvas.toDataURL(
              "image/jpeg",
              quality
            );

          resolve(compressed);
        };

        image.onerror = () => {
          reject(
            new Error(
              "Could not process this image."
            )
          );
        };

        image.src = source;
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Could not read the selected image."
          )
        );
      };

      reader.readAsDataURL(file);
    }
  );
}

/* =========================================================
   USER DATA SYNC
========================================================= */

function syncRegisteredUser(
  previousEmail: string,
  updated: StoredUser
) {
  const previous =
    previousEmail
      .trim()
      .toLowerCase();

  let changed = false;

  const next =
    readArray(USERS_KEY).map(
      (item) => {
        if (
          String(item?.email || "")
            .trim()
            .toLowerCase() !==
          previous
        ) {
          return item;
        }

        changed = true;

        return {
          ...item,
          firstName:
            updated.firstName,
          lastName:
            updated.lastName,
          email:
            updated.email,
          mobile:
            updated.mobile,
        };
      }
    );

  if (changed) {
    window.localStorage.setItem(
      USERS_KEY,
      JSON.stringify(next)
    );
  }
}

function removeRegisteredUser(
  email: string
) {
  const target =
    email.trim().toLowerCase();

  const next =
    readArray(USERS_KEY).filter(
      (item) =>
        String(item?.email || "")
          .trim()
          .toLowerCase() !==
        target
    );

  window.localStorage.setItem(
    USERS_KEY,
    JSON.stringify(next)
  );
}

function clearSession() {
  [
    "automarketUser",
    "marketplace_current_user",
    "marketplace_token",
    "authToken",
  ].forEach((key) => {
    window.localStorage.removeItem(
      key
    );
  });
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
      <span className="pf-field-label">
        {label}
      </span>

      {value ? (
        <strong>{value}</strong>
      ) : (
        <em>Not added</em>
      )}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

function ProfilePage() {
  const navigate =
    useNavigate();

  const [user, setUser] =
    useState<StoredUser | null>(
      () => readStoredUser()
    );

  const [addresses, setAddresses] =
    useState<Address[]>(() =>
      readArray(ADDRESS_KEY)
    );

  const [section, setSection] =
    useState<Section>(
      "overview"
    );

  const [isEditing, setIsEditing] =
    useState(false);

  const [editForm, setEditForm] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
    });

  const [
    notificationsEnabled,
    setNotificationsEnabled,
  ] = useState(
    () =>
      window.localStorage.getItem(
        NOTIFY_KEY
      ) !== "false"
  );

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  /* =======================================================
     IMAGE STATE
  ======================================================= */

  const [profileImage, setProfileImage] =
    useState<string>(() =>
      readProfileImage()
    );

  const [coverImage, setCoverImage] =
    useState<string>(() => {
      const storedUser =
        readStoredUser();

      return (
        storedUser?.coverImage ||
        window.localStorage.getItem(
          COVER_IMAGE_KEY
        ) ||
        ""
      );
    });

  const [imageMessage, setImageMessage] =
    useState("");

  /* =======================================================
     ROLE
  ======================================================= */

  const role = normalizeRole(
    user?.role
  );

  const config =
    roleConfig[role];

  const RoleIcon =
    config.icon;

  const fullName = user
    ? getUserName(user)
    : "AutoMarket User";

  const phone = user
    ? getPhone(user)
    : "";

  const primaryAddress =
    addresses[0];

  const addressText =
    primaryAddress
      ? `${primaryAddress.city}, ${primaryAddress.postalCode}`
      : "";

  /* =======================================================
     EDIT FORM
  ======================================================= */

  useEffect(() => {
    if (!user) return;

    setEditForm({
      firstName:
        user.firstName || "",
      lastName:
        user.lastName || "",
      email:
        user.email || "",
      mobile:
        getPhone(user),
    });

    /*
      Profile image always comes from the shared
      automarketProfileImage key.
    */
    setProfileImage(
      readProfileImage()
    );

    setCoverImage(
      user.coverImage ||
        window.localStorage.getItem(
          COVER_IMAGE_KEY
        ) ||
        ""
    );
  }, [user]);

  /* =======================================================
     REFRESH USER DATA
  ======================================================= */

  useEffect(() => {
    const refresh = () => {
      setUser(
        readStoredUser()
      );

      setAddresses(
        readArray(ADDRESS_KEY)
      );
    };

    window.addEventListener(
      "storage",
      refresh
    );

    window.addEventListener(
      "automarket-user-updated",
      refresh
    );

    window.addEventListener(
      "automarket-address-updated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "storage",
        refresh
      );

      window.removeEventListener(
        "automarket-user-updated",
        refresh
      );

      window.removeEventListener(
        "automarket-address-updated",
        refresh
      );
    };
  }, []);

  /* =======================================================
     PROFILE IMAGE SYNC
  ======================================================= */

  useEffect(() => {
    const refreshProfileImage =
      () => {
        setProfileImage(
          readProfileImage()
        );
      };

    refreshProfileImage();

    window.addEventListener(
      PROFILE_IMAGE_UPDATED_EVENT,
      refreshProfileImage
    );

    window.addEventListener(
      "storage",
      refreshProfileImage
    );

    return () => {
      window.removeEventListener(
        PROFILE_IMAGE_UPDATED_EVENT,
        refreshProfileImage
      );

      window.removeEventListener(
        "storage",
        refreshProfileImage
      );
    };
  }, []);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const approved =
      readArray(APPROVED_KEY);

    const pending =
      readArray(PENDING_KEY);

    const email =
      (user?.email || "")
        .trim()
        .toLowerCase();

    const mine = (
      list: any[]
    ) =>
      list.filter(
        (item) =>
          String(
            item.sellerEmail ??
              item.seller_email ??
              ""
          )
            .trim()
            .toLowerCase() ===
          email
      );

    if (role === "admin") {
      return [
        {
          label: "Live listings",
          value:
            approved.filter(
              (p) => !p.sold
            ).length,
          icon: FaBoxOpen,
        },
        {
          label:
            "Awaiting approval",
          value: pending.length,
          icon: FaClock,
        },
      ];
    }

    if (role === "seller") {
      const myApproved =
        mine(approved);

      return [
        {
          label: "Live listings",
          value:
            myApproved.filter(
              (p) => !p.sold
            ).length,
          icon: FaBoxOpen,
        },
        {
          label: "Pending review",
          value:
            mine(pending).length,
          icon: FaClock,
        },
        {
          label: "Sold",
          value:
            myApproved.filter(
              (p) => p.sold
            ).length,
          icon: FaTag,
        },
      ];
    }

    return [
      {
        label:
          "Saved addresses",
        value:
          addresses.length,
        icon: FaMapMarkerAlt,
      },
      {
        label: "Notifications",
        value:
          notificationsEnabled
            ? "On"
            : "Off",
        icon: FaBell,
      },
    ];
  }, [
    user,
    role,
    addresses,
    notificationsEnabled,
  ]);

  /* =======================================================
     IMAGE HELPERS
  ======================================================= */

  const validateImage = (
    file: File
  ) => {
    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setImageMessage(
        "Please select an image file."
      );

      return false;
    }

    if (
      file.size >
      15 * 1024 * 1024
    ) {
      setImageMessage(
        "Please choose an image smaller than 15MB."
      );

      return false;
    }

    return true;
  };

  /* =======================================================
     PROFILE IMAGE
  ======================================================= */

  const handleProfileImageChange =
    async (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) return;

      event.target.value = "";

      if (!validateImage(file)) {
        return;
      }

      try {
        setImageMessage(
          "Updating profile picture..."
        );

        const compressed =
          await compressImage(
            file,
            512,
            512,
            0.82
          );

        /*
          Update React immediately.
        */
        setProfileImage(
          compressed
        );

        /*
          Save the exact same image under the
          shared Navbar/Profile key.
        */
        window.localStorage.setItem(
          PROFILE_IMAGE_KEY,
          compressed
        );

        setImageMessage(
          "Profile picture updated."
        );

        /*
          Notify Navbar immediately.
        */
        window.dispatchEvent(
          new Event(
            PROFILE_IMAGE_UPDATED_EVENT
          )
        );
      } catch {
        setImageMessage(
          "We could not use that image. Please try another one."
        );
      }
    };

  const removeProfileImage =
    () => {
      /*
        Immediately clear the local React state.
      */
      setProfileImage("");

      /*
        Remove the SAME shared storage key.
      */
      window.localStorage.removeItem(
        PROFILE_IMAGE_KEY
      );

      /*
        Keep the user records synchronized too,
        but do not use them as the Navbar's
        profile-image source.
      */
      if (user) {
        const updatedUser: StoredUser = {
          ...user,
          profileImage: "",
        };

        window.localStorage.setItem(
          "automarketUser",
          JSON.stringify(
            updatedUser
          )
        );

        window.localStorage.setItem(
          "marketplace_current_user",
          JSON.stringify(
            updatedUser
          )
        );

        setUser(updatedUser);
      }

      setImageMessage(
        "Profile picture removed."
      );

      /*
        Notify Navbar so it immediately switches
        back to the neutral user icon.
      */
      window.dispatchEvent(
        new Event(
          PROFILE_IMAGE_UPDATED_EVENT
        )
      );

      /*
        Preserve the existing user update notification
        for the rest of the application.
      */
      window.dispatchEvent(
        new Event(
          "automarket-user-updated"
        )
      );
    };

  /* =======================================================
     COVER IMAGE
  ======================================================= */

  const handleCoverImageChange =
    async (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) return;

      event.target.value = "";

      if (!validateImage(file)) {
        return;
      }

      try {
        setImageMessage(
          "Updating cover image..."
        );

        const compressed =
          await compressImage(
            file,
            1600,
            650,
            0.82
          );

        setCoverImage(
          compressed
        );

        window.localStorage.setItem(
          COVER_IMAGE_KEY,
          compressed
        );

        setImageMessage(
          "Cover image updated."
        );

        window.dispatchEvent(
          new Event(
            "automarket-user-updated"
          )
        );
      } catch {
        setImageMessage(
          "We could not use that image. Please try another one."
        );
      }
    };

  const removeCoverImage =
    () => {
      setCoverImage("");

      window.localStorage.removeItem(
        COVER_IMAGE_KEY
      );

      if (user) {
        const updatedUser: StoredUser = {
          ...user,
          coverImage: "",
        };

        window.localStorage.setItem(
          "automarketUser",
          JSON.stringify(
            updatedUser
          )
        );

        window.localStorage.setItem(
          "marketplace_current_user",
          JSON.stringify(
            updatedUser
          )
        );

        setUser(updatedUser);
      }

      setImageMessage(
        "Cover image removed."
      );

      window.dispatchEvent(
        new Event(
          "automarket-user-updated"
        )
      );
    };

  /* =======================================================
     PROFILE EDIT
  ======================================================= */

  const startEditing = () => {
    setSection("details");
    setIsEditing(true);
  };

  const handleEditChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setEditForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleSaveProfile = (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!user) return;

    const updatedUser: StoredUser =
      {
        ...user,

        firstName:
          editForm.firstName.trim(),

        lastName:
          editForm.lastName.trim(),

        email:
          editForm.email.trim(),

        mobile:
          editForm.mobile.trim(),

        profileImage,
        coverImage,
      };

    window.localStorage.setItem(
      "automarketUser",
      JSON.stringify(
        updatedUser
      )
    );

    window.localStorage.setItem(
      "marketplace_current_user",
      JSON.stringify(
        updatedUser
      )
    );

    /*
      Keep the shared profile-image key authoritative.
    */
    if (profileImage) {
      window.localStorage.setItem(
        PROFILE_IMAGE_KEY,
        profileImage
      );
    } else {
      window.localStorage.removeItem(
        PROFILE_IMAGE_KEY
      );
    }

    syncRegisteredUser(
      user.email || "",
      updatedUser
    );

    setUser(updatedUser);
    setIsEditing(false);

    window.dispatchEvent(
      new Event(
        "automarket-user-updated"
      )
    );

    window.dispatchEvent(
      new Event(
        PROFILE_IMAGE_UPDATED_EVENT
      )
    );
  };

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const toggleNotifications =
    () => {
      const next =
        !notificationsEnabled;

      setNotificationsEnabled(
        next
      );

      window.localStorage.setItem(
        NOTIFY_KEY,
        String(next)
      );
    };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    clearSession();

    navigate("/login");
  };

  /* =======================================================
     DELETE ACCOUNT
  ======================================================= */

  const handleDeleteAccount =
    () => {
      if (user?.email) {
        removeRegisteredUser(
          user.email
        );
      }

      clearSession();

      window.localStorage.removeItem(
        ADDRESS_KEY
      );

      window.localStorage.removeItem(
        PROFILE_IMAGE_KEY
      );

      window.localStorage.removeItem(
        COVER_IMAGE_KEY
      );

      /*
        Ensure any mounted Navbar immediately
        clears its profile image.
      */
      window.dispatchEvent(
        new Event(
          PROFILE_IMAGE_UPDATED_EVENT
        )
      );

      setShowDeleteModal(
        false
      );

      navigate("/register");
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

            <h2>
              You're not signed in
            </h2>

            <p>
              Sign in to view and manage
              your AutoMarket profile.
            </p>

            <button
              type="button"
              className="pf-btn pf-btn-primary"
              onClick={() =>
                navigate("/login")
              }
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

        <p>
          A quick look at your account.
        </p>
      </div>

      <div className="pf-stats">
        {stats.map((stat) => {
          const StatIcon =
            stat.icon;

          return (
            <div
              className="pf-stat"
              key={stat.label}
            >
              <span className="pf-stat-icon">
                <StatIcon />
              </span>

              <strong>
                {stat.value}
              </strong>

              <span>
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pf-links">
        <button
          type="button"
          className="pf-link-row"
          onClick={() =>
            navigate(
              config.actionPath
            )
          }
        >
          <span className="pf-link-icon">
            <RoleIcon />
          </span>

          <span className="pf-link-text">
            <strong>
              {config.actionLabel}
            </strong>

            <small>
              {config.tagline}
            </small>
          </span>

          <FaChevronRight />
        </button>

        <button
          type="button"
          className="pf-link-row"
          onClick={() =>
            navigate(
              "/notifications"
            )
          }
        >
          <span className="pf-link-icon">
            <FaBell />
          </span>

          <span className="pf-link-text">
            <strong>
              Notifications
            </strong>

            <small>
              See what's new on your account
            </small>
          </span>

          <FaChevronRight />
        </button>

        <button
          type="button"
          className="pf-link-row"
          onClick={() =>
            navigate(
              "/settings"
            )
          }
        >
          <span className="pf-link-icon">
            <FaCog />
          </span>

          <span className="pf-link-text">
            <strong>
              Settings
            </strong>

            <small>
              Manage your account preferences
            </small>
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
          <h3>
            Personal details
          </h3>

          <p>
            The information linked
            to your account.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="pf-btn pf-btn-outline"
            onClick={() =>
              setIsEditing(true)
            }
          >
            <FaPencilAlt />
            Edit
          </button>
        )}
      </div>

      <div className="pf-image-settings">
        <div className="pf-image-setting">
          <div className="pf-image-setting-preview">
            {profileImage ? (
              <img
                src={profileImage}
                alt={`${fullName} profile`}
              />
            ) : (
              <FaUser />
            )}
          </div>

          <div className="pf-image-setting-content">
            <strong>
              Profile picture
            </strong>

            <span>
              Choose a picture from
              your device.
            </span>

            <div className="pf-image-actions">
              <label
                htmlFor="profile-image-input"
                className="pf-btn pf-btn-outline"
              >
                <FaCamera />
                {profileImage
                  ? "Change picture"
                  : "Upload picture"}
              </label>

              <input
                id="profile-image-input"
                className="pf-hidden-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleProfileImageChange
                }
              />

              {profileImage && (
                <button
                  type="button"
                  className="pf-text-button"
                  onClick={
                    removeProfileImage
                  }
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
                ? {
                    backgroundImage: `url("${coverImage}")`,
                  }
                : undefined
            }
          >
            {!coverImage && (
              <FaCamera />
            )}
          </div>

          <div className="pf-image-setting-content">
            <strong>
              Cover image
            </strong>

            <span>
              Choose the background
              image shown at the top
              of your profile.
            </span>

            <div className="pf-image-actions">
              <label
                htmlFor="cover-image-input"
                className="pf-btn pf-btn-outline"
              >
                <FaCamera />
                {coverImage
                  ? "Change cover"
                  : "Upload cover"}
              </label>

              <input
                id="cover-image-input"
                className="pf-hidden-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleCoverImageChange
                }
              />

              {coverImage && (
                <button
                  type="button"
                  className="pf-text-button"
                  onClick={
                    removeCoverImage
                  }
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {imageMessage && (
        <div className="pf-image-message">
          {imageMessage}
        </div>
      )}

      {isEditing ? (
        <form
          onSubmit={
            handleSaveProfile
          }
        >
          <div className="pf-form-grid">
            <div className="pf-form-group">
              <label htmlFor="firstName">
                First name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={
                  editForm.firstName
                }
                onChange={
                  handleEditChange
                }
              />
            </div>

            <div className="pf-form-group">
              <label htmlFor="lastName">
                Last name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={
                  editForm.lastName
                }
                onChange={
                  handleEditChange
                }
              />
            </div>

            <div className="pf-form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={
                  editForm.email
                }
                onChange={
                  handleEditChange
                }
                required
              />
            </div>

            <div className="pf-form-group">
              <label htmlFor="mobile">
                Mobile number
              </label>

              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={
                  editForm.mobile
                }
                onChange={
                  handleEditChange
                }
              />
            </div>
          </div>

          <div className="pf-form-actions">
            <button
              type="button"
              className="pf-btn pf-btn-outline"
              onClick={() =>
                setIsEditing(false)
              }
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
          <Field
            label="First name"
            value={
              user.firstName
            }
          />

          <Field
            label="Last name"
            value={
              user.lastName
            }
          />

          <Field
            label="Email"
            value={user.email}
          />

          <Field
            label="Mobile"
            value={phone}
          />

          <Field
            label="Account type"
            value={config.label}
          />

          <Field
            label="Location"
            value={addressText}
          />
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
          <h3>
            Saved addresses
          </h3>

          <p>
            Addresses you can use
            at checkout.
          </p>
        </div>

        <button
          type="button"
          className="pf-btn pf-btn-outline"
          onClick={() =>
            navigate(
              "/addresses"
            )
          }
        >
          Manage
          <FaChevronRight />
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="pf-empty-block">
          <FaMapMarkerAlt />

          <div>
            <strong>
              No saved addresses yet
            </strong>

            <p>
              Add an address to check
              out faster.
            </p>
          </div>

          <button
            type="button"
            className="pf-btn pf-btn-primary"
            onClick={() =>
              navigate(
                "/addresses"
              )
            }
          >
            Add address
          </button>
        </div>
      ) : (
        <div className="pf-address-list">
          {addresses.map(
            (
              address,
              index
            ) => (
              <div
                className="pf-address"
                key={address.id}
              >
                <span className="pf-address-icon">
                  <FaMapMarkerAlt />
                </span>

                <div>
                  <strong>
                    {address.label}

                    {index === 0 && (
                      <span className="pf-tag">
                        Default
                      </span>
                    )}
                  </strong>

                  <p>
                    {address.street}
                  </p>

                  <p>
                    {address.city},{" "}
                    {
                      address.postalCode
                    }
                  </p>

                  {address.phone && (
                    <small>
                      {address.phone}
                    </small>
                  )}
                </div>
              </div>
            )
          )}
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
        <h3>
          Preferences
        </h3>

        <p>
          Choose how AutoMarket
          keeps in touch.
        </p>
      </div>

      <div className="pf-toggle-row">
        <span className="pf-link-icon">
          <FaBell />
        </span>

        <span className="pf-link-text">
          <strong>
            Account notifications
          </strong>

          <small>
            Receive important updates
            about your account
          </small>
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={
            notificationsEnabled
          }
          aria-label="Account notifications"
          className={
            notificationsEnabled
              ? "pf-toggle pf-toggle-on"
              : "pf-toggle"
          }
          onClick={
            toggleNotifications
          }
        >
          <span />
        </button>
      </div>

      <div className="pf-danger">
        <div>
          <h4>
            Delete account
          </h4>

          <p>
            Permanently remove your
            AutoMarket account and
            saved details from this
            browser. This can't be
            undone.
          </p>
        </div>

        <button
          type="button"
          className="pf-btn pf-btn-danger-outline"
          onClick={() =>
            setShowDeleteModal(
              true
            )
          }
        >
          <FaTrash />
          Delete account
        </button>
      </div>
    </>
  );

  const panels: Record<
    Section,
    ReactElement
  > = {
    overview,
    details,
    addresses:
      addressesSection,
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
      {/* =================================================
          COVER IMAGE
      ================================================= */}

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
            {coverImage
              ? "Change cover"
              : "Add cover"}
          </label>

          <input
            id="cover-image-header-input"
            className="pf-hidden-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={
              handleCoverImageChange
            }
          />

          {coverImage && (
            <button
              type="button"
              className="pf-cover-remove"
              onClick={
                removeCoverImage
              }
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          IDENTITY
      ================================================= */}

      <header className="pf-identity">
        <div className="pf-profile-photo">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${fullName} profile`}
            />
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
            onChange={
              handleProfileImageChange
            }
          />
        </div>

        <div className="pf-identity-text">
          <div className="pf-name-row">
            <h2>
              {fullName}
            </h2>

            <span className="pf-role">
              {config.label}
            </span>
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
            onClick={
              startEditing
            }
          >
            <FaPencilAlt />
            Edit profile
          </button>

          <button
            type="button"
            className="pf-btn pf-btn-primary"
            onClick={() =>
              navigate(
                config.actionPath
              )
            }
          >
            {config.actionLabel}
          </button>
        </div>
      </header>

      {/* =================================================
          IMAGE MESSAGE
      ================================================= */}

      {imageMessage && (
        <div className="pf-image-toast">
          {imageMessage}
        </div>
      )}

      {/* =================================================
          MENU + CONTENT
      ================================================= */}

      <div className="pf-layout">
        <nav
          className="pf-nav"
          aria-label="Account sections"
        >
          {sections.map(
            ({
              id,
              label,
              icon: Icon,
            }) => (
              <button
                key={id}
                type="button"
                className={
                  section === id
                    ? "pf-nav-item active"
                    : "pf-nav-item"
                }
                aria-current={
                  section === id
                    ? "page"
                    : undefined
                }
                onClick={() =>
                  setSection(id)
                }
              >
                <Icon />
                {label}
              </button>
            )
          )}

          <button
            type="button"
            className="pf-nav-item pf-nav-signout"
            onClick={
              handleLogout
            }
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </nav>

        <section className="pf-panel">
          {panels[section]}
        </section>
      </div>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {showDeleteModal && (
        <div
          className="pf-modal-overlay"
          onMouseDown={() =>
            setShowDeleteModal(
              false
            )
          }
        >
          <div
            className="pf-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pf-delete-title"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div className="pf-modal-icon">
              <FaTrash />
            </div>

            <h2 id="pf-delete-title">
              Delete your account?
            </h2>

            <p>
              Your AutoMarket details
              will be removed from
              this browser and you'll
              be signed out. This
              can't be undone.
            </p>

            <div className="pf-modal-actions">
              <button
                type="button"
                className="pf-btn pf-btn-outline"
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
              >
                Keep my account
              </button>

              <button
                type="button"
                className="pf-btn pf-btn-danger"
                onClick={
                  handleDeleteAccount
                }
              >
                Delete account
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