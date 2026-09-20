import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./MyListingsPage.css";

type ListingStatus = "Active" | "Pending" | "Sold";
type ListingSource = "pending" | "approved";

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

type MyListing = {
  id: number;
  source: ListingSource;
  title: string;
  price: number;
  location: string;
  image: string;
  status: ListingStatus;
  submitted: string;
};

type CurrentUser = {
  email?: string;
};

const statusFilters: ("All" | ListingStatus)[] = ["All", "Active", "Pending", "Sold"];

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function loadMyListings(): MyListing[] {
  const currentUser = readFromStorage<CurrentUser | null>("marketplace_current_user", null);
  const email = currentUser?.email?.toLowerCase();

  const pending = readFromStorage<StoredProduct[]>("marketplace_pending_products", []);
  const approved = readFromStorage<StoredProduct[]>("marketplace_approved_products", []);

  const belongsToUser = (product: StoredProduct) =>
    !email || product.sellerEmail?.toLowerCase() === email;

  const pendingListings: MyListing[] = pending
    .filter(belongsToUser)
    .map((product) => ({
      id: product.id,
      source: "pending",
      title: product.title,
      price: product.price,
      location: product.location,
      image: product.image,
      status: "Pending",
      submitted: product.submitted,
    }));

  const approvedListings: MyListing[] = approved
    .filter(belongsToUser)
    .map((product) => ({
      id: product.id,
      source: "approved",
      title: product.title,
      price: product.price,
      location: product.location,
      image: product.image,
      status: product.sold ? "Sold" : "Active",
      submitted: product.submitted,
    }));

  return [...pendingListings, ...approvedListings];
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<MyListing[]>(() => loadMyListings());
  const [activeFilter, setActiveFilter] = useState<"All" | ListingStatus>("All");

  const visibleListings =
    activeFilter === "All"
      ? listings
      : listings.filter((l) => l.status === activeFilter);

  const handleDelete = (item: MyListing) => {
    const key =
      item.source === "pending" ? "marketplace_pending_products" : "marketplace_approved_products";
    const stored = readFromStorage<StoredProduct[]>(key, []);
    const next = stored.filter((product) => product.id !== item.id);
    window.localStorage.setItem(key, JSON.stringify(next));
    setListings((prev) => prev.filter((listing) => listing.id !== item.id));
  };

  const handleMarkSold = (item: MyListing) => {
    const stored = readFromStorage<StoredProduct[]>("marketplace_approved_products", []);
    const next = stored.map((product) =>
      product.id === item.id ? { ...product, sold: true } : product
    );
    window.localStorage.setItem("marketplace_approved_products", JSON.stringify(next));
    setListings((prev) =>
      prev.map((listing) => (listing.id === item.id ? { ...listing, status: "Sold" } : listing))
    );
  };

  const navigate = useNavigate();

  return (
    <div className="ml-page">
      <Navbar />

      <div className="ml-page-header">
        <div>
          <h1>My Listings</h1>
          <p>Manage the items you're selling on UniTrade</p>
        </div>
        <button className="ml-sell-btn" onClick={() => navigate("/list-product")}>Sell an Item</button>
      </div>

      <div className="ml-filter-bar">
        {statusFilters.map((status) => (
          <button
            key={status}
            className={
              activeFilter === status ? "ml-filter-chip ml-active" : "ml-filter-chip"
            }
            onClick={() => setActiveFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {visibleListings.length === 0 ? (
        <div className="ml-empty">
          <p>You don't have any {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} listings yet.</p>
          <button className="ml-sell-btn" onClick={() => navigate("/list-product")}>Sell an Item</button>
        </div>
      ) : (
        <div className="ml-grid">
          {visibleListings.map((item) => (
            <div className="ml-card" key={`${item.source}-${item.id}`}>
              <div className="ml-card-image">
                <img src={item.image} alt={item.title} />
                <span className={`ml-status ml-status-${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>

              <div className="ml-card-info">
                <span className="ml-card-title">{item.title}</span>
                <span className="ml-card-price">R{item.price.toFixed(2)}</span>
                <span className="ml-card-location">📍 {item.location}</span>
                <span className="ml-card-views">{item.submitted}</span>

                <div className="ml-card-actions">
                  {item.status === "Active" && (
                    <button
                      className="ml-sold-btn"
                      onClick={() => handleMarkSold(item)}
                    >
                      Mark Sold
                    </button>
                  )}
                  <button
                    className="ml-delete-btn"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
