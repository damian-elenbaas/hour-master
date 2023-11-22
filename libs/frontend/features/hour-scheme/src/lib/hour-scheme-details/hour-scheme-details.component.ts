import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IHourScheme, Id } from '@hour-master/shared/api';
import { HourSchemeService } from '../hour-scheme.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Modal } from 'flowbite';
import { AuthService } from '@hour-master/frontend/auth';

@Component({
  selector: 'hour-master-hour-scheme-details',
  templateUrl: './hour-scheme-details.component.html',
  styleUrls: ['./hour-scheme-details.component.scss'],
})
export class HourSchemeDetailsComponent implements OnInit, OnDestroy {
  hourSchemeId!: Id;
  hourScheme!: IHourScheme;
  subscriptionDetails!: Subscription;
  subscriptionAuth!: Subscription;
  popUpModal!: Modal;
  totalHours = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly hourSchemeService: HourSchemeService,
    private readonly authService: AuthService,
    private readonly router: Router,
    public location: Location
  ) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('popup-modal') as HTMLElement;
    this.popUpModal = new Modal(modalElement);

    this.subscriptionAuth = this.authService.currentUser$.subscribe((token) => {
      if (!token) {
        this.router.navigate(['/auth/login']);
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.hourSchemeId = params.get('id') as Id;
      this.subscriptionDetails = this.hourSchemeService
        .details(this.hourSchemeId)
        .subscribe((hourScheme) => {
          console.log('hourScheme', hourScheme);

          if (!hourScheme) return;

          this.hourScheme = hourScheme;
          this.totalHours = hourScheme?.rows?.reduce((acc, row) => {
            return acc + row.hours;
          }, 0) || 0;
        });
    })
  }

  ngOnDestroy(): void {
    if (this.subscriptionAuth) this.subscriptionAuth.unsubscribe();
    if (this.subscriptionDetails) this.subscriptionDetails.unsubscribe();
  }

  delete(): void {
    this.popUpModal.hide();
    this.hourSchemeService.delete(this.hourSchemeId as Id).subscribe(() => {
      this.location.back();
    });
  }
}
