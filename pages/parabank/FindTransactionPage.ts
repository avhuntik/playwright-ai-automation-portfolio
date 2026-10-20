/**
 * FindTransactionPage.ts — ParaBank Find Transactions Page Object
 *
 * URL: /parabank/findtrans.htm
 * Handles: Transaction search by date range, amount, ID
 */

import { expect, type Locator, type Page } from '@playwright/test';
import { ENV } from '../../utils/env';

export class FindTransactionPage {
  readonly page:               Page;
  readonly accountSelect:      Locator;
  readonly searchByDateBtn:    Locator;
  readonly fromDateInput:      Locator;
  readonly toDateInput:        Locator;
  readonly searchByAmountBtn:  Locator;
  readonly amountInput:        Locator;
  readonly searchByIdBtn:      Locator;
  readonly transactionIdInput: Locator;
  readonly resultsTable:       Locator;
  readonly noResultsMsg:       Locator;

  constructor(page: Page) {
    this.page               = page;
    this.accountSelect      = page.locator('#accountId');
    this.fromDateInput      = page.locator('#fromDate');
    this.toDateInput        = page.locator('#toDate');
    this.searchByDateBtn    = page.locator('button[ng-click*="findByDate"]');
    this.amountInput        = page.locator('#amount');
    this.searchByAmountBtn  = page.locator('button[ng-click*="findByAmount"]');
    this.transactionIdInput = page.locator('#transactionId');
    this.searchByIdBtn      = page.locator('button[ng-click*="findById"]');
    this.resultsTable       = page.locator('#transactionTable');
    this.noResultsMsg       = page.locator('ng-include .error, .error, b');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${ENV.parabank.baseURL}/findtrans.htm`);
  }

  /**
   * Search transactions by date range.
   * @param fromDate - MM-DD-YYYY format
   * @param toDate   - MM-DD-YYYY format
   */
  async searchByDateRange(fromDate: string, toDate: string): Promise<void> {
    await this.fromDateInput.fill(fromDate);
    await this.toDateInput.fill(toDate);
    await this.searchByDateBtn.click();
  }

  /**
   * Search transactions by amount.
   */
  async searchByAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
    await this.searchByAmountBtn.click();
  }

  async expectResultsVisible(): Promise<void> {
    await expect(this.resultsTable).toBeVisible({ timeout: 10_000 });
  }
}
