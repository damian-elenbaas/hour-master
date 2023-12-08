import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMachine, IProject, IUser } from '@hour-master/shared/api';
import { ProjectService } from '../project.service';
import { AuthService } from '@hour-master/frontend/auth';
import { AlertService } from '@hour-master/frontend/common';
import { Subscription, of, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'flowbite';

@Component({
  selector: 'hour-master-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  detailSub!: Subscription;
  workersSub!: Subscription;
  machinesSub!: Subscription;
  totalHoursSub!: Subscription;

  project!: IProject;
  workers: IUser[] = [];
  machines: IMachine[] = [];
  totalHours = 0;

  workersLoaded = false;
  machinesLoaded = false;
  totalHoursLoaded = false;

  token!: string;
  popUpModal!: Modal;

  constructor(
    public readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly alertService: AlertService,
    private readonly projectService: ProjectService) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('popup-modal') as HTMLElement;
    this.popUpModal = new Modal(modalElement);

    this.detailSub = this.authService.currentUserToken$
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

    this.workersSub = this.authService.currentUserToken$
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
            return this.projectService.getAllWorkersFromProject(id, {
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
      .subscribe((workers) => {
        if (workers) {
          this.workers = workers;
        }
        this.workersLoaded = true;
      });

    this.machinesSub = this.authService.currentUserToken$
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
            return this.projectService.getAllMachinesFromProject(id, {
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
      .subscribe((machines) => {
        if (machines) {
          this.machines = machines;
        }
        this.machinesLoaded = true;
      });

    this.totalHoursSub = this.authService.currentUserToken$
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
            return this.projectService.getTotalHoursFromProject(id, {
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
      .subscribe((hours) => {
        if (hours && typeof hours === 'number') {
          this.totalHours = hours;
        }
        this.totalHoursLoaded = true;
      });
  }

  ngOnDestroy(): void {
    this.detailSub?.unsubscribe();
    this.workersSub?.unsubscribe();
    this.machinesSub?.unsubscribe();
    this.totalHoursSub?.unsubscribe();
  }

  delete(): void {
    this.popUpModal.hide();
    this.projectService
      .delete(this.project._id, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: () => {
          this.alertService.success('Project verwijderd!');
          this.router.navigate(['/project']);
        },
        error: (error) => {
          console.error(error);
          this.alertService.danger('Kan het project niet verwijderen!');
        },
      });
  }
}
