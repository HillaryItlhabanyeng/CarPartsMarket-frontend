import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNavigation from "../Components/SideNavigation";
import UserInitialsBadge from "../Components/UserInitialsBadge";
import NotificationBell from "../Components/NotificationBell";
import { FaCog } from "react-icons/fa";
import api from "../api/axiosInstance";
import { partCategories } from "../data/partCategories";

import "../Components/DashboardShell.css";
import "./MyListingsPage.css";

type ListingStatus = "Active" | "Pending" | "Declined" | "Sold";
type ListingSource = "pending" | "approved" | "backend";

// Old listings saved in the browser
type StoredProduct = {
  id: number;
  title: string;
  location: string;
  image: string;
  price: number;
  submitted: string;
  sellerEmail?: string;
  sold?: boolean;
};

// What the backend returns
type BackendCarPart = {
  carPartId: string;
  partName?: string | null;
  description?: string | null;
  price?: number | null;
  stockQuantity?: number | null;
  model?: string | null;
  categoryId?: number | null;
  sellerId?: string | null;
  status?: string | null;
  partCondition?: string | null;
  image?: string | null;
};

type MyListing = {
  id: string | number;
  source: ListingSource;
  title: string;
  price: number;
  location: string;
  image: string;
  status: ListingStatus;
  detail: string;
  raw?: BackendCarPart; // kept so we can send it back when updating
};

type CurrentUser = {
  id?: string;
  email?: string;
};

const statusFilters: ("All" | ListingStatus)[] = ["All", "Active", "Pending", "Declined", "Sold"];

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function backendStatus(status?: string | null): ListingStatus {
  switch ((status ?? "").toUpperCase()) {
    case "APPROVED":
      return "Active";
    case "DECLINED":
      return "Declined";
    case "SOLD":
      return "Sold";
    default:
      return "Pending";
  }
}

function fromBackend(part: BackendCarPart): MyListing {
  const category = part.categoryId ? partCategories[part.categoryId - 1] ?? "" : "";
  const detail = [category, part.partCondition, part.model].filter(Boolean).join(" · ");

  return {
    id: part.carPartId,
    source: "backend",
    title: part.partName || "Untitled part",
    price: Number(part.price ?? 0),
    location: "",
    image: part.image || "",
    status: backendStatus(part.status),
    detail,
    raw: part,
  };
}

function loadLocalListings(email?: string): MyListing[] {
  const pending = readFromStorage<StoredProduct[]>("marketplace_pending_products", []);
  const approved = readFromStorage<StoredProduct[]>("marketplace_approved_products", []);

  const belongsToUser = (product: StoredProduct) =>
    !!email && product.sellerEmail?.toLowerCase() === email;

  const pendingListings: MyListing[] = pending.filter(belongsToUser).map((product) => ({
    id: product.id,
    source: "pending",
    title: product.title,
    price: product.price,
    location: product.location,
    image: product.image,
    status: "Pending",
    detail: product.submitted,
  }));

  const approvedListings: MyListing[] = approved.filter(belongsToUser).map((product) => ({
    id: product.id,
    source: "approved",
    title: product.title,
    price: product.price,
    location: product.location,
    image: product.image,
    status: product.sold ? "Sold" : "Active",
    detail: product.submitted,
  }));

  return [...pendingListings, ...approvedListings];
}

