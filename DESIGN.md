---
name: HAB Business PLC — Integrated ERP System
description: Enterprise Human Resource Management, Client Site Workforce Deployment, Payroll, and 3D Warehouse ERP for Security, Cleaning, and Property Management.
colors:
  hab-navy-deep: "#0E1525"
  hab-navy-hover: "#19233C"
  hab-gold-accent: "#EBE834"
  hab-gold-vivid: "#FFF500"
  hab-cream-header: "#FFF9DB"
  hab-cream-sidebar: "#FFFDE8"
  hab-cream-hover: "#F5EAB8"
  hab-gold-border: "#EFE1AA"
  hab-gold-border-strong: "#C8CB54"
  surface-canvas: "#F8FAFC"
  surface-card: "#FFFFFF"
  surface-muted: "#F1F5F9"
  border-hairline: "#E2E8F0"
  border-subtle: "#F1F5F9"
  text-secondary: "#475569"
  text-muted: "#64748B"
  status-emerald: "#047857"
  status-emerald-bg: "#ECFDF5"
  status-amber: "#B45309"
  status-amber-bg: "#FFFBEB"
  status-rose: "#BE123C"
  status-rose-bg: "#FFF1F2"
  dark-canvas: "#080C14"
  dark-card: "#0F172A"
  dark-elevated: "#172033"
  dark-border: "#1E293B"
typography:
  display:
    fontFamily: "Google Sans, Google Sans Display, Product Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Google Sans, Google Sans Display, Product Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Google Sans, Google Sans Text, Product Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Google Sans, Google Sans Text, Product Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Google Sans Mono, JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.02em"
    fontFeature: "tnum"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.hab-navy-deep}"
    textColor: "{colors.hab-cream-header}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-primary-hover:
    backgroundColor: "{colors.hab-navy-hover}"
    textColor: "{colors.hab-gold-vivid}"
  button-accent:
    backgroundColor: "{colors.hab-gold-accent}"
    textColor: "{colors.hab-navy-deep}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-ghost:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.hab-navy-deep}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  nav-item-default:
    backgroundColor: "{colors.hab-cream-sidebar}"
    textColor: "{colors.hab-navy-deep}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  nav-item-active:
    backgroundColor: "{colors.hab-navy-deep}"
    textColor: "{colors.hab-cream-header}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  card-metric-gold:
    backgroundColor: "{colors.hab-cream-header}"
    textColor: "{colors.hab-navy-deep}"
    rounded: "{rounded.lg}"
    padding: "16px 20px"
  card-surface:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.hab-navy-deep}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input-search:
    backgroundColor: "{colors.hab-cream-sidebar}"
    textColor: "{colors.hab-navy-deep}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
---

# Design System: HAB Business PLC — Integrated ERP System

## Overview

**Creative North Star: "The Sovereign Operations Ledger"**

HAB Business PLC operates high-accountability field deployments across Security Services, Cleaning Services, and Property Management in Addis Ababa. Built in **Operate** mode, the interface prioritizes calm operational command, zero visual bloat, and immediate numeric legibility. Warm golden-cream chrome frames crisp white data canvases, anchored by deep navy authority ink, clean **Google Sans** typography, and precision **Google Sans Mono** financial figures.

Every screen adheres to progressive disclosure: complex multi-department workflows (30-day Ethiopian payroll, 3-gate exit clearance, 24/48 security shift roll call, and statutory System Master Setup) are organized into scannable lenses rather than stacked into overwhelming walls of widgets. Decoration recedes so operational truth—headcounts, SLA coverage ratios, and ETB balances—leads at first glance.

**Key Characteristics:**
- **Warm Golden-Cream Chrome + Crisp Paper Canvas:** Navigation, top header bars, KPI strip cards, and table headers use warm sunlit cream tones, while primary workspaces rest on pure white cards over a cool slate canvas.
- **Deep Navy Ink & Action Contrast:** Primary text, active navigation states, and primary action buttons use Abyssinian Deep Navy with warm cream or vivid yellow-gold foregrounds.
- **Google Sans & Strict Tabular Numeric Discipline:** All UI headings, body copy, and controls render in `Google Sans` (`Google Sans Display` and `Google Sans Text`), while every currency amount (ETB), tax bracket, headcount, and SLA percentage renders in `Google Sans Mono` (`JetBrains Mono` fallback) with `tabular-nums` (`tnum`) enabled for vertical column alignment.
- **Flat Hairline Architecture:** Surfaces are separated by 1px solid hairline borders (`#EFE1AA` on warm surfaces, `#E2E8F0` on neutral surfaces) rather than heavy drop shadows or nested sub-cards.
- **Quiet Proactive Intelligence:** The HAB Routine Copilot surfaces as a single-line smart nudge bar below the header and a slide-over drawer with 1-click cross-departmental actions.

