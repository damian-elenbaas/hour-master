import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IHourScheme, Id } from '@hour-master/shared/api';
import { HourSchemeService } from '../hour-scheme.service';
import { Subscription, of, switchMap } from 'rxjs';
import { Location } from '@angular/common';
import { Modal } from 'flowbite';
import { AuthService } from '@hour-master/frontend/auth';
import { AlertService } from '@hour-master/frontend/common';

@Component({
  selector: 'hour-master-hour-scheme-details',
  templateUrl: './hour-scheme-details.component.html',
  styleUrls: ['./hour-scheme-details.component.scss'],
})
export class HourSchemeDetailsComponent implements OnInit, OnDestroy {
  hourSchemeId!: Id;
  hourScheme!: IHourScheme;
  subscriptionDetails!: Subscription;
  popUpModal!: Modal;
  token!: string;
  totalHours = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly hourSchemeService: HourSchemeService,
    private readonly authService: AuthService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    public location: Location
  ) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('popup-modal') as HTMLElement;
    this.popUpModal = new Modal(modalElement);

    this.subscriptionDetails = this.authService
      .currentUserToken$
      .pipe(
        switchMap((token) => {
          if (!token) {
            this.router.navigate(['/login']);
            return of(null);
          }
          this.token = token;
          return this.route.paramMap;
        })
      )
      .pipe(
        switchMap((params: ParamMap | null) => {
          if (!params || !params.get('id')) {
            return of(null);
          } else {
            this.hourSchemeId = params.get('id') as Id;
            return this.hourSchemeService.details(params.get('id') as Id, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
              },
            });
          }
        })
      )
      .subscribe({
        next: (hourScheme) => {
          console.log('hourScheme', hourScheme);

          if (!hourScheme) {
            this.alertService.danger('Urenschema niet gevonden!');
            this.router.navigate(['/hour-scheme']);
            return;
          }

          this.hourScheme = hourScheme;
          this.totalHours =
            hourScheme?.rows?.reduce((acc, row) => {
              return acc + row.hours;
            }, 0) || 0;
        },
        error: () => {
          this.alertService.danger('Urenschema niet gevonden!');
          this.router.navigate(['/hour-scheme']);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscriptionDetails) this.subscriptionDetails.unsubscribe();
  }

  delete(): void {
    this.popUpModal.hide();
    this.hourSchemeService.delete(this.hourSchemeId as Id).subscribe(() => {
      this.location.back();
    });
  }
}
