import Navbar from "../Components/Navbar";
import { useOrders } from "../Components/useOrders";
import "./BuyingPage.css";

export default function BuyingPage() {
  const { orders } = useOrders();

  const formatCurrency = (value: number) => `R${value.toFixed(2)}`;

  return (
    <div className="buying-page">
      <Navbar />

      <div className="buying-header">
        <h1>Buying</h1>
        <p>Items and orders you've purchased on UniTrade</p>
      </div>

      {orders.length === 0 ? (
        <div className="buying-empty">
          <p>You haven't bought anything yet.</p>
        </div>
      ) : (
        <div className="buying-list">
          {orders.map((order) => (
            <div className="buying-card" key={order.reference}>
              <div className="buying-card-header">
                <span className="buying-reference-label">ORDER REFERENCE</span>
                <span className={`buying-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p className="buying-reference-number">{order.reference}</p>
              <p className="buying-date">{order.date}</p>

              {order.items.map((item) => (
                <div className="buying-item" key={item.id}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                  <div className="buying-item-info">
                    <p className="buying-item-name">{item.name}</p>
                    <p className="buying-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="buying-item-price">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="buying-total-row">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}