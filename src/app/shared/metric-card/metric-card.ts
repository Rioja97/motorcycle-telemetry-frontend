import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MetricCalculatorService, MetricCalculations } from '../services/metric-calculator.service';
import { FormatService } from '../services/format.service';

export interface MetricConfig {
  title: string;
  value: number | string;
  unit: string;
  warningThreshold: number | null;
  criticalThreshold: number | null;
  inverse: boolean; // For metrics where low is bad (like battery)
  format?: 'number' | 'currency' | 'date' | 'percent';
}

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './metric-card.html',
  styleUrls: ['./metric-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricCardComponent {
  @Input() config!: MetricConfig;
  
  calculations: MetricCalculations = {
    statusIcon: '',
    isWarning: false,
    isCritical: false,
    fillPercentage: 0
  };
  
  formattedValue: string = '';

  constructor(
    private metricCalculator: MetricCalculatorService,
    private formatService: FormatService
  ) {}

  ngOnChanges(): void {
    if (this.config) {
      this.updateCalculations();
    }
  }

  private updateCalculations(): void {
    this.calculations = this.metricCalculator.calculate(
      this.config.value, 
      {
        warning: this.config.warningThreshold,
        critical: this.config.criticalThreshold,
        inverse: this.config.inverse
      }
    );
    
    this.formattedValue = this.formatService.format(
      this.config.value,
      this.config.format
    );
  }
}