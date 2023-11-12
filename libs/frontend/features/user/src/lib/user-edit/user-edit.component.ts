import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { ICreateUser, IUpdateUser, Id, UserRole } from '@hour-master/shared/api';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'hour-master-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserEditComponent implements OnInit, OnDestroy {
  userId: Id | null = null;
  subscription: Subscription | null = null;

  userForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    role: new FormControl(''),
    password: new FormControl(''),
    passwordConfirm: new FormControl('')
  });
  roles = UserRole;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') as Id;

      if(!this.userId) return;

      this.subscription =
        this.userService
          .details(this.userId)
          .subscribe(
            (user) => {
              if (!user) {
                this.location.back();
                return;
              }

              this.userForm.setValue({
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role.toString(),
                password: '',
                passwordConfirm: ''
              });
            },
            (error) => {
              console.error(error);
              this.location.back();
            }
          )
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSubmit(): void {
    console.log(this.userForm.value);

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
