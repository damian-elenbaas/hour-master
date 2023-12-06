import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@hour-master/frontend/auth';
import { IHourSchemeRow, IMachine } from '@hour-master/shared/api';
import { Subscription, of, switchMap } from 'rxjs';
import { MachineService } from '../machine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

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

  constructor(
    public readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly machineService: MachineService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
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
          console.error(err);
        }
      })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
