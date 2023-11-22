import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthModule } from '@hour-master/frontend/auth';
import { UiModule } from '@hour-master/ui';
import { initFlowbite } from 'flowbite';

@Component({
  standalone: true,
  imports: [
    AuthModule,
    RouterModule,
    UiModule
  ],
  selector: 'hour-master-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Hour Master';

  ngOnInit(): void {
    initFlowbite();
  }
}
