export type PaymentMethod = 
  | 'CBE' 
  | 'Awash' 
  | 'Abyssinia' 
  | 'Telebirr' 
  | 'Cheque' 
  | 'Cash Receipt';

export type InvoiceStatus = 
  | 'Paid' 
  | 'Partially Paid' 
  | 'Pending' 
  | 'Overdue';

export type ClientDivision = 'Security' | 'Cleaning' | 'Combined';

export interface ClientPaymentRecord {
  id: string;
  invoiceId: string;
  siteId: string;
  siteName: string;
  paymentDate: string;
  amountPaidETB: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  withholdingTaxCertificateNumber?: string;
  withholdingTaxAmountETB?: number;
  depositedBy: string;
  notes?: string;
  recordedAt: string;
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  siteId: string;
  siteName: string;
  clientOrganization: string;
  division: ClientDivision;
  billingPeriod: string;
  issueDate: string;
  dueDate: string;
  guardCount: number;
  guardRateETB: number;
  cleanerCount: number;
  cleanerRateETB: number;
  subtotalETB: number;
  vatAmountETB: number; // 15% Ethiopian VAT
  totalAmountETB: number;
  amountPaidETB: number;
  withholdingTaxCreditETB: number; // 2% Withholding Tax Credit
  remainingBalanceETB: number;
  status: InvoiceStatus;
  payments: ClientPaymentRecord[];
}

export interface AccountsReceivableMetrics {
  totalBilledETB: number;
  totalCollectedETB: number;
  totalOutstandingETB: number;
  totalOverdueETB: number;
  collectionEfficiencyRate: number; // Percentage (0-100)
  totalInvoicesCount: number;
  overdueInvoicesCount: number;
}
