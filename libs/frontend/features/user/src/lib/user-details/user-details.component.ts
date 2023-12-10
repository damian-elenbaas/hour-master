import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IMachine, IProject, IUser, Id, Token, UserRole } from '@hour-master/shared/api';
import { Observable, Subscription, of, switchMap } from 'rxjs';
import { UserService } from '../user.service';
import { Location } from '@angular/common';
import { Modal } from 'flowbite';
import { AuthService } from '@hour-master/frontend/auth';
import { AlertService } from '@hour-master/frontend/common';

@Component({
  selector: 'hour-master-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  detailSub!: Subscription;
  projectsSub!: Subscription;
  machinesSub!: Subscription;
  workersSub!: Subscription;

  user!: IUser;
  projects: IProject[] = [];
  machines: IMachine[] = [];
  workers: IUser[] = [];

  detailsLoaded = false;
  projectsLoaded = false;
  machinesLoaded = false;
  workersLoaded = false;

  token!: Token;
  popUpModal!: Modal;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    public location: Location
  ) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('popup-modal') as HTMLElement;
    this.popUpModal = new Modal(modalElement);

    this.detailSub = this.authService.currentUserToken$
      .pipe(
        switchMap((token) => {
          if (!token) {
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            this.token = token;
            return this.route.paramMap;
          }
        })
      )
      .pipe(
        switchMap((params: ParamMap | null) => {
          if (!params) return of(null);

          if (!params.get('id')) {
            return of({
              username: '',
              email: '',
              firstname: '',
              lastname: '',
            } as IUser);
          } else {
            return this.userService.details(params.get('id') as Id, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
              },
            });
          }
        })
      )
      .subscribe({
        next: (user: IUser | null) => {
          if (!user) {
            this.alertService.danger('Gebruiker niet gevonden!');
            this.router.navigate(['/user']);
          } else {
            this.user = user;
            this.detailsLoaded = true;
            this.loadRelations();
          }
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['/user']);
        },
      });

  }

  ngOnDestroy(): void {
    this.detailSub?.unsubscribe();
    this.projectsSub?.unsubscribe();
    this.machinesSub?.unsubscribe();
    this.workersSub?.unsubscribe();
  }

  loadRelations(): void {
    this.projectsSub = this.canSeeStatistics()
      .pipe(
        switchMap((canSeeStatistics) => {
          if(canSeeStatistics) return this.authService.currentUserToken$;
          return of(null);
        })
      )
      .pipe(
        switchMap((token) => {
          if (!token) {
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            this.token = token;
            return this.route.paramMap;
          }
        })
      )
      .pipe(
        switchMap((params: ParamMap | null) => {
          if (!params) return of(null);

          if (!params.get('id')) {
            return of([]);
          } else {
            return this.userService.getRelatedProjects(params.get('id') as Id, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
              },
            });
          }
        })
      )
      .subscribe({
        next: (projects: IProject[] | null) => {
          if (projects) {
            this.projects = projects;
          }
          this.projectsLoaded = true;
        },
        error: (error) => {
          console.error(error);
        },
      });

    this.machinesSub = this.canSeeStatistics()
      .pipe(
        switchMap((canSeeStatistics) => {
          if(canSeeStatistics) return this.authService.currentUserToken$;
          return of(null);
        })
      )
      .pipe(
        switchMap((token) => {
          if (!token) {
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            this.token = token;
            return this.route.paramMap;
          }
        })
      )
      .pipe(
        switchMap((params: ParamMap | null) => {
          if (!params) return of(null);

          if (!params.get('id')) {
            return of([]);
          } else {
            return this.userService.getRelatedMachines(params.get('id') as Id, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
              },
            });
          }
        })
      )
      .subscribe({
        next: (machines: IMachine[] | null) => {
          if (machines) {
            this.machines = machines;
          }
          this.machinesLoaded = true;
        },
        error: (error) => {
          console.error(error);
        },
      });

    this.workersSub = this.canSeeStatistics()
      .pipe(
        switchMap((canSeeStatistics) => {
          if(canSeeStatistics) return this.authService.currentUserToken$;
          return of(null);
        })
      )
      .pipe(
        switchMap((token) => {
          if (!token) {
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            this.token = token;
            return this.route.paramMap;
          }
        })
      )
      .pipe(
        switchMap((params: ParamMap | null) => {
          if (!params) return of(null);

          if (!params.get('id')) {
            return of([]);
          } else {
            return this.userService.getRelatedWorkers(params.get('id') as Id, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
              },
            });
          }
        })
      )
      .subscribe({
        next: (workers: IUser[] | null) => {
          if (workers) {
            this.workers = workers;
          }
          this.workersLoaded = true;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  delete(): void {
    this.popUpModal.hide();
    if (this.user) {
      this.userService
        .delete(this.user._id, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        })
        .subscribe({
          next: () => {
            this.alertService.success(`Gebruiker ${this.user.username} is verwijderd!`);
            this.router.navigate(['/user']);
          },
          error: () => {
            this.alertService.danger('Je hebt geen rechten om deze gebruiker te verwijderen!');
          },
        });
    }
  }

  isRoadWorker(): boolean {
    return this.user.role === UserRole.ROADWORKER;
  }

  canSeeStatistics(): Observable<boolean> {
    return this.authService.userMaySeeStatistics();
  }

  canEdit(): Observable<boolean> {
    return this.authService.userMayEditUser(this.user._id);
  }
}
