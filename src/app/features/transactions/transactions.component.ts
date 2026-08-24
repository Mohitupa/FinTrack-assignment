import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { parseStatusFilter } from '../../core/utils/transaction-filter.utils';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { ListState, TransactionStoreService } from '../../core/services/transaction-store.service';
import { Transaction } from '../../core/models/transaction.model';

import { TransactionSummaryComponent } from './components/transaction-summary/transaction-summary.component';
import { TransactionFiltersComponent } from './components/transaction-filters/transaction-filters.component';
import { TransactionTableComponent } from './components/transaction-table/transaction-table.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component'
import { TransactionDetailsModalComponent } from './components/transaction-details-modal/transaction-details-modal.component';
import { TransactionRowStateMap } from '../../core/models/transaction-ui-state.model';
import { StatusFilter } from '../../core/utils/transaction-filter.utils';
import { TransactionSummary } from '../../core/utils/transaction-summary.utils';

const ZERO_SUMMARY: TransactionSummary = { totalDisplayed: 0, successfulCount: 0, pendingCount: 0, totalSuccessfulAmount: 0 };
const INITIAL_LIST_STATE: ListState = { loading: false, error: null };
const PAGE_SIZE = 5;

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    TransactionSummaryComponent,
    TransactionFiltersComponent,
    TransactionTableComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PaginationComponent,
    TransactionDetailsModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  private readonly store = inject(TransactionStoreService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly today = new Date();
  readonly pageSize = PAGE_SIZE;
  initialSearchFromUrl = '';
  initialStatusFromUrl: StatusFilter = 'ALL';

  readonly filteredTransactions = toSignal(this.store.filteredTransactions$, { initialValue: [] as Transaction[] });
  readonly summary = toSignal(this.store.summary$, { initialValue: ZERO_SUMMARY });
  readonly listState = toSignal(this.store.listState$, { initialValue: INITIAL_LIST_STATE });
  readonly rowState = toSignal(this.store.rowState$, { initialValue: {} as TransactionRowStateMap });

  readonly searchTerm = signal('');
  readonly statusFilter = signal<StatusFilter>('ALL');
  readonly hasActiveFilters = computed(
    () => this.searchTerm().trim() !== '' || this.statusFilter() !== 'ALL',
  );

  readonly currentPage = signal(1);
  readonly totalItems = computed(() => this.filteredTransactions().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize)));
  readonly effectivePage = computed(() => Math.min(this.currentPage(), this.totalPages()));

  readonly pagedTransactions = computed(() => {
    const all = this.filteredTransactions();
    const start = (this.effectivePage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  readonly selectedTransactionId = signal<string | null>(null);

  readonly selectedTransaction = computed(() => {
    const id = this.selectedTransactionId();
    if (!id) return null;
    return this.filteredTransactions().find((t) => t.id === id) ?? null;
  });

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const urlSearch = params.get('search') ?? '';
    const urlStatus = parseStatusFilter(params.get('status'));

    this.initialSearchFromUrl = urlSearch;
    this.initialStatusFromUrl = urlStatus;

    this.searchTerm.set(urlSearch);
    this.statusFilter.set(urlStatus);
    this.store.setSearchTerm(urlSearch);
    this.store.setStatusFilter(urlStatus);

    this.store.loadTransactions();

    combineLatest([this.store.debouncedSearch$, this.store.distinctStatus$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([search, status]) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            search: search || null,
            status: status === 'ALL' ? null : status,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.store.setSearchTerm(term);
    this.currentPage.set(1);
  }

  onStatusChange(status: StatusFilter): void {
    this.statusFilter.set(status);
    this.store.setStatusFilter(status);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onCheckStatus(id: string): void {
    this.store.checkStatus(id);
  }

  onViewDetails(id: string): void {
    this.selectedTransactionId.set(id);
  }

  onRetryLoad(): void {
    this.store.loadTransactions();
  }

  onModalClosed(): void {
    this.selectedTransactionId.set(null);
  }
}