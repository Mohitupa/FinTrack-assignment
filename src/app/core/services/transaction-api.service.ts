import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Transaction, TransactionDetails, TransactionStatus, PendingDetails, ProcessingDetails, SuccessDetails, FailedDetails, RefundedDetails } from '../models/transaction.model';
import { MOCK_TRANSACTIONS } from '../mock-data/transactions.mock';
import { APP_CONSTANTS, STATUS_CHECK_OUTCOMES } from '../constants/app.constants';

const FAILURE_REASONS: string[] = [
  'Insufficient balance in customer account',
  'Bank declined the transaction',
  'Payment gateway timed out',
  'Card verification failed',
];

@Injectable({ providedIn: 'root' })
export class TransactionApiService {

  getTransactions(): Observable<Transaction[]> {
    const response$ = this.shouldFail(APP_CONSTANTS.LIST_LOAD_FAILURE_RATE)
      ? throwError(() => new Error('Unable to load transactions. Please try again.'))
      : of([...MOCK_TRANSACTIONS]);
    return response$.pipe(delay(this.randomDelay()));
  }

  getTransactionDetails(transaction: Transaction): Observable<TransactionDetails> {
    const response$ = this.shouldFail(APP_CONSTANTS.DETAILS_LOAD_FAILURE_RATE)
      ? throwError(() => new Error('Unable to load transaction details. Please try again.'))
      : of(this.buildDetails(transaction));
    return response$.pipe(delay(this.randomDelay()));
  }

  checkStatus(): Observable<TransactionStatus> {
    const response$ = this.shouldFail(APP_CONSTANTS.STATUS_CHECK_FAILURE_RATE)
      ? throwError(() => new Error('Status check failed. Please try again.'))
      : of(this.randomOutcome());
    return response$.pipe(delay(this.randomDelay()));
  }

  private buildDetails(transaction: Transaction): TransactionDetails {
    const referenceId = `REF-${transaction.id.replace('TRX-', '')}`;

    switch (transaction.status) {
      case 'PENDING':
        return { ...transaction, status: 'PENDING', referenceId } satisfies PendingDetails;
      case 'PROCESSING':
        return { ...transaction, status: 'PROCESSING', referenceId, lastStatusCheckAt: transaction.updatedAt } satisfies ProcessingDetails;
      case 'SUCCESS':
        return { ...transaction, status: 'SUCCESS', referenceId, bankReference: `BNK${this.randomDigits(10)}` } satisfies SuccessDetails;
      case 'FAILED':
        return { ...transaction, status: 'FAILED', referenceId, failureReason: this.randomReason() } satisfies FailedDetails;
      case 'REFUNDED':
        return { ...transaction, status: 'REFUNDED', referenceId, refundReference: `RFD${this.randomDigits(8)}`, refundedAt: transaction.updatedAt } satisfies RefundedDetails;
    }
  }

  private randomOutcome(): TransactionStatus {
    return STATUS_CHECK_OUTCOMES[Math.floor(Math.random() * STATUS_CHECK_OUTCOMES.length)];
  }

  private randomReason(): string {
    return FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)];
  }

  private randomDigits(count: number): string {
    let digits = '';
    for (let i = 0; i < count; i++) digits += Math.floor(Math.random() * 10).toString();
    return digits;
  }

  private randomDelay(): number {
    const { API_DELAY_MIN_MS, API_DELAY_MAX_MS } = APP_CONSTANTS;
    return Math.floor(Math.random() * (API_DELAY_MAX_MS - API_DELAY_MIN_MS + 1)) + API_DELAY_MIN_MS;
  }

  private shouldFail(rate: number): boolean {
    return Math.random() < rate;
  }
}