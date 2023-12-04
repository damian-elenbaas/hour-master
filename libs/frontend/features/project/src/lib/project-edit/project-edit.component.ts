import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IProject, IUser, Id } from '@hour-master/shared/api';
import { ProjectService } from '../project.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of, switchMap } from 'rxjs';
import { AuthService } from '@hour-master/frontend/auth';
import { Location } from '@angular/common';

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
    private readonly authService: AuthService,
    private readonly projectService: ProjectService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUserToken$
      .pipe(
        switchMap((token) => {
          if (token) {
            this.token = token;
            return this.route.paramMap;
          } else {
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
      .subscribe((project) => {
        if (project) {
          this.projectForm.patchValue(project);
          this.admin = project.admin;
        }
        this.loaded = true;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSubmit(): void {
    const project = this.projectForm.value as IProject;
    if(this.projectId) {
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
    } else {
      const user = this.authService.currentUser$.value;
      if(!user) return;

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
  }

  onCancel(): void {
    this.location.back();
  }
}
