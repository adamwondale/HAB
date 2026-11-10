---
name: dashboard-designer
description: >-
  Synthesized master protocol for designing high-performance, accessible, and decision-driven data dashboards.
  Enforces F-pattern and Z-pattern grid layouts, strict density and whitespace budgeting (15-20% white space,
  max 6-8 charts per view), 4-layer metric architecture (North Star, input metrics, guardrails, operational metrics),
  insight-driven typography hierarchies, semantic RAG color constraints, and mobile responsive standards.
  Use when designing, auditing, refactoring, or building executive, operational, or analytical dashboards.
---

# Dashboard Designer — Master Engineering & Visual Protocol

A unified, production-grade protocol for designing high-performance data dashboards that drive decisions rather than displaying disconnected data. Synthesized from industry-leading dashboard design systems, cognitive ergonomics, and accessibility standards.

---

## 1. Core Architectural Framework: The 4 Dashboard Layers

Every dashboard must be structured around a strict 4-layer information hierarchy (budgeted between 11 to 22 total metrics):

```
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 1: NORTH STAR METRIC (1 Metric)                                  │
│ Summarizes core business/user value delivered; moves week-over-week.  │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 2: INPUT METRICS (3–5 Metrics)                                   │
│ The direct controllable operational drivers whose movement moves NS.  │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 3: GUARDRAIL / COUNTER-METRICS (3–5 Metrics)                    │
│ Quality/risk checks ensuring NS isn't gamed at the cost of the system. │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 4: OPERATIONAL METRICS (4–8 Metrics per Team)                   │
│ Team-level tactical execution metrics with explicitly named owners.   │
└────────────────────────────────────────────────────────────────────────┘
```

### The Vanity vs. Actionable Rule
Before any metric is admitted to a dashboard, it must pass the **10% Test**:
> *"If this metric moves up or down by 10% next week, what explicit operational action or decision will be taken?"*
- **Clear operational action**: Admitted (Actionable).
- **No clear action / curiosity only**: Rejected (Vanity).

### The Comparison Anchor Discipline
A metric without an anchor is meaningless. Every displayed metric must provide at least one comparison anchor:
1. **vs. Target / Goal** (e.g. `3.4× quota (Target: 3.0×)`)
2. **vs. Prior Period** (e.g. `+12.4% vs. last week / last month`)
3. **vs. Cohort Baseline** (e.g. `W4 cohort retention vs. benchmark`)

---

## 2. Grid Layout & Visual Scanning Patterns

Dashboards must map to human cognitive visual traversal patterns.

### Pattern A: F-Pattern Layout (Standard for Operational & Analytical Dashboards)
Used when users need to explore supporting context, analyze breakdowns, and drill into granular details:

```
┌────────────────────────────────────────────────────────────────────────┐
│ HEADER: Global Controls, Date Range, Facility/Region Filter, Refresh  │
├──────────────┬──────────────┬──────────────┬───────────────────────────┤
│ Hero KPI 1   │ Hero KPI 2   │ Hero KPI 3   │ Hero KPI 4                │
│ (North Star) │ (Key Driver) │ (Key Driver) │ (Critical Guardrail)      │
├──────────────┴──────────────┴──────────────┴───────────────────────────┤
│ Primary Insight Chart (60% Width)          │ Secondary Context (40%)   │
│ Continuous trend / Volume time-series      │ Categorical breakdown     │
├────────────────────────────────────────────┴───────────────────────────┤
│ Granular Supporting Analysis / Filterable Detail Data Table            │
└────────────────────────────────────────────────────────────────────────┘
```

### Pattern B: Z-Pattern Layout (Standard for Executive & Strategic Scorecards)
Used for fast executive briefings where the viewer needs to absorb the overarching narrative in seconds:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Top-Left] North Star Metric       ─────────► [Top-Right] Date & Health│
│                                   ╲                                    │
│                                    ╲                                   │
│                                     ╲  [Diagonal] Core Trend/Variance  │
│                                      ╲                                 │
│ [Bottom-Left] Key Input Drivers    ─────────► [Bottom-Right] Strategic │
│                                               Drill-Through / Actions  │
└────────────────────────────────────────────────────────────────────────┘
```

### Layout Anatomy & Spatial Geometry
- **Outer Shell**: Max-width `1400px` centered, with `16px` padding around canvas.
- **Grid Gutters / Gap**: Consistent `16px` gap between cards and layout columns.
- **Card Internal Padding**: `20px` to `24px` (`paddingLG` in design tokens).
- **Border Radius**: Consistent `8px` corner radius.
- **Container Elevation**: Subtle, crisp elevation (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)`).

---

## 3. Density Limits & Whitespace Allocation

Clutter causes cognitive paralysis. Enforce strict visual budget limits:

| Dimension | Strict Budget / Limit | Engineering Rationale |
|---|---|---|
| **Whitespace Allocation** | **15% – 20%** of total surface area | Guides eye scanning, reduces decision fatigue. |
| **Max Charts per View** | **Max 6–8 charts** per active viewport | More than 8 visuals degrades insight recall. |
| **KPI Count by Tier** | **Executive**: 3–5 KPIs<br>**Operational**: 6–10 KPIs<br>**Analytical**: 8–12 KPIs | Matches audience attention span and decision velocity. |
| **Time-Series Density** | Max **500 points** per series | Downsample or aggregate larger datasets server-side. |
| **Categorical Bars** | Max **50 bars** total | If categories > 8 or labels > 12 chars, use horizontal bars. |
| **Donut / Pie Slices** | Max **3–5 slices** | Never use 3D charts; prefer ranked horizontal bar charts. |
| **Data Tables** | Max **100–200 visible rows** | Always paginate with sticky headers and search filters. |
| **Scatter Plots** | Cap at **1,000 points** | Apply hexbinning or contour density maps if n > 1,000. |

