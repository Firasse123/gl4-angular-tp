export interface DiscountTier {
  minQuantity: number;
  rate: number;
}


export const DISCOUNT_TIERS: readonly DiscountTier[] = [
  { minQuantity: 16, rate: 0.3 },
  { minQuantity: 11, rate: 0.2 },
];

export function getDiscountRate(
  quantity: number,
  tiers: readonly DiscountTier[] = DISCOUNT_TIERS,
): number {
  return tiers.find((tier) => quantity >= tier.minQuantity)?.rate ?? 0;
}
