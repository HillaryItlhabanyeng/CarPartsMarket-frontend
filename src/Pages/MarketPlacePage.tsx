import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaCheck,
  FaChevronDown,
  FaMapMarkerAlt,
  FaSearch,
  FaSlidersH,
} from "react-icons/fa";

import Navbar from "../Components/Navbar";
import { partCategories } from "../data/partCategories";
import { carBrands } from "../data/carBrands";

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
  quantity?: number;
  seller?: string;
  sellerEmail?: string;
}

const API_URL = "http://localhost:5000/api/listings";

const ALL_CATEGORIES = "All Categories";
const ALL_BRANDS = "All Brands";
const ALL_CONDITIONS = "All Conditions";

const categories = [ALL_CATEGORIES, ...partCategories];
const conditions = [ALL_CONDITIONS, "New", "Used", "Refurbished"];

/* =========================================================
   LOAD APPROVED SELLER LISTINGS
========================================================= */

function loadApprovedListings(): Listing[] {
  try {
    const raw = window.localStorage.getItem("marketplace_approved_products");
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => !item.sold)
      .map((item) => ({
        ...item,
        createdAt:
          item.createdAt ||
          (typeof item.id === "number"
            ? new Date(item.id).toISOString()
            : undefined),
      }));
  } catch {
    return [];
  }
}

/* =========================================================
   CUSTOM SELECT
   Real website-style dropdown: always opens DOWNWARD, scrolls
   inside itself, closes on outside click, full keyboard support.
========================================================= */

