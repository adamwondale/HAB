# Roadmap: HAB Business PLC ERP

## Overview

Transforming the enterprise ERP design system into a warm, cohesive earth-tone visual language centered around `#F2C46A` (Golden Honey) as the main brand accent, `#4C4541` (Deep Espresso) for contrast and dark chrome, `#AEAC78` (Sage Green) for secondary tags and borders, and `#FCF0DA` (Warm Linen) for light chrome and header washes.

## Phases

- [x] **Phase 1: Warm Earth Palette Migration** - Migrate DESIGN.md, global CSS tokens, navigation shell (Sidebar & TopBar), and key view components to the new palette.
- [x] **Phase 2: 4-Role Authentication and Access Control** - Implement strict authentication for Super Admin, CEO Overview, HR, and Finance with client credential persistence and role-scoped permissions.
- [x] **Phase 3: HR Operations, Slide One Ledger & Automated Leave** - Implement Slide One master table, recruitment 2-stage probation & drill-down, approvable transfers, and automated leave deduction.
- [x] **Phase 4: Finance, Store, Management Dashboards & Copilot** - Implement 9-column payroll, cheque/cash dashboard, material depreciation with Excel export, store issue/receive & min stock alerts, Technical Manager & CEO dashboards, and Copilot chatbot.
- [x] **Phase 5: Division Management** - Manageable division records (Security, Cleaning, Property Management, Head Office Staff, and custom), dynamic CRUD, employee division assignment, and reports integration.
- [x] **Phase 6: Payroll Management Enhancement** - Strict 30-day basis, 16-column calculation sheet, separate 11% non-deductible employer pension, allowance/deduction breakdowns, and totals.
- [x] **Phase 7: Store and Inventory Management** - 7 item categories, Stock In, Stock Out with positive stock enforcement, Employee Equipment Allocation register, and Damaged/Lost item tracking.
- [x] **Phase 8: Role-Based Access Control (RBAC)** - Role boundaries for Admin, HR, Finance, Store, and Operations, with navigation protection and audit logging.
- [x] **Phase 9: Integration and Final Polish** - Full cross-module sync, responsive checks, empty/error states, and end-to-end verification.
- [x] **Phase 10: Role-Specific Dashboards & Admin Perspective Switcher** - Dedicated landing cockpits for HR, Finance, Store, Operations, and Admin/CEO, with live KPI metrics, actionable deep-link queues, zero payroll leakage, and administrative perspective switching.
- [x] **Phase 11: Full Codebase Internationalization & Zero Hardcoded UI Strings** - Scaffold modular i18n domain namespaces, enforce strict TypeScript CustomTypeOptions, and eliminate hardcoded UI copy across all screens in 4 domain waves.
- [x] **Phase 12: Super Admin Executive Observatory & Cross-Department In-Place Cockpits** - Incorporate team wireframes (CEO 36-KPI health matrix, management notification triage rail, integrated in-place editing across all roles, sequential 3-stage exit clearance, field technical dispatch, biometric attendance dropzone, and finance/store wireframe parity).
- [x] **Phase 13: 16-Column Grouped Payroll Engine, Automated Allowance Splitting & HR Attendance Sync** - Implement the team's two-tier 16-column payroll sheet, automated statutory allowance splitting (non-taxable vs taxable based on ETB 1,600 transport / ETB 2,000 mobile thresholds), and 1-click HR attendance import / Excel reconciliation.
- [x] **Phase 15: Wireframe Specification Parity & Multi-Role Cockpit Realization** - Deliver 100% specification parity with CEO & Technical Manager Cockpits, 7-column Finance & Store tracking grid, 36 Departmental KPIs in ETB, and the 9-screen HR & Operations wireframe suite.

## Phase Details

### Phase 9: Integration and Final Polish

**Goal:** Deliver full cross-module division synchronization, destructive action confirmation flows, empty/loading states, and responsive design verification.
**Depends on:** Phase 8
**Requirements:** REQ-INT-001
**Success Criteria** (what must be TRUE):
  1. Division Management, Payroll, Store, Employees, and Overview are fully integrated with dynamic divisions.
  2. Destructive actions (division deactivation, write-offs, payroll disbursement) have confirmation feedback.
  3. All tables display clean empty states when filters produce no matches.
  4. All modified/created components stay strictly under the 250-line budget.
  5. TypeScript compiles with zero errors and production build succeeds.

