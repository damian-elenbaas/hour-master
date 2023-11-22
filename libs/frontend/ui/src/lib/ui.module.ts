import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarItemComponent } from './navbar/navbar-item/navbar-item.component';
import { NavbarItemDropdownComponent } from './navbar/navbar-item-dropdown/navbar-item-dropdown.component';
import { NavbarItemDropdownItemComponent } from './navbar/navbar-item-dropdown/navbar-item-dropdown-item/navbar-item-dropdown-item.component';
import { DashboardButtonComponent } from './dashboard-button/dashboard-button.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    NavbarComponent,
    NavbarItemComponent,
    NavbarItemDropdownComponent,
    NavbarItemDropdownItemComponent,
    DashboardButtonComponent,
    LoaderComponent
  ],
  exports: [
    NavbarComponent,
    DashboardButtonComponent,
    LoaderComponent
  ],
})
export class UiModule {}
