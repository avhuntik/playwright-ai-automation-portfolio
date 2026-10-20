/**
 * test-data-loader.ts — Typed loader for JSON test-data files.
 *
 * Reads data files from the /data directory.
 * This allows data-driven tests without hardcoding values in spec files.
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(__dirname, '..', 'data');

export interface ParabankUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  ssn: string;
  description: string;
}

export interface SaucedemoUser {
  username: string;
  password: string;
  expectedBehaviour: string;
}

export interface TransferScenario {
  description: string;
  amount: string;
  note: string;
}

/**
 * Generic loader — reads and parses a JSON file from the /data directory.
 */
function loadDataFile<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`[DataLoader] Test data file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

/** Returns all ParaBank user records. */
export function loadParabankUsers(): ParabankUser[] {
  return loadDataFile<ParabankUser[]>('parabank-users.json');
}

/** Returns all SauceDemo user records. */
export function loadSaucedemoUsers(): SaucedemoUser[] {
  return loadDataFile<SaucedemoUser[]>('saucedemo-users.json');
}

/** Returns all fund-transfer test scenarios. */
export function loadTransferScenarios(): TransferScenario[] {
  return loadDataFile<TransferScenario[]>('transfer-scenarios.json');
}
