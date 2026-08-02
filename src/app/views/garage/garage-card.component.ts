import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MotorbikeDTO } from '../../models/motorbike.model';

@Component({
  selector: 'app-garage-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './garage-card.component.html',
})
export class GarageCardComponent {
  @Input() motorbike!: MotorbikeDTO;
  @Output() navigate = new EventEmitter<number>();
  @Output() updateKm = new EventEmitter<{ id: number; km: number }>();
  @Output() delete = new EventEmitter<number>();

  // local signal for the km input field
  kmInput = signal<number>(0);

  goToDetail() {
    this.navigate.emit(this.motorbike.id);
  }

  submitKm() {
    const km = this.kmInput();
    if (km > 0) {
      this.updateKm.emit({ id: this.motorbike.id, km });
      this.kmInput.set(0);
    }
  }
}
