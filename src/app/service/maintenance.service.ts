import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MaintenanceRequestDTO, MaintenanceResponseDTO } from '../models/motorbike.model';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/maintenance-history`;

  registerMaintenance(payload: MaintenanceRequestDTO) {
    return this.http.post<MaintenanceResponseDTO>(this.apiUrl, payload);
  }
}
