import { ClientInvoice, ClientPaymentRecord, AccountsReceivableMetrics } from '../types/clientBilling';
import { ClientSite } from '../types/hrm';
import { INITIAL_CLIENT_INVOICES } from '../data/mockClientBilling';
import { logAuditEvent } from './auditLogger';

const BILLING_STORAGE_KEY = 'hab_client_invoices_v1';

export function loadClientInvoices(): ClientInvoice[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_CLIENT_INVOICES;
  }
  try {
    const raw = window.localStorage.getItem(BILLING_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(INITIAL_CLIENT_INVOICES));
      return INITIAL_CLIENT_INVOICES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CLIENT_INVOICES;
  } catch (err) {
    console.error('Failed reading client invoices from storage', err);
    return INITIAL_CLIENT_INVOICES;
  }
}

export function saveClientInvoices(invoices: ClientInvoice[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(invoices));
  } catch (err) {
    console.error('Failed saving client invoices', err);
  }
}

export function recordInvoicePayment(
  invoiceId: string,
  paymentData: Omit<ClientPaymentRecord, 'id' | 'recordedAt'>
): ClientInvoice {
  const invoices = loadClientInvoices();
  const index = invoices.findIndex((inv) => inv.id === invoiceId);
  if (index === -1) {
    throw new Error(`Invoice with ID ${invoiceId} not found`);
  }

  const invoice = invoices[index];
  const newPayment: ClientPaymentRecord = {
    ...paymentData,
    id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    recordedAt: new Date().toISOString()
  };

  const newAmountPaid = invoice.amountPaidETB + paymentData.amountPaidETB;
  const newWhtCredit = invoice.withholdingTaxCreditETB + (paymentData.withholdingTaxAmountETB || 0);
  const totalSettled = newAmountPaid + newWhtCredit;
  const newRemaining = Math.max(0, invoice.totalAmountETB - totalSettled);

  let newStatus: ClientInvoice['status'];
  if (newRemaining <= 0) {
    newStatus = 'Paid';
  } else if (totalSettled > 0) {
    newStatus = 'Partially Paid';
  } else {
    const isPastDue = new Date(invoice.dueDate) < new Date();
    newStatus = isPastDue ? 'Overdue' : 'Pending';
  }

  const updatedInvoice: ClientInvoice = {
    ...invoice,
    amountPaidETB: newAmountPaid,
    withholdingTaxCreditETB: newWhtCredit,
    remainingBalanceETB: newRemaining,
    status: newStatus,
    payments: [newPayment, ...invoice.payments]
  };

  invoices[index] = updatedInvoice;
  saveClientInvoices(invoices);

  logAuditEvent({
    actorId: 'finance',
    actorName: 'Finance Collections Officer',
    actorRole: 'finance',
    action: 'RECORD_PAYMENT',
    targetModule: 'ClientBilling',
    targetId: invoice.invoiceNumber,
    previousValue: `Remaining: ETB ${invoice.remainingBalanceETB.toLocaleString()}`,
    newValue: `Settled ETB ${(paymentData.amountPaidETB + (paymentData.withholdingTaxAmountETB || 0)).toLocaleString()} (Balance: ETB ${newRemaining.toLocaleString()})`,
    details: `Channel: ${paymentData.paymentMethod} (Ref: ${paymentData.referenceNumber}), Paid: ETB ${paymentData.amountPaidETB.toLocaleString()}${paymentData.withholdingTaxAmountETB ? `, 2% WHT: ETB ${paymentData.withholdingTaxAmountETB.toLocaleString()}` : ''}`,
    status: 'SUCCESS'
  });

  return updatedInvoice;
}

export function calculateARMetrics(invoices: ClientInvoice[]): AccountsReceivableMetrics {
  let totalBilled = 0;
  let totalCollected = 0;
  let totalOutstanding = 0;
  let totalOverdue = 0;
  let overdueCount = 0;

  for (const inv of invoices) {
    totalBilled += inv.totalAmountETB;
    totalCollected += (inv.amountPaidETB + inv.withholdingTaxCreditETB);
    totalOutstanding += inv.remainingBalanceETB;
    if (inv.status === 'Overdue') {
      totalOverdue += inv.remainingBalanceETB;
      overdueCount++;
    }
  }

  const collectionRate = totalBilled > 0
    ? Math.round((totalCollected / totalBilled) * 1000) / 10
    : 0;

  return {
    totalBilledETB: totalBilled,
    totalCollectedETB: totalCollected,
    totalOutstandingETB: totalOutstanding,
    totalOverdueETB: totalOverdue,
    collectionEfficiencyRate: collectionRate,
    totalInvoicesCount: invoices.length,
    overdueInvoicesCount: overdueCount
  };
}

export function generateMonthlyInvoices(sites: ClientSite[]): ClientInvoice[] {
  const existing = loadClientInvoices();
  const guardMonthlyRate = 7500;
  const cleanerMonthlyRate = 4800;

  const generated = sites
    .filter((s) => s.status === 'Active')
    .map((site) => {
      const gCount = site.securityStaffDeployed || site.securityStaffRequired || 0;
      const cCount = site.cleaningStaffDeployed || site.cleaningStaffRequired || 0;
      const subtotal = gCount * guardMonthlyRate + cCount * cleanerMonthlyRate;
      const vat = Math.round(subtotal * 0.15);
      const total = subtotal + vat;
      const div: ClientInvoice['division'] = gCount > 0 && cCount > 0 ? 'Combined' : gCount > 0 ? 'Security' : 'Cleaning';

      return {
        id: `inv-${site.id}-${Date.now()}`,
        invoiceNumber: `INV-2026-11-${site.siteCode.replace(/[^A-Z0-9]/gi, '').slice(0, 6)}`,
        siteId: site.id,
        siteName: site.name,
        clientOrganization: site.clientOrganization,
        division: div,
        billingPeriod: 'Hidar 2019 / November 2026',
        issueDate: '2026-11-01',
        dueDate: '2026-11-30',
        guardCount: gCount,
        guardRateETB: guardMonthlyRate,
        cleanerCount: cCount,
        cleanerRateETB: cleanerMonthlyRate,
        subtotalETB: subtotal,
        vatAmountETB: vat,
        totalAmountETB: total,
        amountPaidETB: 0,
        withholdingTaxCreditETB: 0,
        remainingBalanceETB: total,
        status: 'Pending' as const,
        payments: []
      };
    });

  const merged = [...generated, ...existing];
  saveClientInvoices(merged);
  return merged;
}

export function resetClientInvoicesToDefault(): ClientInvoice[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(INITIAL_CLIENT_INVOICES));
  }
  return INITIAL_CLIENT_INVOICES;
}
