import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { TransactionApiService } from '../../../../core/services/transaction-api.service';
import { Transaction, TransactionDetails } from '../../../../core/models/transaction.model';
import { getMethodLabel } from '../../../../core/utils/transaction-display.utils';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

type DetailsState =
  | { status: 'loading' }
  | { status: 'loaded'; data: TransactionDetails }
  | { status: 'error'; message: string };

@Component({
  selector: 'app-transaction-details-modal',
  standalone: true,
  imports: [ModalComponent, LoadingSpinnerComponent, StatusBadgeComponent, DatePipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-details-modal.component.html',
  styleUrl: './transaction-details-modal.component.scss',
})
export class TransactionDetailsModalComponent implements OnInit {
  @Input({ required: true }) transaction!: Transaction;
  @Output() closed = new EventEmitter<void>();

  private readonly api = inject(TransactionApiService);
  private readonly announcer = inject(LiveAnnouncer);
  private readonly destroyRef = inject(DestroyRef);

  titleId = 'transaction-details-title';
  readonly state = signal<DetailsState>({ status: 'loading' });

  readonly loadedData = computed(() => {
    const s = this.state();
    return s.status === 'loaded' ? s.data : null;
  });

  readonly errorMessage = computed(() => {
    const s = this.state();
    return s.status === 'error' ? s.message : '';
  });

  ngOnInit(): void {
    this.fetchDetails();
  }

  fetchDetails(): void {
    this.state.set({ status: 'loading' });

    this.api.getTransactionDetails(this.transaction).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => {
        this.state.set({ status: 'loaded', data });
        this.announcer.announce('Transaction details loaded', 'polite');
      },
      error: (err: Error) => {
        this.state.set({ status: 'error', message: err.message });
        this.announcer.announce(`Error: ${err.message}`, 'assertive');
      },
    });
  }

  getMethodLabel(method: TransactionDetails['paymentMethod']): string {
    return getMethodLabel(method);
  }

  onClose(): void {
    this.closed.emit();
  }
}
