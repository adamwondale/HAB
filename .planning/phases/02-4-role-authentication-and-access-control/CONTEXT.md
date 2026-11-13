# Context: Phase 2 — 4-Role Authentication and Access Control

## Background & User Decisions
From the `/gsd-explore` session, the user clarified the ERP persona structure down to **4 core roles**:
1. **Super Admin (`admin`)**: System setups, master configuration, user credentials & password management.
2. **CEO Overview (`ceo`)**: Executive read-only oversight across all modules (KPIs, attendance, payroll) with no record editing.
3. **Human Resource (`hr`)**: Employee dossiers, onboarding, recruitment, deployments, shifts, attendance, leaves, and clearances.
4. **Finance (`finance`)**: 30-day payroll calculations, statutory taxes & pension remittances, bank payment orders, clearance financial settlements, and store valuation.

## Core Architectural Decisions
- **Seeded Credentials**:
  - `admin` / `hab2026`
  - `ceo` / `hab2026`
  - `hr` / `hab2026`
  - `finance` / `hab2026`
- **Persistence Model**:
  - Initial seed stored in persistent client state (`localStorage`).
  - Super Admin can update usernames, display names, and passwords dynamically in System Master Setup.
- **Strict Login Flow**:
  - The in-app dev role switcher (`RoleAccessBar`) is removed from the active view.
  - Users authenticate strictly through `LoginView` and log out via `TopBar`.
- **Navigation & Permissions**:
  - `Sidebar` dynamically filters visible tabs via `getRoleAllowedTabs(activeUser.id)`.
  - When `activeUser.role === 'executive'` (CEO), interactive buttons (save, add, edit, approve) are rendered in read-only mode.
- **Master Setup Access**:
  - Only `admin` has access to `SystemMasterSetupView`.

## Implementation Scope
1. **Data & Types**:
   - Update `ManagementPerson` / `AuthUser` types in `src/types/hrm.ts`.
   - Update `src/data/mockData.ts` to include the 4 core accounts with initial passwords.
   - Implement auth/account persistence service in `src/utils/authStorage.ts`.
2. **Access & Permissions**:
   - Update `src/utils/roleConfig.ts` for `super_admin`, `executive`, `hr`, and `finance`.
3. **Login View**:
   - Update `src/components/LoginView.tsx` to validate credentials against persistent auth storage.
4. **App Shell**:
   - Remove `RoleAccessBar.tsx` from `src/App.tsx`.
   - Update `src/components/TopBar.tsx` with user badge and explicit Sign Out handler.
5. **System Master Setup**:
   - Add User Credential Management table in `src/components/SystemMasterSetupView.tsx` allowing Super Admin to edit passwords and usernames.
6. **Verification**:
   - `npx tsc --noEmit` cleanly passing.
