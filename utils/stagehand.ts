/**
 * stagehand.ts — Stagehand factory utility.
 *
 * Creates a Stagehand instance configured to use the Google Gemini API.
 * Pattern mirrors the playwright-automation-suite reference project.
 *
 * Usage inside a Playwright test:
 *   const sh = await createStagehand(page);
 *   await sh.act('Click the Login button');
 *   await sh.close();
 */

import { Stagehand } from '@browserbasehq/stagehand';
import { type Page } from '@playwright/test';
import 'dotenv/config';
import { ENV } from './env';

/**
 * Initialises a Stagehand instance attached to the given Playwright page.
 * Uses Google Gemini (google/gemini-2.0-flash) via the GEMINI_API_KEY env variable.
 */
export async function createStagehand(page: Page): Promise<Stagehand> {
  if (!ENV.geminiApiKey) {
    throw new Error(
      '[Stagehand] GEMINI_API_KEY is not set. ' +
      'Add it to your .env file before running AI-assisted tests.'
    );
  }

  const stagehand = new Stagehand({
    env: 'LOCAL',
    model: {
      modelName: 'google/gemini-2.0-flash',
      apiKey: ENV.geminiApiKey
    },
    verbose: 0
  });

  // @ts-expect-error — Stagehand.init accepts a page in local mode
  await stagehand.init({ page });
  return stagehand;
}
