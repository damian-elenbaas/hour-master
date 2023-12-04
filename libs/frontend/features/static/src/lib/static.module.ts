import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UiModule } from '@hour-master/ui';
import { LoginComponent } from './login/login.component';
import { AuthModule } from '@hour-master/frontend/auth';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, UiModule, AuthModule, ReactiveFormsModule],
  declarations: [HomeComponent, AboutComponent, LoginComponent],
  exports: [HomeComponent, AboutComponent, LoginComponent]
})
export class StaticModule { }
