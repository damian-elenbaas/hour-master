import { Component, Input } from '@angular/core';

@Component({
  selector: 'hour-master-dashboard-button',
  templateUrl: './dashboard-button.component.html',
  styleUrls: ['./dashboard-button.component.scss'],
})
export class DashboardButtonComponent {
  @Input() link!: string;
}
