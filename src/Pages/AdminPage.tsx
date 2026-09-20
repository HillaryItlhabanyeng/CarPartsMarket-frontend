import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaCheck, FaClock, FaShoppingBag, FaTimes, FaUser, FaUsers } from "react-icons/fa";

import AdminShell from "../Components/AdminShell";
import AdminListingRow from "../Components/AdminListingRow";
import {
  approveListing,
  declineListing,
  formatSubmitted,
  getApprovedListings,
  getPendingListings,
  type StoredListing,
} from "../Components/adminStore";
import { getCurrentUser } from "../Components/notificationStore";
import { useOrders } from "../Components/useOrders";

type MemberRecord = {
  id?: number | string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  joined?: string;
};

const readMembers = (): MemberRecord[] => {
  try {
    const raw = window.localStorage.getItem("marketplace_users");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const memberName = (member: MemberRecord) =>
  member.name?.trim() || `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim() || "A new member";

// Admin Dashboard: an at-a-glance overview. Detail lives on the Users, Listings and Orders pages,
// which are reached from the shared sidebar like every other section of the app.
export default function AdminPage() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const currentUser = getCurrentUser();
  const adminName =
    currentUser?.name?.trim().split(/\s+/)[0] || currentUser?.email?.split("@")[0] || "Administrator";

  const [members] = useState<MemberRecord[]>(() => readMembers());
  const [pending, setPending] = useState<StoredListing[]>(() => getPendingListings());
  const [approved, setApproved] = useState<StoredListing[]>(() => getApprovedListings());
  const [notice, setNotice] = useState("");

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const refreshListings = () => {
    setPending(getPendingListings());
    setApproved(getApprovedListings());
  };

  const handleApprove = (listing: StoredListing) => {
    approveListing(listing);
    refreshListings();
    showNotice(`${listing.title} is now visible in the marketplace.`);
  };

  const handleDecline = (listing: StoredListing) => {
    declineListing(listing);
    refreshListings();
    showNotice(`${listing.title} was declined and returned to the seller.`);
  };

  const liveCount = approved.filter((listing) => !listing.sold).length;

  const stats = [
    { label: "Members", value: members.length, icon: <FaUsers />, to: "/admin/users" },
    { label: "Live Listings", value: liveCount, icon: <FaBoxOpen />, to: "/admin/listings?tab=live" },
    { label: "Pending Approval", value: pending.length, icon: <FaClock />, to: "/admin/listings" },
    { label: "Orders", value: orders.length, icon: <FaShoppingBag />, to: "/admin/orders" },
  ];

  const activity = [
    ...pending.map((listing) => ({
      key: `listing-${listing.id}`,
      icon: <FaBoxOpen />,
      bronze: true,
      title: "Listing awaiting review",
      detail: `${listing.title} from ${listing.seller}`,
      time: formatSubmitted(listing),
    })),
    ...members.map((member, index) => ({
      key: `member-${member.id ?? index}`,
      icon: <FaUser />,
      bronze: false,
      title: "New member",
      detail: `${memberName(member)} joined${member.role ? ` as a ${member.role.toLowerCase()}` : ""}`,
      time: member.joined ?? "",
    })),
  ].slice(0, 6);

  return (
    <AdminShell title="Admin Dashboard" subtitle={`Welcome back, ${adminName}`}>
      {notice && <div className="adm-notice">{notice}</div>}

      <div className="adm-stats">
        {stats.map((stat) => (
          <button type="button" className="adm-stat" key={stat.label} onClick={() => navigate(stat.to)}>
            <div className="adm-stat-icon">{stat.icon}</div>
            <div className="adm-stat-info">
              <span className="adm-stat-value">{stat.value}</span>
              <span className="adm-stat-label">{stat.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="adm-grid-2">
        <div className="dash-card">
          <div className="adm-card-head">
            <h3 className="dash-card-title">Listings Waiting for Approval</h3>
            <button type="button" className="adm-link-btn" onClick={() => navigate("/admin/listings")}>
              View all
            </button>
          </div>

          {pending.length === 0 ? (
            <div className="adm-empty">No listings are waiting for review.</div>
          ) : (
            pending.slice(0, 3).map((listing) => (
              <AdminListingRow
                key={listing.id}
                listing={listing}
                actions={
                  <>
                    <button type="button" className="adm-btn adm-btn-primary" onClick={() => handleApprove(listing)}>
                      <FaCheck /> Approve
                    </button>
                    <button type="button" className="adm-btn adm-btn-danger" onClick={() => handleDecline(listing)}>
                      <FaTimes /> Decline
                    </button>
                  </>
                }
              />
            ))
          )}
        </div>

        <div className="dash-card">
          <div className="adm-card-head">
            <h3 className="dash-card-title">Recent Activity</h3>
          </div>

          {activity.length === 0 ? (
            <div className="adm-empty">No marketplace activity yet.</div>
          ) : (
            activity.map((item) => (
              <div className="adm-activity" key={item.key}>
                <div className={`adm-activity-icon ${item.bronze ? "bronze" : ""}`}>{item.icon}</div>
                <div className="adm-activity-copy">
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
                <time>{item.time}</time>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dash-card">
        <h3 className="dash-card-title">Quick Actions</h3>
        <div className="adm-actions-row">
          <button type="button" className="adm-btn adm-btn-primary" onClick={() => navigate("/admin/listings")}>
            <FaClock /> Review Listings
          </button>
          <button type="button" className="adm-btn adm-btn-secondary" onClick={() => navigate("/admin/users")}>
            Manage Users
          </button>
          <button type="button" className="adm-btn adm-btn-secondary" onClick={() => navigate("/admin/orders")}>
            View Orders
          </button>
          <button type="button" className="adm-btn adm-btn-secondary" onClick={() => navigate("/home")}>
            View Storefront
          </button>
          <button type="button" className="adm-btn adm-btn-secondary" onClick={() => navigate("/settings")}>
            Settings
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
