import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubRepo } from '@core/models';
import { GithubService } from '@core/services/github.service';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  selector: 'app-github-showcase',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, SkeletonComponent, RevealDirective],
  template: `
    <section id="github" class="section github-section">
      <div class="container">
        <app-section-heading
          tag="GitHub"
          title="GitHub & Open Source"
        ></app-section-heading>

        <div *ngIf="loading()" class="github-loading">
          <app-skeleton width="100%" height="220px" radius="16px"></app-skeleton>
          <app-skeleton width="100%" height="260px" radius="16px"></app-skeleton>
        </div>

        <div *ngIf="!loading()" class="github-layout">
          <article class="glass-card graph-card" appReveal>
            <div class="card-header">
              <h3>Commit Contribution Graph</h3>
              <a [href]="githubProfile" target="_blank" rel="noopener" class="profile-link">
                <i class="fab fa-github"></i>
                {{ username }}
              </a>
            </div>

            <img
              class="contribution-graph"
              [src]="contributionGraphUrl"
              alt="GitHub Contribution Graph"
              loading="lazy"
            />
          </article>

          <article class="glass-card repos-card" appReveal>
            <div class="card-header">
              <h3>🚀 Open Source Projects</h3>
              <span class="repo-count">{{ repos().length }} repos</span>
            </div>

            <div *ngIf="repos().length > 0; else noRepos" class="repos-grid">
              <a
                *ngFor="let repo of repos(); trackBy: trackByRepoId"
                class="repo-item"
                [href]="repo.html_url"
                target="_blank"
                rel="noopener"
              >
                <div class="repo-item__top">
                  <h4>{{ repo.name }}</h4>
                  <i class="fas fa-arrow-up-right-from-square"></i>
                </div>
                <p>{{ repo.description || 'No description available.' }}</p>
                <div class="repo-meta">
                  <span><i class="fas fa-star"></i> {{ repo.stargazers_count }}</span>
                  <span><i class="fas fa-code-fork"></i> {{ repo.forks_count }}</span>
                  <span *ngIf="repo.language"><i class="fas fa-screwdriver-wrench"></i> {{ repo.language }}</span>
                </div>
              </a>
            </div>

            <ng-template #noRepos>
              <p class="empty-copy">No repositories available.</p>
            </ng-template>
          </article>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./github-showcase.component.scss']
})
export class GithubShowcaseComponent implements OnInit {
  readonly repos = signal<GithubRepo[]>([]);
  readonly loading = signal(true);

  readonly username = 'ZainulabdeenOfficial';
  readonly githubProfile = `https://github.com/${this.username}`;
  readonly contributionGraphUrl = `https://ghchart.rshah.org/409ba5/${this.username}`;

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.githubService.getRepositories().subscribe(data => {
      this.repos.set(data);
      this.loading.set(false);
    });
  }

  trackByRepoId(_: number, repo: GithubRepo): number {
    return repo.id;
  }
}
