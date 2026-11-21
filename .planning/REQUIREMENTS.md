# Requirements: HAB Business PLC ERP

## System Design & Branding

### REQ-DS-001: Warm Earth Brand Palette Specification
The application interface shall implement the Warm Earth design system palette across all client views and management workflows:

1. **Primary Brand Accent (`#F2C46A`):**
   - The primary brand color `#F2C46A` (Golden Honey) shall be applied to all primary interactive elements (primary action buttons, active navigation indicators, active tabs, metric badges, and focus rings).
   - In accordance with WCAG 2.1 AAA contrast guidelines, all elements with background `#F2C46A` shall use `#4C4541` (Deep Espresso) for foreground text and icons (measured contrast ratio 6.8:1). Foreground white (`#FFFFFF`) on `#F2C46A` is prohibited.

2. **Typography & Dark Shell (`#4C4541`):**
   - `#4C4541` (Deep Espresso) shall serve as the primary text color in light mode and the structural dark surface anchor in dark mode.

3. **Secondary Domain & Categorization (`#AEAC78`):**
   - `#AEAC78` (Sage Green) shall be used for secondary category chips, department filters (e.g. Cleaning vs. Security), and subtle interface borders.
   - Core operational alert states shall maintain dedicated semantic colors: Emerald (`#047857`) for verified check-in & approved payroll; Amber (`#B45309`) for pending requests; Rose (`#BE123C`) for disciplinary holds and alerts.

4. **Light Surface Chrome (`#FCF0DA`):**
   - `#FCF0DA` (Warm Linen) shall be the background color for the application sidebar, top navigation bar, and enterprise data table headers in light mode.

---

## Access Control & Authentication

### REQ-AUTH-001: 4-Role Access Control & Dedicated Authentication
The system shall restrict access to 4 distinct operational personas with dedicated credentials:
1. **Personas & Default Credentials**:
   - **Super Admin (`admin`)**: Initial password `hab2026`. Sole authority to configure system master setups, tax/pension parameters, and manage user accounts/passwords.
   - **CEO Overview (`ceo`)**: Initial password `hab2026`. Executive read-only oversight across all operational dashboards, attendance, and payroll aggregates without record edit capabilities.
   - **Human Resource (`hr`)**: Initial password `hab2026`. Authority over employee dossiers, recruitment, deployments, daily attendance, leave requests, exit clearances, and service certificates. Blocked from finance payroll calculations and system master setups.
   - **Finance (`finance`)**: Initial password `hab2026`. Authority over the 30-day payroll sheet, statutory deductions, bank remittances, finance clearance sign-offs, and central store asset valuation. Blocked from HR dossiers and system master setups.

2. **Authentication Flow**:
   - The application shall require valid credential matching (username or corporate email with password) via `LoginView`.
   - The dev-mode top role switcher bar (`RoleAccessBar`) shall be removed from the standard authenticated app shell.
   - Sign-out shall clear active session state and return the user to the login screen.

3. **Super Admin Credential Management**:
   - The System Master Setup view shall provide a dedicated credential management panel allowing the Super Admin to update usernames, display names, and passwords, persisted in client storage (`localStorage`).

---

## Operational Modules & Workflows

### REQ-MOD-001: HR Master Table, Recruitment, Transfers & Automated Leave
The application shall implement streamlined HR operational management:
1. **HR Scope & Controls**:
   - Remove store inventory sections/tabs from the HR module.
   - Provide monthly payment & increment oversight metrics.
   - Display attrition analytics in a dedicated pie chart format alongside workforce distribution.
2. **Slide One — Employee Master Record Table**:
   - Main table configured with columns: `[Employee Name/ID | HR Profile | Pay Record | Leave Days | Overtime Record | Site | KPI]`.
   - Support interactive drill-down inspection for profile, compensation, leave balances, and KPI scores.
