import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineListComponent } from './machine-list/machine-list.component';
import { MachineDetailsComponent } from './machine-details/machine-details.component';
import { MachineEditComponent } from './machine-edit/machine-edit.component';
import { MachineService } from './machine.service';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MachineListComponent,
    MachineDetailsComponent,
    MachineEditComponent,
  ],
  providers: [MachineService],
  exports: [
    MachineListComponent,
    MachineDetailsComponent,
    MachineEditComponent,
  ],
})
export class MachineModule {}
