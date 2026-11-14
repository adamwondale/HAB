---
title: Charles Skills UI/UX & Design-Craft Integration
date: 2026-11-14
context: Installation of LemonFace0309/charles-skills suite and integration of unslop, polish, and animation principles into HAB Business PLC ERP
status: settled
---

# Charles Skills UI/UX & Design-Craft Integration

## 1. Overview & Installed Suite
To elevate HAB Business PLC ERP beyond generic template interfaces, the core design-craft suite from [LemonFace0309/charles-skills](https://github.com/LemonFace0309/charles-skills) has been installed into `.agents/skills/`:

| Installed Skill | Primary Purpose & Rules Enforced |
|---|---|
| **`charles-unslop`** | Eliminates AI design cliches (random pill badges, floating containers, decorative glows, meaningless emojis). Enforces subtraction before restyling and grounds chrome in a quiet, utilitarian aesthetic with one distinct moment. |
| **`charles-polish`** | Hill-climbs interfaces through level-by-level refinement. Mandates tabular numbers (`tabular-nums`) for currency/metrics, resting button vs. input fill contrast, optical alignments, and zero layout shift. |
| **`charles-ux-animation`** | Applies Kowalski & Interface Craft motion rules (100–250ms responsive durations, physics-based springs, purposeful feedback without visual clutter). |
| **`charles-unreasonable-craft`** | Sets an award-grade standard for micro-typography, spatial density, rag management, and deliberate brand touches. |

---

## 2. HAB ERP Craft Standards

### 2.1 Subtraction & Anti-Slop Rules
1. **Delete Decorative Borders & Dividers**: Rely on 4px spatial grouping (`gap-3` vs `gap-6`) rather than hairline dividers between list rows or setting chips.
2. **Single Set Line Icons**: Use clean Lucide SVG icons in neutral espresso/slate tones. Never use emojis as functional icons or status markers.
3. **Resting State Contrast**: Form input fields remain the brightest surface in light mode (`bg-white`); resting action buttons sit one tone down (`#F2C46A` gold CTA or `#FCF0DA` secondary), avoiding identical white slabs.
4. **Authentic Domain Copy**: All data tables and mock records reflect realistic Ethiopian operations (Addis Ababa, Bole head office, ETB currency, ERCA statutory tax rules, realistic Ethiopian staff names).

### 2.2 Micro-Typography & Precision Numbers
1. **Tabular Numerals**: Every numeric column (Basic Salary, Net Pay, Pension, Tax, Leave Days, OT Hours, Stock Qty) MUST apply `tabular-nums` (`font-variant-numeric: tabular-nums`) so numbers do not reflow or jiggle when updated.
2. **Balanced Headings**: Headings use `text-wrap: balance` to prevent awkward orphaned words.
3. **Tight Contrast Bounds**: High-contrast text `#4C4541` on `#F2C46A` and `#FCF0DA`. White text on `#F2C46A` remains strictly prohibited.

---

## 3. Phase 4 Replanning Architecture

Phase 4 is decomposed into 5 structured plans:
- **04-01**: 6-Role Authentication Expansion & Shared Craft Tokens.
- **04-02**: Finance 9-Column Payroll, Tax & Cheque Controls, and Material Depreciation.
- **04-03**: Store Daily Issue/Receive, Asset Register, and Minimum Stock Alerts.
- **04-04**: Executive & Technical Dashboards, Record Comments, and Copilot Chatbot.
- **04-05**: Global UI Unslop & Design-Craft Audit (running `charles-unslop` & `charles-polish` across all ERP views).