3. **Recruitment & Workforce Workflows**:
   - Track onboarding status into two explicit stages: `Probation` and `Finished Probation`.
   - Provide clickable Assigned Employee drill-down: `[Assignment | Quantity | Location / Site]`.
   - Link applicant records directly to candidate CV and personal profile.
   - Support existing employee document generation for `Work Letter` and `Clearance`.
   - Include a Performance Evaluation scoring module under HR.
4. **Transfer & Leave Management**:
   - Transfers shall require an approvable workflow with explicit approval states and site location tracking.
   - Leave module shall split into `Request` (applications) and `Available` (remaining balance per employee).
   - Approving a leave application shall automatically deduct the approved days from the employee's active leave balance.

### REQ-MOD-002: Finance, Store, Management Dashboards & Copilot
The application shall implement finance compliance, store tracking, executive dashboards, and AI intelligence:
1. **Finance & Payroll**:
   - Salary calculation table with columns: `[Name | Position | Basic | Non-Taxable Allowance | Taxable Allowance | Gross | Income Tax | Pension (7% / 11%) | Net]`.
   - Statutory compliance tracking for VAT, Income Tax, Pension (7%/11%), and Withholding tax.
   - Dashboard cash & cheque tracking: debited/credited cheques and aggregate totals across Petty Cash and Cheques.
   - Support HR attendance attachments, on-leave employee access, and material depreciation tracking `[Item | Price | Quantity]` with product coding and Excel export.
2. **Store Module**:
   - Daily Issue / Receive movement logs.
   - Asset monitoring and minimum store stock level alert thresholds.
3. **Executive & Technical Dashboards**:
   - CEO / GM Dashboard: High-level summaries for Recruitment General, Finance General, and Store General.
   - Technical Manager Dashboard: Categorized project sites (Active vs. Inactive), real-time available personnel, workforce attendance overview, and store available stock.
4. **Collaboration & Intelligence**:
   - Support comment writeups on employee dossiers and financial entries.
   - Integrate an interactive Copilot chatbot for routine actions and inquiries.
5. **Role Expansion**:
   - Expand credentials and access permissions to support 6 dedicated logins: `admin`, `ceo`, `hr`, `finance`, `tech`, and `store` (default password `hab2026`).

---

## Design Craft & Interface Rigor

### REQ-CRAFT-001: Design Craft, Anti-Slop & Micro-Interaction Standards
All application views and components shall implement the design-craft principles established in `charles-skills`:
1. **Anti-Slop Subtraction**:
   - Delete unnecessary hairline dividers and container nesting; rely on strict 4px grid spacing hierarchy (`gap-3` within groups, `gap-6` between groups).
   - Eliminate decorative badges, gradient borders, and generic emoji icons. Functional indicators shall use consistent Lucide line icons.
2. **Typography & Tabular Numerals**:
   - All currency (ETB), tax rates, hours, balances, and numerical quantities shall apply `tabular-nums` (`font-variant-numeric: tabular-nums`) to prevent layout shifts during updates.
   - Headings shall apply `text-wrap: balance` for clean, professional typographic rag.
3. **Contrast & Surface Hierarchy**:
   - Maintain resting state contrast between input fields (`bg-white`) and action buttons (`#F2C46A` gold CTA or `#FCF0DA` secondary), avoiding ambiguous identical white slabs.
   - Text contrast on `#F2C46A` and `#FCF0DA` shall strictly use `#4C4541` (Deep Espresso) meeting WCAG AAA.
4. **Motion & Feedback**:
   - State transitions and modal animations shall use responsive durations (100–250ms) with physics-based springs, avoiding jarring cuts or sluggish floats.

---

## Role-Based Landing Dashboards

### REQ-DASH-001: Dedicated Role-Based Landing Dashboards & Admin Perspective Switcher
The application shall implement purpose-built landing cockpits tailored per RBAC role, eliminating information leaks and highlighting domain-specific action queues:
1. **Dashboard Router & Role Scoping**:
   - The root overview (`activeTab === 'overview'`) shall route to dedicated role dashboard components based on `activeUser.role`: `HrDashboard`, `FinanceDashboard`, `StoreDashboard`, `OperationsDashboard`, and `AdminMasterDashboard`.
   - Departmental staff (`hr`, `finance`, `store`, `operations`) shall be strictly locked into their role cockpit with no option to switch perspectives.
