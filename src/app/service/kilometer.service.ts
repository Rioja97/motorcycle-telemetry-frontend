import { Injectable, signal } from '@angular/core';

export interface PartService {
  name: string;
  intervalKm: number; // km between services
  lastServiceKm: number;
}

@Injectable({
  providedIn: 'root'
})
export class KilometerService {
  // Current km reading (simulated)
  readonly currentKm = signal(0);

  // List of simulated parts that need service at regular intervals
  readonly parts: PartService[] = [
    { name: 'Cambio de aceite', intervalKm: 10000, lastServiceKm: 0 },
    { name: 'Filtro de aire', intervalKm: 15000, lastServiceKm: 0 },
    { name: 'Pastillas de freno', intervalKm: 20000, lastServiceKm: 0 }
  ];

  /** Increment the simulated kilometraje */
  addKilometers(km: number): void {
    this.currentKm.update(v => v + km);
  }

  /** Calculate the next due kilometraje for a given part */
  getDueKm(part: PartService): number {
    const cycles = Math.floor(this.currentKm() / part.intervalKm);
    return (cycles + 1) * part.intervalKm;
  }

  /** Return parts that are within the given threshold (km) from their next service */
  getUpcomingAlerts(threshold: number = 500) {
    const km = this.currentKm();
    return this.parts
      .map(p => ({
        name: p.name,
        dueKm: this.getDueKm(p),
        remaining: this.getDueKm(p) - km
      }))
      .filter(p => p.remaining <= threshold && p.remaining >= 0);
  }
}