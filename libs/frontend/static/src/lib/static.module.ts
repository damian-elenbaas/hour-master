import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UiModule } from '@hour-master/ui';
import { AuthModule } from '@hour-master/frontend/auth';

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
    UiModule
  ],
  declarations: [
    HomeComponent,
    AboutComponent
  ],
  exports: [
    AboutComponent,
    HomeComponent
  ],
})
export class StaticModule { }
