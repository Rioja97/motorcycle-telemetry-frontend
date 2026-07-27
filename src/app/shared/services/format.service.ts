import { Injectable } from '@angular/core';

export type FormatType = 'number' | 'currency' | 'date' | 'percent';

@Injectable({
  providedIn: 'root'
})
export class FormatService {
  format(value: any, format?: FormatType): string {
    if (value === null || value === undefined) return '';
    
    switch (format) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      case 'currency':
        return typeof value === 'number' ? `$${value.toFixed(2)}` : String(value);
      case 'date':
        return value instanceof Date ? value.toLocaleDateString() : String(value);
      case 'percent':
        return typeof value === 'number' ? `${value.toFixed(1)}%` : String(value);
      default:
        return String(value);
    }
  }
}