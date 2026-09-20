import { Fragment, useMemo, useState } from "react";

import {
  FaSearch,
  FaEye,
  FaEdit,
  FaBan,
  FaCheck,
  FaTimes,
  FaChevronUp,
  FaBoxOpen,
  FaUsers,
  FaUser,
  FaStore,
  FaMoneyBillWave,
} from "react-icons/fa";

import AdminShell from "../Components/AdminShell";
import {
  approveListing,
  declineListing,
  getApprovedListings,
  getPendingListings,
  type StoredListing,
} from "../Components/adminStore";
import type { Order } from "../Components/OrdersContext.types";
import {
  readUsers as readStoredUsers,
  writeUsers as writeStoredUsers,
  type UserRecord,
} from "../Components/userStore";

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

  orders?: number;
  spent?: number;
};

/* =========================================================
   READ USERS
   Accounts come from registration / login. Listings, revenue,
   orders and spend are worked out from what was really uploaded
   and ordered, never typed in by hand.
========================================================= */

const isCancelled = (order: Order) => order.status === "CANCELLED";

function readOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem("marketplace_orders");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readUsers(): User[] {
  const orders = readOrders().filter((order) => !isCancelled(order));
  const pending = getPendingListings();
  const approved = getApprovedListings();

  return readStoredUsers().map((user: UserRecord, index: number) => {
    const fullName =
      user.name ??
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

    const initials =
      user.initials ??
      `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

    const roleText = user.role?.toLowerCase();
    let role: UserRole = "Buyer";
    if (roleText === "seller" || roleText === "vendor") role = "Seller";
    if (roleText === "admin" || roleText === "administrator") role = "Admin";

    const statusText = user.status?.toLowerCase();
    let status: UserStatus = "Active";
    if (statusText === "suspended") status = "Suspended";
    else if (statusText === "pending" || statusText === "review") status = "Pending";

    const email = (user.email ?? "").toLowerCase();
    const isMine = (listing: StoredListing) =>
      !!email && listing.sellerEmail?.toLowerCase() === email;

    const unitsOrdered = (listingId: number) =>
      orders.reduce(
        (sum, order) =>
          sum +
          order.items
            .filter((item) => item.id === String(listingId))
            .reduce((units, item) => units + item.quantity, 0),
        0
      );

    const listings: SellerProduct[] = [
      ...pending.filter(isMine).map((listing) => ({
        id: listing.id,
        name: listing.title,
        price: listing.price,
        status: "Pending" as const,
        buyerInterest: unitsOrdered(listing.id),
      })),
      ...approved.filter(isMine).map((listing) => ({
        id: listing.id,
        name: listing.title,
        price: listing.price,
        status: "Live" as const,
        buyerInterest: unitsOrdered(listing.id),
      })),
    ];

    const revenue = orders.reduce(
      (sum, order) =>
        sum +
        order.items
          .filter((item) => !!email && item.sellerEmail?.toLowerCase() === email)
          .reduce((total, item) => total + item.price * item.quantity, 0),
      0
    );

    const bought = orders.filter(
      (order) => !!email && order.buyerEmail?.toLowerCase() === email
    );

    return {
      id: Number(user.id ?? index + 1),
      initials: initials || "U",
      name: fullName || "User",
      email: user.email ?? "",
      role,
      joined: user.joined ?? "Recently",
      status,

      listings,
      revenue,

      orders: bought.length,
      spent: bought.reduce((sum, order) => sum + order.total, 0),
    };
  });
}

/* =========================================================
   SAVE USERS
   Only the fields an admin can change are written back, so
   details from registration (mobile, first/last name, last
   login) are never lost.
========================================================= */

function saveUsers(users: User[]) {
  const stored = readStoredUsers();

  writeStoredUsers(
    users.map((user) => {
      const base =
        stored.find((item) => Number(item.id) === user.id) ??
        stored.find((item) => item.email?.toLowerCase() === user.email.toLowerCase());

      return {
        ...base,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        joined: user.joined,
        initials: user.initials,
      };
    })
  );
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
    productId: number,
    status: SellerProduct["status"]
  ) => {
    const listing = getPendingListings().find(
      (item) => item.id === productId
    );

    if (listing) {
      if (status === "Live") approveListing(listing);
      if (status === "Rejected") declineListing(listing);
    }

    setUsers(readUsers());
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
    <AdminShell
      title="Users"
      subtitle="Manage AutoMarket buyers and sellers from one place"
      actions={
        <button
          type="button"
          className="admin-users-refresh-btn"
          onClick={() => setUsers(readUsers())}
        >
          Refresh
        </button>
      }
    >
      <div className="admin-users-content">

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
                    <Fragment key={user.id}>
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
                                              units ordered
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
                                                  handleListingStatus(product.id,
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
                                                  handleListingStatus(product.id,
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

                    </Fragment>
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

      </div>

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

    </AdminShell>
  );
}

export default AdminUsersPage;