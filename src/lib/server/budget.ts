import type { BudgetCurrency, BudgetRange } from "@/types";

export interface MappedBudgetRange {
  budgetMin: number | null;
  budgetMax: number | null;
  budgetCurrency: BudgetCurrency | null;
}

const BUDGET_MAP: Record<
  BudgetCurrency,
  Record<Exclude<BudgetRange, "not_sure">, { min: number; max: number | null }>
> = {
  USD: {
    tier_1: { min: 0, max: 3000 },
    tier_2: { min: 3000, max: 10000 },
    tier_3: { min: 10000, max: 25000 },
    tier_4: { min: 25000, max: 50000 },
    tier_5: { min: 50000, max: null },
  },
  INR: {
    tier_1: { min: 0, max: 250000 },
    tier_2: { min: 250000, max: 800000 },
    tier_3: { min: 800000, max: 2000000 },
    tier_4: { min: 2000000, max: 4000000 },
    tier_5: { min: 4000000, max: null },
  },
};

export function mapBudgetTierToNumeric(
  currency: BudgetCurrency,
  tier: BudgetRange
): MappedBudgetRange {
  if (tier === "not_sure") {
    return {
      budgetMin: null,
      budgetMax: null,
      budgetCurrency: null,
    };
  }

  const mapped = BUDGET_MAP[currency][tier];
  return {
    budgetMin: mapped.min,
    budgetMax: mapped.max,
    budgetCurrency: currency,
  };
}

