# 🎭 Playwright AI Automation Portfolio

> **Author:** Ayush Varshney — Senior Automation QA Engineer (9+ years)  
> **Stack:** Playwright · TypeScript · Stagehand (Google Gemini AI) · Allure · GitHub Actions  
> **Domains:** Banking / Fintech & E-Commerce

---

## 📌 Overview

A production-grade Playwright automation framework built to demonstrate **senior-level QA engineering skills** including:

- **Page Object Model (POM)** — clean separation of concerns across two independent apps
- **AI-Assisted Testing** via [Stagehand](https://github.com/browserbasehq/stagehand) + Google Gemini — natural language browser actions
- **Dual-domain Coverage** — ParaBank (banking app) + SauceDemo (e-commerce app)
- **API Automation** — Playwright APIRequestContext against ParaBank REST endpoints
- **Data-Driven Tests** — JSON test data files with typed loaders
- **Allure Reporting** — rich reports with steps, severity, owner, attachments
- **CI/CD** — GitHub Actions with Allure report artifact publishing

---

## 🏗️ Architecture

```
playwright-ai-automation-portfolio/
├── .github/workflows/      → GitHub Actions CI pipeline
├── data/                   → JSON test data files (data-driven)
├── fixtures/               → Extended Playwright test fixtures (POM injection)
├── pages/
│   ├── parabank/           → 8 ParaBank page objects (banking domain)
│   └── saucedemo/          → 5 SauceDemo page objects (e-commerce domain)
├── stagehand/              → Standalone AI-powered browser flows
├── tests/
│   ├── api/                → REST API tests (ParaBank)
│   ├── stagehand/          → AI-assisted Playwright tests
│   └── ui/
│       ├── parabank/       → 5 banking spec files
│       └── saucedemo/      → 5 e-commerce spec files
└── utils/                  → env.ts · stagehand.ts · test-data-loader.ts · date-utils.ts
```

---

## 🎯 Applications Under Test

### 🏦 ParaBank (`parabank.parasoft.com`)
A fully-featured banking demo application covering:
- Customer login / registration
- Accounts overview and balance checking
- Fund transfers between accounts
- Bill payment to external payees
- Transaction history search

> **Why ParaBank?** Directly mirrors banking domain experience from Citibank CRM automation, Blackstone Salesforce integration, and financial services ETL testing projects.

### 🛒 SauceDemo (`saucedemo.com`)
The industry-standard e-commerce test application:
- Multi-user login scenarios (standard / locked / glitch)
- Product sorting and filtering
- Shopping cart management
- Complete checkout flow
- Order confirmation

---

## 📊 Test Suite Summary

| Suite | Domain | Tests | Scenarios |
|-------|--------|-------|-----------|
| `parabank/auth` | Banking | 4 | Login, Invalid, Logout, Register Nav |
| `parabank/accounts` | Banking | 4 | Overview, Open Checking, Open Savings, Activity |
| `parabank/transfer` | Banking | 5 | Transfer + 3 data-driven amounts |
| `parabank/billpay` | Banking | 2 | Pay bill, Form validation |
| `parabank/e2e-banking` | Banking | 1 | **Full banking journey (6 steps)** |
| `saucedemo/auth` | E-Commerce | 5 | Login, Locked, Empty, Wrong pass, Logout |
| `saucedemo/inventory` | E-Commerce | 6 | Product count, 4× sort, Detail nav |
| `saucedemo/cart` | E-Commerce | 5 | Add 1, Add 3, Item names, Remove, Empty |
| `saucedemo/checkout` | E-Commerce | 3 | Validation (2), Order summary |
| `saucedemo/e2e-purchase` | E-Commerce | 2 | **Full purchase journey**, Perf glitch user |
| `api/parabank-api` | REST API | 5 | Accounts, Balance, Transactions, Profile, Auth |
| `stagehand/ai-banking` | AI | 2 | AI login + extraction, AI navigation |
| `stagehand/ai-shopping` | AI | 2 | AI login + extraction, AI cart interaction |

**Total: ~47 automated scenarios across 2 domains + API + AI**

---

## 🤖 AI-Assisted Testing (Stagehand + Gemini)

This framework integrates [Stagehand](https://github.com/browserbasehq/stagehand) — an AI-powered browser automation library — backed by **Google Gemini 2.0 Flash**.

### What Stagehand enables:
- **`act()`** — natural language browser actions (no static selectors needed)
- **`extract()`** — AI-structured data extraction from any page with Zod schema validation

### Example:
```typescript
// AI navigates and extracts — no CSS selectors required
await sh.act('Click on the Transfer Funds link in the left navigation menu');

const accounts = await sh.extract(
  'Extract all visible bank accounts with their account number and balance',
  z.object({ accounts: z.array(z.object({ accountNumber: z.string(), balance: z.string() })) })
);
```

---

## ⚙️ Setup

### Prerequisites
- Node.js 20+
- Allure CLI (`npm install -g allure-commandline`)
- Google Gemini API key ([get one free](https://aistudio.google.com/apikey))

### Install

```powershell
# Clone and enter the project
cd "playwright-ai-automation-portfolio"

# Install dependencies
npm install

# Install Chromium browser
npm run install:browsers

# Configure environment
Copy-Item .env.example .env
# Edit .env and set GEMINI_API_KEY
```

---

## 🚀 Running Tests

### All UI Tests
```powershell
npm test
```

### By Application
```powershell
npm run test:parabank     # Banking tests only
npm run test:saucedemo    # E-Commerce tests only
```

### Specific Suites
```powershell
# E2E flagship tests
npm run test:e2e

# REST API tests
npm run test:api

# AI-powered tests (requires GEMINI_API_KEY)
npm run test:stagehand
```

### Debug & Trace
```powershell
npm run test:headed       # Run with browser visible
npm run test:debug        # Launch Playwright Inspector
npm run test:trace        # Always capture trace
```

---

## 🤖 Standalone AI Flows

```powershell
# AI-guided banking flow (headless)
npm run stagehand:banking

# AI-guided banking flow (with browser visible)
npm run stagehand:banking:headed

# AI-guided shopping flow
npm run stagehand:shopping
npm run stagehand:shopping:headed
```

---

## 📈 Allure Reports

```powershell
# Generate report from results
npm run allure:generate

# Open report in browser
npm run allure:open

# Generate + serve in one command
npm run allure:serve
```

Allure reports include:
- Test steps with pass/fail breakdown
- Severity labels (Blocker → Minor)
- Owner attribution
- API response body attachments
- On-failure: screenshot, video, trace

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# ParaBank credentials
PARABANK_USERNAME=john
PARABANK_PASSWORD=demo

# SauceDemo credentials
SAUCEDEMO_STANDARD_USER=standard_user
SAUCEDEMO_PASSWORD=secret_sauce

# Google Gemini AI key (required for Stagehand tests)
GEMINI_API_KEY=your-key-here
```

> ⚠️ Never commit `.env` to version control. It is in `.gitignore`.

---

## 🔄 CI/CD — GitHub Actions

The `.github/workflows/playwright.yml` pipeline:
1. Installs Node.js 20 + dependencies
2. Installs Chromium
3. Runs UI tests (ParaBank + SauceDemo)
4. Runs API tests
5. Generates Allure report
6. Uploads Allure report, HTML report, JUnit XML as artifacts

Add secrets to your GitHub repo (`Settings → Secrets → Actions`):
- `GEMINI_API_KEY`

---

## 🎓 Skills Demonstrated

| Skill | Implementation |
|-------|---------------|
| Playwright (4+ years) | Full test suite across UI + API |
| TypeScript | Strict typing throughout |
| Page Object Model | 13 page objects across 2 apps |
| Fixtures | Extended test with injected POMs |
| Allure Reporting | Steps, severity, owner, attachments |
| AI Testing | Stagehand + Gemini across 4 tests |
| Data-Driven Testing | JSON data + typed loader |
| API Automation | Playwright APIRequestContext |
| Banking Domain | ParaBank: login, accounts, transfer, bill pay |
| CI/CD | GitHub Actions with artifact upload |

---

## 👤 Author

**Ayush Varshney**  
Senior Automation QA Engineer | 9+ years  
Specialisation: Playwright · Salesforce CRM · Banking & Fintech · AI-Assisted Testing  
📧 ayhuntik@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/ayush-varshney)
