import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@hour-master/frontend/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hour-master-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sub!: Subscription;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService) { }

  ngOnInit(): void {
    this.sub = this.authService.getUserTokenFromLocalStorage().subscribe((token) => {
      if(token) {
        console.log(`token: ${token}`);
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  ngOnDestroy(): void {
    if(this.sub) this.sub.unsubscribe();
  }
}
