import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotorbikeDTO } from '../../models/motorbike.model';

@Component({
  selector: 'app-garage-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './garage-card.component.html',
})
export class GarageCardComponent {
  @Input() motorbike!: MotorbikeDTO;
  @Input() status: 'ok' | 'warning' | 'critical' = 'ok';
  @Input() alertCount: number = 0;
  @Output() navigate = new EventEmitter<number>();

  goToDetail() {
    this.navigate.emit(this.motorbike.id);
  }
}
