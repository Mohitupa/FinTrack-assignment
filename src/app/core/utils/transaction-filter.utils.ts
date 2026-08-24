import { Transaction, TransactionStatus } from "../models/transaction.model";

export type StatusFilter = TransactionStatus | 'ALL';

const ALL_STATUS_FILTERS: readonly StatusFilter[] = ['ALL', 'PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED'];

export function matchesSearch(transaction: Transaction, rawSearchTerm: string): boolean {
  const term = rawSearchTerm.trim().toLowerCase();
  if (term === '') {
    return true;
  }
  return (
    transaction.id.toLowerCase().includes(term) ||
    transaction.customerName.toLowerCase().includes(term)
  );
}

export function matchesStatus(transaction: Transaction, statusFilter: StatusFilter): boolean {
  return statusFilter === 'ALL' || transaction.status === statusFilter;
}

export function filterTransactions(
  transactions: readonly Transaction[],
  searchTerm: string,
  statusFilter: StatusFilter,
): Transaction[] {
  return transactions.filter(
    (t) => matchesSearch(t, searchTerm) && matchesStatus(t, statusFilter),
  );
}

export function parseStatusFilter(value: string | null): StatusFilter {
  return (ALL_STATUS_FILTERS as readonly string[]).includes(value ?? '') ? (value as StatusFilter) : 'ALL';
}