import { Component, inject, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../service/catalog.service';
import { MaintenanceService } from '../../service/maintenance.service';
import { MotorbikeService } from '../../service/motorbike-service';
import { AuthService } from '../../service/auth.service';
import { CatalogComponent, MaintenanceResponseDTO, MaintenanceRequestDTO, MotorbikeDTO } from '../../models/motorbike.model';

@Component({
  selector: 'app-maintenance-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-view.component.html',
  styleUrls: []
})
export class MaintenanceViewComponent {
  private catalogService = inject(CatalogService);
  private maintenanceService = inject(MaintenanceService);
  private motorbikeService = inject(MotorbikeService);
  public authService = inject(AuthService);

  catalog = signal<CatalogComponent[]>([]);
  loadingCatalog = signal<boolean>(true);

  motorbikes = signal<MotorbikeDTO[]>([]);
  loadingMotorbikes = signal<boolean>(true);

  history = signal<MaintenanceResponseDTO[]>([]);
  loadingHistory = signal<boolean>(true);

  selectedMotorbikeId = signal<number | null>(null);
  selectedComponentIds = signal<number[]>([]);
  maintenanceKm = signal<number>(0);
  maintenanceDate = signal<string>('');
  description = signal<string>('');
  submitting = signal<boolean>(false);

  editingId = signal<number | null>(null);
  isEditing = signal<boolean>(false);

  showDeleteConfirm = signal<boolean>(false);
  deleteTargetId = signal<number | null>(null);

  componentDropdownOpen = signal<boolean>(false);
  componentSearch = signal<string>('');
  MAX_COMPONENTS = 10;

  searchMotorbike = signal<string>('');
  filteredHistory = signal<MaintenanceResponseDTO[]>([]);

  filteredCatalog = computed(() => {
    const term = this.componentSearch().toLowerCase().trim();
    const cat = this.catalog();
    if (!term) return cat;
    return cat.filter(c => c.name.toLowerCase().includes(term));
  });

  selectedComponentNames = computed(() => {
    const ids = this.selectedComponentIds();
    const cat = this.catalog();
    return ids.map(id => cat.find(c => c.id === id)).filter(Boolean) as CatalogComponent[];
  });

  canAddComponent = computed(() => this.selectedComponentIds().length < this.MAX_COMPONENTS);

  constructor() {
    this.catalogService.getCatalog().subscribe({
      next: (data) => {
        this.catalog.set(data);
        this.loadingCatalog.set(false);
      },
      error: () => this.loadingCatalog.set(false),
    });

    this.loadMotorbikes();
    this.loadHistory();
  }

  loadMotorbikes() {
    this.loadingMotorbikes.set(true);
    if (this.authService.isAdmin()) {
      this.motorbikeService.loadAllMotorbikes();
      effect(() => {
        const all = this.motorbikeService.allMotorbikes();
        const email = this.authService.user()?.email;
        this.motorbikes.set(all.filter(b => b.userEmail === email));
        this.loadingMotorbikes.set(false);
      });
    } else {
      this.motorbikeService.loadMyMotorbikes();
      effect(() => {
        this.motorbikes.set(this.motorbikeService.motorbikes());
        this.loadingMotorbikes.set(false);
      });
    }
  }

  loadHistory() {
    this.loadingHistory.set(true);
    this.maintenanceService.getMaintenances().subscribe({
      next: (data) => {
        this.history.set(data);
        this.applyFilter();
        this.loadingHistory.set(false);
      },
      error: () => this.loadingHistory.set(false),
    });
  }

  applyFilter() {
    const term = this.searchMotorbike().toLowerCase().trim();
    if (!term) {
      this.filteredHistory.set(this.history());
    } else {
      this.filteredHistory.set(
        this.history().filter(h => h.motorbikeInfo.toLowerCase().includes(term))
      );
    }
  }

  toggleComponent(id: number) {
    const current = this.selectedComponentIds();
    if (current.includes(id)) {
      this.selectedComponentIds.set(current.filter(c => c !== id));
    } else if (current.length < this.MAX_COMPONENTS) {
      this.selectedComponentIds.set([...current, id]);
    }
  }

  removeComponent(id: number) {
    this.selectedComponentIds.set(this.selectedComponentIds().filter(c => c !== id));
  }

  isComponentSelected(id: number): boolean {
    return this.selectedComponentIds().includes(id);
  }

  toggleDropdown() {
    this.componentDropdownOpen.set(!this.componentDropdownOpen());
  }

  closeDropdown() {
    this.componentDropdownOpen.set(false);
    this.componentSearch.set('');
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

    const bike = this.motorbikes().find(
      b => `${b.brand} ${b.model} (${b.year})` === item.motorbikeInfo ||
           `${b.brand} ${b.model}` === item.motorbikeInfo
    );
    if (bike) this.selectedMotorbikeId.set(bike.id);

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
    this.componentDropdownOpen.set(false);
    this.componentSearch.set('');
  }
}
