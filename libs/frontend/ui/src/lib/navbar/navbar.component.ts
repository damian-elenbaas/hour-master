import { Component } from '@angular/core';
import { AuthService } from '@hour-master/frontend/auth';

@Component({
  selector: 'hour-master-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

  constructor(
    public readonly authService: AuthService
  ) { }
}