**Plans:** 1 plan

Plans:
- [x] 09-01: Cross-module division synchronization, confirmation dialogs, table empty states, and responsive layout polish.

### Phase 11: Full Codebase Internationalization & Zero Hardcoded UI Strings

**Goal:** Transform HAB Business PLC ERP into a fully localized, bilingual application (English and Amharic) by extracting every hardcoded UI text string into modular domain namespaces under `src/i18n/modules/` re-exported by `src/i18n/index.ts`, enforcing strict TypeScript compile-time key validation.
**Depends on:** Phase 8, Phase 10
**Requirements:** REQ-I18N-001
**Success Criteria** (what must be TRUE):
  1. `src/i18n/modules/` contains decoupled domain translation files (`common.ts`, `nav.ts`, `dashboard.ts`, `deployment.ts`, `attendance.ts`, `clearance.ts`, `payroll.ts`, `store.ts`, `recruitment.ts`, `masterSetup.ts`), each strictly under 250 lines.
  2. `src/i18n/index.ts` re-exports and initializes the resources, maintaining total file size <= 250 lines.
  3. `src/i18n/types.ts` enforces `CustomTypeOptions` for `i18next`, ensuring compile-time safety and autocomplete on all `t('namespace.key')` queries.
  4. Zero hardcoded UI string literals or inline language ternary checks (`i18n.language === 'am' ? ... : ...`) remain in application views and modals across all 4 execution waves.
  5. Amharic translations use authentic Ethiopian HR/legal terminology conforming to Ethiopian Labor Proclamation No. 1156/2019 and proper Ge'ez typography formatting.
  6. TypeScript compilation passes cleanly (`npx tsc --noEmit`).

**Plans:** 4 plans

Plans:
- [x] 11-01: Modular namespace architecture (`src/i18n/modules/*`, `types.ts`, `index.ts`), strict `CustomTypeOptions`, and Wave 1: App shell, TopBar, Sidebar, and DashboardOverview.
- [x] 11-02: Wave 2: Field Operations, Site Deployments, Rotation Engine, AttendanceView, and SimpleWorkspace.
- [x] 11-03: Wave 3: HR Workflows, ClearanceView, OnboardingView, RecruitmentView, LeaveManagementView, and ManagementOrgView.
- [x] 11-04: Wave 4: Finance & Payroll, StoreManagementView, Warehouse3DView, SystemMasterSetupView, and LoginView.

### Phase 10: Role-Specific Dashboards & Admin Perspective Switcher

**Goal:** Implement purpose-built, domain-specific landing dashboards for the 5 RBAC personas (HR, Finance, Store, Operations, Admin/CEO), eliminate sensitive data leakage across departments, integrate action queues with deep-links, and enable an administrative perspective switcher for leadership.
**Depends on:** Phase 8
**Requirements:** REQ-DASH-001
**Success Criteria** (what must be TRUE):
  1. Root overview (`activeTab === 'overview'`) dynamically renders dedicated dashboards: `HrDashboard`, `FinanceDashboard`, `StoreDashboard`, `OperationsDashboard`, and `AdminMasterDashboard`.
  2. Store and Operations staff dashboards have zero exposure to payroll or salary metrics.
  3. Staff roles are locked into their respective dashboard; Admin and CEO accounts can preview any department dashboard via a top perspective switcher.
  4. Each dashboard features live KPI metrics with `tabular-nums` and an actionable "Needs Attention" queue deep-linking to destination tabs.
  5. All components adhere strictly to <= 250 lines and Warm Earth design tokens (`#F2C46A`, `#4C4541`, `#FCF0DA`, `#AEAC78`).
  6. TypeScript compilation passes cleanly (`npx tsc --noEmit`).

**Plans:** 2 plans

Plans:
- [x] 10-01: DashboardRouter, Admin Perspective Switcher, Reusable Metric Tiles, and Admin Master Dashboard.
- [x] 10-02: Dedicated Departmental Cockpits (HR, Finance, Store, Operations) with KPIs, Action Queues, and Zero Data Leaks.

### Phase 8: Role-Based Access Control (RBAC)

