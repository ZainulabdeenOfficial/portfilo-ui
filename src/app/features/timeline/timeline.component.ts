import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { RevealDirective } from '@shared/directives/reveal.directive';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, RevealDirective],
  template: `
    <section id="timeline" class="section timeline-section">
      <div class="container">
        <app-section-heading tag="Journey" title="My Timeline"></app-section-heading>

        <div class="timeline">
          <div class="timeline__line"></div>
          <div
            *ngFor="let item of items; let i = index; let odd = odd"
            class="timeline__item"
            [class.timeline__item--right]="odd"
            appReveal
            [revealDelay]="i * 120">
            <div class="timeline__dot">
              <i [class]="item.icon"></i>
            </div>
            <div class="timeline__card glass-card">
              <span class="timeline__year">{{ item.year }}</span>
              <h3 class="timeline__title">{{ item.title }}</h3>
              <p class="timeline__desc">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  items: TimelineItem[] = [
    {
      year: '2020',
      title: 'Started Coding Journey',
      description: 'Began learning web development fundamentals — HTML, CSS, and JavaScript.',
      icon: 'fas fa-code'
    },
    {
      year: '2021',
      title: 'First Internship',
      description: 'Joined a startup as a frontend intern, building responsive UIs with Angular.',
      icon: 'fas fa-briefcase'
    },
    {
      year: '2022',
      title: 'Full-Stack Developer',
      description: 'Transitioned to full-stack development with .NET and Angular.',
      icon: 'fas fa-laptop-code'
    },
    {
      year: '2023',
      title: 'Open Source Contributions',
      description: 'Started contributing to open-source projects and building personal tools.',
      icon: 'fab fa-github'
    },
    {
      year: '2024',
      title: 'Senior Developer',
      description: 'Leading projects and mentoring junior developers in modern web architecture.',
      icon: 'fas fa-rocket'
    }
  ];
}
