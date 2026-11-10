import { describe, it, expect } from "vitest";
import { mapBudgetTierToNumeric } from "../budget";

describe("mapBudgetTierToNumeric", () => {
  it("maps USD tiers cleanly", () => {
    expect(mapBudgetTierToNumeric("USD", "tier_2")).toEqual({
      budgetMin: 3000,
      budgetMax: 10000,
      budgetCurrency: "USD",
    });
  });

  it("maps INR open-ended top tier with null max", () => {
    expect(mapBudgetTierToNumeric("INR", "tier_5")).toEqual({
      budgetMin: 4000000,
      budgetMax: null,
      budgetCurrency: "INR",
    });
  });

  it("returns null values when budget is undetermined", () => {
    expect(mapBudgetTierToNumeric("USD", "not_sure")).toEqual({
      budgetMin: null,
      budgetMax: null,
      budgetCurrency: null,
    });
  });
});

