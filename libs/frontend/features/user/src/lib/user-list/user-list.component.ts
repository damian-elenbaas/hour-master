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
  users: IUser[] | null = null;
  subscription: Subscription | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.subscription = this.userService.list().subscribe((results) => {
      console.log(`results: ${results}`);
      this.users = results;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
