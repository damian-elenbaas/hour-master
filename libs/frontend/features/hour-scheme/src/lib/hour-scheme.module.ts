import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HourSchemeListComponent } from './hour-scheme-list/hour-scheme-list.component';
import { HourSchemeDetailsComponent } from './hour-scheme-details/hour-scheme-details.component';
import { RouterModule, Routes } from '@angular/router';
import { HourSchemeService } from './hour-scheme.service';
import { HttpClientModule } from '@angular/common/http';
import { UiModule } from '@hour-master/ui';
import { HourSchemeEditComponent } from './hour-scheme-edit/hour-scheme-edit.component';
import { CommonFrontendModule } from '@hour-master/frontend/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@hour-master/frontend/auth';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HourSchemeListComponent,
  },
  {
    path: 'new',
    pathMatch: 'full',
    component: HourSchemeEditComponent,
  },
  {
    path: ':id',
    pathMatch: 'full',
    component: HourSchemeDetailsComponent,
  },
  {
    path: ':id/edit',
    pathMatch: 'full',
    component: HourSchemeEditComponent,
  }
];

@NgModule({
  imports: [
    AuthModule,
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    UiModule,
    CommonFrontendModule,
    ReactiveFormsModule
  ],
  declarations: [
    HourSchemeListComponent,
    HourSchemeDetailsComponent,
    HourSchemeEditComponent,
  ],
  providers: [HourSchemeService],
  exports: [
    HourSchemeListComponent,
    HourSchemeDetailsComponent,
    HourSchemeEditComponent,
  ],
})
export class HourSchemeModule {}
