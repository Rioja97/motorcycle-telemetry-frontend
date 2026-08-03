import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../../service/catalog.service';
import { MaintenanceService } from '../../../service/maintenance.service';
import { MotorbikeService } from '../../../service/motorbike-service';
import { CatalogComponent, MaintenanceResponseDTO, MaintenanceRequestDTO, MotorbikeDTO } from '../../../models/motorbike.model';

@Component({
  selector: 'app-maintenance-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-view.component.html',
  styleUrls: []
})
export class MaintenanceViewComponent {
  private route = inject(ActivatedRoute);
  private catalogService = inject(CatalogService);
  private maintenanceService = inject(MaintenanceService);
  private motorbikeService = inject(MotorbikeService);

  bikeId = signal<number>(0);

  catalog = signal<CatalogComponent[]>([]);
  loadingCatalog = signal<boolean>(true);

  motorbikes = signal<MotorbikeDTO[]>([]);

  history = signal<MaintenanceResponseDTO[]>([]);
  loadingHistory = signal<boolean>(true);

  // Form
  selectedMotorbikeId = signal<number | null>(null);
  selectedComponentIds = signal<number[]>([]);
  maintenanceKm = signal<number>(0);
  maintenanceDate = signal<string>('');
  description = signal<string>('');
  submitting = signal<boolean>(false);

  // Edit mode
  editingId = signal<number | null>(null);
  isEditing = signal<boolean>(false);

  // Delete confirm
  showDeleteConfirm = signal<boolean>(false);
  deleteTargetId = signal<number | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.bikeId.set(id);
      this.selectedMotorbikeId.set(id);
    }

    this.catalogService.getCatalog().subscribe({
      next: (data) => {
        this.catalog.set(data);
        this.loadingCatalog.set(false);
      },
      error: () => this.loadingCatalog.set(false),
    });

    this.motorbikeService.loadMyMotorbikes();
    effect(() => {
      this.motorbikes.set(this.motorbikeService.motorbikes() as any);
    });

    this.loadHistory();
  }

  loadHistory() {
    const bid = this.bikeId();
    if (!bid) return;
    this.loadingHistory.set(true);
    this.maintenanceService.getMaintenancesByMotorbike(bid).subscribe({
      next: (data) => {
        this.history.set(data);
        this.loadingHistory.set(false);
      },
      error: () => this.loadingHistory.set(false),
    });
  }

  toggleComponent(id: number) {
    const current = this.selectedComponentIds();
    if (current.includes(id)) {
      this.selectedComponentIds.set(current.filter(c => c !== id));
    } else {
      this.selectedComponentIds.set([...current, id]);
    }
  }

  isComponentSelected(id: number): boolean {
    return this.selectedComponentIds().includes(id);
  }

  selectedBikeCurrentKm(): number {
    const bid = this.selectedMotorbikeId();
    const bike = this.motorbikes().find(b => b.id === bid);
    return bike ? bike.currentKm : 0;
  }

  get selectedBikeInfo(): string {
    const bid = this.selectedMotorbikeId();
    const bike = this.motorbikes().find(b => b.id === bid);
    return bike ? `${bike.brand} ${bike.model} (${bike.year})` : 'Seleccionar moto';
  }

  startEdit(item: MaintenanceResponseDTO) {
    this.isEditing.set(true);
    this.editingId.set(item.id);
    this.description.set(item.description);
    this.maintenanceKm.set(item.currentKm);
    this.maintenanceDate.set(item.maintenanceDate);

    // Find motorbike by info string (best effort)
    const bike = this.motorbikes().find(b => `${b.brand} ${b.model}` === item.motorbikeInfo || `${b.brand} ${b.model} (${b.year})` === item.motorbikeInfo);
    if (bike) this.selectedMotorbikeId.set(bike.id);

    // Pre-select catalog components by name
    const selectedIds: number[] = [];
    for (const name of item.componentNames) {
      const comp = this.catalog().find(c => c.name === name);
      if (comp) selectedIds.push(comp.id);
    }
    this.selectedComponentIds.set(selectedIds);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.resetForm();
  }

  submitForm() {
    if (!this.selectedMotorbikeId() || this.selectedComponentIds().length === 0 || !this.maintenanceDate()) return;

    this.submitting.set(true);
    const payload: MaintenanceRequestDTO = {
      motorbikeId: this.selectedMotorbikeId()!,
      catalogComponentIds: this.selectedComponentIds(),
      maintenanceDate: this.maintenanceDate(),
      currentKm: this.maintenanceKm(),
      description: this.description(),
    };

    const op = this.isEditing()
      ? this.maintenanceService.updateMaintenance(this.editingId()!, payload)
      : this.maintenanceService.registerMaintenance(payload);

    op.subscribe({
      next: () => {
        this.resetForm();
        this.isEditing.set(false);
        this.editingId.set(null);
        this.loadHistory();
        this.submitting.set(false);
      },
      error: (err) => {
        console.error('Error saving maintenance', err);
        this.submitting.set(false);
      },
    });
  }

  openDeleteConfirm(id: number) {
    this.deleteTargetId.set(id);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm.set(false);
    this.deleteTargetId.set(null);
  }

  confirmDelete() {
    const id = this.deleteTargetId();
    if (!id) return;
    this.maintenanceService.deleteMaintenance(id).subscribe({
      next: () => {
        this.closeDeleteConfirm();
        this.loadHistory();
      },
      error: (err) => {
        console.error('Error deleting maintenance', err);
        this.closeDeleteConfirm();
      },
    });
  }

  private resetForm() {
    this.selectedComponentIds.set([]);
    this.maintenanceKm.set(0);
    this.maintenanceDate.set('');
    this.description.set('');
  }
}
