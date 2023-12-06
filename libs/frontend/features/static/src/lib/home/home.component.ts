import { Component } from '@angular/core';
import { AuthService } from '@hour-master/frontend/auth';
import { UserRole } from '@hour-master/shared/api';

@Component({
  selector: 'hour-master-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  user$ = this.authService.currentUser$;
  roles = UserRole;

  constructor(
    private readonly authService: AuthService,
  ) { }

}