---

## 4. Typography & Information Hierarchy

Establish a strict type scale to enforce clear visual hierarchy:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Level 1: Page / Report Title      20–24pt (Bold / 700)                 │
│ Level 2: Section & Card Titles    14–16pt (Semi-Bold / 600)            │
│ Level 3: Metric Hero Value        24–32pt (Bold / 700)                 │
│ Level 4: Delta Badge / Subtitle   12–13pt (Medium / 500)               │
│ Level 5: Axis & Field Labels      10–12pt (Regular / Uppercase 0.5px)  │
│ Level 6: Timestamps & Footers     9–10pt  (Light / Muted)              │
└────────────────────────────────────────────────────────────────────────┘
```

### Insight-First Title Standard
Chart headers must state the **key business insight**, never a generic mechanical label:
- ❌ **Anti-pattern**: `Revenue by Region`
- ✅ **Standard**: `North Region Outperformed by 18% Following Logistics Reroute`
- ❌ **Anti-pattern**: `Defect Rate`
- ✅ **Standard**: `Defects Stabilized Below 0.50% Transit Loss Threshold`

### Number Formatting Rigor
Never display raw, unformatted database numbers:
- Large Currencies: `$1.24M` or `$340K` (never `$1,241,894.22`).
- Percentages: `24.5%` (max 1 decimal place).
- Quantities: `14,250 kg` (locale-formatted with clear units).

---

## 5. Semantic Color Strategy & Accessibility (WCAG AA)

Never pick colors decoratively. Color must be reserved for semantic meaning and data categorization.

### Semantic RAG Status System
```
🟢 Positive / On-Track:   #2E8B57 (SeaGreen)   | Above target, healthy status
🔴 Negative / Alert:       #DC143C (Crimson)    | Below threshold, critical SLA breach
🟡 Caution / Warning:     #FF8C00 (DarkOrange) | Approaching limit, monitor closely
🔵 Primary Neutral Data:  #0077BB (Ocean Blue) | Volume bars, base time-series
⚪ Context / Inactive:     #708090 (Slate Gray) | Prior period line, gridlines, axis
```

### Colorblind-Safe Palette (Okabe-Ito / Tol Scale)
When designing for broad accessibility or colorblind users:
- **Blue**: `#0077BB`
- **Orange**: `#EE7733`
- **Teal**: `#009988`
- **Crimson**: `#CC3311`

### Strict Accessibility Invariants
1. **No Color Alone**: Color must never be the sole carrier of information. Always pair status colors with icons, trend arrows (`▲`, `▼`, `●`), or explicit status badges.
2. **Contrast Ratio**: Minimum `4.5:1` contrast ratio for all data text and labels against backgrounds.
3. **Max 4–5 Accent Colors**: Never create rainbow dashboards. Grey is the default for context; reserve vivid hues for data requiring attention.

---

## 6. Interaction, Filters & Navigation Patterns

1. **Top Pinned Filter Bar**:
   - Place high-cardinality filters (Date Range, Location, Category) at the top of the canvas.
   - Slicers must indicate active selections and provide a 1-click "Reset All" action.
2. **Tabbed Information Architecture**:
   - Limit tab navigation to a maximum of **7 tabs** per dashboard view.
   - Order tabs logically by user workflow or descending strategic importance.
3. **Drill-Through Ergonomics**:
   - Provide visual cues for interactive elements (`cursor: pointer`, hover states).
   - Drill-down views must offer clear breadcrumbs and a persistent "Back" button maintaining filter context.
4. **Touch & Mobile Targets**:
   - Minimum interactive target size is `44px × 44px`.
   - On screens `<768px`, collapse multi-column KPI grids into 2-column or single-column stacked rows.

---

## 7. Pre-Flight Verification Checklist (The 5-Second Test)

Before shipping any dashboard design or implementation, verify every item:

- [ ] **The 5-Second Test**: An unprompted stakeholder can glance at the top-left quadrant for 5 seconds and state whether performance is good or bad.
- [ ] **Layer Integrity**: North Star, input metrics, and guardrails are clearly distinguishable.
- [ ] **10% Test**: Every metric has an operational owner and an explicit response plan for a 10% shift.
- [ ] **Comparison Anchors**: Every KPI card and chart has a target, prior-period, or benchmark anchor.
- [ ] **Density Compliance**: Total visuals on screen do not exceed 6–8 charts.
- [ ] **Whitespace**: At least 15–20% clean whitespace surrounding cards and sections.
- [ ] **Insight Titles**: Titles convey the takeaway, not just the metric name.
- [ ] **Accessibility**: High-contrast text (>4.5:1), colorblind-safe palettes, no color-only status indicators.
- [ ] **Responsive Flow**: Tested at desktop (>1200px), tablet (768px–1024px), and mobile (<768px) views.
- [ ] **Data Freshness**: Header displays timestamp of last refresh and active data window.
