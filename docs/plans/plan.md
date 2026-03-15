# DriverFinance — Implementation Plan

**Created:** 2026-03-15
**Approach:** Vertical slices — each phase delivers end-to-end working features
**PRD Reference:** `prd.md` (v2.0.0)

---

## Phase 1: Foundation

**Goal:** Running Expo app with project structure, DB initialized, theme system, and navigation shell.

- [x] 1.1 — Scaffold Expo project (`create-expo-app` blank-typescript)
- [ ] 1.2 — Install all dependencies (production + dev)
- [ ] 1.3 — Create config files (`CLAUDE.md`, `.claude/settings.json`, `.mcp.json`, `.gitignore`, `.prettierrc`, `drizzle.config.ts`)
- [ ] 1.4 — Setup theme system (`src/theme/index.ts` — light/dark colors, spacing, typography)
- [ ] 1.5 — Setup DB layer (`src/db/schema.ts`, `src/db/client.ts`) with all 4 tables
- [ ] 1.6 — Generate first migration via `drizzle-kit`
- [ ] 1.7 — Create navigation shell (Expo Router tabs: Dashboard, Receitas, Despesas, Configurações)
- [ ] 1.8 — Create base UI components (`src/components/ui/` — Card, Button, Input)
- [ ] 1.9 — Create utility functions (`src/utils/currency.ts`)
- [ ] 1.10 — Create constants (`src/constants/categories.ts`)
- [ ] 1.11 — Git init + first commit

---

## Phase 2: Income (Receitas)

**Goal:** Full CRUD for ride income entries with smart defaults.

- [ ] 2.1 — Income queries (`src/db/queries/income.ts` — insert, update, delete, getById)
- [ ] 2.2 — Income Zustand store (`src/stores/useIncomeStore.ts` — UI state, last platform, last odometer)
- [ ] 2.3 — Live query hook (`src/hooks/useLiveIncomes.ts`)
- [ ] 2.4 — Income form component (`src/components/forms/IncomeForm.tsx` — with validation)
- [ ] 2.5 — New income screen (`app/(tabs)/(income)/new.tsx` — smart defaults: date/time, last platform, last odometer)
- [ ] 2.6 — Edit income screen (`app/(tabs)/(income)/[id].tsx`)
- [ ] 2.7 — Income list screen (`app/(tabs)/(income)/index.tsx` — chronological reverse, swipe-to-delete)
- [ ] 2.8 — Income stack layout (`app/(tabs)/(income)/_layout.tsx`)

---

## Phase 3: Expenses (Despesas)

**Goal:** Full CRUD for expenses with fuel sub-fields and custom categories.

- [ ] 3.1 — Expense queries (`src/db/queries/expenses.ts` — insert, update, delete, getById)
- [ ] 3.2 — Expense Zustand store (`src/stores/useExpenseStore.ts`)
- [ ] 3.3 — Live query hook (`src/hooks/useLiveExpenses.ts`)
- [ ] 3.4 — Custom categories queries (`src/db/queries/categories.ts`)
- [ ] 3.5 — Expense form component (`src/components/forms/ExpenseForm.tsx` — with fuel conditional fields)
- [ ] 3.6 — New expense screen (`app/(tabs)/(expenses)/new.tsx`)
- [ ] 3.7 — Edit expense screen (`app/(tabs)/(expenses)/[id].tsx`)
- [ ] 3.8 — Expense list screen (`app/(tabs)/(expenses)/index.tsx` — swipe-to-delete, category filter)
- [ ] 3.9 — Expense stack layout (`app/(tabs)/(expenses)/_layout.tsx`)

---

## Phase 4: Dashboard

**Goal:** Financial overview with period selection, KPIs, and charts.

- [ ] 4.1 — Report queries (`src/db/queries/reports.ts` — aggregations by period)
- [ ] 4.2 — Period filter hook (`src/hooks/usePeriodFilter.ts` — daily/weekly/monthly)
- [ ] 4.3 — Calculation utils (`src/utils/calculations.ts` — net profit, cost/km, revenue/km)
- [ ] 4.4 — Period selector component
- [ ] 4.5 — Summary cards (gross revenue, expenses, net profit with color coding)
- [ ] 4.6 — KPI indicators (R$/km, cost/km, total km)
- [ ] 4.7 — Victory Native XL bar chart (revenue × expenses × profit over time)
- [ ] 4.8 — Monthly goal progress bar
- [ ] 4.9 — Empty state with call-to-action
- [ ] 4.10 — Dashboard screen (`app/(tabs)/index.tsx`)

---

## Phase 5: Settings + Export

**Goal:** User preferences, custom categories management, CSV export, data wipe.

- [ ] 5.1 — Settings Zustand store (`src/stores/useSettingsStore.ts`)
- [ ] 5.2 — Settings queries (read/write key-value pairs)
- [ ] 5.3 — CSV export utility (`src/utils/export.ts`)
- [ ] 5.4 — Settings screen (`app/(tabs)/settings.tsx` — driver name, vehicle, monthly goal)
- [ ] 5.5 — Custom categories management UI
- [ ] 5.6 — CSV export with share sheet integration
- [ ] 5.7 — Data wipe with 2-step confirmation

---

## Phase 6: Polish

**Goal:** Production readiness — error handling, edge cases, theming final pass.

- [ ] 6.1 — Error boundaries (React error boundary with fallback UI)
- [ ] 6.2 — Empty states for all lists
- [ ] 6.3 — Dark/light theme final pass (all screens)
- [ ] 6.4 — Haptic feedback on destructive actions
- [ ] 6.5 — DB error handling (disk full, corruption)
- [ ] 6.6 — CI/CD workflows (`.github/workflows/ci.yml`, `build.yml`)
- [ ] 6.7 — Unit tests for utils, queries, and hooks
- [ ] 6.8 — Final review and cleanup
