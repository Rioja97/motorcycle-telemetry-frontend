import { Component, effect, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MotorbikeService } from '../../service/motorbike-service';
import { AlertService, AlertResponseDTO } from '../../service/alertService';
import { MaintenanceService } from '../../service/maintenance.service';
import { MotorbikeHealthReportDTO, MaintenanceResponseDTO } from '../../models/motorbike.model';

@Component({
  selector: 'app-motorbike-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private motorbikeService = inject(MotorbikeService);
  private alertService = inject(AlertService);
  private maintenanceService = inject(MaintenanceService);

  bikeId = signal<number>(0);
  report = signal<MotorbikeHealthReportDTO | null>(null);

  // Tabs
  activeTab = signal<string>('dashboard');
  tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'alertas', label: 'Alertas' },
    { key: 'mantenimiento', label: 'Mantenimiento' },
  ];

  // Alertas
  alerts = signal<AlertResponseDTO[]>([]);
  loadingAlerts = signal<boolean>(false);

  // Mantenimiento
  history = signal<MaintenanceResponseDTO[]>([]);
  loadingHistory = signal<boolean>(false);

  // Computed para datos de la moto
  bikeInfo = computed(() => this.report()?.motorbikeInfo ?? '');
  bikeKm = computed(() => this.report()?.currentKm ?? 0);

  constructor() {
    effect(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.bikeId.set(id);
        this.loadHealthReport(id);
        this.loadAlerts(id);
        this.loadHistory(id);
      }
    });

    // Sincronizar tab activo con la ruta
    effect(() => {
      const path = this.route.snapshot.routeConfig?.path ?? '';
      if (path.includes('alertas')) {
        this.activeTab.set('alertas');
      } else if (path.includes('mantenimiento')) {
        this.activeTab.set('mantenimiento');
      } else {
        this.activeTab.set('dashboard');
      }
    });
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
    const id = this.bikeId();
    if (tab === 'dashboard') {
      this.router.navigate(['/motorbike', id]);
    } else {
      this.router.navigate(['/motorbike', id, tab]);
    }
  }

  private loadHealthReport(id: number) {
    this.motorbikeService.getHealthReport(id).subscribe({
      next: (data) => this.report.set(data),
      error: (err) => console.error('Error loading health report', err),
    });
  }

  private loadAlerts(id: number) {
    this.loadingAlerts.set(true);
    this.alertService.getPendingAlerts(id).subscribe({
      next: (data) => {
        this.alerts.set(data);
        this.loadingAlerts.set(false);
      },
      error: (err) => {
        console.error('Error loading alerts', err);
        this.loadingAlerts.set(false);
      },
    });
  }

  private loadHistory(id: number) {
    this.loadingHistory.set(true);
    this.maintenanceService.getMaintenancesByMotorbike(id).subscribe({
      next: (data) => {
        this.history.set(data);
        this.loadingHistory.set(false);
      },
      error: (err) => {
        console.error('Error loading maintenance history', err);
        this.loadingHistory.set(false);
      },
    });
  }


}
