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
