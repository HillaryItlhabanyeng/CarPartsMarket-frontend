export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
  seller?: string;
  sellerEmail?: string;
};

export type Order = {
  reference: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  buyerEmail?: string;
  date: string;
};