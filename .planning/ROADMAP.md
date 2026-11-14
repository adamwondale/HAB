# Roadmap: HAB Business PLC ERP

## Overview

Transforming the enterprise ERP design system into a warm, cohesive earth-tone visual language centered around `#F2C46A` (Golden Honey) as the main brand accent, `#4C4541` (Deep Espresso) for contrast and dark chrome, `#AEAC78` (Sage Green) for secondary tags and borders, and `#FCF0DA` (Warm Linen) for light chrome and header washes.

## Phases

- [x] **Phase 1: Warm Earth Palette Migration** - Migrate DESIGN.md, global CSS tokens, navigation shell (Sidebar & TopBar), and key view components to the new palette.
- [x] **Phase 2: 4-Role Authentication and Access Control** - Implement strict authentication for Super Admin, CEO Overview, HR, and Finance with client credential persistence and role-scoped permissions.
- [x] **Phase 3: HR Operations, Slide One Ledger & Automated Leave** - Implement Slide One master table, recruitment 2-stage probation & drill-down, approvable transfers, and automated leave deduction.
- [ ] **Phase 4: Finance, Store, Management Dashboards & Copilot** - Implement 9-column payroll, cheque/cash dashboard, material depreciation with Excel export, store issue/receive & min stock alerts, Technical Manager & CEO dashboards, and Copilot chatbot.

## Phase Details

### Phase 1: Warm Earth Palette Migration

**Goal**: Transition all design tokens, global stylesheets, navigation shells, and core application components to the approved Warm Earth palette with `#F2C46A` as the main interactive accent.
**Depends on**: Nothing
**Requirements**: REQ-DS-001
**Success Criteria** (what must be TRUE):
  1. `DESIGN.md` contains the formal Warm Earth color tokens and component styling rules.
  2. `src/index.css` defines the light/dark canvas, table headers, and input styles with the new palette.
  3. `Sidebar.tsx`, `TopBar.tsx`, and `HabLogo.tsx` render with `#FCF0DA` light shell / `#2C2724` dark shell, `#F2C46A` active indicators, and `#4C4541` text.
  4. Core dashboard and ERP views utilize `#F2C46A` for primary action buttons with `#4C4541` high-contrast text.
  5. TypeScript compilation passes cleanly (`npx tsc --noEmit`).

**Plans**: 2 plans

Plans:
- [x] 01-01: Update DESIGN.md and global CSS in index.css with Warm Earth design tokens.
- [x] 01-02: Update Sidebar, TopBar, HabLogo, and core views with #F2C46A main color and #4C4541 text.

### Phase 2: 4-Role Authentication and Access Control

**Goal:** Implement dedicated authentication and access control for the 4 core personas (Super Admin, CEO Overview, HR, Finance) with client credential management in System Master Setup and executive read-only mode for CEO.
**Depends on:** Phase 1
**Requirements:** REQ-AUTH-001
**Success Criteria** (what must be TRUE):
  1. Authentication validates username/email and password against persisted accounts with initial seed (`admin`, `ceo`, `hr`, `finance` / `hab2026`).
  2. Legacy top role switcher (`RoleAccessBar`) removed; navigation filtered per role via `getRoleAllowedTabs`.
  3. CEO Overview operates strictly in read-only mode across all HR and Finance views.
  4. Super Admin can manage user accounts and reset passwords in System Master Setup with `localStorage` persistence.
  5. TopBar displays the active user badge and explicit Sign Out action.
  6. TypeScript compilation passes cleanly (`npx tsc --noEmit`).

**Plans:** 2 plans

Plans:
- [x] 02-01: Auth data models, credential persistence (authStorage.ts), role tab filtering, and Sidebar navigation.
- [x] 02-02: Login screen credential validation, session controls in TopBar, retirement of top switcher bar, and Super Admin user credential manager.

### Phase 3: HR Operations, Slide One Ledger & Automated Leave

