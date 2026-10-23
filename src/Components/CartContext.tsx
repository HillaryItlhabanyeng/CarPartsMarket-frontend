import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem } from "./CartContext.types";
import { getCartStorageKey, loadCart } from "./CartContext.types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [toastMsg, setToastMsg] = useState<string | null>(null); // NEW

  useEffect(() => {
    localStorage.setItem(getCartStorageKey(), JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const refreshCart = () => setItems(loadCart());
    window.addEventListener("automarket-user-updated", refreshCart);

    return () => {
      window.removeEventListener("automarket-user-updated", refreshCart);
    };
  }, []);

  // NEW: hide the pop-up after 2.5 seconds
  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(null), 2500);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  const addItem = (item: Omit<CartItem, "quantity">, qty = 1) => {
    const existing = items.find((i) => i.id === item.id);

    setItems((prev) => {
      const inCart = prev.find((i) => i.id === item.id);
      if (inCart) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });

    // NEW: show the pop-up
    setToastMsg(
      existing
        ? `${item.name} quantity updated (${existing.quantity + qty})`
        : `${item.name} added to cart`
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}

      {/* NEW: the pop-up */}
      {toastMsg && (
        <div
          role="status"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            background: "#1a2332",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 8,
            borderLeft: "4px solid #a8744f",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontSize: 14,
          }}
        >
          ✓ {toastMsg}
        </div>
      )}
    </CartContext.Provider>
  );
}