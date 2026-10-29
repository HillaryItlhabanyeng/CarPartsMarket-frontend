export type CouponType = "percent" | "fixed" | "freeDelivery";
export const DELIVERY_FEE = 50;


export interface Coupon {
  code: string;
  type: CouponType;
  value: number;        
  minSpend?: number;    
  description: string;
}

export const COUPONS: Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, description: "10% off your order" },
  { code: "SAVE50", type: "fixed", value: 50, minSpend: 500, description: "R50 off orders over R500" },
  { code: "FREESHIP", type: "freeDelivery", value: 0, description: "Free delivery" },
];

const APPLIED_COUPON_KEY = "automarket_applied_coupon";

export function findCoupon(code: string): Coupon | undefined {
  return COUPONS.find((c) => c.code === code.trim().toUpperCase());
}

export function calculateDiscount(coupon: Coupon | null, subtotal: number, delivery: number): number {
  if (!coupon || subtotal <= 0) return 0;
  if (coupon.minSpend && subtotal < coupon.minSpend) return 0;

  switch (coupon.type) {
    case "percent":
      return Math.round(subtotal * coupon.value) / 100;
    case "fixed":
      return Math.min(coupon.value, subtotal);
    case "freeDelivery":
      return delivery;
    default:
      return 0;
  }
}


export function loadAppliedCoupon(): Coupon | null {
  const code = localStorage.getItem(APPLIED_COUPON_KEY);
  return code ? findCoupon(code) ?? null : null;
}

export function saveAppliedCoupon(coupon: Coupon | null): void {
  if (coupon) localStorage.setItem(APPLIED_COUPON_KEY, coupon.code);
  else localStorage.removeItem(APPLIED_COUPON_KEY);
}