type OrderItem = {
    name: string;
    specs: string;
    price: number;
    image: string;
};

type Props = {
    items: OrderItem[];
    deliveryFee: number;
    discount?: number;
    couponCode?: string;
};

export default function OrderSummary({ items, deliveryFee, discount = 0, couponCode }: Props) {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const total = Math.max(0, subtotal + deliveryFee - discount);

    return (
        <div className="order-summary">
            <h3>Order ({items.length} item{items.length !== 1 ? "s" : ""})</h3>
            <hr />
            {items.map((item, i) => (
                <div key={i} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-specs">{item.specs}</p>
                    </div>
                    <span className="order-item-price">R{item.price.toFixed(2)}</span>
                </div>
            ))}
            <hr />
            <div className="summary-row">
                <span>Subtotal</span>
                <span>R{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
                <span>Delivery</span>
                <span>R{deliveryFee.toFixed(2)}</span>
            </div>
            {discount > 0 && (
                <div className="summary-row">
                    <span>Discount{couponCode ? ` (${couponCode})` : ""}</span>
                    <span style={{ color: "#2e7d4f", fontWeight: 600 }}>
                        -R{discount.toFixed(2)}
                    </span>
                </div>
            )}
            <hr />
            <div className="summary-row total">
                <span>Total Paid</span>
                <span>R{total.toFixed(2)}</span>
            </div>
        </div>
    );
}