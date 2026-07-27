import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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

  // Signals for motorbike list and loading state
  private _motorbikes = signal<MotorbikeDTO[]>([]);
  motorbikes = this._motorbikes.asReadonly();
  private _loading = signal<boolean>(false);
  loading = this._loading.asReadonly();

  /** Load list of motorbikes and populate the signal */
  loadMotorbikes() {
    this._loading.set(true);
    this.http.get<MotorbikeDTO[]>(this.apiUrl).subscribe({
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

  /** Create a new motorbike */
  createMotorbike(payload: Partial<MotorbikeDTO>) {
    return this.http.post<MotorbikeDTO>(this.apiUrl, payload);
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
