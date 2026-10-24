import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private platformId = inject(PLATFORM_ID);
  private readonly tokenKey = 'auth_token';

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    let token = localStorage.getItem(this.tokenKey);
    if (!token) token = sessionStorage.getItem(this.tokenKey);
    return token;
  }

  setToken(token: string, rememberMe: boolean = false): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.tokenKey, token);
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem(this.tokenKey);
  }

  clearToken(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }
}