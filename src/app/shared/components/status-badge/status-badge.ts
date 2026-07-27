import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  @Input() label: string = '';
  @Input() status: string = '';
  @Input() icon: string = '';

  get statusColor(): string {
    switch (this.status) {
      case 'optimal': return 'var(--futuristic-success)';
      case 'warning': return 'var(--futuristic-warning)';
      case 'critical': return 'var(--futuristic-error)';
      case 'maintenance': return 'var(--futuristic-accent)';
      default: return 'var(--futuristic-text-secondary)';
    }
  }

  get statusTooltip(): string {
    switch (this.status) {
      case 'optimal': return 'Óptimo';
      case 'warning': return 'Advertencia';
      case 'critical': return 'Crítico';
      case 'maintenance': return 'Mantenimiento';
      default: return this.status;
    }
  }
}