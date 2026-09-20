import { createContext, useState, type ReactNode } from "react";
import type { Order, OrderItem } from "./OrdersContext.types";

type OrdersContextType = {
  orders: Order[];
  addOrder: (items: OrderItem[], deliveryFee: number, buyerEmail?: string) => Order;
  markOrderShipped: (reference: string) => Order | undefined;
  getOrder: (reference: string) => Order | undefined;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export { OrdersContext };

function generateReference() {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `FR-${random}`;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

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
    let shippedOrder: Order | undefined;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.reference !== reference) return order;
        shippedOrder = { ...order, status: "SHIPPED" };
        return shippedOrder;
      })
    );
    return shippedOrder;
  };

  const getOrder = (reference: string) =>
    orders.find((o) => o.reference === reference);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, markOrderShipped, getOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}