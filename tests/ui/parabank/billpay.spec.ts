/**
 * billpay.spec.ts — ParaBank Bill Payment Tests
 *
 * Covers: Pay a bill to a new payee, validation of Bill Payment Complete page,
 *         payee form validation.
 */

import { test, expect }  from '../../../fixtures/parabank.fixture';
import { allure }        from 'allure-playwright';
import { uniqueSuffix }  from '../../../utils/date-utils';

test.describe('ParaBank — Bill Payment', () => {
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await allure.epic('ParaBank Banking Application');
    await allure.feature('Bill Payment');
    await loginPage.goto();
    await loginPage.loginWithDefaults();
    await dashboardPage.expectLoggedIn();
  });

  test('Pay a bill to a new payee shows Bill Payment Complete', async ({ billPayPage }) => {
    await allure.story('Bill Payment');
    await allure.severity('critical');
    await allure.description(
      'Verifies that a user can pay a bill to a new payee and receives ' +
      'the "Bill Payment Complete" confirmation.'
    );

    const payeeName = `AutoPayee_${uniqueSuffix()}`;
    await allure.parameter('Payee Name', payeeName);
    await allure.parameter('Amount', '250');

    await test.step('Navigate to Bill Pay page', async () => {
      await billPayPage.goto();
    });

    await test.step('Submit bill payment form', async () => {
      await billPayPage.payBill({
        name:    payeeName,
        address: '100 Payee Street',
        city:    'Noida',
        state:   'UP',
        zip:     '201301',
        phone:   '9876543210',
        account: '12345678',
        amount:  '250'
      });
    });

    await test.step('Assert Bill Payment Complete confirmation', async () => {
      await expect(billPayPage.successTitle).toContainText(/Bill Payment Complete/i);
    });
  });

  test('Bill Pay form is accessible with all required fields', async ({ billPayPage }) => {
    await allure.story('Bill Pay Page Validation');
    await allure.severity('normal');

    await test.step('Navigate to Bill Pay', async () => {
      await billPayPage.goto();
    });

    await test.step('Assert all form fields are present', async () => {
      await expect(billPayPage.payeeNameInput).toBeVisible();
      await expect(billPayPage.amountInput).toBeVisible();
      await expect(billPayPage.fromAccountSelect).toBeVisible();
      await expect(billPayPage.sendPaymentButton).toBeVisible();
    });
  });
});
