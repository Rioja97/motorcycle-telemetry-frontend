import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { InstallationRequestDTO, InstalledComponentResponseDTO } from '../models/motorbike.model';

@Injectable({ providedIn: 'root' })
export class InstalledComponentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/installed-components`;

  installComponent(payload: InstallationRequestDTO) {
    return this.http.post<InstalledComponentResponseDTO>(this.apiUrl, payload);
  }
}
