import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [A11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) titleId!: string;
  @Output() closed = new EventEmitter<void>();

  private lastFocusedElement: HTMLElement | null = null;

  ngOnInit(): void {
    this.lastFocusedElement = document.activeElement as HTMLElement | null;
  }

  ngOnDestroy(): void {
    this.lastFocusedElement?.focus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  onBackdropClick(): void {
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}