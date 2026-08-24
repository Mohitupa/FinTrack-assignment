import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';

import { Transaction } from '../models/transaction.model';
import { TransactionApiService } from './transaction-api.service';
import { APP_CONSTANTS } from '../constants/app.constants';
import { TransactionRowState, TransactionRowStateMap } from '../models/transaction-ui-state.model';
import { StatusFilter, filterTransactions } from '../utils/transaction-filter.utils';
import { TransactionSummary, computeSummary } from '../utils/transaction-summary.utils';

export interface ListState {
  readonly loading: boolean;
  readonly error: string | null;
}

const INITIAL_LIST_STATE: ListState = { loading: false, error: null };

@Injectable({ providedIn: 'root' })
export class TransactionStoreService {
  private readonly api = inject(TransactionApiService);

  private readonly transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private readonly searchTermSubject = new BehaviorSubject<string>('');
  private readonly statusFilterSubject = new BehaviorSubject<StatusFilter>('ALL');
  private readonly listStateSubject = new BehaviorSubject<ListState>(INITIAL_LIST_STATE);
  private readonly rowStateSubject = new BehaviorSubject<TransactionRowStateMap>({});

  readonly listState$: Observable<ListState> = this.listStateSubject.asObservable();
  readonly rowState$: Observable<TransactionRowStateMap> = this.rowStateSubject.asObservable();

  readonly debouncedSearch$ = this.searchTermSubject.pipe(
    debounceTime(APP_CONSTANTS.SEARCH_DEBOUNCE_MS),
    map((term) => term.trim()),
    distinctUntilChanged(),
  );

  readonly distinctStatus$ = this.statusFilterSubject.pipe(distinctUntilChanged());

  readonly filteredTransactions$: Observable<Transaction[]> = combineLatest([
    this.transactionsSubject,
    this.debouncedSearch$,
    this.distinctStatus$,
  ]).pipe(
    map(([transactions, search, status]) => filterTransactions(transactions, search, status))
  );

  readonly summary$: Observable<TransactionSummary> = this.filteredTransactions$.pipe(map(computeSummary));

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilterSubject.next(status);
  }

  loadTransactions(): void {
    this.listStateSubject.next({ loading: true, error: null });

    this.api.getTransactions().pipe(
      tap((transactions) => {
        this.transactionsSubject.next(transactions);
        this.listStateSubject.next({ loading: false, error: null });
      }),
      catchError((err: Error) => {
        this.listStateSubject.next({ loading: false, error: err.message });
        return of(null);
      }),
    ).subscribe();
  }

  checkStatus(id: string): void {
    const current = this.rowStateSubject.value[id];
    if (current?.checking) {
      return;
    }

    this.patchRowState(id, { checking: true, error: null });

    this.api.checkStatus().pipe(
      tap((newStatus) => {
        this.applyStatusUpdate(id, newStatus);
        this.patchRowState(id, { checking: false, error: null });
      }),
      catchError((err: Error) => {
        this.patchRowState(id, { checking: false, error: err.message });
        return of(null);
      }),
    ).subscribe();
  }

  private patchRowState(id: string, patch: Partial<TransactionRowState>): void {
    const current = this.rowStateSubject.value;
    this.rowStateSubject.next({
      ...current,
      [id]: { ...(current[id] ?? { checking: false, error: null }), ...patch },
    });
  }

  private applyStatusUpdate(id: string, newStatus: Transaction['status']): void {
    const current = this.transactionsSubject.value;
    const updated = current.map((t) => (t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t));
    this.transactionsSubject.next(updated);
  }
}
