import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center" style="background-color: var(--color-surface);">
      <div class="w-full max-w-md p-8 rounded-xl" style="background-color: var(--color-surface-variant); border: 1px solid var(--color-border);">

        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold" style="color: var(--color-primary); font-family: var(--font-family-display);">
            Moto Telemetry
          </h1>
          <p class="mt-2 text-sm" style="color: var(--color-text-muted);">
            {{ isRegister() ? 'Crear una cuenta' : 'Iniciar sesion' }}
          </p>
        </div>

        @if (error()) {
          <div class="mb-4 p-3 rounded-lg text-sm" style="background-color: rgba(255,107,107,0.1); color: var(--color-error); border: 1px solid rgba(255,107,107,0.3);">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--color-text-secondary);">Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              class="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
              style="background-color: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              placeholder="tu&#64;email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--color-text-secondary);">Contrasena</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              minlength="6"
              class="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
              style="background-color: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text-primary);"
              placeholder="Minimo 6 caracteres"
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
                {{ isRegister() ? 'Creando cuenta...' : 'Ingresando...' }}
              </span>
            } @else {
              {{ isRegister() ? 'Crear cuenta' : 'Iniciar sesion' }}
            }
          </button>
        </form>

        <div class="mt-6 text-center">
          <button
            (click)="toggleMode()"
            class="text-sm hover:underline transition-colors"
            style="color: var(--color-primary);"
          >
            {{ isRegister() ? 'Ya tengo una cuenta, iniciar sesion' : 'No tengo cuenta, registrarme' }}
          </button>
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
export class LoginComponent {
  email = '';
  password = '';
  isRegister = signal(false);
  loading = signal(false);
  error = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.getToken()) {
      this.router.navigate(['/']);
    }
  }

  toggleMode() {
    this.isRegister.update(v => !v);
    this.error.set('');
  }

  onSubmit() {
    if (!this.email || !this.password || this.password.length < 6) {
      this.error.set('Completa todos los campos (minimo 6 caracteres en contrasena)');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const action = this.isRegister()
      ? this.authService.register(this.email, this.password)
      : this.authService.login(this.email, this.password);

    action.subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || err.error || 'Error al autenticar';
        this.error.set(typeof msg === 'string' ? msg : 'Credenciales incorrectas');
      }
    });
  }
}
