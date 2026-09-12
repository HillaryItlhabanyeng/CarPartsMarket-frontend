import { useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { FaChevronLeft, FaChevronRight, FaFilter, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import Navbar from "../Components/Navbar";
// import { FaSearch } from "react-icons/fa";
// import { useCart } from "../Components/useCart";
// import { useSaved } from "../Components/useSaved";
// import { categories, conditions, locations, products, type ProductCondition } from "../data/products";
import "./MarketPlacePage.css";
// import TextField from "@mui/material/TextField";
// import type { ChangeEvent } from "react";



export default function MarketPlacePage() {

  // const [inputText, setInputText] = useState("");

  // const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
  //   setInputText(e.target.value.toLowerCase());
  // };

  return(
    <div className="marketPlaceContainer">
      <Navbar />

      <section className="marketplaceHeader">
        <h1>Browse Listed Car Parts</h1>
        <p>Get the exact car part you want, on your prefered condition, at your door step.</p>
        <div className="filtercontainer">
          <div className="filter-form-group">
                  <label>Location</label>
                  <select className="filter-form-select">
                    <option>All provinces</option>
                    <option>Eastern Cape</option>
                    <option>Free State</option>
                    <option>Gauteng</option>
                    <option>Kwazulu Natal</option>
                    <option>Limpopo</option>
                    <option>Mpumalanga</option>
                    <option>North West</option>
                    <option>Northen Cape</option>
                    <option>Western Cape</option>
                    </select>
          </div>

          <div className="filter-form-group">
                  <label>Condition</label>
                  <select className="filter-form-select">
                    <option>Any Condition</option>
                    <option>Brand new</option>
                    <option>Like New</option>
                    <option>Used - Exellent</option>
                    <option>used - Good</option>
                    <option>Used - Fair</option>
                    </select>
          </div>

          <div className="filter-form-group">
                  <label>Car Brand</label>
                  <select className="filter-form-select">
                    <option>All Brands</option>
                    <option>Audi</option>
                    <option>BMW</option>
                    <option>Toyota</option>
                    <option>Suzuki</option>
                    <option>Renult</option>
                    <option>Ford</option>
                    <option>Chevrolet</option>
                    <option>Kia</option>
                    </select>
          </div>

          <div className="filter-form-group">
                  <label>Category</label>
                  <select className="filter-form-select">
                    <option>All</option>
                    <option>Engines</option>
                    <option>Transmissions</option>
                    <option>Braking System</option>
                    <option>Suspensions</option>
                    <option>Electrical </option>
                    <option>Exhausts</option>
                    <option>Cooling</option>
                    <option>Fuel</option>
                    <option>Interior</option>
                    </select>
          </div>
        </div>
        {/* <TextField className="marketplaceSearch"
          value={inputText}
        onChange={inputHandler}
        label="Search"
        /> */}
      </section>
    </div>
  );
   
}



















// import { useMemo, useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { FaChevronLeft, FaChevronRight, FaFilter, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
// import Navbar from "../Components/Navbar";
// import { useCart } from "../Components/useCart";
// import { useSaved } from "../Components/useSaved";
// import { categories, conditions, locations, products, type ProductCondition } from "../data/products";
// import "./MarketPlacePage.css";

// const PAGE_SIZE = 8;

// export default function MarketPlacePage() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [search, setSearch] = useState(searchParams.get("search") ?? "");
//   const [activeCategory, setActiveCategory] = useState(searchParams.get("category") ?? "All Categories");
//   const [selectedConditions, setSelectedConditions] = useState<ProductCondition[]>([]);
//   const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
//   const [sort, setSort] = useState("newest");
//   const [page, setPage] = useState(1);
//   const { isSaved, toggleSaved } = useSaved();
//   const { addItem, itemCount } = useCart();

//   const filteredProducts = useMemo(() => products.filter((product) => {
//     const term = search.trim().toLowerCase();
//     const matchesSearch = !term || `${product.title} ${product.description} ${product.category} ${product.location}`.toLowerCase().includes(term);
//     const matchesCategory = activeCategory === "All Categories" || product.category === activeCategory;
//     const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition);
//     const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(product.location);
//     return matchesSearch && matchesCategory && matchesCondition && matchesLocation;
//   }).sort((first, second) => sort === "price-low" ? first.price - second.price : sort === "price-high" ? second.price - first.price : second.createdAt.localeCompare(first.createdAt)), [activeCategory, search, selectedConditions, selectedLocations, sort]);

//   const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
//   const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const updateSearch = (value: string) => {
//     setSearch(value);
//     setPage(1);
//     const nextParams = new URLSearchParams(searchParams);
//     value ? nextParams.set("search", value) : nextParams.delete("search");
//     setSearchParams(nextParams, { replace: true });
//   };

//   const selectCategory = (category: string) => {
//     setActiveCategory(category);
//     setPage(1);
//     const nextParams = new URLSearchParams(searchParams);
//     category === "All Categories" ? nextParams.delete("category") : nextParams.set("category", category);
//     setSearchParams(nextParams, { replace: true });
//   };

//   const toggleCondition = (condition: ProductCondition) => {
//     setSelectedConditions((current) => current.includes(condition) ? current.filter((item) => item !== condition) : [...current, condition]);
//     setPage(1);
//   };

//   const toggleLocation = (location: string) => {
//     setSelectedLocations((current) => current.includes(location) ? current.filter((item) => item !== location) : [...current, location]);
//     setPage(1);
//   };

//   const addToCart = (product: typeof products[number]) => addItem({ id: product.id, name: product.title, price: product.price, seller: product.seller, category: product.category, location: product.location, imageUrl: product.image });

//   return <div className="mp-page">
//     <Navbar />
//     <div className="mp-page-header"><div><h1>Market Place</h1><p>Discover great items from your community</p></div><Link className="mp-sell-btn" to="/list-product">Sell an Item</Link></div>
//     <div className="mp-filter-bar">
//       <div className="mp-filter-search"><span aria-hidden="true">🔍</span><input value={search} onChange={(event) => updateSearch(event.target.value)} type="search" placeholder="Search items..." aria-label="Search items" /></div>
//       <select value={activeCategory} onChange={(event) => selectCategory(event.target.value)} aria-label="Filter by category">{categories.map((category) => <option key={category}>{category}</option>)}</select>
//       <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} aria-label="Sort products"><option value="newest">Newest First</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select>
//       <span className="mp-cart-summary"><FaShoppingCart /> {itemCount} in cart</span>
//     </div>
//     <div className="mp-body">
//       <aside className="mp-sidebar">
//         <div className="mp-sidebar-section"><h4>Categories</h4><ul className="mp-category-list">{categories.map((category) => <li key={category} className={activeCategory === category ? "mp-active" : ""} onClick={() => selectCategory(category)}>{category}<span>{category === "All Categories" ? products.length : products.filter((product) => product.category === category).length}</span></li>)}</ul></div>
//         <div className="mp-sidebar-section"><h4>Conditions</h4>{conditions.filter((condition): condition is ProductCondition => condition !== "All").map((condition) => <label className="mp-checkbox" key={condition}><input type="checkbox" checked={selectedConditions.includes(condition)} onChange={() => toggleCondition(condition)} /><span>{condition}</span></label>)}</div>
//         <div className="mp-sidebar-section"><h4>Location</h4>{locations.map((location) => <label className="mp-checkbox" key={location}><input type="checkbox" checked={selectedLocations.includes(location)} onChange={() => toggleLocation(location)} /><span>{location}</span></label>)}</div>
//       </aside>
//       <main className="mp-results">
//         <div className="mp-results-header"><span>{filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"} found</span><span className="mp-sort"><FaFilter /> Filters update as you select them</span></div>
//         {visibleProducts.length > 0 ? <div className="mp-grid">{visibleProducts.map((product) => <article className="mp-card" key={product.id}><div className="mp-card-image"><Link to={`/product/${product.id}`}><img src={product.image} alt={product.title} /></Link><button type="button" className={`mp-fav ${isSaved(product.id) ? "mp-fav-active" : ""}`} onClick={() => toggleSaved({ id: product.id, name: product.title, price: product.price, location: product.location, imageUrl: product.image })} aria-label={isSaved(product.id) ? "Remove from saved" : "Save item"}>{isSaved(product.id) ? "♥" : "♡"}</button></div><div className="mp-card-info"><Link to={`/product/${product.id}`} className="mp-card-title">{product.title}</Link><span className="mp-card-price">R{product.price.toFixed(2)}</span><span className="mp-card-condition">{product.condition} · {product.category}</span><span className="mp-card-location"><FaMapMarkerAlt /> {product.location}</span><button type="button" className="mp-add-to-cart" onClick={() => addToCart(product)}><FaShoppingCart /> Add to cart</button></div></article>)}</div> : <div className="mp-empty"><h2>No items match your filters</h2><p>Try clearing a condition or searching for another item.</p></div>}
//         <div className="mp-pagination" aria-label="Marketplace pages"><button type="button" className="mp-page-nav" disabled={page === 1} onClick={() => setPage((current) => current - 1)} aria-label="Previous page"><FaChevronLeft /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button type="button" key={number} className={`mp-page-num ${page === number ? "mp-active" : ""}`} onClick={() => setPage(number)}>{number}</button>)}<button type="button" className="mp-page-nav" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} aria-label="Next page"><FaChevronRight /></button></div>
//       </main>
//     </div>
//   </div>;
// }
