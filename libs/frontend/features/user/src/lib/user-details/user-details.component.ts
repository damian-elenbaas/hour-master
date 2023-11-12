import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser, Id } from '@hour-master/shared/api';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'hour-master-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  userId: Id | null = null;
  subscription: Subscription | null = null;
  user: IUser | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') as Id;

      this.subscription =
        this.userService
          .details(this.userId)
          .subscribe(
            (user) => {
              if (!user) {
                this.location.back();
                return;
              }

              this.user = user;
            },
            (error) => {
              console.error(error);
              this.location.back();
            }
          )
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
