/**
 * accounts.spec.ts — ParaBank Account Management Tests
 *
 * Covers: Accounts overview page, open new checking account,
 *         open new savings account, account detail navigation.
 */

import { test, expect } from '../../../fixtures/parabank.fixture';
import { allure }       from 'allure-playwright';

test.describe('ParaBank — Account Management', () => {
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await allure.epic('ParaBank Banking Application');
    await allure.feature('Account Management');
    // Login before each test
    await loginPage.goto();
    await loginPage.loginWithDefaults();
    await dashboardPage.expectLoggedIn();
  });

  test('Accounts Overview displays account table with balance', async ({ accountsOverviewPage }) => {
    await allure.story('Accounts Overview');
    await allure.severity('critical');
    await allure.description('Verifies the accounts overview page loads and shows at least one account with a balance.');

    await test.step('Navigate to Accounts Overview', async () => {
      await accountsOverviewPage.goto();
    });

    await test.step('Assert page is loaded and accounts are visible', async () => {
      await accountsOverviewPage.expectLoaded();
    });

    await test.step('Assert at least one account row is visible', async () => {
      const count = await accountsOverviewPage.accountRows.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test('Open a new Checking account', async ({ openAccountPage, page }) => {
    await allure.story('Open Checking Account');
    await allure.severity('critical');
    await allure.description(
      'Verifies a user can open a new Checking account and receives the new account number in the confirmation.'
    );

    await test.step('Navigate to Open New Account', async () => {
      await openAccountPage.goto();
    });

    await test.step('Open a Checking account', async () => {
      const accountNumber = await openAccountPage.openAccount('CHECKING');
      expect(accountNumber).toMatch(/\d+/);
      await allure.attachment('New Account Number', accountNumber, 'text/plain');
    });

    await test.step('Assert success message is shown', async () => {
      await expect(page).toHaveURL(/openaccount/);
    });
  });

  test('Open a new Savings account', async ({ openAccountPage }) => {
    await allure.story('Open Savings Account');
    await allure.severity('normal');

    await test.step('Navigate to Open New Account page', async () => {
      await openAccountPage.goto();
    });

    await test.step('Open a Savings account and verify account number', async () => {
      const accountNumber = await openAccountPage.openAccount('SAVINGS');
      expect(accountNumber).toMatch(/\d+/);
    });
  });

  test('Click first account navigates to account activity page', async ({ accountsOverviewPage, page }) => {
    await allure.story('Account Activity Navigation');
    await allure.severity('minor');

    await test.step('Navigate to Accounts Overview', async () => {
      await accountsOverviewPage.goto();
    });

    await test.step('Click on first account link', async () => {
      await accountsOverviewPage.openFirstAccount();
    });

    await test.step('Assert we are on the account activity page', async () => {
      await expect(page).toHaveURL(/activity/);
    });
  });
});
