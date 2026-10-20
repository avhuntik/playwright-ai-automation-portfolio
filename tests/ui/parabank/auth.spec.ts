/**
 * auth.spec.ts — ParaBank Authentication Tests
 *
 * Covers: Valid login, invalid login, logout, navigation to register page.
 */

import { test, expect } from '../../../fixtures/parabank.fixture';
import { allure }       from 'allure-playwright';
import { ENV }          from '../../../utils/env';

test.describe('ParaBank — Authentication', () => {
  test.beforeEach(async ({}) => {
    await allure.epic('ParaBank Banking Application');
    await allure.feature('Authentication');
  });

  test('Valid login with pre-loaded john/demo account', async ({ loginPage, dashboardPage }) => {
    await allure.story('Valid Login');
    await allure.severity('blocker');
    await allure.description(
      'Verifies that the demo user (john/demo) can successfully log into ParaBank ' +
      'and is directed to the accounts overview page.'
    );

    await test.step('Navigate to ParaBank login page', async () => {
      await loginPage.goto();
    });

    await test.step('Login with default credentials', async () => {
      await loginPage.loginWithDefaults();
    });

    await test.step('Assert user is logged in and dashboard is visible', async () => {
      await dashboardPage.expectLoggedIn();
    });
  });

  test('Invalid login shows error message', async ({ loginPage }) => {
    await allure.story('Invalid Login');
    await allure.severity('critical');
    await allure.description('Verifies that incorrect credentials display an error and prevent access.');

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Attempt login with invalid credentials', async () => {
      await loginPage.login('invalid_user_xyz', 'wrong_password_123');
    });

    await test.step('Assert error message is displayed', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  test('Logout redirects to login page', async ({ loginPage, dashboardPage }) => {
    await allure.story('Logout');
    await allure.severity('normal');

    await test.step('Login', async () => {
      await loginPage.goto();
      await loginPage.loginWithDefaults();
      await dashboardPage.expectLoggedIn();
    });

    await test.step('Logout', async () => {
      await dashboardPage.logout();
    });

    await test.step('Assert login page is shown', async () => {
      await expect(loginPage.loginButton).toBeVisible();
    });
  });

  test('Register link navigates to registration page', async ({ loginPage, page }) => {
    await allure.story('Registration Navigation');
    await allure.severity('minor');

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Click register link', async () => {
      await loginPage.clickRegister();
    });

    await test.step('Assert registration page is shown', async () => {
      await expect(page).toHaveURL(/register/);
    });
  });
});
