# Context: Phase 3 — HR Operations, Slide One Ledger & Automated Leave

## Background & Scope
Derived from the comprehensive ERP functional specifications exploration, Phase 3 establishes the primary workforce management workflows:
1. **Slide One Master Table**: Central landing data grid replacing fragmented employee lists.
2. **Centralized Recruitment & Onboarding**: Tracking probation milestones, applicant CVs, and interactive assignment drill-downs.
3. **Approvable Transfers & Site Tracking**: Structured approval workflow for field relocations.
4. **Automated Leave Balance Deductions**: Dual-tab leave view with automated balance deductions on approval.
5. **HR Visual Analytics & Access Scope**: Attrition pie chart, workforce distribution, salary increment oversight, and removal of store tab.

---

## Key Feature Requirements

### 1. Slide One — Employee Master Record Table
- **Location**: Default view of `EmployeeManagementView.tsx` / `SlideOneMasterTable.tsx`.
- **Columns**:
  1. `Employee`: Employee ID, Full English & Amharic Name, Avatar.
  2. `HR Profile`: Department, Designation, Employment Status, Hire Date.
  3. `Pay Record`: Current monthly salary, pay grade, increment eligibility.
  4. `Leave Days`: Remaining available annual/sick days balance.
  5. `Overtime Record`: Monthly accumulated billable OT hours.
  6. `Site`: Current deployed client facility/station location.
  7. `KPI`: Overall performance score (e.g. 92%, Rating badge).
- **Interactivity**: Clicking any cell or row opens an interactive inspection drawer for that specific category.

### 2. Centralized Recruitment & Assignment Drill-Down
- Centralized recruitment intake (no per-department requisitions).
- **Two-Stage Onboarding**:
  - `Probation`: Active trial period tracking with review date.
  - `Finished Probation`: Confirmed permanent employees.
- **Assigned Employee Interactive Record**:
  - Clicking on assigned employee opens a modal/drill-down table:
    - Columns: `Assignment (Role/Gear/Asset)` | `Quantity` | `Location / Site`.
- **Applicant Data**: Direct link/preview of candidate CV and personal profile.
- **Official Documentation**:
  - `Work Letter`: Formal employment verification and tenure letter generator.
  - `Clearance`: Exit clearance status and sign-off initiation.
- **Performance Evaluation**:
  - Dedicated evaluation rating card with conduct ratings, core competencies, and manager feedback.

### 3. Transfer & Operations Tracking
- **Approvable Workflow**:
  - Transfer requests have explicit statuses: `Pending Approval`, `Approved`, `Rejected`.
  - HR Manager / Operations can approve or reject transfer requests.
- **Site / Location Tracking**:
  - Source site and destination site must be explicitly specified and tracked.

### 4. Leave Management & Automated Deductions
- **Dual Sub-Views**:
  - `Request`: Leave application queue (pending, approved, rejected) with date range, leave type, and reason.
  - `Available`: Searchable directory of all employees with their remaining leave balances (Annual, Sick, Compassionate).
- **Automated Balance Deduction**:
  - When an HR manager clicks "Approve" on a leave request, the system automatically subtracts the requested days from the employee's available leave balance in real-time.

### 5. HR Dashboard & Access Clean-up
- Remove Store tab/visibility from HR role (`roleConfig.ts`).
- Monthly payment oversight card (aggregate payroll cost for increment planning).
- Attrition Analytics: Rendered as a dedicated Pie Chart.
- Workforce Distribution chart.
