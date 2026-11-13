---
title: ERP Modules & Functional Specifications
date: 2026-11-13
context: Socratic ideation session establishing full functional requirements for HR, Leave, Finance, Store, Executive/Technical dashboards, and Copilot intelligence
status: settled
---

# HAB Business PLC ERP — Module & Functional Specifications

## 1. System Access & 6 Core Personas

The system expands from the initial 4 accounts to **6 dedicated operational personas**, each with pre-seeded credentials (default password `hab2026`) and persistent local storage:
1. **Super Admin (`admin`)**: System Master Setup, company profiles, deduction parameters, and user account management.
2. **CEO / GM Overview (`ceo`)**: Executive read-only high-level summaries for Recruitment, Finance, and Store operations.
3. **HR Management (`hr`)**: Slide One master ledger, recruitment pipelines, documentation, performance evaluations, transfers, and leave management. *(Store module removed from HR scope)*.
4. **Finance & Payroll (`finance`)**: 9-column payroll sheet, statutory taxes/pensions, cash & cheque debit/credit tracking, attendance attachments, and material depreciation.
5. **Store Keeper (`store`)**: Daily issue/receive registers, company asset control, and minimum stock level alerts.
6. **Technical Manager (`tech`)**: Operational site tracking (Active/Inactive), available personnel, workforce attendance, and store available stock overview.

---

## 2. Module Functional Specifications

### 2.1 Human Resources (HR) Module
- **Dashboard & Controls**:
  - Remove Store section/tab entirely from HR module.
  - Monthly payment & increment oversight (enables HR to assess and manage salary increments).
  - Attrition Analytics: Presented as a dedicated Pie Chart.
  - Workforce Distribution analytics retained.
- **Slide One — Employee Master Record Table**:
  - Primary default landing view for HR.
  - Columns: `[Employee Name/ID | HR Profile | Pay Record | Leave Days | Overtime Record | Site | KPI]`.
  - Interactive drill-down drawers for profile details, pay records, leave balances, and KPI scores.
- **Recruitment & Workforce Workflows**:
  - Centralized recruitment (no per-department requisitions).
  - New Employee Onboarding split into two stages: `Probation` and `Finished Probation`.
  - Assigned Employee Record: Interactive drill-down modal showing `[Assignment | Quantity | Location / Site]`.
  - Applicant Data: Direct links to candidate CV and personal profile.
  - Existing Employee Document Generation: `Work Letter` and `Clearance`.
- **Performance Management**:
  - Structured Performance Evaluation scoring module.

### 2.2 Transfer, Operations & Leave Management
- **Transfer & Site Operations**:
  - Approvable Transfer Workflow: Transfers carry explicit approval states (`Pending`, `Approved`, `Rejected`).
  - Operation / Site Location: Every movement tracks a known client facility or project site.
- **Leave Management**:
  - Dual Sub-Views: `Request` (pending and historic applications) and `Available` (current employee leave balances).
  - Balance Visibility: Available annual, sick, and compassionate leave days displayed per employee.
  - Automated Deduction: Approving a leave application automatically deducts the approved days from the employee's active balance.

### 2.3 Finance Module
- **Payroll & Salary Calculation Table**:
  - Columns: `[Name | Position | Basic | Non-Taxable Allowance | Taxable Allowance | Gross | Income Tax | Pension (7% / 11%) | Net]`.
- **Tax, Statutory & Cash Controls**:
  - Statutory tracking: VAT, income tax, pension (7% employee, 11% employer), and withholding tax collections.
  - Cash & Cheque Dashboard: Real-time debited and credited cheque tracking, displaying aggregate balances across `Petty Cash` and `Cheque`.
- **HR Integration & Material Depreciation**:
  - On-leave employee visibility for payroll adjustments.
  - Attendance attachment: Ability to upload/attach HR attendance registers.
  - Material Depreciation: Track asset depreciation over time with attributes `[Item | Price | Quantity]`, product coding, store availability, and Excel export.

### 2.4 Store Module
- **Daily Movements**: Daily Issue / Receive register with dates, quantities, and recipient tracking.
- **Asset Control**: Company property and capital equipment tracking.
- **Minimum Stock Alerts**: Threshold monitoring with visual low-stock alerts.

### 2.5 Executive & Technical Dashboards
- **CEO / General Manager Dashboard**:
  - High-level bird's-eye metrics: `Recruitment General`, `Finance General`, and `Store General`.
- **Technical Manager Dashboard**:
  - Site Status: Categorized project sites split into `Active` and `Inactive`.
  - Available Employees: Real-time count and list of unassigned/available personnel.
  - Attendance: Division-wide roll call and attendance status.
  - Store Available Stock (General): High-level inventory overview.

### 2.6 Collaboration & Copilot Intelligence
- **Comment Writeups**: Contextual comment threads on employee records and finance entries.
- **Integrated Copilot / Chatbot**: AI routine assistant for instant lookups, policy questions, and quick actions.

---

## 3. Phased Delivery Roadmap

- **Phase 3: HR Operations, Slide One Ledger & Automated Leave** (Sections 1 & 2):
  - Deliver Slide One master table, recruitment 2-stage probation & drill-down, approvable transfers, leave automated deduction, and store removal from HR.
- **Phase 4: Finance, Store, Management Dashboards & Copilot** (Sections 3, 4, 5 & 6):
  - Deliver 9-column payroll, cheque/cash dashboard, material depreciation with Excel export, store issue/receive & min stock alerts, Technical Manager & CEO dashboards, comment writeup, Copilot chatbot, and 6-user login expansion.
