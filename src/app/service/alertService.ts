import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


export interface AlertResponseDTO{
  id: number,
  motorbikeId: number,
  catalogComponentId: number,
  componentName: string
  status: string,
  message: string
}


@Injectable({
  providedIn: 'root',
})
export class AlertService{
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/alerts`;

  getPendingAlerts(motorbikeId: number){
    return this.http.get<AlertResponseDTO[]>(`${this.apiUrl}/motorbike/${motorbikeId}`);
  }

  readAlert(alertId: number) {
    return this.http.patch(`${this.apiUrl}/${alertId}/read`, {});
  }

  resolveAlert(alertId: number) {
    // Assuming a resolve endpoint similar to read; adjust if API differs
    return this.http.patch(`${this.apiUrl}/${alertId}/resolve`, {});
  }
}