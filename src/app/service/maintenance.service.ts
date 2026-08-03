import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MaintenanceRequestDTO, MaintenanceResponseDTO } from '../models/motorbike.model';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/maintenance-history`;

  getMaintenances() {
    return this.http.get<MaintenanceResponseDTO[]>(this.apiUrl);
  }

  getMaintenancesByMotorbike(motorbikeId: number) {
    return this.http.get<MaintenanceResponseDTO[]>(`${this.apiUrl}/motorbike/${motorbikeId}`);
  }

  registerMaintenance(payload: MaintenanceRequestDTO) {
    return this.http.post<MaintenanceResponseDTO>(this.apiUrl, payload);
  }

  updateMaintenance(id: number, payload: MaintenanceRequestDTO) {
    return this.http.put<MaintenanceResponseDTO>(`${this.apiUrl}/${id}`, payload);
  }

  deleteMaintenance(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
