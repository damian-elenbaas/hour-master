import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IUser, Id, Token, UserRole } from '@hour-master/shared/api';
import { Observable, Subscription, of, switchMap, tap } from 'rxjs';
import { UserService } from '../user.service';
import { Location } from '@angular/common';
import { Modal } from 'flowbite';
import { AuthService } from '@hour-master/frontend/auth';

@Component({
  selector: 'hour-master-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  subscriptionDetails!: Subscription;
  subscriptionAuth!: Subscription;
  token!: Token;
  user$!: Observable<IUser>;
  popUpModal!: Modal;
  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    public location: Location
  ) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('popup-modal') as HTMLElement;
    this.popUpModal = new Modal(modalElement);

    this.subscriptionDetails =
      this.authService.getUserTokenFromLocalStorage()
      .pipe(
        switchMap((token) => {
          if (!token) {
            this.router.navigate(['/auth/login']);
            return of(null);
          } else {
            this.token = token;
            return this.route.paramMap;
          }
        })
      ).pipe(
        switchMap((params: ParamMap | null) => {
          if(!params) return of(null)

          if (!params.get('id')) {
            return of({
              username: '',
              email: '',
              firstname: '',
              lastname: '',
              role: UserRole.NONE
            } as IUser);
          } else {
            return this.userService.details(
              params.get('id') as Id,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.token
                }
              }
            );
          }
        })
      ).subscribe({
      next: (user: IUser | null) => {
        if (!user) {
          this.location.back();
        }
        else {
          this.user$ = of(user);
          this.loaded = true;
        }
      },
      error: (error) => {
        console.error(error);
        this.location.back();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionAuth) this.subscriptionAuth.unsubscribe();
    if (this.subscriptionDetails) this.subscriptionDetails.unsubscribe();
  }

  delete(): void {
    this.popUpModal.hide();
    this.user$.subscribe(user => {
      if (user) {
        this.userService.delete(user._id as Id).subscribe(() => {
          this.location.back();
        });
      }
    });
  }
}
