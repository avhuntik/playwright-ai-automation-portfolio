/**
 * base.fixture.ts — Extended base test with shared utilities.
 *
 * All test files should import { test, expect } from this fixture
 * (or from the app-specific fixture) rather than from @playwright/test directly.
 */

import { test as base, expect } from '@playwright/test';
import 'dotenv/config';

export type BaseFixtures = {
  /** Navigates to a URL and waits for network idle. Good for SPAs. */
  gotoWithIdle: (url: string) => Promise<void>;
};

export const test = base.extend<BaseFixtures>({
  gotoWithIdle: async ({ page }, use) => {
    await use(async (url: string) => {
      await page.goto(url, { waitUntil: 'networkidle' });
    });
  }
});

export { expect };
