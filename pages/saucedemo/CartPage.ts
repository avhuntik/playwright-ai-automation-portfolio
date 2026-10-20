/**
 * CartPage.ts — SauceDemo Shopping Cart Page Object
 *
 * URL: /cart.html
 * Handles: Viewing cart items, removing items, proceeding to checkout
 */

import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page:              Page;
  readonly pageTitle:         Locator;
  readonly cartItems:         Locator;
  readonly cartItemNames:     Locator;
  readonly cartItemPrices:    Locator;
  readonly checkoutButton:    Locator;
  readonly continueShoppingBtn: Locator;
  readonly removeButtons:     Locator;

  constructor(page: Page) {
    this.page               = page;
    this.pageTitle          = page.locator('[data-test="title"]');
    this.cartItems          = page.locator('.cart_item');
    this.cartItemNames      = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices     = page.locator('[data-test="inventory-item-price"]');
    this.checkoutButton     = page.locator('[data-test="checkout"]');
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
    this.removeButtons      = page.locator('[data-test^="remove"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/cart.html');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeItemByIndex(index = 0): Promise<void> {
    await this.removeButtons.nth(index).click();
  }

  async removeAllItems(): Promise<void> {
    const count = await this.removeButtons.count();
    for (let i = 0; i < count; i++) {
      // Always click the first button since list shrinks
      await this.removeButtons.first().click();
    }
    await expect(this.cartItems).toHaveCount(0);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  /** Returns the names of all items currently in the cart. */
  async getCartItemNames(): Promise<string[]> {
    const count = await this.cartItemNames.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push((await this.cartItemNames.nth(i).innerText()).trim());
    }
    return names;
  }
}
