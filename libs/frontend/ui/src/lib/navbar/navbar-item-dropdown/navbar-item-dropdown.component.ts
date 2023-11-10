import { Component, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hour-master-navbar-item-dropdown',
  templateUrl: './navbar-item-dropdown.component.html',
  styleUrls: ['./navbar-item-dropdown.component.scss'],
})
export class NavbarItemDropdownComponent /**implements OnInit **/ {
  @Input() label: string | null = null;
  // @Input() events: EventEmitter<void>[] = [];
  //
  // ngOnInit(): void {
  //   this.events.forEach((event) => {
  //     event.subscribe(() => {
  //
  //     });
  //   });
  // }
}
