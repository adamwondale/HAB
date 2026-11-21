import { ClientInvoice, ClientPaymentRecord } from '../types/clientBilling';

interface MockParam {
  id: string;
  invNo: string;
  siteId: string;
  siteName: string;
  clientOrg: string;
  div: 'Security' | 'Cleaning' | 'Combined';
  issue: string;
  due: string;
  guards: number;
  gRate: number;
  cleaners: number;
  cRate: number;
  status: 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
  paid: number;
  wht?: number;
  pay?: ClientPaymentRecord;
  exactTotal?: number;
}

function makeInvoice(p: MockParam): ClientInvoice {
  const calcSub = p.guards * p.gRate + p.cleaners * p.cRate;
  const subtotal = p.exactTotal ? Math.round(p.exactTotal / 1.15) : calcSub;
  const vat = p.exactTotal ? p.exactTotal - subtotal : Math.round(subtotal * 0.15);
  const total = p.exactTotal ?? (subtotal + vat);
  const wht = p.wht ?? 0;
  return {
    id: p.id,
    invoiceNumber: p.invNo,
    siteId: p.siteId,
    siteName: p.siteName,
    clientOrganization: p.clientOrg,
    division: p.div,
    billingPeriod: 'Tikimt 2019 / October 2026',
    issueDate: p.issue,
    dueDate: p.due,
    guardCount: p.guards,
    guardRateETB: p.gRate,
    cleanerCount: p.cleaners,
    cleanerRateETB: p.cRate,
    subtotalETB: subtotal,
    vatAmountETB: vat,
    totalAmountETB: total,
    amountPaidETB: p.paid,
    withholdingTaxCreditETB: wht,
    remainingBalanceETB: Math.max(0, total - (p.paid + wht)),
    status: p.status,
    payments: p.pay ? [p.pay] : []
  };
}

