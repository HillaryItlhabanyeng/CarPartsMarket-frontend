import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Order, OrderItem } from "./OrdersContext.types";

type OrdersContextType = {
  orders: Order[];
  addOrder: (items: OrderItem[], deliveryFee: number, buyerEmail?: string) => Order;
  markOrderShipped: (reference: string) => Order | undefined;
  getOrder: (reference: string) => Order | undefined;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export { OrdersContext };

// Orders are kept in localStorage so a seller can see what buyers ordered from them
// (there is no backend, so this is the shared "database" in the browser).
const ORDERS_STORAGE_KEY = "marketplace_orders";

function loadOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  try {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Listing photos are stored as data URLs and can fill the quota; keep the orders without them
    try {
      const slim = orders.map((order) => ({
        ...order,
        items: order.items.map((item) =>
          item.imageUrl?.startsWith("data:") ? { ...item, imageUrl: undefined } : item
        ),
      }));
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(slim));
    } catch {
      // storage unavailable: orders stay in memory for this session
    }
  }
}

function generateReference() {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `FR-${random}`;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const addOrder = (items: OrderItem[], deliveryFee: number, buyerEmail?: string) => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const newOrder: Order = {
      reference: generateReference(),
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: "PENDING",
      buyerEmail,
      date: new Date().toLocaleString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const markOrderShipped = (reference: string) => {
    const existing = orders.find((order) => order.reference === reference);
    if (!existing) return undefined;

    const shipped: Order = { ...existing, status: "SHIPPED" };
    setOrders((prev) => prev.map((order) => (order.reference === reference ? shipped : order)));
    return shipped;
  };

  const getOrder = (reference: string) =>
    orders.find((o) => o.reference === reference);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, markOrderShipped, getOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}
