import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@hour-master/frontend/auth';
import { IHourSchemeRow, IMachine, IProject, IUser } from '@hour-master/shared/api';
import { Subscription, of, switchMap } from 'rxjs';
import { MachineService } from '../machine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService } from '@hour-master/frontend/common';
import { Modal } from 'flowbite';

@Component({
  selector: 'hour-master-machine-details',
  templateUrl: './machine-details.component.html',
  styleUrls: ['./machine-details.component.scss'],
})
export class MachineDetailsComponent implements OnInit, OnDestroy {
  detailSub!: Subscription;
  rowsSub!: Subscription;
  workersSub!: Subscription;
  projectsSub!: Subscription;
  totalHoursSub!: Subscription;

  machine!: IMachine;
  rows: IHourSchemeRow[] = [];
  workers: IUser[] = [];
  projects: IProject[] = [];
  totalHours = 0;

  rowsLoaded = false;
  workersLoaded = false;
  projectsLoaded = false;
  totalHoursLoaded = false;
  deleteLoading = false;


  token!: string;
  popUpModal!: Modal;

  constructor(
    public readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly machineService: MachineService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('popup-modal') as HTMLElement;
    this.popUpModal = new Modal(modalElement);

    this.detailSub = this.authService.currentUserToken$
      .pipe(
        switchMap(token => {
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
        switchMap(params => {
          if (!params) {
            this.location.back();
            return of(null);
          }

          const id = params.get('id');
          if (!id) {
            this.location.back();
            return of(null);
          }

          return this.machineService.details(id, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
        })
      )
      .subscribe({
        next: machine => {
          if (machine) {
            this.machine = machine;
          }
        },
        error: err => {
          this.location.back();
          this.alertService.danger('Machine niet gevonden');
          console.error(err);
        }
      })

    this.rowsSub = this.authService.currentUserToken$
      .pipe(
        switchMap(token => {
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
        switchMap(params => {
          if (!params) {
            this.location.back();
            return of(null);
          }

          const id = params.get('id');
          if (!id) {
            this.location.back();
            return of(null);
          }

          return this.machineService.getWorkRowsFromMachine(id, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
        })
      )
      .subscribe({
        next: rows => {
          if (rows) {
            this.rows = rows;
          }
          this.rowsLoaded = true;
        },
        error: err => {
          console.error(err);
        }
      })

    this.workersSub = this.authService.currentUserToken$
      .pipe(
        switchMap(token => {
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
        switchMap(params => {
          if (!params) {
            this.location.back();
            return of(null);
          }

          const id = params.get('id');
          if (!id) {
            this.location.back();
            return of(null);
          }

          return this.machineService.getRelatedWorkersFromMachine(id, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
        })
      )
      .subscribe({
        next: workers => {
          if (workers) {
            this.workers = workers;
          }
          this.workersLoaded = true;
        },
        error: err => {
          console.error(err);
        }
      })

    this.projectsSub = this.authService.currentUserToken$
      .pipe(
        switchMap(token => {
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
        switchMap(params => {
          if (!params) {
            this.location.back();
            return of(null);
          }

          const id = params.get('id');
          if (!id) {
            this.location.back();
            return of(null);
          }

          return this.machineService.getRelatedProjectsFromMachine(id, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
        })
      )
      .subscribe({
        next: projects => {
          if (projects) {
            this.projects = projects;
          }
          this.projectsLoaded = true;
        },
        error: err => {
          console.error(err);
        }
      })

    this.totalHoursSub = this.authService.currentUserToken$
      .pipe(
        switchMap(token => {
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
        switchMap(params => {
          if (!params) {
            this.location.back();
            return of(null);
          }

          const id = params.get('id');
          if (!id) {
            this.location.back();
            return of(null);
          }

          return this.machineService.getTotalHoursOnMachine(id, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
        })
      )
      .subscribe({
        next: hours => {
          if (hours && typeof hours === 'number') {
            this.totalHours = hours;
          }
          this.totalHoursLoaded = true;
        },
        error: err => {
          console.error(err);
        }
      })
  }

  ngOnDestroy(): void {
    this.detailSub?.unsubscribe();
  }

  delete(): void {
    this.deleteLoading = true;
    this.machineService
      .delete(this.machine._id, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      .subscribe({
        next: () => {
          this.deleteLoading = false;
          this.alertService.success('Machine verwijderd');
          this.location.back();
        },
        error: err => {
          this.deleteLoading = false;
          this.alertService.danger('Kan de machine niet verwijderen');
          console.error(err);
        }
      })
  }
}
