import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IHourScheme, Id } from '@hour-master/shared/api';
import { HourSchemeService } from '../hour-scheme.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'hour-master-hour-scheme-details',
  templateUrl: './hour-scheme-details.component.html',
  styleUrls: ['./hour-scheme-details.component.scss'],
})
export class HourSchemeDetailsComponent implements OnInit {
  hourSchemeId: Id | null = null;
  hourScheme: IHourScheme | null = null;
  subscription: Subscription | null = null;
  totalHours = 0;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private hourSchemeService: HourSchemeService,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.hourSchemeId = params.get('id') as Id;
      this.subscription = this.hourSchemeService
        .details(this.hourSchemeId)
        .subscribe((hourScheme) => {
          console.log('hourScheme', hourScheme);
          this.hourScheme = hourScheme;
          this.totalHours = hourScheme?.rows?.reduce((acc, row) => {
            return acc + row.hours;
          }, 0) || 0;
          this.loading = false;
        });
    })
  }
}
