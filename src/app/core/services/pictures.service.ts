import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '@env/environment';
import { Picture } from '../models';

@Injectable({ providedIn: 'root' })
export class PicturesService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAll(category?: string): Observable<Picture[]> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.http.get<Picture[]>(`${this.baseUrl}/Pictures${params}`).pipe(
      catchError(() => of([]))
    );
  }
}