2. **Admin & Executive Perspective Switcher**:
   - Users with `super_admin` or `executive` roles shall have a perspective switcher banner at the top of the dashboard, allowing them to preview the exact dashboard of any department or return to the comprehensive Admin Master view.
3. **Domain Integrity & Zero Data Leaks**:
   - Store and Operations dashboards shall strictly omit payroll, compensation, and confidential salary figures to maintain RBAC boundaries.
   - HR dashboard shall focus on headcount, pending leave requests, probation deadlines, and attendance flags.
   - Finance dashboard shall focus on payroll approval lifecycle, statutory tax/pension liabilities, cheque/cash registers, and asset valuation.
   - Store dashboard shall highlight low stock alerts, quarantined damaged items, pending equipment allocations, and stock movement shortcuts.
   - Operations dashboard shall highlight client site guard/cleaner deployment coverage, shift rotations, and site equipment requests.
4. **Ergonomic Layout**:
   - Each dashboard shall feature a top KPI row with high-contrast metric tiles (`tabular-nums`) and a prioritized "Needs Attention" Action Queue with one-click deep-links to destination workflow tabs.
   - Every dashboard component shall adhere to the strict 250-line limit and Warm Earth design tokens (`#F2C46A`, `#4C4541`, `#FCF0DA`, `#AEAC78`).

---

## Internationalization & Localization (i18n)

### REQ-I18N-001: Zero Hardcoded UI Text & Modular Dual-Language (EN/AM) System
The application interface shall eliminate all hardcoded UI copy and deliver complete bilingual (English and Amharic) parity powered by a modular `i18next` architecture:
1. **Zero Hardcoded Text In UI**:
   - All user-facing strings across all views, modals, forms, tables, buttons, tooltips, toasts, and alerts shall be queried through `useTranslation` (`t('namespace.key')`).
   - Hardcoded string literals in JSX and inline ternary language switches (e.g., `i18n.language === 'am' ? ... : ...`) are strictly prohibited.
2. **Modular Architecture & File Budget**:
   - Translation dictionaries shall be organized by domain under `src/i18n/modules/` (`common`, `nav`, `dashboard`, `deployment`, `attendance`, `clearance`, `payroll`, `store`, `recruitment`, `masterSetup`).
   - `src/i18n/index.ts` shall act as the single consolidated entrypoint and registry, maintaining compliance with the <= 250 lines file budget.
3. **Strict TypeScript Type Safety**:
   - Global typing for `i18next` via `CustomTypeOptions` shall be enforced in `src/i18n/types.ts` so that invalid or missing translation keys trigger TypeScript compilation errors.
4. **Data vs. UI Boundary**:
   - Dynamic user-generated data, employee names, national IDs, and mock backend records shall remain typed data entities; all static field labels, table headers, and status badges shall be internationalized.
5. **Amharic Typography & Ge'ez Support**:
   - All Amharic translations shall use authentic, professional Ethiopian HR/legal terminology (aligned with Labor Proclamation No. 1156/2019) and appropriate Ethiopic typography rendering.

---

## Executive Observatory & Departmental Management Cockpits

### REQ-EXEC-001: CEO Executive Observatory & 36-Parameter Performance Health Matrix
The application shall implement the CEO / Super Admin Executive Overview matching the wireframe architecture:
1. **Headline Metrics & Triage Rail**:
   - Top 4 KPI Cards: Total Active Workforce (250 employees), Monthly Revenue (ETB 8,000,000), Active Contracts, and Pending Executive Approvals.
   - 3-State Management Notification Rail: `Attention` (urgent contract reviews, overdue invoices, min stock alerts), `Ready` (Finance approved disbursements, HR probation confirmations), and `On Track` (active recurring contracts).
