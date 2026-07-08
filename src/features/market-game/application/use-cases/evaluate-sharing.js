import { calculateShareResult } from "@/features/market-game/domain/game-rules";

export function evaluateSharing(sharing, answer) {
  const { quotient, remainder } = calculateShareResult(sharing.totalQuantity, sharing.groupSize);

  return {
    quotient,
    remainder,
    answer,
    isCorrect: answer === quotient,
  };
}
