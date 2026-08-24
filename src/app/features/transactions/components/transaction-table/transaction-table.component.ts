import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../../../core/models/transaction.model';
import { TransactionRowStateMap, INITIAL_ROW_STATE } from '../../../../core/models/transaction-ui-state.model';
import { TransactionRowComponent } from '../transaction-row/transaction-row.component';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [TransactionRowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss',
})
export class TransactionTableComponent {
  @Input({ required: true }) transactions!: Transaction[];
  @Input({ required: true }) rowState!: TransactionRowStateMap;

  @Output() checkStatus = new EventEmitter<string>();
  @Output() viewDetails = new EventEmitter<string>();

  rowStateFor(id: string) {
    return this.rowState[id] ?? INITIAL_ROW_STATE;
  }
}