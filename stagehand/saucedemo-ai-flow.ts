/**
 * saucedemo-ai-flow.ts — Standalone Stagehand AI Flow for SauceDemo
 *
 * Demonstrates: AI-guided product search, data extraction, and cart interaction.
 * Runs independently of the Playwright test runner.
 *
 * Run:
 *   npm run stagehand:shopping           (headless)
 *   npm run stagehand:shopping:headed    (with browser visible)
 */

import 'dotenv/config';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { Stagehand } from '@browserbasehq/stagehand';
import { chromium, type Browser } from '@playwright/test';
import { z } from 'zod';

const geminiApiKey = process.env.GEMINI_API_KEY ?? '';
const headed = process.argv.includes('--headed');
const STANDARD_USER = process.env.SAUCEDEMO_STANDARD_USER ?? 'standard_user';
const PASSWORD      = process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce';

if (!geminiApiKey) {
  throw new Error(
    '[Stagehand] GEMINI_API_KEY is not set. ' +
    'Add it to your .env file before running this AI flow.'
  );
}

const stagehand = new Stagehand({
  env: 'LOCAL',
  model: {
    modelName: 'google/gemini-2.0-flash',
    apiKey: geminiApiKey
  },
  localBrowserLaunchOptions: {
    headless: !headed,
    executablePath: chromium.executablePath(),
    userDataDir: './stagehand-browser-data',
    viewport: { width: 1440, height: 900 }
  },
  verbose: 1
});

async function run(): Promise<void> {
  let browser: Browser | undefined;

  console.log('\n🛒 SauceDemo AI Flow — Starting...');
  console.log(`   Mode: ${headed ? 'HEADED' : 'HEADLESS'}`);
  console.log(`   AI:   Google Gemini 2.0 Flash\n`);

  try {
    await mkdir('./stagehand-browser-data', { recursive: true });
    await stagehand.init();
    browser = await chromium.connectOverCDP(stagehand.connectURL());
    const context = browser.contexts()[0];
    const page = context.pages()[0] ?? (await context.newPage());

    // ── Step 1: Navigate ────────────────────────────────────────────────────
    console.log('📌 Step 1: Navigating to SauceDemo...');
    await page.goto('https://www.saucedemo.com', { waitUntil: 'networkidle' });
    await page.locator('[data-test="username"]').waitFor();
    console.log('   ✅ Login page loaded\n');

    // ── Step 2: Login ────────────────────────────────────────────────────────
    console.log('📌 Step 2: Logging in...');
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/inventory\.html/);
    console.log('   ✅ Logged in\n');

    // ── Step 3: AI Extraction ────────────────────────────────────────────────
    console.log('🤖 Step 3: AI extracting all product names and prices...');
    const catalog = await stagehand.extract(
      'Extract all product names and their prices from the product listing page.',
      z.object({
        products: z.array(z.object({
          name:  z.string(),
          price: z.string()
        }))
      }),
      { page }
    );

    assert.ok(catalog.products.length > 0, 'Expected at least one product on inventory page');
    console.log(`   ✅ Extracted ${catalog.products.length} product(s):`);
    catalog.products.forEach(p => {
      console.log(`      ${p.name.padEnd(45)} ${p.price}`);
    });
    console.log();

    // ── Step 4: AI Add to Cart ───────────────────────────────────────────────
    console.log('🤖 Step 4: AI adding the cheapest product to cart...');
    // Find cheapest by parsing prices
    const cheapest = catalog.products.reduce((min, p) => {
      const price = parseFloat(p.price.replace('$', ''));
      const minPrice = parseFloat(min.price.replace('$', ''));
      return price < minPrice ? p : min;
    });
    console.log(`   Cheapest product: ${cheapest.name} (${cheapest.price})`);
    await stagehand.act(`Add the product named "${cheapest.name}" to the shopping cart`, { page });

    // ── Step 5: Playwright verification ─────────────────────────────────────
    console.log('\n🎭 Step 5: Playwright verifying cart badge...');
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await badge.waitFor({ state: 'visible', timeout: 5_000 });
    const badgeText = await badge.innerText();
    assert.strictEqual(badgeText, '1', 'Cart badge should show 1 item');
    console.log(`   ✅ Cart badge shows: ${badgeText}\n`);

    console.log('✅ SauceDemo AI Flow completed successfully!');
    console.log(`   🛒 Product Added: ${cheapest.name} (${cheapest.price})`);
    console.log('   🤖 AI: Gemini | 🎭 Runner: Playwright\n');

  } finally {
    await browser?.close();
    await stagehand.close();
  }
}

run().catch((error: unknown) => {
  console.error('\n❌ SauceDemo AI Flow FAILED:', error);
  process.exitCode = 1;
});
