import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-900">
      <div class="w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8">

        <div class="text-center mb-8">
          <img src="assets/logo.png" alt="MotoTelemetry" class="mx-auto h-28 mb-6 object-contain">
          <p class="mt-2 text-sm text-slate-400">
            {{ isRegister() ? 'Crear una cuenta' : 'Iniciar sesión' }}
          </p>
        </div>

        @if (error()) {
          <div class="mb-4 p-3 rounded-lg text-sm bg-red-500/10 text-red-400 border border-red-500/30">
            {{ error() }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          @if (isRegister()) {
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1 text-slate-300">Nombre</label>
                <input
                  type="text"
                  formControlName="firstName"
                  class="w-full px-4 py-3 rounded-lg text-sm bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="Juan"
                />
                @if (loginForm.get('firstName')?.touched && loginForm.get('firstName')?.invalid) {
                  <p class="mt-1 text-xs text-red-400">Nombre requerido</p>
                }
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 text-slate-300">Apellido</label>
                <input
                  type="text"
                  formControlName="lastName"
                  class="w-full px-4 py-3 rounded-lg text-sm bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="Perez"
                />
                @if (loginForm.get('lastName')?.touched && loginForm.get('lastName')?.invalid) {
                  <p class="mt-1 text-xs text-red-400">Apellido requerido</p>
                }
              </div>
            </div>
          }

          <div>
            <label class="block text-sm font-medium mb-1 text-slate-300">Email</label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-4 py-3 rounded-lg text-sm bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
              placeholder="tu@email.com"
            />
            @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
              <p class="mt-1 text-xs text-red-400">
                @if (loginForm.get('email')?.errors?.['required']) {
                  El email es requerido
                } @else if (loginForm.get('email')?.errors?.['email']) {
                  Ingrese un email válido
                }
              </p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-slate-300">Contraseña</label>
            <input
              type="password"
              formControlName="password"
              class="w-full px-4 py-3 rounded-lg text-sm bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
              placeholder="Mínimo 6 caracteres"
            />
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
              <p class="mt-1 text-xs text-red-400">
                @if (loginForm.get('password')?.errors?.['required']) {
                  La contraseña es requerida
                } @else if (loginForm.get('password')?.errors?.['minlength']) {
                  Mínimo 6 caracteres
                }
              </p>
            }
          </div>

          @if (!isRegister()) {
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  formControlName="rememberMe"
                  class="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0 cursor-pointer"
                />
                <span class="text-sm text-slate-400">Recordar sesión</span>
              </label>
              <a routerLink="/forgot-password" class="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          }

          <button
            type="submit"
            [disabled]="loading()"
            class="w-full py-3 rounded-lg font-semibold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              {{ isRegister() ? 'Crear cuenta' : 'Iniciar sesión' }}
            }
          </button>
        </form>

        <div class="mt-6 text-center space-y-2">
          <button
            (click)="toggleMode()"
            class="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
          >
            {{ isRegister() ? 'Ya tengo una cuenta, iniciar sesión' : 'No tengo cuenta, registrarme' }}
          </button>
          <div>
            <a routerLink="/ayuda" class="text-sm text-slate-400 hover:text-slate-300 hover:underline transition-colors">
              ¿Qué es MotoTelemetry?
            </a>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  isRegister = signal(false);
  loading = signal(false);
  error = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
      firstName: [''],
      lastName: ['']
    });

    if (this.authService.getToken()) {
      this.router.navigate(['/']);
    }
  }

  toggleMode() {
    this.isRegister.update(v => !v);
    this.error.set('');

    const firstName = this.loginForm.get('firstName');
    const lastName = this.loginForm.get('lastName');

    if (this.isRegister()) {
      firstName?.setValidators([Validators.required]);
      lastName?.setValidators([Validators.required]);
    } else {
      firstName?.clearValidators();
      lastName?.clearValidators();
    }

    firstName?.updateValueAndValidity();
    lastName?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { email, password, rememberMe, firstName, lastName } = this.loginForm.value;

    /*
     * Lógica de rememberMe en AuthService:
     * - Si rememberMe es true → guardar el JWT en localStorage (persiste al cerrar navegador).
     * - Si rememberMe es false → guardar el JWT en sessionStorage (se elimina al cerrar la pestaña).
     */
    const action = this.isRegister()
      ? this.authService.register(email, password, firstName.trim(), lastName.trim(), rememberMe)
      : this.authService.login(email, password, rememberMe);

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
