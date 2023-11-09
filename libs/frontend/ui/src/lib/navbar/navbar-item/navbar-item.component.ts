
import { Component, Input } from '@angular/core';
@Component({
  selector: 'hour-master-navbar-item',
  templateUrl: './navbar-item.component.html'
})
export class NavbarItemComponent {
  @Input() link: string | undefined;
  @Input() accent: boolean | undefined;
}