**Goal:** Implement departmental permissions for System Administrator, HR, Finance, Store, and Operations; 403 route-guard barrier; operation-level restrictions; and immutable activity audit logging.
**Depends on:** Phase 7
**Requirements:** REQ-RBAC-001
**Success Criteria** (what must be TRUE):
  1. Unauthorized URL alterations (e.g. ?tab=payroll for HR/Store) trigger the 403 AccessDeniedBarrier.
  2. HR restricted from authorizing final payroll; Finance restricted from modifying HR employee records.
  3. Store and Operations restricted from confidential payroll data.
  4. Activity audit log persists state mutations (actor, action, timestamp, previous/new value).
  5. 5 pre-configured accounts (admin, hr, finance, store, operations) accessible via quick-fill login chips.
  6. All components <= 250 lines; TypeScript compilation clean.

**Plans:** 1 plan

Plans:
- [x] 08-01: RBAC route barriers, operation-level permissions, audit trail logging, and pre-configured logins.

### Phase 7: Store and Inventory Management

**Goal:** Implement 7 item categories, Stock In, Stock Out with positive stock enforcement, Employee Equipment Allocation register, and Damaged/Lost item quarantine tracking.
**Depends on:** Phase 6
**Requirements:** REQ-STORE-001
**Success Criteria** (what must be TRUE):
  1. StockCategory supports all 7 client categories (Cleaning Equipment, Cleaning Chemicals, Security Equipment, Uniforms, Safety Equipment, Office Supplies, General Consumables).
  2. Stock In records supplier, quantity, cost, reference code.
  3. Stock Out prevents negative stock balance with strict input validation.
  4. Employee Equipment Allocation tracks employee, item, quantity, issue date, expected return date, actual return date, and condition.
  5. Damaged or lost items are quarantined and not automatically added back to available inventory.
  6. Inventory dashboard displays SKUs, physical stock, low stock, out of stock, in-field gear, and valuation.
  7. Direct workspace routing for activeTab === 'store'.
  8. All components strictly under 250 lines; TypeScript compilation clean.

**Plans:** 1 plan

Plans:
- [x] 07-01: Store catalog, non-negative movements, equipment allocation, quarantined returns, and inventory dashboard.

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

---

### Phase 12: Super Admin Executive Observatory & Cross-Department In-Place Cockpits

**Goal:** Incorporate the team's 17 hand-drawn wireframes and 36-parameter performance scorecards into a cohesive, production-grade Super Admin and Departmental Management architecture.
**Depends on:** Phase 10, Phase 11
**Requirements:** REQ-EXEC-001, REQ-EXEC-002, REQ-EXEC-003, REQ-EXEC-004
**Success Criteria** (what must be TRUE):
  1. CEO Executive Overview renders the 4 headline cards (Total Employees 250, Revenue ETB 8M, Active Contracts, Pending Approvals), 3-state Management Notification Rail (`Attention`, `Ready`, `On Track`), and Department Summary RAG health table with expandable 12-parameter scorecards for HR, Store, and Finance.
  2. Super Admin can switch perspectives into any department with full in-place editing, drawer adjustments, and status toggles; every override automatically stamps an audit log entry.
  3. Sequential 3-stage cross-department exit clearance (HR initiation $\rightarrow$ Store asset return verification $\rightarrow$ Finance payroll/suspense liquidation $\rightarrow$ Super Admin final sign-off) is enforced with live state synchronization.
  4. Technical Manager & Operations cockpit features dual-tier technical alerts (Urgent vs Pending), work request dispatch table, and site inventory tracking.
  5. Attendance view includes Present/Late/Absent summary badges, biometric/scan attendance upload dropzone, attachment preview modal, and full attendance log.
  6. Finance and Store dashboards implement the team's visual enhancements: Revenue vs Expense Trend bar chart, Operational Expense Breakdown pie chart, VAT/WHT/Pension statutory configuration, Fixed Asset Valuation, and Minimum Stock alert table.
  7. All components adhere strictly to the 250-line limit and Warm Earth theme tokens (`#F2C46A`, `#4C4541`, `#FCF0DA`, `#AEAC78`).
  8. TypeScript compiles with zero errors (`npx tsc --noEmit`).

**Plans:** 3 plans

