import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { TransactionStatus } from '../../../core/models/transaction.model';

interface StatusMeta {
  label: string;
  modifierClass: string;
}

const STATUS_META: Record<TransactionStatus, StatusMeta> = {
  PENDING: { label: 'Pending', modifierClass: 'status-badge--pending' },
  PROCESSING: { label: 'Processing', modifierClass: 'status-badge--processing' },
  SUCCESS: { label: 'Success', modifierClass: 'status-badge--success' },
  FAILED: { label: 'Failed', modifierClass: 'status-badge--failed' },
  REFUNDED: { label: 'Refunded', modifierClass: 'status-badge--refunded' },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: TransactionStatus;

  get meta(): StatusMeta {
    return STATUS_META[this.status];
  }
}
