// What buyers can see: listings a seller uploaded and an admin approved (sold ones are hidden).
// Home, Categories, the shop and the details page all read from here, so every page shows
// the same real listings.
import { getApprovedListings, type StoredListing } from "./adminStore";

export const getLiveListings = (): StoredListing[] =>
  getApprovedListings().filter((listing) => !listing.sold);

export const findLiveListing = (id?: string): StoredListing | undefined =>
  id ? getLiveListings().find((listing) => String(listing.id) === id) : undefined;

// The shape ProductDetailsPage reads (passed as router state, or rebuilt from the id in the URL)
export const toDetailsProduct = (listing: StoredListing) => ({
  id: listing.id,
  name: listing.title,
  category: listing.category,
  price: listing.price,
  image: listing.image,
  brand: listing.brand,
  description: listing.description,
  seller: listing.seller,
  sellerEmail: listing.sellerEmail,
  available: listing.quantity,
});
