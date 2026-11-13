---
title: Core ERP Roles & Authentication Architecture
date: 2026-11-13
context: Socratic ideation session clarifying HAB ERP users into 4 core personas (HR, Finance, CEO Overview, Super Admin) with dedicated login credentials and client persistence
status: settled
---

# Core ERP Roles & Authentication Architecture

## 1. Context & Objectives
To streamline operations and eliminate role sprawl, HAB Business PLC ERP is consolidated around **4 core operational personas**:
1. **Super Admin**: System configuration, master codes, system setup, and user account/credential management.
2. **CEO Overview**: Executive read-only visibility into company-wide operational health, headcount, payroll costs, and divisional dashboards.
3. **HR (Human Resources)**: Complete employee lifecycle management—recruitment, onboarding, deployments, attendance, leaves, transfers, and exit clearances.
4. **Finance**: Monthly 30-day payroll processing, statutory deductions, pensions, bank payment orders, clearance financial settlements, and inventory valuation.

---

## 2. Default Seeded Credentials

| Persona / Role | Default Username | Default Password | Default Email | Role Interface Type |
|---|---|---|---|---|
| **Super Admin** | `admin` | `hab2026` | `admin@hab-business.com` | `super_admin` |
| **CEO Overview** | `ceo` | `hab2026` | `ceo@hab-business.com` | `executive` (read-only) |
| **Human Resource** | `hr` | `hab2026` | `hr@hab-business.com` | `hr` |
| **Finance & Payroll**| `finance` | `hab2026` | `finance@hab-business.com` | `finance` |

Credentials and account metadata are seeded into local persistent state (`localStorage`), enabling Super Admin to update usernames, display names, and passwords dynamically without losing changes across refreshes.

---

## 3. Module & Tab Permission Matrix

| Module / Tab ID | Super Admin (`admin`) | CEO Overview (`ceo`) | HR (`hr`) | Finance (`finance`) |
|---|:---:|:---:|:---:|:---:|
| **Dashboard Overview** (`overview`) | Full | Read-Only | Full (HR KPIs) | Full (Finance KPIs) |
| **Employee Dossiers** (`management`) | Full | Read-Only | Full | Hidden |
| **Deployment & Rostering** (`deployment`) | Full | Read-Only | Full | Hidden |
| **Daily Attendance** (`attendance`) | Full | Read-Only | Full | Read-Only (Payroll audit) |
| **Leave Management** (`leave`) | Full | Read-Only | Full | Hidden |
| **Recruitment & Intake** (`recruitment`) | Full | Read-Only | Full | Hidden |
| **Onboarding & Gear** (`onboarding`) | Full | Read-Only | Full | Hidden |
| **30-Day Payroll Sheet** (`payroll`) | Full | Read-Only | Hidden | Full |
| **Central Store / Stock** (`store`) | Full | Read-Only | Requisition only | Valuation & Audit |
| **Exit Clearance** (`clearance`) | Full | Read-Only | HR Gates (#1, #2) | Finance Gate (#3) |
| **Work Experience** (`experience`) | Full | Read-Only | Full | Hidden |
| **System Master Setup** (`master-setup`)| Full | Hidden | Hidden | Hidden |

---

## 4. Architectural Rules & User Experience

1. **Strict Login Flow**:
   - The user must provide a valid username (or email) and password on `LoginView`.
   - The legacy top 1-click switcher (`RoleAccessBar`) is removed from the active UI to ensure role integrity.
   - Users transition between roles strictly by signing out from `TopBar` and logging in as the target user.

2. **Executive Read-Only Guarantees**:
   - When authenticated as `ceo`, all mutation triggers (e.g. "Save", "Add Employee", "Calculate Payroll", "Approve Clearance") are disabled or visually replaced with read-only inspection tags.

3. **Super Admin User Credential Management**:
   - A dedicated tab in `SystemMasterSetupView` allows the Super Admin to:
     - View all 4 system user accounts.
     - Edit usernames and update passwords.
     - Reset accounts to initial defaults (`hab2026`).
