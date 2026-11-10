# Context: Phase 1 — Warm Earth Palette Migration

## Background & User Decisions
From the `/gsd-explore` session, the user approved transitioning the HAB Business PLC ERP from the legacy navy/bright-yellow palette to a warm, organic Earth palette centered on `#F2C46A` as the main brand color.

## Approved Palette & Token Roles
- **Primary Brand / Main Accent:** `#F2C46A` (Golden Honey)
  - Applied to primary action buttons (CTAs), active sidebar navigation pills, active tabs, metric highlights, and focus rings.
  - MUST use `#4C4541` (Deep Espresso) for foreground text and icons to satisfy WCAG AAA 6.8:1 contrast. White text on `#F2C46A` is strictly prohibited.
- **Deep Espresso (Text / Dark Shell):** `#4C4541`
  - Primary text color in light mode.
  - Structural dark shell (sidebar and topbar in dark mode), borders, and headings.
- **Sage Green (Secondary Accent):** `#AEAC78`
  - Secondary category badges, department pills (Security vs. Cleaning), secondary borders, site filter tags.
  - Keeps dedicated functional emerald (`#047857`), amber (`#B45309`), and rose (`#BE123C`) for payroll and attendance alerts.
- **Warm Linen (Light Shell / Canvas):** `#FCF0DA`
  - Light mode sidebar background, topbar header wash, table headers, and modal header backgrounds.

## Scope of Changes
1. **Design System:** Update `DESIGN.md` color tokens and component styling specifications.
2. **Global CSS:** Update `src/index.css` table headers (`thead` to `#FCF0DA`), body text (`#4C4541`), light canvas background (`#FDFBF7`), and warm espresso dark mode classes.
3. **Application Shell:**
   - `src/components/Sidebar.tsx`: Active tab highlight `#F2C46A` with `#4C4541` text, sidebar light background `#FCF0DA`, dark background `#2C2724`.
   - `src/components/TopBar.tsx`: Header background `#FCF0DA` (light) / `#2C2724` (dark), monogram icon `#F2C46A`.
   - `src/components/HabLogo.tsx`: Update monogram SVG fills and brand accents to `#F2C46A` and `#4C4541`.
4. **Primary Action Buttons across Core Views:**
   - Audit and align primary CTA buttons in `PayrollView.tsx`, `DeploymentView.tsx`, `RecruitmentView.tsx`, `ClearanceView.tsx`, and `DashboardOverview.tsx` to `#F2C46A` with `#4C4541` text.
5. **Verification:**
   - TypeScript compilation check (`npx tsc --noEmit`).
   - Clean build check (`npm run build`).
