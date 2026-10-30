# HAB ERP — System Master Setup & Calculation Engine

A centralized **System Master Setup** console where Super Admins define the foundational financial, payroll, shift, leave, clearance, and inventory parameters that automatically drive calculations across every module of the HAB Business PLC Integrated ERP System.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and architectural decisions were confirmed during interactive clarification and govern how the System Master Setup operates across all ERP modules:

- **Confirmed Decision 1 — Comprehensive Master Rule Scope**: Super Admins can configure four core domain pillars:
  1. **Payroll, Tax & Pension Rules**: Ethiopian progressive income tax brackets, employer (11%) & employee (7%) pension contribution percentages, standard monthly working days (default 30 days), default allowances (Transport, Mobile Card, Housing), and food cost-sharing deductions.
  2. **Shift, Working Days & Overtime Multipliers**: Standard monthly working-day denominator, hourly overtime multipliers (Regular, Night, Weekend, Public Holiday), Security 24h/48h platoon cycle parameters, and Cleaning weekly shift rotation schedules.
  3. **Leave Quotas & Clearance Gear Penalty Table**: Annual, sick, maternity/paternity, and emergency leave day entitlements, plus standardized ETB replacement penalty fees for damaged or missing company-issued gear (radios, batons, boots, uniforms, chemical keys).
  4. **Division Salary Grades & Inventory Reorder Thresholds**: Default base salary grades (`L1`, `L2`, `L3`, `Senior`, `Supervisor`) per division and minimum safety stock reorder rules by inventory category.
- **Confirmed Decision 2 — Live Auto-Recalculation + Manual Sync**: Updating any master parameter immediately recalculates active draft/in-progress Payroll, Clearance, and Inventory records, while also providing an explicit **"Recalculate & Sync All Modules"** action with a live impact preview and confirmation toast.
- **Confirmed Decision 3 — Role-Based Access Control (Super Admin Write / Manager Read-Only)**: Super Admins (`CEO / Super Admin`, `General Manager`, `HR & Admin Head`) have full edit, preset reset, and global recalculation authority; other department managers can inspect the active master rates in a clean **Read-Only Audit Mode** so they understand how system numbers are derived.

---

## 1. Overview & Core Concept

- **What It Does**: Replaces hardcoded calculation numbers across the ERP with a single, reactive **System Master Configuration Engine**. When a Super Admin adjusts a pension percentage, tax bracket threshold, standard working-day count, default allowance, gear penalty fee, or division salary grade, the change propagates to the 30-Day Payroll Sheet, Employee Onboarding/Directory defaults, Leave Entitlement balances, Clearance missing-gear settlements, and Store low-stock alerts.
- **Target Audience / Persona**:
  - **Super Admins (Full Control)**: Configure statutory tax/pension rates, update inflation-adjusted allowances or salary grades, adjust gear penalty fees, and trigger system-wide recalculations.
  - **Department Heads & Auditors (Read-Only)**: Verify the exact statutory tax table, pension rates, and penalty schedules currently governing their module's calculations.
- **Key Value**: Eliminates calculation drift across departments ("Truth — single source of data" and "Harmony — cross-unit alignment") and provides an interactive **Live Calculation Sandbox** inside the Master Setup so Super Admins can preview how rule changes affect a sample payslip or clearance settlement before or during saving.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Accessing System Master Setup**:
   - Available from the Sidebar navigation (`System Master Setup`) and quick-access header controls.
   - Displays a clear role posture banner at the top: **Super Admin Edit Mode** (unlocked controls, Save & Sync bar) vs. **Manager Read-Only Audit Mode** (locked inputs with clear explanation of active authority).
2. **Navigating the 4 Master Configuration Pillars**:
   - **Tab 1 — Payroll, Tax & Pension**: Interactive table for Ethiopian Progressive Income Tax Brackets (min/max ETB range, tax rate %, deduction constant ETB, with ability to edit or add/remove brackets), Employer & Employee Pension rates (%), standard full working days (e.g., 30 days), and default monthly allowances & food cost-sharing (ETB).
   - **Tab 2 — Shifts, Overtime & Leave Quotas**: Hourly overtime rate multipliers (1.5x normal, 1.75x night, 2.0x weekend, 2.5x holiday), standard shift hours, and statutory leave day entitlements per leave type.
   - **Tab 3 — Division Salary Grades & Gear Penalties**: Matrix of base salary & site/hazard allowances by division (`Security`, `Cleaning`, `Property Management`, `Head Office Staff`) and grade (`L1`–`Supervisor`), paired with the master **Clearance Gear Penalty Schedule** (exact ETB deduction for `Damaged` vs. `Missing` items by gear category).
   - **Tab 4 — Inventory & Operational Thresholds**: Division safety-stock reorder multipliers, default minimum stock levels by category, and contract renewal warning lead times (days).
