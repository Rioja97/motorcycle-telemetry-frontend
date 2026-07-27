import { Injectable } from '@angular/core';

export interface MetricThresholds {
  warning: number | null;
  critical: number | null;
  inverse: boolean;
}

export interface MetricCalculations {
  statusIcon: string;
  isWarning: boolean;
  isCritical: boolean;
  fillPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class MetricCalculatorService {
  calculate(value: number | string, thresholds: MetricThresholds): MetricCalculations {
    const valueNum = typeof value === 'number' ? value : parseFloat(value as string);
    if (isNaN(valueNum)) {
      return {
        statusIcon: '',
        isWarning: false,
        isCritical: false,
        fillPercentage: 0
      };
    }

    const isWarning = this.isWarning(valueNum, thresholds);
    const isCritical = this.isCritical(valueNum, thresholds);
    
    // Determine status icon
    let statusIcon = '';
    if (isCritical) {
      statusIcon = thresholds.inverse ? 'alert' : 'error';
    } else if (isWarning) {
      statusIcon = thresholds.inverse ? 'warning' : 'warning';
    } else {
      statusIcon = thresholds.inverse ? 'check_circle' : 'check_circle_outline';
    }

    // Calculate fill percentage
    const fillPercentage = this.calculateFillPercentage(valueNum, thresholds);

    return {
      statusIcon,
      isWarning,
      isCritical,
      fillPercentage
    };
  }

  private isWarning(value: number, thresholds: MetricThresholds): boolean {
    if (thresholds.warning === null) return false;
    return thresholds.inverse ? value < thresholds.warning : value > thresholds.warning;
  }

  private isCritical(value: number, thresholds: MetricThresholds): boolean {
    if (thresholds.critical === null) return false;
    return thresholds.inverse ? value < thresholds.critical : value > thresholds.critical;
  }

  private calculateFillPercentage(value: number, thresholds: MetricThresholds): number {
    // For simplicity, we'll assume a max value of 2x the critical threshold or 100 if no thresholds
    let maxValue = 100;
    if (thresholds.critical !== null) {
      maxValue = Math.max(thresholds.critical * 2, 100);
    }
    
    let percentage = (value / maxValue) * 100;
    return Math.min(100, Math.max(0, percentage));
  }
}