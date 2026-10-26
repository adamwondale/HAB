# HAB Business PLC — Enterprise Design System (DESIGN.md)

This document formalizes the visual language, design tokens, layout rules, component specifications, and user experience standards for the **HAB Business PLC Corporate HRM & Workforce Deployment ERP**.

---

## 1. Brand Identity & Design Philosophy

HAB Business PLC is a premier Ethiopian enterprise providing specialized commercial security, custodial cleaning, and facility operations. The ERP system reflects this institutional stature: **authoritative, highly legible, calm under operational pressure, and meticulously structured**.

### Key Principles
1. **Operational Restraint over Flash**: High-density operational data (shift rosters, attendance roll-calls, clearance workflows) takes precedence over decorative filler.
2. **Distinctive Brand Accent**: The signature HAB yellow palette (`#EBE834` / `#DFE16A`) is used intentionally for key primary metrics, active states, and focal actions, anchored by dark navy `#0E1525` text and structured slate neutrals.
3. **Multi-Role Scoping**: Every UI view respects the active persona (Executive GM, HR Talent, Field Supervisor, Storekeeper, Finance, Legal) with clear visual permission boundaries.
4. **Bilingual Harmony**: Native English and Amharic typography sit side-by-side with proportional line heights.

---

## 2. Color System & Design Tokens

### Primary Brand Palette
| Token Name | Hex Code | Tailwind Equivalent / Usage | Purpose |
|---|---|---|---|
| `hab-yellow-primary` | `#EBE834` | Custom / Brand Yellow | Primary metric card background, brand accents, key badges |
| `hab-yellow-hover` | `#E3E029` | Custom / Darker Yellow | Hover state for primary yellow elements |
| `hab-yellow-soft` | `#DFE16A` | Custom / Soft Yellow-Green | Subtle card backgrounds, tinted borders, secondary highlights |
| `hab-yellow-light` | `#FFF9DB` | Custom / Light Golden Yellow | Top header bar background, subtle ambient banners |
| `hab-yellow-sidebar` | `#FFFDE8` | Custom / Very Light Golden Yellow | Sidebar navigation container background, warm ambient tone |
| `hab-navy-deep` | `#0E1525` | Custom / Deep Navy | Primary dark text, high-contrast dark buttons, active badges |
| `hab-navy-hover` | `#19233C` | Custom / Hover Navy | Interactive hover state on dark navigation & buttons |

### Neutral Palette (Light & Dark Mode)
| Role | Light Mode | Dark Mode |
|---|---|---|
| Canvas Background | `bg-slate-100` / `#F8FAFC` | `bg-slate-950` / `#020617` |
| Surface / Card Background | `bg-white` / `#FFFFFF` | `bg-slate-900` / `#0F172A` |
| Primary Text | `text-slate-900` / `#0F172A` | `text-slate-100` / `#F1F5F9` |
| Secondary Text | `text-slate-600` / `#475569` | `text-slate-400` / `#94A3B8` |
| Borders & Dividers | `border-slate-200` / `#E2E8F0` | `border-slate-800` / `#1E293B` |
| Subtle Surface / Input fill | `bg-slate-50` / `#F8FAFC` | `bg-slate-800/60` |

### Semantic State Colors
* **Success / Present / Verified**: `emerald-600` / `emerald-700` (`#059669` / `#047857`)
* **Warning / Pending / Deficit**: `amber-600` / `amber-700` (`#D97706` / `#B45309`)
* **Critical / Absent / Termination**: `rose-600` / `rose-700` (`#E11D48` / `#BE123C`)
* **Info / Platoon Rotation**: `sky-600` / `indigo-600` (`#0284C7` / `#4F46E5`)

---

## 3. Typography Hierarchy

The ERP utilizes the clean neo-grotesque sans-serif typeface `Inter` with specialized monospace numeric alignment for metrics, financial currency values, and shift counts.

| Level | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| **Display KPI** | `text-2xl` to `text-3xl` (24–30px) | `font-black` (900) | Tight | `-0.02em` (tabular-nums) | Hero metric figures, total employees, revenue |
| **Section Title** | `text-xl` (20px) | `font-bold` (700) | Snug | `-0.01em` | Main view headings, module banners |
| **Card Heading** | `text-base` (16px) | `font-bold` (700) | Snug | Normal | Metric card titles, site headers |
| **Subheading / Label** | `text-xs` (12px) | `font-semibold` (600) | Normal | Wide / Uppercase | Overline badges, table headers, category tags |
| **Body Text** | `text-xs` to `text-sm` (12–14px) | `font-normal` (400) | Relaxed | Normal | Data descriptions, notes, dossier details |
| **Mono Values** | `text-xs` to `text-sm` (12–14px) | `font-mono font-bold` | Normal | Tabular nums | ETB currency, employee IDs (`HAB-SEC-0104`), ratios |

