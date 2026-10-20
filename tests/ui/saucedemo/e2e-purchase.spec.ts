/**
 * e2e-purchase.spec.ts — SauceDemo End-to-End Purchase Flow
 *
 * Full user journey:
 *   Login → Sort Products → Add to Cart → View Cart → Checkout → Order Confirmed
 *
 * This is the flagship E2E scenario showcasing the complete test coverage
 * and clean POM-based scripting for portfolio demonstration.
 */

import { test, expect } from '../../../fixtures/saucedemo.fixture';
import { allure }       from 'allure-playwright';
import { ENV }          from '../../../utils/env';

test.describe('SauceDemo — E2E Purchase Journey', () => {
  test(
    'Complete purchase flow: Login → Sort → Add to Cart → Checkout → Order Confirmed',
    async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
      await allure.epic('SauceDemo E-Commerce');
      await allure.feature('End-to-End Purchase');
      await allure.story('Full Purchase Journey');
      await allure.severity('blocker');
      await allure.description(
        'Full end-to-end test covering the complete customer purchase journey: ' +
        'login → sort products by price → add multiple items to cart → verify cart → ' +
        'complete checkout → confirm order. ' +
        'This test serves as the regression gate for the core purchase funnel.'
      );
      await allure.owner('Ayush Varshney');
      await allure.tags('E2E', 'Regression', 'Purchase');

      // ── Step 1: Login ──────────────────────────────────────────────────────
      await test.step('Step 1: Navigate to SauceDemo and login', async () => {
        await loginPage.goto();
        await loginPage.login(ENV.saucedemo.standardUser, ENV.saucedemo.password);
        await inventoryPage.expectLoaded();
      });

      // ── Step 2: Sort by Price Low → High ──────────────────────────────────
      await test.step('Step 2: Sort products by price (low to high)', async () => {
        await inventoryPage.sortBy('lohi');
        const prices = await inventoryPage.getAllProductPrices();
        // Verify sort applied correctly
        for (let i = 0; i < prices.length - 1; i++) {
          expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
        }
      });

      // ── Step 3: Add 2 items to cart ───────────────────────────────────────
      let addedNames: string[];
      await test.step('Step 3: Add first 2 products to cart', async () => {
        addedNames = await inventoryPage.addFirstNProductsToCart(2);
        await expect(inventoryPage.cartBadge).toHaveText('2');
      });

      // ── Step 4: View cart and verify items ────────────────────────────────
      await test.step('Step 4: Navigate to cart and verify items', async () => {
        await inventoryPage.cartLink.click();
        await cartPage.expectLoaded();
        const cartNames = await cartPage.getCartItemNames();
        expect(cartNames).toEqual(addedNames!);
      });

      // ── Step 5: Proceed to checkout ───────────────────────────────────────
      await test.step('Step 5: Proceed to checkout (Step 1 — Personal Info)', async () => {
        await cartPage.proceedToCheckout();
        await checkoutPage.fillCustomerInfo({
          firstName: 'Ayush',
          lastName:  'Varshney',
          zip:       '110001'
        });
      });

      // ── Step 6: Review order summary ──────────────────────────────────────
      await test.step('Step 6: Review order summary on Step 2', async () => {
        const itemCount = await checkoutPage.summaryItems.count();
        expect(itemCount).toBe(2);
        const total = await checkoutPage.getOrderTotal();
        expect(total).toBeGreaterThan(0);
      });

      // ── Step 7: Finish and confirm ────────────────────────────────────────
      await test.step('Step 7: Complete checkout and verify order confirmation', async () => {
        await checkoutPage.finishCheckout();
        await checkoutPage.expectOrderConfirmed();
      });
    }
  );

  test(
    'Performance glitch user can still complete purchase (slow login)',
    async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
      await allure.epic('SauceDemo E-Commerce');
      await allure.feature('End-to-End Purchase');
      await allure.story('Performance Glitch User Purchase');
      await allure.severity('normal');
      await allure.description(
        'Verifies the performance_glitch_user can complete a purchase despite delayed load times. ' +
        'Tests resilience of the framework under slow-page conditions.'
      );

      await test.step('Login as performance_glitch_user', async () => {
        await loginPage.goto();
        await loginPage.login(ENV.saucedemo.perfUser, ENV.saucedemo.password);
        await inventoryPage.expectLoaded();
      });

      await test.step('Add item and checkout', async () => {
        await inventoryPage.addToCartById('add-to-cart-sauce-labs-backpack');
        await inventoryPage.cartLink.click();
        await cartPage.proceedToCheckout();
        await checkoutPage.fillCustomerInfo({ firstName: 'QA', lastName: 'Tester', zip: '110001' });
        await checkoutPage.finishCheckout();
        await checkoutPage.expectOrderConfirmed();
      });
    }
  );
});
