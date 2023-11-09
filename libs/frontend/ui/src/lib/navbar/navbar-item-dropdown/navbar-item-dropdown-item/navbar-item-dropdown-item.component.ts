import { Component, Input } from '@angular/core';

@Component({
  selector: 'hour-master-navbar-item-dropdown-item',
  templateUrl: './navbar-item-dropdown-item.component.html',
  styleUrls: ['./navbar-item-dropdown-item.component.scss'],
})
export class NavbarItemDropdownItemComponent {
  @Input() link: string | null = null;
}
