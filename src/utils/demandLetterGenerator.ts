import { ClientInvoice } from '../types/clientBilling';
import { computeDaysOverdue } from './ceoCollectionsAggregator';

export function printDemandLetter(invoice: ClientInvoice): void {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Please allow popups to generate the formal demand notice.');
    return;
  }

  const daysOverdue = computeDaysOverdue(invoice.dueDate);
  const formattedBalance = `ETB ${invoice.remainingBalanceETB.toLocaleString()}`;
  const formattedTotal = `ETB ${invoice.totalAmountETB.toLocaleString()}`;
  const formattedPaid = `ETB ${(invoice.amountPaidETB + invoice.withholdingTaxCreditETB).toLocaleString()}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Formal Demand Notice - ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2D2825; padding: 40px; margin: 0; line-height: 1.5; font-size: 13px; }
    .header { border-bottom: 2px solid #4C4541; padding-bottom: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 20px; font-weight: bold; color: #4C4541; letter-spacing: -0.5px; }
    .subbrand { font-size: 11px; color: #78716C; margin-top: 2px; }
    .badge { background: #FEF2F2; color: #991B1B; border: 1px solid #F87171; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 11px; }
    .title-box { background: #FDF9F3; border: 1px solid #EFE7D8; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
    .title-box h2 { margin: 0 0 6px 0; font-size: 15px; color: #4C4541; text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
    .label { font-size: 11px; color: #78716C; text-transform: uppercase; }
    .val { font-weight: 600; color: #1C1917; font-size: 13px; }
    .highlight-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .highlight-table th, .highlight-table td { border: 1px solid #E7E5E4; padding: 8px 12px; text-align: left; }
    .highlight-table th { background: #F5F5F4; font-size: 11px; }
    .total-row { font-weight: bold; background: #FFFBEB; }
    .bank-box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px; margin-bottom: 20px; }
    .footer { margin-top: 40px; border-top: 1px solid #E7E5E4; padding-top: 15px; font-size: 11px; color: #78716C; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 35px; }
    @media print { body { padding: 20px; } button { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">HAB SECURITY & CLEANING SERVICES PLC</div>
      <div class="subbrand">Headquarters: Bole Medhanialem, Commercial Tower 4th Floor · Addis Ababa, Ethiopia</div>
    </div>
    <div class="badge">OVERDUE RECOVERY NOTICE</div>
  </div>

  <div class="title-box">
    <h2>Legal Demand for Payment Settlement / የማስጠንቀቂያ ደብዳቤ</h2>
    <div>Reference No: <strong>LEG-AR-${invoice.invoiceNumber}</strong> · Date: <strong>${new Date().toISOString().slice(0, 10)}</strong></div>
  </div>

  <div class="grid">
    <div>
      <div class="label">Client Entity</div>
      <div class="val">${invoice.clientOrganization}</div>
      <div style="font-size: 12px; color: #57534E; margin-top: 2px;">Assigned Site: ${invoice.siteName}</div>
    </div>
    <div>
      <div class="label">Delinquency Status</div>
      <div class="val" style="color: #DC2626;">${daysOverdue} Days Past Due (Due: ${invoice.dueDate})</div>
      <div style="font-size: 12px; color: #57534E; margin-top: 2px;">Original Issue Date: ${invoice.issueDate}</div>
    </div>
  </div>

  <p>Dear Management of <strong>${invoice.clientOrganization}</strong>,</p>
  <p>Our records indicate that the invoice detailed below for facility management and deployed personnel services remains outstanding beyond contractual payment terms.</p>

  <table class="highlight-table">
    <thead>
      <tr>
        <th>Invoice #</th>
        <th>Service Division</th>
        <th>Contract Total</th>
        <th>Settled & WHT Credit</th>
        <th style="color: #DC2626;">Outstanding Balance</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${invoice.invoiceNumber}</strong></td>
        <td>${invoice.division} Services</td>
        <td>${formattedTotal}</td>
        <td>${formattedPaid}</td>
        <td style="color: #DC2626; font-weight: bold;">${formattedBalance}</td>
      </tr>
    </tbody>
  </table>

  <div class="bank-box">
    <div style="font-weight: bold; margin-bottom: 6px; color: #1E293B;">Approved Settlement Channels:</div>
    <div style="font-size: 11px; line-height: 1.6;">
      • <strong>Commercial Bank of Ethiopia (CBE):</strong> A/C 1000192837461 (HAB Security & Cleaning)<br/>
      • <strong>Awash Bank:</strong> A/C 01320495810200 (HAB Services PLC)<br/>
      • <strong>Bank of Abyssinia:</strong> A/C 88201948 (HAB PLC)<br/>
      • <strong>Telebirr Corporate Pay:</strong> 889921
    </div>
  </div>

  <p style="font-size: 12px; color: #4B5563;">
    Kindly submit wire transfer slips or 2% Withholding Tax Credit certificates to <em>finance@hab-services.et</em> within seven (7) business days. Continued default may trigger administrative deployment review and operational suspension.
  </p>

  <div class="sign-row">
    <div>
      <div style="height: 35px; border-bottom: 1px dashed #A8A29E; width: 180px;"></div>
      <div style="font-weight: bold; margin-top: 5px;">Chief Executive Officer</div>
      <div style="font-size: 11px; color: #78716C;">Executive Committee</div>
    </div>
    <div>
      <div style="height: 35px; border-bottom: 1px dashed #A8A29E; width: 180px;"></div>
      <div style="font-weight: bold; margin-top: 5px;">Head of Finance & AR</div>
      <div style="font-size: 11px; color: #78716C;">Collections Division</div>
    </div>
  </div>

  <div class="footer">
    HAB Security & Cleaning Services PLC · Official Commercial Registry #AA-99210-ET · Addis Ababa, Ethiopia
  </div>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

export function exportCollectionsCsv(invoices: ClientInvoice[]): void {
  const headers = [
    'Invoice Number',
    'Site Name',
    'Client Organization',
    'Division',
    'Issue Date',
    'Due Date',
    'Days Overdue',
    'Invoiced (ETB)',
    'Collected (ETB)',
    'Withholding Tax Credit (ETB)',
    'Outstanding Balance (ETB)',
    'Status'
  ];

  const rows = invoices.map(inv => {
    const daysOverdue = computeDaysOverdue(inv.dueDate);
    return [
      `"${inv.invoiceNumber}"`,
      `"${inv.siteName.replace(/"/g, '""')}"`,
      `"${inv.clientOrganization.replace(/"/g, '""')}"`,
      `"${inv.division}"`,
      `"${inv.issueDate}"`,
      `"${inv.dueDate}"`,
      daysOverdue,
      inv.totalAmountETB,
      inv.amountPaidETB,
      inv.withholdingTaxCreditETB,
      inv.remainingBalanceETB,
      `"${inv.status}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `HAB_Client_Collections_AR_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
