import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MotorbikeDTO,
  MotorbikeHealthReportDTO,
  ComponentHealthResponseDTO,
  MileageUpdateDTO,
} from '../models/motorbike.model';

@Injectable({
  providedIn: 'root',
})
export class MotorbikeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/motorbikes`;

  // Signals for motorbike lists
  private _motorbikes = signal<MotorbikeDTO[]>([]);
  motorbikes = this._motorbikes.asReadonly();
  private _allMotorbikes = signal<MotorbikeDTO[]>([]);
  allMotorbikes = this._allMotorbikes.asReadonly();
  private _loading = signal<boolean>(false);
  loading = this._loading.asReadonly();

  /** Load list of motorbikes for current user */
  loadMyMotorbikes() {
    this._loading.set(true);
    const timestamp = new Date().getTime();
    this.http.get<MotorbikeDTO[]>(`${this.apiUrl}?_t=${timestamp}`).subscribe({
      next: (data) => {
        this._motorbikes.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error loading motorbikes', err);
        this._loading.set(false);
      },
    });
  }

  /** Load all motorbikes (admin only) */
  loadAllMotorbikes() {
    this._loading.set(true);
    const timestamp = new Date().getTime();
    this.http.get<MotorbikeDTO[]>(`${this.apiUrl}?all=true&_t=${timestamp}`).subscribe({
      next: (data) => {
        this._allMotorbikes.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error loading all motorbikes', err);
        this._loading.set(false);
      },
    });
  }

  /** Create a new motorbike (associated to current user) */
  createMotorbike(payload: Partial<MotorbikeDTO>) {
    return this.http.post<MotorbikeDTO>(this.apiUrl, payload);
  }

  /** Update a motorbike (admin can update any) */
  updateMotorbike(id: number, payload: Partial<MotorbikeDTO>): Observable<MotorbikeDTO> {
    return this.http.put<MotorbikeDTO>(`${this.apiUrl}/${id}`, payload);
  }

  /** Delete a motorbike (admin only) */
  deleteMotorbike(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** Get health report for a bike */
  getHealthReport(id: number) {
    return this.http.get<MotorbikeHealthReportDTO>(`${this.apiUrl}/${id}/health-report`);
  }

  /** Update mileage */
  updateMileage(id: number, payload: MileageUpdateDTO) {
    return this.http.patch(`${this.apiUrl}/${id}/mileage`, payload);
  }
}
