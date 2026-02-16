import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, catchError, throwError } from 'rxjs';
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
    return this.http.post<any>(`${this.baseUrl}/Auth/login`, credentials, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        const body = response.body;
        const headerAuth = response.headers.get('Authorization') || response.headers.get('authorization');
        const headerToken = headerAuth?.replace(/^Bearer\s+/i, '');
        const token = this.extractToken(body) || headerToken;
        if (!token) return null;

        const expiration = body?.expiration || body?.expires || body?.data?.expiration || '';
        this.setToken(token);
        return { token, expiration } as LoginResponse;
      }),
      catchError((err) => throwError(() => err))
    );
  }

  private extractToken(body: any): string | null {
    if (!body) return null;
    if (typeof body === 'string') return body;

    return (
      body.token ||
      body.accessToken ||
      body.access_token ||
      body.jwt ||
      body.result ||
      body.data?.token ||
      body.data?.accessToken ||
      body.data?.access_token ||
      body.data?.jwt ||
      null
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
