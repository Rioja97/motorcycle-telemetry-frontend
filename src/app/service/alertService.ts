import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface AlertResponseDTO {
  id: number;
  motorbikeId: number;
  catalogComponentId: number;
  componentName: string;
  status: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/alerts`;

  private _allAlerts = signal<AlertResponseDTO[]>([]);
  allAlerts = this._allAlerts.asReadonly();
  private _loadingAll = signal<boolean>(false);
  loadingAll = this._loadingAll.asReadonly();

  loadPendingAlerts() {
    this._loadingAll.set(true);
    this.http.get<AlertResponseDTO[]>(`${this.apiUrl}/pending`).subscribe({
      next: (data) => { this._allAlerts.set(data); this._loadingAll.set(false); },
      error: () => this._loadingAll.set(false),
    });
  }

  clearAlerts() {
    this._allAlerts.set([]);
  }

  getPendingAlerts(motorbikeId: number) {
    return this.http.get<AlertResponseDTO[]>(`${this.apiUrl}/motorbike/${motorbikeId}/pending`);
  }

  readAlert(alertId: number) {
    return this.http.patch(`${this.apiUrl}/${alertId}/read`, {});
  }

  resolveAlert(alertId: number) {
    return this.http.patch(`${this.apiUrl}/${alertId}/read`, {});
  }
}
