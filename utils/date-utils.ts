/**
 * date-utils.ts — Reusable date/time helpers for test assertions.
 *
 * ParaBank transaction searches use date ranges; this utility
 * provides formatted strings without a heavy library dependency.
 */

/**
 * Returns today's date formatted as MM-DD-YYYY (ParaBank date picker format).
 */
export function todayMMDDYYYY(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
}

/**
 * Returns a date N days ago, formatted as MM-DD-YYYY.
 */
export function daysAgoMMDDYYYY(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
}

/**
 * Returns a random integer between min and max (inclusive).
 * Useful for generating transfer amounts in tests.
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a unique string suffix based on current timestamp.
 * Handy for creating unique payee names in Bill Pay tests.
 */
export function uniqueSuffix(): string {
  return Date.now().toString().slice(-6);
}
