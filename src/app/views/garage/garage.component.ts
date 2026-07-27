import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotorbikeService } from '../../service/motorbike-service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { GarageCardComponent } from './garage-card.component';

@Component({
  selector: 'app-garage',
  standalone: true,
  imports: [CommonModule, GarageCardComponent],
  templateUrl: './garage.component.html',
})
export class GarageComponent {
  private motorbikeService = inject(MotorbikeService);
  private router = inject(Router);

  // Pull signals from service
  motorbikes = this.motorbikeService.motorbikes;
  loading = this.motorbikeService.loading;

  // Signal to control modal visibility (simple boolean for now)
  showNewModal = signal<boolean>(false);

  constructor() {
    // Load data on component init
    effect(() => {
      this.motorbikeService.loadMotorbikes();
    });
  }

  /** Navigation to bike dashboard */
  goToDashboard(id: number) {
    this.router.navigate(['/motorbike', id]);
  }

  /** Open native prompt to create a new motorbike (simplified) */
  openNewMotorbikePrompt() {
    const brand = window.prompt('Marca');
    const model = window.prompt('Modelo');
    const yearStr = window.prompt('Año');
    const year = yearStr ? Number(yearStr) : undefined;
    if (brand && model && year) {
      this.motorbikeService
        .createMotorbike({ brand, model, year })
        .subscribe({
          next: () => this.motorbikeService.loadMotorbikes(),
          error: (err) => console.error('Error creating motorbike', err),
        });
    }
  }

  /** Update kilometraje from card */
  updateKm(id: number, km: number) {
    this.motorbikeService.updateMileage(id, { currentKm: km }).subscribe({
      next: () => this.motorbikeService.loadMotorbikes(),
      error: (err) => console.error('Error updating km', err),
    });
  }
}
