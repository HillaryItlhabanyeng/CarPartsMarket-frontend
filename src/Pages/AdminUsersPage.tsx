import { useMemo, useState } from "react";

import {
  FaSearch,
  FaEye,
  FaEdit,
  FaBan,
  FaCheck,
  FaTimes,
  FaChevronUp,
  FaShoppingCart,
  FaHeart,
  FaBoxOpen,
  FaUsers,
  FaUser,
  FaStore,
  FaMoneyBillWave,
} from "react-icons/fa";

import Navbar from "../Components/Navbar";

import "./AdminUsersPage.css";

type UserRole = "Buyer" | "Seller" | "Admin";

type UserStatus = "Active" | "Pending" | "Suspended";

type SellerProduct = {
  id: number;
  name: string;
  price: number;
  status: "Live" | "Pending" | "Rejected";
  buyerInterest: number;
};

type User = {
  id: number;
  initials: string;
  name: string;
  email: string;
  role: UserRole;
  joined: string;
  status: UserStatus;

  listings?: SellerProduct[];
  revenue?: number;

  cartItems?: number;
  wishlistItems?: number;
  orders?: number;
  spent?: number;
};

const STORAGE_KEY = "marketplace_users";

const demoUsers: User[] = [
  {
    id: 1,
    initials: "TM",
    name: "Thabo Moekoena",
    email: "thabo@example.com",
    role: "Seller",
    joined: "12 Jan 2026",
    status: "Active",
    revenue: 12450,
    listings: [
      {
        id: 101,
        name: "Toyota Corolla Brake Pads",
        price: 850,
        status: "Live",
        buyerInterest: 14,
      },
      {
        id: 102,
        name: "VW Polo Front Bumper",
        price: 1500,
        status: "Pending",
        buyerInterest: 8,
      },
      {
        id: 103,
        name: "Ford Ranger Headlight",
        price: 2100,
        status: "Live",
        buyerInterest: 6,
      },
    ],
  },

  {
    id: 2,
    initials: "LN",
    name: "Liyabona Ngece",
    email: "liyabona@example.com",
    role: "Buyer",
    joined: "18 Feb 2026",
    status: "Active",
    cartItems: 3,
    wishlistItems: 6,
    orders: 4,
    spent: 4850,
  },

  {
    id: 3,
    initials: "KD",
    name: "Karabo Dlamini",
    email: "karabo@example.com",
    role: "Seller",
    joined: "02 Mar 2026",
    status: "Pending",
    revenue: 3200,
    listings: [
      {
        id: 104,
        name: "BMW 3 Series Grille",
        price: 1200,
        status: "Pending",
        buyerInterest: 5,
      },
      {
        id: 105,
        name: "Mercedes C-Class Mirror",
        price: 2000,
        status: "Pending",
        buyerInterest: 3,
      },
    ],
  },

  {
    id: 4,
    initials: "SN",
    name: "Sipho Ndlovu",
    email: "sipho@example.com",
    role: "Buyer",
    joined: "11 Mar 2026",
    status: "Active",
    cartItems: 1,
    wishlistItems: 3,
    orders: 2,
    spent: 2150,
  },

  {
    id: 5,
    initials: "MP",
    name: "Mpho Petersen",
    email: "mpho@example.com",
    role: "Buyer",
    joined: "22 Mar 2026",
    status: "Suspended",
    cartItems: 0,
    wishlistItems: 2,
    orders: 1,
    spent: 750,
  },
];

/* =========================================================
   READ USERS
========================================================= */

