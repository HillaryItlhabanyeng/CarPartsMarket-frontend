import { Fragment, useMemo, useState } from "react";
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
  status: "Live" | "Pending" | "Sold" | "Rejected";
  buyerInterest: number;
};

type User = {
  id: number;
  initials: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  joined: string;
  status: UserStatus;
  listings: SellerProduct[];
  revenue: number;
  cartItems: number;
  wishlistItems: number;
  orders: number;
  spent: number;
};

type RawUser = Record<string, any>;
type RawProduct = Record<string, any>;

const USERS_KEY = "marketplace_users";
const CURRENT_USER_KEY = "marketplace_current_user";
const AUTOMARKET_USER_KEY = "automarketUser";
const PENDING_PRODUCTS_KEY = "marketplace_pending_products";
const APPROVED_PRODUCTS_KEY = "marketplace_approved_products";
const OVERRIDES_KEY = "marketplace_user_admin_overrides";

/*
 * These are the five users that were previously hard-coded into the
 * Admin Users page. They are deliberately ignored so they cannot keep
 * appearing after the hard-coded demo data has been removed.
 */
const LEGACY_DEMO_EMAILS = new Set([
  "thabo@example.com",
  "liyabona@example.com",
  "karabo@example.com",
  "sipho@example.com",
  "mpho@example.com",
]);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function readArray(key: string): RawUser[] {
  const value = readJson<unknown>(key, []);
  return Array.isArray(value) ? (value as RawUser[]) : [];
}

function normalizeEmail(email?: unknown): string {
  return String(email ?? "").trim().toLowerCase();
}

function normalizeRole(role?: unknown): UserRole {
  const value = String(role ?? "").trim().toLowerCase();

  if (value === "seller" || value === "vendor") return "Seller";
  if (value === "admin" || value === "administrator") return "Admin";
  return "Buyer";
}

function normalizeStatus(status?: unknown): UserStatus {
  const value = String(status ?? "").trim().toLowerCase();

  if (value === "suspended") return "Suspended";
  if (value === "pending" || value === "review") return "Pending";
  return "Active";
}

function getName(user: RawUser): string {
  const explicitName = String(user.name ?? "").trim();
  if (explicitName) return explicitName;

  const firstName = String(
    user.firstName ?? user.first_name ?? ""
  ).trim();
  const lastName = String(
    user.lastName ?? user.last_name ?? ""
  ).trim();

  return `${firstName} ${lastName}`.trim() || "User";
}

function getInitials(name: string, user?: RawUser): string {
  const firstName = String(
    user?.firstName ?? user?.first_name ?? ""
  ).trim();
  const lastName = String(
    user?.lastName ?? user?.last_name ?? ""
  ).trim();

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase() || "U";
}

