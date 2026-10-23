import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

import AdminShell from "../Components/AdminShell";
import AdminListingRow from "../Components/AdminListingRow";
import api from "../api/axiosInstance";
import { partCategories } from "../data/partCategories";

type ListingsTab = "pending" | "live";

// --- Shape returned by the backend /carparts endpoints ---
type CarPart = {
  carPartId: string;
  partName: string;
  description: string;
  price: number;
  stockQuantity: number;
  model: string;
  categoryId: number;
  sellerId: string;
  status: string;
};

// --- Shape AdminListingRow expects (loosely mirrors StoredListing) ---
type StoredListing = {
  id: string | number;
  title: string;
  description: string;
  location: string;
  category: string;
  brand: string;
  condition: string;
  price: number;
  quantity: number;
  seller: string;
  sellerEmail: string;
  submitted: string;
  createdAt: string;
  image: string;
  sold?: boolean;
};

const categoryNameFromId = (id: number): string => {
  // 1-based mapping — matches the order of partCategories on the seller form
  if (id > 0 && id <= partCategories.length) {
    return partCategories[id - 1];
  }
  return "Uncategorized";
};

const toStoredListing = (p: CarPart): StoredListing => ({
  id: String(p.carPartId ?? ""),
  title: p.partName,
  description: p.description ?? "",
  location: "",
  category: categoryNameFromId(p.categoryId),
  brand: p.model ?? "",
  condition: "",
  price: p.price ?? 0,
  quantity: p.stockQuantity ?? 0,
  seller: p.sellerId ?? "Seller",
  sellerEmail: "",
  submitted: "Pending",
  createdAt: new Date().toISOString(),
  image: "",
  sold: false,
});

export default function AdminListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: ListingsTab = searchParams.get("tab") === "live" ? "live" : "pending";

  const [pending, setPending] = useState<StoredListing[]>([]);
  const [approved, setApproved] = useState<StoredListing[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const loadListings = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        api.get<CarPart[]>("/carparts/pending"),
        api.get<CarPart[]>("/carparts/approved"),
      ]);
      setPending(pendingRes.data.map(toStoredListing));
      setApproved(approvedRes.data.map(toStoredListing));
    } catch (err) {
      console.error("Failed to load listings:", err);
      showNotice("Could not load listings from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleApprove = async (listing: StoredListing) => {
    try {
      await api.put(`/carparts/${listing.id}/approve`);
      await loadListings();
      showNotice(`${listing.title} is now visible in the marketplace.`);
    } catch (err) {
      console.error("Approve failed:", err);
      showNotice("Could not approve this listing.");
    }
  };

  const handleDecline = async (listing: StoredListing) => {
    try {
      await api.put(`/carparts/${listing.id}/decline`);
      await loadListings();
      showNotice(`${listing.title} was declined.`);
    } catch (err) {
      console.error("Decline failed:", err);
      showNotice("Could not decline this listing.");
    }
  };

  const handleRemove = async (listing: StoredListing) => {
    if (!window.confirm(`Remove "${listing.title}" from the marketplace?`)) return;
    try {
      await api.delete(`/carparts/delete/${listing.id}`);
      await loadListings();
      showNotice(`${listing.title} was removed.`);
    } catch (err) {
      console.error("Delete failed:", err);
      showNotice("Could not remove this listing.");
    }
  };

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const source = tab === "pending" ? pending : approved;

    return source.filter((listing) => {
      const matchesCategory = category === "All Categories" || listing.category === category;
      const matchesSearch =
        !query ||
        `${listing.title} ${listing.seller} ${listing.brand ?? ""} ${listing.location ?? ""}`
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [tab, pending, approved, search, category]);

  return (
    <AdminShell title="Listings" subtitle="Review seller listings and manage what buyers can see">
      {notice && <div className="adm-notice">{notice}</div>}

      <div className="dash-card">
        <div className="adm-toolbar">
          <div className="adm-tabs">
            <button
              type="button"
              className={`adm-tab ${tab === "pending" ? "active" : ""}`}
              onClick={() => setSearchParams({})}
            >
              Pending Approval ({pending.length})
            </button>
            <button
              type="button"
              className={`adm-tab ${tab === "live" ? "active" : ""}`}
              onClick={() => setSearchParams({ tab: "live" })}
            >
              Live Listings ({approved.length})
            </button>
          </div>

          <div className="adm-filters">
            <input
              className="adm-input"
              type="text"
              placeholder="Search title, seller, brand or location"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="adm-select"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {["All Categories", ...partCategories].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="adm-empty">Loading listings...</div>
        ) : visible.length === 0 ? (
          <div className="adm-empty">
            {tab === "pending"
              ? "No listings are waiting for review."
              : "No live listings match your search."}
          </div>
        ) : (
          visible.map((listing) => (
            <AdminListingRow
              key={listing.id}
              listing={listing}
              status={tab === "live" ? (listing.sold ? "Sold" : "Live") : undefined}
              actions={
                tab === "pending" ? (
                  <>
                    <button
                      type="button"
                      className="adm-btn adm-btn-primary"
                      onClick={() => handleApprove(listing)}
                    >
                      <FaCheck /> Approve listing
                    </button>
                    <button
                      type="button"
                      className="adm-btn adm-btn-danger"
                      onClick={() => handleDecline(listing)}
                    >
                      <FaTimes /> Decline
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="adm-btn adm-btn-danger"
                    onClick={() => handleRemove(listing)}
                  >
                    <FaTrash /> Remove listing
                  </button>
                )
              }
            />
          ))
        )}
      </div>
    </AdminShell>
  );
}