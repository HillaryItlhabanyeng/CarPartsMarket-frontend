import { createContext, useState, type ReactNode } from "react";
import type { Order, OrderItem } from "./OrdersContext.types";

type OrdersContextType = {
  orders: Order[];
  addOrder: (items: OrderItem[], deliveryFee: number) => Order;
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

  const addOrder = (items: OrderItem[], deliveryFee: number) => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const newOrder: Order = {
      reference: generateReference(),
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: "PENDING",
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

  const getOrder = (reference: string) =>
    orders.find((o) => o.reference === reference);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}