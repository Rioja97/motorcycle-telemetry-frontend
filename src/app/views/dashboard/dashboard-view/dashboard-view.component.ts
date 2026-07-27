import { Component, effect, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MotorbikeService } from '../../../service/motorbike-service';
import { ActivatedRoute } from '@angular/router';
import { ComponentHealthResponseDTO } from '../../../models/motorbike.model';

/**
 * Displays a grid of component health cards for the selected motorbike.
 * Uses Tailwind for styling and signals for state management.
 */
@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-view.component.html',
  styleUrls: []
})
export class DashboardViewComponent {
  private route = inject(ActivatedRoute);
  private motorbikeService = inject(MotorbikeService);

  bikeId = signal<number>(0);
  report = signal<any>(null);

  // Load health report on bikeId change
  constructor() {
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

  // Helper to compute status color class
  statusColor = computed(() => {
    // Not used directly; each component card computes its own color
    return '';
  });
}
