import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaCheck,
  FaChevronDown,
  FaMapMarkerAlt,
  FaSearch,
  FaSlidersH,
  FaHeart,     
  FaRegHeart,  
} from "react-icons/fa";

import Navbar from "../Components/Navbar";
import { partCategories } from "../data/partCategories";
import { carBrands } from "../data/carBrands";
import { useSaved } from "../Components/useSaved"; 

import "./MarketPlacePage.css";
import Footer from "../Components/Footer";

interface Listing {
  id: number | string;
  title: string;
  description?: string;
  price: number;
  brand?: string;
  category?: string;
  categoryId?: number | string;
  condition?: string;
  location?: string;
  image?: string;
  createdAt?: string;
  quantity?: number;
  seller?: string;
  sellerEmail?: string;
}

interface BackendCarPart {
  carPartId?: string | null;
  partName?: string | null;
  description?: string | null;
  price?: number | string | null;
  stockQuantity?: number | null;
  model?: string | null;
  categoryId?: number | string | null;
  sellerId?: string | null;
  partCondition?: string | null;
  image?: string | null;
}

interface LegacyListingInput {
  id?: number | string;
  title?: string;
  partName?: string;
  description?: string;
  price?: number | string | null;
  brand?: string;
  category?: string;
  categoryId?: number | string;
  condition?: string;
  location?: string;
  image?: string;
  createdAt?: string;
  quantity?: number | string | null;
  stockQuantity?: number | string | null;
  seller?: string;
  sellerName?: string;
  sellerEmail?: string;
  sold?: boolean;
}

const API_URL = "http://localhost:8081/carparts/approved";

const ALL_CATEGORIES = "All Categories";
const ALL_BRANDS = "All Brands";
const ALL_CONDITIONS = "All Conditions";

const categories = [ALL_CATEGORIES, ...partCategories];
const conditions = [
  ALL_CONDITIONS,
  "Like New",
  "New",
  "Used",
  "Fair",
];

function safeNumber(value: unknown, fallback = 0): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function categoryNameFromId(categoryId: unknown): string {
  const id = Number(categoryId);

  if (!Number.isInteger(id) || id < 1) return "";

  return partCategories[id - 1] ?? "";
}



function loadApprovedListings(): Listing[] {
  try {
    const raw = window.localStorage.getItem(
      "marketplace_approved_products"
    );

    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return (parsed as LegacyListingInput[])
      .filter(
        (item) =>
          item &&
          typeof item === "object" &&
          item.sold !== true
      )
      .map((item, index) => ({
        id: item.id ?? `local-${index}`,
        title: safeString(item.title) || safeString(item.partName) || "Untitled part",
        description: safeString(item.description),
        price: safeNumber(item.price),
        brand: safeString(item.brand),
        category: safeString(item.category),
        categoryId: item.categoryId,
        condition: safeString(item.condition),
        location: safeString(item.location),
        image: safeString(item.image),
        createdAt: safeString(item.createdAt),
        quantity: safeNumber(
          item.quantity ?? item.stockQuantity
        ),
        seller:
          safeString(item.seller) ||
          safeString(item.sellerName),
        sellerEmail: safeString(item.sellerEmail),
      }));
  } catch (error) {
    console.error("Unable to read local marketplace listings:", error);
    return [];
  }
}

/* ---------- Convert backend records ---------- */

function normalizeBackendListing(
  item: BackendCarPart,
  index: number
): Listing {
  return {
    id: safeString(item.carPartId) || `backend-${index}`,
    title: safeString(item.partName) || "Untitled part",
    description: safeString(item.description),
    price: safeNumber(item.price),
    brand: safeString(item.model),
    categoryId: item.categoryId ?? undefined,
    category: categoryNameFromId(item.categoryId),
    quantity: safeNumber(item.stockQuantity),
    seller: safeString(item.sellerId),

    
    condition: safeString(item.partCondition),
    location: "",

    image: safeString(item.image),
  };
}

/* ---------- Custom accessible select ---------- */

