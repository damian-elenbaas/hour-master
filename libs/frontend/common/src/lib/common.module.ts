import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert/alert.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [AlertComponent],
  exports: [AlertComponent],
  providers: [AlertService]
})
export class CommonFrontendModule {}
