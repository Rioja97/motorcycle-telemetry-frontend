import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col bg-mec-bg text-white">
      <section class="p-6 max-w-4xl mx-auto space-y-6 flex-1">
        <!-- Boton Volver -->
        <button (click)="goBack()"
                class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>

        <!-- Sobre MotoTelemetry -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4">Sobre MotoTelemetry</h2>
          <p class="text-gray-300 leading-relaxed mb-4">
            MotoTelemetry es un sistema integral de telemetria, gestion de mantenimientos y alertas predictivas
            disenado para flotas de motocicletas. Permite monitorear en tiempo real el estado de cada unidad,
            calcular la vida util de los repuestos basandose en kilometraje real y generar alertas automaticas
            antes de que un componente falle.
          </p>
          <p class="text-gray-300 leading-relaxed">
            El sistema esta construido con
            <span class="text-primary font-semibold">Angular 19</span> en el frontend y
            <span class="text-primary font-semibold">Java Spring Boot</span> en el backend,
            utilizando arquitectura standalone signals-first y autenticacion JWT.
          </p>
        </div>

        <!-- Como Funciona -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4">Como Funciona</h2>
          <ul class="space-y-3 text-gray-300">
            <li class="flex items-start gap-3">
              <span class="text-primary mt-1">&#10003;</span>
              <span>
                <strong class="text-white">Actualizacion de odometros:</strong>
                cada motocicleta registra kilometraje en tiempo real mediante el backend,
                manteniendo un historial preciso de uso por componente instalado.
              </span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-primary mt-1">&#10003;</span>
              <span>
                <strong class="text-white">Calculo de vida util:</strong>
                el sistema compara el kilometraje acumulado de cada repuesto contra su vida util estimada
                (definida en el catalogo de componentes) para determinar su estado: optimo, advertencia o critico.
              </span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-primary mt-1">&#10003;</span>
              <span>
                <strong class="text-white">Alertas predictivas:</strong>
                cuando un componente se acerca al limite de su vida util, el sistema genera alertas automaticas
                para programar mantenimiento antes de que ocurra una falla.
              </span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-primary mt-1">&#10003;</span>
              <span>
                <strong class="text-white">Historial de mantenimiento:</strong>
                registro completo de cada servicio realizado, con fecha, kilometraje y detalles del trabajo efectuado.
              </span>
            </li>
          </ul>
        </div>

        <!-- Contacto / Desarrollador -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4">Contacto / Desarrollador</h2>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div class="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center flex-shrink-0">
              <span class="text-3xl font-bold text-primary">EF</span>
            </div>
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-white">Emmanuel Fossati</h3>
              <p class="text-gray-400 text-sm">Desarrollador Full Stack</p>
              <div class="flex flex-col sm:flex-row gap-3 mt-3">
                <a href="mailto:emmafossati97&#64;yahoo.com"
                   class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  emmafossati97&#64;yahoo.com
                </a>
                <a href="https://github.com/Rioja97" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/emmanuel-fossati/" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-gray-800 py-4 px-6 text-center text-sm text-gray-500">
        <span>&copy; {{ currentYear }} MotoTelemetry. Todos los derechos reservados.</span>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HelpComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  currentYear = new Date().getFullYear();

  goBack() {
    if (this.auth.getToken()) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
