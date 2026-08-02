import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CatalogComponent } from '../models/motorbike.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/catalog-components`;

  getCatalog() {
    return this.http.get<CatalogComponent[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<CatalogComponent>(`${this.apiUrl}/${id}`);
  }

  create(component: { name: string; lifespanKm: number }) {
    return this.http.post<CatalogComponent>(this.apiUrl, component);
  }

  update(id: number, component: { name: string; lifespanKm: number }) {
    return this.http.put<CatalogComponent>(`${this.apiUrl}/${id}`, component);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
