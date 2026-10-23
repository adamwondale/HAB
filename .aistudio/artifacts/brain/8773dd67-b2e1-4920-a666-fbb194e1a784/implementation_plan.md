# Implementation Plan: Collapsible Accordion Sidebar Navigation

## 1. Navigation Structure
We will condense the sidebar navigation in `src/components/Sidebar.tsx` into a clean, compact hierarchy while preserving role-based access filtering and the solid `#DFE16A` yellow-green visual theme:

- **Overview** (Standalone top-level item for instant dashboard access)
- **Workforce & Talent** (Collapsible category dropdown)
  - Employees (`management`)
  - Recruitment (`recruitment`)
  - Onboarding (`onboarding`)
  - Transfers & Promotions (`transfers`)
- **Field Operations** (Collapsible category dropdown)
  - Site Deployment (`deployment`)
  - Shift Attendance (`attendance`)
  - Leave & Relief (`leave` — with pending count badge)
- **Finance & Store** (Collapsible category dropdown)
  - 30-Day Payroll (`payroll`)
  - 3D Store & Stock (`store` — with low-stock count badge)
- **Legal & Exit** (Collapsible category dropdown)
  - Exit Clearance (`clearance` — with active clearance count badge)
  - Work Experience (`experience`)

---

## 2. Accordion Dropdown Behavior & Visual Design
- **Single-Open Accordion**: Clicking a category header expands its nested list of tabs and automatically collapses any other open category.
- **Auto-Sync with Active Tab**: Whenever `activeTab` changes (for example, clicking a metric card on the Overview dashboard or using the top search bar), the category containing that tab automatically expands. When `Overview` is active, all category groups collapse by default until clicked.
- **Category Badge Roll-up**: Each collapsed category header displays a combined badge indicator if any of its child tabs have pending notifications (e.g., pending leaves, low stock, or active clearances), plus a smooth chevron indicator (`ChevronDown` / `ChevronRight`).
