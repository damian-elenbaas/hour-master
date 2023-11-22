import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ICreateUser, IUpdateUser, IUser, Id, UserRole } from '@hour-master/shared/api';
import { Subscription, of, switchMap } from 'rxjs';
import { UserService } from '../user.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '@hour-master/frontend/auth';

@Component({
  selector: 'hour-master-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
  userId!: Id;
  user!: IUser;
  userForm!: FormGroup;
  subscriptionDetails!: Subscription;
  subscriptionAuth!: Subscription;
  roles = UserRole;
  loaded = false;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: [UserRole.NONE, Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {

    this.subscriptionAuth = this.authService.getUserTokenFromLocalStorage().subscribe((token) => {
      if (!token) {
        this.router.navigate(['/login']);
      }
    });

    this.subscriptionDetails = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          if (!params.get('id')) {
            return of(null);
          } else {
            this.userId = params.get('id') as Id;
            return this.userService.details(params.get('id') as Id);
          }
        })
      )
      .subscribe({
        next: (user: IUser | null) => {
          if (user) {
            this.userForm = this.fb.group({
              username: [user.username, Validators.required],
              email: [user.email, [Validators.required, Validators.email]],
              firstname: [user.firstname, Validators.required],
              lastname: [user.lastname, Validators.required],
              role: [user.role, Validators.required],
            });
          } else if (!user && this.userId) {
            this.location.back();
          }
          this.loaded = true;
        },
        error: (error) => {
          console.error(error);
          this.location.back();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscriptionAuth) this.subscriptionAuth.unsubscribe();
    if (this.subscriptionDetails) this.subscriptionDetails.unsubscribe();
  }

  onSubmit(): void {
    if (this.userId) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  updateUser(): void {
    if(!this.userForm.valid) return;

    const updateUser: IUpdateUser = {
      username: this.userForm.value.username as string,
      email: this.userForm.value.email as string,
      firstname: this.userForm.value.firstname as string,
      lastname: this.userForm.value.lastname as string,
      role: this.userForm.value.role as UserRole
    }

    this.userService.update(
      this.userId as Id,
      updateUser
    ).subscribe({
      next: (success) => {
        if (success) {
          this.location.back();
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  createUser(): void {
    if(!this.userForm.valid) return;

    const createUser: ICreateUser = {
      username: this.userForm.value.username as string,
      email: this.userForm.value.email as string,
      firstname: this.userForm.value.firstname as string,
      lastname: this.userForm.value.lastname as string,
      role: this.userForm.value.role as UserRole,
      password: this.userForm.value.password as string
    }

    this.userService.create(createUser)
      .subscribe({
        next: (user) => {
          if (user) {
            this.location.back();
          }
        },
        error: (error) => {
          // TODO: show error
          console.error(error);
        }
      });
  }

  onCancel(): void {
    this.location.back();
  }
}

const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const passwordConfirm = control.get('passwordConfirm');

  return password && passwordConfirm && password.value !== passwordConfirm.value
    ? { passwordMismatch: true }
    : null;
}