---

## 4. Layout Architecture & Spatial Grid

### Page Structure
```
+--------------------------------------------------------------------------+
|  TopBar: HAB Monogram Logo + Golden Bar (#FFF9DB) + Persona Switcher     |
+--------------------------------------------------------------------------+
|  RoleAccessBar: 1-Click Role Switcher + Live Capability Permissions      |
+------------+-------------------------------------------------------------+
| Sticky     | Main Scrollable Content Canvas (max-w-7xl mx-auto px-4/6/8) |
| Sidebar    |                                                             |
| (Accordion | [Module Header Banner]                                      |
| Categories | [Hero Metric Cards Grid]                                    |
| + Tooltips | [Sub-tabs / Mode Toggles (e.g. Drag & Drop vs Matrix)]      |
| on Hover)  | [Data Tables / Split Interactive Panels / Visual Charts]    |
+------------+-------------------------------------------------------------+
```

### Navigation Rules
- **Sticky Sidebar**: Remains anchored to the left viewport on desktop (`sticky top-0 h-screen`).
- **Accordion Categorization**: Grouped into **Overview**, **Workforce**, **Operations**, **Finance & Store**, and **Legal & Exit**. Clicking a category expands its items and automatically collapses others.
- **Hover Transitions**: `hover:bg-slate-100 dark:hover:bg-slate-800` transition with subtle left-border highlight (`border-l-4 border-amber-500`).
- **Collapsed Tooltips**: Hovering over sidebar links provides instant floating tooltips with the module name.

---

## 5. Component Patterns & Specifications

### 1. HAB Hero Metric Card (`HabMetricCard`)
- **Background**: `#EBE834` with `#D4D11E` border.
- **Text**: Contrast dark navy `#0E1525`.
- **Value**: Monospace tabular numbers (`font-mono font-black text-2xl`).
- **Interaction**: Subtle scale and shadow hover (`hover:bg-[#E3E029] transition-all cursor-pointer`).

### 2. Drag-and-Drop Workforce Scheduler
- **Draggable Cards**: Equipped with visual drag grip (`GripVertical`), employee avatar badge, role, service type, and current availability status.
- **Drop Zones**: Facility site cards with dashed border indicators (`border-2 border-dashed border-[#0E1525] bg-[#EBE834]/20`).
- **Hover Feedback**: Visual highlight with capacity indicator updating live upon drop.
- **Accessibility Fallback**: Every draggable item includes a direct "Deploy" button for keyboard and touchscreen users.

### 3. General Manager (GM) Executive Overview & Diagnostic Advisory
- **Dual Flow Architecture**:
  - **Inputs Panel**: Talent intake & recruitment, store & uniform procurement expenses, monthly payroll & 11% pension costs.
  - **Outputs Panel**: Monthly client billing revenue, SLA fulfillment %, shift duty hours delivered, asset recovery rate.
- **Automated Insights**: Strategic bulleted recommendations analyzing margin variance, staffing deficits, and labor law compliance.

### 4. 4-Gate Exit Clearance Workflow
Clearance records pass sequentially through 4 distinct gate sign-offs:
1. `Gate #1`: Field Supervisor (Post handover & site relief)
2. `Gate #2`: Storekeeper (Uniform, boots, radio, ID badge recovery)
3. `Gate #3`: Finance & Payroll (Final wage settlement, unreturned gear deductions)
4. `Gate #4`: Legal & HR Directorate (Final termination letter & work certificate release)

---

## 6. Accessibility & Operational Guardrails

1. **High Contrast**: Dark text (`#0E1525`) on `#EBE834` achieves a WCAG AAA contrast ratio > 11:1.
2. **Keyboard Navigation**: All interactive elements (tabs, role switchers, drag actions) maintain visible focus outlines (`focus:ring-2 focus:ring-amber-500`).
3. **No Unstyled Flashes**: Smooth dark mode transitions using Tailwind `dark:` variants and CSS color transitions.
4. **Mobile Responsive**: Adapts seamlessly to smartphone viewports with off-canvas sidebar drawer and responsive grid reflows.
