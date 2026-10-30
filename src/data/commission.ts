
export const COMMISSION_RATE = 0.10;

const round2 = (value: number) => Math.round(value * 100) / 100;

export const commissionOn = (amount: number) => round2(amount * COMMISSION_RATE);

export const sellerPayout = (amount: number) => round2(amount - commissionOn(amount));
export const commissionLabel = `${Math.round(COMMISSION_RATE * 100)}%`;