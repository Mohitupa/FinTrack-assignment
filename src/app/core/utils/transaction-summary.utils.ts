import { Transaction } from "../models/transaction.model";

export interface TransactionSummary {
  readonly totalDisplayed: number;
  readonly successfulCount: number;
  readonly pendingCount: number;
  readonly totalSuccessfulAmount: number;
}

export function computeSummary(transactions: readonly Transaction[]): TransactionSummary {
  let successfulCount = 0;
  let pendingCount = 0;
  let totalSuccessfulAmount = 0;

  for (const t of transactions) {
    if (t.status === 'SUCCESS') {
      successfulCount++;
      totalSuccessfulAmount += t.amount;
    } else if (t.status === 'PENDING') {
      pendingCount++;
    }
  }

  return {
    totalDisplayed: transactions.length,
    successfulCount,
    pendingCount,
    totalSuccessfulAmount,
  };
}