import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@hour-master/frontend/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hour-master-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  subAuth!: Subscription;
  isLoggedIn = false;

  constructor(
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subAuth = this.authService.getUserTokenFromLocalStorage().subscribe((token) => {
      this.isLoggedIn = !!token;
    });
  }

  ngOnDestroy(): void {
    if(this.subAuth) this.subAuth.unsubscribe();
  }
}
