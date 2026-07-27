import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  // current user signal, null when not authenticated
  user = signal<User | null>(null);

  constructor() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      // In a real app decode token; here we mock a user
      this.user.set({ id: 1, name: 'Demo User', email: 'demo@example.com' });
    }
  }

  login(username: string, password: string) {
    // Stub implementation: store a mock token and set user
    const mockToken = 'mock-token';
    localStorage.setItem(this.tokenKey, mockToken);
    this.user.set({ id: 1, name: username, email: `${username}@example.com` });
    // navigate if needed
    this.router.navigate(['/']);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.user.set(null);
  }

  isAuthenticated() {
    return this.user.asReadonly();
  }
}
