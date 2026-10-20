/**
 * saucedemo.fixture.ts — Playwright fixture providing all SauceDemo page objects.
 *
 * Import { test, expect } from this fixture in SauceDemo spec files.
 */

import { test as base, expect } from '@playwright/test';
import { LoginPage }     from '../pages/saucedemo/LoginPage';
import { InventoryPage } from '../pages/saucedemo/InventoryPage';
import { ProductPage }   from '../pages/saucedemo/ProductPage';
import { CartPage }      from '../pages/saucedemo/CartPage';
import { CheckoutPage }  from '../pages/saucedemo/CheckoutPage';
import 'dotenv/config';

type SaucedemoFixtures = {
  loginPage:     LoginPage;
  inventoryPage: InventoryPage;
  productPage:   ProductPage;
  cartPage:      CartPage;
  checkoutPage:  CheckoutPage;
  /** Convenience: navigate to SauceDemo and login as standard_user. */
  loggedIn: void;
};

export const test = base.extend<SaucedemoFixtures>({
  loginPage:     async ({ page }, use) => await use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => await use(new InventoryPage(page)),
  productPage:   async ({ page }, use) => await use(new ProductPage(page)),
  cartPage:      async ({ page }, use) => await use(new CartPage(page)),
  checkoutPage:  async ({ page }, use) => await use(new CheckoutPage(page)),

  /** Sets up a pre-logged-in state for tests that need to skip the login step. */
  loggedIn: [
    async ({ page }, use) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        process.env.SAUCEDEMO_STANDARD_USER ?? 'standard_user',
        process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce'
      );
      await page.waitForURL(/inventory\.html/);
      await use();
    },
    { auto: false }
  ]
});

export { expect };
