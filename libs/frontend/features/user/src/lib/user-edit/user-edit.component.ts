import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ICreateUser, IUpdateUser, IUser, Id, UserRole } from '@hour-master/shared/api';
import { Subscription, of, switchMap } from 'rxjs';
import { UserService } from '../user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  standalone: true,
  selector: 'hour-master-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserEditComponent implements OnInit, OnDestroy {
  userId!: Id;
  user!: IUser;
  userForm!: FormGroup;
  subscription!: Subscription;
  roles = UserRole;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder) {

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: [UserRole.NONE, Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.subscription = this.route.paramMap
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
          }  else if(!user && this.userId) {
            this.location.back();
          }
        },
        error: (error) => {
          console.error(error);
          this.location.back();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.userId) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  updateUser(): void {
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
    if (this.userForm.value.password !== this.userForm.value.passwordConfirm) {
      console.error("Passwords do not match");
      // TODO: show error
      return;
    }

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
