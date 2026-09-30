/**
 * Date Normalization Utilities
 *
 * Utilities for handling date conversions between MongoDB and application layer.
 * MongoDB stores dates as BSON Date objects, which need to be handled consistently.
 */

/**
 * Convert a value to Date, handling various input types
 * @param value - Date, string, or number
 * @returns Date object
 */
export function toDate(value: Date | string | number): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }
  throw new Error(`Cannot convert ${typeof value} to Date`);
}

/**
 * Check if a date is valid
 * @param date - Date to check
 * @returns True if date is valid
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Format date for display (Turkish locale)
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date and time for display (Turkish locale)
 * @param date - Date to format
 * @returns Formatted date-time string
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
