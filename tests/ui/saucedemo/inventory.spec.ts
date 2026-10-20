/**
 * inventory.spec.ts — SauceDemo Product Listing & Sorting Tests
 *
 * Covers: Product sorting (A-Z, Z-A, Price Low-High, Price High-Low),
 *         product count validation, product name/price display.
 */

import { test, expect } from '../../../fixtures/saucedemo.fixture';
import { allure }       from 'allure-playwright';
import { ENV }          from '../../../utils/env';

test.describe('SauceDemo — Inventory & Product Sorting', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await allure.epic('SauceDemo E-Commerce');
    await allure.feature('Product Catalogue');
    await loginPage.goto();
    await loginPage.login(ENV.saucedemo.standardUser, ENV.saucedemo.password);
    await inventoryPage.expectLoaded();
  });

  test('Products page displays all 6 items', async ({ inventoryPage }) => {
    await allure.story('Product Listing');
    await allure.severity('critical');
    await allure.description('Confirms all 6 SauceDemo products are visible on the inventory page.');

    await test.step('Count product cards', async () => {
      await expect(inventoryPage.productCards).toHaveCount(6);
    });
  });

  test('Sort products A → Z is alphabetically correct', async ({ inventoryPage }) => {
    await allure.story('Product Sorting');
    await allure.severity('normal');
    await allure.description('Applies A-Z sort and verifies the product names are in ascending alphabetical order.');

    await test.step('Apply A-Z sort', async () => {
      await inventoryPage.sortBy('az');
    });

    await test.step('Verify alphabetical order', async () => {
      const names = await inventoryPage.getAllProductNames();
      const sorted = [...names].sort();
      expect(names).toEqual(sorted);
    });
  });

  test('Sort products Z → A reverses alphabetical order', async ({ inventoryPage }) => {
    await allure.story('Product Sorting');
    await allure.severity('normal');

    await test.step('Apply Z-A sort', async () => {
      await inventoryPage.sortBy('za');
    });

    await test.step('Verify reverse alphabetical order', async () => {
      const names = await inventoryPage.getAllProductNames();
      const sorted = [...names].sort().reverse();
      expect(names).toEqual(sorted);
    });
  });

  test('Sort by Price Low → High is numerically correct', async ({ inventoryPage }) => {
    await allure.story('Product Sorting');
    await allure.severity('normal');
    await allure.description('Applies price ascending sort and validates prices are in ascending numeric order.');

    await test.step('Apply price low-to-high sort', async () => {
      await inventoryPage.sortBy('lohi');
    });

    await test.step('Verify prices are ascending', async () => {
      const prices = await inventoryPage.getAllProductPrices();
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
      }
    });
  });

  test('Sort by Price High → Low is numerically correct', async ({ inventoryPage }) => {
    await allure.story('Product Sorting');
    await allure.severity('normal');

    await test.step('Apply price high-to-low sort', async () => {
      await inventoryPage.sortBy('hilo');
    });

    await test.step('Verify prices are descending', async () => {
      const prices = await inventoryPage.getAllProductPrices();
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
      }
    });
  });

  test('Clicking a product opens its detail page', async ({ page, inventoryPage }) => {
    await allure.story('Product Navigation');
    await allure.severity('minor');

    await test.step('Click first product name', async () => {
      await inventoryPage.productNames.first().click();
    });

    await test.step('Assert product detail page is displayed', async () => {
      await expect(page).toHaveURL(/inventory-item\.html/);
    });
  });
});