Plans:
- [x] 12-01: CEO Executive Observatory, 36-Parameter Performance Scorecards & Management Notification Rail (REQ-EXEC-001, REQ-EXEC-002).
- [x] 12-02: Sequential 3-Stage Cross-Department Exit Clearance & Super Admin In-Place Editing / Audit Trail (REQ-EXEC-002, REQ-EXEC-003).
- [x] 12-03: Field Technical Dispatch, Attendance Biometric Upload, and Finance/Store Wireframe Parity (REQ-EXEC-004).

---

### Phase 13: 16-Column Grouped Payroll Engine, Automated Allowance Splitting & HR Attendance Sync

**Goal:** Implement the team's hand-drawn 16-column payroll architecture with two-tier grouped headers, dynamic statutory allowance splitting (non-taxable vs taxable), and a 1-click HR attendance import / Excel reconciliation modal.
**Depends on:** Phase 6, Phase 12
**Requirements:** REQ-PAY-002
**Success Criteria** (what must be TRUE):
  1. `PayrollCalculationTable.tsx` renders a two-tier grouped header: `Allowance` groups `[Non-taxable | Taxable]` and `Deduction` groups `[Income Tax | Pension (7%) | Other Deductions]`.
  2. Allowance engine automatically calculates non-taxable vs taxable portions based on configured thresholds (Transport exempt up to ETB 1,600, Mobile exempt up to ETB 2,000). Excess is added to taxable earnings.
  3. Taxable income for Schedule 'A' tax brackets is strictly: $\text{Earned Basic} + \text{Taxable Allowance} + \text{Overtime}$.
  4. Employer Pension (11%) is calculated strictly as $11\% \times \text{Earned Basic}$ and presented as non-deductible company contribution.
  5. `ImportAttendanceModal.tsx` provides both **"Sync from HR" (1-Click Live Import)** and **"Upload Attendance Excel"** with template download.
  6. Automatic Paid Leave Recognition honors approved leaves (Annual, Sick, Bereavement) as full payable days ($30 - \text{unexcused absences}$).
  7. All created/modified files adhere strictly to the 250-line limit and Warm Earth design tokens.
  8. TypeScript compilation passes cleanly (`npx tsc --noEmit`).

**Plans:** 2 plans

Plans:
- [x] 13-01: Grouped 16-Column Two-Tier Payroll Table & Dynamic Allowance Exemption Engine (REQ-PAY-002).
- [x] 13-02: HR Attendance Import Modal (Sync from HR + Excel Reconciliation) & Paid Leave Proration (REQ-PAY-002).

### Phase 15: Wireframe Specification Parity & Multi-Role Cockpit Realization (CEO & Technical Manager Dashboards, 36 KPIs & 9-Screen HR/Operations Blueprint)

**Goal:** Deliver 100% specification parity with the two master documents compiled from the team's wireframes: `Dashboard_Coding_Prompt_Specification.docx` (CEO & Technical Manager Cockpits, 7-column Finance & Store tracking grid, 36 Departmental KPIs in ETB) and `Unison_ERP_HR_Coding_Specification.docx` (9-screen HR & Operations wireframe blueprint, 4-division clickable donut, 5-point action triage card, split exit clearance vs work letter station, site-to-site staff transfers, and scanned attendance upload).
**Requirements**: REQ-SPEC-001, REQ-SPEC-002, REQ-SPEC-003
**Depends on:** Phase 14
**Success Criteria** (what must be TRUE):
  1. TypeScript compilation passes cleanly (`npx tsc --noEmit`) with 0 errors across all existing and newly created components.
  2. Technical Manager cockpit features the exact 7-column Finance & Store tracking grid (`Site`, `Item requested`, `Requested employee`, `Low stock items`, `Issued type`, `Returned`, `Damaged`) and role navigation (Overview, HR/Divisions, Finance & Store, Worksite, Attendance, Settings).
  3. CEO Dashboard displays the full 36-KPI matrix (12 HR, 12 Store, 12 Finance) formatted in ETB with explicit calculation formulas and benchmarks, and includes the CEO Settings modal (Theme, Color, Language, Password, Profile).
  4. HR Overview dashboard implements the interactive 4-segment Work Distribution donut with drilldown, 5-alert "Need Attention" triage card, Employees Summary Table with grouped Deduction/Increment % salary adjustments, and 3 team workspace cards (HR, Finance, Property).
  5. Exit Employee view implements the split two-panel layout (Clearance checklist on left, Work Letter generator on right).
  6. Operations Worksite view features 4 KPI cards, Unassigned staff dock, and site-to-site staff transfer module.
  7. Operations Attendance view provides scanned attendance sheet upload dropzone with preview.
  8. Operations Leave view enforces multi-tier sign-off workflow (Head of Dept + CEO/Management).
  9. Setting screen features HR system rules: 60-day probation, Leave +1 day/year tenure rule, work shifts, leave types.
  10. All created and modified components adhere strictly to the $\le 250$ line budget and Warm Earth design tokens (`#F2C46A`, `#4C4541`, `#FCF0DA`, `#AEAC78`).

