import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

Injectable({
  providedIn: 'root',
})

export interface AlertResponseDTO{
  id: number,
  componentName: string,
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
    return this.http.get<AlertResponseDTO[]>(`${this.apiUrl}/motorbike/${motorbikeId}/pending`);
  }
}
