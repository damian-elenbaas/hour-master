import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IUser, Id } from '@hour-master/shared/api';
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
  user$!: Observable<IUser | null>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {

  }

  ngOnInit(): void {
    this.user$ = this.route.paramMap.pipe(
      tap((params: ParamMap) => console.log('user.id = ', params.get('id'))),
      switchMap((params: ParamMap) => {
        if (!params.get('id')) {
          return of(null);
        } else {
          return this.userService.details(params.get('id') as Id);
        }
      }),
      tap(console.log)
    )
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