**Plans:** 3 plans

Plans:
- [x] 15-01: Core Type Safety, Pre-requisite Repairs & Technical Manager 7-Column Tracking Cockpit (REQ-SPEC-001).
- [x] 15-02: CEO Executive Observatory & Complete 36-KPI Matrix in ETB (REQ-SPEC-002).
- [x] 15-03: 9-Screen HR & Operations Wireframe Blueprint Realization (REQ-SPEC-003).

---

### Phase 14: Enterprise Workforce Scale (600 Staff), Persona-Fit Site Deployment, Smart Attendance Grid & HR Document Suite

**Goal:** Scale the operational workforce model to 600 employees across 4 divisions (Security 60%, Cleaning 28%, Property Management 10%, Head Office 2%) with Permanent/Contract classification, introduce Fayda ID & QR verification, implement Operations Manager persona-fit site governance with HR acknowledgment gating, build a smart daily attendance sheet with Excel upload, enable searchable leave booking, consolidate navigation by folding 'Other' into HR, and provide a 100% editable bilingual work letter document writer.
**Depends on:** Phase 12, Phase 13
**Requirements:** REQ-HR-014, REQ-HR-015
**Success Criteria** (what must be TRUE):
  1. Total workforce scaled to 600 employees across divisions (Security 360, Cleaning 168, Property Management 60, Head Office 12); clicking the "Assigned Staff" card displays a classification modal breaking down Permanent vs Contract staff per division.
  2. Employee directory includes division filter (All, Security, Cleaning, Property Management, Head Office, Previous Employees). Previous employees display Exit Reason and Rehire Eligibility flag (`Eligible to Return` vs `Ineligible / Blocked`).
  3. Employee detail includes 16-digit Fayda ID, unique QR code placeholder, and an automated KPI engine (Attendance % + 1-5 Customer Rating) calculating action flags (`Give Raise`, `Assign Training`, `Warning`, `On Track`).
  4. Recruitment captures Fayda/Kebele ID and includes role-specific interview questionnaires (Security, Cleaning, Property Mgt) with background vetting and scoring.
  5. Work sites are governed by Operations Manager with Site Categories (Bank, Apartment, Hotel, Bureau, Commercial, Hospital); Operations Manager performs Persona-Fit Assessment (fitness, health, proximity, background); submitted deployments enter `Pending HR Acknowledgment` and activate only after HR confirmation.
  6. Attendance includes a daily spreadsheet-style manual entry sheet filterable by Site/Division and Date with smart suggestions (1-click mark present, shift detection, shortage alerts) and Excel sheet upload.
  7. Leave management provides quick searchable employee lookup and booking across statutory leave types with immediate balance deduction.
  8. Sidebar consolidates "Other" items directly into the HR hierarchy; Employee Exit links to an interactive Document Writer generating pre-filled, 100% editable bilingual work letters (Certificate of Service, Exit Clearance, Recommendation).
  9. All components adhere strictly to the $\le 250$ line budget and Warm Earth design tokens.
  10. TypeScript compilation passes cleanly (`npx tsc --noEmit`) and production build succeeds.

**Plans:** 2 plans

Plans:
- [ ] 14-01: 600-Staff Workforce Scaling, Permanent/Contract Classification, Fayda & QR Verification, Recruitment Questionnaires & Operations Persona-Fit Deployment Gate (REQ-HR-014).
- [ ] 14-02: Smart Daily Attendance Grid & Excel Upload, Searchable Leave Booking, Sidebar Consolidation & Editable Work Letter Document Writer (REQ-HR-015).
