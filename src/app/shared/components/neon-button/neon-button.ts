import { Component, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-neon-button',
  standalone: true,
  imports: [],
  templateUrl: './neon-button.html',
  styleUrl: './neon-button.css',
})
export class NeonButton {
  @Output() click = new EventEmitter<MouseEvent>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.click.emit(event);
  }
}