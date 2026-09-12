import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useSaved } from "../Components/useSaved";
import { useCart } from "../Components/useCart";
import "./SavedPage.css";

export default function SavedPage() {
  const { savedItems, removeSaved } = useSaved();
  const { addItem } = useCart();

  const handleAddToCart = (item: (typeof savedItems)[number]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      location: item.location,
      imageUrl: item.imageUrl,
    });
  };

  return (
    <div className="sv-page">
      <Navbar />

      <div className="sv-page-header">
        <div>
          <h1>Saved</h1>
          <p>Items you've favorited on UniTrade</p>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="sv-empty">
          <p>You haven't saved any items yet.</p>
          <Link to="/shop" className="sv-browse-btn">
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="sv-grid">
          {savedItems.map((item) => (
            <div className="sv-card" key={item.id}>
              <div className="sv-card-image">
                <img src={item.imageUrl} alt={item.name} />
                <button
                  className="sv-remove"
                  onClick={() => removeSaved(item.id)}
                  aria-label="Remove from saved"
                >
                  ♥
                </button>
              </div>

              <div className="sv-card-info">
                <span className="sv-card-title">{item.name}</span>
                <span className="sv-card-price">R{item.price.toFixed(2)}</span>
                {item.location && (
                  <span className="sv-card-location">📍 {item.location}</span>
                )}
                <button
                  className="sv-add-to-cart"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}