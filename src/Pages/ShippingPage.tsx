import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useCart } from "../Components/useCart";
import "./ShippingPage.css";

type DeliveryMethod = "doorstep" | "pickup";

type ShippingForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  deliveryMethod: DeliveryMethod;
  notes: string;
};

const defaultShipping: ShippingForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  deliveryMethod: "doorstep",
  notes: "",
};

export default function ShippingPage() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const [shipping, setShipping] = useState<ShippingForm>(defaultShipping);

  const total = useMemo(() => subtotal, [subtotal]);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setShipping((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const requiredFields = [
      shipping.fullName,
      shipping.email,
      shipping.phone,
      shipping.address,
      shipping.city,
      shipping.province,
      shipping.postalCode,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      alert("Please complete all required shipping details before continuing.");
      return;
    }

    sessionStorage.setItem("shippingDetails", JSON.stringify(shipping));
    navigate("/checkout/payment");
  };

  return (
    <>
      <Navbar showLinks={false} />

      <div className="shipping-page">
        <div className="shipping-shell">
          <aside className="shipping-panel shipping-summary">
            <p className="shipping-kicker">Order summary</p>
            <h2>Delivery details</h2>

            <div className="summary-items">
              {items.length === 0 ? (
                <p className="empty-summary">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <div className="summary-item" key={item.id}>
                    <div className="summary-thumb">
                      <img src={item.imageUrl || "/engine.png"} alt={item.name} />
                    </div>
                    <div className="summary-meta">
                      <strong>{item.name}</strong>
                      <span>{item.category || "Auto part"}</span>
                      <b>R{item.price.toFixed(2)}</b>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="summary-totals">
              <div>
                <span>Subtotal</span>
                <strong>R{subtotal.toFixed(2)}</strong>
              </div>
              <div className="summary-total-row">
                <span>Total</span>
                <strong>R{total.toFixed(2)}</strong>
              </div>
            </div>
          </aside>

          <main className="shipping-panel shipping-form-panel">
            <div className="shipping-header-row">
              <div>
                <p className="shipping-kicker">Secure checkout</p>
                <h1>Shipping details</h1>
              </div>
              <Link to="/cart" className="back-link">Back to cart</Link>
            </div>

            <div className="shipping-form-grid">
              <div className="field-group">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={shipping.fullName}
                  onChange={onChange}
                  placeholder="John Doe"
                />
              </div>

              <div className="field-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={shipping.email}
                  onChange={onChange}
                  placeholder="name@example.com"
                />
              </div>

              <div className="field-group">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={shipping.phone}
                  onChange={onChange}
                  placeholder="081 234 5678"
                />
              </div>

              <div className="field-group">
                <label htmlFor="province">Province</label>
                <select
                  id="province"
                  name="province"
                  value={shipping.province}
                  onChange={onChange}
                >
                  <option value="">Select province</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Free State">Free State</option>
                  <option value="Gauteng">Gauteng</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Limpopo">Limpopo</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="North West">North West</option>
                  <option value="Northern Cape">Northern Cape</option>
                  <option value="Western Cape">Western Cape</option>
                </select>
              </div>

              <div className="field-group field-wide">
                <label htmlFor="address">Street address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={shipping.address}
                  onChange={onChange}
                  placeholder="123 Main Road, Unit 4"
                />
              </div>

              <div className="field-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={shipping.city}
                  onChange={onChange}
                  placeholder="Cape Town"
                />
              </div>

              <div className="field-group">
                <label htmlFor="postalCode">Postal code</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={shipping.postalCode}
                  onChange={onChange}
                  placeholder="8000"
                />
              </div>

              <div className="field-group field-wide">
                <label>Delivery method</label>
                <div className="delivery-options">
                  <label className={shipping.deliveryMethod === "doorstep" ? "option selected" : "option"}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="doorstep"
                      checked={shipping.deliveryMethod === "doorstep"}
                      onChange={onChange}
                    />
                    Doorstep delivery
                  </label>
                  <label className={shipping.deliveryMethod === "pickup" ? "option selected" : "option"}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={shipping.deliveryMethod === "pickup"}
                      onChange={onChange}
                    />
                    Pickup
                  </label>
                </div>
              </div>

              <div className="field-group field-wide">
                <label htmlFor="notes">Delivery notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={shipping.notes}
                  onChange={onChange}
                  rows={4}
                  placeholder="Apartment number, gate code, landmark, or delivery instructions"
                />
              </div>
            </div>

            <div className="shipping-actions">
              <button type="button" className="secondary-btn" onClick={() => navigate("/cart")}>Edit cart</button>
              <button type="button" className="primary-btn" onClick={handleSubmit}>Continue to payment</button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