**Goal:** Implement the primary Slide One employee master record table, centralized recruitment with 2-stage probation and assignment drill-down, performance evaluation, approvable transfer workflows, and automated leave deduction while removing store visibility from HR.
**Depends on:** Phase 2
**Requirements:** REQ-MOD-001
**Success Criteria** (what must be TRUE):
  1. The Store module is completely removed from HR tab visibility and navigation.
  2. HR dashboard features an Attrition Pie Chart and Workforce Distribution analytics.
  3. The main HR landing view renders the Slide One Employee Master Record Table with columns: `[Employee Name/ID | HR Profile | Pay Record | Leave Days | Overtime Record | Site | KPI]`, with interactive drill-down drawers.
  4. Recruitment tracks onboarding in two explicit stages (`Probation` vs. `Finished Probation`), provides a clickable Assigned Employee drill-down `[Assignment | Quantity | Location / Site]`, links to applicant CV data, and generates official documents (`Work Letter` and `Clearance`).
  5. Includes a dedicated Performance Evaluation scoring interface.
  6. Transfers support an explicit approval workflow (`Pending`, `Approved`, `Rejected`) with site location tracking.
  7. Leave Management splits into `Request` and `Available` views, clearly displaying balance days, and automatically deducts approved days from employee balances upon approval.
  8. TypeScript compilation passes cleanly (`npx tsc --noEmit`).
**Plans:** 3 plans

Plans:
- [x] 03-01: HR Scope, Attrition Pie Chart, and Slide One Master Table with inspection drawers.
- [x] 03-02: Centralized Recruitment, 2-Stage Probation, Assigned Employee drill-down modal, Document Generator (Work Letter & Clearance), and Performance Evaluation.
- [x] 03-03: Approvable Transfer workflow with site tracking, Split Leave Request/Available views, and automated balance deduction on approval.

### Phase 4: Finance, Store, Management Dashboards & Copilot

**Goal:** Implement the 9-column Ethiopian payroll table, statutory tax/cash/cheque tracking, material depreciation with Excel export, store daily issue/receive & min stock alerts, CEO and Technical Manager dashboards, contextual comments, Copilot chatbot, and expand accounts to 6 dedicated logins.
**Depends on:** Phase 3
**Requirements:** REQ-MOD-002, REQ-CRAFT-001
**Success Criteria** (what must be TRUE):
  1. Finance payroll table renders all 9 standard columns: `[Name | Position | Basic | Non-Taxable Allowance | Taxable Allowance | Gross | Income Tax | Pension (7% / 11%) | Net]` with `tabular-nums` formatting.
  2. Financial dashboard tracks debited/credited cheques and aggregate totals across Petty Cash and Cheques, with statutory tracking (VAT, income tax, 7%/11% pension, withholding).
  3. Material depreciation tracking with attributes `[Item | Price | Quantity]`, product coding, and Excel integration/export.
  4. Store module logs daily issue/receive, monitors company assets, and triggers minimum store stock level alerts.
  5. CEO / GM Dashboard renders high-level summaries for Recruitment General, Finance General, and Store General.
  6. Technical Manager Dashboard provides site status (Active vs. Inactive), real-time available personnel, attendance overview, and store stock summary.
  7. Contextual comment writeup and interactive Copilot chatbot are active and responsive.
  8. Account system expands to 6 dedicated logins (`admin`, `ceo`, `hr`, `finance`, `tech`, `store` with password `hab2026`).
  9. Comprehensive design-craft audit (`charles-unslop` and `charles-polish`) executed across all ERP modules ensuring 0 AI tells, 4px grid spacing, and smooth micro-interactions.
  10. TypeScript compilation passes cleanly (`npx tsc --noEmit`).
**Plans:** 5 plans

Plans:
- [x] 04-01: 6-Role Authentication Expansion & Shared Craft Design Tokens.
- [x] 04-02: Finance 9-Column Payroll, Tax & Cheque Controls, and Material Depreciation.
- [x] 04-03: Store Daily Issue/Receive, Asset Register, and Minimum Stock Alerts.
- [x] 04-04: Executive & Technical Dashboards, Record Comments, and Copilot Chatbot.
- [x] 04-05: Global UI Unslop & Design-Craft Audit across all ERP views.
