import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../service/catalog.service';
import { AuthService } from '../../service/auth.service';
import { CatalogComponent } from '../../models/motorbike.model';

@Component({
  selector: 'app-catalog-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog-view.component.html',
})
export class CatalogViewComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private authService = inject(AuthService);

  components = signal<CatalogComponent[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  errorMessage = signal('');
  successMessage = signal('');

  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteConfirm = signal(false);
  editingComponent = signal<CatalogComponent | null>(null);
  deleteConfirmId = signal<number | null>(null);
  deleteError = signal('');

  createForm = { name: '', lifespanKm: 0 };
  editForm = { name: '', lifespanKm: 0 };

  filteredComponents = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const items = this.components();
    if (!term) return items;
    return items.filter(c => c.name.toLowerCase().includes(term) || String(c.lifespanKm).includes(term));
  });

  get isAdmin() {
    return this.authService.isAdmin();
  }

  ngOnInit() {
    this.loadComponents();
  }

  loadComponents() {
    this.loading.set(true);
    this.catalogService.getCatalog().subscribe({
      next: (data) => {
        this.components.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar componentes');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  openCreateModal() {
    this.createForm = { name: '', lifespanKm: 0 };
    this.errorMessage.set('');
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreate() {
    if (!this.createForm.name.trim() || this.createForm.lifespanKm <= 0) {
      this.errorMessage.set('El nombre es requerido y el kilometraje debe ser mayor a 0');
      return;
    }
    this.catalogService.create({ name: this.createForm.name.trim(), lifespanKm: this.createForm.lifespanKm }).subscribe({
      next: () => {
        this.successMessage.set('Componente creado exitosamente');
        this.closeCreateModal();
        this.loadComponents();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al crear componente');
      }
    });
  }

  openEditModal(component: CatalogComponent) {
    this.editingComponent.set(component);
    this.editForm = { name: component.name, lifespanKm: component.lifespanKm };
    this.errorMessage.set('');
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingComponent.set(null);
  }

  submitEdit() {
    const comp = this.editingComponent();
    if (!comp) return;
    if (!this.editForm.name.trim() || this.editForm.lifespanKm <= 0) {
      this.errorMessage.set('El nombre es requerido y el kilometraje debe ser mayor a 0');
      return;
    }
    this.catalogService.update(comp.id, { name: this.editForm.name.trim(), lifespanKm: this.editForm.lifespanKm }).subscribe({
      next: () => {
        this.successMessage.set('Componente actualizado exitosamente');
        this.closeEditModal();
        this.loadComponents();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al actualizar componente');
      }
    });
  }

  openDeleteConfirm(id: number) {
    this.deleteConfirmId.set(id);
    this.deleteError.set('');
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm.set(false);
    this.deleteConfirmId.set(null);
  }

  confirmDelete() {
    const id = this.deleteConfirmId();
    if (!id) return;
    this.catalogService.delete(id).subscribe({
      next: () => {
        this.successMessage.set('Componente eliminado exitosamente');
        this.closeDeleteConfirm();
        this.loadComponents();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        const msg = err.error?.message || err.error || 'Error al eliminar componente';
        this.deleteError.set(msg);
      }
    });
  }
}