## Colors

The palette pairs warm Ethiopian gold and parchment-cream structural chrome with high-contrast deep navy typography and semantic operational status indicators.

### Primary
- **Abyssinian Deep Navy** (`#0E1525`): Primary ink for headings, body copy, table headers, active sidebar navigation fills, and primary CTA buttons.
- **Navy Interactive Hover** (`#19233C`): Hover state for deep navy primary buttons and dark interactive triggers.
- **HAB Sovereign Gold** (`#EBE834`): Brand monogram badge fill, active navigation icon accent inside dark pills, and high-emphasis primary action buttons.
- **Vivid Signal Yellow** (`#FFF500`): High-contrast text and icon highlight on deep navy primary buttons and dark-mode metric values.

### Secondary
- **Sunlit Cream Header** (`#FFF9DB`): Sticky top header bar, executive KPI metric cards, and global data table `<thead>` backgrounds in light mode.
- **Parchment Sidebar Cream** (`#FFFDE8`): Collapsible sidebar background, header search input fill, and the HAB Routine Copilot smart nudge bar.
- **Warm Honey Hover** (`#F5EAB8`): Subtle hover and open-accordion highlight across sidebar navigation items.
- **Gilded Hairline Border** (`#EFE1AA`): 1px structural border separating golden-cream headers, sidebars, and KPI cards.
- **Tempered Brass Border** (`#C8CB54`): Stronger border token for accented golden callouts and badges.

### Tertiary
- **SLA Emerald** (`#047857` on `#ECFDF5`, border `#A7F3D0`): Full deployment coverage (100% SLA), verified guarantors, disbursed payroll, and completed clearance gates.
- **Operational Amber** (`#B45309` on `#FFFBEB`, border `#FDE68A`): Open shift posts, pending leave requests, and warehouse items approaching reorder thresholds.
- **Deficit Rose** (`#BE123C` on `#FFF1F2`, border `#FECDD3`): Critical staffing deficits, absent roll-call statuses, and unreturned exit clearance gear deductions.

### Neutral
- **Cool Ledger Canvas** (`#F8FAFC`): Root viewport background behind workspace containers.
- **Pure Sheet White** (`#FFFFFF`): Primary data tables, form containers, modal dialogs, and slide-over drawers.
- **Slate Muted Well** (`#F1F5F9`): Segmented tab tracks, secondary button fills, and subtle table row grouping.
- **Slate Hairline** (`#E2E8F0`): Standard 1px border on white cards, inputs, and table containers.
- **Secondary Slate Ink** (`#475569` / `#64748B`): Supporting metadata, timestamps, bilingual subtitles, and field labels.
- **Dark Mode Slate Surfaces** (`#080C14` canvas, `#0B0F19` muted well, `#0F172A` card surface, `#131B2E` even table rows & inputs, `#172033` elevated surface & table `<thead>`, `#1A253A` row hover, `#1E293B` hairline border): Full dark-theme token parity across all ERP modules.

### Named Rules
**The Golden Chrome, White Ledger Rule.** Warm golden-cream tones (`#FFF9DB`, `#FFFDE8`) belong exclusively to structural chrome (Sidebar, TopBar, Nudge Strip, KPI Summary Cards, and Table Headers). Primary workspaces and data rows remain on clean white (`#FFFFFF`) so dense records stay effortless to scan.

**The Navy Authority Rule.** Primary actions and active navigation items invert to Abyssinian Deep Navy (`#0E1525`) with warm cream (`#FFF9DB`) or gold (`#EBE834`) foregrounds—never generic browser blue or saturated neon gradients.

## Typography

