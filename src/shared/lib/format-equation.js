import { formatCurrency } from "@/shared/lib/format-currency";

export function formatSumEquation(values, total) {
  const terms = values.length > 0 ? values.map(formatCurrency).join(" + ") : formatCurrency(0);
  return `${terms} = ${formatCurrency(total)}`;
}

export function formatSubtractionEquation(minuend, subtrahend, result) {
  return `${formatCurrency(minuend)} - ${formatCurrency(subtrahend)} = ${formatCurrency(result)}`;
}

export function formatComparison(a, b) {
  const symbol = a > b ? ">" : a < b ? "<" : "=";
  return `${formatCurrency(a)} ${symbol} ${formatCurrency(b)}`;
}
