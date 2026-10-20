/**
 * ai-banking-flow.spec.ts — Stagehand AI-Powered ParaBank Tests
 *
 * Uses Stagehand + Google Gemini AI to navigate ParaBank with natural language.
 * Demonstrates AI-assisted banking domain automation — a key differentiator
 * combining Ayush's banking domain expertise with AI testing skills.
 */

import { test, expect }    from '@playwright/test';
import { allure }          from 'allure-playwright';
import { createStagehand } from '../../utils/stagehand';
import { ENV }             from '../../utils/env';
import { z }               from 'zod';

test.describe('ParaBank — AI-Powered Stagehand Flows', () => {
  test.beforeEach(async () => {
    await allure.epic('AI-Assisted Automation');
    await allure.feature('Stagehand — ParaBank Banking');
  });

  test(
    'AI logs into ParaBank and extracts account balance summary',
    async ({ page }) => {
      await allure.story('AI Banking Login & Balance Extraction');
      await allure.severity('normal');
      await allure.description(
        'Uses Stagehand AI to navigate ParaBank, perform login via natural language, ' +
        'and extract the customer account balance summary. ' +
        'Demonstrates AI-assisted data extraction from banking UI — ' +
        'a key skill combination of banking domain + AI automation.'
      );
      test.slow();

      const sh = await createStagehand(page);

      try {
        await test.step('Navigate to ParaBank', async () => {
          await page.goto(`${ENV.parabank.baseURL}/index.htm`, { waitUntil: 'networkidle' });
        });

        await test.step('AI: Login using natural language instructions', async () => {
          await sh.act(`Enter "${ENV.parabank.username}" in the Customer Login username field`);
          await sh.act(`Enter "${ENV.parabank.password}" in the Customer Login password field`);
          await sh.act('Click the Log In button in the Customer Login panel');
        });

        await test.step('Assert login successful', async () => {
          await expect(page).toHaveURL(/overview/);
        });

        await test.step('AI: Extract account summary from overview page', async () => {
          const summary = await sh.extract(
            'Extract the list of bank accounts visible in the accounts table. ' +
            'For each account, return its account number and current balance.',
            z.object({
              accounts: z.array(z.object({
                accountNumber: z.string(),
                balance:       z.string()
              }))
            })
          );
          expect(summary.accounts.length).toBeGreaterThan(0);
          await allure.attachment(
            'AI Extracted Account Summary',
            JSON.stringify(summary.accounts, null, 2),
            'application/json'
          );
        });

      } finally {
        await sh.close();
      }
    }
  );

  test(
    'AI navigates to Transfer Funds using natural language',
    async ({ page }) => {
      await allure.story('AI Navigation — Transfer Funds');
      await allure.severity('minor');
      await allure.description(
        'Demonstrates Stagehand AI navigating to the Transfer Funds section ' +
        'using natural language without hardcoded selectors. ' +
        'Playwright then verifies the page URL.'
      );
      test.slow();

      const sh = await createStagehand(page);

      try {
        // Login using Playwright (faster, deterministic)
        await test.step('Login via Playwright', async () => {
          await page.goto(`${ENV.parabank.baseURL}/index.htm`);
          await page.locator('input[name="username"]').fill(ENV.parabank.username);
          await page.locator('input[name="password"]').fill(ENV.parabank.password);
          await page.locator('input[value="Log In"]').click();
          await expect(page).toHaveURL(/overview/);
        });

        // Navigate using Stagehand AI
        await test.step('AI: Click on Transfer Funds in the navigation menu', async () => {
          await sh.act('Click on the "Transfer Funds" link in the left navigation menu');
        });

        await test.step('Assert Transfer Funds page is loaded', async () => {
          await expect(page).toHaveURL(/transfer/);
          await expect(page.locator('#amount')).toBeVisible();
        });

      } finally {
        await sh.close();
      }
    }
  );
});
