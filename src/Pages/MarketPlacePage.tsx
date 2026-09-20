import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaSlidersH,
} from "react-icons/fa";

import Navbar from "../Components/Navbar";
import "./MarketPlacePage.css";

interface Listing {
  id: number | string;
  title: string;
  description?: string;
  price: number;
  brand?: string;
  category?: string;
  condition?: string;
  location?: string;
  image?: string;
  createdAt?: string;
}

const API_URL = "http://localhost:5000/api/listings";

const categories = [
  "All Categories",
  "Brakes",
  "Engine",
  "Electrical",
  "Lighting",
  "Suspension",
  "Interior",
  "Body Parts",
  "Wheels & Tyres",
];

const conditions = [
  "All Conditions",
  "New",
  "Used",
  "Refurbished",
];

function MarketPlacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("All Conditions");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("newest");

  // Get listings from backend
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to load listings");
        }

        const data = await response.json();

        // Supports either:
        // { listings: [...] }
        // or directly [...]
        setListings(data.listings || data);
      } catch (err) {
        console.error(err);
        setError("Unable to load listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Get unique brands from listings
  const brands = useMemo(() => {
    const uniqueBrands = listings
      .map((listing) => listing.brand)
      .filter(Boolean) as string[];

    return ["All Brands", ...Array.from(new Set(uniqueBrands))];
  }, [listings]);

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((listing) =>
        `${listing.title} ${listing.description || ""} ${
          listing.brand || ""
        } ${listing.category || ""}`
          .toLowerCase()
          .includes(searchText)
      );
    }

    if (location.trim()) {
      result = result.filter((listing) =>
        listing.location
          ?.toLowerCase()
          .includes(location.toLowerCase())
      );
    }

    if (condition !== "All Conditions") {
      result = result.filter(
        (listing) => listing.condition === condition
      );
    }

    if (brand && brand !== "All Brands") {
      result = result.filter(
        (listing) => listing.brand === brand
      );
    }

    if (category !== "All Categories") {
      result = result.filter(
        (listing) => listing.category === category
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "newest") {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      });
    }

    return result;
  }, [
    listings,
    search,
    location,
    condition,
    brand,
    category,
    sort,
  ]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCondition("All Conditions");
    setBrand("");
    setCategory("All Categories");
    setSort("newest");
  };

  return (
    <div className="marketPlaceContainer">
      <Navbar />

      {/* HERO */}
      <section className="marketplaceHeader">
        <div className="marketplaceHeroContent">
          <span className="marketplaceEyebrow">
            AUTOPARTS MARKETPLACE
          </span>

          <h1>Browse Listed Car Parts</h1>

          <p>
            Find the exact part you need from sellers on our
            marketplace.
          </p>
        </div>

        {/* FILTERS */}
        <div className="marketplaceFilters">

          {/* Search */}
          <div className="filter-form-group searchGroup">
            <label>Search</label>

            <div className="searchInputWrapper">
              <FaSearch />

              <input
                type="text"
                placeholder="Search car parts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="filter-form-input"
              />
            </div>
          </div>

          {/* Location */}
          <div className="filter-form-group">
            <label>Location</label>

            <div className="inputIconWrapper">
              <FaMapMarkerAlt />

              <input
                type="text"
                placeholder="Cape Town"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="filter-form-input"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="filter-form-group">
            <label>Condition</label>

            <select
              value={condition}
              onChange={(e) =>
                setCondition(e.target.value)
              }
              className="filter-form-select"
            >
              {conditions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div className="filter-form-group">
            <label>Brand</label>

            <select
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              className="filter-form-select"
            >
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="filter-form-group">
            <label>Category</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="filter-form-select"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <main className="marketplaceResults">

        <div className="resultsTopBar">
          <div>
            <h2>
              {filteredListings.length} Parts Found
            </h2>

            <p>
              Browse available car parts listed by sellers.
            </p>
          </div>

          <div className="resultsActions">
            <FaSlidersH />

            <label htmlFor="sort">Sort:</label>

            <select
              id="sort"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
            >
              <option value="newest">Newest</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        {/* CLEAR FILTERS */}
        {(search ||
          location ||
          brand ||
          condition !== "All Conditions" ||
          category !== "All Categories") && (
          <button
            className="clearFiltersButton"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}

        {/* LOADING */}
        {loading && (
          <div className="marketplaceMessage">
            Loading listings...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="marketplaceMessage errorMessage">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredListings.length === 0 && (
            <div className="marketplaceMessage">
              <h3>No parts found</h3>

              <p>
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="clearButton"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* PRODUCT GRID */}
        {!loading &&
          !error &&
          filteredListings.length > 0 && (
            <div className="listingGrid">

              {filteredListings.map((listing) => (
                <article
                  className="listingCard"
                  key={listing.id}
                >

                  {/* IMAGE */}
                  <div className="listingImageWrapper">

                    {listing.image ? (
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="listingImage"
                      />
                    ) : (
                      <div className="noImage">
                        No Image
                      </div>
                    )}

                    {listing.condition && (
                      <span className="conditionBadge">
                        {listing.condition}
                      </span>
                    )}
                  </div>

                  {/* CARD CONTENT */}
                  <div className="listingContent">

                    {listing.category && (
                      <span className="listingCategory">
                        {listing.category}
                      </span>
                    )}

                    <h3>{listing.title}</h3>

                    {listing.brand && (
                      <p className="listingBrand">
                        {listing.brand}
                      </p>
                    )}

                    {listing.description && (
                      <p className="listingDescription">
                        {listing.description}
                      </p>
                    )}

                    {listing.location && (
                      <p className="listingLocation">
                        <FaMapMarkerAlt />
                        {listing.location}
                      </p>
                    )}

                    <div className="listingBottom">

                      <strong className="listingPrice">
                        R{" "}
                        {Number(listing.price).toLocaleString(
                          "en-ZA"
                        )}
                      </strong>

                      <Link
                        to={`/product/${listing.id}`}
                        className="viewPartButton"
                      >
                        View Part
                      </Link>

                    </div>
                  </div>
                </article>
              ))}

            </div>
          )}
      </main>
    </div>
  );
}

export default MarketPlacePage;