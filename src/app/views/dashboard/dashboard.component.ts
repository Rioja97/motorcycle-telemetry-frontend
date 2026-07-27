import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MotorbikeService } from '../../service/motorbike-service';
import { MotorbikeHealthReportDTO } from '../../models/motorbike.model';

/**
 * Parent dashboard component for a motorbike.
 * Shows a header with bike info and navigation tabs.
 * Child views are loaded via router-outlet (dashboard, alerts, maintenance).
 */
@Component({
  selector: 'app-motorbike-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent {
  private route = inject(ActivatedRoute);
  private motorbikeService = inject(MotorbikeService);

  // Bike id from route params
  bikeId = signal<number>(0);
  // Health report signal
  report = signal<MotorbikeHealthReportDTO | null>(null);

  // Tabs definition (label and relative route)
  tabs = signal([
    { label: 'Dashboard', path: '' },
    { label: 'Alertas', path: 'alerts' },
    { label: 'Mantenimiento', path: 'maintenance' },
  ]);

  constructor() {
    // react to route param changes
    effect(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.bikeId.set(id);
        this.motorbikeService.getHealthReport(id).subscribe({
          next: (data) => this.report.set(data),
          error: (err) => console.error('Error loading health report', err),
        });
      }
    });
  }
}