**Display Font:** `Google Sans`, `Google Sans Display` (with `Product Sans, -apple-system, BlinkMacSystemFont, system-ui, sans-serif` fallback)
**Body Font:** `Google Sans`, `Google Sans Text` (with `Product Sans, -apple-system, BlinkMacSystemFont, system-ui, sans-serif` fallback; supports bilingual English and Amharic UI copy)
**Label/Mono Font:** `Google Sans Mono` (with `JetBrains Mono, ui-monospace, SFMono-Regular, monospace` fallback)

**Character:** Geometric, crisp, and institutional—`Google Sans` (`Google Sans Display` for headers and `Google Sans Text` for dense UI controls) keeps bilingual English/Amharic labels effortless to read at compact sizes (`12px`–`14px`), while `Google Sans Mono` gives financial ledgers, tax brackets, and employee IDs unmistakable audit precision.

### Hierarchy
- **Display / Metric Value** (`700`, `1.5rem` / `24px`, line-height `1.25`, tracking `-0.02em`): Executive KPI card figures and Live Formula Sandbox net pay readouts in `Google Sans Mono` (`tabular-nums`).
- **Headline / Module Header** (`700`, `1.125rem` / `18px`, line-height `1.35`, tracking `-0.01em`): Top-level module titles in `Google Sans Display` (e.g., *System Master Setup & Calculation Engine*, *30-Day Payroll Sheet*).
- **Title / Section Card Header** (`600`, `0.875rem` / `14px`, line-height `1.4`): Table card titles, modal headers, and drawer section headers in `Google Sans`.
- **Body / Dense Operational Copy** (`500`, `0.8125rem` / `13px`, line-height `1.5`): Sidebar navigation items, table cells, form inputs, and Copilot observations in `Google Sans Text` (max prose measure `65ch–75ch`).
- **Label / Ledger Code & Badge** (`600`, `0.75rem` / `12px`, line-height `1.25`, tracking `0.02em`, `tabular-nums`): Table column headers, employee ID codes (`HAB-SEC-0101`), statutory rate badges, and status chips in `Google Sans Mono`.

### Named Rules
**The Tabular Ledger Rule.** Every numeric value—ETB currency, tax percentages, working days, attendance counts, and stock quantities—must apply `font-mono tabular-nums` (`Google Sans Mono`) so digits align vertically down every table column and calculation breakdown.

## Layout

The application uses a fixed-viewport enterprise shell (`1440px` desktop baseline, `h-screen overflow-hidden`) designed for zero wasted horizontal space and rapid module switching:

- **Collapsible Left Sidebar:** `240px` (`w-60`) expanded width on desktop (`lg` breakpoint `1024px+`), collapsing smoothly (`200ms cubic-bezier(0, 0, 0.2, 1)`) to a `64px` (`w-16`) icon rail with fixed floating hover tooltips (`left: 72px` collapsed, `left: 248px` expanded). On mobile/tablet (`<1024px`), it operates as an off-canvas slide-over drawer.
- **Sticky Top Header Bar:** `56px` (`h-14`) sticky header (`z-30`) housing the quick-jump module search bar (`max-w-sm`), active role persona switcher, bilingual toggle (`EN / አማ`), dark mode toggle, notification popover, and Copilot drawer trigger.
- **Single-Line Smart Nudge Strip:** Directly below the TopBar, a compact `8px` vertical-padded bar (`py-2 px-4`) surfaces one contextual routine observation and a 1-click decision button.
- **Main Content Container:** Centered `1280px` (`max-w-7xl`) scrollable container with responsive horizontal padding (`16px` mobile, `24px` tablet, `32px` desktop) and `24px` (`space-y-6`) vertical rhythm between primary sections.
- **Grid Systems:** Executive KPI strips use a 4-column responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`, `16px` gap). Split workbench views (such as the System Master Setup editor + Live Formula Sandbox) use a 12-column asymmetric split (`lg:grid-cols-12` with `lg:col-span-8` configuration workspace and `lg:col-span-4` sticky live calculator).

## Elevation & Depth

HAB ERP uses **flat tonal layering and 1px hairline borders** at rest rather than drop-shadow elevation. Depth is communicated by surface contrast: white cards (`#FFFFFF`) sit cleanly atop the cool slate canvas (`#F8FAFC`), while golden-cream structural chrome (`#FFF9DB` / `#FFFDE8`) frames the viewport perimeter.

