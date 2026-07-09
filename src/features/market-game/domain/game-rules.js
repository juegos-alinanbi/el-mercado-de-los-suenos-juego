export function findProductById(products, productId) {
  return products.find((product) => product.id === productId);
}

export function createEmptyCartQuantities(products) {
  return products.reduce((accumulator, product) => {
    accumulator[product.id] = 0;
    return accumulator;
  }, {});
}

export function sanitizeQuantity(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(9, Math.floor(value)));
}

export function calculateSubtotal(price, quantity) {
  return price * quantity;
}

export function calculateCartItems(products, cartQuantities) {
  return products
    .map((product) => {
      const quantity = sanitizeQuantity(cartQuantities[product.id] ?? 0);

      return {
        ...product,
        quantity,
        subtotal: calculateSubtotal(product.price, quantity),
      };
    })
    .filter((item) => item.quantity > 0);
}

export function calculateCartTotal(cartItems) {
  return cartItems.reduce((total, item) => total + item.subtotal, 0);
}

export function calculateRemainingBudget(budget, total) {
  return budget - total;
}

export function calculateChange(paidAmount, total) {
  return Math.max(0, paidAmount - total);
}

export function calculateMissingAmount(total, paidAmount) {
  return Math.max(0, total - paidAmount);
}

export function calculateShareResult(totalQuantity, groupSize) {
  if (!groupSize) {
    return { quotient: 0, remainder: totalQuantity };
  }

  return {
    quotient: Math.floor(totalQuantity / groupSize),
    remainder: totalQuantity % groupSize,
  };
}

export function calculateMinimumPaymentPieces(total, denominationValues, maxAmount) {
  if (total <= 0) {
    return 0;
  }

  const cap = Math.max(maxAmount ?? total, total);
  const minPiecesForAmount = new Array(cap + 1).fill(Infinity);
  minPiecesForAmount[0] = 0;

  for (let amount = 1; amount <= cap; amount++) {
    for (const value of denominationValues) {
      if (value <= amount && minPiecesForAmount[amount - value] + 1 < minPiecesForAmount[amount]) {
        minPiecesForAmount[amount] = minPiecesForAmount[amount - value] + 1;
      }
    }
  }

  let best = Infinity;
  for (let amount = total; amount <= cap; amount++) {
    if (minPiecesForAmount[amount] < best) {
      best = minPiecesForAmount[amount];
    }
  }

  return best === Infinity ? 0 : best;
}

export function isLevelUnlocked(levels, levelId, completedLevels) {
  const index = levels.findIndex((level) => level.id === levelId);

  if (index <= 0) {
    return true;
  }

  const previousLevel = levels[index - 1];
  return completedLevels.includes(previousLevel.id);
}
