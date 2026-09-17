import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import "./AdminPage.css";
import {
  addNotification,
  ADMIN_NOTIFICATION_EMAIL,
  getCurrentUser,
  getNotificationsForRecipient,
  type MarketplaceNotification,
} from "../Components/notificationStore";

type AdminTab = "overview" | "users" | "products";
type UserRole = "Buyer" | "Seller";

type MarketplaceUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Review";
  joined: string;
  initials: string;
  color: string;
};

type PendingProduct = {
  id: number;
  title: string;
  seller: string;
  sellerEmail?: string;
  category: string;
  price: number;
  submitted: string;
  image: string;
};

const initialUsers: MarketplaceUser[] = [];

const initialProducts: PendingProduct[] = [];

const readFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const getStoredUsers = (): MarketplaceUser[] => {
  const stored = readFromStorage<MarketplaceUser[]>("marketplace_users", []);
  return stored.length > 0 ? stored : initialUsers;
};

const getStoredProducts = (): PendingProduct[] => {
  const stored = readFromStorage<PendingProduct[]>("marketplace_pending_products", []);
  return stored.length > 0 ? stored : initialProducts;
};

const formatRand = (value: number) => `R${value.toLocaleString("en-ZA", { minimumFractionDigits: 0 })}`;

const formatCurrentDate = (date: Date) =>
  date.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const getTimeGreeting = (hour: number) => {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function AdminPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const adminName =
    currentUser?.name?.trim().split(/\s+/)[0] ||
    currentUser?.email?.split("@")[0] ||
    "Administrator";
  const adminInitials = adminName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [users, setUsers] = useState<MarketplaceUser[]>(() => getStoredUsers());
  const [products, setProducts] = useState<PendingProduct[]>(() => getStoredProducts());
  const [userFilter, setUserFilter] = useState<"All" | UserRole>("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [adminNotifications, setAdminNotifications] = useState<MarketplaceNotification[]>(() =>
    getNotificationsForRecipient(ADMIN_NOTIFICATION_EMAIL)
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refreshDate = () => setCurrentDate(new Date());
    const dateRefresh = window.setInterval(refreshDate, 60_000);
    return () => window.clearInterval(dateRefresh);
  }, []);

  useEffect(() => {
    const closeProfileMenu = (event: PointerEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    const closeNotificationMenu = (event: PointerEvent) => {
      if (!notificationMenuRef.current?.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowProfileMenu(false);
    };

    document.addEventListener("pointerdown", closeProfileMenu);
    document.addEventListener("pointerdown", closeNotificationMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeProfileMenu);
      document.removeEventListener("pointerdown", closeNotificationMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    const refreshNotifications = () =>
      setAdminNotifications(getNotificationsForRecipient(ADMIN_NOTIFICATION_EMAIL));
    window.addEventListener("marketplace-notifications-updated", refreshNotifications);
    window.addEventListener("storage", refreshNotifications);
    return () => {
      window.removeEventListener("marketplace-notifications-updated", refreshNotifications);
      window.removeEventListener("storage", refreshNotifications);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => {
      const matchesFilter = userFilter === "All" || user.role === userFilter;
      return matchesFilter && `${user.name} ${user.email}`.toLowerCase().includes(query);
    });
  }, [search, userFilter, users]);

  const overviewActivity = useMemo(() => {
    const registrationEvents = users.map((user) => ({
      icon: UserRound,
      tone: user.role === "Seller" ? "gold" : "blue",
      title: user.role === "Seller" ? "New seller registration" : "New buyer registration",
      detail: `${user.name} joined as a ${user.role.toLowerCase()}.`,
      time: user.joined,
    }));

    const productEvents = products.map((product) => ({
      icon: PackageCheck,
      tone: "gold",
      title: "Product awaiting review",
      detail: `${product.title} needs approval from ${product.seller}.`,
      time: product.submitted,
    }));

    return [...registrationEvents, ...productEvents].slice(0, 6);
  }, [products, users]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const removeUser = (user: MarketplaceUser) => {
    const nextUsers = users.filter((item) => item.id !== user.id);
    setUsers(nextUsers);
    window.localStorage.setItem("marketplace_users", JSON.stringify(nextUsers));
    showNotice(`${user.name} was removed from the marketplace.`);
  };

  const approveProduct = (product: PendingProduct) => {
    const nextProducts = products.filter((item) => item.id !== product.id);
    setProducts(nextProducts);
    window.localStorage.setItem("marketplace_pending_products", JSON.stringify(nextProducts));
    const approvedProducts = readFromStorage<PendingProduct[]>("marketplace_approved_products", []);
    window.localStorage.setItem(
      "marketplace_approved_products",
      JSON.stringify([product, ...approvedProducts])
    );
    addNotification({
      type: "Listing",
      title: "Your car-part listing was approved",
      body: `${product.title} is now visible to buyers on AutoMarket.`,
      recipientEmail: product.sellerEmail,
    });
    showNotice(`${product.title} is now visible in the marketplace.`);
  };

  const rejectProduct = (product: PendingProduct) => {
    const nextProducts = products.filter((item) => item.id !== product.id);
    setProducts(nextProducts);
    window.localStorage.setItem("marketplace_pending_products", JSON.stringify(nextProducts));
    addNotification({
      type: "Listing",
      title: "Your car-part listing was declined",
      body: `${product.title} was not approved for the marketplace.`,
      recipientEmail: product.sellerEmail,
    });
    showNotice(`${product.title} was declined and returned to the seller.`);
  };

  const openReviewQueue = () => {
    setProducts(getStoredProducts());
    setActiveTab("products");
  };

  const handleLogout = () => {
    window.localStorage.removeItem("automarketUser");
    window.localStorage.removeItem("marketplace_current_user");
    window.localStorage.removeItem("automarketRememberMe");
    navigate("/login");
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div><strong>AutoMarket</strong><span>Admin console</span></div>
        </div>
        <div className="admin-workspace-label">Workspace</div>
        <nav className="admin-nav" aria-label="Admin navigation">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}><LayoutDashboard size={18} /> Overview</button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}><Users size={18} /> Buyers & sellers <span className="nav-count">{users.length}</span></button>
          <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}><PackageCheck size={18} /> Product approvals <span className="nav-count alert">{products.length}</span></button>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-status"><span /> Systems operational</div>
          <button className="back-to-store" onClick={() => navigate("/home")}><ArrowUpRight size={16} /> View storefront</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-mobile-brand"><strong>AutoMarket</strong></div>
          <div className="admin-breadcrumb">Admin console <span>/</span> {activeTab === "overview" ? "Overview" : activeTab === "users" ? "People" : "Product approvals"}</div>
          <div className="admin-top-actions"><div className="admin-notification-wrap" ref={notificationMenuRef}><button className="icon-button" aria-label="Notifications" onClick={() => setShowNotifications((current) => !current)}><Bell size={19} />{adminNotifications.some((notification) => !notification.read) && <span className="notification-dot" />}</button>{showNotifications && <div className="admin-notification-menu"><strong>Notifications</strong>{adminNotifications.length === 0 ? <span>No new listing submissions.</span> : adminNotifications.slice(0, 5).map((notification) => <div key={notification.id}><b>{notification.title}</b><span>{notification.body}</span><small>{notification.timestamp}</small></div>)}</div>}</div><div className="admin-profile-menu-wrap" ref={profileMenuRef}><button className="admin-profile-trigger" aria-expanded={showProfileMenu} aria-haspopup="menu" onClick={() => setShowProfileMenu((current) => !current)}><div className="admin-avatar">{adminInitials}</div><div className="admin-profile"><strong>{adminName}</strong><span>Administrator</span></div><ChevronDown size={16} className="profile-chevron" /></button>{showProfileMenu && <div className="admin-profile-menu" role="menu"><button role="menuitem" onClick={() => navigate("/profile")}><UserRound size={15} /> Profile</button><button role="menuitem" onClick={() => navigate("/settings")}><Settings size={15} /> Settings</button><button role="menuitem" className="logout-menu-item" onClick={handleLogout}><LogOut size={15} /> Log out</button></div>}</div></div>
        </header>

        <div className="admin-content">
          <section className="admin-heading-row">
            <div><p className="eyebrow">{formatCurrentDate(currentDate)}</p><h1>{activeTab === "overview" ? `${getTimeGreeting(currentDate.getHours())}, ${adminName}` : activeTab === "users" ? "People on AutoMarket" : "Product approvals"}</h1><p className="admin-subtitle">{activeTab === "overview" ? "Here is what is happening across your marketplace today." : activeTab === "users" ? "Review, manage and remove buyers or sellers from the platform." : "Review seller listings before they become visible to buyers."}</p></div>
            <button className="admin-primary-button" onClick={openReviewQueue} aria-label={`Review ${products.length} pending listings`}><PackageCheck size={17} /> Review queue <span>{products.length}</span></button>
          </section>

          {notice && <div className="admin-notice"><CheckCircle2 size={18} /> {notice}</div>}

          {activeTab === "overview" && (
            <>
              <section className="admin-stat-grid">
                <article className="admin-stat-card featured"><div className="stat-icon"><Users size={20} /></div><span>Total members</span><strong>{users.length}</strong><small>{users.length > 0 ? <b>{users.length} registered</b> : "No members yet"}</small></article>
                <article className="admin-stat-card"><div className="stat-icon teal"><ShoppingBag size={20} /></div><span>Live listings</span><strong>{products.length}</strong><small>{products.length > 0 ? <b>{products.length} pending approval</b> : "No listings yet"}</small></article>
                <article className="admin-stat-card"><div className="stat-icon gold"><CircleDollarSign size={20} /></div><span>Gross sales</span><strong>{formatRand(0)}</strong><small>{products.length > 0 ? <b>Waiting for sales</b> : "No sales yet"}</small></article>
                <article className="admin-stat-card"><div className="stat-icon orange"><Clock3 size={20} /></div><span>Needs attention</span><strong>{products.length}</strong><small className="neutral">{products.length > 0 ? "Across listings" : "No action required"}</small></article>
              </section>

              <section className="admin-overview-grid">
                <article className="admin-panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">Live feed</p><h2>Marketplace activity</h2></div><button className="text-button" onClick={() => setActiveTab("users")}>Manage people <ArrowUpRight size={15} /></button></div><div className="activity-list">{overviewActivity.length > 0 ? overviewActivity.map(({ icon: Icon, tone, title, detail, time }) => <div className="activity-item" key={`${title}-${time}`}><div className={`activity-icon ${tone}`}><Icon size={17} /></div><div className="activity-copy"><strong>{title}</strong><span>{detail}</span></div><time>{time}</time></div>) : <div className="empty-state">No marketplace activity yet.</div>}</div></article>
                <article className="admin-panel health-panel"><div className="panel-heading"><div><p className="eyebrow">At a glance</p><h2>Marketplace health</h2></div><Activity size={19} className="panel-heading-icon" /></div>{users.length === 0 && products.length === 0 ? <div className="empty-state">The platform is waiting for its first buyer, seller, or listing.</div> : <><div className="health-score"><div className="score-ring"><strong>{Math.min(99, Math.max(0, users.length * 12 + products.length * 18))}</strong><span>/ 100</span></div><div><strong>{users.length > 0 ? "Healthy" : "Starting up"}</strong><p>{users.length > 0 ? "Trust signals are building across the platform." : "Platform activity will appear here once the marketplace begins operating."}</p></div></div><div className="health-row"><span>Seller verification</span><b>{users.filter((user) => user.role === "Seller").length > 0 ? "98%" : "0%"}</b><i><em style={{ width: users.filter((user) => user.role === "Seller").length > 0 ? "98%" : "0%" }} /></i></div><div className="health-row"><span>Listing quality</span><b>{products.length > 0 ? "91%" : "0%"}</b><i><em style={{ width: products.length > 0 ? "91%" : "0%" }} /></i></div><div className="health-row"><span>Order fulfilment</span><b>{users.length > 0 ? "96%" : "0%"}</b><i><em style={{ width: users.length > 0 ? "96%" : "0%" }} /></i></div></>}</article>
              </section>

              <section className="admin-panel queue-panel"><div className="panel-heading"><div><p className="eyebrow">Moderation queue</p><h2>Listings waiting for approval</h2></div><button className="text-button" onClick={() => setActiveTab("products")}>View all <ArrowUpRight size={15} /></button></div>{products.length > 0 ? <div className="mini-product-list">{products.slice(0, 2).map((product) => <div className="mini-product" key={product.id}><div className="product-thumb"><ShoppingBag size={20} /></div><div><strong>{product.title}</strong><span>{product.seller} <i /> {product.category}</span></div><b>{formatRand(product.price)}</b><button className="approve-button" onClick={() => approveProduct(product)}><Check size={16} /> Approve</button></div>)}</div> : <div className="empty-state">No pending listings yet.</div>}</section>
            </>
          )}

          {activeTab === "users" && <section className="admin-panel table-panel"><div className="table-toolbar"><div className="filter-tabs">{(["All", "Buyer", "Seller"] as const).map((filter) => <button className={userFilter === filter ? "active" : ""} key={filter} onClick={() => setUserFilter(filter)}>{filter}{filter === "All" ? ` (${users.length})` : `s (${users.filter((user) => user.role === filter).length})`}</button>)}</div><label className="admin-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search members" /></label></div><div className="admin-table-wrap"><table><thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user.id}><td><div className="member-cell"><div className={`member-avatar ${user.color}`}>{user.initials}</div><div><strong>{user.name}</strong><span>{user.email}</span></div></div></td><td><span className={`role-pill ${user.role.toLowerCase()}`}>{user.role}</span></td><td><span className={`status-pill ${user.status.toLowerCase()}`}><i /> {user.status}</span></td><td>{user.joined}</td><td><button className="remove-button" onClick={() => removeUser(user)}><Trash2 size={15} /> Remove</button></td></tr>)}</tbody></table>{filteredUsers.length === 0 && <div className="empty-state">No members match your search.</div>}</div></section>}

          {activeTab === "products" && <section className="admin-panel approvals-panel"><div className="approval-summary"><div className="approval-summary-icon"><Clock3 size={22} /></div><div><strong>{products.length} listings need your review</strong><span>Approving a listing makes it visible to buyers immediately.</span></div></div><div className="approval-list">{products.map((product) => <article className="approval-card" key={product.id}><div className="approval-image"><ShoppingBag size={26} /></div><div className="approval-card-body"><div className="approval-card-title"><div><span className="category-label">{product.category}</span><h3>{product.title}</h3></div><strong>{formatRand(product.price)}</strong></div><p>Submitted by <b>{product.seller}</b> <i /> {product.submitted}</p><div className="approval-actions"><button className="approve-button" onClick={() => approveProduct(product)}><Check size={16} /> Approve listing</button><button className="decline-button" onClick={() => rejectProduct(product)}><X size={16} /> Decline</button></div></div></article>)}{products.length === 0 && <div className="empty-state success-empty"><CheckCircle2 size={22} /> The moderation queue is clear. Nice work.</div>}</div></section>}
        </div>
      </main>
    </div>
  );
}
