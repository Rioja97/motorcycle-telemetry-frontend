import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MotorbikeService } from '../../service/motorbike-service';
import { MotorbikeDTO } from '../../models/motorbike.model';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fleet.component.html',
})
export class FleetComponent {
  private motorbikeService = inject(MotorbikeService);

  motorbikes = this.motorbikeService.allMotorbikes;
  loading = this.motorbikeService.loading;

  showEditModal = signal<boolean>(false);
  showDeleteConfirm = signal<boolean>(false);
  editingBike = signal<MotorbikeDTO | null>(null);
  deleteConfirmId = signal<number | null>(null);
  searchTerm = signal<string>('');

  editForm = {
    brand: '',
    model: '',
    year: 0,
    currentKm: 0,
  };

  filteredMotorbikes = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const userMotorbikes = this.motorbikes();
    if (!term) return userMotorbikes;
    return userMotorbikes.filter(
      (bike) =>
        bike.brand.toLowerCase().includes(term) ||
        bike.model.toLowerCase().includes(term) ||
        bike.userEmail?.toLowerCase().includes(term) ||
        String(bike.year).includes(term) ||
        String(bike.currentKm).includes(term)
    );
  });

  constructor() {
    this.motorbikeService.loadAllMotorbikes();
  }

  openEditModal(bike: MotorbikeDTO) {
    this.editingBike.set(bike);
    this.editForm = {
      brand: bike.brand,
      model: bike.model,
      year: bike.year,
      currentKm: bike.currentKm,
    };
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingBike.set(null);
  }

  submitEdit() {
    const bike = this.editingBike();
    if (!bike) return;

    this.motorbikeService
      .updateMotorbike(bike.id, {
        brand: this.editForm.brand,
        model: this.editForm.model,
        year: this.editForm.year,
        currentKm: this.editForm.currentKm,
      })
      .subscribe({
        next: () => {
          this.motorbikeService.loadAllMotorbikes();
          this.closeEditModal();
        },
        error: (err) => console.error('Error updating motorbike', err),
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
        this.motorbikeService.loadAllMotorbikes();
        this.closeDeleteConfirm();
      },
      error: (err) => console.error('Error deleting motorbike', err),
    });
  }
}