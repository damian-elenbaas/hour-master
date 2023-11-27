import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UiModule } from '@hour-master/ui';
import { AuthModule } from '@hour-master/frontend/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert/alert.service';

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
];

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    RouterModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    UiModule,
  ],
  declarations: [HomeComponent, AboutComponent, LoginComponent, AlertComponent],
  exports: [AboutComponent, HomeComponent, LoginComponent, AlertComponent],
  providers: [AlertService]
})
export class CommonFrontendModule {}
