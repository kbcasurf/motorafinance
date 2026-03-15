# DriverFinance — v1.0 Release: Next Steps Design

**Created:** 2026-03-15
**Goal:** Define which "What's Next" items from `docs/plans/plan.md` are required for the v1.0 release vs. deferred to v1.1.
**Priority:** Ship to both Android and iOS as fast as possible.

---

## Decision Summary

From the 11 items in the "What's Next" section, **5 are kept for v1.0** and **6 are deferred to v1.1**.

---

## v1.0 Release Scope (5 items)

### 1. Manual QA pass on a real device
Run `npx expo start` on a physical Android and iOS device. Walk the full user flow:
- Add income entries (including smart defaults)
- Add expense entries (including fuel sub-fields)
- Check dashboard period selection, KPIs, and chart
- Export CSV via share sheet
- Configure settings (driver name, vehicle, monthly goal)
- Wipe data with 2-step confirmation

**Why blocking:** Catches device-specific rendering or interaction bugs before any build is distributed.

### 2. EAS build (Android + iOS)
Run `npx eas build --platform android --profile preview` and the iOS equivalent. Verify the APK/IPA installs and runs correctly outside of Expo Go.

**Why blocking:** The app cannot be distributed or tested on real devices without a native build.

### 3. Push to GitHub and verify CI
Create a remote repository, push all code, and confirm that the GitHub Actions CI workflow passes (type-check + tests).

**Why blocking:** Required for traceability, collaboration, and release confidence.

### 4. Tab bar icons
Add proper icons to the 4 tab bar entries using `@expo/vector-icons` (Ionicons). Suggested mapping:
- Dashboard → `bar-chart`
- Receitas → `cash`
- Despesas → `wallet`
- Configurações → `settings`

**Why blocking:** Icon-less tabs are a visually unfinished UI pattern that users notice immediately on a real device.

### 5. Native date/time pickers
Replace plain text date/time inputs in `IncomeForm.tsx` and `ExpenseForm.tsx` with native pickers using `@react-native-community/datetimepicker` or `expo-date-picker`.

**Why blocking:** Text-based date input on a touchscreen device is a broken UX pattern — users expect the native date picker wheel.

---

## v1.1 Deferred Scope (6 items)

These items are documented and prioritized but will not block the v1.0 release.

| # | Item | Notes |
|---|------|-------|
| 1 | Platform/category filters on list screens | PRD RF-04.1/RF-04.2 — useful but current monthly view works |
| 2 | Period-aware list screens | Nice-to-have sync with dashboard period selector |
| 3 | Localized number input (currency mask) | UX polish via `react-native-mask-input` |
| 4 | Onboarding flow | App is simple enough to use without first-launch guidance |
| 5 | Backup/restore (SQLite export/import) | Power-user feature, not MVP critical |
| 6 | Accessibility audit | Important iteration item post-release |

---

## Out of Scope

No new features, screens, or database schema changes are introduced by this release work. All changes are additive UI-layer only (icons, date pickers) or operational (QA, build, CI).
