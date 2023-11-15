import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@hour-master/ui';

@Component({
  standalone: true,
  imports: [UiModule, RouterModule],
  selector: 'hour-master-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
