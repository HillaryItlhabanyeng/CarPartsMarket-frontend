import { useMemo, useState } from "react";
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
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import "./AdminPage.css";

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
  category: string;
  price: number;
  submitted: string;
  image: string;
};

const initialUsers: MarketplaceUser[] = [
  { id: 1, name: "Thabo Mokoena", email: "thabo.m@example.com", role: "Buyer", status: "Active", joined: "Today, 08:42", initials: "TM", color: "blue" },
  { id: 2, name: "Gearbox Garage", email: "hello@gearbox.co.za", role: "Seller", status: "Active", joined: "Yesterday", initials: "GG", color: "gold" },
  { id: 3, name: "Naledi Dube", email: "naledi.d@example.com", role: "Buyer", status: "Active", joined: "12 Sep 2026", initials: "ND", color: "teal" },
  { id: 4, name: "Mandla Auto Parts", email: "sales@mandlaauto.co.za", role: "Seller", status: "Review", joined: "11 Sep 2026", initials: "MA", color: "orange" },
  { id: 5, name: "Kabelo Radebe", email: "kabelo.r@example.com", role: "Buyer", status: "Active", joined: "10 Sep 2026", initials: "KR", color: "purple" },
];

const initialProducts: PendingProduct[] = [
  { id: 1, title: "Toyota Corolla Front Bumper", seller: "Mandla Auto Parts", category: "Body parts", price: 1850, submitted: "12 min ago", image: "/bumper.jpg" },
  { id: 2, title: "Bosch Ceramic Brake Pads", seller: "Gearbox Garage", category: "Brakes", price: 650, submitted: "34 min ago", image: "/brakepad.jpg" },
  { id: 3, title: "VW Polo 1.4 Alternator", seller: "Kasi Motors", category: "Electrical", price: 1200, submitted: "1 hr ago", image: "/alternator.jpg" },
];

const activityItems = [
  { icon: UserRound, tone: "blue", title: "New seller registration", detail: "Mandla Auto Parts submitted a seller profile", time: "12 min ago" },
  { icon: PackageCheck, tone: "gold", title: "Product awaiting review", detail: "Toyota Corolla Front Bumper needs approval", time: "12 min ago" },
  { icon: CircleDollarSign, tone: "teal", title: "Order completed", detail: "Order #AM-1048 was marked as delivered", time: "38 min ago" },
  { icon: ShieldCheck, tone: "purple", title: "Seller verification completed", detail: "Gearbox Garage passed identity checks", time: "1 hr ago" },
];

