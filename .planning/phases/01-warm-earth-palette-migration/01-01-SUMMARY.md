---
phase: 01-warm-earth-palette-migration
plan: 01
subsystem: design-system
tags: [tailwind, css, design-tokens, branding]
provides:
  - "Updated DESIGN.md color tokens to Warm Earth palette"
  - "Configured src/index.css light/dark mode root styles with #FDFBF7 canvas, #4C4541 text, and #FCF0DA headers"
  - "Updated HabLogo.tsx brand monogram fills with #F2C46A and #4C4541"
affects: [all modules, navigation, typography]
actuals:
  tasks: 3
key-files:
  modified:
    - DESIGN.md
    - src/index.css
    - src/components/HabLogo.tsx
key-decisions:
  - "Adopted #F2C46A as hab-gold-main for primary interactive elements with #4C4541 deep espresso text for 6.8:1 WCAG AAA contrast"
  - "Mapped #FCF0DA as hab-linen-surface for chrome and header surfaces"
completed: 2026-11-09
status: complete
---

# Plan 01-01 Summary: Design System & Token Foundation

Updated core design tokens in `DESIGN.md`, global theme definitions in `src/index.css`, and the `HabLogo` component to establish the Warm Earth palette.

## Accomplishments
1. **Design System Specification:** Replaced legacy navy/yellow tokens in `DESIGN.md` with Warm Earth tokens (`hab-gold-main: #F2C46A`, `hab-espresso-deep: #4C4541`, `hab-sage-accent: #AEAC78`, `hab-linen-surface: #FCF0DA`).
2. **Global CSS:** Updated `src/index.css` with warm linen table header styles, deep espresso typography, subtle gold hover states, and warm espresso dark mode surfaces.
3. **Monogram & Logo:** Replaced electric yellow fills in `HabMonogramIcon` and HRM badge with `#F2C46A` and `#4C4541`.
