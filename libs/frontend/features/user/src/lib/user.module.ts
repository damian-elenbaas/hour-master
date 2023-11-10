import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UserListComponent
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
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [
    UserListComponent,
    UserDetailsComponent,
    UserEditComponent
  ],
  exports: [
    UserListComponent,
    UserDetailsComponent,
    UserEditComponent
  ]
})
export class UserModule {}