function readUsers(): User[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return demoUsers;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return demoUsers;
    }

    return parsed.map((user: any, index: number) => {
      const firstName = user.firstName ?? "";
      const lastName = user.lastName ?? "";

      const fullName =
        user.name ??
        `${firstName} ${lastName}`.trim() ??
        "User";

      const initials =
        user.initials ??
        `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

      let role: UserRole = "Buyer";

      if (
        user.role === "Seller" ||
        user.role === "seller" ||
        user.role === "vendor"
      ) {
        role = "Seller";
      }

      if (
        user.role === "Admin" ||
        user.role === "admin" ||
        user.role === "administrator"
      ) {
        role = "Admin";
      }

      let status: UserStatus = "Active";

      if (
        user.status === "Suspended" ||
        user.status === "suspended"
      ) {
        status = "Suspended";
      } else if (
        user.status === "Pending" ||
        user.status === "pending" ||
        user.status === "Review" ||
        user.status === "review"
      ) {
        status = "Pending";
      }

      return {
        id: user.id ?? index + 1,
        initials: initials || "U",
        name: fullName || "User",
        email: user.email ?? "",
        role,
        joined: user.joined ?? "Recently",
        status,

        listings: user.listings ?? [],
        revenue: Number(user.revenue ?? 0),

        cartItems: Number(user.cartItems ?? 0),
        wishlistItems: Number(user.wishlistItems ?? 0),
        orders: Number(user.orders ?? 0),
        spent: Number(user.spent ?? 0),
      };
    });
  } catch {
    return demoUsers;
  }
}

/* =========================================================
   SAVE USERS
========================================================= */

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(value: number) {
  return `R${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* =========================================================
   ADMIN USERS PAGE
========================================================= */

function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(() => readUsers());

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    | "All Users"
    | "Buyers"
    | "Sellers"
    | "Pending Approval"
    | "Suspended"
  >("All Users");

  const [expandedUser, setExpandedUser] =
    useState<number | null>(null);

  const [editingUser, setEditingUser] =
    useState<User | null>(null);

  /* =========================================================
     FILTER USERS
  ========================================================= */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      let matchesFilter = true;

      if (filter === "Buyers") {
        matchesFilter = user.role === "Buyer";
      }

      if (filter === "Sellers") {
        matchesFilter = user.role === "Seller";
      }

      if (filter === "Pending Approval") {
        matchesFilter = user.status === "Pending";
      }

      if (filter === "Suspended") {
        matchesFilter = user.status === "Suspended";
      }

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalUsers = users.length;

  const totalBuyers = users.filter(
    (user) => user.role === "Buyer"
  ).length;

  const totalSellers = users.filter(
    (user) => user.role === "Seller"
  ).length;

  const pendingUsers = users.filter(
    (user) => user.status === "Pending"
  ).length;

  /* =========================================================
     UPDATE USERS
  ========================================================= */

  const updateUsers = (nextUsers: User[]) => {
    setUsers(nextUsers);
    saveUsers(nextUsers);
  };

  /* =========================================================
     EXPAND USER
  ========================================================= */

  const toggleUser = (id: number) => {
    setExpandedUser((current) =>
      current === id ? null : id
    );
  };

  /* =========================================================
     SUSPEND / ACTIVATE
  ========================================================= */

  const handleSuspend = (user: User) => {
    const nextStatus: UserStatus =
      user.status === "Suspended"
        ? "Active"
        : "Suspended";

    updateUsers(
      users.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status: nextStatus,
            }
          : item
      )
    );
  };

  /* =========================================================
     APPROVE USER
  ========================================================= */

  const handleApprove = (user: User) => {
    updateUsers(
      users.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status: "Active",
            }
          : item
      )
    );
  };

  /* =========================================================
     UPDATE LISTING
  ========================================================= */

  const handleListingStatus = (
    userId: number,
    productId: number,
    status: SellerProduct["status"]
  ) => {
    const nextUsers = users.map((user) => {
      if (
        user.id !== userId ||
        !user.listings
      ) {
        return user;
      }

      return {
        ...user,

        listings: user.listings.map((product) =>
          product.id === productId
            ? {
                ...product,
                status,
              }
            : product
        ),
      };
    });

    updateUsers(nextUsers);
  };

  /* =========================================================
     SAVE EDITED USER
  ========================================================= */

  const handleSaveEdit = () => {
    if (!editingUser) {
      return;
    }

    updateUsers(
      users.map((user) =>
        user.id === editingUser.id
          ? editingUser
          : user
      )
    );

    setEditingUser(null);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="admin-users-page">

      {/* =====================================================
          AUTO MARKET NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="admin-users-content">

        {/* PAGE HEADER */}

        <section className="admin-users-header">
          <div>
            <span className="admin-users-eyebrow">
              USER MANAGEMENT
            </span>

            <h1>Users</h1>

            <p>
              Manage AutoMarket buyers and sellers
              from one place.
            </p>
          </div>

          <div className="admin-users-header-actions">
            <button
              type="button"
              className="admin-users-refresh-btn"
              onClick={() =>
                setUsers(readUsers())
              }
            >
              Refresh
            </button>
          </div>
        </section>

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="admin-user-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaUsers />
            </div>

            <div>
              <span>Total Users</span>
              <strong>{totalUsers}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaUser />
            </div>

            <div>
              <span>Buyers</span>
              <strong>{totalBuyers}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaStore />
            </div>

            <div>
              <span>Sellers</span>
              <strong>{totalSellers}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaMoneyBillWave />
            </div>

            <div>
              <span>Pending Approval</span>
              <strong>{pendingUsers}</strong>
            </div>
          </div>

        </section>

        {/* ===================================================
            FILTERS
        =================================================== */}

        <section className="admin-users-toolbar">

          <div className="admin-user-tabs">

            {[
              "All Users",
              "Buyers",
              "Sellers",
              "Pending Approval",
              "Suspended",
            ].map((tab) => (
              <button
                key={tab}
                type="button"
                className={
                  filter === tab
                    ? "admin-user-tab active"
                    : "admin-user-tab"
                }
                onClick={() =>
                  setFilter(
                    tab as
                      | "All Users"
                      | "Buyers"
                      | "Sellers"
                      | "Pending Approval"
                      | "Suspended"
                  )
                }
              >
                {tab}
              </button>
            ))}

          </div>

          <div className="admin-user-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

        </section>

        {/* ===================================================
            USERS TABLE
        =================================================== */}

        <section className="admin-users-table-card">

          <div className="admin-table-heading">

            <div>
              <h2>All Users</h2>

              <p>
                {filteredUsers.length} users found
              </p>
            </div>

          </div>

          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Activity</th>
                  <th>Revenue / Spent</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.map((user) => {

                  const isExpanded =
                    expandedUser === user.id;

                  return (
                    <>
                      {/* USER ROW */}

                      <tr
                        key={user.id}
                        className={
                          isExpanded
                            ? "admin-user-row expanded"
                            : "admin-user-row"
                        }
                      >

                        {/* USER */}

                        <td>
                          <div className="admin-user-profile">

                            <div className="admin-user-avatar">
                              {user.initials}
                            </div>

                            <div>
                              <strong>
                                {user.name}
                              </strong>

                              <span>
                                {user.email}
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* ROLE */}

                        <td>
                          <span
                            className={`admin-role-badge ${user.role.toLowerCase()}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* JOINED */}

                        <td>
                          {user.joined}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`admin-status-badge ${user.status.toLowerCase()}`}
                          >
                            <span />
                            {user.status}
                          </span>
                        </td>

                        {/* ACTIVITY */}

                        <td>

                          {user.role === "Seller" ? (
                            <div className="admin-activity-value">

                              <strong>
                                {user.listings?.length ?? 0}
                              </strong>

                              <span>
                                Listings
                              </span>

                            </div>
                          ) : (
                            <div className="admin-activity-value">

                              <strong>
                                {user.orders ?? 0}
                              </strong>

                              <span>
                                Orders
                              </span>

                            </div>
                          )}

                        </td>

                        {/* MONEY */}

                        <td>

                          <div className="admin-money-value">

                            <strong>
                              {user.role === "Seller"
                                ? formatCurrency(
                                    user.revenue ?? 0
                                  )
                                : formatCurrency(
                                    user.spent ?? 0
                                  )}
                            </strong>

                            <span>
                              {user.role === "Seller"
                                ? "Revenue"
                                : "Spent"}
                            </span>

                          </div>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-user-actions">

                            <button
                              type="button"
                              title="View details"
                              onClick={() =>
                                toggleUser(user.id)
                              }
                            >
                              {isExpanded ? (
                                <FaChevronUp />
                              ) : (
                                <FaEye />
                              )}
                            </button>

                            <button
                              type="button"
                              title="Edit user"
                              onClick={() =>
                                setEditingUser(user)
                              }
                            >
                              <FaEdit />
                            </button>

                            {user.status === "Pending" ? (
                              <button
                                type="button"
                                title="Approve user"
                                onClick={() =>
                                  handleApprove(user)
                                }
                              >
                                <FaCheck />
                              </button>
                            ) : (
                              <button
                                type="button"
                                title={
                                  user.status ===
                                  "Suspended"
                                    ? "Activate user"
                                    : "Suspend user"
                                }
                                onClick={() =>
                                  handleSuspend(user)
                                }
                              >
                                {user.status ===
                                "Suspended" ? (
                                  <FaCheck />
                                ) : (
                                  <FaBan />
                                )}
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>

                      {/* =================================================
                          EXPANDED USER DETAILS
                      ================================================= */}

                      {isExpanded && (
                        <tr
                          key={`${user.id}-details`}
                          className="admin-user-details-row"
                        >

                          <td colSpan={7}>

                            {/* SELLER DETAILS */}

                            {user.role === "Seller" ? (

                              <div className="admin-expanded-content">

                                <div className="admin-expanded-header">

                                  <div>

                                    <span>
                                      SELLER ACTIVITY
                                    </span>

                                    <h3>
                                      {user.name}'s Listings
                                    </h3>

                                  </div>

                                  <div className="seller-summary">

                                    <div>
                                      <strong>
                                        {user.listings?.length ??
                                          0}
                                      </strong>

                                      <span>
                                        Listings
                                      </span>
                                    </div>

                                    <div>
                                      <strong>
                                        {user.listings?.reduce(
                                          (
                                            total,
                                            product
                                          ) =>
                                            total +
                                            product.buyerInterest,
                                          0
                                        ) ?? 0}
                                      </strong>

                                      <span>
                                        Interested Buyers
                                      </span>
                                    </div>

                                    <div>
                                      <strong>
                                        {formatCurrency(
                                          user.revenue ?? 0
                                        )}
                                      </strong>

                                      <span>
                                        Revenue
                                      </span>
                                    </div>

                                  </div>

                                </div>

                                {/* SELLER PRODUCTS */}

                                <div className="seller-products">

                                  {user.listings &&
                                  user.listings.length > 0 ? (

                                    user.listings.map(
                                      (product) => (

                                        <div
                                          className="seller-product"
                                          key={product.id}
                                        >

                                          <div className="seller-product-info">

                                            <div className="seller-product-icon">
                                              <FaStore />
                                            </div>

                                            <div>

                                              <strong>
                                                {product.name}
                                              </strong>

                                              <span>
                                                {formatCurrency(
                                                  product.price
                                                )}
                                              </span>

                                            </div>

                                          </div>

                                          <div className="seller-interest">

                                            <strong>
                                              {
                                                product.buyerInterest
                                              }
                                            </strong>

                                            <span>
                                              interested buyers
                                            </span>

                                          </div>

                                          <span
                                            className={`listing-status ${product.status.toLowerCase()}`}
                                          >
                                            {product.status}
                                          </span>

                                          {product.status ===
                                            "Pending" && (

                                            <div className="listing-actions">

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleListingStatus(
                                                    user.id,
                                                    product.id,
                                                    "Live"
                                                  )
                                                }
                                              >
                                                <FaCheck />
                                                Approve
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleListingStatus(
                                                    user.id,
                                                    product.id,
                                                    "Rejected"
                                                  )
                                                }
                                              >
                                                <FaTimes />
                                                Reject
                                              </button>

                                            </div>

                                          )}

                                        </div>

                                      )
                                    )

                                  ) : (

                                    <div className="admin-no-data">
                                      This seller has no listings yet.
                                    </div>

                                  )}

                                </div>

                              </div>

                            ) : (

                              /* BUYER DETAILS */

                              <div className="admin-expanded-content">

                                <div className="admin-expanded-header">

                                  <div>

                                    <span>
                                      BUYER ACTIVITY
                                    </span>

                                    <h3>
                                      {user.name}'s Account Activity
                                    </h3>

                                  </div>

                                </div>

                                <div className="buyer-activity-grid">

                                  <div className="buyer-activity-card">

                                    <FaShoppingCart />

                                    <div>
                                      <strong>
                                        {user.cartItems ?? 0}
                                      </strong>

                                      <span>
                                        Cart Items
                                      </span>
                                    </div>

                                  </div>

                                  <div className="buyer-activity-card">

                                    <FaHeart />

                                    <div>
                                      <strong>
                                        {user.wishlistItems ?? 0}
                                      </strong>

                                      <span>
                                        Wishlist
                                      </span>
                                    </div>

                                  </div>

                                  <div className="buyer-activity-card">

                                    <FaBoxOpen />

                                    <div>
                                      <strong>
                                        {user.orders ?? 0}
                                      </strong>

                                      <span>
                                        Orders
                                      </span>
                                    </div>

                                  </div>

                                  <div className="buyer-activity-card">

                                    <FaMoneyBillWave />

                                    <div>
                                      <strong>
                                        {formatCurrency(
                                          user.spent ?? 0
                                        )}
                                      </strong>

                                      <span>
                                        Total Spent
                                      </span>
                                    </div>

                                  </div>

                                </div>

                              </div>

                            )}

                          </td>

                        </tr>
                      )}

                    </>
                  );
                })}

              </tbody>

            </table>

            {/* NO USERS */}

            {filteredUsers.length === 0 && (

              <div className="admin-users-empty">

                <FaUsers />

                <h3>
                  No users found
                </h3>

                <p>
                  Try changing the filter or search
                  for another user.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>

      {/* =====================================================
          EDIT USER MODAL
      ===================================================== */}

      {editingUser && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setEditingUser(null)
          }
        >

          <div
            className="admin-edit-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span>
                  EDIT USER
                </span>

                <h2>
                  Edit {editingUser.name}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingUser(null)
                }
              >
                <FaTimes />
              </button>

            </div>

            <div className="admin-edit-form">

              <label>
                Name

                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(event) =>
                    setEditingUser({
                      ...editingUser,
                      name: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Email

                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(event) =>
                    setEditingUser({
                      ...editingUser,
                      email: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Role

                <select
                  value={editingUser.role}
                  onChange={(event) =>
                    setEditingUser({
                      ...editingUser,
                      role: event.target.value as UserRole,
                    })
                  }
                >
                  <option value="Buyer">
                    Buyer
                  </option>

                  <option value="Seller">
                    Seller
                  </option>

                  <option value="Admin">
                    Admin
                  </option>
                </select>

              </label>

              <label>
                Status

                <select
                  value={editingUser.status}
                  onChange={(event) =>
                    setEditingUser({
                      ...editingUser,
                      status: event.target.value as UserStatus,
                    })
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Suspended">
                    Suspended
                  </option>
                </select>

              </label>

            </div>

            <div className="admin-modal-actions">

              <button
                type="button"
                className="admin-modal-cancel"
                onClick={() =>
                  setEditingUser(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-modal-save"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminUsersPage;