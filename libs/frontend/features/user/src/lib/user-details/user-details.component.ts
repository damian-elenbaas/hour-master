import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IUser, Id, UserRole } from '@hour-master/shared/api';
import { Observable, Subscription, of, switchMap, tap } from 'rxjs';
import { UserService } from '../user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'hour-master-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  subscription!: Subscription | null;
  user$!: Observable<IUser>;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.paramMap.pipe(
      tap(params => console.log(params)),
      switchMap((params: ParamMap) => {
        if (!params.get('id')) {
          return of({
            username: '',
            email: '',
            firstname: '',
            lastname: '',
            role: UserRole.NONE
          } as IUser);
        } else {
          return this.userService.details(params.get('id') as Id);
        }
      })
    ).subscribe({
      next: (user: IUser | null) => {
        if (!user) {
          this.location.back();
        }
        else {
          this.user$ = of(user);
          this.loading = false;
        }
      },
      error: (error) => {
        console.error(error);
        this.location.back();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
