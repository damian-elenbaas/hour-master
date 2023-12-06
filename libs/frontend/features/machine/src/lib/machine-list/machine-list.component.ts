import { Component, OnDestroy, OnInit } from '@angular/core';
import { MachineService } from '../machine.service';
import { AuthService } from '@hour-master/frontend/auth';
import { Subscription, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { IMachine } from '@hour-master/shared/api';

@Component({
  selector: 'hour-master-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.scss'],
})
export class MachineListComponent implements OnInit, OnDestroy {
  machines: IMachine[] = [];
  sub!: Subscription;
  token!: string;
  loading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly machineService: MachineService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.sub = this.authService.currentUserToken$
      .pipe(
        switchMap(token => {
          if(token) {
            this.token = token;
            return this.machineService.list({
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          } else {
            this.router.navigate(['/auth/login']);
            return of(null);
          }
        })
      )
      .subscribe({
        next: machines => {
          if(machines) {
            this.machines = machines;
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
