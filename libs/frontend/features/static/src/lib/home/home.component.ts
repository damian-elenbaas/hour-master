import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@hour-master/frontend/auth';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserRole } from '@hour-master/shared/api';
import { AlertService } from '@hour-master/frontend/common';

@Component({
  selector: 'hour-master-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  user$ = this.authService.currentUser$;
  roles = UserRole;

  constructor(
    private readonly alertService: AlertService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.sub = this.authService.currentUserToken$.subscribe((token) => {
      if(!token) {
        this.alertService.danger('Je bent niet ingelogd!');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

}
