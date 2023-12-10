import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMachine, Id } from '@hour-master/shared/api';
import { MachineService } from '../machine.service';
import { AuthService } from '@hour-master/frontend/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, of, switchMap } from 'rxjs';
import { AlertService } from '@hour-master/frontend/common';

@Component({
  selector: 'hour-master-machine-edit',
  templateUrl: './machine-edit.component.html',
  styleUrls: ['./machine-edit.component.scss'],
})
export class MachineEditComponent implements OnInit, OnDestroy {
  machineId!: Id;
  machineForm = this.fb.group({
    name: ['', Validators.required],
    typeNumber: ['', Validators.required],
  })
  loaded = false;
  sub!: Subscription;
  token!: string;

  constructor(
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly machineService: MachineService,
    private readonly alertService: AlertService,
    private readonly fb: FormBuilder,
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
          if (params) {
            this.machineId = params.get('id') as Id;
            if (this.machineId) {
              return this.machineService.details(this.machineId, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.token}`,
                },
              });
            }
          }
          return of(null);
        })
      )
      .subscribe({
        next: (machine) => {
          if (machine) {
            this.machineForm.patchValue(machine);
          }
          this.loaded = true;
        },
        error: (err) => {
          this.alertService.danger('Machine niet gevonden');
          this.location.back();
          console.error(err);
        },
      })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSubmit(): void {
    if(this.machineId) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    const machine = this.machineForm.value as IMachine;

    this.machineService.create(machine, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    }).subscribe({
      next: () => {
        this.alertService.success('Machine succesvol aangemaakt');
        this.location.back();
      },
      error: (err) => {
        this.alertService.danger('Kan de machine niet aanmaken!');
        console.error(err);
      }
    })
  }

  update(): void {
    const machine = this.machineForm.value as IMachine;
    machine._id = this.machineId;

    this.machineService.update(machine, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    }).subscribe({
      next: () => {
        this.alertService.success('Machine succesvol aangepast');
        this.location.back();
      },
      error: (err) => {
        this.alertService.danger('Kan de machine niet aanpassen!');
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.location.back();
  }
}
