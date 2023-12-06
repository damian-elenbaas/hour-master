import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IProject, IUser, Id } from '@hour-master/shared/api';
import { ProjectService } from '../project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, of, switchMap } from 'rxjs';
import { AuthService } from '@hour-master/frontend/auth';
import { Location } from '@angular/common';
import { AlertService } from '@hour-master/frontend/common';

@Component({
  selector: 'hour-master-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditComponent implements OnInit, OnDestroy {
  projectId!: Id;
  projectForm = this.fb.group({
    name: [''],
    location: this.fb.group({
      address: [''],
      city: [''],
      postalCode: [''],
    }),
  });
  loaded = false;
  sub!: Subscription;
  token!: string;
  admin!: IUser;

  constructor(
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly projectService: ProjectService,
    private readonly alertService: AlertService,
    private readonly fb: FormBuilder
  ) { }

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
            this.projectId = params.get('id') as Id;
            if (this.projectId) {
              return this.projectService.details(this.projectId, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.token}`,
                }
              });
            }
          }
          return of(null);
        })
      )
      .subscribe(
        {
          next:
            project => {
              if (project) {
                this.projectForm.patchValue(project);
                this.admin = project.admin;
              }
              this.loaded = true;
            },
          error: err => {
            this.location.back();
            this.alertService.danger('Project niet gevonden');
            console.error(err);
          }
        });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSubmit(): void {
    if (this.projectId) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    const project = this.projectForm.value as IProject;
    const user = this.authService.currentUser$.value;
    if (!user) return;

    project.admin = user;
    this.projectService.create(
      project,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        }
      }
    ).subscribe(() => {
      this.location.back();
    })
  }

  update(): void {
    const project = this.projectForm.value as IProject;
    project._id = this.projectId;
    project.admin = this.admin;

    this.projectService.update(project, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      }
    }).subscribe(() => {
      this.location.back();
    })
  }

  onCancel(): void {
    this.location.back();
  }
}