### Shadow Vocabulary
- **Popover & Tooltip Float** (`box-shadow: 0 4px 6px -1px rgba(14, 21, 37, 0.08), 0 2px 4px -2px rgba(14, 21, 37, 0.04)`): Used only on floating sidebar tooltips, quick-search autocomplete menus, and header notification dropdowns.
- **Slide-Over Drawer Overlay** (`box-shadow: -8px 0 30px rgba(14, 21, 37, 0.16)`): Reserved for the right-hand HAB Routine Copilot drawer (`w-full max-w-md`) and mobile navigation drawer over a `bg-slate-900/40 backdrop-blur-[1px]` scrim.

### Named Rules
**The Flat-By-Default Rule.** Primary cards, KPI tiles, and data tables sit flat at rest (`shadow-none`) with crisp 1px borders. Shadows appear only on transient floating overlays (tooltips, dropdowns, slide-over drawers, and modals).

**The No Cards Within Cards Rule.** Never nest boxed sub-cards inside a parent card. Separate internal records using flat 1px horizontal row dividers (`divide-y divide-slate-100`).

## Shapes

The geometry balances approachable utility with compact tabular density:

- **Primary Containers & KPI Cards:** Gently rounded corners (`12px` / `rounded-xl`) with `1px solid` borders (`#E2E8F0` on white, `#EFE1AA` on golden-cream).
- **Buttons, Inputs, & Navigation Items:** Crisp `8px` corners (`rounded-lg`) for tactile click targets that align cleanly inside `56px` bars and table toolbars.
- **Compact Badges & Numeric Counters:** Subtle `6px` corners (`rounded-md`) or `4px` (`rounded`) for inline monospaced counters (`10px`–`11px` text), keeping status indicators distinct from clickable buttons.
- **Strict Border Discipline:** All borders are uniform `1px solid` hairlines. Thick decorative sidebars (`border-l-4` or `border-t-4`) are banned across cards and navigation items.

## Components

### Buttons
- **Shape:** Crisp rounded corners (`8px` / `rounded-lg`), compact padding (`8px 14px`), `12px`–`13px` `Google Sans` (`font-semibold`) label with optional `14px`–`16px` leading or trailing SVG icon.
- **Primary (Navy Authority):** Background `#0E1525`, text `#FFF9DB`, border `1px solid #0E1525`. Hover shifts background to `#19233C` and text to `#FFF500`. Used for primary module actions (*Recalculate & Sync All Modules*, *Execute 1-Click Action*, *Add Employee*).
- **Brand Accent (Sovereign Gold):** Background `#EBE834`, text `#0E1525`, border `1px solid rgba(14, 21, 37, 0.15)`. Used for the HAB Copilot trigger button and high-priority highlights.
- **Secondary / Ghost:** Background `#FFFFFF` (or `#FFFDE8` in chrome), text `#0E1525`, border `1px solid #E2E8F0` (or `#EFE1AA`), hover background `#F8FAFC` (or `#F5EAB8`).

### Chips
- **Style:** Compact status chips (`6px` radius, `3px 8px` padding) rendered in `Google Sans Mono` (`11px`, `font-weight: 600`, `tabular-nums`) with semantic 1px borders (`#ECFDF5` / `#047857` for SLA Emerald, `#FFFBEB` / `#B45309` for Operational Amber, `#FFF1F2` / `#BE123C` for Deficit Rose).
- **State:** Interactive filter tabs sit inside a `#F1F5F9` (`bg-slate-100`) segmented track (`8px` radius, `4px` padding) with active buttons elevated on `#FFFFFF` (`6px` radius, `#0E1525` text).

### Cards / Containers
- **Corner Style:** `12px` (`rounded-xl`) across both KPI metric tiles (`HabMetricCard`) and primary workspace containers.
- **Background:** `#FFF9DB` (hover `#FFF4BF`) for Light-Gold `HabMetricCard` KPI tiles; `#FFFFFF` (`#0F172A` in dark mode) for workspace data cards and tables.
- **Shadow Strategy:** Flat at rest (`shadow-none`), relying on surface contrast and 1px hairline borders per the Elevation section.
- **Border:** `1px solid #EFE1AA` on golden-cream KPI cards; `1px solid #E2E8F0` (`#1E293B` dark mode) on white workspace containers, with `1px solid #F1F5F9` internal section header dividers.
- **Internal Padding:** `16px 20px` (`min-h-[116px]`) for `HabMetricCard` tiles; `20px` (`p-5`) for standard cards; `0px` body padding on full-bleed ledger tables (`<thead>` cells use `10px 16px`, `<tbody>` cells use `12px 16px`).

