import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@hour-master/frontend/auth';

@Component({
  selector: 'hour-master-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

  constructor(
    public readonly authService: AuthService,
    public readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
