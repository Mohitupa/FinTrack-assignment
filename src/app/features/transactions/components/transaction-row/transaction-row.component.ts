import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Transaction } from '../../../../core/models/transaction.model';
import { TransactionRowState } from '../../../../core/models/transaction-ui-state.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { getMethodLabel } from '../../../../core/utils/transaction-display.utils';

@Component({
  selector: 'tr[app-transaction-row]',
  standalone: true,
  imports: [DatePipe, StatusBadgeComponent, LoadingSpinnerComponent, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-row.component.html',
  styleUrl: './transaction-row.component.scss',
})
export class TransactionRowComponent {
  @Input({ required: true }) transaction!: Transaction;
  @Input({ required: true }) rowState!: TransactionRowState;

  @Output() checkStatus = new EventEmitter<string>();
  @Output() viewDetails = new EventEmitter<string>();

  get methodLabel(): string {
    return getMethodLabel(this.transaction.paymentMethod);
  }

  onCheckStatus(): void {
    this.checkStatus.emit(this.transaction.id);
  }

  onViewDetails(event: MouseEvent): void {
    (event.currentTarget as HTMLElement)?.focus();
    this.viewDetails.emit(this.transaction.id);
  }
}