import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useCart } from "../Components/useCart";
import {
  calculateDiscount,
  findCoupon,
  loadAppliedCoupon,
  saveAppliedCoupon,
  type Coupon,
} from "../data/coupons";
import "./CartPage.css";

const DELIVERY_FEE = 50;

function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(loadAppliedCoupon);
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const delivery = items.length > 0 ? DELIVERY_FEE : 0;
  const discount = calculateDiscount(appliedCoupon, subtotal, delivery);
  const total = Math.max(0, subtotal - discount + delivery);

  const minSpendNotMet =
    appliedCoupon?.minSpend !== undefined && subtotal < appliedCoupon.minSpend;

  const handleApplyCoupon = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const code = couponInput.trim();
    if (!code) {
      setCouponMessage({ type: "error", text: "Please enter a coupon code." });
      return;
    }

    const coupon = findCoupon(code);
    if (!coupon) {
      setCouponMessage({ type: "error", text: "That coupon code isn't valid." });
      return;
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      setCouponMessage({
        type: "error",
        text: `This coupon needs a minimum spend of ${formatCurrency(coupon.minSpend)}.`,
      });
      return;
    }

    setAppliedCoupon(coupon);
    saveAppliedCoupon(coupon);
    setCouponInput("");
    setCouponMessage({ type: "success", text: `${coupon.code} applied: ${coupon.description}.` });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    saveAppliedCoupon(null);
    setCouponMessage(null);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate("/checkout");
  };

  const formatCurrency = (value: number) => `R${value.toFixed(2)}`;

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>

        <div className="cart-table-wrapper">
          {items.length === 0 ? (
            <p className="empty-cart">
              Your cart is empty. Browse the marketplace to add items.
            </p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th className="col-item">Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="col-item">
                      <div className="item-cell">
                        <div className="item-thumb">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} />
                          ) : null}
                        </div>
                        <div className="item-info">
                          <p className="item-name">{item.name}</p>
                          {item.seller && (
                            <p className="item-seller">
                              Sold by: {item.seller}
                            </p>
                          )}
                          {item.category && (
                            <p className="item-meta">
                              Category: {item.category}
                            </p>
                          )}
                          {item.location && (
                            <p className="item-meta">
                              Location: {item.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>
                      <div className="qty-control">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{formatCurrency(item.price * item.quantity)}</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="cart-bottom">
          <div className="coupon-card">
            <h2 className="card-heading">Have a Coupon?</h2>

            {appliedCoupon ? (
              <div className="coupon-applied">
                <span>
                  <strong>{appliedCoupon.code}</strong>: {appliedCoupon.description}
                </span>
                <button type="button" className="coupon-remove" onClick={handleRemoveCoupon}>
                  Remove
                </button>
              </div>
            ) : (
              <form className="coupon-row" onSubmit={handleApplyCoupon}>
                <input
                  type="text"
                  placeholder="Enter Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button type="submit" className="apply-btn">Apply</button>
              </form>
            )}

            {minSpendNotMet && (
              <p className="coupon-message error">
                Add {formatCurrency(appliedCoupon!.minSpend! - subtotal)} more to use this coupon.
              </p>
            )}

            {couponMessage && !minSpendNotMet && (
              <p className={`coupon-message ${couponMessage.type}`}>{couponMessage.text}</p>
            )}
          </div>

          <div className="summary-card">
            <h2 className="card-heading">Cart Summary</h2>
            <div className="summary-row">
              <span>
                Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Discount{appliedCoupon && discount > 0 ? ` (${appliedCoupon.code})` : ""}</span>
              <span className={discount > 0 ? "discount-amount" : undefined}>
                {discount > 0 ? `-${formatCurrency(discount)}` : formatCurrency(0)}
              </span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{formatCurrency(delivery)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CartPage;