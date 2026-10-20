/**
 * parabank.fixture.ts — Playwright fixture providing all ParaBank page objects.
 *
 * Import { test, expect } from this fixture in ParaBank spec files.
 * Each page object is injected and ready to use without manual instantiation.
 */

import { test as base, expect } from '@playwright/test';
import { LoginPage }            from '../pages/parabank/LoginPage';
import { RegisterPage }         from '../pages/parabank/RegisterPage';
import { DashboardPage }        from '../pages/parabank/DashboardPage';
import { AccountsOverviewPage } from '../pages/parabank/AccountsOverviewPage';
import { OpenAccountPage }      from '../pages/parabank/OpenAccountPage';
import { TransferFundsPage }    from '../pages/parabank/TransferFundsPage';
import { BillPayPage }          from '../pages/parabank/BillPayPage';
import { FindTransactionPage }  from '../pages/parabank/FindTransactionPage';
import 'dotenv/config';

type ParabankFixtures = {
  loginPage:            LoginPage;
  registerPage:         RegisterPage;
  dashboardPage:        DashboardPage;
  accountsOverviewPage: AccountsOverviewPage;
  openAccountPage:      OpenAccountPage;
  transferFundsPage:    TransferFundsPage;
  billPayPage:          BillPayPage;
  findTransactionPage:  FindTransactionPage;
};

export const test = base.extend<ParabankFixtures>({
  loginPage:            async ({ page }, use) => await use(new LoginPage(page)),
  registerPage:         async ({ page }, use) => await use(new RegisterPage(page)),
  dashboardPage:        async ({ page }, use) => await use(new DashboardPage(page)),
  accountsOverviewPage: async ({ page }, use) => await use(new AccountsOverviewPage(page)),
  openAccountPage:      async ({ page }, use) => await use(new OpenAccountPage(page)),
  transferFundsPage:    async ({ page }, use) => await use(new TransferFundsPage(page)),
  billPayPage:          async ({ page }, use) => await use(new BillPayPage(page)),
  findTransactionPage:  async ({ page }, use) => await use(new FindTransactionPage(page))
});

export { expect };
