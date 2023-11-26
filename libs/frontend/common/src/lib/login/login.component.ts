import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Token } from '@hour-master/shared/api';
import { Router } from '@angular/router';
import { AuthService } from '@hour-master/frontend/auth';

@Component({
  selector: 'hour-master-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  sub!: Subscription;

  loaded = true;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.sub = this.authService
      .getUserTokenFromLocalStorage()
      .subscribe((token: Token | null) => {
        if (token) {
          this.router.navigate(['/']);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.loaded = false;
    this.authService.login(username, password)
      .subscribe({
      next: (token) => {
        this.loaded = true;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loaded = true;
        console.error(error);
      },
    });
  }
}
