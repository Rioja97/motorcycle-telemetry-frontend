import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertService } from './services/alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit{
  protected readonly title = signal('motorcycle-telemetry-frontend');

  private alertService = inject(AlertService);

  ngOnInit() {
    this.alertService.getPendingAlerts(1).subscribe({
    next: (data) => console.log("Alertas desde Spring Boot:", data),
    error: (err) => console.log("Error desde la peticion:", err)
    });
  }

}
