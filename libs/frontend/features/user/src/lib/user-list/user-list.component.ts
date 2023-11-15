import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '@hour-master/shared/api';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'hour-master-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: IUser[] = [];
  subscription: Subscription | null = null;
  loading = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.subscription = this.userService
      .list()
      .subscribe((results) => {
      if(results) {
        this.users = results;
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
