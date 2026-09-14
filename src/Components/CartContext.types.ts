export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  seller?: string;
  category?: string;
  location?: string;
  imageUrl?: string;
}

export const CART_STORAGE_KEY = "unitrade_cart";

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