interface CustomSelectProps {
  id: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function CustomSelect({
  id,
  value,
  options,
  onChange,
}: CustomSelectProps) {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    const item = menu?.children[activeIndex] as
      | HTMLElement
      | undefined;

    if (!menu || !item) return;

    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;

    if (top < menu.scrollTop) {
      menu.scrollTop = top - 6;
    } else if (
      bottom >
      menu.scrollTop + menu.clientHeight
    ) {
      menu.scrollTop =
        bottom - menu.clientHeight + 6;
    }
  }, [open, activeIndex]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>
  ) => {
    if (!open) {
      if (
        ["ArrowDown", "ArrowUp", "Enter", " "].includes(
          event.key
        )
      ) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) =>
          Math.min(index + 1, options.length - 1)
        );
        break;

      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) =>
          Math.max(index - 1, 0)
        );
        break;

      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;

      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;

      case "Enter":
      case " ":
        event.preventDefault();

        if (options[activeIndex] !== undefined) {
          choose(options[activeIndex]);
        }
        break;

      case "Escape":
        event.preventDefault();
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
        aria-activedescendant={
          open ? `${id}-option-${activeIndex}` : undefined
        }
        onClick={() =>
          open ? setOpen(false) : openMenu()
        }
        onKeyDown={handleKeyDown}
        onKeyUp={(event) => {
          if (event.key === " ") event.preventDefault();
        }}
      >
        <span className="customSelectValue">{value}</span>

        <FaChevronDown
          className={
            open
              ? "customSelectArrow open"
              : "customSelectArrow"
          }
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
                onMouseDown={(event) =>
                  event.preventDefault()
                }
                onClick={() => choose(item)}
              >
                <span>{item}</span>

                {isSelected && (
                  <FaCheck className="customSelectCheck" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ---------- Marketplace page ---------- */

function MarketPlacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] =
    useState(ALL_CONDITIONS);
  const [brand, setBrand] = useState(ALL_BRANDS);
  const [sort, setSort] = useState("newest");

  const { toggleSaved, isSaved } = useSaved(); // NEW

  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState(() => {
    const requested = searchParams.get("category");

    return requested && categories.includes(requested)
      ? requested
      : ALL_CATEGORIES;
  });

  /* ---------- Fetch backend listings ---------- */

  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}.`
          );
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "The backend response is not a list of car parts."
          );
        }

        const backendListings = (
          data as BackendCarPart[]
        ).map(normalizeBackendListing);

        const localListings = loadApprovedListings();

        if (!cancelled) {
          setListings([
            ...localListings,
            ...backendListings,
          ]);
        }
      } catch (fetchError) {
        console.error(
          "Failed to fetch car parts:",
          fetchError
        );

        if (!cancelled) {
          setListings(loadApprovedListings());
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load car parts."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchListings();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- Brands ---------- */

  const brands = useMemo(() => {
    const known = new Set(
      carBrands.map((item) => item.toLowerCase())
    );

    const extraBrands = new Set<string>();

    listings.forEach((listing) => {
      const name = listing.brand?.trim();

      if (name && !known.has(name.toLowerCase())) {
        extraBrands.add(name);
      }
    });

    return [
      ALL_BRANDS,
      ...carBrands,
      ...Array.from(extraBrands).sort(),
    ];
  }, [listings]);

  /* ---------- Filter and sort ---------- */

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (search.trim()) {
      const searchText = search.trim().toLowerCase();

      result = result.filter((listing) =>
        [
          listing.title,
          listing.description ?? "",
          listing.brand ?? "",
          listing.category ?? "",
          listing.location ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchText)
      );
    }

    if (location.trim()) {
      const locationText = location.trim().toLowerCase();

      result = result.filter((listing) =>
        (listing.location ?? "")
          .toLowerCase()
          .includes(locationText)
      );
    }

    if (condition !== ALL_CONDITIONS) {
      result = result.filter(
        (listing) => listing.condition === condition
      );
    }

    if (brand !== ALL_BRANDS) {
      result = result.filter(
        (listing) =>
          listing.brand?.trim().toLowerCase() ===
          brand.toLowerCase()
      );
    }

    if (category !== ALL_CATEGORIES) {
      result = result.filter(
        (listing) => listing.category === category
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      result.reverse();
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

  const showResults = !loading;

  /* ---------- Page ---------- */

  return (
    <div className="marketPlaceContainer">
      <div className="marketplaceNavbarWrapper">
        <Navbar />
      </div>

      <div className="marketplacePageContent">
        <section className="marketplaceHeader">
          <div className="marketplaceHeroContent">
            <span className="marketplaceEyebrow">
              AUTOPARTS MARKETPLACE
            </span>

            <h1>Browse Listed Car Parts</h1>

            <p>
              Find the exact part you need from sellers on
              our marketplace.
            </p>
          </div>

          <div className="marketplaceFilters">
            <div className="filter-form-group searchGroup">
              <label htmlFor="marketplace-search">
                Search
              </label>

              <div className="searchInputWrapper">
                <FaSearch />

                <input
                  id="marketplace-search"
                  type="text"
                  placeholder="Search car parts..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="filter-form-input"
                />
              </div>
            </div>

            <div className="filter-form-group">
              <label htmlFor="marketplace-location">
                Location
              </label>

              <div className="inputIconWrapper">
                <FaMapMarkerAlt />

                <input
                  id="marketplace-location"
                  type="text"
                  placeholder="Cape Town"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  className="filter-form-input"
                />
              </div>
            </div>

            <div className="filter-form-group">
              <label htmlFor="marketplace-condition">
                Condition
              </label>

              <CustomSelect
                id="marketplace-condition"
                value={condition}
                options={conditions}
                onChange={setCondition}
              />
            </div>

            <div className="filter-form-group">
              <label htmlFor="marketplace-brand">
                Brand / Model
              </label>

              <CustomSelect
                id="marketplace-brand"
                value={brand}
                options={brands}
                onChange={setBrand}
              />
            </div>

            <div className="filter-form-group">
              <label htmlFor="marketplace-category">
                Category
              </label>

              <CustomSelect
                id="marketplace-category"
                value={category}
                options={categories}
                onChange={setCategory}
              />
            </div>
          </div>
        </section>

        <main className="marketplaceResults">
          <div className="resultsTopBar">
            <div>
              <h2>{filteredListings.length} Parts Found</h2>
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
                onChange={(event) =>
                  setSort(event.target.value)
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
            <div className="marketplaceMessage">
              Loading car parts...
            </div>
          )}

          {!loading && error && (
            <div className="marketplaceMessage errorMessage">
              <h3>Unable to load car parts from the backend</h3>
              <p>{error}</p>
              <p>
                Check that Spring Boot is running and that
                the API URL matches your backend configuration.
                Locally saved approved listings may still appear.
              </p>
            </div>
          )}

          {showResults && filteredListings.length === 0 && (
            <div className="marketplaceMessage">
              <h3>No parts found</h3>
              <p>
                {error
                  ? "No locally saved approved products are available to display."
                  : "No car parts are currently available. Try changing your search or filters."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="clearButton"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {showResults && filteredListings.length > 0 && (
            <div className="listingGrid">
              {filteredListings.map((listing) => {
                const saved = isSaved(String(listing.id)); // NEW

                return (
                  <article
                    className="listingCard"
                    key={listing.id}
                  >
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

                      {/* NEW: save to wishlist */}
                      <button
                        type="button"
                        className={`wishlistButton${saved ? " saved" : ""}`}
                        onClick={() =>
                          toggleSaved({
                            id: String(listing.id),
                            name: listing.title,
                            price: listing.price,
                            location: listing.location,
                            imageUrl: listing.image || "",
                          })
                        }
                        aria-label={
                          saved
                            ? `Remove ${listing.title} from wishlist`
                            : `Save ${listing.title} to wishlist`
                        }
                        title={saved ? "Remove from wishlist" : "Save to wishlist"}
                      >
                        {saved ? <FaHeart /> : <FaRegHeart />}
                      </button>
                    </div>

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
                          {listing.price.toLocaleString("en-ZA", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </strong>

                        <Link
                          to={`/product/${listing.id}`}
                          state={{
                            product: {
                              id: listing.id,
                              name: listing.title,
                              category: listing.category || "",
                              categoryId: listing.categoryId,
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
                );
              })}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MarketPlacePage;