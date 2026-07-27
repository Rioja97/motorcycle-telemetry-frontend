import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatProgressBarModule],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.css',
})
export class MetricCard {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() trend: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() showProgress: boolean = false;
  @Input() progressValue: number = 0;

  get trendClass(): string {
    return `trend-${this.trend}`;
  }

  get trendIcon(): string {
    switch (this.trend) {
      case 'up': return 'arrow_upward';
      case 'down': return 'arrow_downward';
      default: return 'remove';
    }
  }
}