2. **Department Summary & 36-Parameter Scorecards**:
   - Master summary table listing all departments (HR, Store, Finance, Operations/Technical) with high-level Key Indicators and overall RAG health status (`Active / Good / Need Attention`).
   - One-click expandable scorecard drawers displaying the full 12 performance parameters for each department (36 total KPIs) with target formulas, CEO benchmark targets (e.g., HR: 95% deployment, 96% attendance, 3% turnover; Store: ETB 3.5M inventory, 95% availability, 5% stock-out; Finance: ETB 8M revenue, ETB 6.2M opex, 22.5% profit margin, 92% budget utilization), and live calculated variance.

### REQ-EXEC-002: Integrated In-Place Super Admin Editing & Audit Trail
Super Admin and Executive users shall have unconstrained operational management capabilities across all departmental cockpits:
1. **In-Place Modification Rights**:
   - When the Super Admin navigates into HR, Store, Finance, or Operations via the perspective switcher, all data tables, action drawers, and status toggles shall be active and editable in-place (no read-only lockdowns for Super Admin).
2. **Audit Trail & Attribution**:
   - Every state mutation, salary adjustment, inventory write-off, or status override executed by the Super Admin shall automatically stamp an audit log entry recording actor ID (`mgmt-super-admin`), timestamp, previous value, and new value.

### REQ-EXEC-003: Sequential 3-Stage Cross-Department Exit Clearance System
The application shall enforce an unbroken 3-stage sequential gating process for employee exits across HR, Store, and Finance:
1. **Stage 1 (HR Initiation)**: HR flags an employee for exit, creating pending clearance records across departments.
2. **Stage 2 (Store Asset Verification)**: Store management verifies and checks off whether all issued tools, uniforms, and equipment have been returned (`Waiting` vs `Finished` tabs). Finance clearance remains locked until Store confirms asset return.
3. **Stage 3 (Finance Liquidation & Suspense Clearance)**: Once Store clearance passes, Finance calculates liquidation date, deductions, and suspense settlement (`Waiting` vs `Finished` tabs), syncing the final settlement amount back to HR.
4. **Final Sign-off**: Super Admin receives the completed clearance dossier in the Executive Notification Rail for final archival approval.

### REQ-EXEC-004: Field Technical Dispatch & Departmental Wireframe Parity
The application shall update departmental cockpits to align with the team's wireframe specifications:
1. **Technical Manager & Operations Cockpit**:
   - Top KPI cards: Active Sites, Deployed Personnel, Total Work Orders, Store Requests.
   - Dual-tier Technical Alert panel: `Urgent` (Equipment breakdown, site emergencies) and `Pending` (Stock requests, deployed staff, preventive maintenance schedule).
   - Work request dispatch table with service type, assigned field team, and real-time status.
   - Site inventory tracking showing requested items, requesting employees, low stock items, issued type, returned, and damaged items.
2. **Attendance Management Cockpit**:
   - Top counters for Present, Late, and Absent staff with one-click report download.
   - Direct biometric/scan attendance upload dropzone with attachment preview modal.
   - Attendance roster table recording employee, upload date, work site, check-in/out timestamps, scan attachment link, and approval status.
3. **Finance & Store Wireframe Alignment**:
   - Finance dashboard featuring Monthly Revenue vs Expense Trend bar chart, Operational Expense Breakdown pie chart, overdue alerts, and statutory tax/VAT/WHT policy settings.
   - Store dashboard featuring Total Stock, Issued Stock, Fixed Asset Valuation, Stock Allocation donut chart, and Minimum Stock Alert quick list.

---

## 16-Column Payroll Engine & Cross-Department Attendance Integration

