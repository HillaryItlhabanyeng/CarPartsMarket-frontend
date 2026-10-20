export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  seller?: string;
  sellerEmail?: string;
  category?: string;
  location?: string;
  imageUrl?: string;
}

export const CART_STORAGE_KEY = "unitrade_cart";

export function getCartStorageKey(): string {
  try {
    const rawUser = localStorage.getItem("marketplace_current_user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const email = String(user?.email ?? "").trim().toLowerCase();

    return email ? `${CART_STORAGE_KEY}:${email}` : `${CART_STORAGE_KEY}:guest`;
  } catch {
    return `${CART_STORAGE_KEY}:guest`;
  }
}

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(getCartStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
