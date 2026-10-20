/**
 * AccountsOverviewPage.ts — ParaBank Accounts Overview Page Object
 *
 * URL: /parabank/overview.htm
 * Handles: Reading account balances, verifying total balance, account links
 */

import { expect, type Locator, type Page } from '@playwright/test';
import { ENV } from '../../utils/env';

export class AccountsOverviewPage {
  readonly page:          Page;
  readonly pageTitle:     Locator;
  readonly accountRows:   Locator;
  readonly totalBalance:  Locator;
  readonly firstAccount:  Locator;

  constructor(page: Page) {
    this.page         = page;
    this.pageTitle    = page.locator('#showOverview h1.title');
    this.accountRows  = page.locator('#accountTable tbody tr a');
    this.totalBalance = page.locator('#accountTable tbody tr:last-child td:nth-child(2)');
    this.firstAccount = page.locator('#accountTable tbody tr a').first();
  }

  async goto(): Promise<void> {
    await this.page.goto(`${ENV.parabank.baseURL}/overview.htm`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Assert the accounts overview page has loaded with at least one account. */
  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toContainText(/Accounts Overview/i);
    await expect(this.firstAccount).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Returns the account number from the first row of the accounts table.
   * Used by transfer and bill pay tests to dynamically select account IDs.
   */
  async getFirstAccountNumber(): Promise<string> {
    await this.firstAccount.waitFor({ state: 'visible' });
    const text = await this.firstAccount.innerText();
    return text.trim();
  }

  /**
   * Returns the first account's ID from the href link.
   * ParaBank account links look like: /activity.htm?id=12345
   */
  async getFirstAccountId(): Promise<string> {
    await this.firstAccount.waitFor({ state: 'visible' });
    const href = await this.firstAccount.getAttribute('href') ?? '';
    const match = href.match(/id=(\d+)/);
    if (!match) throw new Error('[AccountsOverviewPage] Could not parse account ID from href');
    return match[1];
  }

  /** Click the first account to go to its activity page. */
  async openFirstAccount(): Promise<void> {
    await this.firstAccount.click();
    await expect(this.page).toHaveURL(/activity/);
  }
}
