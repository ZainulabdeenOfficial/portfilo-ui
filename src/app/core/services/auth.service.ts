import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '@env/environment';
import { LoginRequest, LoginResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly TOKEN_KEY = 'portfolio_jwt_token';
  private tokenInMemory: string | null = null;

  private readonly _isAuthenticated = signal(false);
  readonly isAuthenticated = computed(() => this._isAuthenticated());

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse | null> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        this.setToken(response.token);
      }),
      catchError(() => of(null))
    );
  }

  logout(): void {
    this.tokenInMemory = null;
    localStorage.removeItem(this.TOKEN_KEY);
    this._isAuthenticated.set(false);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return this.tokenInMemory || localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    this.tokenInMemory = token;
    localStorage.setItem(this.TOKEN_KEY, token);
    this._isAuthenticated.set(true);
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.tokenInMemory = token;
      this._isAuthenticated.set(true);
    }
  }
}
