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

      <main className="sv-main">
        <div className="sv-page-header">
          <div>
            <h1>Wishlist</h1>
            <p>Items you've saved on AutoMarket</p>
          </div>
        </div>

        {savedItems.length === 0 ? (
          <div className="sv-empty">
            <div className="sv-empty-icon">♡</div>

            <h2>Your wishlist is empty</h2>

            <p>
              You haven't saved any items yet. Browse our listings and save
              products you would like to come back to.
            </p>

            <Link to="/shop" className="sv-browse-btn">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="sv-content">
            <div className="sv-results-header">
              <h2>Saved Items</h2>
              <span>
                {savedItems.length}{" "}
                {savedItems.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="sv-grid">
              {savedItems.map((item) => (
                <article className="sv-card" key={item.id}>
                  <div className="sv-card-image">
                    <img src={item.imageUrl} alt={item.name} />

                    <button
                      type="button"
                      className="sv-remove"
                      onClick={() => removeSaved(item.id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                      title="Remove from wishlist"
                    >
                      ♥
                    </button>
                  </div>

                  <div className="sv-card-info">
                    <h3 className="sv-card-title">{item.name}</h3>

                    <span className="sv-card-price">
                      R{item.price.toFixed(2)}
                    </span>

                    {item.location && (
                      <span className="sv-card-location">
                        📍 {item.location}
                      </span>
                    )}

                    <button
                      type="button"
                      className="sv-add-to-cart"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}