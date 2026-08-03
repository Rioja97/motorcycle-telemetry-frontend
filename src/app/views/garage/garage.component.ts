import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotorbikeService } from '../../service/motorbike-service';
import { AuthService } from '../../service/auth.service';
import { AlertService } from '../../service/alertService';
import { MaintenanceService } from '../../service/maintenance.service';
import { Router } from '@angular/router';
import { MotorbikeDTO } from '../../models/motorbike.model';
import { GarageCardComponent } from './garage-card.component';

@Component({
  selector: 'app-garage',
  standalone: true,
  imports: [CommonModule, GarageCardComponent],
  templateUrl: './garage.component.html',
})
export class GarageComponent {
  private motorbikeService = inject(MotorbikeService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private maintenanceService = inject(MaintenanceService);
  private router = inject(Router);

  private motorbikesRaw = this.motorbikeService.motorbikes;
  private allMotorbikesRaw = this.motorbikeService.allMotorbikes;
  loading = this.motorbikeService.loading;

  motorbikes = computed(() => {
    if (this.authService.isAdmin()) {
      const email = this.authService.user()?.email;
      return this.allMotorbikesRaw().filter(bike => bike.userEmail === email);
    }
    return this.motorbikesRaw();
  });

  // KPIs
  totalMotos = computed(() => this.motorbikes().length);
  alertasActivas = computed(() => this.alertService.allAlerts().length);
  mantenimientosMes = signal<number>(0);

  // Alertas
  alertas = this.alertService.allAlerts;
  loadingAlertas = this.alertService.loadingAll;

  showDeleteConfirm = signal<boolean>(false);
  deleteConfirmId = signal<number | null>(null);

  constructor() {
    effect(() => {
      if (this.authService.isAdmin()) {
        this.motorbikeService.loadAllMotorbikes();
      } else {
        this.motorbikeService.loadMyMotorbikes();
      }
    });

    this.alertService.loadPendingAlerts();
    this.loadMantenimientosMes();
  }

  private loadMantenimientosMes() {
    this.maintenanceService.getMaintenances().subscribe({
      next: (data) => {
        const now = new Date();
        const mesActual = now.getMonth();
        const anioActual = now.getFullYear();
        const count = data.filter(m => {
          const fecha = new Date(m.maintenanceDate);
          return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
        }).length;
        this.mantenimientosMes.set(count);
      }
    });
  }

  goToDashboard(id: number) {
    this.router.navigate(['/motorbike', id]);
  }

  getBikeStatus(bike: MotorbikeDTO): 'ok' | 'warning' | 'critical' {
    const alerts = this.alertService.allAlerts();
    const bikeAlerts = alerts.filter(a => a.motorbikeId === bike.id);
    if (bikeAlerts.some(a => a.status === 'REPLACE')) return 'critical';
    if (bikeAlerts.some(a => a.status === 'WARNING')) return 'warning';
    return 'ok';
  }

  getBikeAlertCount(bike: MotorbikeDTO): number {
    return this.alertService.allAlerts().filter(a => a.motorbikeId === bike.id).length;
  }

  getAlertBorderColor(status: string): string {
    return status === 'REPLACE' ? 'border-red-500' : 'border-yellow-500';
  }

  getAlertStatusColor(status: string): string {
    return status === 'REPLACE' ? 'text-red-400' : 'text-yellow-400';
  }

  openDeleteConfirm(id: number) {
    this.deleteConfirmId.set(id);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm.set(false);
    this.deleteConfirmId.set(null);
  }

  confirmDelete() {
    const id = this.deleteConfirmId();
    if (!id) return;
    this.motorbikeService.deleteMotorbike(id).subscribe({
      next: () => {
        this.reloadMotorbikes();
        this.closeDeleteConfirm();
        this.alertService.loadPendingAlerts();
      },
      error: (err) => {
        console.error('Error deleting motorbike', err);
        this.closeDeleteConfirm();
      },
    });
  }

  private reloadMotorbikes() {
    if (this.authService.isAdmin()) {
      this.motorbikeService.loadAllMotorbikes();
    } else {
      this.motorbikeService.loadMyMotorbikes();
    }
  }
}
