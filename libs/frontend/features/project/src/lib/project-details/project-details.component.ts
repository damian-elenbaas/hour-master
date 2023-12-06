import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IHourSchemeRow, IProject } from '@hour-master/shared/api';
import { ProjectService } from '../project.service';
import { AuthService } from '@hour-master/frontend/auth';
import { AlertService } from '@hour-master/frontend/common';
import { Subscription, of, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'hour-master-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  project!: IProject;
  hourRows: IHourSchemeRow[] = [];
  totalHours = 0;
  token!: string;

  constructor(
    public readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly alertService: AlertService,
    private readonly projectService: ProjectService) { }

  ngOnInit(): void {
    this.sub = this.authService.currentUserToken$
      .pipe(
        switchMap((token) => {
          if (token) {
            this.token = token;
            return this.route.paramMap;
          } else {
            this.router.navigate(['/auth/login']);
            return of(null);
          }
        })
      )
      .pipe(
        switchMap((params) => {
          if (params) {
            const id = params.get('id') as string;
            return this.projectService.details(id, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.token,
              },
            });
          } else {
            return of(null);
          }
        })
      )
      .subscribe((project) => {
        if (project) {
          this.project = project;
        } else {
          this.alertService.danger('Project niet gevonden!');
          this.router.navigate(['/project']);
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
