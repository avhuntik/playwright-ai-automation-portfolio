/**
 * parabank-ai-flow.ts — Standalone Stagehand AI Flow for ParaBank
 *
 * Runs independently of Playwright test runner (no test hooks needed).
 * Demonstrates full AI-guided banking session: login, navigate, extract data.
 *
 * Run:
 *   npm run stagehand:banking           (headless)
 *   npm run stagehand:banking:headed    (with browser visible)
 */

import 'dotenv/config';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { Stagehand } from '@browserbasehq/stagehand';
import { chromium, type Browser } from '@playwright/test';
import { z } from 'zod';

const geminiApiKey = process.env.GEMINI_API_KEY ?? '';
const headed = process.argv.includes('--headed');
const PARABANK_BASE = process.env.PARABANK_BASE_URL ?? 'https://parabank.parasoft.com/parabank';
const USERNAME = process.env.PARABANK_USERNAME ?? 'john';
const PASSWORD = process.env.PARABANK_PASSWORD ?? 'demo';

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

  console.log('\n🏦 ParaBank AI Flow — Starting...');
  console.log(`   Mode: ${headed ? 'HEADED' : 'HEADLESS'}`);
  console.log(`   AI:   Google Gemini 2.0 Flash\n`);

  try {
    await mkdir('./stagehand-browser-data', { recursive: true });
    await stagehand.init();
    browser = await chromium.connectOverCDP(stagehand.connectURL());
    const context = browser.contexts()[0];
    const page = context.pages()[0] ?? (await context.newPage());

    // ── Step 1: Navigate to ParaBank ────────────────────────────────────────
    console.log('📌 Step 1: Navigating to ParaBank...');
    await page.goto(`${PARABANK_BASE}/index.htm`, { waitUntil: 'networkidle' });
    await page.locator('input[name="username"]').waitFor();
    console.log('   ✅ Login page loaded\n');

    // ── Step 2: AI Login ────────────────────────────────────────────────────
    console.log('🤖 Step 2: AI-powered login...');
    await stagehand.act(`Fill the username field with "${USERNAME}"`, { page });
    await stagehand.act(`Fill the password field with "${PASSWORD}"`, { page });
    await stagehand.act('Click the Log In button', { page });
    await page.waitForURL(/overview/, { timeout: 15_000 });
    console.log('   ✅ Logged in successfully\n');

    // ── Step 3: AI Data Extraction ──────────────────────────────────────────
    console.log('🔍 Step 3: AI extracting account balance summary...');
    const summary = await stagehand.extract(
      'Extract all visible bank accounts from the accounts table. ' +
      'Return each account\'s number and balance.',
      z.object({
        accounts: z.array(z.object({
          accountNumber: z.string(),
          balance:       z.string()
        }))
      }),
      { page }
    );

    assert.ok(summary.accounts.length > 0, 'Expected at least one account in overview');
    console.log(`   ✅ Extracted ${summary.accounts.length} account(s):`);
    summary.accounts.forEach(acc => {
      console.log(`      Account: ${acc.accountNumber} | Balance: ${acc.balance}`);
    });
    console.log();

    // ── Step 4: AI Navigation ───────────────────────────────────────────────
    console.log('🤖 Step 4: AI navigating to Transfer Funds...');
    await stagehand.act('Click on the Transfer Funds link in the left navigation menu', { page });
    await page.waitForURL(/transfer/, { timeout: 10_000 });
    console.log('   ✅ Transfer Funds page reached\n');

    // ── Step 5: Verify transfer page ────────────────────────────────────────
    const amountField = page.locator('#amount');
    await amountField.waitFor({ state: 'visible' });
    console.log('   ✅ Transfer form is visible\n');

    console.log('✅ ParaBank AI Flow completed successfully!');
    console.log('   🏦 Domain: Banking | 🤖 AI: Gemini | 🎭 Runner: Playwright\n');

  } finally {
    await browser?.close();
    await stagehand.close();
  }
}

run().catch((error: unknown) => {
  console.error('\n❌ ParaBank AI Flow FAILED:', error);
  process.exitCode = 1;
});
