/**
 * env.ts — Typed, validated environment variable helpers.
 * Throws early with a clear message if a required variable is missing.
 */

/**
 * Returns the value of an environment variable, or a fallback.
 * Throws if neither is available.
 */
export function requiredEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(
      `[ENV] Missing required environment variable: "${name}". ` +
      `Copy .env.example to .env and set this value.`
    );
  }
  return value;
}

/**
 * Reads an optional env var, returning undefined if absent.
 */
export function optionalEnv(name: string, fallback?: string): string | undefined {
  return process.env[name] ?? fallback;
}

// ─── Pre-resolved config object used across tests ─────────────────────────────
export const ENV = {
  parabank: {
    baseURL:  process.env.PARABANK_BASE_URL    ?? 'https://parabank.parasoft.com/parabank',
    apiURL:   process.env.PARABANK_API_BASE_URL ?? 'https://parabank.parasoft.com/parabank/services/bank',
    username: process.env.PARABANK_USERNAME     ?? 'john',
    password: process.env.PARABANK_PASSWORD     ?? 'demo'
  },
  saucedemo: {
    baseURL:       process.env.SAUCEDEMO_BASE_URL       ?? 'https://www.saucedemo.com',
    standardUser:  process.env.SAUCEDEMO_STANDARD_USER  ?? 'standard_user',
    lockedUser:    process.env.SAUCEDEMO_LOCKED_USER     ?? 'locked_out_user',
    perfUser:      process.env.SAUCEDEMO_PERF_USER       ?? 'performance_glitch_user',
    password:      process.env.SAUCEDEMO_PASSWORD        ?? 'secret_sauce'
  },
  geminiApiKey: process.env.GEMINI_API_KEY ?? ''
} as const;
