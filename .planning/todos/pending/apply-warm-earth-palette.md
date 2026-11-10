---
title: Implement Warm Earth Palette across DESIGN.md and Application UI
date: 2026-11-09
priority: high
status: completed
---

# Todo: Implement Warm Earth Palette across DESIGN.md and Application UI

## Context & Objective
Migrate HAB Business PLC ERP from the legacy high-saturation navy & yellow palette (`#0E1525` / `#EBE834` / `#FFF9DB`) to the newly approved Warm Earth palette:
- `#F2C46A` — Main brand color (primary CTAs, active highlights)
- `#4C4541` — Deep Espresso (text, high-contrast dark chrome)
- `#AEAC78` — Sage Green (department badges, secondary borders)
- `#FCF0DA` — Warm Linen (light mode sidebar, table headers, soft surface washes)

## Action Checklist

### Phase 1: Design System & Token Contracts
- [x] Update `DESIGN.md` tokens:
  - Replace `hab-navy-deep` (`#0E1525`) with `hab-espresso-deep` (`#4C4541`).
  - Replace `hab-gold-accent` (`#EBE834`) and `hab-gold-vivid` (`#FFF500`) with `hab-gold-main` (`#F2C46A`).
  - Replace `hab-cream-header` and `hab-cream-sidebar` (`#FFF9DB`, `#FFFDE8`) with `hab-linen-surface` (`#FCF0DA`).
  - Add `hab-sage-accent` (`#AEAC78`).
  - Update component contract tokens for buttons, nav-items, and table headers.

### Phase 2: Global CSS & Utility Classes
- [x] Update `src/index.css`:
  - Align `html:not(.dark) thead` background to `#FCF0DA` and border to `#EFE7D8`.
  - Update `body` text color to `#4C4541` and background to `#FDFBF7`.
  - Update table hover states to subtle gold tint `rgba(242, 196, 106, 0.12)`.
  - Update dark mode elevated card and surface classes to warm espresso shades (`#1A1715`, `#24201E`, `#2C2724`).

### Phase 3: Core Shell Components
- [x] `src/components/Sidebar.tsx`:
  - Active nav tab background set to `#F2C46A` with `#4C4541` text.
  - Sidebar background updated to `#FCF0DA` (light) and `#2C2724` (dark).
  - Hover states aligned to `#FCF0DA` tint.
- [x] `src/components/TopBar.tsx`:
  - Update header background to `#FCF0DA` / `#2C2724`.
  - Monogram icon and brand badge updated to `#F2C46A` and `#4C4541`.
- [x] `src/components/HabLogo.tsx`:
  - Update monogram SVG fills and accents to `#F2C46A` and `#4C4541`.

### Phase 4: Module Views & Audit
- [x] Audit primary action buttons across all views (`PayrollView`, `DeploymentView`, `RecruitmentView`, `ClearanceView`, `DashboardOverview`, `SystemMasterSetupView`, `HabRoutineCopilot`) ensuring `#F2C46A` background always pairs with `#4C4541` text (never white).
- [x] Verify test suite and run typecheck (`npx tsc --noEmit`).
