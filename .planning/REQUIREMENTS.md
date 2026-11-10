# Requirements: HAB Business PLC ERP

## System Design & Branding

### REQ-DS-001: Warm Earth Brand Palette Specification
The application interface shall implement the Warm Earth design system palette across all client views and management workflows:

1. **Primary Brand Accent (`#F2C46A`):**
   - The primary brand color `#F2C46A` (Golden Honey) shall be applied to all primary interactive elements (primary action buttons, active navigation indicators, active tabs, metric badges, and focus rings).
   - In accordance with WCAG 2.1 AAA contrast guidelines, all elements with background `#F2C46A` shall use `#4C4541` (Deep Espresso) for foreground text and icons (measured contrast ratio 6.8:1). Foreground white (`#FFFFFF`) on `#F2C46A` is prohibited.

2. **Typography & Dark Shell (`#4C4541`):**
   - `#4C4541` (Deep Espresso) shall serve as the primary text color in light mode and the structural dark surface anchor in dark mode.

3. **Secondary Domain & Categorization (`#AEAC78`):**
   - `#AEAC78` (Sage Green) shall be used for secondary category chips, department filters (e.g. Cleaning vs. Security), and subtle interface borders.
   - Core operational alert states shall maintain dedicated semantic colors: Emerald (`#047857`) for verified check-in & approved payroll; Amber (`#B45309`) for pending requests; Rose (`#BE123C`) for disciplinary holds and alerts.

4. **Light Surface Chrome (`#FCF0DA`):**
   - `#FCF0DA` (Warm Linen) shall be the background color for the application sidebar, top navigation bar, and enterprise data table headers in light mode.