### Inputs / Fields
- **Style:** `8px` radius (`rounded-lg`), `1px solid #CBD5E1` (`#EFE1AA` on `#FFFDE8` for the TopBar quick-jump search input), `#FFFFFF` background, `13px` `Google Sans Text` `#0E1525` text. Numeric parameter inputs in System Master Setup use `Google Sans Mono` (`font-mono tabular-nums`).
- **Focus:** `focus:outline-none focus:ring-2 focus:ring-[#0E1525]/20 focus:border-[#0E1525]`.
- **Error / Disabled:** Read-only/audit mode inputs (for non-Super Admin roles in System Master Setup) render with `bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed`.

### Navigation
- **Container:** Fixed/sticky left rail in `#FFFDE8` with `1px solid #EFE1AA` right border; supports 1-click full-screen collapse (`240px` ↔ `64px`) and category accordions (*Workforce*, *Operations*, *Finance*, *Governance*).
- **Default / Hover States:** `13px` `Google Sans Text` (`font-medium`) in `#0E1525`, leading `16px` icon at `75%` opacity, hover fill `rgba(245, 234, 184, 0.65)`.
- **Active State:** Solid `#0E1525` fill, `#FFF9DB` (`font-semibold`) label, and `#EBE834` active icon highlight. Sub-items indent under a `1px solid #EFE1AA` vertical guide rail (`ml-3.5 pl-2.5`).
- **Data Table Headers (`<thead>`):** Global table headers use `#FFF9DB` background, `1px solid #FDE68A` bottom border, and `#0E1525` `11px`–`12px` `Google Sans` (`font-bold`) labels (`#172033` background with `#F8FAFC` text in dark mode).

### Signature Components
- **HAB Routine Copilot (Smart Nudge Bar + Slide-Over Drawer):** Combines a quiet single-line top banner (`#FFFDE8` background, `Google Sans Mono` Tier badge, `Google Sans Text` observation, and a `#0E1525` 1-click execution button) with a right-hand slide-over drawer (`max-w-md`) featuring live cross-module impact lists (*HRM*, *Inventory*, *Finance*), learned role habits, and a cross-departmental ripple simulator.
- **System Master Setup & Live Formula Sandbox:** A 4-domain statutory rule console (*Payroll & Tax*, *Shifts & Leave*, *Grades & Penalties*, *Warehouse Thresholds*) with Super Admin RBAC editing and a sticky real-time payroll/tax/overtime formula calculator (`Google Sans Mono` tabular breakdown) that previews every rule change and syncs across all ERP records.
- **3D Warehouse Digital Twin & Stock Ledger:** Split interactive Three.js/WebGL spatial rack inspector (`rounded-xl`, `border-slate-200`) paired with a live tabular inventory ledger and automated reorder buffer alerts driven by System Master Setup thresholds.

## Do's and Don'ts

### Do:
- **Do** use `#FFF9DB` and `#FFFDE8` with `#EFE1AA` 1px borders for navigation, headers, KPI summary tiles, and table `<thead>` elements.
- **Do** apply `Google Sans` (`--font-sans`) for all UI copy and `Google Sans Mono` (`--font-mono tabular-nums`) for all ETB currency amounts, percentages, headcounts, IDs, and calculation tables.
- **Do** use progressive disclosure (segmented view switchers and collapsible category accordions) so each screen presents one clear operational lens at a time.
- **Do** provide both Light Mode and Dark Mode token mappings (`dark:bg-slate-900`, `dark:border-slate-800`, `dark:text-slate-100`) on all custom surfaces.

### Don't:
- **Don't** nest boxed cards inside other cards; use flat `1px` horizontal dividers (`divide-y divide-slate-100`) to group rows inside a container.
- **Don't** use thick colored left or top accent borders (`border-l-4`, `border-t-4`) on KPI cards, alerts, or sidebar links.
- **Don't** use generic blue/indigo SaaS gradients, neon cyberpunk glows, or decorative circular gauges when a clean tabular figure and status badge communicate faster.
- **Don't** use browser-native `window.alert` or `window.confirm` dialogs; always use inline confirmation banners or toast notifications.
