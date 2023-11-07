import { Component, OnDestroy, OnInit } from '@angular/core';
import { IHourScheme } from '@hour-master/shared/api';
import { Subscription } from 'rxjs';
import { HourSchemeService } from '../hour-scheme.service';

@Component({
  selector: 'hour-master-hour-scheme-list',
  templateUrl: './hour-scheme-list.component.html',
  styleUrls: ['./hour-scheme-list.component.scss'],
})
export class HourSchemeListComponent implements OnInit, OnDestroy {
  hourSchemes: IHourScheme[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private hourSchemeService: HourSchemeService) { }

  ngOnInit(): void {
    this.subscription = this.hourSchemeService.list().subscribe((results) => {
      console.log(`results: ${results}`);
      this.hourSchemes = results;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
