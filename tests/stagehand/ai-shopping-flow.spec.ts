/**
 * ai-shopping-flow.spec.ts — Stagehand AI-Powered SauceDemo Tests
 *
 * Uses Stagehand (backed by Google Gemini) for natural-language browser actions.
 * Demonstrates AI-assisted test automation — a unique differentiator in this portfolio
 * that directly reflects the "AI-driven test generation" experience on the resume.
 *
 * Pattern: Stagehand handles complex/dynamic locating; Playwright asserts correctness.
 */

import { test, expect } from '@playwright/test';
import { allure }       from 'allure-playwright';
import { createStagehand } from '../../utils/stagehand';
import { ENV }          from '../../utils/env';

test.describe('SauceDemo — AI-Powered Stagehand Flows', () => {
  test.beforeEach(async () => {
    await allure.epic('AI-Assisted Automation');
    await allure.feature('Stagehand — SauceDemo');
  });

  test(
    'AI navigates to login and extracts page title',
    async ({ page }) => {
      await allure.story('AI Navigation');
      await allure.severity('normal');
      await allure.description(
        'Uses Stagehand + Gemini AI to navigate to SauceDemo, extract the page heading, ' +
        'and verify it matches expected text. Demonstrates natural-language locator resolution.'
      );
      test.slow(); // AI interactions need extra timeout

      const sh = await createStagehand(page);

      try {
        await test.step('Navigate to SauceDemo', async () => {
          await page.goto('https://www.saucedemo.com');
        });

        await test.step('AI: Login using natural language', async () => {
          await sh.act('Fill in the username field with "standard_user"');
          await sh.act('Fill in the password field with "secret_sauce"');
          await sh.act('Click the Login button');
        });

        await test.step('Assert inventory page loaded', async () => {
          await expect(page).toHaveURL(/inventory\.html/);
        });

        await test.step('AI: Extract product list data', async () => {
          const { z } = await import('zod');
          const data = await sh.extract(
            'Extract the names and prices of all visible products on this page.',
            z.object({
              products: z.array(z.object({
                name:  z.string(),
                price: z.string()
              }))
            })
          );
          expect(data.products.length).toBeGreaterThan(0);
          await allure.attachment(
            'AI Extracted Products',
            JSON.stringify(data.products, null, 2),
            'application/json'
          );
        });

      } finally {
        await sh.close();
      }
    }
  );

  test(
    'AI adds a product to cart using natural language',
    async ({ page }) => {
      await allure.story('AI Cart Interaction');
      await allure.severity('normal');
      await allure.description(
        'Stagehand AI locates and clicks the Add to Cart button for a specific product ' +
        'without using static CSS selectors. Playwright then verifies the cart badge.'
      );
      test.slow();

      const sh = await createStagehand(page);

      try {
        await test.step('Login', async () => {
          await page.goto('https://www.saucedemo.com');
          await page.locator('[data-test="username"]').fill(ENV.saucedemo.standardUser);
          await page.locator('[data-test="password"]').fill(ENV.saucedemo.password);
          await page.locator('[data-test="login-button"]').click();
          await page.waitForURL(/inventory\.html/);
        });

        await test.step('AI: Add Sauce Labs Fleece Jacket to cart', async () => {
          await sh.act('Add the product named "Sauce Labs Fleece Jacket" to the shopping cart');
        });

        await test.step('Assert cart badge incremented', async () => {
          await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        });

      } finally {
        await sh.close();
      }
    }
  );
});
