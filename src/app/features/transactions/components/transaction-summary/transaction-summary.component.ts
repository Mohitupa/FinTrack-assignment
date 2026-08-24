import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TransactionSummary } from '../../../../core/utils/transaction-summary.utils';

@Component({
  selector: 'app-transaction-summary',
  standalone: true,
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-summary.component.html',
  styleUrl: './transaction-summary.component.scss',
})
export class TransactionSummaryComponent {
  @Input({ required: true }) summary!: TransactionSummary;

  get successRatePercent() {
    const { totalDisplayed, successfulCount } = this.summary;
    return totalDisplayed === 0 ? null : Math.round((successfulCount / totalDisplayed) * 100);
  }
}
