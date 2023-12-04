import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { Subscription, of, switchMap } from 'rxjs';
import { AuthService } from '@hour-master/frontend/auth';
import { Router } from '@angular/router';
import { IProject } from '@hour-master/shared/api';

@Component({
  selector: 'hour-master-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: IProject[] = [];
  sub!: Subscription;
  loading = true;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly projectService: ProjectService) { }

  ngOnInit(): void {
    this.sub = this.authService.currentUserToken$
      .pipe(
        switchMap((token) => {
          if (token) {
            return this.projectService.list({
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
            });
          } else {
            this.router.navigate(['/auth/login']);
            return of(null);
          }
        })
      )
      .subscribe((projects) => {
        if (projects) {
          this.projects = projects;
        }
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
