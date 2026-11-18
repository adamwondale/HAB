---
title: Role-Specific Dashboards & Admin Perspective Switcher Architecture
date: 2026-11-18
context: Socratic exploration of purpose-built landing cockpits tailored per RBAC role with KPI metrics, action queues, and Admin perspective switching
status: settled
---

# Role-Specific Dashboards & Admin Perspective Switcher Architecture

## 1. Overview & Problem Statement
Currently, all authenticated users in HAB Business PLC ERP land on a unified `DashboardOverview.tsx` upon logging in. While minor conditional sections exist for executives and tech managers, this shared view leaks sensitive financial aggregates (such as total monthly payroll) to unauthorized roles (Storekeeper and Operations Supervisors), while failing to surface the high-priority daily operational tasks each department needs.

Following the RBAC boundaries established in Phase 8, each role requires a dedicated, purpose-built cockpit:
- **HR**: Headcount, probation deadlines, pending leave approvals, attendance alerts.
- **Finance**: Payroll status (draft/verified/approved/disbursed), statutory liabilities, asset valuation, cheque & petty cash totals.
- **Store**: Low-stock alerts, quarantined damaged assets, equipment allocation registers, stock movement shortcuts.
- **Operations**: Active client site deployment coverage, guard/cleaner shift fulfillment, site equipment requests, attendance anomalies.
- **Admin / Executive**: Enterprise health pulse, security audit warnings, user session activity, and a **Perspective Switcher** allowing leadership to preview any department's dashboard.

---

## 2. Architectural Design

### 2.1 The Dashboard Router (`DashboardRouter.tsx`)
Instead of a monolithic dashboard file exceeding the 250-line limit:
- `DashboardRouter.tsx` inspects `activeUser.role`.
- For standard staff (`hr`, `finance`, `store`, `operations`), it automatically mounts their dedicated role component and disallows arbitrary perspective switching.
- For `super_admin` and `executive` (CEO), it renders an Admin Perspective Switcher bar at the top, allowing the administrator to either view the **Admin Master Overview** or inspect the live dashboard of any specific department (`HR`, `Finance`, `Store`, `Operations`).

### 2.2 Component Decomposition (< 250 Lines per File)
1. `src/components/dashboard/DashboardRouter.tsx`: Root switcher & perspective state (< 120 lines).
2. `src/components/dashboard/roles/HrDashboard.tsx`: Headcount distribution, pending leave queue, probation tracker, recruitment pipeline (< 220 lines).
3. `src/components/dashboard/roles/FinanceDashboard.tsx`: Payroll approval lifecycle, statutory tax/pension ledger, asset depreciation value, cheque/cash balance (< 220 lines).
4. `src/components/dashboard/roles/StoreDashboard.tsx`: Low stock warnings, equipment issue log, quarantined items, quick stock transaction deep-links (< 220 lines).
5. `src/components/dashboard/roles/OperationsDashboard.tsx`: Client site deployment fill-rates, active guard/cleaner shift rotations, site equipment requests (< 220 lines).
6. `src/components/dashboard/roles/AdminMasterDashboard.tsx`: System-wide KPI summary, audit trail security warnings, user accounts active, master config status (< 220 lines).
7. `src/components/dashboard/shared/DashboardMetricCard.tsx`: Reusable, accessible metric tile adhering to Warm Earth palette (`#F2C46A`, `#4C4541`, `#FCF0DA`, `tabular-nums`) (< 90 lines).

### 2.3 Ergonomics: KPI Metrics + Action Queues
Every role dashboard pairs two core operational layers:
1. **Top KPI Row**: 3–4 high-contrast cards showing real-time numbers with `tabular-nums` and status tone.
2. **Needs Attention / Action Queue**: Prioritized list of actionable items (e.g. "4 Leave requests pending review", "2 Equipment requests from Bole site", "1 Unapproved payroll batch") with one-click deep-links to the exact destination tab and filter.

---

## 3. Security & RBAC Invariants
1. **Strict Data Segregation**: Store and Operations dashboards MUST NEVER import or calculate `payroll` state or display salary figures.
2. **Read-Only / Privilege Checks**: Deep-link navigation buttons respect role permissions (e.g. Store users can only view equipment requests, not authorize final financial transactions).
3. **Audit Logging**: Any perspective switch by an Administrator is logged or contained within the UI session without mutating data.
