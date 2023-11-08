import { Component } from '@angular/core';

@Component({
  selector: 'hour-master-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  showMainMenu = false;
  showUserMenu = false;

  toggleMainMenu(toggle?: boolean) {
    if(toggle !== undefined) {
      this.showMainMenu = toggle;
      return;
    }
    this.showMainMenu = !this.showMainMenu;
  }

  toggleUserMenu(toggle?: boolean) {
    if(toggle !== undefined) {
      this.showMainMenu = toggle;
      return;
    }
    this.showUserMenu = !this.showUserMenu;
  }
}
