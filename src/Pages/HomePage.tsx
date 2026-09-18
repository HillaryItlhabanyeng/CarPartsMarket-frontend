import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../Components/useCart";
import { products } from "../data/products";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

// const categoryImages: Record<string, string> = {
//   Electronics: "/battery.png",
//   Body: "/battery.png",
//   Engines: "/engine.jpg",
//   Fluids: "/fluids.jpg",
//   Transmissions: "/transmissions.png",
// };

type Mode = "buyer" | "seller";

const heroContent: Record<
  Mode,
  {
    title: string;
    subtitle: string;
    description: string[];
    primaryBtn: string;
    // secondaryBtn: string;
    image: string;
  }
> = {
  buyer: {
    title: "Buy Preowned",
    subtitle: "And Use it Your way",
    description: [
      "The trusted community marketplace for car parts.",
      "Buy car parts, discover great deals, and connect with other car owners.",
    ],
    primaryBtn: "Shop now",
    // secondaryBtn: "Log in",
    image: "/Transmission-Fluid.jpg",
  },

  seller: {
    title: "Sell Your Parts",
    subtitle: "And Earn Your Way",
    description: [
      "The trusted community marketplace for car parts.",
      "Sell your car parts, reach thousands of buyers, and grow your business.",
    ],
    primaryBtn: "Start Selling",
    // secondaryBtn: "Log in",
    image: "/Transmission-Fluid.jpg",
  },
};

export default function HomePage() {
  const [showMore, setShowMore] = useState(false);
  const [mode, setMode] = useState<Mode>("buyer");
  const { addItem } = useCart();
  const visibleProducts = showMore ? products : products.slice(0, 5);
  // const featuredCategories = categories.filter(
  //   (category) => category !== "All Categories"
  // );

  const handleAddToCart = (product: typeof products[number]) => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      seller: product.seller,
      category: product.category,
      location: product.location,
      imageUrl: product.image,
    });
  };

  const navigate = useNavigate();
  const hero = heroContent[mode];

  const handlePrimaryAction = () => {
    // if (mode === "buyer") {
    //   navigate("/login");
    // } else {
    navigate("/list-product");
    // }
  };

  return (
    <div className="ut-page">
      <Navbar />

      <section className={`ut-hero ${mode === "seller" ? "seller-mode" : ""}`}>
        {/* Buy/Sell Toggle Switch */}
        <div className="ut-mode-toggle">
          <button
            type="button"
            className={`ut-toggle-btn ${mode === "buyer" ? "active" : ""}`}
            onClick={() => setMode("buyer")}
          >
            Buy
          </button>
          <button
            type="button"
            className={`ut-toggle-btn ${mode === "seller" ? "active" : ""}`}
            onClick={() => setMode("seller")}
          >
            Sell
          </button>
          <div className={`ut-toggle-slider ${mode}`}></div>
        </div>

        <div className="ut-hero-copy">
          <h1>{hero.title}</h1>
          <h2>{hero.subtitle}</h2>
          <p>{hero.description[0]}</p>
          <p>{hero.description[1]}</p>
          <div className="ut-hero-buttons">
            <button className="ut-btn-primary" onClick={handlePrimaryAction}>
              {hero.primaryBtn}
            </button>
            {/* <button
              className="ut-btn-secondary"
              onClick={() => navigate("/login")}
            >
              {hero.secondaryBtn}
            </button> */}
          </div>
        </div>

        <div className="ut-hero-image">
          <img src={hero.image} alt={mode === "buyer" ? "Buy parts" : "Sell parts"} />
        </div>
      </section>

      {/* <section className="ut-section">
        <div className="ut-section-header">
          <h3>Popular Categories</h3>
          <Link to="/categories" className="ut-view-all">
            View all categories
          </Link>
        </div>
        <div className="ut-categories">
          {featuredCategories.map((category) => {
            const categoryName = category;
            const count = products.filter(
              (product) => product.category === categoryName
            ).length;
            return (
              <Link
                to={`/shop?category=${encodeURIComponent(categoryName)}`}
                className="ut-category-card"
                key={categoryName}
              >
                <img src={categoryImages[categoryName]} alt={categoryName} />
                <span>{categoryName}</span>
                <small>{count} listings</small>
              </Link>
            );
          })}
        </div>
      </section> */}

      {/* ===================================================service======================================== */}

      {/* <section className="homeServicesSection">
      </section> */}

      <section className="homeCategorySection">

        <h1>browse by category</h1>

        <div className="servicePromoCards">

          <div className="homeserviceCards" >
              <img src="/engine.png" alt="PartLink Logo" className="homeServiceImage" />
              <h2 className="homeServiceText">Engines</h2>
          </div>

          <div className="homeserviceCards" >
              <img src="/fluids.png" alt="PartLink Logo" className="homeServiceImage" />
              <h2 className="homeServiceText">Fluids</h2>
          </div>

          <div className="homeserviceCards" >
              <img src="/suspension.png" alt="PartLink Logo" className="homeServiceImage" />
              <h2 className="homeServiceText">Suspensions</h2>
          </div>

          <div className="homeserviceCards" >
              <img src="/interior-decoration.png" alt="PartLink Logo" className="homeServiceImage" />
              <h2 className="homeServiceText">Interio</h2>
          </div>

          <div className="homeserviceCards" >
              <img src="/lights.jpg" alt="PartLink Logo" className="homeServiceImage" />
              <h2 className="homeServiceText">Electronics</h2>
          </div>

        </div>
      </section>

      <section className="ut-section">
        <div className="ut-section-header">
          <div>
            <h3>Featured Listings</h3>
            {/* <p className="ut-section-subtitle">
              Fresh finds from students across campus
            </p> */}
          </div>
          <Link to="/shop" className="ut-view-all">
            View all listings
          </Link>
        </div>
        <div className="ut-listings">
          {visibleProducts.map((product) => (
            <article className="ut-listing-card" key={product.id}>
              <Link
                to={`/product/${product.id}`}
                className="ut-listing-image-link"
              >
                <img src={product.image} alt={product.title} />
              </Link>
              <div className="ut-listing-info">
                <Link to={`/product/${product.id}`} className="ut-listing-title">
                  {product.title}
                </Link>
                <span className="ut-listing-price">
                  R{product.price.toFixed(2)}
                </span>
                <span className="ut-listing-meta">
                  <FaMapMarkerAlt /> {product.location}
                </span>
                <button
                  type="button"
                  className="ut-add-to-cart"
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
        <button
          type="button"
          className="ut-more-button"
          onClick={() => setShowMore((current) => !current)}
        >
          {showMore ? "Show less" : "More items"}
        </button>
      </section>

      <Footer />
    </div>
  );
}