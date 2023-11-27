import { Component, OnDestroy, OnInit } from '@angular/core';
import { IHourScheme, Token, UserRole } from '@hour-master/shared/api';
import { Subscription, of, switchMap } from 'rxjs';
import { HourSchemeService } from '../hour-scheme.service';
import { Router } from '@angular/router';
import { AuthService } from '@hour-master/frontend/auth';
import { AlertService } from '@hour-master/frontend/common';

@Component({
  selector: 'hour-master-hour-scheme-list',
  templateUrl: './hour-scheme-list.component.html',
  styleUrls: ['./hour-scheme-list.component.scss'],
})
export class HourSchemeListComponent implements OnInit, OnDestroy {
  currentUser$ = this.authService.currentUser$;
  roles = UserRole;
  hourSchemes!: IHourScheme[];
  subscriptionList!: Subscription;
  loading = true;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly alertService: AlertService,
    private hourSchemeService: HourSchemeService
  ) { }

  ngOnInit(): void {
    this.subscriptionList = this.authService
      .currentUserToken$
      .pipe(
        switchMap((token: Token | null) => {
          if (!token) {
            this.alertService.danger('Je bent niet ingelogd!');
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            return this.hourSchemeService.list({
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
            });
          }
        })
      )
      .subscribe({
        next: (results) => {
          if (results) {
            this.hourSchemes = results;
          }
          this.loading = false;
        },
        error: () => {
          this.alertService.danger('Je hebt geen toegang tot deze pagina!');
          this.router.navigate(['']);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscriptionList) this.subscriptionList.unsubscribe();
  }
}