3. **Live Impact Preview & 1-Click Cross-Module Sync**:
   - An integrated **Live Formula Tester & Impact Summary** shows in real time how the current master setup calculates a sample employee's net pay, employer pension, tax bracket, and how many active ERP records are governed by the rules.
   - Clicking **"Recalculate & Sync All Modules"** (or modifying a rule with Auto-Recalculate toggled on) updates all active Payroll records, Clearance penalty fees, Employee grade defaults, and Store reorder thresholds, logging a cross-departmental telemetry ripple in the **HAB Routine Copilot**.

### Visual Identity & Theme

- **Aesthetic Direction**: Utilitarian enterprise control room following the established HAB Business PLC design system — high-trust, calm, and scannable with zero decorative clutter.
- **Color Palette & Mood**:
  - **Canvas**: Crisp white (`#FFFFFF`) and soft slate (`#F8FAFC`) in light mode; deep slate (`#080C14` / `#0F172A`) in dark mode.
  - **Brand Surface & Table Header Accent**: Light Golden Yellow (`#FFFDE8` sidebar, `#FFF9DB` table headers) paired with Deep Navy (`#0E1525`) primary actions and typography.
  - **Semantic Signals**: Emerald (`#10B981`) for synced/active status, Amber (`#D97706`) for modified unsaved rules or warnings, Rose (`#E11D48`) for statutory deductions and penalties.
- **Typography & Hierarchy**:
  - **UI & Headings**: `Plus Jakarta Sans` (600/700 weight for section headers, 400/500 for labels).
  - **Numeric Inputs, Tax Brackets, Rates & Currencies**: `JetBrains Mono` with strict `tabular-nums` alignment so all ETB brackets, percentages, and multipliers align vertically.
- **Component Styling & Layout**:
  - **Single-Elevation Depth**: Flat `1px solid` borders (`border-slate-200 dark:border-slate-800`), compact 36px–44px table row heights, and clean segmented sub-navigation tabs.
- **Interactive Feedback & Motion**:
  - Instant live calculation preview ($\le 150\text{ms}$), unsaved-change indicator badge, confirmation toast showing exact count of recalculated Payroll/Clearance/Inventory records, and a "Reset to Statutory Defaults" safeguard button.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Reactive Centralized Calculation Engine over Isolated Component Math**
  - *Chosen Approach*: Extract hardcoded tax, pension, working-day, allowance, overtime, and penalty formulas into a shared `masterConfigEngine` that consumes the live `SystemMasterConfig` state from the root application and persists to `localStorage`.
  - *Why*: Guarantees that when a Super Admin changes the standard working days from `30` to `26`, or changes employee pension from `7%` to `8%`, every payroll edit modal, new payroll entry, batch recalculation, and payslip modal uses the exact same live formula.
  - *Alternatives Considered*: Keeping formulas inside individual components (`PayrollView`, `ClearanceView`), which causes formula mismatch and stale calculations.
- **Decision 2 — Safe Auto-Recalculation Scoping**
  - *Chosen Approach*: Auto-recalculation updates active (`Draft` / `Approved` payroll sheets, `In Progress` clearances, and live inventory reorder flags) while preserving historical `Disbursed` or `Completed` records unless explicitly force-synced.
  - *Why*: Protects historical accounting integrity while giving Super Admins immediate live updates on active monthly operations.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        Root Application State (App)                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ SystemMasterConfig State (persisted in localStorage)                 │  │
│  │  • taxBrackets[] & pensionRates (Employer 11%, Employee 7%)          │  │
│  │  • payrollDefaults (workingDays: 30, allowances, foodSharing, OT)    │  │
│  │  • divisionSalaryGrades[] & leaveEntitlements[]                      │  │
│  │  • clearancePenaltyTable[] & inventoryThresholds[]                   │  │
│  └──────────────────┬───────────────────────────────────────────────────┘  │
└─────────────────────┼──────────────────────────────────────────────────────┘
                      │
        ┌─────────────┴───────────────────────────────┐
        ▼                                             ▼
