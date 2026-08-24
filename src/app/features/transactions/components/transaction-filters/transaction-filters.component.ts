import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StatusFilter } from '../../../../core/utils/transaction-filter.utils';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REFUNDED', label: 'Refunded' },
];

@Component({
  selector: 'app-transaction-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-filters.component.html',
  styleUrl: './transaction-filters.component.scss',
})
export class TransactionFiltersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  @Input() initialSearch = '';
  @Input() initialStatus: StatusFilter = 'ALL';
  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<StatusFilter>();

  statusOptions = STATUS_OPTIONS;
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      search: [this.initialSearch],
      status: [this.initialStatus as StatusFilter],
    });

    this.form.controls['search'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.searchChange.emit(value ?? ''));

    this.form.controls['status'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.statusChange.emit((value ?? 'ALL') as StatusFilter));
  }
}