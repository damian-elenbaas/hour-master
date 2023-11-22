import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Token } from '@hour-master/shared/api';
import { Router } from '@angular/router'

@Component({
  selector: 'hour-master-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;

  sub!: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.sub = this.authService
      .getUserTokenFromLocalStorage()
      .subscribe((token: Token) => {
        if (token) {
          this.router.navigate(['/']);
        }
      })
  }

  ngOnDestroy(): void {
    if(this.sub) this.sub.unsubscribe();
  }

  onSubmit(): void {
    if(this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.authService
      .login(username, password)
      .subscribe({
        next: (token) => {
          console.log(`token: ${token}`);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}
