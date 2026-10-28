# HAB Business PLC — Enterprise Design System (DESIGN.md)

This document formalizes the visual language, design tokens, layout rules, component specifications, and **Impeccable** craft standards (`Operate`, `Distill`, `Quieter`, `Craft Floor`) for the **HAB Business PLC Integrated ERP System**.

---

## 1. Brand Identity & Design Philosophy

HAB Business PLC operates across Security Services, Cleaning Services, and Property Management. The ERP system is designed in **Operate** mode: **calm, scannable, high-signal, and effortless to use**.

### Core Craft Rules (Impeccable Standards)
1. **Progressive Disclosure (`Distill`)**: Show one focused operational lens at a time (e.g., `Client Sites & Summary`, `Inputs vs. Outputs`, or `Deployment Chart`) rather than stacking every table and chart on a single long page.
2. **No Cards Within Cards (`Craft Floor`)**: Use flat 1px hairline row dividers (`divide-y divide-slate-100`) inside containers rather than nesting boxed sub-cards inside parent cards.
3. **No Thick Colored Side Borders**: Never use `border-l-4` or `border-l-2` accent bars on cards or navigation buttons.
4. **Tabular Numeric Discipline**: Every financial figure, headcount, and ratio uses `font-mono tabular-nums` for vertical alignment.
5. **Proactive Intelligence (`HAB Routine Copilot`)**: Surfaces a quiet, single-line smart nudge bar with a 1-click decision button and a slide-over drawer powered by Gemini.

---

## 2. Color System & Design Tokens

### Primary Brand Palette
| Token Name | Hex Code | Usage |
|---|---|---|
| `hab-yellow-sidebar` | `#FFFDE8` | Very light golden yellow sidebar container, executive KPI wrapper, and quiet nudge bar |
| `hab-yellow-light` | `#FFF9DB` | Light golden yellow header bar and KPI metric cards |
| `hab-yellow-border` | `#EFE1AA` | 1px hairline border for golden yellow surfaces |
| `hab-yellow-primary` | `#EBE834` | Brand accent for primary action buttons and active highlights |
| `hab-navy-deep` | `#0E1525` | Primary ink text, active navigation fill, and primary dark buttons |

### Neutral & Semantic Palette
- **Canvas**: `#FFFFFF` (Light) / `#020617` (Dark)
- ** Borders**: 1px solid `#E2E8F0` (`border-slate-200`) or `#EFE1AA` on warm surfaces
- **Semantic Status**: Emerald (`#047857`) for full SLA coverage, Amber (`#B45309`) for open posts or low stock, Rose (`#BE123C`) for critical deficits.
