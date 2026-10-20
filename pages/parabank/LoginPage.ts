/**
 * LoginPage.ts — ParaBank Login Page Object
 *
 * URL: /parabank/index.htm
 * Handles: Login form submission, error message assertions, navigation to register
 */

import { type Locator, type Page } from '@playwright/test';
import { ENV } from '../../utils/env';

export class LoginPage {
  readonly page:           Page;
  readonly usernameInput:  Locator;
  readonly passwordInput:  Locator;
  readonly loginButton:    Locator;
  readonly errorMessage:   Locator;
  readonly registerLink:   Locator;
  readonly forgotLoginLink: Locator;

  constructor(page: Page) {
    this.page           = page;
    this.usernameInput  = page.locator('input[name="username"]');
    this.passwordInput  = page.locator('input[name="password"]');
    this.loginButton    = page.locator('input[value="Log In"]');
    this.errorMessage   = page.locator('.error');
    this.registerLink   = page.locator('a[href*="register"]').first();
    this.forgotLoginLink = page.locator('a[href*="lookup"]');
  }

  /** Navigate to the ParaBank home/login page. */
  async goto(): Promise<void> {
    await this.page.goto(`${ENV.parabank.baseURL}/index.htm`);
  }

  /**
   * Fill and submit the login form.
   * @param username - ParaBank username
   * @param password - ParaBank password
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Login with the default credentials from environment config. */
  async loginWithDefaults(): Promise<void> {
    await this.login(ENV.parabank.username, ENV.parabank.password);
  }

  /** Navigate to the Register page. */
  async clickRegister(): Promise<void> {
    await this.registerLink.click();
  }
}