### REQ-PAY-002: Grouped 16-Column Multi-Tier Table, Dynamic Allowance Splitting & HR Attendance Sync
The payroll calculation system and UI shall implement the exact architecture specified in the team's hand-drawn wireframe:
1. **Two-Tier Grouped Column Structure**:
   - Header Tier 1: `ID` | `Employee` | `Working Days` | `Basic Salary` | `Allowance` | `Gross Pay` | `Deductions` | `Net Salary` | `Employer Pension (11%)` | `Actions`.
   - Header Tier 2 (Sub-headers):
     - Under `Allowance`: `Non-taxable` (Exempt) | `Taxable`.
     - Under `Deductions`: `Income Tax` | `Pension (7%)` | `Other Deductions`.
   - Hover and drawer popovers detailing specific itemized allowances (Transport, Mobile, Housing, Overtime).
2. **Dynamic Statutory Allowance Exemption Engine**:
   - System automatically partitions employee allowances into non-taxable and taxable portions based on active settings thresholds:
     - Transport allowance exempt up to **ETB 1,600** per month; excess amount is treated as taxable.
     - Mobile / communication allowance exempt up to **ETB 2,000** per month; excess is treated as taxable.
   - Taxable income for Schedule 'A' progressive brackets is strictly: $\text{Earned Basic} + \text{Taxable Allowance} + \text{Overtime}$.
   - Employer Pension (11%) is calculated strictly as $11\% \times \text{Earned Basic}$ and presented as a non-deductible company contribution.
3. **HR Attendance Sync & Excel Reconciliation**:
   - Finance Payroll workspace shall include an **"Import Attendance"** modal with two workflows:
     - **"Sync from HR" (1-Click Live Import)**: Pulls active month's attendance records from HR, calculating payable working days ($30 - \text{unexcused absences}$), honoring approved leaves (Annual Leave, Sick Leave, Bereavement) as fully paid days.
     - **"Upload Attendance Excel"**: Allows uploading and reconciling an external spreadsheet containing `[Employee ID, Present Days, Absent Days, Leave Days]` with an available template download.
   - Proration applies standard 30-day Ethiopian basis: $\text{Earned Basic} = \frac{\text{Basic Salary}}{30} \times \text{Payable Days}$.
4. **Approval Immutability & File Budget**:
   - Draft payroll periods dynamically recalculate when settings or attendance changes occur. Approved historical months remain immutable for audit integrity.
   - All components adhere strictly to the $\le 250$ line budget and Warm Earth token styling.

---

## Enterprise Workforce Scale (600 Staff), Operations Site Governance & HR Suite

### REQ-HR-014: 600-Staff Division Scaling, Fayda/QR Identification & Persona-Fit Deployment Gate
1. **Workforce Distribution & Contract Breakdown**:
   - Total workforce calibrated to 600 employees distributed across divisions:
     - Security: 60% (360 staff)
     - Cleaning: 28% (168 staff)
     - Property Management: 10% (60 staff)
     - Head Office: 2% (12 staff)
   - Clicking the "Assigned Staff" card displays a classification breakdown modal:
     - Permanent vs. Contract employees per division and overall company.
     - Roster inspection filterable by division and contract status.
2. **Employee Directory, Fayda ID, QR & KPI Flagging**:
   - Division filter on Employee Directory: `All Divisions`, `Security`, `Cleaning`, `Property Management`, `Head Office`, and `Previous Employees`.
   - 16-digit Ethiopian Fayda National ID and Kebele residence tracking per employee.
   - Unique scannable QR Code placeholder in employee profile detail.
   - Automated KPI Engine: Combines Attendance % + Customer Comments rating (1–5 scale) to auto-calculate composite score and assign actionable flags:
     - `Give Raise` (High attendance + high customer rating)
     - `Assign Training` (Moderate score or skill refinement needed)
     - `Warning` (Poor attendance or low customer rating)
     - `On Track` (Standard performance)
   - For Previous Employees: Records Exit Reason + Rehire Eligibility flag (`Eligible to Return` vs `Ineligible / Blocked`).
3. **Recruitment Questionnaires & Background Vetting**:
   - Captures Fayda or Kebele ID on new applicants.
   - Division-specific interview evaluation questionnaires (Security: fitness, alertness, discipline; Cleaning: sanitization, chemicals, reliability; Property Mgt: technical, maintenance) with background vetting and scoring.
