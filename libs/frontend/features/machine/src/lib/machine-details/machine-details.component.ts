import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@hour-master/frontend/auth';
import { IHourSchemeRow, IMachine } from '@hour-master/shared/api';
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
  machine!: IMachine;
  hourRows: IHourSchemeRow[] = [];
  sub!: Subscription;
  token!: string;
  loading = false;
  totalHours = 0;
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

    this.sub = this.authService.currentUserToken$
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
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  delete(): void {
    this.loading = true;
    this.machineService
      .delete(this.machine._id, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.alertService.success('Machine verwijderd');
          this.location.back();
        },
        error: err => {
          this.loading = false;
          this.alertService.danger('Kan de machine niet verwijderen');
          console.error(err);
        }
      })
  }
}
