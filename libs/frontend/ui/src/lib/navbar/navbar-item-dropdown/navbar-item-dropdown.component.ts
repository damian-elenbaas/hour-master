import { Component, Input } from '@angular/core';

@Component({
  selector: 'hour-master-navbar-item-dropdown',
  templateUrl: './navbar-item-dropdown.component.html',
  styleUrls: ['./navbar-item-dropdown.component.scss'],
})
export class NavbarItemDropdownComponent {
  @Input() label: string | null = null;
}
