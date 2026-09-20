// Shared listing-moderation helpers for the admin pages.
// Sellers submit to "pending"; approving moves a listing to "approved", which is what the buyer
// marketplace shows. Every action also notifies the seller.
import { addNotification } from "./notificationStore";

export type StoredListing = {
  id: number;
  title: string;
  description?: string;
  seller: string;
  sellerEmail?: string;
  category: string;
  brand?: string;
  condition?: string;
  location?: string;
  quantity?: number;
  price: number;
  submitted: string;
  createdAt?: string;
  image: string;
  images?: string[];
  sold?: boolean;
};

const PENDING_KEY = "marketplace_pending_products";
const APPROVED_KEY = "marketplace_approved_products";

function read(key: string): StoredListing[] {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(key: string, listings: StoredListing[]) {
  window.localStorage.setItem(key, JSON.stringify(listings));
}

function notifySeller(listing: StoredListing, title: string, body: string) {
  if (!listing.sellerEmail) return;
  addNotification({ type: "Listing", title, body, recipientEmail: listing.sellerEmail });
}

export const getPendingListings = () => read(PENDING_KEY);
export const getApprovedListings = () => read(APPROVED_KEY);

export function approveListing(listing: StoredListing) {
  write(PENDING_KEY, getPendingListings().filter((item) => item.id !== listing.id));
  write(APPROVED_KEY, [listing, ...getApprovedListings().filter((item) => item.id !== listing.id)]);
  notifySeller(
    listing,
    "Your car-part listing was approved",
    `${listing.title} is now visible to buyers on AutoMarket.`
  );
}

export function declineListing(listing: StoredListing) {
  write(PENDING_KEY, getPendingListings().filter((item) => item.id !== listing.id));
  notifySeller(
    listing,
    "Your car-part listing was declined",
    `${listing.title} was not approved for the marketplace.`
  );
}

export function removeApprovedListing(listing: StoredListing) {
  write(APPROVED_KEY, getApprovedListings().filter((item) => item.id !== listing.id));
  notifySeller(
    listing,
    "Your car-part listing was removed",
    `${listing.title} was removed from the marketplace by an administrator.`
  );
}

export const formatRand = (value: number) =>
  `R${value.toLocaleString("en-ZA", { maximumFractionDigits: 2 })}`;

// Listings store a static "Just now" label, so prefer the real timestamp when there is one
export function formatSubmitted(listing: StoredListing) {
  if (!listing.createdAt) return listing.submitted;
  const date = new Date(listing.createdAt);
  return Number.isNaN(date.getTime())
    ? listing.submitted
    : date.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}
