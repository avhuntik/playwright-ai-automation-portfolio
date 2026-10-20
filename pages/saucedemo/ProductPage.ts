/**
 * ProductPage.ts — SauceDemo Product Detail Page Object
 *
 * URL: /inventory-item.html?id=N
 * Handles: Product details, add to cart from product page
 */

import { expect, type Locator, type Page } from '@playwright/test';

export class ProductPage {
  readonly page:            Page;
  readonly productName:     Locator;
  readonly productDesc:     Locator;
  readonly productPrice:    Locator;
  readonly addToCartButton: Locator;
  readonly removeButton:    Locator;
  readonly backButton:      Locator;
  readonly cartBadge:       Locator;

  constructor(page: Page) {
    this.page            = page;
    this.productName     = page.locator('[data-test="inventory-item-name"]');
    this.productDesc     = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice    = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton    = page.locator('[data-test^="remove"]');
    this.backButton      = page.locator('[data-test="back-to-products"]');
    this.cartBadge       = page.locator('[data-test="shopping-cart-badge"]');
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await expect(this.removeButton).toBeVisible();
  }

  async getProductPrice(): Promise<number> {
    const text = await this.productPrice.innerText();
    return parseFloat(text.replace('$', '').trim());
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
    await expect(this.page).toHaveURL(/inventory\.html/);
  }
}
