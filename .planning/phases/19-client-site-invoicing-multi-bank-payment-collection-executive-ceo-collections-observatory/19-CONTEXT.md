# Phase 19 Context: Client Site Invoicing, Multi-Bank Payment Collection & Executive CEO Collections Observatory

**Date:** 2026-11-21  
**Phase:** 19  
**Requirements:** [REQ-FIN-001, REQ-CEO-001](file:///C:/Users/callo/orca/projects/HAB/.planning/REQUIREMENTS.md#L330-L365)  
**Origin:** [Architecture & Design Note](file:///C:/Users/callo/orca/projects/HAB/.planning/notes/client-site-payment-collection.md)  

---

## 1. Locked Decisions (from Socratic Exploration)

1. **Auto-Generated Monthly Billing**:
   - Monthly billing auto-generated based on active client contracts & deployed headcount (guards and cleaners).
   - Invoices include line-item service breakdown, 15% VAT, gross total, billing issue date, and 30-day payment due date.
2. **Finance Payment Collection Settlement**:
   - Interactive payment logging modal (`SitePaymentCollectionModal`).
   - Multi-bank payment channels: Commercial Bank of Ethiopia (CBE), Awash Bank, Bank of Abyssinia, Telebirr, or Cheque with receipt/bank slip reference number.
   - 2% Ethiopian Withholding Tax deduction tracking with credit note verification.
   - Dynamic remaining balance recalculation and invoice status updates (`Paid`, `Partially Paid`, `Overdue`, `Pending`).
   - Searchable, filterable Site Accounts Receivable ledger (`SiteAccountsReceivableView`) embedded in Finance module.
3. **Executive CEO Collections Observatory**:
   - Embedded CEO Dashboard widget (`CeoCollectionsSummaryWidget`) with high-level KPIs: Total Invoiced (ETB), Total Collected (ETB), Outstanding AR (ETB), Collection Efficiency Rate (%).
   - 4-Tier visual aging distribution bar (0–30 Days, 31–60 Days, 61–90 Days, 90+ Days Overdue).
   - Top 5 Overdue Risk Sites alert rail with high-risk delinquent balances and days overdue.
   - Deep-dive collections drill-down drawer (`CeoCollectionsReportDrawer`) with full site-by-site matrix, division breakdown (Security vs. Cleaning), and 1-click CSV/Print export.

---

## 2. Guardrails & Compliance

- **File Budget**: All components strictly $\le 250$ lines. Decompose modals and tables into modular subcomponents if approaching limits.
- **Design Tokens**: Warm Earth palette (`#F2C46A`, `#4C4541`, `#FCF0DA`, `#AEAC78`) with Ant Design token conventions.
- **Numeric Precision**: Tabular numerals (`font-mono tabular-nums`) and standard Ethiopian Birr formatting (`formatEtb` / `ETB X,XXX,XXX`).
- **Language**: Bilingual keys for English and Amharic in `src/i18n/`.
- **Quality**: Zero TypeScript compilation errors (`npx tsc --noEmit`) and clean lint checks (`npm run lint`).
