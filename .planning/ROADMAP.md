# Roadmap: HAB Business PLC ERP

## Overview
Transforming the enterprise ERP design system into a warm, cohesive earth-tone visual language centered around `#F2C46A` (Golden Honey) as the main brand accent, `#4C4541` (Deep Espresso) for contrast and dark chrome, `#AEAC78` (Sage Green) for secondary tags and borders, and `#FCF0DA` (Warm Linen) for light chrome and header washes.

## Phases

- [x] **Phase 1: Warm Earth Palette Migration** - Migrate DESIGN.md, global CSS tokens, navigation shell (Sidebar & TopBar), and key view components to the new palette.

## Phase Details

### Phase 1: Warm Earth Palette Migration
**Goal**: Transition all design tokens, global stylesheets, navigation shells, and core application components to the approved Warm Earth palette with `#F2C46A` as the main interactive accent.
**Depends on**: Nothing
**Requirements**: REQ-DS-001
**Success Criteria** (what must be TRUE):
  1. `DESIGN.md` contains the formal Warm Earth color tokens and component styling rules.
  2. `src/index.css` defines the light/dark canvas, table headers, and input styles with the new palette.
  3. `Sidebar.tsx`, `TopBar.tsx`, and `HabLogo.tsx` render with `#FCF0DA` light shell / `#2C2724` dark shell, `#F2C46A` active indicators, and `#4C4541` text.
  4. Core dashboard and ERP views utilize `#F2C46A` for primary action buttons with `#4C4541` high-contrast text.
  5. TypeScript compilation passes cleanly (`npx tsc --noEmit`).
**Plans**: 2 plans

Plans:
- [x] 01-01: Update DESIGN.md and global CSS in index.css with Warm Earth design tokens.
- [x] 01-02: Update Sidebar, TopBar, HabLogo, and core views with #F2C46A main color and #4C4541 text.