export const INITIAL_CLIENT_INVOICES: ClientInvoice[] = [
  makeInvoice({
    id: 'inv-1', invNo: 'INV-2026-10-CBE01', siteId: 'site-1',
    siteName: 'Commercial Bank of Ethiopia Tower (HQ)', clientOrg: 'Commercial Bank of Ethiopia',
    div: 'Combined', issue: '2026-10-01', due: '2026-10-31', guards: 24, gRate: 7500, cleaners: 29, cRate: 4800,
    status: 'Paid', paid: 360696, wht: 6384,
    pay: { id: 'p-1', invoiceId: 'inv-1', siteId: 'site-1', siteName: 'Commercial Bank of Ethiopia Tower (HQ)', paymentDate: '2026-10-28', amountPaidETB: 360696, paymentMethod: 'CBE', referenceNumber: 'CBE-FT-20261028-99214', withholdingTaxCertificateNumber: 'ERCA-WHT-2026-8812', withholdingTaxAmountETB: 6384, depositedBy: 'Ato Tadesse Wolde (CBE Facility Dir)', recordedAt: '2026-10-28T14:30:00Z' }
  }),
  makeInvoice({
    id: 'inv-2', invNo: 'INV-2026-10-EAL02', siteId: 'site-2',
    siteName: 'Ethiopian Airlines Cargo Terminal Hub', clientOrg: 'Ethiopian Airlines Group',
    div: 'Combined', issue: '2026-10-01', due: '2026-10-31', guards: 31, gRate: 7500, cleaners: 18, cRate: 4800,
    status: 'Partially Paid', paid: 300000,
    pay: { id: 'p-2', invoiceId: 'inv-2', siteId: 'site-2', siteName: 'Ethiopian Airlines Cargo Terminal Hub', paymentDate: '2026-11-02', amountPaidETB: 300000, paymentMethod: 'Awash', referenceNumber: 'AW-TRX-20261102-4410', depositedBy: 'W/ro Selamawit Girma', recordedAt: '2026-11-02T10:15:00Z' }
  }),
  makeInvoice({
    id: 'inv-3', invNo: 'INV-2026-10-HYAT03', siteId: 'site-3',
    siteName: 'Hyatt Regency Addis Ababa', clientOrg: 'Hyatt International Hotels',
    div: 'Combined', issue: '2026-10-01', due: '2026-10-31', guards: 16, gRate: 7800, cleaners: 21, cRate: 5000,
    status: 'Paid', paid: 259674, wht: 4596,
    pay: { id: 'p-3', invoiceId: 'inv-3', siteId: 'site-3', siteName: 'Hyatt Regency Addis Ababa', paymentDate: '2026-10-25', amountPaidETB: 259674, paymentMethod: 'Abyssinia', referenceNumber: 'BOA-FT-20261025-1109', withholdingTaxCertificateNumber: 'ERCA-WHT-2026-7731', withholdingTaxAmountETB: 4596, depositedBy: 'Ato Henok Berhanu', recordedAt: '2026-10-25T11:00:00Z' }
  }),
  makeInvoice({
    id: 'inv-4', invNo: 'INV-2026-10-STP04', siteId: 'site-4',
    siteName: "St. Paul's Hospital Millennium Medical College", clientOrg: 'Ministry of Health / St. Paul',
    div: 'Cleaning', issue: '2026-10-01', due: '2026-10-31', guards: 0, gRate: 0, cleaners: 34, cRate: 4800,
    status: 'Pending', paid: 0
  }),
  makeInvoice({
    id: 'inv-5', invNo: 'INV-2026-10-BOL05', siteId: 'site-5',
    siteName: 'Bole Medhanialem Commercial Complex', clientOrg: 'Bole Plaza Management Consortium',
    div: 'Combined', issue: '2026-10-01', due: '2026-10-31', guards: 14, gRate: 7200, cleaners: 12, cRate: 4800,
    status: 'Paid', paid: 178992, wht: 3168,
    pay: { id: 'p-5', invoiceId: 'inv-5', siteId: 'site-5', siteName: 'Bole Medhanialem Commercial Complex', paymentDate: '2026-11-01', amountPaidETB: 178992, paymentMethod: 'Telebirr', referenceNumber: 'TLB-REF-20261101-55821', withholdingTaxCertificateNumber: 'ERCA-WHT-2026-3319', withholdingTaxAmountETB: 3168, depositedBy: 'W/ro Tigist Kebede', recordedAt: '2026-11-01T09:45:00Z' }
  }),
  makeInvoice({
    id: 'inv-6', invNo: 'INV-2026-10-CMC06', siteId: 'site-6',
    siteName: 'CMC Commercial Plaza & Residence', clientOrg: 'Sunshine / CMC Real Estate Management',
    div: 'Combined', issue: '2026-10-01', due: '2026-10-31', guards: 11, gRate: 7200, cleaners: 9, cRate: 4800,
    status: 'Partially Paid', paid: 70000,
    pay: { id: 'p-6', invoiceId: 'inv-6', siteId: 'site-6', siteName: 'CMC Commercial Plaza & Residence', paymentDate: '2026-11-04', amountPaidETB: 70000, paymentMethod: 'Cheque', referenceNumber: 'CHQ-AW-99210', depositedBy: 'Ato Solomon Bekele', recordedAt: '2026-11-04T16:20:00Z' }
  }),
  makeInvoice({
    id: 'inv-7', invNo: 'INV-2026-08-KAZ07', siteId: 'site-7',
    siteName: 'Kazanchis Former Commercial Wing', clientOrg: 'Ministry of Trade (Old Facility)',
    div: 'Security', issue: '2026-08-15', due: '2026-09-14', guards: 8, gRate: 7000, cleaners: 0, cRate: 0,
    status: 'Overdue', paid: 0
  }),
  makeInvoice({
    id: 'inv-8', invNo: 'INV-2026-08-ACC08', siteId: 'site-8',
    siteName: 'Addis Commercial Center', clientOrg: 'Addis Commercial Properties',
    div: 'Combined', issue: '2026-08-20', due: '2026-09-19', guards: 28, gRate: 7500, cleaners: 32, cRate: 4800,
    status: 'Overdue', paid: 0, exactTotal: 420000
  }),
  makeInvoice({
    id: 'inv-9', invNo: 'INV-2026-10-AWB09', siteId: 'site-9',
    siteName: 'Awash Bank HQ Towers', clientOrg: 'Awash International Bank',
    div: 'Security', issue: '2026-10-01', due: '2026-10-31', guards: 20, gRate: 7500, cleaners: 0, cRate: 0,
    status: 'Paid', paid: 169500, wht: 3000,
    pay: { id: 'p-9', invoiceId: 'inv-9', siteId: 'site-9', siteName: 'Awash Bank HQ Towers', paymentDate: '2026-11-05', amountPaidETB: 169500, paymentMethod: 'Awash', referenceNumber: 'AW-DIRECT-20261105-01', withholdingTaxCertificateNumber: 'ERCA-WHT-2026-9901', withholdingTaxAmountETB: 3000, depositedBy: 'Awash Corporate Services', recordedAt: '2026-11-05T09:00:00Z' }
  }),
  makeInvoice({
    id: 'inv-10', invNo: 'INV-2026-10-TEL10', siteId: 'site-10',
    siteName: 'Telebirr Financial Center / Ethio Telecom HQ', clientOrg: 'Ethio Telecom',
    div: 'Combined', issue: '2026-10-01', due: '2026-10-31', guards: 22, gRate: 7500, cleaners: 15, cRate: 4800,
    status: 'Partially Paid', paid: 200000,
    pay: { id: 'p-10', invoiceId: 'inv-10', siteId: 'site-10', siteName: 'Telebirr Financial Center', paymentDate: '2026-11-08', amountPaidETB: 200000, paymentMethod: 'Telebirr', referenceNumber: 'TLB-CORP-20261108-112', depositedBy: 'Ethio Telecom Admin', recordedAt: '2026-11-08T15:10:00Z' }
  }),
  makeInvoice({
    id: 'inv-11', invNo: 'INV-2026-10-HLT11', siteId: 'site-11',
    siteName: 'Hilton Hotel Addis Ababa', clientOrg: 'Hilton Worldwide / Ethiopian Hotels',
    div: 'Combined', issue: '2026-10-01', due: '2026-10-31', guards: 18, gRate: 7800, cleaners: 25, cRate: 5000,
    status: 'Paid', paid: 299902, wht: 5308,
    pay: { id: 'p-11', invoiceId: 'inv-11', siteId: 'site-11', siteName: 'Hilton Hotel Addis Ababa', paymentDate: '2026-10-29', amountPaidETB: 299902, paymentMethod: 'CBE', referenceNumber: 'CBE-FT-20261029-7714', withholdingTaxCertificateNumber: 'ERCA-WHT-2026-6641', withholdingTaxAmountETB: 5308, depositedBy: 'Hilton Comptroller', recordedAt: '2026-10-29T13:40:00Z' }
  }),
  makeInvoice({
    id: 'inv-12', invNo: 'INV-2026-10-BOA12', siteId: 'site-12',
    siteName: 'Bank of Abyssinia Head Office', clientOrg: 'Bank of Abyssinia S.C.',
    div: 'Security', issue: '2026-10-05', due: '2026-11-04', guards: 15, gRate: 7500, cleaners: 0, cRate: 0,
    status: 'Pending', paid: 0
  }),
  makeInvoice({
    id: 'inv-13', invNo: 'INV-2026-10-FRN13', siteId: 'site-13',
    siteName: 'Friendship Business Center', clientOrg: 'Friendship Group PLC',
    div: 'Cleaning', issue: '2026-10-05', due: '2026-11-04', guards: 0, gRate: 0, cleaners: 16, cRate: 4800,
    status: 'Pending', paid: 0
  }),
  makeInvoice({
    id: 'inv-14', invNo: 'INV-2026-09-DEM14', siteId: 'site-14',
    siteName: 'Dembel City Center', clientOrg: 'Dembel Commercial PLC',
    div: 'Combined', issue: '2026-09-10', due: '2026-10-10', guards: 12, gRate: 7200, cleaners: 14, cRate: 4800,
    status: 'Overdue', paid: 0
  })
];
