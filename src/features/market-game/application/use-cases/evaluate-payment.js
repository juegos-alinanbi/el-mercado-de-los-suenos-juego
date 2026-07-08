import {
  calculateChange,
  calculateMissingAmount,
} from "@/features/market-game/domain/game-rules";

export function evaluatePayment(total, paidAmount) {
  const change = calculateChange(paidAmount, total);
  const missingAmount = calculateMissingAmount(total, paidAmount);
  const isEnough = total > 0 && paidAmount >= total;
  const isExact = total > 0 && paidAmount === total;

  let statusMessage = "Agrega dinero para pagar la compra.";

  if (total <= 0) {
    statusMessage = "Primero completa una compra válida en el mercado.";
  } else if (paidAmount === 0) {
    statusMessage = "Aún no has agregado dinero al pago.";
  } else if (isExact) {
    statusMessage = "Pago exacto. No necesitas cambio.";
  } else if (isEnough) {
    statusMessage = `Pago suficiente. Debes recibir $${change} de cambio.`;
  } else {
    statusMessage = `Todavía faltan $${missingAmount} para completar el pago.`;
  }

  return {
    total,
    paidAmount,
    change,
    missingAmount,
    isEnough,
    isExact,
    statusMessage,
  };
}
