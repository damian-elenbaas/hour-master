import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeaturesModule } from '@hour-master/frontend/features';
import { UiModule } from '@hour-master/ui';

@Component({
  standalone: true,
  imports: [RouterModule, FeaturesModule, UiModule],
  selector: 'hour-master-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hour Master';
}
