import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '@hour-master/shared/api';
import { Subscription, of, switchMap } from 'rxjs';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from '@hour-master/frontend/auth';

@Component({
  selector: 'hour-master-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: IUser[] = [];
  subscriptionList!: Subscription;
  subscriptionAuth!: Subscription;
  loading = true;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.subscriptionList = this.authService
      .currentUserToken$
      .pipe(
        switchMap((token) => {
          if (!token) {
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            return this.userService.list({
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
            this.users = results;
            this.loading = false;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscriptionAuth) this.subscriptionAuth.unsubscribe();
    if (this.subscriptionList) this.subscriptionList.unsubscribe();
  }
}
