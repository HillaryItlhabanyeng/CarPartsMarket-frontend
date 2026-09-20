// Works out which orders belong to a seller ("Orders Received").
// An order can hold items from several sellers, so each row only carries this seller's items.
import type { Order, OrderItem } from "./OrdersContext.types";

export type SellerOrderRow = {
  reference: string;
  date: string;
  status: Order["status"];
  buyer: string;
  items: OrderItem[];
  // Sum of this seller's items only (delivery fee excluded)
  subtotal: number;
};

type SellerIdentity = { name?: string; email?: string } | null;

const sameText = (a?: string, b?: string) =>
  !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

const isSellersItem = (item: OrderItem, seller: SellerIdentity) =>
  sameText(item.sellerEmail, seller?.email) ||
  (!item.sellerEmail && sameText(item.seller, seller?.name));

export function getSellerOrderRows(orders: Order[], seller: SellerIdentity): SellerOrderRow[] {
  return orders
    .map((order) => {
      const items = order.items.filter((item) => isSellersItem(item, seller));
      if (items.length === 0) return null;

      return {
        reference: order.reference,
        date: order.date,
        status: order.status,
        buyer: order.buyerEmail || "Guest buyer",
        items,
        subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      } satisfies SellerOrderRow;
    })
    .filter((row): row is SellerOrderRow => row !== null);
}
