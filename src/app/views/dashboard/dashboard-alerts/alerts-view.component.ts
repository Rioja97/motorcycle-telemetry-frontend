import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, AlertResponseDTO } from '../../../service/alertService';
import { ActivatedRoute } from '@angular/router';

/**
 * Lista de alertas para la motocicleta actual.
 * Permite marcar como leída/resuelta.
 */
@Component({
  selector: 'app-alerts-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts-view.component.html',
  styleUrls: []
})
export class AlertsViewComponent {
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);

  bikeId = signal<number>(0);
  alerts = signal<AlertResponseDTO[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    effect(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.bikeId.set(id);
        this.loading.set(true);
        this.alertService.getPendingAlerts(id).subscribe({
          next: (data) => {
            this.alerts.set(data);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error loading alerts', err);
            this.loading.set(false);
          },
        });
      }
    });
  }

  resolve(alertId: number) {
    this.alertService.resolveAlert(alertId).subscribe({
      next: () => {
        this.alerts.update((list) => list.filter((a) => a.id !== alertId));
      },
      error: (err) => console.error('Error resolving alert', err),
    });
  }
}
