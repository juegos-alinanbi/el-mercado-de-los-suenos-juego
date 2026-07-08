import { calculateMissionExpectedTotal } from "@/features/market-game/application/use-cases/calculate-mission-expected-total";
import { calculateCartSummary } from "@/features/market-game/application/use-cases/calculate-cart-summary";
import { findProductById } from "@/features/market-game/domain/game-rules";

export function evaluateMissionSelection(mission, products, cartQuantities) {
  const cartSummary = calculateCartSummary(mission, products, cartQuantities);
  const objectiveChecks = mission.objectives.map((objective) => {
    const product = findProductById(products, objective.id);
    const selectedQuantity = cartQuantities[objective.id] ?? 0;
    const requiredQuantity = objective.quantity;
    const subtotal = product ? product.price * selectedQuantity : 0;

    return {
      id: objective.id,
      name: objective.name,
      price: product?.price ?? 0,
      requiredQuantity,
      selectedQuantity,
      subtotal,
      isMatched: selectedQuantity === requiredQuantity,
      isMissing: selectedQuantity < requiredQuantity,
      isOverSelected: selectedQuantity > requiredQuantity,
    };
  });

  const requiredIds = new Set(mission.objectives.map((objective) => objective.id));
  const extraSelections = cartSummary.cartItems.filter((item) => !requiredIds.has(item.id));
  const mismatchedObjectives = objectiveChecks.filter((item) => !item.isMatched);
  const exceedsBudget = cartSummary.total > mission.budget;
  const expectedTotal = calculateMissionExpectedTotal(mission, products);
  const isReadyForCheckout =
    cartSummary.hasSelections &&
    mismatchedObjectives.length === 0 &&
    extraSelections.length === 0 &&
    !exceedsBudget;

  let statusMessage = "Selecciona las cantidades exactas de la mision.";

  if (isReadyForCheckout) {
    statusMessage = "La compra esta correcta. Ya puedes ir a caja.";
  } else if (!cartSummary.hasSelections) {
    statusMessage = "Aun no has agregado productos al carrito.";
  } else if (exceedsBudget) {
    statusMessage = "Te pasaste del presupuesto. Ajusta tu carrito.";
  } else if (extraSelections.length > 0) {
    statusMessage = "Hay productos extra que no pertenecen a la mision.";
  } else if (mismatchedObjectives.some((item) => item.isOverSelected)) {
    statusMessage = "Revisa las cantidades. Tienes productos de mas.";
  } else if (mismatchedObjectives.some((item) => item.isMissing)) {
    statusMessage = "Todavia faltan cantidades para completar la mision.";
  }

  return {
    ...cartSummary,
    objectiveChecks,
    extraSelections,
    mismatchedObjectives,
    exceedsBudget,
    expectedTotal,
    isReadyForCheckout,
    statusMessage,
  };
}
