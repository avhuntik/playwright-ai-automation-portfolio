import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

// ─── Base URLs ─────────────────────────────────────────────────────────────────
const parabankBaseURL = process.env.PARABANK_BASE_URL ?? 'https://parabank.parasoft.com/parabank';
const saucedemoBaseURL = process.env.SAUCEDEMO_BASE_URL ?? 'https://www.saucedemo.com';
const parabankApiBaseURL = process.env.PARABANK_API_BASE_URL ?? 'https://parabank.parasoft.com/parabank/services/bank';

export default defineConfig({
  testDir: './tests',

  // ─── Global Timeouts ─────────────────────────────────────────────────────────
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },

  // ─── Execution Settings ───────────────────────────────────────────────────────
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,

  // ─── Reporters ────────────────────────────────────────────────────────────────
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['blob'],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
      categories: [
        {
          name: 'Product Defects',
          messageRegex: '.*AssertionError.*',
          matchedStatuses: ['failed']
        },
        {
          name: 'Test Infrastructure Issues',
          messageRegex: '.*TimeoutError.*',
          matchedStatuses: ['broken']
        }
      ]
    }]
  ],

  // ─── Global Use Defaults ──────────────────────────────────────────────────────
  use: {
    actionTimeout: 15_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata'
  },

  // ─── Projects ─────────────────────────────────────────────────────────────────
  projects: [
    // ParaBank UI (Chromium only for portfolio)
    {
      name: 'chromium',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: parabankBaseURL,
        viewport: { width: 1440, height: 900 }
      }
    },

    // API project for ParaBank REST endpoints
    {
      name: 'api',
      testMatch: /.*\/api\/.*\.spec\.ts/,
      use: {
        baseURL: parabankApiBaseURL,
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    },

    // Stagehand AI-powered tests (chromium)
    {
      name: 'stagehand',
      testMatch: /.*\/stagehand\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: parabankBaseURL
      }
    }
  ],

  outputDir: 'test-results'
});
