---
name: pstack-frontend-craft
description: High-rigor frontend engineering principles adapted from poteto/pstack for Next.js 15, React 19, Refine framework, and Ant Design 5. Use when creating, refactoring, or reviewing frontend components, views, hooks, forms, or data providers.
---

# Frontend Engineering Craft (pstack Edition)

High-rigor frontend engineering rules for **Next.js 15 + React 19 + Refine + Ant Design 5**. Built to eliminate AI slop, prevent sprawling mega-components, and deliver a rock-solid, production-grade enterprise UI.

---

## 1. Core Philosophy: Go Deep, Not Bloated

1. **Subtract before you add**: Never layer a patch on top of an already sprawling component. Prune dead state, simplify shapes, and decompose before adding new UI capabilities.
2. **Model state as a machine, not a bag of booleans**: Two or more related booleans (`isLoading`, `isEditing`, `isModalOpen`, `isSubmitting`) are a state machine waiting to be made explicit.
3. **Respect file and component budgets**: Any UI component crossing 250 lines must be split into focused sub-components and custom hooks.

---

## 2. File & Component Size Discipline

Mega-components (500+ lines) accumulate untracked state bugs and make parallel agent work hazardous.

| Rule | Threshold | Action |
|------|-----------|--------|
| Component File Budget | 250 lines | Split into sub-components, custom hooks, and shared types. |
| View Container | 300 lines | Extract modals, drawers, and filter bars into dedicated sub-components. |
| Custom Hook | 150 lines | Separate data fetching from domain calculations and mutation logic. |

### Decomposition Pattern:
```
views/WarehouseZones/
├── index.tsx                     # Thin view orchestrator (< 100 lines)
├── useWarehouseZonesState.ts     # Dedicated domain & Refine hooks (< 150 lines)
├── components/
│   ├── ZoneSlotGrid.tsx          # Pure presentation grid
│   ├── ZoneFilterToolbar.tsx     # Filter and search bar
│   ├── PalletTransferDrawer.tsx  # Mutation drawer
│   └── ZoneMetricsHeader.tsx     # KPI summary cards
└── types.ts                      # View-local discriminated unions
```

---

## 3. State Modeling: Discriminated Unions Over Boolean Soup

### ❌ Anti-Pattern (Scattered Booleans):
```typescript
// Fragile, allows 16 impossible permutations
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
const [isEditMode, setIsEditMode] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
```

### ✅ Clean pstack Pattern (Explicit State Machine):
```typescript
type WorkstationDrawerState =
  | { status: 'closed' }
  | { status: 'viewing'; lotId: LotId }
  | { status: 'editing'; lotId: LotId; snapshot: LotDto }
  | { status: 'submitting'; lotId: LotId };

const [drawerState, setDrawerState] = useState<WorkstationDrawerState>({ status: 'closed' });
```

---

## 4. Refine Framework (v5) Best Practices

1. **Leverage Native Refine Hooks**:
   - Tables: `useTable({ resource: 'lots', syncWithLocation: true, pagination: { mode: 'server' } })`.
   - Forms: `useForm<LotDto>({ refineCoreProps: { resource: 'lots', action: 'create', redirect: false } })`.
   - Modals / Drawers: `useModalForm` or `useDrawerForm` with built-in submit and dirty checking.
   - Lookups: `useSelect({ resource: 'farmers', optionLabel: 'fullName', optionValue: 'id' })`.
2. **Cache Invalidation Discipline**:
   - Always declare explicit `invalidates: ['lots', 'facility-ledgers']` when executing mutations via `useCustomMutation` or `useCreate`/`useUpdate`.
   - Never rely on manual `window.location.reload()` or ad-hoc event buses to sync table data after a mutation.
3. **Data Provider Hygiene**:
   - All network requests go through Refine's `dataProvider` or configured Axios/SignalR telemetry client.
   - Parse untrusted API responses at the boundary with typed `parseX(raw: unknown)` functions (see `pstack-typescript-rigor` §5) before passing them into component props.

---

## 5. Ant Design 5 (Antd v5) Design Token Discipline

1. **Theme Tokens over Hardcoded Hex Values**:
   - Use `theme.useToken()` to access design tokens (`token.colorPrimary`, `token.colorBgContainer`, `token.borderRadiusLG`, `token.paddingSM`).
   - Never write hardcoded colors like `color: '#1a365d'` or `backgroundColor: '#f0f2f5'`.
   - Always ensure dark mode compatibility through semantic tokens (`colorTextSecondary`, `colorBorderSecondary`).
2. **Layout & Spacing Structure**:
   - Favor Antd layout components (`Flex`, `Space`, `Row`/`Col`, `Card`, `Typography`) with token spacing.
   - Use `gap={token.marginSM}` instead of arbitrary inline margins.
3. **Enterprise Data Table Design**:
   - Set `size="middle"` or `size="small"` for high-density ERP views.
   - Always set `scroll={{ x: 'max-content', y: ... }}` on enterprise grids to prevent table breaking on narrow viewports.
   - Provide custom `render` functions that defensively handle `null` or `undefined` (e.g. `val ?? '—'`).

---

## 6. React 19 & Next.js 15 Purity

1. **`"use client"` Placement**:
   - Keep `"use client"` at the boundary leaves (interactive buttons, forms, tables). Keep layouts and meta wrappers as Server Components where applicable.
2. **Render Idempotency**:
   - No side effects in render functions or component bodies.
   - Derive values directly during render instead of storing synced copies in `useState` with `useEffect`.
   - With the React 19 compiler, avoid compulsive `useCallback`/`useMemo` wrapper sludge unless performing heavy transformations (e.g. cupping score radar calculations, mass balance aggregation).

---

## 7. Defensive Enterprise UI Checklist

Before handing off any frontend code:
- [ ] Are empty, loading, and error states explicitly designed using Antd `<Skeleton>`, `<Empty>`, or `<Alert>`?
- [ ] Are numeric coffee metrics (yield %, moisture %, cherry kg) defensively parsed and formatted with appropriate units?
- [ ] Are action buttons disabled while an async mutation is pending to prevent double-submits?
- [ ] Does the file stay strictly under the 250-line budget?
- [ ] Does `npm run lint` pass cleanly with zero warnings or errors?
