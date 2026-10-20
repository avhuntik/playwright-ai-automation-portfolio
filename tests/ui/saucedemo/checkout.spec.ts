/**
 * checkout.spec.ts — SauceDemo Checkout Flow Tests
 *
 * Covers: Checkout step 1 validation, step 2 order summary,
 *         empty first name / last name / zip validation errors.
 */

import { test, expect } from '../../../fixtures/saucedemo.fixture';
import { allure }       from 'allure-playwright';
import { ENV }          from '../../../utils/env';

test.describe('SauceDemo — Checkout Flow', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await allure.epic('SauceDemo E-Commerce');
    await allure.feature('Checkout');
    // Login and add an item before each test
    await loginPage.goto();
    await loginPage.login(ENV.saucedemo.standardUser, ENV.saucedemo.password);
    await inventoryPage.expectLoaded();
    await inventoryPage.addToCartById('add-to-cart-sauce-labs-backpack');
    await inventoryPage.cartLink.click();
  });

  test('Checkout Step 1 — missing first name shows error', async ({ cartPage, checkoutPage }) => {
    await allure.story('Form Validation');
    await allure.severity('normal');

    await test.step('Proceed to checkout step 1', async () => {
      await cartPage.proceedToCheckout();
    });

    await test.step('Submit without first name', async () => {
      await checkoutPage.lastNameInput.fill('Varshney');
      await checkoutPage.postalCodeInput.fill('110001');
      await checkoutPage.continueButton.click();
    });

    await test.step('Assert first name error', async () => {
      await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    });
  });

  test('Checkout Step 1 — missing zip code shows error', async ({ cartPage, checkoutPage }) => {
    await allure.story('Form Validation');
    await allure.severity('normal');

    await test.step('Proceed to checkout', async () => {
      await cartPage.proceedToCheckout();
    });

    await test.step('Submit without zip code', async () => {
      await checkoutPage.firstNameInput.fill('Ayush');
      await checkoutPage.lastNameInput.fill('Varshney');
      await checkoutPage.continueButton.click();
    });

    await test.step('Assert zip code error', async () => {
      await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
    });
  });

  test('Checkout Step 2 shows order summary with correct product', async ({ cartPage, checkoutPage }) => {
    await allure.story('Order Summary');
    await allure.severity('critical');

    await test.step('Complete step 1 with valid info', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.fillCustomerInfo({
        firstName: 'Ayush',
        lastName:  'Varshney',
        zip:       '110001'
      });
    });

    await test.step('Assert step 2 shows at least 1 summary item', async () => {
      const count = await checkoutPage.summaryItems.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Assert total price is greater than zero', async () => {
      const total = await checkoutPage.getOrderTotal();
      expect(total).toBeGreaterThan(0);
    });
  });
});
