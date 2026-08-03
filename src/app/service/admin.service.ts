import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AdminResponseDTO, AdminRequestDTO } from '../models/motorbike.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admins`;

  getAll() {
    return this.http.get<AdminResponseDTO[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<AdminResponseDTO>(`${this.apiUrl}/${id}`);
  }

  create(admin: AdminRequestDTO) {
    return this.http.post<AdminResponseDTO>(this.apiUrl, admin);
  }

  update(id: number, admin: AdminRequestDTO) {
    return this.http.put<AdminResponseDTO>(`${this.apiUrl}/${id}`, admin);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
