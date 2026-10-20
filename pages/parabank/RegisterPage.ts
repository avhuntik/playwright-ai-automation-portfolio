/**
 * RegisterPage.ts — ParaBank Customer Registration Page Object
 *
 * URL: /parabank/register.htm
 * Handles: New user registration form, validation error messages
 */

import { type Locator, type Page } from '@playwright/test';
import { ENV } from '../../utils/env';

export interface RegistrationData {
  firstName: string;
  lastName:  string;
  address:   string;
  city:      string;
  state:     string;
  zip:       string;
  phone:     string;
  ssn:       string;
  username:  string;
  password:  string;
}

export class RegisterPage {
  readonly page:              Page;
  readonly firstNameInput:    Locator;
  readonly lastNameInput:     Locator;
  readonly addressInput:      Locator;
  readonly cityInput:         Locator;
  readonly stateInput:        Locator;
  readonly zipInput:          Locator;
  readonly phoneInput:        Locator;
  readonly ssnInput:          Locator;
  readonly usernameInput:     Locator;
  readonly passwordInput:     Locator;
  readonly confirmPassword:   Locator;
  readonly registerButton:    Locator;
  readonly welcomeMessage:    Locator;
  readonly usernameError:     Locator;

  constructor(page: Page) {
    this.page            = page;
    this.firstNameInput  = page.locator('#customer\\.firstName');
    this.lastNameInput   = page.locator('#customer\\.lastName');
    this.addressInput    = page.locator('#customer\\.address\\.street');
    this.cityInput       = page.locator('#customer\\.address\\.city');
    this.stateInput      = page.locator('#customer\\.address\\.state');
    this.zipInput        = page.locator('#customer\\.address\\.zipCode');
    this.phoneInput      = page.locator('#customer\\.phoneNumber');
    this.ssnInput        = page.locator('#customer\\.ssn');
    this.usernameInput   = page.locator('#customer\\.username');
    this.passwordInput   = page.locator('#customer\\.password');
    this.confirmPassword = page.locator('#repeatedPassword');
    this.registerButton  = page.locator('input[value="Register"]');
    this.welcomeMessage  = page.locator('#rightPanel h1, .title');
    this.usernameError   = page.locator('#customer\\.username\\.errors');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${ENV.parabank.baseURL}/register.htm`);
  }

  /** Fill and submit the complete registration form. */
  async register(data: RegistrationData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipInput.fill(data.zip);
    await this.phoneInput.fill(data.phone);
    await this.ssnInput.fill(data.ssn);
    await this.usernameInput.fill(data.username);
    await this.passwordInput.fill(data.password);
    await this.confirmPassword.fill(data.password);
    await this.registerButton.click();
  }
}
