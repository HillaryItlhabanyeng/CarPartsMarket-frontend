import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import api from "../api/axiosInstance";
import { partCategories } from "../data/partCategories";
import type { Order } from "./OrdersContext.types";

export type PlaceOrderInput = {
  items: { carPartId: string; quantity: number }[];
  couponCode?: string | null;
  paymentMethod: string;
};

type OrdersContextType = {
  orders: Order[];
  loading: boolean;
  placeOrder: (input: PlaceOrderInput) => Promise<Order>;
  markOrderShipped: (reference: string) => Promise<Order | undefined>;
  getOrder: (reference: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export { OrdersContext };

// What the backend returns (OrderResponseDTO)
type BackendOrder = {
  reference: string;
  date: string;
  status: Order["status"];
  buyerEmail?: string | null;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    seller?: string | null;
    category?: string | null; // categoryId
    imageUrl?: string | null;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string | null;
  total: number;
  paymentMethod?: string | null;
};

// categoryId "3" -> "Electrical"
function categoryName(id?: string | null): string | undefined {
  const index = Number(id);
  return Number.isInteger(index) && index >= 1 ? partCategories[index - 1] : undefined;
}

function toOrder(o: BackendOrder): Order {
  return {
    reference: o.reference,
    date: o.date,
    status: o.status,
    buyerEmail: o.buyerEmail ?? undefined,
    items: o.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      seller: i.seller ?? undefined,
      category: categoryName(i.category),
      imageUrl: i.imageUrl ?? undefined,
    })),
    subtotal: o.subtotal,
    deliveryFee: o.deliveryFee,
    discount: o.discount,
    couponCode: o.couponCode ?? undefined,
    total: o.total,
    paymentMethod: o.paymentMethod ?? undefined,
  };
}

function readRole(): string {
  try {
    const raw = localStorage.getItem("marketplace_current_user");
    return String(raw ? JSON.parse(raw)?.role ?? "" : "").toLowerCase();
  } catch {
    return "";
  }
}

// Each role sees a different set of orders
function ordersEndpoint(role: string): string | null {
  if (role === "admin") return "/orders";
  if (role === "seller") return "/orders/seller";
  if (role === "buyer") return "/orders/mine";
  return null;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshOrders = useCallback(async () => {
    const endpoint = ordersEndpoint(readRole());
    if (!endpoint || !localStorage.getItem("token")) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get<BackendOrder[]>(endpoint);
      setOrders(Array.isArray(res.data) ? res.data.map(toOrder) : []);
    } catch (err) {
      console.error("Could not load orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on start, and again whenever someone logs in or out
  useEffect(() => {
    void refreshOrders();
    const onUserChange = () => void refreshOrders();
    window.addEventListener("automarket-user-updated", onUserChange);
    return () => window.removeEventListener("automarket-user-updated", onUserChange);
  }, [refreshOrders]);

  const placeOrder = async (input: PlaceOrderInput) => {
    const res = await api.post<BackendOrder>("/orders", input);
    const order = toOrder(res.data);
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const markOrderShipped = async (reference: string) => {
    try {
      const res = await api.put<BackendOrder>(`/orders/${reference}/ship`);
      const shipped = toOrder(res.data);
      setOrders((prev) => prev.map((o) => (o.reference === reference ? shipped : o)));
      return shipped;
    } catch (err) {
      console.error("Could not mark order as shipped:", err);
      return undefined;
    }
  };

  const getOrder = (reference: string) => orders.find((o) => o.reference === reference);

  return (
    <OrdersContext.Provider
      value={{ orders, loading, placeOrder, markOrderShipped, getOrder, refreshOrders }}
    >
      {children}
    </OrdersContext.Provider>
  );
}