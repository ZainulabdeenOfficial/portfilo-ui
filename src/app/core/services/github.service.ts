import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { GithubRepo } from '@core/models';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly apiBase = 'https://api.github.com';
  private readonly username = 'ZainulabdeenOfficial';

  constructor(private http: HttpClient) {}

  getRepositories(): Observable<GithubRepo[]> {
    const url = `${this.apiBase}/users/${this.username}/repos?per_page=100&type=owner&sort=updated`;
    return this.http.get<GithubRepo[]>(url).pipe(
      map(repos => repos.sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))),
      catchError(() => of([]))
    );
  }
}
