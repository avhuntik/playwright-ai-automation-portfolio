/**
 * cart.spec.ts — SauceDemo Shopping Cart Tests
 *
 * Covers: Add single item, add multiple items, remove items,
 *         cart badge count, empty cart state.
 */

import { test, expect } from '../../../fixtures/saucedemo.fixture';
import { allure }       from 'allure-playwright';
import { ENV }          from '../../../utils/env';

test.describe('SauceDemo — Shopping Cart', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await allure.epic('SauceDemo E-Commerce');
    await allure.feature('Shopping Cart');
    await loginPage.goto();
    await loginPage.login(ENV.saucedemo.standardUser, ENV.saucedemo.password);
    await inventoryPage.expectLoaded();
  });

  test('Adding one item increments cart badge to 1', async ({ inventoryPage }) => {
    await allure.story('Add to Cart');
    await allure.severity('critical');

    await test.step('Add Sauce Labs Backpack to cart', async () => {
      await inventoryPage.addToCartById('add-to-cart-sauce-labs-backpack');
    });

    await test.step('Assert cart badge shows 1', async () => {
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });
  });

  test('Adding three items increments cart badge to 3', async ({ inventoryPage }) => {
    await allure.story('Add Multiple Items');
    await allure.severity('normal');

    await test.step('Add 3 products to cart', async () => {
      await inventoryPage.addFirstNProductsToCart(3);
    });

    await test.step('Assert cart badge shows 3', async () => {
      await expect(inventoryPage.cartBadge).toHaveText('3');
    });
  });

  test('Cart page shows correct item names after adding products', async ({ inventoryPage, cartPage }) => {
    await allure.story('Cart Item Validation');
    await allure.severity('normal');

    let addedNames: string[];

    await test.step('Add 2 products to cart', async () => {
      addedNames = await inventoryPage.addFirstNProductsToCart(2);
    });

    await test.step('Navigate to cart', async () => {
      await inventoryPage.cartLink.click();
      await cartPage.expectLoaded();
    });

    await test.step('Assert items match what was added', async () => {
      const cartNames = await cartPage.getCartItemNames();
      expect(cartNames).toEqual(addedNames!);
    });
  });

  test('Removing an item from cart decrements badge count', async ({ inventoryPage, cartPage }) => {
    await allure.story('Remove from Cart');
    await allure.severity('normal');

    await test.step('Add 2 products', async () => {
      await inventoryPage.addFirstNProductsToCart(2);
      await inventoryPage.cartLink.click();
    });

    await test.step('Remove first item', async () => {
      await cartPage.removeItemByIndex(0);
    });

    await test.step('Assert only 1 item remains', async () => {
      const count = await cartPage.getCartItemCount();
      expect(count).toBe(1);
    });
  });

  test('Removing all items clears the cart', async ({ inventoryPage, cartPage }) => {
    await allure.story('Empty Cart');
    await allure.severity('minor');

    await test.step('Add 1 product and navigate to cart', async () => {
      await inventoryPage.addFirstNProductsToCart(1);
      await inventoryPage.cartLink.click();
    });

    await test.step('Remove all items', async () => {
      await cartPage.removeAllItems();
    });

    await test.step('Assert cart badge is not visible', async () => {
      await expect(inventoryPage.cartBadge).not.toBeVisible();
    });
  });
});
