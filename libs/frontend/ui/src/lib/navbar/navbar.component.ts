import { Component } from '@angular/core';
import { AuthService } from '@hour-master/frontend/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hour-master-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  sub!: Subscription;
  isLoggedIn: boolean = false;

  constructor(
    public readonly authService: AuthService
  ) {
    this.sub = this.authService
      .currentUser$
      .subscribe((user) => {
        console.log(user);
      });
  }
}
