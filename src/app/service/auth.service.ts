import { Injectable, signal, inject } from '@angular/core';
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
  private readonly tokenKey = 'auth_token';
  private apiUrl = `${environment.apiUrl}/auth`;

  user = signal<User | null>(null);

  constructor() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const payload = this.decodeToken(token);
      if (payload) {
        this.user.set({ id: 1, name: payload.sub || '', email: payload.sub || '' });
      }
    }
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this.user.set({ id: 1, name: email, email });
        this.router.navigate(['/']);
      })
    );
  }

  register(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this.user.set({ id: 1, name: email, email });
        this.router.navigate(['/']);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated() {
    return this.user.asReadonly();
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}
