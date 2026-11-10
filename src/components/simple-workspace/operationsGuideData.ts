import { OperationGuideContent } from './PageOperationsGuide';

export const OPERATIONS_GUIDES: Record<string, OperationGuideContent> = {
  'work_sites': {
    summary: 'Manage client facilities across Addis Ababa, track staff deployment, and fill post vacancies in 4 districts.',
    whoUsesIt: 'Operations Supervisor, Shift Coordinator, Field Inspector',
    workflow: [
      'Filter by District (e.g., District 1 - South) to view facilities in that zone.',
      'Inspect site status and headcount deficits (Required vs. Deployed).',
      'Drag an unassigned employee card from the top dock onto an active site to assign them.',
      'Or click "+ Assign employee" to select post and shift manually.'
    ],
    buttons: [
      { label: '+ Assign employee', description: 'Opens the assignment form to deploy a worker to a site post.' },
      { label: 'Active / Inactive pills', description: 'Toggles between live active client contracts and concluded/frozen contracts.' },
      { label: 'District Filter', description: 'Filters sites into South (D1), Central (D2), North (D3), or East (D4).' },
      { label: 'Drag card to deploy', description: 'Grabs an unassigned worker. Hovering over a site opens open posts for 1-drop assignment.' },
      { label: 'Download report', description: 'Exports the current site deployment roster to CSV for field printing.' }
    ]
  },
  'store': {
    summary: 'Manage physical inventory for uniforms, cleaning chemicals, radios, boots, and tools with 2D records and 3D warehouse twin.',
    whoUsesIt: 'Storekeeper, Logistics Head, Facilities Manager',
    workflow: [
      'Check "Low stock" metric to identify items needing urgent replenishment.',
      'Click "+ Add item" to register new catalog stock arriving from suppliers.',
      'Switch to "3D Store Map" to view physical shelf bays and click racks to inspect stock.',
      'Click "Issue from Shelf" or "Restock Rack" in 3D to update balances in real time.'
    ],
    buttons: [
      { label: '+ Add item', description: 'Opens form to add a new inventory item with initial stock and shelf location.' },
      { label: '[Records Table] / [3D Store Map]', description: 'Switches between fast 2D table and interactive 3D physical warehouse.' },
      { label: 'Bays buttons (in 3D)', description: 'Flies the 3D camera directly to Zone A (Security), Zone C (Cleaning), or Dispatch Bay.' },
      { label: 'Issue from Shelf (in 3D)', description: 'Deducts 1 unit from stock, writes transaction log, and updates physical shelf.' },
      { label: 'Restock Rack (in 3D)', description: 'Adds received inventory from suppliers to shelf count.' }
    ]
  },
  'employees': {
    summary: 'Central directory of all security guards, cleaners, and head office staff with contacts and site placements.',
    whoUsesIt: 'HR Manager, Personnel Officer, Operations Lead',
    workflow: [
      'Search an employee by name, ID code (e.g. HAB-SEC-0104), or phone number.',
      'Click "+ Add employee" to enroll a new worker with national ID, guarantor, and pay grade.',
      'Filter by status (Active, On leave, In clearance) to review roster.'
    ],
    buttons: [
      { label: '+ Add employee', description: 'Opens form to register a new employee into the system.' },
      { label: 'Search employees', description: 'Instantly filters records by name, ID code, or location.' },
      { label: 'Download report', description: 'Exports the full employee directory to CSV spreadsheet.' }
    ]
  },
  'payroll': {
    summary: 'Monthly salary calculation incorporating 30 standard working days, overtime hours, and pension/tax withholdings.',
    whoUsesIt: 'Finance Head, Payroll Specialist, Managing Director',
    workflow: [
      'Click "Prepare payroll" to run the calculation engine using current attendance.',
      'Review net pay figures and statutory withholdings (7% employee pension, income tax).',
      'Filter by Payment status to check Approved vs. Draft payments.',
      'Click "Download report" to export the official Commercial Bank of Ethiopia (CBE) salary transfer file.'
    ],
    buttons: [
      { label: 'Prepare payroll', description: 'Re-runs payroll formulas against attendance, overtime, and deductions.' },
      { label: 'Status Filter', description: 'Filters records between Draft, Approved, and Disbursed.' },
      { label: 'Download report', description: 'Exports bank-ready bulk payment CSV schedule.' }
    ]
  },
  'master-setup': {
    summary: 'Superadmin master configuration: adjust Ethiopian pension rates, standard working days, shift lengths, and overtime rules.',
    whoUsesIt: 'Superadmin, Executive Managing Director Only',
    workflow: [
      'Review current rule sets used by the automated payroll and leave engines.',
      'Modify statutory values (e.g., employee pension %, employer pension %, shift hours).',
      'Click "Save settings" to commit changes. All live calculations will immediately adopt new rules.'
    ],
    buttons: [
      { label: 'Save settings', description: 'Commits updated system rules and re-evaluates all active formulas.' },
      { label: 'Search settings', description: 'Finds specific parameters (e.g. tax, pension, working days).' },
      { label: 'Download report', description: 'Exports configuration audit log with timestamps.' }
    ]
  }
};
