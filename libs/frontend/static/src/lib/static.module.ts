import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

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
    HomeComponent,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AboutComponent
  ],
  exports: [
    AboutComponent,
    HomeComponent
  ],
})
export class StaticModule { }
