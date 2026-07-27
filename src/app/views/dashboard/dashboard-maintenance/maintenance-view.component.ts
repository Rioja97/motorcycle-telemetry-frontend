import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../../service/catalog.service';
import { InstalledComponentService } from '../../../service/installed-component.service';
import { MaintenanceService } from '../../../service/maintenance.service';
import { CatalogComponent } from '../../../models/motorbike.model';

/**
 * Vista de mantenimiento/instalación.
 * Incluye dos secciones: instalar nuevo componente y registrar mantenimiento.
 */
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
  private installService = inject(InstalledComponentService);
  private maintenanceService = inject(MaintenanceService);

  // Bike id
  bikeId = signal<number>(0);

  // Catalog data
  catalog = signal<CatalogComponent[]>([]);
  loadingCatalog = signal<boolean>(true);

  // --- Install component form ---
  selectedComponentId = signal<number | null>(null);
  installationMileage = signal<number>(0);
  installationDate = signal<string>('');
  installing = signal<boolean>(false);

  // --- Register maintenance form ---
  installedComponentId = signal<number | null>(null);
  maintenanceKm = signal<number>(0);
  maintenanceDate = signal<string>('');
  description = signal<string>('');
  maintaining = signal<boolean>(false);

  constructor() {
    // Obtener ID de la moto
    effect(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) this.bikeId.set(id);
    });

    // Cargar catálogo de componentes
    this.catalogService.getCatalog().subscribe({
      next: (data) => {
        this.catalog.set(data);
        this.loadingCatalog.set(false);
      },
      error: (err) => {
        console.error('Error loading catalog', err);
        this.loadingCatalog.set(false);
      },
    });
  }

  /** Instala un nuevo componente en la moto */
  installComponent() {
    if (!this.selectedComponentId()) return;
    this.installing.set(true);
    const payload = {
      motorbikeId: this.bikeId(),
      catalogComponentId: this.selectedComponentId()!,
      installationMileage: this.installationMileage(),
      installationDate: this.installationDate(),
    };
    this.installService.installComponent(payload).subscribe({
      next: () => {
        alert('Componente instalado correctamente');
        this.installing.set(false);
        // Reset form
        this.selectedComponentId.set(null);
        this.installationMileage.set(0);
        this.installationDate.set('');
      },
      error: (err) => {
        console.error('Error installing component', err);
        this.installing.set(false);
      },
    });
  }

  /** Registra un mantenimiento para un componente ya instalado */
  registerMaintenance() {
    if (!this.installedComponentId()) return;
    this.maintaining.set(true);
    const payload = {
      installedComponentId: this.installedComponentId()!,
      currentKm: this.maintenanceKm(),
      maintenanceDate: this.maintenanceDate(),
      description: this.description(),
    };
    this.maintenanceService.registerMaintenance(payload).subscribe({
      next: () => {
        alert('Mantenimiento registrado');
        this.maintaining.set(false);
        // Reset form
        this.installedComponentId.set(null);
        this.maintenanceKm.set(0);
        this.maintenanceDate.set('');
        this.description.set('');
      },
      error: (err) => {
        console.error('Error registering maintenance', err);
        this.maintaining.set(false);
      },
    });
  }
}
