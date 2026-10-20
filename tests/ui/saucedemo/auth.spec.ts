/**
 * auth.spec.ts — SauceDemo Authentication Tests
 *
 * Covers: Login (valid/invalid/locked), logout flow.
 * Uses Allure labels for rich reporting.
 */

import { test, expect } from '../../../fixtures/saucedemo.fixture';
import { allure }       from 'allure-playwright';
import { ENV }          from '../../../utils/env';

test.describe('SauceDemo — Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('SauceDemo E-Commerce');
    await allure.feature('Authentication');
    await loginPage.goto();
  });

  test('Login with valid standard_user credentials', async ({ loginPage, inventoryPage }) => {
    await allure.story('Valid Login');
    await allure.severity('critical');
    await allure.description('Verifies that a standard user can login and land on the inventory page.');

    await test.step('Enter credentials and submit', async () => {
      await loginPage.login(ENV.saucedemo.standardUser, ENV.saucedemo.password);
    });

    await test.step('Assert inventory page is displayed', async () => {
      await inventoryPage.expectLoaded();
    });
  });

  test('Login with locked_out_user shows error', async ({ loginPage }) => {
    await allure.story('Locked User Login');
    await allure.severity('normal');
    await allure.description('Verifies that a locked-out user cannot login and sees an appropriate error.');

    await test.step('Enter locked user credentials', async () => {
      await loginPage.login(ENV.saucedemo.lockedUser, ENV.saucedemo.password);
    });

    await test.step('Assert error message is shown', async () => {
      await loginPage.expectErrorContaining('Sorry, this user has been locked out');
    });
  });

  test('Login with empty credentials shows validation error', async ({ loginPage }) => {
    await allure.story('Empty Credentials Validation');
    await allure.severity('minor');

    await test.step('Submit form without credentials', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Assert username required error', async () => {
      await loginPage.expectErrorContaining('Username is required');
    });
  });

  test('Login with wrong password shows error', async ({ loginPage }) => {
    await allure.story('Wrong Password');
    await allure.severity('normal');

    await test.step('Submit with wrong password', async () => {
      await loginPage.login(ENV.saucedemo.standardUser, 'wrong_password');
    });

    await test.step('Assert credentials error message', async () => {
      await loginPage.expectErrorContaining('Username and password do not match');
    });
  });

  test('Logout from inventory page redirects to login', async ({ loginPage, inventoryPage }) => {
    await allure.story('Logout');
    await allure.severity('normal');

    await test.step('Login as standard_user', async () => {
      await loginPage.login(ENV.saucedemo.standardUser, ENV.saucedemo.password);
      await inventoryPage.expectLoaded();
    });

    await test.step('Logout using burger menu', async () => {
      await inventoryPage.logout();
    });

    await test.step('Assert redirected to login page', async () => {
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.page).toHaveURL(/saucedemo\.com\/?$/);
    });
  });
});
