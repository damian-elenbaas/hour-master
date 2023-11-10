import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HourSchemeListComponent } from './hour-scheme-list/hour-scheme-list.component';
import { HourSchemeDetailsComponent } from './hour-scheme-details/hour-scheme-details.component';
import { RouterModule, Routes } from '@angular/router';
import { HourSchemeService } from './hour-scheme.service';
import { HttpClientModule } from '@angular/common/http';
import { UiModule } from '@hour-master/ui';


const routes: Routes = [
  {
    path: ':id',
    pathMatch: 'full',
    component: HourSchemeDetailsComponent
  },
  {
    path: '',
    pathMatch: 'full',
    component: HourSchemeListComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    UiModule
  ],
  declarations: [
    HourSchemeListComponent,
    HourSchemeDetailsComponent
  ],
  providers: [
    HourSchemeService
  ],
  exports: [
    HourSchemeListComponent,
    HourSchemeDetailsComponent
  ]
})
export class HourSchemeModule {}
