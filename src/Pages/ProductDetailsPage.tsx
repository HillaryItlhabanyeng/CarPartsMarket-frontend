import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./ProductDetailsPage.css";
import { FaMinus, FaPlus, FaShoppingCart, FaStar, FaArrowLeft, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

// Product type definition - accepts both string and number for id
interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image: string;
  brand?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  available?: number;
  colors?: string[];
  sizes?: string[];
  reviewsList?: Review[];
}

interface Review {
  name: string;
  date: string;
  rating: number;
  comment: string;
  helpful?: number;
}

export default function ProductDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);

  // Get product data from location state, or use default data if not provided
  const product = (location.state as { product: Product })?.product || defaultProduct;

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase" && quantity < (product.available || 12)) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart`);
    navigate("/cart");
  };

  const handleBuyNow = () => {
    console.log(`Buying ${quantity} of ${product.name}`);
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
              In stock
            </div>

            {/* Brand & Title */}
            <div className="brandName">{product.brand || "NIKE"}</div>
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
                  disabled={quantity >= (product.available || 12)}
                >
                  <FaPlus />
                </button>
              </div>
              
                <span className="availableStock">available: {product.available || 12}</span>
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
              {product.description || "Premium quality product with excellent craftsmanship. Designed for comfort and durability."}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviewsSection">
          <div className="reviewsHeader">
            <h3>Reviews</h3>
            <div className="ratingSummary">
              <span className="averageRating">{product.rating || 4}/5</span>
              <div className="starDisplay">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.floor(product.rating || 4) ? "filled" : "empty"}
                  />
                ))}
              </div>
              <span className="reviewCount">({(product.reviews || 0).toLocaleString()} reviews)</span>
            </div>
          </div>

          <div className="ratingBreakdown">
            <div className="ratingBar">
              <span>5 star</span>
              <div className="barTrack"><div className="barFill" style={{ width: "32%" }}></div></div>
              <span>32K</span>
            </div>
            <div className="ratingBar">
              <span>4 star</span>
              <div className="barTrack"><div className="barFill" style={{ width: "54%" }}></div></div>
              <span>54K</span>
            </div>
            <div className="ratingBar">
              <span>3 star</span>
              <div className="barTrack"><div className="barFill" style={{ width: "37%" }}></div></div>
              <span>37K</span>
            </div>
          </div>

          {/* Sample Reviews */}
          {(product.reviewsList || defaultReviews).map((review, index) => (
            <div key={index} className="reviewCard">
              <div className="reviewHeader">
                <span className="reviewerName">{review.name}</span>
                <span className="reviewDate">{review.date}</span>
              </div>
              <div className="reviewStars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < review.rating ? "filled" : "empty"}
                  />
                ))}
              </div>
              <p className="reviewComment">{review.comment}</p>
              <div className="reviewHelpful">
                Was this review helpful to you?
                <button className="helpfulBtn"><FaThumbsUp /> Yes</button>
                <button className="helpfulBtn"><FaThumbsDown /> No</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Default product data (used if no product is passed via state)
const defaultProduct: Product = {
  id: "1",
  name: "Air Jordan 270",
  category: "Clothes",
  brand: "NIKE",
  price: 350,
  image: "/shoes.png",
  description: "The Air Jordan 270 brings a fresh look to the classic silhouette. With responsive cushioning and a sleek design, these sneakers are perfect for both casual wear and athletic performance.",
  rating: 4,
  reviews: 24200,
  available: 12,
  colors: ["#4CAF50", "#8BC34A", "#2E7D32"],
  sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
  reviewsList: [
    {
      name: "Christina Perry",
      date: "14 March. 2026",
      rating: 5,
      comment: "Thank you very much i received my order and it was in perfect condition. I am very happy with my purchase.",
      helpful: 18240
    },
    {
      name: "Michael Johnson",
      date: "22 Oct. 2021",
      rating: 5,
      comment: "Thank you very much i received my order and it was in perfect condition. I am very happy with my purchase.",
      helpful: 8240
    }
  ]
};

const defaultReviews: Review[] = [
  {
    name: "Inacio Miguel",
    date: "14 May. 2026",
    rating: 5,
    comment: "Thank you very much i received my order and it was in perfect condition. I am very happy with my purchase.",
    helpful: 18240
  },
  {
    name: "Alex Warren",
    date: "22 Oct. 2021",
    rating: 5,
    comment: "Thank you very much i received my order and it was in perfect condition. I am very happy with my purchase.",
    helpful: 8240
  }
];
