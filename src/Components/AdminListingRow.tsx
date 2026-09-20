import type { ReactNode } from "react";
import { FaBoxOpen } from "react-icons/fa";

import { formatRand, formatSubmitted, type StoredListing } from "./adminStore";
import "./AdminShell.css";

type AdminListingRowProps = {
  listing: StoredListing;
  // Buttons for this row (Approve / Decline / Remove ...)
  actions?: ReactNode;
  // Shows a Live / Sold pill next to the category; used for approved listings
  status?: "Live" | "Sold";
};

// One seller listing as the admin reviews it: the uploaded photo plus everything the seller entered.
export default function AdminListingRow({ listing, actions, status }: AdminListingRowProps) {
  return (
    <article className="adm-listing">
      <div className="adm-listing-img">
        {listing.image ? <img src={listing.image} alt={listing.title} /> : <FaBoxOpen />}
      </div>

      <div className="adm-listing-body">
        <div className="adm-listing-top">
          <div>
            <span className="adm-listing-cat">{listing.category}</span>{" "}
            {status && (
              <span className={`adm-pill adm-pill-${status.toLowerCase()}`}>{status}</span>
            )}
            <h3 className="adm-listing-title">{listing.title}</h3>
          </div>
          <strong className="adm-listing-price">{formatRand(listing.price)}</strong>
        </div>

        <div className="adm-listing-meta">
          {listing.brand && <span>Brand: {listing.brand}</span>}
          {listing.condition && <span>Condition: {listing.condition}</span>}
          {listing.location && <span>Location: {listing.location}</span>}
          {listing.quantity !== undefined && <span>Qty: {listing.quantity}</span>}
          <span>
            Seller: {listing.seller}
            {listing.sellerEmail ? ` (${listing.sellerEmail})` : ""}
          </span>
          <span>Submitted: {formatSubmitted(listing)}</span>
        </div>

        {listing.description && <p className="adm-listing-desc">{listing.description}</p>}

        {actions && <div className="adm-listing-actions">{actions}</div>}
      </div>
    </article>
  );
}
