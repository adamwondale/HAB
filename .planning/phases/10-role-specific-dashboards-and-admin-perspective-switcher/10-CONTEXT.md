# Phase 10 Context: Role-Specific Dashboards & Admin Perspective Switcher

## Goal
Implement purpose-built, domain-specific landing dashboards for the 5 RBAC personas (HR, Finance, Store, Operations, Admin/CEO), eliminate sensitive data leakage across departments, integrate action queues with deep-links, and enable an administrative perspective switcher for leadership.

## User Decisions & Constraints
1. **Dedicated Landing Cockpits**:
   - Each role gets its own tailored dashboard upon logging in (`activeTab === 'overview'`).
   - Store and Operations dashboards MUST NEVER display or import payroll or employee compensation figures.
2. **Admin & Executive Perspective Switcher**:
   - Regular staff (`hr`, `finance`, `store`, `operations`) are role-locked to their respective dashboard.
   - `super_admin` and `executive` (CEO) see a top perspective switcher banner allowing them to view any department dashboard (`HR`, `Finance`, `Store`, `Operations`) or return to the `Admin Master Overview`.
3. **Ergonomics (KPI Metrics + Action Queues)**:
   - High-contrast KPI metric cards with `tabular-nums`.
   - Action Queue ("Needs Attention") with one-click deep-links to destination tabs (`management`, `payroll`, `store`, `deployment`, `leave`).
4. **Strict File Budget**:
   - Every modified or created file must remain strictly under 250 lines.
   - Decompose into `DashboardRouter.tsx`, `HrDashboard.tsx`, `FinanceDashboard.tsx`, `StoreDashboard.tsx`, `OperationsDashboard.tsx`, `AdminMasterDashboard.tsx`, and shared `DashboardMetricCard.tsx`.
5. **Brand Palette & Styling**:
   - Warm Earth brand tokens: `#F2C46A` (gold CTA), `#4C4541` (dark text/chrome), `#FCF0DA` (light shell), `#AEAC78` (sage).
   - High contrast: Text on `#F2C46A` must be `#4C4541` (never white).