const formatRand = (value: number) => `R${value.toLocaleString("en-ZA", { minimumFractionDigits: 0 })}`;

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [users, setUsers] = useState(initialUsers);
  const [products, setProducts] = useState(initialProducts);
  const [userFilter, setUserFilter] = useState<"All" | UserRole>("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => {
      const matchesFilter = userFilter === "All" || user.role === userFilter;
      return matchesFilter && `${user.name} ${user.email}`.toLowerCase().includes(query);
    });
  }, [search, userFilter, users]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const removeUser = (user: MarketplaceUser) => {
    setUsers((current) => current.filter((item) => item.id !== user.id));
    showNotice(`${user.name} was removed from the marketplace.`);
  };

  const approveProduct = (product: PendingProduct) => {
    setProducts((current) => current.filter((item) => item.id !== product.id));
    showNotice(`${product.title} is now visible in the marketplace.`);
  };

  const rejectProduct = (product: PendingProduct) => {
    setProducts((current) => current.filter((item) => item.id !== product.id));
    showNotice(`${product.title} was declined and returned to the seller.`);
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">A</div>
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
          <div className="admin-mobile-brand"><div className="admin-brand-mark">A</div><strong>AutoMarket</strong></div>
          <div className="admin-breadcrumb">Admin console <span>/</span> {activeTab === "overview" ? "Overview" : activeTab === "users" ? "People" : "Product approvals"}</div>
          <div className="admin-top-actions"><button className="icon-button" aria-label="Notifications"><Bell size={19} /><span className="notification-dot" /></button><div className="admin-avatar">AM</div><div className="admin-profile"><strong>Amara M.</strong><span>Administrator</span></div><ChevronDown size={16} className="profile-chevron" /></div>
        </header>

        <div className="admin-content">
          <section className="admin-heading-row">
            <div><p className="eyebrow">Monday, 14 September 2026</p><h1>{activeTab === "overview" ? "Good morning, Amara" : activeTab === "users" ? "People on AutoMarket" : "Product approvals"}</h1><p className="admin-subtitle">{activeTab === "overview" ? "Here is what is happening across your marketplace today." : activeTab === "users" ? "Review, manage and remove buyers or sellers from the platform." : "Review seller listings before they become visible to buyers."}</p></div>
            <button className="admin-primary-button" onClick={() => setActiveTab("products")}><PackageCheck size={17} /> Review queue <span>{products.length}</span></button>
          </section>

          {notice && <div className="admin-notice"><CheckCircle2 size={18} /> {notice}</div>}

          {activeTab === "overview" && (
            <>
              <section className="admin-stat-grid">
                <article className="admin-stat-card featured"><div className="stat-icon"><Users size={20} /></div><span>Total members</span><strong>2,486</strong><small><b>+8.2%</b> vs last month</small></article>
                <article className="admin-stat-card"><div className="stat-icon teal"><ShoppingBag size={20} /></div><span>Live listings</span><strong>1,284</strong><small><b>+12.5%</b> this week</small></article>
                <article className="admin-stat-card"><div className="stat-icon gold"><CircleDollarSign size={20} /></div><span>Gross sales</span><strong>{formatRand(184240)}</strong><small><b>+6.4%</b> this month</small></article>
                <article className="admin-stat-card"><div className="stat-icon orange"><Clock3 size={20} /></div><span>Needs attention</span><strong>{products.length + 4}</strong><small className="neutral">Across users and listings</small></article>
              </section>

              <section className="admin-overview-grid">
                <article className="admin-panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">Live feed</p><h2>Marketplace activity</h2></div><button className="text-button" onClick={() => setActiveTab("users")}>Manage people <ArrowUpRight size={15} /></button></div><div className="activity-list">{activityItems.map(({ icon: Icon, tone, title, detail, time }) => <div className="activity-item" key={title}><div className={`activity-icon ${tone}`}><Icon size={17} /></div><div className="activity-copy"><strong>{title}</strong><span>{detail}</span></div><time>{time}</time></div>)}</div></article>
                <article className="admin-panel health-panel"><div className="panel-heading"><div><p className="eyebrow">At a glance</p><h2>Marketplace health</h2></div><Activity size={19} className="panel-heading-icon" /></div><div className="health-score"><div className="score-ring"><strong>94</strong><span>/ 100</span></div><div><strong>Excellent</strong><p>Trust signals are strong across the platform.</p></div></div><div className="health-row"><span>Seller verification</span><b>98%</b><i><em style={{ width: "98%" }} /></i></div><div className="health-row"><span>Listing quality</span><b>91%</b><i><em style={{ width: "91%" }} /></i></div><div className="health-row"><span>Order fulfilment</span><b>96%</b><i><em style={{ width: "96%" }} /></i></div></article>
              </section>

              <section className="admin-panel queue-panel"><div className="panel-heading"><div><p className="eyebrow">Moderation queue</p><h2>Listings waiting for approval</h2></div><button className="text-button" onClick={() => setActiveTab("products")}>View all <ArrowUpRight size={15} /></button></div><div className="mini-product-list">{products.slice(0, 2).map((product) => <div className="mini-product" key={product.id}><div className="product-thumb"><ShoppingBag size={20} /></div><div><strong>{product.title}</strong><span>{product.seller} <i /> {product.category}</span></div><b>{formatRand(product.price)}</b><button className="approve-button" onClick={() => approveProduct(product)}><Check size={16} /> Approve</button></div>)}</div></section>
            </>
          )}

          {activeTab === "users" && <section className="admin-panel table-panel"><div className="table-toolbar"><div className="filter-tabs">{(["All", "Buyer", "Seller"] as const).map((filter) => <button className={userFilter === filter ? "active" : ""} key={filter} onClick={() => setUserFilter(filter)}>{filter}{filter === "All" ? ` (${users.length})` : `s (${users.filter((user) => user.role === filter).length})`}</button>)}</div><label className="admin-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search members" /></label></div><div className="admin-table-wrap"><table><thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user.id}><td><div className="member-cell"><div className={`member-avatar ${user.color}`}>{user.initials}</div><div><strong>{user.name}</strong><span>{user.email}</span></div></div></td><td><span className={`role-pill ${user.role.toLowerCase()}`}>{user.role}</span></td><td><span className={`status-pill ${user.status.toLowerCase()}`}><i /> {user.status}</span></td><td>{user.joined}</td><td><button className="remove-button" onClick={() => removeUser(user)}><Trash2 size={15} /> Remove</button></td></tr>)}</tbody></table>{filteredUsers.length === 0 && <div className="empty-state">No members match your search.</div>}</div></section>}

          {activeTab === "products" && <section className="admin-panel approvals-panel"><div className="approval-summary"><div className="approval-summary-icon"><Clock3 size={22} /></div><div><strong>{products.length} listings need your review</strong><span>Approving a listing makes it visible to buyers immediately.</span></div></div><div className="approval-list">{products.map((product) => <article className="approval-card" key={product.id}><div className="approval-image"><ShoppingBag size={26} /></div><div className="approval-card-body"><div className="approval-card-title"><div><span className="category-label">{product.category}</span><h3>{product.title}</h3></div><strong>{formatRand(product.price)}</strong></div><p>Submitted by <b>{product.seller}</b> <i /> {product.submitted}</p><div className="approval-actions"><button className="approve-button" onClick={() => approveProduct(product)}><Check size={16} /> Approve listing</button><button className="decline-button" onClick={() => rejectProduct(product)}><X size={16} /> Decline</button></div></div></article>)}{products.length === 0 && <div className="empty-state success-empty"><CheckCircle2 size={22} /> The moderation queue is clear. Nice work.</div>}</div></section>}
        </div>
      </main>
    </div>
  );
}
