/**
 * CheckoutPage.ts — SauceDemo Checkout Flow Page Object
 *
 * Covers three checkout steps:
 *   Step 1: /checkout-step-one.html  — Personal info form
 *   Step 2: /checkout-step-two.html  — Order summary
 *   Complete: /checkout-complete.html — Confirmation
 */

import { expect, type Locator, type Page } from '@playwright/test';

export interface CustomerInfo {
  firstName: string;
  lastName:  string;
  zip:       string;
}

export class CheckoutPage {
  readonly page:             Page;
  // Step 1
  readonly firstNameInput:   Locator;
  readonly lastNameInput:    Locator;
  readonly postalCodeInput:  Locator;
  readonly continueButton:   Locator;
  readonly cancelButton:     Locator;
  readonly errorMessage:     Locator;
  // Step 2
  readonly finishButton:     Locator;
  readonly itemTotal:        Locator;
  readonly tax:              Locator;
  readonly totalPrice:       Locator;
  readonly summaryItems:     Locator;
  // Complete
  readonly successHeader:    Locator;
  readonly backHomeButton:   Locator;

  constructor(page: Page) {
    this.page            = page;
    // Step 1
    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton  = page.locator('[data-test="continue"]');
    this.cancelButton    = page.locator('[data-test="cancel"]');
    this.errorMessage    = page.locator('[data-test="error"]');
    // Step 2
    this.finishButton    = page.locator('[data-test="finish"]');
    this.itemTotal       = page.locator('[data-test="subtotal-label"]');
    this.tax             = page.locator('[data-test="tax-label"]');
    this.totalPrice      = page.locator('[data-test="total-label"]');
    this.summaryItems    = page.locator('.cart_item');
    // Complete
    this.successHeader   = page.locator('[data-test="complete-header"]');
    this.backHomeButton  = page.locator('[data-test="back-to-products"]');
  }

  /** Fill customer information (Step 1) and continue to Step 2. */
  async fillCustomerInfo(info: CustomerInfo): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one/);
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.zip);
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  /** Complete checkout from Step 2. */
  async finishCheckout(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two/);
    await this.finishButton.click();
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  /** Assert the order confirmation message. */
  async expectOrderConfirmed(): Promise<void> {
    await expect(this.successHeader).toHaveText('Thank you for your order!');
  }

  /** Get order total as a number (from Step 2). */
  async getOrderTotal(): Promise<number> {
    const text = await this.totalPrice.innerText();
    const match = text.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }
}
