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
}
