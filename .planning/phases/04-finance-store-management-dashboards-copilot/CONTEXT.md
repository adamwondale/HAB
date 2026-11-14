# Context: Phase 4 — Finance, Store, Management Dashboards & Copilot (Enriched with Charles Craft Standards)

## Background & Scope
Phase 4 completes the comprehensive ERP prototype by implementing Finance compliance, Store inventory movements, CEO & Technical Manager dashboards, contextual commenting, Copilot chatbot, and expanding user accounts to 6 dedicated logins.

Additionally, following the integration of the [charles-skills](https://github.com/LemonFace0309/charles-skills) suite (`charles-unslop`, `charles-polish`, `charles-ux-animation`, `charles-unreasonable-craft`), Phase 4 mandates strict craft standards:
- Subtraction of decorative clutter, unnecessary borders, and AI tells.
- Application of `tabular-nums` for all financial and metric numerals.
- Balanced text-wrapping (`text-wrap: balance`) on headings.
- Explicit resting state contrast between inputs and action buttons.
- A dedicated global UI audit plan (04-05) polishing all ERP modules.

---

## 5-Plan Decomposition

### Plan 04-01: 6-Role Authentication Expansion & Shared Craft Tokens
- Expand user accounts in `src/utils/authStorage.ts` to 6 accounts:
  1. `admin` (Super Admin)
  2. `ceo` (CEO / General Manager Overview - read-only)
  3. `hr` (Human Resource Management)
  4. `finance` (Finance & Payroll)
  5. `tech` (Technical Manager)
  6. `store` (Store Keeper)
- Update `src/utils/roleConfig.ts` with explicit tab access for `tech` and `store`.
- Update `src/components/LoginView.tsx` with quick-fill chips for all 6 accounts.
- Update `src/components/UserCredentialManager.tsx` to support managing all 6 accounts.

### Plan 04-02: Finance 9-Column Payroll, Tax & Cheque Controls & Material Depreciation
- 9-Column Salary Calculation Table: `[Name | Position | Basic | Non-Tax Allowance | Taxable Allowance | Gross | Income Tax | Pension 7%/11% | Net]` with `tabular-nums`.
- Cash & Cheque Dashboard: debited/credited cheques and aggregate totals across Petty Cash and Cheques.
- Material Depreciation tracker: `[Item | Price | Quantity]`, product codes, store availability, and Excel export.
- HR attendance attachments and on-leave employee access for payroll adjustments.

### Plan 04-03: Store Daily Issue/Receive, Asset Register & Minimum Stock Alerts
- Daily Issue / Receive movement logs with dates, quantities, and recipient tracking.
- Asset monitoring and capital equipment tracking.
- Minimum store stock level alert thresholds with visual warning tags.

### Plan 04-04: Executive & Technical Dashboards, Comments & Copilot Chatbot
- CEO / GM Dashboard: High-level summaries for Recruitment General, Finance General, and Store General.
- Technical Manager Dashboard: Categorized project sites (Active vs. Inactive), real-time available personnel, workforce attendance overview, and store available stock.
- Contextual comment writeup threads on employee dossiers and financial entries.
- Integrated Copilot chatbot assistant for instant lookups and routine operations.

### Plan 04-05: Global UI Unslop & Design-Craft Audit
- Audit and polish all application views using `charles-unslop`, `charles-polish`, and `charles-ux-animation`.
- Remove redundant hairline dividers, nested containers, and generic badges.
- Verify 4px spatial rhythm, optical alignments, and smooth micro-interactions.
- Verify clean compilation (`npx tsc --noEmit`) and production build (`npm run build`).