4. **Operations Manager Site Governance & Persona-Fit Deployment**:
   - Transfer work site creation and deployment permissions exclusively to the Operations Manager role.
   - Establish Site Categories: `Bank`, `Apartment`, `Hotel`, `Bureau`, `Commercial`, `Hospital`.
   - Persona-Fit Assessment tool matching candidate attributes (physical fitness, medical health clearance, commute proximity to site area, background history) against site requirements.
   - Handshake Gate: Ops Manager deployment submits to `Pending HR Acknowledgment`; HR reviews and acknowledges before attendance and payroll track against that client site.

### REQ-HR-015: Smart Daily Attendance Grid, Searchable Leave & Bilingual Exit Document Writer
1. **Smart Daily Attendance Sheet & Excel Upload**:
   - Daily spreadsheet-style entry sheet filterable by Site (or Division) and Date.
   - Smart suggestions: 1-click "Mark All Scheduled as Present", auto-detects approved leaves, flags headcount shortages against site quota.
   - Excel upload from daily sheets with immediate preview and commit.
   - Header summary cards: Monthly/Weekly Overall Attendance Rate, Total Present, Total Absent, Punctuality Rate.
2. **Searchable Leave Booking**:
   - Fast autocomplete search for any active employee.
   - Select statutory leave type (Annual, Sick, Compassionate, Maternity/Paternity, Unpaid) with date range and automated balance deduction.
3. **Sidebar Consolidation & Work Letter Document Writer**:
   - Remove separate "Other" tab from the sidebar; integrate its items (`clearance`, `experience`, `master-setup`, `audit`) directly into the HR menu hierarchy.
   - Interactive Work Letter Document Writer supporting pre-filled bilingual (Amharic & English) templates:
     - Certificate of Service / Work Experience Letter (የስራ ልምድ ማስረጃ)
     - Exit Clearance Certificate (የክሊራንስ ማስረጃ)
     - Letter of Recommendation (የምስክር ወረቀት)
   - All text inside templates is 100% in-place editable before printing or exporting.

---

### REQ-ATT-002: Digital Fayda QR Identification & Smart Attendance Scanner Terminal
1. **Fayda ID Capture & Auto-Generation (`AddEmployeeModal`)**:
   - Field for 16-digit Ethiopian Fayda National ID (`ET-FAYDA-XXXX-YYYY-ZZZZ`) with format validation.
   - 1-click "⚡ Auto-Generate Fayda ID" button to populate a valid national ID during live demonstrations.
2. **Scannable Digital QR Employee Badge (`SlideOneDrawer` / `EmployeeQrBadgeModal`)**:
   - Scalable, high-contrast scannable QR badge containing employee verification payload (`employeeCode`, `faydaNumber`, `fullName`, `serviceType`, `siteName`).
   - Scannable by standard mobile phone cameras and the in-app scanner.
   - Printable/previewable digital staff identity card with HAB Business PLC branding and Warm Earth tokens.
3. **Smart Attendance Scanner Terminal (`AttendanceView`)**:
   - Interactive "Scan QR Badge" terminal with dual modes:
     a) Live web camera feed (`navigator.mediaDevices.getUserMedia`) with animated targeting radar.
     b) "Quick Demo Scan" selector allowing instant 1-click simulation for any employee on stage.
   - Dual-scan daily cycle:
     - Scan 1 (Clock-In): Verifies Fayda ID against registry, records employee as `Present` with check-in time stamp.
     - Scan 2 (Clock-Out): Records departure time, computes shift duration, and automatically logs overtime hours exceeding standard 8-hour shift under Ethiopian Labor Proclamation No. 1156/2019.
   - Real-time updates to daily attendance statistics badges and attendance table.


---

