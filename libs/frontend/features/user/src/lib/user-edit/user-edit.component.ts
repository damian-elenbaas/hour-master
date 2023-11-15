import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
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
  userId!: Id | null;
  user!: IUser;
  subscription!: Subscription | null;
  roles = UserRole;

  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    role: new FormControl(UserRole.NONE, Validators.required),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit(): void {
    this.subscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          if(!params.get('id')) {
            this.userId = null;
            return of(null);
          } else {
            this.userId = params.get('id') as Id;
            return this.userService.details(params.get('id') as Id);
          }
        })
      )
      .subscribe((user: IUser | null) => {
        if (user) {
          this.userForm.setValue({
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            password: 'not_used',
            passwordConfirm: 'not_used'
          });
        } else if (!this.userId) {
          this.userForm.setValue({
            username: '',
            email: '',
            firstname: '',
            lastname: '',
            role: UserRole.NONE,
            password: '',
            passwordConfirm: ''
          });
        } else {
          this.location.back();
        }
      }, (error) => {
        console.error(error);
        this.location.back();
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if(this.userId) {
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
    ).subscribe((success) => {
      if (success) {
        this.location.back();
      }
    }, (error) => {
      console.error(error);
    });
  }

  createUser(): void {
    if(this.userForm.value.password !== this.userForm.value.passwordConfirm) {
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
      .subscribe((user) => {
        if (user) {
          this.location.back();
        }
      }, (error) => {
        // TODO: show error
        console.error(error);
      });
  }

  onCancel(): void {
    this.location.back();
  }
}
