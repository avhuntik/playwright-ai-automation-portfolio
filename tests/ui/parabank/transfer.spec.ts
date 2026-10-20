/**
 * transfer.spec.ts — ParaBank Fund Transfer Tests
 *
 * Covers: Transfer funds between accounts, transfer confirmation,
 *         data-driven transfer with multiple amounts.
 */

import { test, expect }          from '../../../fixtures/parabank.fixture';
import { allure }                from 'allure-playwright';
import { loadTransferScenarios } from '../../../utils/test-data-loader';

test.describe('ParaBank — Fund Transfer', () => {
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await allure.epic('ParaBank Banking Application');
    await allure.feature('Fund Transfer');
    await loginPage.goto();
    await loginPage.loginWithDefaults();
    await dashboardPage.expectLoggedIn();
  });

  test('Transfer funds between accounts shows Transfer Complete', async ({ transferFundsPage }) => {
    await allure.story('Standard Transfer');
    await allure.severity('blocker');
    await allure.description(
      'Verifies that a user can transfer funds between two accounts and ' +
      'receives the "Transfer Complete" confirmation message.'
    );

    await test.step('Navigate to Transfer Funds page', async () => {
      await transferFundsPage.goto();
    });

    await test.step('Perform fund transfer of $100', async () => {
      await transferFundsPage.transfer('100');
    });

    await test.step('Verify Transfer Complete message is shown', async () => {
      await expect(transferFundsPage.successTitle).toContainText(/Transfer Complete/i);
    });
  });

  test('Transfer page is accessible and has required form elements', async ({ transferFundsPage, page }) => {
    await allure.story('Transfer Page Validation');
    await allure.severity('normal');

    await test.step('Navigate to Transfer Funds', async () => {
      await transferFundsPage.goto();
    });

    await test.step('Assert all required fields are present', async () => {
      await expect(transferFundsPage.amountInput).toBeVisible();
      await expect(transferFundsPage.fromAccountSelect).toBeVisible();
      await expect(transferFundsPage.toAccountSelect).toBeVisible();
      await expect(transferFundsPage.transferButton).toBeVisible();
    });
  });

  // ── Data-driven transfer test ─────────────────────────────────────────────
  const scenarios = loadTransferScenarios();

  for (const scenario of scenarios) {
    test(`Data-driven transfer: ${scenario.description}`, async ({ transferFundsPage }) => {
      await allure.story('Data-Driven Transfer');
      await allure.severity('normal');
      await allure.description(`${scenario.note} — Amount: $${scenario.amount}`);
      await allure.parameter('Amount', scenario.amount);
      await allure.parameter('Description', scenario.description);

      await test.step(`Navigate to Transfer Funds`, async () => {
        await transferFundsPage.goto();
      });

      await test.step(`Transfer $${scenario.amount}`, async () => {
        await transferFundsPage.transfer(scenario.amount);
      });

      await test.step('Assert transfer success', async () => {
        await expect(transferFundsPage.successTitle).toContainText(/Transfer Complete/i);
      });
    });
  }
});
