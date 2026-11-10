import { CellTone } from './types';

export function formatEtb(value: number): string {
  return `ETB ${Math.round(value).toLocaleString()}`;
}

export function percent(value: number): string {
  return `${Math.round(value)}%`;
}

export function toneForStatus(status: string): CellTone {
  const normalized = status.toLowerCase();

  if (
    normalized.includes('active') ||
    normalized.includes('approved') ||
    normalized.includes('complete') ||
    normalized.includes('cleared') ||
    normalized.includes('disbursed') ||
    normalized.includes('present') ||
    normalized.includes('verified')
  ) {
    return 'good';
  }

  if (
    normalized.includes('pending') ||
    normalized.includes('progress') ||
    normalized.includes('probation') ||
    normalized.includes('late') ||
    normalized.includes('draft') ||
    normalized.includes('leave') ||
    normalized.includes('low')
  ) {
    return 'warn';
  }

  if (
    normalized.includes('rejected') ||
    normalized.includes('absent') ||
    normalized.includes('suspended') ||
    normalized.includes('hold') ||
    normalized.includes('missing')
  ) {
    return 'bad';
  }

  return 'quiet';
}
