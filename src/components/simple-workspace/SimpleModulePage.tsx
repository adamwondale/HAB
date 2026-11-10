import React, { useState } from 'react';
import { downloadCsv } from '../../utils/csvExport';
import { ModuleModel } from './types';
import { StandardPageLayout } from './StandardPageLayout';

interface SimpleModulePageProps {
  model: ModuleModel;
}

export function SimpleModulePage({ model }: SimpleModulePageProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const rows = normalizedQuery
    ? model.rows.filter(row => row.searchText.toLowerCase().includes(normalizedQuery))
    : model.rows;

  const downloadReport = () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(
      `HAB_${model.reportName}_${date}.csv`,
      model.columns.map(column => column.label),
      rows.map(row => model.columns.map(column => row.values[column.key] || ''))
    );
  };

  return (
    <StandardPageLayout
      title={model.title}
      description={model.description}
      metrics={model.metrics}
      guideKey={model.reportName}
      search={{
        query,
        onChange: setQuery,
        placeholder: model.searchLabel
      }}
      columns={model.columns}
      rows={rows}
      emptyMessage={model.emptyMessage}
      note={model.note}
      onDownloadReport={downloadReport}
    />
  );
}
