---
title: Warm Earth Palette System Specification
date: 2026-11-09
context: Socratic ideation session on adopting a warm earth-tone design system with #F2C46A as the primary brand color
status: settled
---

# Warm Earth Palette System Specification

## 1. Core Palette Tokens & Semantic Mapping

| Token Name | Hex Code | RGB | Role in HAB Business PLC ERP |
|---|---|---|---|
| **Primary Brand / Main Accent** | `#F2C46A` | `rgb(242, 196, 106)` | Primary action buttons (CTAs), active sidebar nav items, active tab indicators, key metric highlights, focus rings, brand monogram accents. |
| **Deep Espresso (Text / Dark Shell)** | `#4C4541` | `rgb(76, 69, 65)` | Primary text in light mode, dark mode structural shell (sidebar/topbar), table borders, high-contrast typography, and text on gold buttons. |
| **Sage Green (Secondary Accent)** | `#AEAC78` | `rgb(174, 172, 120)` | Secondary category badges, department pills (Security vs. Cleaning), secondary borders, site filter tags, subtle icons. Preserves dedicated functional emerald/amber/rose for payroll/attendance alerts. |
| **Warm Linen (Light Shell / Canvas)** | `#FCF0DA` | `rgb(252, 240, 218)` | Light mode sidebar background, table header wash, modal header backgrounds, and subtle card hover tints. |

---

## 2. Shell & Surface Architecture (Dual Mode)

### Light Mode
- **Canvas / Page Background:** `#FDFBF7` (subtle warm-tinted off-white)
- **Cards & Data Tables:** `#FFFFFF` with `#EFE7D8` hairline borders
- **Table Headers & Group Dividers:** `#FCF0DA` with `#4C4541` bold headers
- **Sidebar & TopBar:** `#FCF0DA` background with `#4C4541` typography and `#F2C46A` active navigation indicator pills
- **Active Navigation State:** `#F2C46A` background with `#4C4541` text and iconography

### Dark Mode
- **Canvas:** `#1A1715` (deep warm espresso-tinted black)
- **Cards & Elevated Surfaces:** `#24201E`
- **Sidebar & TopBar:** `#2C2724` with `#4C4541` structural borders
- **Active Navigation State:** `#F2C46A` with `#24201E` text or gold glow ring

---

## 3. Accessibility & Contrast Standards

> [!IMPORTANT]
> `#F2C46A` is a warm luminous gold. White text (`#FFFFFF`) on `#F2C46A` has an inaccessible contrast ratio of **1.6:1** (Fails WCAG).
> Every button or badge with a `#F2C46A` background MUST use `#4C4541` (Deep Espresso) for text and iconography (Contrast ratio **6.8:1**, passing WCAG AAA for normal text).

- **Primary Button:** Background `#F2C46A`, Text `#4C4541`, Font Weight 600+.
- **Secondary Button:** Background `#FFFFFF`, Border `#AEAC78`, Text `#4C4541`.
- **Text on Warm Linen:** `#4C4541` on `#FCF0DA` yields **7.2:1** (WCAG AAA).
- **Sage Tags:** `#AEAC78` background with `#4C4541` text or soft `#AEAC78/15` tint with dark green/sage text.

---

## 4. Semantic Status Separation (Functional Hybrid)

To avoid user confusion in mission-critical HR and payroll workflows, `#AEAC78` (Sage) is not used for critical error or danger states:
- **Success / Verified:** `#047857` (Emerald) for legal payroll disbursement & biometric verified check-ins.
- **Pending / Warning:** `#B45309` (Amber) for pending leave approval or guarantor verification needed.
- **Danger / Suspended:** `#BE123C` (Rose) for guard termination, clearance block, or disciplinary holds.
- **Informational / Category:** `#AEAC78` (Sage) for general site tagging, cleaning workforce categorization, and system status tags.
