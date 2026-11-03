import fs from 'fs';
import path from 'path';

const htmlDir = path.resolve('/app/applet/html');
const publicHtmlDir = path.resolve('/app/applet/public/html');
const srcDataDir = path.resolve('/app/applet/src/data');

if (!fs.existsSync(publicHtmlDir)) {
  fs.mkdirSync(publicHtmlDir, { recursive: true });
}
if (!fs.existsSync(srcDataDir)) {
  fs.mkdirSync(srcDataDir, { recursive: true });
}

const baseCss = fs.readFileSync(path.join(htmlDir, 'styles.css'), 'utf8');

const pagesMeta = [
  {
    step: '01',
    slug: 'index',
    title: 'Executive Command Overview',
    category: 'Executive Command',
    description: '4-KPI summary row, 42 client site SLA coverage ledger, GM approval queue, and 15-page directory.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 01. Executive Command Overview (index.html / index.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.exec-kpi-trend-up {
  font-size: 11px;
  color: var(--status-success-text);
  font-family: var(--font-mono);
}
.exec-kpi-divisor-tag {
  font-size: 11px;
  color: var(--brand-amber-deep);
  font-family: var(--font-mono);
}
.exec-kpi-gold-tag {
  font-size: 11px;
  color: var(--brand-gold);
  font-family: var(--font-mono);
}
.exec-directory-link {
  border: 1px solid var(--border-card);
  border-radius: 8px;
}
`
  },
  {
    step: '02',
    slug: 'login',
    title: 'Role-Based Portal Login & RBAC Selector',
    category: 'Authentication & RBAC',
    description: 'Split authentication gateway with 2FA staff credential form and 6-role RBAC persona selector.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 02. Role-Based Portal Login (login.html / login.css)
   Target viewport for html.to.design Figma Import: 1440x900 Desktop
   ========================================================================== */
body.login-page-body {
  background-color: var(--surface-chrome-sidebar);
}
.login-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.login-main-container {
  max-width: 1120px;
  margin: auto;
  padding: 40px 24px;
}
.login-workbench-split {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 32px;
  align-items: stretch;
}
.login-submit-btn {
  width: 100%;
  padding: 11px 16px;
  margin-top: 6px;
}
`
  },
  {
    step: '03',
    slug: 'management',
    title: 'Master Workforce Directory (1,248 Staff)',
    category: 'HR & Workforce',
    description: 'Complete employee ledger with Kebele guarantor status, salary grade, shift platoon, and TIN/Pension IDs.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 03. Master Workforce Directory (management.html / management.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.directory-filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.emp-grade-tag {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--brand-navy);
}
`
  },
  {
    step: '04',
    slug: 'recruitment',
    title: 'Candidate Vetting & Recruitment Pipeline',
    category: 'HR & Workforce',
    description: '4-stage vetting pipeline tracking physical fitness, Federal Police fingerprint check, and Kebele guarantor verification.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 04. Recruitment Pipeline (recruitment.html / recruitment.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.recruitment-stage-funnel {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.vetting-score-high {
  color: var(--status-success-text);
  font-weight: 700;
  font-family: var(--font-mono);
}
`
  },
  {
    step: '05',
    slug: 'onboarding',
    title: '7-Point Statutory Onboarding Checklist',
    category: 'HR & Workforce',
    description: 'Mandatory 7-gate compliance tracker before deploying recruits to client sites or issuing Central Store gear.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 05. 7-Point Statutory Onboarding (onboarding.html / onboarding.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.onboarding-gate-progress {
  display: flex;
   flex-direction: column;
  gap: 6px;
}
.gate-pill-complete {
  color: var(--status-success-text);
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 700;
}
`
  },
  {
    step: '06',
    slug: 'deployment',
    title: 'Client Site Workforce Deployment (42 Sites)',
    category: 'Field Operations',
    description: 'Addis Ababa & Sheger City client site SLA post allocation, platoon assignment, and standby relief dispatch.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 06. Client Site Deployment (deployment.html / deployment.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.deployment-sla-optimal {
  color: var(--status-success-text);
  font-weight: 700;
}
.deployment-sla-gap {
  color: var(--status-warning-text);
  font-weight: 700;
}
`
  },
  {
    step: '07',
    slug: 'attendance',
    title: '24/48 Shift Roll-Call & Overtime Ledger',
    category: 'Field Operations',
    description: 'Daily biometric & radio roll-call across 24h On / 48h Off security platoons and 8h split janitorial shifts.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 07. 24/48 Shift Attendance (attendance.html / attendance.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.ot-multiplier-code {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--brand-amber-deep);
}
`
  },
  {
    step: '08',
    slug: 'leave',
    title: 'Leave Management & Standby Relief Roster',
    category: 'Field Operations',
    description: 'Ethiopian Labour Proclamation No. 1156/2019 leave entitlement calculator with mandatory relief guard pairing.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 08. Leave & Relief Roster (leave.html / leave.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.leave-relief-paired {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--status-success-text);
  font-weight: 600;
}
`
  },
  {
    step: '09',
    slug: 'transfers',
    title: 'Inter-Site Transfers & Grade Promotions',
    category: 'HR & Workforce',
    description: 'Tracks site redeployments and L1-L4 / C1-C3 grade promotions with automatic basic salary step adjustments.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 09. Transfers & Promotions (transfers.html / transfers.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.salary-delta-positive {
  font-family: var(--font-mono);
  color: var(--status-success-text);
  font-weight: 700;
}
`
  },
  {
    step: '10',
    slug: 'store',
    title: 'Central Store & 3D Warehouse Spatial Map',
    category: 'Store, Finance & Exit',
    description: 'Megenagna Central Depot 3-Bay spatial rack telemetry, serialized VHF radio vault, and Gate 2 replacement fees.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 10. Central Store & 3D Twin (store.html / store.css)
   Target viewport for html.to.design Figma Import: 1440x1080 Desktop
   ========================================================================== */
.warehouse-twin-card {
  background-color: var(--brand-navy);
  color: var(--surface-chrome-header);
  border-color: var(--brand-navy);
}
.warehouse-bay-panel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  padding: 16px;
}
.warehouse-bay-panel.active-bay {
  border-color: rgba(235, 232, 52, 0.35);
}
`
  },
  {
    step: '11',
    slug: 'payroll',
    title: '30-Day Ethiopian Payroll & Pension Sheet',
    category: 'Store, Finance & Exit',
    description: 'Monthly ERCA income tax & 7%/11% POESSA pension computation ledger with CBE bank transfer export.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 11. 30-Day Payroll & Pension (payroll.html / payroll.css)
   Target viewport for html.to.design Figma Import: 1440x1080 Desktop
   ========================================================================== */
.payroll-net-pay-cell {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--status-success-text);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.payroll-penalty-held-cell {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--status-warning-text);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
`
  },
  {
    step: '12',
    slug: 'clearance',
    title: '4-Gate Exit Clearance & Asset Recovery',
    category: 'Store, Finance & Exit',
    description: 'Sequential 4-gate clearance workflow (Site Handover -> Central Store Kit -> Finance Deduction -> HR Certificate).',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 12. 4-Gate Exit Clearance (clearance.html / clearance.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.clearance-gate-locked {
  color: var(--status-danger-text);
  font-weight: 700;
}
.clearance-penalty-deduction {
  color: var(--status-warning-text);
  font-family: var(--font-mono);
  font-weight: 600;
}
`
  },
  {
    step: '13',
    slug: 'experience',
    title: 'Official Work Experience Certificate Generator',
    category: 'HR & Workforce',
    description: 'Article 12(7) compliant bilingual-ready letterhead generator with protocol reference and dual executive sign-off.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 13. Experience Certificate (experience.html / experience.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.certificate-workbench {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: 24px;
  align-items: start;
}
.certificate-letterhead-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid var(--brand-navy);
  padding-bottom: 18px;
  margin-bottom: 24px;
}
.certificate-body-copy {
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.certificate-signoff-row {
  margin-top: 42px;
  padding-top: 20px;
  border-top: 1px solid var(--border-card);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
`
  },
  {
    step: '14',
    slug: 'org',
    title: 'Management Hierarchy & RBAC Matrix',
    category: 'Executive Command',
    description: 'Executive command structure, departmental heads, and module-level read/write permission matrix.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 14. Org Hierarchy & RBAC (org.html / org.css)
   Target viewport for html.to.design Figma Import: 1440x1024 Desktop
   ========================================================================== */
.rbac-write-badge {
  color: var(--status-success-text);
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 700;
}
.rbac-readonly-badge {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 11.5px;
}
`
  },
  {
    step: '15',
    slug: 'master-setup',
    title: 'System Master Setup & Live Formula Engine',
    category: 'Executive Command',
    description: 'Super Admin governance console for Ethiopian tax brackets, 7%/11% pension, overtime multipliers, and live net-pay simulator.',
    specificCss: `
/* ==========================================================================
   Page-Specific Styles: 15. System Master Setup (master-setup.html / master-setup.css)
   Target viewport for html.to.design Figma Import: 1440x1120 Desktop
   ========================================================================== */
.master-sandbox-aside {
  position: sticky;
  top: 80px;
}
.master-net-pay-total {
  padding: 12px 14px;
  background-color: var(--brand-navy);
  color: var(--brand-gold);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
`
  }
];