export default function MyListingsPage() {
  const navigate = useNavigate();

  const currentUser = readFromStorage<CurrentUser | null>("marketplace_current_user", null);
  const sellerId = currentUser?.id;
  const email = currentUser?.email?.toLowerCase();

  const [listings, setListings] = useState<MyListing[]>(() => loadLocalListings(email));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | ListingStatus>("All");

  // Load this seller's listings from the backend
  useEffect(() => {
    if (!sellerId) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    api
      .get<BackendCarPart[]>(`/carparts/seller/${sellerId}`)
      .then((res) => {
        if (cancelled) return;
        const backendListings = (Array.isArray(res.data) ? res.data : []).map(fromBackend);
        // Newest first: backend listings, then any old browser-saved ones
        setListings([...backendListings.reverse(), ...loadLocalListings(email)]);
      })
      .catch((err) => {
        console.error("Could not load your listings:", err);
        if (!cancelled) setError("Couldn't load your listings from the server.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sellerId, email]);

  const visibleListings =
    activeFilter === "All" ? listings : listings.filter((l) => l.status === activeFilter);

  const handleDelete = async (item: MyListing) => {
    if (!window.confirm(`Delete "${item.title}"? This can't be undone.`)) return;

    if (item.source === "backend") {
      try {
        await api.delete(`/carparts/delete/${item.id}`);
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Could not delete this listing. Please try again.");
        return;
      }
    } else {
      const key =
        item.source === "pending" ? "marketplace_pending_products" : "marketplace_approved_products";
      const stored = readFromStorage<StoredProduct[]>(key, []);
      window.localStorage.setItem(key, JSON.stringify(stored.filter((p) => p.id !== item.id)));
    }

    setListings((prev) => prev.filter((l) => !(l.id === item.id && l.source === item.source)));
  };

  const handleMarkSold = async (item: MyListing) => {
    if (item.source === "backend" && item.raw) {
      try {
        // Sold parts drop off the marketplace, since it only shows APPROVED ones
        await api.put("/carparts/update", { ...item.raw, status: "SOLD" });
      } catch (err) {
        console.error("Mark sold failed:", err);
        alert("Could not mark this listing as sold. Please try again.");
        return;
      }
    } else {
      const stored = readFromStorage<StoredProduct[]>("marketplace_approved_products", []);
      const next = stored.map((p) => (p.id === item.id ? { ...p, sold: true } : p));
      window.localStorage.setItem("marketplace_approved_products", JSON.stringify(next));
    }

    setListings((prev) =>
      prev.map((l) =>
        l.id === item.id && l.source === item.source ? { ...l, status: "Sold" } : l
      )
    );
  };

  return (
    <div className="dash-app-container">
      <SideNavigation />

      <main className="dash-main-content">
        <header className="dash-top-header">
          <div className="dash-header-left">
            <h1>My Listings</h1>
            <p>Manage the items you're selling at AutoMarket</p>
          </div>
          <div className="dash-header-right">
            <button className="ml-sell-btn" onClick={() => navigate("/list-product")}>
              Sell an Item
            </button>
            <NotificationBell />
            <FaCog className="dash-settings" onClick={() => navigate("/settings")} />
            <UserInitialsBadge />
          </div>
        </header>

        <div className="dash-scrollable-area">
          <div className="ml-filter-bar">
            {statusFilters.map((status) => (
              <button
                key={status}
                className={activeFilter === status ? "ml-filter-chip ml-active" : "ml-filter-chip"}
                onClick={() => setActiveFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {error && <p className="ml-error">{error}</p>}

          {loading ? (
            <div className="ml-empty">
              <p>Loading your listings…</p>
            </div>
          ) : visibleListings.length === 0 ? (
            <div className="ml-empty">
              <p>
                You don't have any {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} listings yet.
              </p>
              <button className="ml-sell-btn" onClick={() => navigate("/list-product")}>
                Sell an Item
              </button>
            </div>
          ) : (
            <div className="ml-grid">
              {visibleListings.map((item) => (
                <div className="ml-card" key={`${item.source}-${item.id}`}>
                  <div className="ml-card-image">
                    {item.image ? (
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <div className="ml-no-image">No Image</div>
                    )}
                    <span className={`ml-status ml-status-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="ml-card-info">
                    <span className="ml-card-title">{item.title}</span>
                    <span className="ml-card-price">R{item.price.toFixed(2)}</span>
                    {item.location && <span className="ml-card-location">📍 {item.location}</span>}
                    {item.detail && <span className="ml-card-views">{item.detail}</span>}

                    <div className="ml-card-actions">
                      {item.status === "Active" && (
                        <button className="ml-sold-btn" onClick={() => handleMarkSold(item)}>
                          Mark Sold
                        </button>
                      )}
                      <button className="ml-delete-btn" onClick={() => handleDelete(item)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}