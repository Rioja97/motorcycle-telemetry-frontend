import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center" style="background-color: var(--color-surface);">
      <div class="w-full max-w-md p-8 rounded-xl" style="background-color: var(--color-surface-variant); border: 1px solid var(--color-border);">

        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold" style="color: var(--color-primary); font-family: var(--font-family-display);">
            Moto Telemetry
          </h1>
          <p class="mt-2 text-sm" style="color: var(--color-text-muted);">
            Restablecer contrasena
          </p>
        </div>

        @if (error()) {
          <div class="mb-4 p-3 rounded-lg text-sm" style="background-color: rgba(255,107,107,0.1); color: var(--color-error); border: 1px solid rgba(255,107,107,0.3);">
            {{ error() }}
          </div>
        }

        @if (!success()) {
          @if (!token) {
            <div class="text-center p-4 rounded-lg text-sm" style="background-color: rgba(255,107,107,0.1); color: var(--color-error); border: 1px solid rgba(255,107,107,0.3);">
              Token no valido en la URL.
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1" style="color: var(--color-text-secondary);">Nueva contrasena</label>
                <input
                  type="password"
                  [(ngModel)]="newPassword"
                  name="newPassword"
                  required
                  minlength="6"
                  class="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style="background-color: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                  placeholder="Minimo 6 caracteres"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1" style="color: var(--color-text-secondary);">Confirmar contrasena</label>
                <input
                  type="password"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  required
                  class="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style="background-color: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text-primary);"
                  placeholder="Repite tu contrasena"
                />
              </div>

              <button
                type="submit"
                [disabled]="loading()"
                class="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                style="background-color: var(--color-primary); color: var(--color-surface);"
              >
                @if (loading()) {
                  <span class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Restableciendo...
                  </span>
                } @else {
                  Restablecer contrasena
                }
              </button>
            </form>
          }
        } @else {
          <div class="text-center space-y-4">
            <div class="p-4 rounded-lg text-sm" style="background-color: rgba(16,185,129,0.1); color: var(--color-success); border: 1px solid rgba(16,185,129,0.3);">
              Contrasena restablecida correctamente. Seras redirigido al login...
            </div>
          </div>
        }

        <div class="mt-6 text-center">
          <a routerLink="/login" class="text-sm hover:underline transition-colors" style="color: var(--color-primary);">
            Volver al login
          </a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    input:focus {
      border-color: var(--color-primary) !important;
      box-shadow: 0 0 0 2px rgba(0, 243, 255, 0.15);
    }
    button:hover:not(:disabled) {
      filter: brightness(1.1);
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  newPassword = '';
  confirmPassword = '';
  loading = signal(false);
  success = signal(false);
  error = signal('');
  token = '';

  ngOnInit() {
    if (this.authService.getToken()) {
      this.router.navigate(['/']);
      return;
    }
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  onSubmit() {
    if (!this.newPassword || this.newPassword.length < 6) {
      this.error.set('La contrasena debe tener al menos 6 caracteres');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error.set('Las contrasenas no coinciden');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.resetPassword({ token: this.token, newPassword: this.newPassword }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || err.error || 'Token invalido o expirado';
        this.error.set(typeof msg === 'string' ? msg : 'Error al restablecer contrasena');
      }
    });
  }
}
