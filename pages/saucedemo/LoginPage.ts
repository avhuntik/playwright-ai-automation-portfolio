/**
 * LoginPage.ts — SauceDemo Login Page Object
 *
 * URL: https://www.saucedemo.com
 * Handles: Login form, error messages, locked-out user scenarios
 */

import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page:          Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton:   Locator;
  readonly errorMessage:  Locator;
  readonly errorIcon:     Locator;

  constructor(page: Page) {
    this.page          = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton   = page.locator('[data-test="login-button"]');
    this.errorMessage  = page.locator('[data-test="error"]');
    this.errorIcon     = page.locator('.error-button');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectErrorContaining(text: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(text);
  }
}
