
import type { Order, OrderItem } from "./OrdersContext.types";
import { commissionOn, sellerPayout } from "../data/commission";

export type SellerOrderRow = {
  reference: string;
  date: string;
  status: Order["status"];
  buyer: string;
  items: OrderItem[];
 
  subtotal: number;
  
  commission: number;
 
  payout: number;
};

type SellerIdentity = { id?: string | number; name?: string; email?: string } | null;

const sameText = (a?: string | number, b?: string | number) =>
  a !== undefined && b !== undefined && a !== null && b !== null &&
  String(a).trim() !== "" &&
  String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

const isSellersItem = (item: OrderItem, seller: SellerIdentity) =>
  sameText(item.sellerEmail, seller?.email) ||
  sameText(item.seller, seller?.id) ||
  (!item.sellerEmail && sameText(item.seller, seller?.name));

export function getSellerOrderRows(orders: Order[], seller: SellerIdentity): SellerOrderRow[] {
  return orders
    .map((order) => {
      const items = order.items.filter((item) => isSellersItem(item, seller));
      if (items.length === 0) return null;

      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        reference: order.reference,
        date: order.date,
        status: order.status,
        buyer: order.buyerEmail || "Guest buyer",
        items,
        subtotal,
        commission: commissionOn(subtotal),
        payout: sellerPayout(subtotal),
      } satisfies SellerOrderRow;
    })
    .filter((row): row is SellerOrderRow => row !== null);
}