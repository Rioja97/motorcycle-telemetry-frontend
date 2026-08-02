import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MotorbikeService } from '../../service/motorbike-service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { GarageCardComponent } from './garage-card.component';

@Component({
  selector: 'app-garage',
  standalone: true,
  imports: [CommonModule, FormsModule, GarageCardComponent],
  templateUrl: './garage.component.html',
})
export class GarageComponent {
  private motorbikeService = inject(MotorbikeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Pull signals from service
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

  // Signal to control form visibility
  showForm = signal<boolean>(false);
  showDeleteConfirm = signal<boolean>(false);
  deleteConfirmId = signal<number | null>(null);

  // Form fields
  newBike = {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    currentKm: 0,
  };
  isCreating = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.authService.isAdmin()) {
        this.motorbikeService.loadAllMotorbikes();
      } else {
        this.motorbikeService.loadMyMotorbikes();
      }
    });
  }

  /** Navigation to bike dashboard */
  goToDashboard(id: number) {
    this.router.navigate(['/motorbike', id]);
  }

  private reloadMotorbikes() {
    if (this.authService.isAdmin()) {
      this.motorbikeService.loadAllMotorbikes();
    } else {
      this.motorbikeService.loadMyMotorbikes();
    }
  }

  /** Create a new motorbike */
  createMotorbike() {
    this.isCreating.set(true);
    this.motorbikeService
      .createMotorbike({
        ...this.newBike,
        initialMileage: this.newBike.currentKm,
      })
      .subscribe({
        next: () => {
          this.reloadMotorbikes();
          this.showForm.set(false);
          this.newBike = { brand: '', model: '', year: new Date().getFullYear(), currentKm: 0 };
          this.isCreating.set(false);
        },
        error: (err) => {
          console.error('Error creating motorbike', err);
          this.isCreating.set(false);
        },
      });
  }

  /** Update kilometraje from card */
  updateKm(id: number, km: number) {
    this.motorbikeService.updateMileage(id, { currentKm: km }).subscribe({
      next: () => this.reloadMotorbikes(),
      error: (err) => console.error('Error updating km', err),
    });
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
      },
      error: (err) => {
        console.error('Error deleting motorbike', err);
        this.closeDeleteConfirm();
      },
    });
  }
}
