import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '@env/environment';
import { Project } from '../models';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/Projects`).pipe(
      catchError(() => of([]))
    );
  }
}
