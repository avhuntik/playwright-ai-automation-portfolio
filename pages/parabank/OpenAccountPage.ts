/**
 * OpenAccountPage.ts — ParaBank Open New Account Page Object
 *
 * URL: /parabank/openaccount.htm
 * Handles: Opening new Checking or Savings accounts
 */

import { expect, type Locator, type Page } from '@playwright/test';
import { ENV } from '../../utils/env';

export type AccountType = 'CHECKING' | 'SAVINGS';

export class OpenAccountPage {
  readonly page:              Page;
  readonly accountTypeSelect: Locator;
  readonly fromAccountSelect: Locator;
  readonly openAccountButton: Locator;
  readonly newAccountLink:    Locator;
  readonly successMessage:    Locator;
  readonly pageTitle:         Locator;

  constructor(page: Page) {
    this.page              = page;
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.openAccountButton = page.locator('input[value="Open New Account"]');
    this.newAccountLink    = page.locator('#newAccountId');
    this.successMessage    = page.locator('#openAccountResult h1.title');
    this.pageTitle         = page.locator('#openAccountForm h1.title');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${ENV.parabank.baseURL}/openaccount.htm`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Opens a new account of the given type using the first available funding account.
   * @param accountType - 'CHECKING' | 'SAVINGS'
   * @returns The newly created account number (as a string)
   */
  async openAccount(accountType: AccountType): Promise<string> {
    // Wait for AJAX options to load
    await this.fromAccountSelect.locator('option').first().waitFor({ state: 'attached', timeout: 15_000 });
    await this.accountTypeSelect.selectOption(accountType === 'CHECKING' ? '0' : '1');
    await this.openAccountButton.click();
    await expect(this.successMessage).toContainText(/Account Opened/i, { timeout: 15_000 });
    await this.newAccountLink.waitFor({ state: 'visible' });
    const newAccountNumber = await this.newAccountLink.innerText();
    return newAccountNumber.trim();
  }
}
