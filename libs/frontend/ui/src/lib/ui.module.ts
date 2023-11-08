import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarItemComponent } from './navbar/navbar-item/navbar-item.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NavbarComponent, NavbarItemComponent],
  exports: [NavbarComponent],
})
export class UiModule {}
