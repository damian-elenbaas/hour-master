import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UiModule } from '@hour-master/ui';
import { AuthModule } from '@hour-master/frontend/auth';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'about',
    pathMatch: 'full',
    component: AboutComponent,
  },
  {
    path: 'auth/login',
    pathMatch: 'full',
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    RouterModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    UiModule
  ],
  declarations: [
    HomeComponent,
    AboutComponent,
    LoginComponent
  ],
  exports: [
    AboutComponent,
    HomeComponent,
    LoginComponent
  ],
})
export class StaticModule { }
