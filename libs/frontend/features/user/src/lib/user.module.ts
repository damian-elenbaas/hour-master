import { AuthModule } from '@hour-master/frontend/auth';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { RouterModule, Routes } from '@angular/router';
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonFrontendModule } from '@hour-master/frontend/common';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UserListComponent
  },
  {
    path: 'new',
    pathMatch: 'full',
    component: UserEditComponent
  },
  {
    path: ':id',
    pathMatch: 'full',
    component: UserDetailsComponent
  },
  {
    path: ':id/edit',
    pathMatch: 'full',
    component: UserEditComponent
  }
]

@NgModule({
  imports: [
    AuthModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CommonFrontendModule
  ],
  declarations: [
    UserListComponent,
    UserDetailsComponent,
    UserEditComponent
  ],
  providers: [UserService],
  exports: [
    UserListComponent,
    UserDetailsComponent,
    UserEditComponent
  ]
})
export class UserModule {}