interface CustomSelectProps {
  id: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function CustomSelect({ id, value, options, onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const selectedIndex = Math.max(options.indexOf(value), 0);
  const listboxId = `${id}-listbox`;

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const choose = (item: string) => {
    onChange(item);
    setOpen(false);
  };

  /* Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Keep the highlighted option visible inside the menu */
  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    const item = menu?.children[activeIndex] as HTMLElement | undefined;

    if (!menu || !item) return;

    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;

    if (top < menu.scrollTop) {
      menu.scrollTop = top - 6;
    } else if (bottom > menu.scrollTop + menu.clientHeight) {
      menu.scrollTop = bottom - menu.clientHeight + 6;
    }
  }, [open, activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(options[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div className="customSelect" ref={wrapperRef}>
      <button
        id={id}
        type="button"
        className="filter-form-select customSelectButton"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        onKeyUp={(e) => {
          // Stops the browser from also "clicking" the button on Space
          if (e.key === " ") e.preventDefault();
        }}
      >
        <span className="customSelectValue">{value}</span>
        <FaChevronDown
          className={open ? "customSelectArrow open" : "customSelectArrow"}
        />
      </button>

      {open && (
        <ul
          className="customSelectMenu"
          id={listboxId}
          role="listbox"
          ref={menuRef}
        >
          {options.map((item, index) => {
            const isSelected = item === value;

            return (
              <li
                key={item}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                className={
                  "customSelectOption" +
                  (isSelected ? " selected" : "") +
                  (index === activeIndex ? " active" : "")
                }
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(item)}
              >
                <span>{item}</span>
                {isSelected && <FaCheck className="customSelectCheck" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* =========================================================
   MARKETPLACE PAGE
========================================================= */

function MarketPlacePage() {
  /* ---------- Listings ---------- */

  const [listings, setListings] = useState<Listing[]>(() =>
    loadApprovedListings()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- Filters ---------- */

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState(ALL_CONDITIONS);
  const [brand, setBrand] = useState(ALL_BRANDS);

  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState(() => {
    const requested = searchParams.get("category");

    return requested && categories.includes(requested)
      ? requested
      : ALL_CATEGORIES;
  });

  const [sort, setSort] = useState("newest");

  /* ---------- Load listings ---------- */

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

        const backendListings: Listing[] = Array.isArray(data)
          ? data
          : Array.isArray(data.listings)
          ? data.listings
          : [];

        // Seller-approved local listings stay first.
        setListings([...loadApprovedListings(), ...backendListings]);
      } catch (err) {
        console.error(err);

        // Backend unavailable: still show approved frontend listings.
        const localListings = loadApprovedListings();

        if (localListings.length > 0) {
          setListings(localListings);
          setError("");
        } else {
          setListings([]);
          setError("Unable to load listings.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  /* ---------- Brands ---------- */

  const brands = useMemo(() => {
    const known = new Set(carBrands.map((item) => item.toLowerCase()));
    const extraBrands = new Set<string>();

    listings.forEach((listing) => {
      const name = listing.brand?.trim();

      if (name && !known.has(name.toLowerCase())) {
        extraBrands.add(name);
      }
    });

    return [ALL_BRANDS, ...carBrands, ...Array.from(extraBrands).sort()];
  }, [listings]);

  /* ---------- Filter + sort ---------- */

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (search.trim()) {
      const searchText = search.trim().toLowerCase();

      result = result.filter((listing) =>
        `${listing.title} ${listing.description || ""} ${
          listing.brand || ""
        } ${listing.category || ""} ${listing.location || ""}`
          .toLowerCase()
          .includes(searchText)
      );
    }

    if (location.trim()) {
      const locationText = location.trim().toLowerCase();

      result = result.filter((listing) =>
        listing.location?.toLowerCase().includes(locationText)
      );
    }

    if (condition !== ALL_CONDITIONS) {
      result = result.filter((listing) => listing.condition === condition);
    }

    if (brand !== ALL_BRANDS) {
      result = result.filter(
        (listing) =>
          listing.brand?.trim().toLowerCase() === brand.toLowerCase()
      );
    }

    if (category !== ALL_CATEGORIES) {
      result = result.filter((listing) => listing.category === category);
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
  }, [listings, search, location, condition, brand, category, sort]);

  /* ---------- Clear filters ---------- */

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCondition(ALL_CONDITIONS);
    setBrand(ALL_BRANDS);
    setCategory(ALL_CATEGORIES);
    setSort("newest");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    location.trim() !== "" ||
    brand !== ALL_BRANDS ||
    condition !== ALL_CONDITIONS ||
    category !== ALL_CATEGORIES;

  const showResults = !loading && (!error || listings.length > 0);

  /* ---------- Page ---------- */

  return (
    <div className="marketPlaceContainer">
      <div className="marketplaceNavbarWrapper">
        <Navbar />
      </div>

      <div className="marketplacePageContent">
        {/* HERO */}
        <section className="marketplaceHeader">
          <div className="marketplaceHeroContent">
            <span className="marketplaceEyebrow">AUTOPARTS MARKETPLACE</span>

            <h1>Browse Listed Car Parts</h1>

            <p>Find the exact part you need from sellers on our marketplace.</p>
          </div>

          {/* FILTERS */}
          <div className="marketplaceFilters">
            {/* Search */}
            <div className="filter-form-group searchGroup">
              <label htmlFor="marketplace-search">Search</label>

              <div className="searchInputWrapper">
                <FaSearch />

                <input
                  id="marketplace-search"
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
              <label htmlFor="marketplace-location">Location</label>

              <div className="inputIconWrapper">
                <FaMapMarkerAlt />

                <input
                  id="marketplace-location"
                  type="text"
                  placeholder="Cape Town"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="filter-form-input"
                />
              </div>
            </div>

            {/* Condition (custom, opens down) */}
            <div className="filter-form-group">
              <label htmlFor="marketplace-condition">Condition</label>

              <CustomSelect
                id="marketplace-condition"
                value={condition}
                options={conditions}
                onChange={setCondition}
              />
            </div>

            {/* Brand (custom, opens down) */}
            <div className="filter-form-group">
              <label htmlFor="marketplace-brand">Brand</label>

              <CustomSelect
                id="marketplace-brand"
                value={brand}
                options={brands}
                onChange={setBrand}
              />
            </div>

            {/* Category (custom, opens down) */}
            <div className="filter-form-group">
              <label htmlFor="marketplace-category">Category</label>

              <CustomSelect
                id="marketplace-category"
                value={category}
                options={categories}
                onChange={setCategory}
              />
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <main className="marketplaceResults">
          <div className="resultsTopBar">
            <div>
              <h2>{filteredListings.length} Parts Found</h2>
              <p>Browse available car parts listed by sellers.</p>
            </div>

            <div className="resultsActions">
              <FaSlidersH />

              <label htmlFor="sort">Sort:</label>

              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="clearFiltersButton"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}

          {loading && (
            <div className="marketplaceMessage">Loading listings...</div>
          )}

          {!loading && error && listings.length === 0 && (
            <div className="marketplaceMessage errorMessage">
              <h3>Unable to load listings</h3>
              <p>{error}</p>

              <button
                type="button"
                onClick={clearFilters}
                className="clearButton"
              >
                Clear Filters
              </button>
            </div>
          )}

          {showResults && filteredListings.length === 0 && (
            <div className="marketplaceMessage">
              <h3>No parts found</h3>
              <p>Try changing your search or filters.</p>

              <button
                type="button"
                onClick={clearFilters}
                className="clearButton"
              >
                Clear Filters
              </button>
            </div>
          )}

          {showResults && filteredListings.length > 0 && (
            <div className="listingGrid">
              {filteredListings.map((listing) => (
                <article className="listingCard" key={listing.id}>
                  <div className="listingImageWrapper">
                    {listing.image ? (
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="listingImage"
                      />
                    ) : (
                      <div className="noImage">No Image</div>
                    )}

                    {listing.condition && (
                      <span className="conditionBadge">
                        {listing.condition}
                      </span>
                    )}
                  </div>

                  <div className="listingContent">
                    {listing.category && (
                      <span className="listingCategory">
                        {listing.category}
                      </span>
                    )}

                    <h3>{listing.title}</h3>

                    {listing.brand && (
                      <p className="listingBrand">{listing.brand}</p>
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
                        R {Number(listing.price).toLocaleString("en-ZA")}
                      </strong>

                      <Link
                        to={`/product/${listing.id}`}
                        state={{
                          product: {
                            id: listing.id,
                            name: listing.title,
                            category: listing.category || "",
                            price: listing.price,
                            image: listing.image || "",
                            brand: listing.brand,
                            description: listing.description,
                            seller: listing.seller,
                            sellerEmail: listing.sellerEmail,
                            available: listing.quantity,
                          },
                        }}
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
    </div>
  );
}

export default MarketPlacePage;