---
title: Implement 4 Core Roles, Login Flow & Credential Manager
date: 2026-11-13
priority: high
status: pending
---

# Todo: Implement 4 Core Roles, Login Flow & Credential Manager

## Context & Objectives
Consolidate user management into 4 core roles (`admin`, `ceo`, `hr`, `finance`), implement strict credential-based login with persistent user state, remove the dev top switcher bar, and introduce a user credential management panel in System Master Setup.

## Action Checklist

### Phase 1: Auth Models & Persistent State
- [ ] Define user account type with `id`, `username`, `password`, `email`, `fullName`, `role` (`super_admin` | `executive` | `hr` | `finance`).
- [ ] Create an auth manager service / hook with initial default seeds (`admin`, `ceo`, `hr`, `finance` with password `hab2026`), backed by `localStorage`.
- [ ] Provide methods to authenticate, update credentials, and reset defaults.

### Phase 2: Role Access Configuration & Navigation
- [ ] Update `src/utils/roleConfig.ts`:
  - Map `super_admin`, `executive`, `hr`, `finance` to their explicit `allowedTabs` and capability flags.
  - Set `readOnly: true` on `executive` (CEO Overview).
- [ ] Update `src/components/Sidebar.tsx` to respect the filtered tabs for the active role.

### Phase 3: Login Screen & App Shell
- [ ] Update `src/components/LoginView.tsx`:
  - Validate username (or email) and password against the persisted user store.
  - Display helpful error feedback when credentials do not match.
  - Provide quick-help hint tags for test convenience.
- [ ] Remove `RoleAccessBar.tsx` from the active layout in `src/App.tsx`.
- [ ] Ensure `src/components/TopBar.tsx` displays the active user's role badge and a working "Sign Out" button that clears the session.

### Phase 4: Super Admin Credential Manager
- [ ] In `src/components/SystemMasterSetupView.tsx`, add a "User Accounts & Passwords" management panel:
  - Display table of the 4 accounts.
  - Allow Super Admin to change passwords and edit usernames.
  - Allow reset to default credentials (`hab2026`).

### Phase 5: Verification & Container Health
- [ ] Run `npx tsc --noEmit` and verify zero TypeScript errors.
- [ ] Run `npm run build` or frontend tests.
- [ ] Check Docker containers rebuild cleanly if running in containerized environment.
