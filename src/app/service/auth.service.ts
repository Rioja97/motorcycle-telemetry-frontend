import { Injectable, signal, inject, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

interface AuthResponse {
  token: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private readonly tokenKey = 'auth_token';
  private apiUrl = `${environment.apiUrl}/auth`;

  user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      this._token.set(token);
      if (token) {
        const payload = this.decodeToken(token);
        if (payload) {
          this.user.set({ id: 1, name: payload.sub || '', email: payload.sub || '' });
        }
      }
    }
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, res.token);
        }
        this._token.set(res.token);
        this.user.set({ id: 1, name: email, email });
        this.router.navigate(['/']);
      })
    );
  }

  register(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password }).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, res.token);
        }
        this._token.set(res.token);
        this.user.set({ id: 1, name: email, email });
        this.router.navigate(['/']);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this._token.set(null);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
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
