import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Standard Indian Rupee (INR ₹) Currency Formatter
 * Complies with RBI / en-IN numbering format with zero maximum fraction digits.
 */
export function formatINR(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

/**
 * Global alias for formatINR ensuring all currency rendering defaults to INR.
 */
export function formatCurrency(amount: number): string {
  return formatINR(amount);
}

/**
 * Intercepts user monetary input and strips all non-numeric characters (except decimals).
 * Prevents NaN insertion into the database when users enter currency symbols, commas, or spaces.
 */
export function parseCurrencyInput(value: unknown, fallback: number = 0): number {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  if (!str) return fallback;
  const cleaned = parseFloat(str.replace(/[^0-9.]/g, ""));
  return Number.isFinite(cleaned) ? cleaned : fallback;
}


