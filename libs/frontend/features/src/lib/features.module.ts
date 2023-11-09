import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HourSchemeListComponent } from './hour-scheme/hour-scheme-list/hour-scheme-list.component';
import { HourSchemeDetailsComponent } from './hour-scheme/hour-scheme-details/hour-scheme-details.component';
import { HttpClientModule } from '@angular/common/http';
import { HourSchemeService } from './hour-scheme/hour-scheme.service';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'about',
    pathMatch: 'full',
    component: AboutComponent
  },
  {
    path: 'hour-scheme',
    pathMatch: 'full',
    component: HourSchemeListComponent
  },
  {
    path: 'hour-scheme/:id',
    pathMatch: 'full',
    component: HourSchemeDetailsComponent
  }
]

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule.forChild(routes)],
  declarations: [
    HourSchemeListComponent,
    HourSchemeDetailsComponent,
    AboutComponent,
  ],
  providers: [HourSchemeService],
  exports: [
    HourSchemeListComponent,
    HourSchemeDetailsComponent,
    AboutComponent
  ],
})
export class FeaturesModule {}