┌───────────────────────────────────────┐   ┌────────────────────────────────┐
│   Master Calculation Engine Utility   │   │   SystemMasterSetupView (UI)   │
│  • calculateTaxFromMaster()           │   │  • Super Admin Edit / ReadOnly │
│  • calculatePayrollRowFromMaster()    │   │  • 4 Domain Configuration Tabs │
│  • calculateClearancePenalties()      │   │  • Live Payslip Formula Tester │
│  • syncAllModulesWithMasterConfig()   │   │  • 1-Click Global Sync & Reset │
└───────┬───────────────┬───────────────┘   └────────────────────────────────┘
        │               │
        ▼               ▼
┌───────────────┐ ┌──────────────────────────────────────────────────────────┐
│  PayrollView  │ │ Employee / Leave / Clearance / Store / Copilot Modules   │
│  • Uses live  │ │  • Auto-fills salary by Division + Grade                 │
│    tax/pension│ │  • Applies master gear penalty fees on Damaged/Missing   │
│    & 30d rules│ │  • Enforces master leave day quotas & stock thresholds   │
└───────────────┘ └──────────────────────────────────────────────────────────┘
```

### Data Model & State

- **`SystemMasterConfig`**:
  - `taxBrackets`: Array of `{ id, label, minIncome, maxIncome: number | null, ratePercent, deductionConstant }` (defaulting to Ethiopian statutory brackets: 0–600 @ 0%, 601–1650 @ 10%, 1651–3200 @ 15%, 3201–5250 @ 20%, 5251–7800 @ 25%, 7801–10900 @ 30%, >10900 @ 35%).
  - `pensionAndTax`: `{ employerPensionPercent: 11, employeePensionPercent: 7, standardWorkingDays: 30, defaultTransportAllowance: 1500, defaultMobileAllowance: 400, defaultHousingAllowance: 2000, defaultFoodCostSharing: 400 }`.
  - `overtimeAndShifts`: `{ regularOtMultiplier: 1.5, nightOtMultiplier: 1.75, weekendOtMultiplier: 2.0, holidayOtMultiplier: 2.5, standardDailyHours: 8, securityDutyHours: 24, securityRestHours: 48 }`.
  - `leaveQuotas`: Array of `{ leaveType, maxDaysPerYear, paidPercent, requiresReplacement }`.
  - `gearPenaltyTable`: Array of `{ category, itemType, damagedFeeETB, missingFeeETB }`.
  - `divisionGrades`: Array of `{ serviceType, grade, defaultBaseSalary, defaultSiteAllowance, defaultHazardAllowance }`.
  - `inventoryRules`: Array of `{ category, defaultMinReorderLevel, criticalBufferPercent }`.
  - `autoRecalculateOnSave`: `boolean` (default `true`) + `lastUpdatedBy` and `lastSyncedAt` metadata.

### Interactive Component & State Mapping

- **`SystemMasterSetupView`**:
  - Provides interactive editors for every table and numeric parameter above, gated by `isSuperAdmin` (`mgmt-ceo`, `mgmt-gm`, `mgmt-hr-head`). Non-Super Admin roles see a read-only banner and disabled inputs.
  - Includes a **Live Payslip & Deduction Simulator** card where changing any bracket or percentage immediately displays the resulting Gross Pay, Taxable Income, Income Tax, 7% Employee Pension, 11% Employer Pension, and Net Pay.
  - Triggers `onSyncMasterConfig(nextConfig)` which recalculates `payroll`, `clearances` (updating `penaltyFee` and `unreturnedGearCost` based on item condition), `stockItems` (updating `minReorderLevel` when requested), and records a high-visibility event in the **HAB Routine Copilot**.
- **`PayrollView` & Other ERP Views**:
  - `PayrollView` receives `masterConfig: SystemMasterConfig` and uses `calculatePayrollRecordWithMaster()` for all new entries, inline edits, and payslip displays, dynamically showing the configured working days (`fullWorkingDays`), pension rates (`11%` / `7%`), and tax brackets.
  - `EmployeeManagementView`, `LeaveManagementView`, and `ClearanceView` consume `masterConfig` so newly registered employees auto-populate division/grade salaries, leave forms display master day quotas, and clearance condition toggles (`Good` / `Damaged` / `Missing`) apply the master penalty fee table.
