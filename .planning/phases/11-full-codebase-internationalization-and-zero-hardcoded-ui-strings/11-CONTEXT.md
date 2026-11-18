# Phase 11 Context: Full Codebase Internationalization & Zero Hardcoded UI Strings

## Goal
Transform HAB Business PLC ERP into a fully localized, bilingual application (English and Amharic) by extracting every hardcoded UI text string into modular domain namespaces under `src/i18n/modules/` re-exported by `src/i18n/index.ts`, enforcing strict TypeScript compile-time key validation.

## Background & Architecture
Currently, `src/i18n/index.ts` is a monolithic file of 302 lines that exceeds the 250-line budget and only covers a fraction of the application's UI strings. Many views throughout the codebase still contain hardcoded English literals or inline language ternaries (`i18n.language === 'am' ? ... : ...`).

To achieve complete bilingual parity and clean architecture:
1. **Modular Domain Namespaces (`src/i18n/modules/`)**:
   - `common.ts`: Universal actions (save, cancel, edit, delete, export), status badges, pagination, search placeholders.
   - `nav.ts`: Sidebar items, section headings, breadcrumbs, top navigation actions.
   - `dashboard.ts`: Metric card titles, action queues, perspective switcher labels, role cockpit copy.
   - `deployment.ts`: Client sites, post stations, guard/cleaner allocations, shift rotations.
   - `attendance.ts`: Clock-in/out, biometric status, roster filters, shifts, late/absent flags.
   - `clearance.ts`: 3-stage handover ledger, department approvals, asset return checkpoints.
   - `recruitment.ts`: Applicant stages, probation stages, candidate evaluation criteria, dossiers.
   - `payroll.ts`: 16-column sheet headers, statutory deductions (ERCA Schedule 'A', 7% / 11% POESSA pension), bank remittances.
   - `store.ts`: 7 category names, stock in/out, allocation registry, quarantine lost/damaged states.
   - `masterSetup.ts`: System master thresholds, credentials manager, division configuration.

2. **File Budget & Strict Typing**:
   - Each module file in `src/i18n/modules/` stays strictly $\le 250$ lines.
   - `src/i18n/index.ts` refactored down to $\le 100$ lines, cleanly re-exporting resources.
   - `src/i18n/types.ts` defines `CustomTypeOptions` for `react-i18next` so that all `t('namespace.key')` queries are type-checked at compile time.

3. **4 Sequential Execution Waves**:
   - **Wave 1 (Plan 11-01)**: Infrastructure (`types.ts`, `modules/*`, `index.ts`), App shell, TopBar, Sidebar, and Dashboard views.
   - **Wave 2 (Plan 11-02)**: Field Operations & Deployments (`deployment.ts`, `attendance.ts`), WorkSitesView, DeploymentView, AttendanceView, and SimpleWorkspace.
   - **Wave 3 (Plan 11-03)**: HR Workflows (`clearance.ts`, `recruitment.ts`, `hr.ts`), ClearanceView, OnboardingView, RecruitmentView, LeaveManagementView, and ManagementOrgView.
   - **Wave 4 (Plan 11-04)**: Finance, Store & Setup (`payroll.ts`, `store.ts`, `masterSetup.ts`), PayrollView, StoreManagementView, Warehouse3DView, SystemMasterSetupView, and LoginView.
