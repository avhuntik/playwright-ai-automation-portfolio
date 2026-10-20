/**
 * DashboardPage.ts — ParaBank Post-Login Dashboard Page Object
 *
 * URL: /parabank/overview.htm (redirected after login)
 * Handles: Verifying successful login state, navigation menu actions, logout
 */

import { expect, type Locator, type Page } from '@playwright/test';
import { ENV } from '../../utils/env';

export class DashboardPage {
  readonly page:           Page;
  readonly welcomeText:    Locator;
  readonly accountsLink:   Locator;
  readonly logoutLink:     Locator;
  readonly navMenu:        Locator;
  readonly accountsTable:  Locator;

  constructor(page: Page) {
    this.page          = page;
    this.welcomeText   = page.locator('#leftPanel .smallText, .title, h1.title, #welcomeNote');
    this.accountsLink  = page.locator('a[href*="overview"]');
    this.logoutLink    = page.locator('a[href*="logout"]');
    this.navMenu       = page.locator('#leftPanel ul.button');
    this.accountsTable = page.locator('#accountTable, table');
  }

  /** Assert the user is logged in and on the dashboard/overview page. */
  async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/overview/);
    await expect(this.logoutLink).toBeVisible();
  }

  /** Log out of ParaBank. */
  async logout(): Promise<void> {
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/index/);
  }

  /** Navigate to Accounts Overview. */
  async goToAccountsOverview(): Promise<void> {
    await this.page.goto(`${ENV.parabank.baseURL}/overview.htm`);
  }
}
