import { Injectable, signal, inject, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap, catchError, of } from 'rxjs';
import { User, UpdateProfileRequest, ChangePasswordRequest, ResetPasswordRequest } from '../models/user.model';

interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private readonly tokenKey = 'auth_token';
  private apiUrl = `${environment.apiUrl}/auth`;
  private usersUrl = `${environment.apiUrl}/users`;

  user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem(this.tokenKey);
      if (!token) {
        token = sessionStorage.getItem(this.tokenKey);
      }
      this._token.set(token);
      if (token) {
        this.getProfile().subscribe({
          error: (err) => {
            if (err.status === 401) {
              this.logout();
            }
          }
        });
      }
    }
  }

  login(email: string, password: string, rememberMe: boolean = false) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        this.setToken(res.token, rememberMe);
        this.getProfile().subscribe();
        this.router.navigate(['/']);
      })
    );
  }

  register(email: string, password: string, firstName: string, lastName: string, rememberMe: boolean = false) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password, firstName, lastName }).pipe(
      tap(res => {
        this.setToken(res.token, rememberMe);
        this.getProfile().subscribe();
        this.router.navigate(['/']);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.tokenKey);
    }
    this._token.set(null);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  getProfile() {
    return this.http.get<User>(`${this.usersUrl}/me`).pipe(
      tap(user => this.user.set(user))
    );
  }

  updateProfile(data: UpdateProfileRequest) {
    return this.http.put<User>(`${this.usersUrl}/me`, data).pipe(
      tap(user => this.user.set(user))
    );
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.put<{ message: string }>(`${this.usersUrl}/me/change-password`, data);
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, null, { params: { email } });
  }

  resetPassword(data: ResetPasswordRequest) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, data);
  }

  isAdmin = computed(() => {
    const token = this._token();
    if (!token) return false;
    const payload = this.decodeToken(token);
    const authorities = payload?.authorities || payload?.roles || [];
    return authorities.some((auth: any) => {
      if (typeof auth === 'string') return auth === 'ROLE_ADMIN';
      if (typeof auth === 'object' && auth !== null) {
        return auth.authority === 'ROLE_ADMIN' || auth.role === 'ROLE_ADMIN';
      }
      return false;
    });
  });

  private setToken(token: string, rememberMe: boolean = false) {
    if (isPlatformBrowser(this.platformId)) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.tokenKey, token);
      const otherStorage = rememberMe ? sessionStorage : localStorage;
      otherStorage.removeItem(this.tokenKey);
    }
    this._token.set(token);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }
}