function formatCurrency(value: number) {
  return `R${Number(value || 0).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getProductSellerEmail(product: RawProduct): string {
  return normalizeEmail(
    product.sellerEmail ??
      product.seller_email ??
      (typeof product.seller === "object"
        ? product.seller?.email
        : "")
  );
}

function getProductSellerName(product: RawProduct): string {
  if (typeof product.seller === "string") {
    return product.seller.trim();
  }

  if (product.seller && typeof product.seller === "object") {
    return getName(product.seller);
  }

  return String(product.sellerName ?? "").trim();
}

function getProductStatus(product: RawProduct): SellerProduct["status"] {
  const raw = String(
    product.listingStatus ?? product.status ?? "Pending"
  ).trim().toLowerCase();

  if (product.sold === true || raw === "sold") return "Sold";
  if (raw === "approved" || raw === "active" || raw === "live") {
    return "Live";
  }
  if (raw === "rejected") return "Rejected";
  return "Pending";
}

function productToSellerProduct(product: RawProduct): SellerProduct {
  return {
    id: Number(product.id) || Date.now(),
    name: String(product.title ?? product.name ?? "Product"),
    price: Number(product.price) || 0,
    status: getProductStatus(product),
    buyerInterest: Number(
      product.buyerInterest ?? product.interestedBuyers ?? 0
    ) || 0,
  };
}

function readAdminOverrides(): Record<string, Partial<User>> {
  const value = readJson<unknown>(OVERRIDES_KEY, {});
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, Partial<User>>)
    : {};
}

function buildUsers(): User[] {
  const storedUsers = readArray(USERS_KEY);
  const currentUser = readJson<RawUser | null>(CURRENT_USER_KEY, null);
  const automarketUser = readJson<RawUser | null>(AUTOMARKET_USER_KEY, null);
  const pendingProducts = readArray(PENDING_PRODUCTS_KEY);
  const approvedProducts = readArray(APPROVED_PRODUCTS_KEY);
  const overrides = readAdminOverrides();

  const users = new Map<string, User>();

  const ensureUser = (
    rawUser: RawUser,
    fallbackRole: UserRole = "Buyer"
  ): User | null => {
    const email = normalizeEmail(rawUser.email);
    if (!email || LEGACY_DEMO_EMAILS.has(email)) return null;

    const name = getName(rawUser);
    const existing = users.get(email);
    const role = normalizeRole(rawUser.role ?? fallbackRole);

    const next: User = existing ?? {
      id:
        Number(rawUser.id) ||
        Math.abs(
          Array.from(email).reduce(
            (total, character) => total * 31 + character.charCodeAt(0),
            7
          )
        ),
      initials: getInitials(name, rawUser),
      name,
      email,
      mobile: String(rawUser.mobile ?? rawUser.phone ?? ""),
      role,
      joined: String(rawUser.joined ?? rawUser.createdAt ?? "Recently"),
      status: normalizeStatus(rawUser.status),
      listings: [],
      revenue: Number(rawUser.revenue ?? 0) || 0,
      cartItems: Number(rawUser.cartItems ?? 0) || 0,
      wishlistItems: Number(rawUser.wishlistItems ?? 0) || 0,
      orders: Number(rawUser.orders ?? 0) || 0,
      spent: Number(rawUser.spent ?? 0) || 0,
    };

    if (existing) {
      if (name !== "User") next.name = name;
      next.initials = getInitials(next.name, rawUser);
      next.mobile = String(
        rawUser.mobile ?? rawUser.phone ?? next.mobile ?? ""
      );
      next.role = role === "Buyer" && existing.role !== "Buyer"
        ? existing.role
        : role;
      next.joined = String(
        rawUser.joined ?? rawUser.createdAt ?? next.joined
      );
      next.status = normalizeStatus(rawUser.status ?? next.status);
    }

    users.set(email, next);
    return next;
  };

  /* Registered users already stored by the existing app. */
  storedUsers.forEach((user) => ensureUser(user));

  /* Current user keys used by your Login/Profile/Navbar code. */
  if (automarketUser && typeof automarketUser === "object") {
    ensureUser(automarketUser);
  }

  if (currentUser && typeof currentUser === "object") {
    ensureUser(currentUser);
  }

  /*
   * Sellers can also be discovered from the actual product records.
   * This means a seller will appear even if their account record is not
   * present in marketplace_users yet.
   */
  [...pendingProducts, ...approvedProducts].forEach((product) => {
    const email = getProductSellerEmail(product);
    if (!email || LEGACY_DEMO_EMAILS.has(email)) return;

    const sellerName = getProductSellerName(product);

    ensureUser({
      id: product.sellerId,
      name: sellerName || email.split("@")[0],
      email,
      role: "Seller",
      status: "Active",
    }, "Seller");
  });

  /* Add the seller's real listings from pending + approved storage. */
  const allProducts = [...pendingProducts, ...approvedProducts];

  allProducts.forEach((product) => {
    const email = getProductSellerEmail(product);
    if (!email || LEGACY_DEMO_EMAILS.has(email)) return;

    const seller = users.get(email);
    if (!seller) return;

    const mapped = productToSellerProduct(product);
    const alreadyExists = seller.listings.some(
      (item) => item.id === mapped.id
    );

    if (!alreadyExists) {
      seller.listings.push(mapped);
    }
  });

  /* Apply admin-only changes without replacing the source user data. */
  users.forEach((user, email) => {
    const override = overrides[email];
    if (!override) return;

    Object.assign(user, {
      ...override,
      role: override.role ?? user.role,
      status: override.status ?? user.status,
    });
  });

  return Array.from(users.values());
}

function persistAdminOverrides(users: User[]) {
  const current = readAdminOverrides();
  const next = { ...current };

  users.forEach((user) => {
    next[normalizeEmail(user.email)] = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  });

  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
}

function updateProductStorage(
  productId: number,
  action: "approve" | "reject"
) {
  const pending = readArray(PENDING_PRODUCTS_KEY);
  const approved = readArray(APPROVED_PRODUCTS_KEY);

  const product = pending.find(
    (item) => Number(item.id) === productId
  );

  if (!product) return;

  if (action === "approve") {
    const updatedProduct = {
      ...product,
      listingStatus: "Live",
      status: "Active",
      sold: false,
    };

    const nextPending = pending.filter(
      (item) => Number(item.id) !== productId
    );

    const alreadyApproved = approved.some(
      (item) => Number(item.id) === productId
    );

    const nextApproved = alreadyApproved
      ? approved.map((item) =>
          Number(item.id) === productId ? updatedProduct : item
        )
      : [updatedProduct, ...approved];

    localStorage.setItem(
      PENDING_PRODUCTS_KEY,
      JSON.stringify(nextPending)
    );
    localStorage.setItem(
      APPROVED_PRODUCTS_KEY,
      JSON.stringify(nextApproved)
    );
  }

  if (action === "reject") {
    const nextPending = pending.filter(
      (item) => Number(item.id) !== productId
    );

    localStorage.setItem(
      PENDING_PRODUCTS_KEY,
      JSON.stringify(nextPending)
    );
  }
}

function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(() => buildUsers());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "All Users" | "Buyers" | "Sellers" | "Pending Approval" | "Suspended"
  >("All Users");
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const refreshUsers = () => {
    setUsers(buildUsers());
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      let matchesFilter = true;

      if (filter === "Buyers") matchesFilter = user.role === "Buyer";
      if (filter === "Sellers") matchesFilter = user.role === "Seller";
      if (filter === "Pending Approval") {
        matchesFilter = user.status === "Pending";
      }
      if (filter === "Suspended") {
        matchesFilter = user.status === "Suspended";
      }

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const totalUsers = users.length;
  const totalBuyers = users.filter((user) => user.role === "Buyer").length;
  const totalSellers = users.filter((user) => user.role === "Seller").length;
  const pendingUsers = users.filter((user) => user.status === "Pending").length;

  const updateUsers = (nextUsers: User[]) => {
    setUsers(nextUsers);
    persistAdminOverrides(nextUsers);
  };

  const handleSuspend = (user: User) => {
    const nextStatus: UserStatus =
      user.status === "Suspended" ? "Active" : "Suspended";

    updateUsers(
      users.map((item) =>
        item.id === user.id ? { ...item, status: nextStatus } : item
      )
    );
  };

  const handleApprove = (user: User) => {
    updateUsers(
      users.map((item) =>
        item.id === user.id ? { ...item, status: "Active" } : item
      )
    );
  };

  const handleListingStatus = (
    userId: number,
    productId: number,
    status: SellerProduct["status"]
  ) => {
    if (status === "Live") updateProductStorage(productId, "approve");
    if (status === "Rejected") updateProductStorage(productId, "reject");

    const nextUsers = buildUsers().map((user) => {
      if (user.id !== userId) return user;

      return {
        ...user,
        listings: user.listings.map((product) =>
          product.id === productId ? { ...product, status } : product
        ),
      };
    });

    setUsers(nextUsers);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;

    const nextUsers = users.map((user) =>
      user.id === editingUser.id ? editingUser : user
    );

    updateUsers(nextUsers);
    setEditingUser(null);
  };

  return (
    <div className="admin-users-page">
      <Navbar />

      <main className="admin-users-content">
        <section className="admin-users-header">
          <div>
            <span className="admin-users-eyebrow">USER MANAGEMENT</span>
            <h1>Users</h1>
            <p>Manage the buyers and sellers registered on AutoMarket.</p>
          </div>

          <div className="admin-users-header-actions">
            <button
              type="button"
              className="admin-users-refresh-btn"
              onClick={refreshUsers}
            >
              Refresh
            </button>
          </div>
        </section>

        <section className="admin-user-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon"><FaUsers /></div>
            <div><span>Total Users</span><strong>{totalUsers}</strong></div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon"><FaUser /></div>
            <div><span>Buyers</span><strong>{totalBuyers}</strong></div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon"><FaStore /></div>
            <div><span>Sellers</span><strong>{totalSellers}</strong></div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon"><FaMoneyBillWave /></div>
            <div><span>Pending Approval</span><strong>{pendingUsers}</strong></div>
          </div>
        </section>

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
                className={filter === tab ? "admin-user-tab active" : "admin-user-tab"}
                onClick={() => setFilter(tab as typeof filter)}
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
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        <section className="admin-users-table-card">
          <div className="admin-table-heading">
            <div>
              <h2>All Users</h2>
              <p>{filteredUsers.length} users found</p>
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
                  const isExpanded = expandedUser === user.id;

                  return (
                    <Fragment key={user.id}>
                      <tr className={isExpanded ? "admin-user-row expanded" : "admin-user-row"}>
                        <td>
                          <div className="admin-user-profile">
                            <div className="admin-user-avatar">{user.initials}</div>
                            <div>
                              <strong>{user.name}</strong>
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className={`admin-role-badge ${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </td>

                        <td>{user.joined}</td>

                        <td>
                          <span className={`admin-status-badge ${user.status.toLowerCase()}`}>
                            <span />
                            {user.status}
                          </span>
                        </td>

                        <td>
                          <div className="admin-activity-value">
                            <strong>
                              {user.role === "Seller"
                                ? user.listings.length
                                : user.orders}
                            </strong>
                            <span>{user.role === "Seller" ? "Listings" : "Orders"}</span>
                          </div>
                        </td>

                        <td>
                          <div className="admin-money-value">
                            <strong>
                              {formatCurrency(
                                user.role === "Seller" ? user.revenue : user.spent
                              )}
                            </strong>
                            <span>{user.role === "Seller" ? "Revenue" : "Spent"}</span>
                          </div>
                        </td>

                        <td>
                          <div className="admin-user-actions">
                            <button
                              type="button"
                              title="View details"
                              onClick={() =>
                                setExpandedUser(isExpanded ? null : user.id)
                              }
                            >
                              {isExpanded ? <FaChevronUp /> : <FaEye />}
                            </button>

                            <button
                              type="button"
                              title="Edit user"
                              onClick={() => setEditingUser({ ...user })}
                            >
                              <FaEdit />
                            </button>

                            {user.status === "Pending" ? (
                              <button
                                type="button"
                                title="Approve user"
                                onClick={() => handleApprove(user)}
                              >
                                <FaCheck />
                              </button>
                            ) : (
                              <button
                                type="button"
                                title={user.status === "Suspended" ? "Activate user" : "Suspend user"}
                                onClick={() => handleSuspend(user)}
                              >
                                {user.status === "Suspended" ? <FaCheck /> : <FaBan />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="admin-user-details-row">
                          <td colSpan={7}>
                            {user.role === "Seller" ? (
                              <div className="admin-expanded-content">
                                <div className="admin-expanded-header">
                                  <div>
                                    <span>SELLER ACTIVITY</span>
                                    <h3>{user.name}'s Listings</h3>
                                  </div>

                                  <div className="seller-summary">
                                    <div>
                                      <strong>{user.listings.length}</strong>
                                      <span>Listings</span>
                                    </div>
                                    <div>
                                      <strong>
                                        {user.listings.reduce(
                                          (total, product) => total + product.buyerInterest,
                                          0
                                        )}
                                      </strong>
                                      <span>Interested Buyers</span>
                                    </div>
                                    <div>
                                      <strong>{formatCurrency(user.revenue)}</strong>
                                      <span>Revenue</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="seller-products">
                                  {user.listings.length > 0 ? (
                                    user.listings.map((product) => (
                                      <div className="seller-product" key={product.id}>
                                        <div className="seller-product-info">
                                          <div className="seller-product-icon"><FaStore /></div>
                                          <div>
                                            <strong>{product.name}</strong>
                                            <span>{formatCurrency(product.price)}</span>
                                          </div>
                                        </div>

                                        <div className="seller-interest">
                                          <strong>{product.buyerInterest}</strong>
                                          <span>interested buyers</span>
                                        </div>

                                        <span className={`listing-status ${product.status.toLowerCase()}`}>
                                          {product.status}
                                        </span>

                                        {product.status === "Pending" && (
                                          <div className="listing-actions">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleListingStatus(user.id, product.id, "Live")
                                              }
                                            >
                                              <FaCheck /> Approve
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleListingStatus(user.id, product.id, "Rejected")
                                              }
                                            >
                                              <FaTimes /> Reject
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="admin-no-data">
                                      This seller has no listings yet.
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="admin-expanded-content">
                                <div className="admin-expanded-header">
                                  <div>
                                    <span>BUYER ACTIVITY</span>
                                    <h3>{user.name}'s Account Activity</h3>
                                  </div>
                                </div>

                                <div className="buyer-activity-grid">
                                  <div className="buyer-activity-card">
                                    <FaShoppingCart />
                                    <div><strong>{user.cartItems}</strong><span>Cart Items</span></div>
                                  </div>
                                  <div className="buyer-activity-card">
                                    <FaHeart />
                                    <div><strong>{user.wishlistItems}</strong><span>Wishlist</span></div>
                                  </div>
                                  <div className="buyer-activity-card">
                                    <FaBoxOpen />
                                    <div><strong>{user.orders}</strong><span>Orders</span></div>
                                  </div>
                                  <div className="buyer-activity-card">
                                    <FaMoneyBillWave />
                                    <div><strong>{formatCurrency(user.spent)}</strong><span>Total Spent</span></div>
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

            {filteredUsers.length === 0 && (
              <div className="admin-users-empty">
                <FaUsers />
                <h3>No registered users found</h3>
                <p>
                  Register or log in to an account, then return here and press Refresh.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {editingUser && (
        <div className="admin-modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="admin-edit-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span>EDIT USER</span>
                <h2>Edit {editingUser.name}</h2>
              </div>
              <button type="button" onClick={() => setEditingUser(null)}>
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
                    setEditingUser({ ...editingUser, name: event.target.value })
                  }
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(event) =>
                    setEditingUser({ ...editingUser, email: event.target.value })
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
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                  <option value="Admin">Admin</option>
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
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-cancel"
                onClick={() => setEditingUser(null)}
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
