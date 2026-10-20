/**
 * TransferFundsPage.ts — ParaBank Transfer Funds Page Object
 *
 * URL: /parabank/transfer.htm
 * Handles: Fund transfers between accounts, transfer confirmation
 */

import { expect, type Locator, type Page } from '@playwright/test';
import { ENV } from '../../utils/env';

export class TransferFundsPage {
  readonly page:              Page;
  readonly amountInput:       Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect:   Locator;
  readonly transferButton:    Locator;
  readonly successTitle:      Locator;
  readonly successAmount:     Locator;
  readonly pageTitle:         Locator;

  constructor(page: Page) {
    this.page              = page;
    this.amountInput       = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect   = page.locator('#toAccountId');
    this.transferButton    = page.locator('#transferForm input[type="submit"]');
    this.successTitle      = page.locator('#showResult h1.title');
    this.successAmount     = page.locator('#amountResult');
    this.pageTitle         = page.locator('#showForm h1.title');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${ENV.parabank.baseURL}/transfer.htm`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Performs a fund transfer.
   * @param amount - Amount to transfer (string, e.g. "500")
   * @param fromIndex - Index of the source account in the dropdown (default: 0)
   * @param toIndex   - Index of the target account in the dropdown (default: 1)
   */
  async transfer(amount: string, fromIndex = 0, toIndex = 1): Promise<void> {
    // Wait for AJAX options to load
    await this.fromAccountSelect.locator('option').first().waitFor({ state: 'attached', timeout: 15_000 });
    await this.toAccountSelect.locator('option').first().waitFor({ state: 'attached', timeout: 15_000 });

    const fromOptions = await this.fromAccountSelect.locator('option').count();
    const toOptions   = await this.toAccountSelect.locator('option').count();

    if (fromOptions < 1 || toOptions < 1) {
      throw new Error('[TransferFundsPage] Not enough accounts available for transfer.');
    }

    const safeFromIndex = Math.min(fromIndex, fromOptions - 1);
    const safeToIndex   = Math.min(toIndex, toOptions - 1);

    await this.fromAccountSelect.selectOption({ index: safeFromIndex });
    await this.toAccountSelect.selectOption({ index: safeToIndex === safeFromIndex && toOptions > 1 ? 1 : safeToIndex });

    await this.amountInput.fill(amount);
    await this.transferButton.click();
    await expect(this.successTitle).toContainText(/Transfer Complete/i, { timeout: 15_000 });
  }
}
