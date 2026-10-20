/**
 * e2e-banking.spec.ts — ParaBank End-to-End Banking Flow
 *
 * Full user journey for the EXISTING demo account (john/demo):
 *   Login → Accounts Overview → Open New Account → Transfer Funds → Pay a Bill → Logout
 *
 * This is the flagship banking E2E scenario demonstrating:
 *   - Deep domain knowledge of banking applications
 *   - Complex multi-step test orchestration
 *   - POM pattern with clean step decomposition
 *   - Allure reporting with rich metadata
 */

import { test, expect } from '../../../fixtures/parabank.fixture';
import { allure }       from 'allure-playwright';
import { uniqueSuffix } from '../../../utils/date-utils';

test.describe('ParaBank — Full Banking E2E Journey', () => {
  test(
    'Full banking flow: Login → View Accounts → Open Account → Transfer → Bill Pay → Logout',
    async ({
      loginPage,
      dashboardPage,
      accountsOverviewPage,
      openAccountPage,
      transferFundsPage,
      billPayPage
    }) => {
      await allure.epic('ParaBank Banking Application');
      await allure.feature('End-to-End Banking');
      await allure.story('Full Customer Banking Journey');
      await allure.severity('blocker');
      await allure.description(
        'This is the flagship end-to-end test that validates the complete banking workflow: ' +
        'login → view accounts overview and verify balance → open a new checking account → ' +
        'transfer funds between accounts → pay a bill to a new payee → logout. ' +
        'This test mirrors real-world regression scenarios for banking applications ' +
        '(as tested at Citibank and Blackstone projects).'
      );
      await allure.owner('Ayush Varshney');
      await allure.tags('E2E', 'Banking', 'Regression', 'Smoke');

      // ── Step 1: Login ─────────────────────────────────────────────────────
      await test.step('Step 1: Login to ParaBank', async () => {
        await loginPage.goto();
        await loginPage.loginWithDefaults();
        await dashboardPage.expectLoggedIn();
      });

      // ── Step 2: View Accounts ─────────────────────────────────────────────
      await test.step('Step 2: Navigate to Accounts Overview and verify accounts', async () => {
        await accountsOverviewPage.goto();
        await accountsOverviewPage.expectLoaded();
        const rowCount = await accountsOverviewPage.accountRows.count();
        expect(rowCount).toBeGreaterThan(0);
        await allure.attachment(
          'Account Count',
          String(rowCount),
          'text/plain'
        );
      });

      // ── Step 3: Open a New Checking Account ──────────────────────────────
      let newAccountNumber: string;
      await test.step('Step 3: Open a new Checking account', async () => {
        await openAccountPage.goto();
        newAccountNumber = await openAccountPage.openAccount('CHECKING');
        expect(newAccountNumber).toMatch(/\d+/);
        await allure.attachment('New Account Number', newAccountNumber, 'text/plain');
      });

      // ── Step 4: Transfer Funds ────────────────────────────────────────────
      await test.step('Step 4: Transfer $200 between accounts', async () => {
        await transferFundsPage.goto();
        await transferFundsPage.transfer('200');
        await expect(transferFundsPage.successTitle).toContainText(/Transfer Complete/i);
      });

      // ── Step 5: Pay a Bill ────────────────────────────────────────────────
      const payeeName = `AutoPayee_${uniqueSuffix()}`;
      await test.step(`Step 5: Pay a bill to payee ${payeeName}`, async () => {
        await billPayPage.goto();
        await billPayPage.payBill({
          name:    payeeName,
          address: '200 Banking Street',
          city:    'Gurugram',
          state:   'HR',
          zip:     '122001',
          phone:   '8285943261',
          account: '99887766',
          amount:  '150'
        });
        await expect(billPayPage.successTitle).toContainText(/Bill Payment Complete/i);
      });

      // ── Step 6: Logout ────────────────────────────────────────────────────
      await test.step('Step 6: Logout and verify redirect', async () => {
        await dashboardPage.logout();
        await expect(loginPage.loginButton).toBeVisible();
      });
    }
  );
});
