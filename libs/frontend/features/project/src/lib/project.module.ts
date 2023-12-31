import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectService } from './project.service';
import { RouterModule } from '@angular/router';
import { UiModule } from '@hour-master/ui';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    UiModule
  ],
  declarations: [
    ProjectListComponent,
    ProjectDetailsComponent,
    ProjectEditComponent,
  ],
  providers: [ProjectService],
  exports: [
    ProjectListComponent,
    ProjectDetailsComponent,
    ProjectEditComponent,
  ],
})
export class ProjectModule {}