### REQ-RBAC-002: Dynamic Tab-Based Access Matrix & Navigation Filtering
The application shall implement dynamic tab-based role-based access control (RBAC) eliminating 403 Forbidden screens:
1. **Navigation Tab Filtering**:
   - The application navigation sidebar shall strictly render only the tabs that the active authenticated user is authorized to view.
   - Any tab not in the user's effective permissions list shall be completely hidden from the sidebar.
   - When all child items within a parent navigation section (e.g. Operations, HR, Finance & Store) are hidden, that section header/accordion shall automatically hide as well.
2. **Zero 403 Error Fallback & Auto-Redirect**:
   - The application shall eliminate dead-end 403 Forbidden screens during normal navigation.
   - If a user attempts to access an unauthorized tab via URL, direct link, or after an administrative permission revocation, the system shall automatically redirect them to the safe default (`overview`) view.
3. **Single Source of Truth & Hierarchical Overrides**:
   - Tab permissions shall be calculated via a unified single calculation engine:
     `Effective Tabs = (Role Baseline Tabs + User-Specific Grants) - User-Specific Revocations`
   - Super Admin accounts are safeguarded with permanent, non-revocable full access (`ALL`).
4. **Dedicated System Master Setup Access Matrix**:
   - System Master Setup shall feature a dedicated "Access & Role Matrix" subtab providing an interactive side-by-side grid.
   - Super Admins can toggle allowed tabs per Role (Role Baselines) and assign granular overrides per User account (User Overrides).
   - Changes are persisted in `SystemMasterConfig` with 1-click "Reset to Baseline Defaults" and immediate live synchronization with the active session.

---

### REQ-SYS-001: Super Admin System Settings & Automated Probation-to-Permanent Lifecycle
The application shall implement a dedicated Super Admin System Settings module and operational lifecycle integration based on team wireframe Image 1 and Image 7:
1. **Dedicated System Settings View (`SystemSettingsView`)**:
   - Dedicated top-level navigation item under Super Admin with two tabbed control centers:
     - **Tab 1: Appearance & Security**:
       - Theme selection (`Light`, `Dark`, `System`) with immediate reactive theme application.
       - Accent color selection from Warm Earth palette (`#F2C46A`, `#AEAC78`, `#4C4541`, `#3B82F6`).
       - Language switcher toggling between **English** and **አማርኛ** across all UI labels.
       - Credential manager allowing Super Admin to update administrative passwords and reset departmental demo accounts (`admin`, `hr`, `finance`, `store`, `operations`, `ceo`).
     - **Tab 2: HR & Labor Rules**:
       - Probation duration input (default `60 days` / 2 months) governing probation countdowns.
       - Editable Annual Leave progression formula with inputs for Base Days (default 16), Years per step (default 1 or 2), Increment per step (default 1 day), and Max Cap (default 30 days).
       - Standard working hours & shift times (8 hrs/day, 48 hrs/week, 24h ON / 48h REST security rotation).
       - Statutory leave categories (Annual, Sick, Maternity/Paternity, Compassionate, Unpaid) with paid/unpaid status and approval tier thresholds.
2. **Onboarding Roster Integration & 1-Click Permanent Confirmation (`OnboardingView`)**:
   - Visual probation tracker showing days elapsed vs. configured probation duration.
   - Visual milestone alert when probation period completes: `Due for Permanent Confirmation`.
   - 1-Click action button: `⚡ Confirm Permanent Status`:
     - Updates employee record `probationStatus: 'Completed'` and `contractType: 'Permanent'`.
     - Appends an entry to the Audit Log.
     - Automatically updates workforce distribution permanent vs. contract counts.
3. **Dynamic Leave Balance Recalculation (`LeaveManagementView`)**:
   - Automatically computes each employee's statutory annual leave entitlement using the active formula settings:
     $$\text{Entitlement} = \min\left(\text{Base Days} + \left\lfloor \frac{\text{Tenure Years}}{\text{Years per Step}} \right\rfloor \times \text{Increment Days},\; \text{Max Cap}\right)$$
   - Live synchronization when settings are updated by Super Admin.

