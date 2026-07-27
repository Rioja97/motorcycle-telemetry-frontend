import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  format?: string; // e.g., 'number', 'date', 'currency'
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSortModule, MatPaginatorModule],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css']
})
export class DataTableComponent<T> {
  @Input() data: T[] = [];
  @Input() displayedColumns: ColumnDef[] = [];
  @Input() showPaginator: boolean = true;
  @Input() showSort: boolean = true;
  @Output() rowClick = new EventEmitter<T>();
  
  // For sorting
  sortedColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // For pagination
  pageSizeOptions = [5, 10, 25, 50];
  pageSize = 10;
  pageIndex = 0;
  
  get sortedData(): T[] {
    if (!this.sortDisplayedColumns().length || !this.sortedColumn) {
      return this.data;
    }
    
    return [...this.data].sort((a, b) => {
      const aValue = this.getPropertyValue(a, this.sortedColumn);
      const bValue = this.getPropertyValue(b, this.sortedColumn);
      
      let comparison = 0;
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
  
  get pagedData(): T[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.sortedData.slice(startIndex, startIndex + this.pageSize);
  }
  
  sortDisplayedColumns(): ColumnDef[] {
    return this.displayedColumns.filter(col => col.sortable);
  }
  
  onSortChange(column: string): void {
    if (!this.showSort) return;
    
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }
  }
  
  getSortIcon(column: string): string {
    if (!this.showSort || this.sortedColumn !== column) {
      return 'unsorted';
    }
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }
  
  public getPropertyValue(obj: any, path: string): any {
    return path.split('.').reduce((obj, prop) => obj && obj[prop] !== undefined ? obj[prop] : null, obj);
  }
  
  formatValue(value: any, format?: string): string {
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
  
  // These would be implemented based on specific use cases
  // For now, returning default values - in a real implementation, 
  // these would be passed as inputs or determined by the data
  getCellStatus(row: T, columnKey: string): boolean {
    // Default implementation - override in specific use cases
    return false;
  }
  
  getCellStatusIcon(row: T, columnKey: string): string {
    // Default implementation - override in specific use cases
    return 'error';
  }
  
  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }
  
  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }
}