import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '@env/environment';
import { Bio } from '../models';

@Injectable({ providedIn: 'root' })
export class BioService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getBio(): Observable<Bio | null> {
    return this.http.get<Bio>(`${this.baseUrl}/Bio`).pipe(
      catchError(() => of(null))
    );
  }

  createBio(payload: Bio): Observable<Bio | null> {
    return this.http.post<Bio>(`${this.baseUrl}/Bio`, payload).pipe(
      catchError(() => of(null))
    );
  }

  updateBio(payload: Bio, id?: number): Observable<Bio | null> {
    const url = id != null ? `${this.baseUrl}/Bio/${id}` : `${this.baseUrl}/Bio`;
    return this.http.put<Bio>(url, payload).pipe(
      catchError(() => of(null))
    );
  }
}
