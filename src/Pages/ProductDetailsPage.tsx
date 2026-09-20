import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../Components/useCart";
import { findLiveListing, toDetailsProduct } from "../Components/marketListings";
import "./ProductDetailsPage.css";
import { FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from "react-icons/fa";


interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image: string;
  brand?: string;
  seller?: string;
  sellerEmail?: string;
  description?: string;
  available?: number;
  colors?: string[];
  sizes?: string[];
}

export default function ProductDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);

  // The product comes from the link that was clicked; if the page was refreshed or opened
  // directly, rebuild it from the listing id in the URL.
  const { id } = useParams();
  const stateProduct = (location.state as { product?: Product } | null)?.product;
  const listing = findLiveListing(id);
  const product: Product | null =
    stateProduct ?? (listing ? toDetailsProduct(listing) : null);

  if (!product) {
    return (
      <div className="productDetailsContainer">
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#45576a" }}>
          <h2 style={{ color: "#0d2b45" }}>This part isn't available</h2>
          <p>It may have been sold or removed by the seller.</p>
          <button className="addToCartBtn" onClick={() => navigate("/shop")}>
            Browse parts
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Only cap the quantity when the seller told us how many they have
  const maxQuantity = product.available ?? 99;

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase" && quantity < maxQuantity) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addProductToCart = () => {
    addItem(
      {
        id: String(product.id),
        name: product.name,
        price: product.price,
        imageUrl: product.image,
        seller: product.seller ?? product.brand,
        sellerEmail: product.sellerEmail,
        category: product.category,
      },
      quantity
    );
  };

  const handleAddToCart = () => {
    addProductToCart();
    navigate("/cart");
  };

  const handleBuyNow = () => {
    addProductToCart();
    navigate("/checkout");
  };

  return (
    <div className="productDetailsContainer">
      <Navbar />

      <div className="productDetailsWrapper">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/categories" className="breadcrumbLink">
            <FaArrowLeft /> Back to Categories
          </Link>
          <span className="breadcrumbSeparator">/</span>
          <Link to="/categories" className="breadcrumbLink">
            {product.category || "Products"}
          </Link>
          <span className="breadcrumbSeparator">/</span>
          <span className="breadcrumbCurrent">{product.name}</span>
        </div>

        <div className="productDetailGrid">
          {/* Left Column - Image */}
          <div className="productImageWrapper">
            <img 
              src={product.image || "/placeholder.png"} 
              alt={product.name} 
              className="productMainImage" 
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="productInfoWrapper">
            {/* In Stock Badge */}
            <div className="stockBadge">
              <span className="stockDot"></span>
              {product.available === 0 ? "Out of stock" : "In stock"}
            </div>

            {/* Brand & Title */}
            {product.brand && <div className="brandName">{product.brand}</div>}
            <h1 className="productDetailTitle">{product.name}</h1>
            <div className="productDetailPrice">R{product.price.toFixed(2)}</div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="colorSection">
                <span className="sectionLabel">Colors:</span>
                <div className="colorOptions">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`colorDot ${selectedColor === index ? "active" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(index)}
                      aria-label={`Color ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="sizeSection">
                <div className="sizeHeader">
                  <span className="sectionLabel">Select size:</span>
                  <span className="sizeGuide">Choose your size</span>
                </div>
                <div className="sizeOptions">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`sizeButton ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="quantitySection">
              <span className="sectionLabel">Quantity:</span>
              <div className="quantityControls">
                <button
                  className="quantityButton"
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="quantityDisplay">{quantity}</span>
                <button
                  className="quantityButton"
                  onClick={() => handleQuantityChange("increase")}
                  disabled={quantity >= maxQuantity}
                >
                  <FaPlus />
                </button>
              </div>
              
              {product.available !== undefined && (
                <span className="availableStock">available: {product.available}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="actionButtons">
              <button className="addToCartBtn" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to cart
              </button>
              <button className="buyNowBtn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            {/* Tabs */}
            <div className="tabSection">
              <button className="tabButton active">Description</button>
              {/* <button className="tabButton">Reviews ({product.reviews || 0})</button> */}
            </div>

            {/* Description */}
            <div className="descriptionText">
              {product.description || "The seller hasn't added a description."}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviewsSection">
          <div className="reviewsHeader">
            <h3>Reviews</h3>
          </div>
          <p className="reviewComment">No reviews yet for this part.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
