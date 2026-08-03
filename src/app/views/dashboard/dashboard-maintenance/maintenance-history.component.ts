import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MaintenanceService } from '../../../service/maintenance.service';
import { MaintenanceResponseDTO } from '../../../models/motorbike.model';

@Component({
  selector: 'app-maintenance-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance-history.component.html',
  styleUrls: []
})
export class MaintenanceHistoryComponent {
  private route = inject(ActivatedRoute);
  private maintenanceService = inject(MaintenanceService);

  bikeId = signal<number>(0);
  history = signal<MaintenanceResponseDTO[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.bikeId.set(id);
      this.loadHistory();
    }
  }

  loadHistory() {
    this.loading.set(true);
    this.maintenanceService.getMaintenancesByMotorbike(this.bikeId()).subscribe({
      next: (data) => {
        this.history.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
