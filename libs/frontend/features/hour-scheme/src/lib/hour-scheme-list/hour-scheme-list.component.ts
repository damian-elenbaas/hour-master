import { Component, OnDestroy, OnInit } from '@angular/core';
import { IHourScheme } from '@hour-master/shared/api';
import { Subscription } from 'rxjs';
import { HourSchemeService } from '../hour-scheme.service';
import { Router } from '@angular/router';
import { AuthService } from '@hour-master/frontend/auth';

@Component({
  selector: 'hour-master-hour-scheme-list',
  templateUrl: './hour-scheme-list.component.html',
  styleUrls: ['./hour-scheme-list.component.scss'],
})
export class HourSchemeListComponent implements OnInit, OnDestroy {
  hourSchemes!: IHourScheme[];
  subscriptionList!: Subscription;
  subscriptionAuth!: Subscription;
  loading = true;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private hourSchemeService: HourSchemeService) { }

  ngOnInit(): void {
    this.subscriptionAuth = this.authService.currentUserToken$.subscribe((token) => {
      if (!token) {
        this.router.navigate(['/auth/login']);
      }
    });

    this.subscriptionList = this.hourSchemeService.list().subscribe((results) => {
      console.log(`results: ${results}`);
      if(results) {
        this.hourSchemes = results;
      }
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionAuth) this.subscriptionAuth.unsubscribe();
    if (this.subscriptionList) this.subscriptionList.unsubscribe();
  }
}
