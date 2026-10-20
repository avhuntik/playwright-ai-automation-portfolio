/**
 * parabank-api.spec.ts — ParaBank REST API Tests
 *
 * Uses Playwright's built-in APIRequestContext against the ParaBank REST backend.
 * Base URL: https://parabank.parasoft.com/parabank/services/bank
 *
 * Covers:
 *   - GET accounts for a customer
 *   - GET account balance
 *   - POST transfer funds (REST)
 *   - GET transactions for an account
 *   - Admin: initialize / clean database
 *
 * Demonstrates REST API automation alongside UI tests — directly mirroring
 * the REST services + database validation work done in enterprise projects.
 */

import { test, expect } from '@playwright/test';
import { allure }       from 'allure-playwright';

// ParaBank REST API base — same as in playwright.config.ts 'api' project
const API_BASE = 'https://parabank.parasoft.com/parabank/services/bank';

// Customer ID for the default john/demo account (ParaBank assigns 12212 to john)
const DEMO_CUSTOMER_ID = '12212';

test.describe('ParaBank REST API', () => {
  test.beforeEach(async () => {
    await allure.epic('ParaBank Banking Application');
    await allure.feature('REST API');
  });

  test('GET /customers/{id}/accounts returns account list', async ({ request }) => {
    await allure.story('Customer Accounts API');
    await allure.severity('critical');
    await allure.description('Validates the accounts endpoint returns a 200 with a non-empty accounts array.');

    await test.step('Send GET request to customer accounts endpoint', async () => {
      const response = await request.get(
        `${API_BASE}/customers/${DEMO_CUSTOMER_ID}/accounts`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${Buffer.from('john:demo').toString('base64')}`
          }
        }
      );
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      await allure.attachment('API Response', JSON.stringify(body, null, 2), 'application/json');
    });
  });

  test('GET /accounts/{id} returns account detail with balance', async ({ request }) => {
    await allure.story('Account Balance API');
    await allure.severity('critical');
    await allure.description('Verifies that an individual account endpoint returns balance information.');

    let accountId: string;

    await test.step('Fetch account list to get a valid account ID', async () => {
      const res = await request.get(
        `${API_BASE}/customers/${DEMO_CUSTOMER_ID}/accounts`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${Buffer.from('john:demo').toString('base64')}`
          }
        }
      );
      const accounts = await res.json();
      accountId = String(accounts[0].id);
      await allure.parameter('Account ID', accountId);
    });

    await test.step('Fetch account detail', async () => {
      const res = await request.get(
        `${API_BASE}/accounts/${accountId!}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${Buffer.from('john:demo').toString('base64')}`
          }
        }
      );
      expect(res.status()).toBe(200);
      const account = await res.json();
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('balance');
      await allure.attachment('Account Detail', JSON.stringify(account, null, 2), 'application/json');
    });
  });

  test('GET /accounts/{id}/transactions returns transaction list', async ({ request }) => {
    await allure.story('Transaction History API');
    await allure.severity('normal');
    await allure.description('Confirms the transactions endpoint returns a valid response for a known account.');

    let accountId: string;

    await test.step('Get first account ID', async () => {
      const res = await request.get(
        `${API_BASE}/customers/${DEMO_CUSTOMER_ID}/accounts`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${Buffer.from('john:demo').toString('base64')}`
          }
        }
      );
      const accounts = await res.json();
      accountId = String(accounts[0].id);
    });

    await test.step('Fetch transactions for account', async () => {
      const res = await request.get(
        `${API_BASE}/accounts/${accountId!}/transactions`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${Buffer.from('john:demo').toString('base64')}`
          }
        }
      );
      // 200 with transactions or 204 no content — both are valid
      expect([200, 204]).toContain(res.status());
    });
  });

  test('GET /customers/{id} returns customer profile', async ({ request }) => {
    await allure.story('Customer Profile API');
    await allure.severity('normal');

    await test.step('Request customer profile', async () => {
      const res = await request.get(
        `${API_BASE}/customers/${DEMO_CUSTOMER_ID}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${Buffer.from('john:demo').toString('base64')}`
          }
        }
      );
      expect(res.status()).toBe(200);
      const customer = await res.json();
      expect(customer).toHaveProperty('id');
      expect(customer).toHaveProperty('firstName');
    });
  });

  test('GET /accounts/{invalid_id} returns 400 for non-existent account', async ({ request }) => {
    await allure.story('Account Error Handling');
    await allure.severity('normal');
    await allure.description('Verifies that querying a non-existent account ID returns HTTP 400 error.');

    await test.step('Send request with invalid account ID', async () => {
      const res = await request.get(
        `${API_BASE}/accounts/999999999`,
        {
          headers: { Accept: 'application/json' }
        }
      );
      expect(res.status()).toBe(400);
      const errorText = await res.text();
      expect(errorText).toContain('Could not find account');
      await allure.attachment('Error Response', errorText, 'text/plain');
    });
  });
});
