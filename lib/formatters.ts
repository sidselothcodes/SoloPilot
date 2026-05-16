/**
 * Currency and percentage formatting utilities.
 * Centralized so the entire UI renders numbers consistently.
 */

// Formats a number as USD with no decimals (e.g. 90000 -> "$90,000").
export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

// Formats a decimal ratio as a percentage (e.g. 0.153 -> "15.3%").
export function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "0%";
  return `${(value * 100).toFixed(digits)}%`;
}

// Parses a raw input string into a number, stripping non-numeric chars.
export function parseNumberInput(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

// Sums the values in an expense breakdown.
export function sumExpenses(expenses: Record<string, number>): number {
  return Object.values(expenses).reduce(
    (acc, v) => acc + (Number.isFinite(v) ? v : 0),
    0,
  );
}
