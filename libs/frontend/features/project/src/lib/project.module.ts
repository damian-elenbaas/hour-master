import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ProjectListComponent,
    ProjectDetailsComponent,
    ProjectEditComponent
  ],
  exports: [
    ProjectListComponent,
    ProjectDetailsComponent,
    ProjectEditComponent
  ],
})
export class ProjectModule {}