const exportBundle = [];

for (const page of pagesMeta) {
  const htmlFile = `${page.slug}.html`;
  const cssFile = `${page.slug}.css`;
  const rawHtmlPath = path.join(htmlDir, htmlFile);
  let rawHtml = fs.readFileSync(rawHtmlPath, 'utf8');

  // Remove any previous embedded <style id="hab-embedded-css"> if present
  rawHtml = rawHtml.replace(/<style id="hab-embedded-css">[\s\S]*?<\/style>\s*/g, '');

  // Build dedicated CSS for this specific file
  const fullSpecificCss = `/* ==========================================================================
   FILE: html/${cssFile}
   PAGE: ${page.step}. ${page.title}
   COMPATIBILITY: html.to.design (by <div>RIOTS) — Figma 1440px Desktop Frame
   ========================================================================== */\n\n` + baseCss + '\n' + page.specificCss.trim() + '\n';

  // Write <page>.css to /html/<page>.css and /public/html/<page>.css
  fs.writeFileSync(path.join(htmlDir, cssFile), fullSpecificCss, 'utf8');
  fs.writeFileSync(path.join(publicHtmlDir, cssFile), fullSpecificCss, 'utf8');

  // Clean HTML that links to its specific <page>.css
  const cleanHtmlLinkingSpecificCss = rawHtml.replace(
    /<link\s+rel="stylesheet"\s+href="[^"]+"\s*\/?>/,
    `<link rel="stylesheet" href="${cssFile}" />`
  );

  // Self-contained HTML that links to <page>.css AND embeds <style id="hab-embedded-css"> so single-file drag-and-drop into html.to.design works 100% standalone
  const selfContainedHtml = cleanHtmlLinkingSpecificCss.replace(
    `</head>`,
    `  <style id="hab-embedded-css">\n${fullSpecificCss}\n  </style>\n</head>`
  );

  // Save self-contained HTML to /html/<page>.html and /public/html/<page>.html
  fs.writeFileSync(path.join(htmlDir, htmlFile), selfContainedHtml, 'utf8');
  fs.writeFileSync(path.join(publicHtmlDir, htmlFile), selfContainedHtml, 'utf8');

  exportBundle.push({
    step: page.step,
    slug: page.slug,
    title: page.title,
    category: page.category,
    description: page.description,
    htmlFile: `html/${htmlFile}`,
    cssFile: `html/${cssFile}`,
    publicUrlPath: `/html/${htmlFile}`,
    cleanHtml: cleanHtmlLinkingSpecificCss,
    specificCss: fullSpecificCss,
    selfContainedHtml
  });
}

// Also copy styles.css to /public/html/styles.css
fs.writeFileSync(path.join(publicHtmlDir, 'styles.css'), baseCss, 'utf8');

// Write TypeScript data file for the interactive One-by-One Figma Converter UI
const tsContent = `// Auto-generated specific HTML & CSS bundle for all 15 ERP pages
// Used by the Figma html.to.design One-by-One Converter Modal

export interface HtmlFigmaPageSpec {
  step: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  htmlFile: string;
  cssFile: string;
  publicUrlPath: string;
  cleanHtml: string;
  specificCss: string;
  selfContainedHtml: string;
}

export const HTML_FIGMA_PAGES: HtmlFigmaPageSpec[] = ${JSON.stringify(exportBundle, null, 2)};
`;

fs.writeFileSync(path.join(srcDataDir, 'htmlPagesExportData.ts'), tsContent, 'utf8');
console.log('Generated 15 specific .html + 15 specific .css files in /html and /public/html, plus src/data/htmlPagesExportData.ts');
