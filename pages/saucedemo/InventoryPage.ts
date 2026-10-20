/**
 * InventoryPage.ts — SauceDemo Inventory / Products Listing Page Object
 *
 * URL: /inventory.html
 * Handles: Product listing, sorting, adding/removing items from cart
 */

import { expect, type Locator, type Page } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly page:           Page;
  readonly pageTitle:      Locator;
  readonly sortDropdown:   Locator;
  readonly productCards:   Locator;
  readonly productNames:   Locator;
  readonly productPrices:  Locator;
  readonly cartBadge:      Locator;
  readonly cartLink:       Locator;
  readonly burgerMenu:     Locator;
  readonly logoutLink:     Locator;

  constructor(page: Page) {
    this.page          = page;
    this.pageTitle     = page.locator('[data-test="title"]');
    this.sortDropdown  = page.locator('[data-test="product-sort-container"]');
    this.productCards  = page.locator('.inventory_item');
    this.productNames  = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.cartBadge     = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink      = page.locator('[data-test="shopping-cart-link"]');
    this.burgerMenu    = page.locator('#react-burger-menu-btn');
    this.logoutLink    = page.locator('[data-test="logout-sidebar-link"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  /**
   * Sort products using the dropdown.
   * @param option - 'az' | 'za' | 'lohi' | 'hilo'
   */
  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Add a product to the cart by its data-test button attribute.
   * @param productDataTestId - e.g. 'add-to-cart-sauce-labs-backpack'
   */
  async addToCartById(productDataTestId: string): Promise<void> {
    await this.page.locator(`[data-test="${productDataTestId}"]`).click();
  }

  /**
   * Add the first N products to cart (by index 0-based).
   * Returns the names of added products for assertion.
   */
  async addFirstNProductsToCart(n: number): Promise<string[]> {
    const names: string[] = [];
    const count = await this.productCards.count();
    const limit = Math.min(n, count);
    for (let i = 0; i < limit; i++) {
      const card = this.productCards.nth(i);
      const name = await card.locator('[data-test="inventory-item-name"]').innerText();
      names.push(name.trim());
      await card.locator('button[data-test^="add-to-cart"]').click();
    }
    return names;
  }

  /** Get all visible product names as an array. */
  async getAllProductNames(): Promise<string[]> {
    const count = await this.productNames.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push((await this.productNames.nth(i).innerText()).trim());
    }
    return names;
  }

  /** Get all visible product prices as numeric values. */
  async getAllProductPrices(): Promise<number[]> {
    const count = await this.productPrices.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.productPrices.nth(i).innerText()).replace('$', '').trim();
      prices.push(parseFloat(text));
    }
    return prices;
  }

  /** Open burger menu and click logout. */
  async logout(): Promise<void> {
    await this.burgerMenu.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }

  async getCartCount(): Promise<number> {
    try {
      const text = await this.cartBadge.innerText();
      return parseInt(text, 10);
    } catch {
      return 0;
    }
  }
}
