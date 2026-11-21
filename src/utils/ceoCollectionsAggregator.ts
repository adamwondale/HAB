import { ClientInvoice } from '../types/clientBilling';

export interface AgingBucket {
  label: 'Current (0-30d)' | 'Overdue (31-60d)' | 'Overdue (61-90d)' | 'Severely Overdue (90+d)' | string;
  daysMin: number;
  daysMax: number;
  totalAmountETB: number;
  invoiceCount: number;
  color: string;
}

export interface DivisionCollectionSummary {
  division: 'Security' | 'Cleaning';
  invoicedETB: number;
  collectedETB: number;
  outstandingETB: number;
  collectionRate: number;
}

export interface OverdueRiskSite {
  siteId: string;
  siteName: string;
  clientOrganization: string;
  invoiceNumber: string;
  outstandingBalanceETB: number;
  daysOverdue: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface CeoCollectionsTelemetry {
  totalInvoicedETB: number;
  totalCollectedETB: number;
  totalOutstandingETB: number;
  collectionRate: number;
  agingBuckets: AgingBucket[];
  divisionSummaries: DivisionCollectionSummary[];
  topOverdueRiskSites: OverdueRiskSite[];
}

export function computeDaysOverdue(dueDateStr: string, asOf: Date = new Date('2026-11-21')): number {
  const diffTime = asOf.getTime() - new Date(dueDateStr).getTime();
  return Math.max(0, Math.floor(diffTime / 86400000));
}

export function computeCeoCollectionsTelemetry(
  invoices: ClientInvoice[],
  asOfDateStr = '2026-11-21'
): CeoCollectionsTelemetry {
  const asOf = new Date(asOfDateStr);
  let totalInvoicedETB = 0, totalCollectedETB = 0, totalOutstandingETB = 0;
  let secInvoiced = 0, secCollected = 0, secOutstanding = 0;
  let cleanInvoiced = 0, cleanCollected = 0, cleanOutstanding = 0;

  const buckets: AgingBucket[] = [
    { label: 'Current (0-30d)', daysMin: 0, daysMax: 30, totalAmountETB: 0, invoiceCount: 0, color: '#10B981' },
    { label: 'Overdue (31-60d)', daysMin: 31, daysMax: 60, totalAmountETB: 0, invoiceCount: 0, color: '#F59E0B' },
    { label: 'Overdue (61-90d)', daysMin: 61, daysMax: 90, totalAmountETB: 0, invoiceCount: 0, color: '#F97316' },
    { label: 'Severely Overdue (90+d)', daysMin: 91, daysMax: 9999, totalAmountETB: 0, invoiceCount: 0, color: '#EF4444' }
  ];
  const overdueSites: OverdueRiskSite[] = [];

  for (const inv of invoices) {
    const invTotal = inv.totalAmountETB;
    const invCollected = inv.amountPaidETB + inv.withholdingTaxCreditETB;
    const invRemaining = inv.remainingBalanceETB;

    totalInvoicedETB += invTotal;
    totalCollectedETB += invCollected;
    totalOutstandingETB += invRemaining;

    const gSub = inv.guardCount * inv.guardRateETB;
    const cSub = inv.cleanerCount * inv.cleanerRateETB;
    const sub = gSub + cSub;
    const gRatio = inv.division === 'Security' ? 1 : inv.division === 'Cleaning' ? 0 : (sub > 0 ? gSub / sub : 0.5);
    const cRatio = 1 - gRatio;

    secInvoiced += invTotal * gRatio;
    secCollected += invCollected * gRatio;
    secOutstanding += invRemaining * gRatio;
    cleanInvoiced += invTotal * cRatio;
    cleanCollected += invCollected * cRatio;
    cleanOutstanding += invRemaining * cRatio;

    if (invRemaining > 0) {
      const daysOverdue = computeDaysOverdue(inv.dueDate, asOf);
      const targetBucket = buckets.find(b => daysOverdue >= b.daysMin && daysOverdue <= b.daysMax) || buckets[buckets.length - 1];
      targetBucket.totalAmountETB += invRemaining;
      targetBucket.invoiceCount += 1;

      if (daysOverdue > 0) {
        const riskLevel: OverdueRiskSite['riskLevel'] = daysOverdue > 90 ? 'Critical' : daysOverdue > 60 ? 'High' : daysOverdue > 30 ? 'Moderate' : 'Low';
        overdueSites.push({
          siteId: inv.siteId,
          siteName: inv.siteName,
          clientOrganization: inv.clientOrganization,
          invoiceNumber: inv.invoiceNumber,
          outstandingBalanceETB: invRemaining,
          daysOverdue,
          riskLevel
        });
      }
    }
  }

  overdueSites.sort((a, b) => b.daysOverdue - a.daysOverdue || b.outstandingBalanceETB - a.outstandingBalanceETB);
  const calcRate = (col: number, tot: number) => tot > 0 ? Math.round((col / tot) * 1000) / 10 : 0;

  return {
    totalInvoicedETB: Math.round(totalInvoicedETB),
    totalCollectedETB: Math.round(totalCollectedETB),
    totalOutstandingETB: Math.round(totalOutstandingETB),
    collectionRate: calcRate(totalCollectedETB, totalInvoicedETB),
    agingBuckets: buckets.map(b => ({ ...b, totalAmountETB: Math.round(b.totalAmountETB) })),
    divisionSummaries: [
      { division: 'Security', invoicedETB: Math.round(secInvoiced), collectedETB: Math.round(secCollected), outstandingETB: Math.round(secOutstanding), collectionRate: calcRate(secCollected, secInvoiced) },
      { division: 'Cleaning', invoicedETB: Math.round(cleanInvoiced), collectedETB: Math.round(cleanCollected), outstandingETB: Math.round(cleanOutstanding), collectionRate: calcRate(cleanCollected, cleanInvoiced) }
    ],
    topOverdueRiskSites: overdueSites.slice(0, 5)
  };
}
