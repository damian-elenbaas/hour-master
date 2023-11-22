import { Component, OnDestroy, OnInit } from '@angular/core';
import { IHourScheme, Token } from '@hour-master/shared/api';
import { Subscription, of, switchMap } from 'rxjs';
import { HourSchemeService } from '../hour-scheme.service';
import { Router } from '@angular/router';
import { AuthService } from '@hour-master/frontend/auth';

@Component({
  selector: 'hour-master-hour-scheme-list',
  templateUrl: './hour-scheme-list.component.html',
  styleUrls: ['./hour-scheme-list.component.scss'],
})
export class HourSchemeListComponent implements OnInit, OnDestroy {
  hourSchemes!: IHourScheme[];
  subscriptionList!: Subscription;
  loading = true;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private hourSchemeService: HourSchemeService) { }

  ngOnInit(): void {
    this.subscriptionList = this.authService.getUserTokenFromLocalStorage().pipe(
      switchMap((token: Token | null) => {
        if (!token) {
          this.router.navigate(['/auth/login']);
          return of(null);
        } else {
          return this.hourSchemeService.list({
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token
            }
          });
        }
      })
    ).subscribe((results) => {
      if (results) {
        this.hourSchemes = results;
      }
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionList) this.subscriptionList.unsubscribe();
  }
}
