import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { AuthModule, AuthService } from '@hour-master/frontend/auth';
import { CommonFrontendModule } from '@hour-master/frontend/common';
import { HourSchemeModule } from '@hour-master/frontend/features/hour-scheme';
import { UserModule } from '@hour-master/frontend/features/user';
import { Token } from '@hour-master/shared/api';
import { UiModule } from '@hour-master/ui';
import { initFlowbite } from 'flowbite';
import IsJwtTokenExpired from 'jwt-check-expiry';
import { of, switchMap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonFrontendModule,
    UserModule,
    HourSchemeModule,
    AuthModule,
    RouterModule,
    UiModule,
  ],
  selector: 'hour-master-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Hour Master';

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    initFlowbite();

    this.router.events
      .pipe(
        switchMap((event) => {
          if (event instanceof NavigationStart) {
            return this.authService.getUserTokenFromLocalStorage();
          }
          return of(null);
        })
      )
      .subscribe((token: Token | null) => {
        if (token) {
          const isExpired = IsJwtTokenExpired(token);
          if (isExpired) {
            this.authService.logout();
          }
        }
      });
  }
}
