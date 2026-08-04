import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { AdminResponseDTO, AdminRequestDTO } from '../../models/motorbike.model';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-view.component.html',
})
export class AdminViewComponent implements OnInit {
  private adminService = inject(AdminService);

  admins = signal<AdminResponseDTO[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  errorMessage = signal('');
  successMessage = signal('');

  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteConfirm = signal(false);
  editingAdmin = signal<AdminResponseDTO | null>(null);
  deleteConfirmId = signal<number | null>(null);
  deleteError = signal('');

  createForm = { firstName: '', lastName: '', email: '', password: '' };
  editForm = { firstName: '', lastName: '', email: '', password: '' };

  protected readonly HARDCODED_EMAIL = 'admin@test.com';

  filteredAdmins = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const items = this.admins();
    if (!term) return items;
    return items.filter(a =>
      a.firstName.toLowerCase().includes(term) ||
      a.lastName.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.loading.set(true);
    this.adminService.getAll().subscribe({
      next: (data) => {
        this.admins.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar administradores');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  isHardcoded(admin: AdminResponseDTO): boolean {
    return admin.email === this.HARDCODED_EMAIL;
  }

  openCreateModal() {
    this.createForm = { firstName: '', lastName: '', email: '', password: '' };
    this.errorMessage.set('');
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  submitCreate() {
    if (!this.createForm.firstName.trim() || !this.createForm.lastName.trim() || !this.createForm.email.trim() || !this.createForm.password.trim()) {
      this.errorMessage.set('Todos los campos son requeridos');
      return;
    }
    this.adminService.create({
      firstName: this.createForm.firstName.trim(),
      lastName: this.createForm.lastName.trim(),
      email: this.createForm.email.trim(),
      password: this.createForm.password
    }).subscribe({
      next: () => {
        this.successMessage.set('Administrador creado exitosamente');
        this.closeCreateModal();
        this.loadAdmins();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al crear administrador');
      }
    });
  }

  openEditModal(admin: AdminResponseDTO) {
    this.editingAdmin.set(admin);
    this.editForm = { firstName: admin.firstName, lastName: admin.lastName, email: admin.email, password: '' };
    this.errorMessage.set('');
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingAdmin.set(null);
  }

  submitEdit() {
    const admin = this.editingAdmin();
    if (!admin) return;
    if (!this.editForm.firstName.trim() || !this.editForm.lastName.trim() || !this.editForm.email.trim()) {
      this.errorMessage.set('Nombre, apellido y email son requeridos');
      return;
    }
    const payload: AdminRequestDTO = {
      firstName: this.editForm.firstName.trim(),
      lastName: this.editForm.lastName.trim(),
      email: this.editForm.email.trim()
    };
    if (this.editForm.password.trim()) {
      payload.password = this.editForm.password;
    }
    this.adminService.update(admin.id, payload).subscribe({
      next: () => {
        this.successMessage.set('Administrador actualizado exitosamente');
        this.closeEditModal();
        this.loadAdmins();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al actualizar administrador');
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
    this.adminService.delete(id).subscribe({
      next: () => {
        this.successMessage.set('Administrador eliminado exitosamente');
        this.closeDeleteConfirm();
        this.loadAdmins();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        const msg = err.error?.message || err.error || 'Error al eliminar administrador';
        this.deleteError.set(msg);
      }
    });
  }
}
