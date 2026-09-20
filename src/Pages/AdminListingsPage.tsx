import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

import AdminShell from "../Components/AdminShell";
import AdminListingRow from "../Components/AdminListingRow";
import {
  approveListing,
  declineListing,
  getApprovedListings,
  getPendingListings,
  removeApprovedListing,
  type StoredListing,
} from "../Components/adminStore";
import { partCategories } from "../data/partCategories";

type ListingsTab = "pending" | "live";

// Review new seller submissions and manage the listings buyers can already see.
export default function AdminListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: ListingsTab = searchParams.get("tab") === "live" ? "live" : "pending";

  const [pending, setPending] = useState<StoredListing[]>(() => getPendingListings());
  const [approved, setApproved] = useState<StoredListing[]>(() => getApprovedListings());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [notice, setNotice] = useState("");

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const refresh = () => {
    setPending(getPendingListings());
    setApproved(getApprovedListings());
  };

  const handleApprove = (listing: StoredListing) => {
    approveListing(listing);
    refresh();
    showNotice(`${listing.title} is now visible in the marketplace.`);
  };

  const handleDecline = (listing: StoredListing) => {
    declineListing(listing);
    refresh();
    showNotice(`${listing.title} was declined and returned to the seller.`);
  };

  const handleRemove = (listing: StoredListing) => {
    if (!window.confirm(`Remove "${listing.title}" from the marketplace? The seller will be notified.`)) {
      return;
    }
    removeApprovedListing(listing);
    refresh();
    showNotice(`${listing.title} was removed from the marketplace.`);
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

        {visible.length === 0 ? (
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
                    <button type="button" className="adm-btn adm-btn-primary" onClick={() => handleApprove(listing)}>
                      <FaCheck /> Approve listing
                    </button>
                    <button type="button" className="adm-btn adm-btn-danger" onClick={() => handleDecline(listing)}>
                      <FaTimes /> Decline
                    </button>
                  </>
                ) : (
                  <button type="button" className="adm-btn adm-btn-danger" onClick={() => handleRemove(listing)}>
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
