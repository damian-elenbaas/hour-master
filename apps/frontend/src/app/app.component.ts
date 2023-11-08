import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeaturesModule } from '@hour-master/frontend/features';

@Component({
  standalone: true,
  imports: [RouterModule, FeaturesModule],
  selector: 'hour-master-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
}
