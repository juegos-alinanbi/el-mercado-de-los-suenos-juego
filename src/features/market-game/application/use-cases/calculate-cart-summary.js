import {
  calculateCartItems,
  calculateCartTotal,
  calculateRemainingBudget,
} from "@/features/market-game/domain/game-rules";

export function calculateCartSummary(mission, products, cartQuantities) {
  const cartItems = calculateCartItems(products, cartQuantities);
  const total = calculateCartTotal(cartItems);
  const remainingBudget = calculateRemainingBudget(mission.budget, total);

  return {
    cartItems,
    total,
    remainingBudget,
    hasSelections: cartItems.length > 0,
  };
}
