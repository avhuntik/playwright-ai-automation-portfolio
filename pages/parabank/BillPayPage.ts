/**
 * BillPayPage.ts — ParaBank Bill Payment Page Object
 *
 * URL: /parabank/billpay.htm
 * Handles: Bill payment form, payee creation, payment submission
 */

import { expect, type Locator, type Page } from '@playwright/test';
import { ENV } from '../../utils/env';

export interface PayeeDetails {
  name:      string;
  address:   string;
  city:      string;
  state:     string;
  zip:       string;
  phone:     string;
  account:   string; // payee account number
  amount:    string; // payment amount
}

export class BillPayPage {
  readonly page:               Page;
  // Payee fields
  readonly payeeNameInput:     Locator;
  readonly payeeAddressInput:  Locator;
  readonly payeeCityInput:     Locator;
  readonly payeeStateInput:    Locator;
  readonly payeeZipInput:      Locator;
  readonly payeePhoneInput:    Locator;
  readonly payeeAccountInput:  Locator;
  readonly verifyAccountInput: Locator;
  // Payment fields
  readonly amountInput:        Locator;
  readonly fromAccountSelect:  Locator;
  readonly sendPaymentButton:  Locator;
  // Confirmation
  readonly successTitle:       Locator;
  readonly successPayeeName:   Locator;

  constructor(page: Page) {
    this.page               = page;
    this.payeeNameInput     = page.locator('input[name="payee.name"]');
    this.payeeAddressInput  = page.locator('input[name="payee.address.street"]');
    this.payeeCityInput     = page.locator('input[name="payee.address.city"]');
    this.payeeStateInput    = page.locator('input[name="payee.address.state"]');
    this.payeeZipInput      = page.locator('input[name="payee.address.zipCode"]');
    this.payeePhoneInput    = page.locator('input[name="payee.phoneNumber"]');
    this.payeeAccountInput  = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput        = page.locator('input[name="amount"]');
    this.fromAccountSelect  = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton  = page.locator('#billpayForm input[type="button"]');
    this.successTitle       = page.locator('#billpayResult h1.title');
    this.successPayeeName   = page.locator('#payeeName');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${ENV.parabank.baseURL}/billpay.htm`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fills and submits the bill payment form.
   */
  async payBill(payee: PayeeDetails): Promise<void> {
    // Wait for from-account options to load
    await this.fromAccountSelect.locator('option').first().waitFor({ state: 'attached', timeout: 15_000 });

    await this.payeeNameInput.fill(payee.name);
    await this.payeeAddressInput.fill(payee.address);
    await this.payeeCityInput.fill(payee.city);
    await this.payeeStateInput.fill(payee.state);
    await this.payeeZipInput.fill(payee.zip);
    await this.payeePhoneInput.fill(payee.phone);
    await this.payeeAccountInput.fill(payee.account);
    await this.verifyAccountInput.fill(payee.account);
    await this.amountInput.fill(payee.amount);
    await this.fromAccountSelect.selectOption({ index: 0 });
    await this.sendPaymentButton.click();
    await expect(this.successTitle).toContainText(/Bill Payment Complete/i, { timeout: 15_000 });
  }
}
