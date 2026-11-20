# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

HAB Business PLC frontline security guards, custodial cleaning personnel, and operations cluster supervisors deployed across over 100 commercial client facilities in Addis Ababa, plus HR, finance, store, operations, and executive management staff who administer the platform.

## Product Purpose

Unify HAB Business PLC's Security Services and Cleaning Services divisions into a single digital ecosystem that digitizes post-by-post guard rostering, custodial cleaning inspection checklists, shift relief scheduling, 3D warehouse inventory tracking, payroll, exit clearance, recruitment, and onboarding — replacing paper logbooks and fragmented spreadsheets with synchronized real-time workflows connecting field staff, supervisors, and executive management.

## Positioning

A human-centered ERP for service operations in Addis Ababa that prioritizes ultra-simple frontline interfaces over complex administrative software, reducing cognitive fatigue for field workers while giving management real-time visibility across 100+ client sites.

## Operating Context

Field deployment across Addis Ababa client sites (CBE Tower, Ethiopian Airlines Cargo Terminal, Hyatt Regency, St. Paul's Hospital, Bole Medhanialem, CMC Plaza), with Ethiopian Labor Proclamation No. 1156/2019 compliance, ETB currency, Amharic/English bilingual UI, 24/48 security duty cycles, cleaning morning/afternoon weekly rotation, and multi-stage exit clearance workflows (site supervisor → store → finance → HR).

## Capabilities and Constraints

- Role-based dashboards: CEO (executive), Technical Manager (operations), HR, Finance, Store, Operations
- Employee lifecycle: recruitment, onboarding (60-day probation), deployment, attendance, leave, transfers, exit clearance, work letters
- Store/inventory: stock items, transactions, min-reorder alerts, issuance/return tracking
- Payroll: 30-day monthly cycle, ETB, statutory deductions (7% pension employee, 11% employer, income tax, food cost sharing), overtime, allowances
- Clearance: 3-stage cross-department state machine (site supervisor → store → finance → HR) with issued item tracking and penalty fees
- System Master Setup: payroll/tax, shifts/leave, grades/penalties, warehouse thresholds with Live Formula Sandbox
- 3D Warehouse Digital Twin with Three.js/WebGL spatial rack inspector
- Bilingual UI (English / Amharic) via i18next
- Dark mode support
- Constraints: flat hairline architecture (no thick borders), no cards within cards, Google Sans typography, tabular-nums for ETB figures, no browser-native alerts, WCAG AAA contrast on gold buttons

## Brand Commitments

- Name: HAB Business PLC / ÜNISON ERP
- Visual identity: Golden Honey (#F2C46A), Warm Linen (#FCF0DA), Deep Espresso (#4C4541), Sage Green (#AEAC78) per DESIGN.md
- Typography: Google Sans / Google Sans Mono (JetBrains Mono fallback), tabular-nums for numeric data
- Bilingual: English and Amharic UI copy

## Evidence on Hand

- DESIGN.md: complete design system with tokens, components, layout, elevation, shapes, and do's/don'ts
- UNISON_ERP_BOOKLET.md: product booklet with problem, solution, team, and description
- src/data/mockData.ts: initial employees, sites, deployments, attendance, leave, clearances, candidates, onboarding, payroll, transfers, work experiences, management persons, stock items, stock transactions, divisions
- Existing React + TypeScript + Vite + Tailwind codebase with role-based dashboards, sidebar, TopBar, Copilot, and module views

## Product Principles

1. Human-centered first: frontline staff need ultra-simple, dependable interfaces; complexity belongs to admin layers, not field tools.
2. One platform, two divisions: Security and Cleaning unified into a single synchronized workflow with shared employee, deployment, attendance, and inventory records.
3. Ethiopian context: ETB currency, Amharic/English bilingual, Labor Proclamation 1156/2019 compliance, local banking (CBE, Awash, Dashen), kebele/woreda/subcity addressing.
4. Flat operational command: calm, zero-bloat UI with immediate numeric legibility; progressive disclosure for complex workflows.
5. Audit-grade records: every state change logged, clearance and payroll settlements multi-signoff, tabular-numeric precision for all monetary values.

## Accessibility & Inclusion

- WCAG AAA 6.8:1 contrast on Golden Honey buttons with Deep Espresso text
- Bilingual English/Amharic UI
- Dark mode for low-light security and night operations
- Tabular-numeric alignment for all financial and headcount data
- No browser-native window.alert/window.confirm; inline confirmations and toasts only

## Open Decisions

- None pending; both specification documents have been read and mapped to the existing codebase.
